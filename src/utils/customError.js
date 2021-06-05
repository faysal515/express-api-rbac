class AppError extends Error {
  constructor(code, category, message) {
    super(message)
    this.code = code
    this.category = category
  }
}

module.exports = AppError