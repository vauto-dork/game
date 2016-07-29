// bundle.config.js 
module.exports = {
  bundle: {
    shared: {
      scripts: [
        './generated/shared/models/*.js',
        './generated/shared/services/*.js',
        './generated/shared/directives/*.js',
        './generated/shared/modules/*.js'
      ]
    }
  }
};