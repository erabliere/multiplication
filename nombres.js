const round = require('lodash.round')

module.exports = {
  formatter(nombre, decimalPoints = 2) {
    return round(nombre, decimalPoints).toFixed(decimalPoints)
  }
}