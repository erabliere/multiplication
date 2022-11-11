//const { enregistrerDonnee } = require('./statistiques.js')
const { demander, afficher, ligneVide, trait, delai } = require('./affichage.js')
//const random = require('lodash.random')

const now = (new Date()).getTime()

function _buildOps(tablesRangeStart = 2, tablesRangeEnd = 12, opsRangeStart = 1, opsRangeEnd = 12) {
  const ops = [...Array(opsRangeEnd - opsRangeStart + 1).keys()].map(x => x + opsRangeStart)
  const tables = [...Array(tablesRangeEnd - tablesRangeStart + 1).keys()].map(x => x + tablesRangeStart)
  return tables.map(table => ({ table: table, ops: ops.map(op => ({ op_1: table, op_2: op })) }))
}

function _finDeListe() {
  return () => true
}

function _temps(data = { duree: 2 }, condition = data => now + data.duree * 60 * 1000 <= now) {
  return () => _stop(data, condition)
}

function _stop(data = {}, condition = () => false) {
  return condition(data)
}

function _run(tables = []/*, stop = _temps, options = { hasard: false }*/) {

  /*while (!stop()) {

  }*/
  return tables.reduce((donnees, table) => {

    //return table.ops.reduce()
    const question = `${op.} X ${a} =`
    const questionReponse = `${question} ${valeurVraie}`

    const debut = new Date()
    reponse = demander(question, true)
    const fin = new Date()
    const temps = (fin - debut) / 1000
    return donnees
  }, {})

}

module.exports = {
  sequence: (table) => _run(_buildOps(table, table, 1, 12)),
  hasard: (tables, ops, duree) => _run(tables, _temps({ duree: duree }), { hasard: true }),
  reprise: (tables, ops) => _run(tables, ops, _finDeListe),
  ops: (s_t, e_t, s_o, e_o) => _buildOps(s_t, e_t, s_o, e_o)
}