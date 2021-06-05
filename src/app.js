require('@src/mongo')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('@src/logger')('HttpLogger')
const { SignupRoute, LoginRoute, RegisterUsingAdmin } = require('@src/routes/user')
const { ErrorResponse, returnJSON } = require('@src/utils/common')
const ErrorCodes = require('@src/utils/errorCodes')
const jwt = require('jsonwebtoken')
const AppError = require('@src/utils/customError')


const app = express()

const publicUrls = [
  '/signup',
  '/login',
]


const authorizeHeader = async (req, res, next) => {
  try {
    const { originalUrl } = req
    if(publicUrls.indexOf(originalUrl) >= 0) return next()
    if(!req.headers['authorization']) return next(new AppError(401, ErrorCodes.PERMISSION_DENIED ,'Authorization Required'))
    const user = jwt.verify(req.headers['authorization'], process.env.JWT_SECRET)
    req.user = user
    next()

  } catch(e) {
    next(e)
  }
}

const permit = (allowed) => {
  const isAllowed = role => allowed.indexOf(role) > -1;

  // return a middleware
  return (request, response, next) => {
    if (request.user && isAllowed(request.user.role))
      next(); // role is allowed, so continue on the next middleware
    else {
      return returnJSON(request, response, ErrorResponse(401, ErrorCodes.PERMISSION_DENIED, 'NOT ALLOWED TO EXECUTE'))
    }
  }
}

app.use(bodyParser.json())
app.use(authorizeHeader)

app.use((req, res, next) => {
  logger.info('Input', req.body)
  next()
})

app.use('/register-using-admin', permit(['admin']))


app.post('/signup', SignupRoute)
app.post('/register-using-admin', RegisterUsingAdmin)
app.post('/login', LoginRoute)

app.use((err, req, res, next) => {
  console.log(err)
  if(err instanceof AppError) {
    return res.status(err.code).json(ErrorResponse(err.code, err.category, err.message))
  }
  res.status(500).json(ErrorResponse(500, ErrorCodes.UNKNOWN_ERROR, 'Something broke!'))
})


module.exports = app