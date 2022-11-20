
const { demander, afficher, ligneVide, trait, delai } = require('./affichage.js')

const { Operation } = require('./tables.js')
const couleurs = require('./couleurs.js')
const { formatterTemps } = require('./nombres.js')

function _construireChaine(operation, avecReponse = 'true') {
  return `${operation.table()} X ${operation.facteur()} =` + (avecReponse ? ` ${operation.produit()}` : '')
}

module.exports = {
  epreuve(tables, mode = Operation.MODES.ORDONNE, nombreRepetitions = 1, condition = () => true) {
    let operation, compteurRepetitions = 0, compteurSelection = 0, moyenne, duree
    while ((operation = tables.operationSuivante()) && condition(compteurSelection)) {
      for (compteurRepetitions; compteurRepetitions < nombreRepetitions; compteurRepetitions++) {
        const question = `${operation.table()} X ${operation.facteur()} =`
        const questionReponse = `${question} ${operation.produit()}`

        trait(questionReponse.length)

        operation.demarrerChrono()
        reponse = demander(question, true)
        operation.arreterChrono(reponse, mode)

        if (operation.succes()) {
          afficher(questionReponse, 'vert')
        } else {
          afficher(questionReponse, 'rouge')
        }

        duree = operation.duree()
        moyenne = tables.moyenneDuree(mode)

        tempsFormatte = couleurs.gris(formatterTemps(duree) + ' s.')

        if (moyenne > duree) {
          afficher(`${couleurs.vert('▼')}${tempsFormatte}`)
        } else if (moyenne < duree) {
          afficher(`${couleurs.rouge('▲')}${tempsFormatte}`)
        } else {
          afficher(tempsFormatte)
        }
        trait(questionReponse.length)
      }
      compteurRepetitions = 0
      compteurSelection++
    }
  },
  afficherOperationComplete(operation){
    afficher(_construireChaine(operation))
  }
}