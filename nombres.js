const round = require('lodash.round')

function _formatter(nombre, decimalPoints){
  return round(nombre, decimalPoints).toFixed(decimalPoints)
}

module.exports = {
  formatter(nombre, decimalPoints = 2) {
    return _formatter(nombre, decimalPoints)
  },
  formatterTemps(temps, ms = true) {
    return _formatter(ms ? temps / 1000 : temps, 2)
  }
}