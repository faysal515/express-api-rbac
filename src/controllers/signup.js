const Joi = require('joi')
const userRepo = require('@src/repo/user')
const logger = require('@src/logger')('SignupHandler')
const { wrapJWTSign, SuccessResponse, ErrorResponse, processValidationError } = require('@src/utils/common')
const errorCodes = require('@src/utils/errorCodes')

const schema = Joi.object({
  username: Joi.string(),
  password: Joi.string(),
  role: Joi.string().valid('admin', 'customer')
}).options({ presence: 'required', abortEarly : false })

const SignupHandler = async (user, body) => {
  try {
    const { error, value } = schema.validate(body)
    if (error) return ErrorResponse(400, errorCodes.VALIDATION_ERROR, processValidationError(error), error)


    const { username, password, role } = body
    const newUser = await userRepo.createUser(username, password, role)
    logger.info('New user Registered', newUser._doc)

    const token = await wrapJWTSign({ _id: newUser._doc._id, username, role }, process.env.JWT_SECRET, { expiresIn: '15d' })
    return SuccessResponse({ token })
    
  } catch (e) {
    return ErrorResponse(400, errorCodes.RUNTIME_ERROR, e.message)
  }
}

module.exports = SignupHandler