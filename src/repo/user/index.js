const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('@src/models/user')
class UserRepo {
  constructor(model) {
    this.model = model
  }

  async createUser(username, password, role) {
    const hash = await bcrypt.hash(password, 10) // salt round 10
    
    const newUser = new User({ username, password: hash, role })
    return newUser.save()
  }
}

module.exports = new UserRepo(User)
