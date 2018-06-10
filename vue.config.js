const fs = require('fs')

module.exports = {
  // Paths
  baseUrl: './',
  outputDir: 'docs',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "bootstrap/scss/bootstrap.scss";`,
      }
    }
  }
}