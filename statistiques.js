const statsBase = require('@stdlib/stats/base')
const ranks = require('@stdlib/stats/ranks')

function moyenne(arr = []) {
  return statsBase.mean(arr.length, arr, 1)
}
function mediane(arr = []) {
  arr.sort()
  return statsBase.mediansorted(arr.length, arr, 1)
}
function min(arr = []) {
  return statsBase.min(arr.length, arr, 1)
}
function max(arr = []) {
  return statsBase.max(arr.length, arr, 1)
}
function populationEcartType(arr = []) {
  return statsBase.stdev(arr.length, 0, arr, 1)
}
function echantillonEcartType(arr = []) {
  return statsBase.stdev(arr.length, 1, arr, 1)
}
function populationVariance(arr = []) {
  return statsBase.variance(arr.length, 0, arr, 1)
}
function echantillonVariance(arr = []) {
  return statsBase.variance(arr.length, 1, arr, 1)
}
/* function quantiles(arr = []){
  return ranks(arr)
} */


module.exports = {
  moyenne: moyenne,
  min: min,
  max: max
}