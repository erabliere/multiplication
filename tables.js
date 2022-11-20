const random = require('lodash.random')
const stats = require('./statistiques.js')

class Operation {
  #table
  #facteur
  #statistiques
  #tempsDemarrage
  static MODES = Object.freeze({
    ORDONNE: 'ordonne',
    HASARD: 'hasard'
  })
  constructor(table, facteur) {
    this.#table = table
    this.#facteur = facteur
    this.#statistiques = []
  }
  table() {
    return this.#table
  }
  facteur() {
    return this.#facteur
  }
  demarrerChrono() {
    this.#tempsDemarrage = (new Date()).getTime()
  }
  arreterChrono(reponse, mode = Operation.MODES.ORDONNE, donneesSupplementaires) {

    if (!this.#tempsDemarrage) console.warn("Le chrono n'a pas été démarré!")

    const temps = (new Date()).getTime() - this.#tempsDemarrage
    const statistique = { duree: temps, succes: reponse === this.produit(), mode: mode }

    if (donneesSupplementaires) {
      statistique['d'] = donneesSupplementaires
    }

    this.#statistiques.push(statistique)

    this.#tempsDemarrage = null
  }
  produit() {
    return this.#table * this.#facteur
  }
  duree() {
    if (this.#statistiques.length === 0) return undefined
    return this.#statistiques[this.#statistiques.length - 1].duree
  }
  succes() {
    if (this.#statistiques.length === 0) return undefined
    return this.#statistiques[this.#statistiques.length - 1].succes
  }
  statistiquesDuree(mode) {
    return this.#statistiques.filter(datum => datum.mode === mode).map(datum => datum.duree)
  }
  statistiques(mode) {
    const condition = mode ? datum => datum.mode === mode : datum => true
    return this.#statistiques.filter(datum => condition(datum))
  }
  comporteUneErreur(mode) {
    const condition = mode ? datum => datum.mode === mode : datum => true
    return this.#statistiques.filter(datum => condition(datum)).some(datum => !datum.succes)
  }
  nombreErreurs(mode) {
    const condition = mode ? datum => datum.mode === mode : datum => true
    return this.#statistiques.filter(datum => condition(datum)).reduce((sum, datum) => sum + (!datum.succes ? 1 : 0), 0)
  }
}


class Tables {
  #tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  #facteurs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  #operations
  #operationCourante
  #init = true
  #auHasard = false
  constructor() {
    this.#construireTableOperations()
    this.#operationCourante = this.#operations[0]
  }
  #construireTableOperations(select = false) {
    this.#operations = this.#tables.map(table => this.#facteurs.map(facteur => [new Operation(table, facteur), select])).flat()
  }
  #isSelected(operation) {
    return operation ? operation[1] : null
  }
  #select(operation) {
    if (operation) {
      operation[1] = true
    }
  }
  #deselect(operation) {
    if (operation) {
      operation[1] = false
    }
  }
  #getOperation(operation) {
    return operation ? operation[0] : null
  }
  #getIndexOperationCourante() {
    return this.#operations.findIndex(operation => this.#operationCourante === operation)
  }
  #getOperationSuivante() {
    const indexOperationCourante = this.#getIndexOperationCourante()
    let operation, operations
    if (this.#auHasard) {
      operations = this.#operations.filter(operation => this.#isSelected(operation))
      operation = operations[random(operations.length - 1)]
    } else {
      operation = this.#operations.find((operation, index) => index > indexOperationCourante && this.#isSelected(operation))
    }
    return operation
  }
  #getPremiereOperation() {
    const operations = this.#operations.filter(operation => this.#isSelected(operation))
    let operation
    if (this.#auHasard) {
      operation = operations[random(operations.length - 1)]
    } else {
      operation = operations[0]
    }
    return operation
  }
  #getOperationsSelectionnees() {
    return this.#operations.filter(operation => this.#isSelected(operation))
  }
  #selectionnerOperationsSelonCriteres(criteres = [operation => true]) {
    criteres = Array.isArray(criteres) ? criteres : [criteres]
    this.#operations.map(operation => {
      const choisie = criteres.reduce((choisie, critere) => critere(this.#getOperation(operation)) && choisie, true)
      if (choisie) {
        this.#select(operation)
      } else {
        this.#deselect(operation)
      }
    })
    this.#auHasard = false
    this.#init = true
  }

  operationSuivante() {
    const operation = this.#init ? this.#getPremiereOperation() : this.#getOperationSuivante()
    this.#init = !operation
    this.#operationCourante = operation
    return this.#getOperation(operation)
  }
  selectionnerToutesLesOperations() {
    this.#operations.map(operation => this.#select(operation))
    this.#init = true
    this.#auHasard = false
  }
  deselectionnerToutesLesOperations() {
    this.#operations.map(operation => this.#deselect(operation))
    this.#init = true
    this.#auHasard = false
  }
  selectionnerOperationsDeLaTable(table) {
    this.#selectionnerOperationsSelonCriteres(operation => operation.table() === table)
  }
  selectionnerOperationsSuperieuresALaMoyenneOuErronees(table, mode = Operation.MODES.HASARD) {
    let conditionSelectionParTable
    if (table) {
      this.selectionnerOperationsDeLaTable(table)
      conditionSelectionParTable = operation => operation.table() === table
    } else {
      conditionSelectionParTable = () => true
      this.selectionnerToutesLesOperations()
    }

    const moyenneTable = this.moyenneDuree(mode)
    this.#selectionnerOperationsSelonCriteres([
      conditionSelectionParTable,
      operation => stats.moyenne(operation.statistiquesDuree(mode)) >= moyenneTable || operation.comporteUneErreur(mode)
    ])
  }
  nombreOperationsSelectionnes() {
    return this.#getOperationsSelectionnees().length
  }
  modeOrdonne() {
    this.#auHasard = false
    this.#init = true
  }
  modeHasard() {
    this.#auHasard = true
    this.#init = true
  }

  /**
   * STATISTIQUES
  */
  moyenneDuree(mode = Operation.MODES.ORDONNE) {
    return stats.moyenne(this.#getOperationsSelectionnees().map(operation => this.#getOperation(operation).statistiquesDuree(mode)).flat())
  }
  minDuree(mode = Operation.MODES.ORDONNE) {
    return stats.min(this.#getOperationsSelectionnees().map(operation => this.#getOperation(operation).statistiquesDuree(mode)).flat())
  }
  maxDuree(mode = Operation.MODES.ORDONNE) {
    return stats.max(this.#getOperationsSelectionnees().map(operation => this.#getOperation(operation).statistiquesDuree(mode)).flat())
  }
  nombreErreurs(mode = Operation.MODES.ORDONNE) {
    return this.#getOperationsSelectionnees().reduce((sum, operation) => this.#getOperation(operation).nombreErreurs(mode) + sum, 0)
  }
  resumeStatistique(secondes = true) {
    const moyenneMS = this.moyenneDuree(Operation.MODES.HASARD)
    return {
      moyenne_globale: secondes ? moyenneMS / 1000 : moyenneMS,
      nombre_total_d_erreurs: this.nombreErreurs(Operation.MODES.HASARD)
    }
  }
  statistiquesBrutes() {
    return this.#getOperationsSelectionnees().reduce(
      (stats, operation) => {
        const _operation = this.#getOperation(operation)
        const data = _operation.statistiques()
        if (data.length) {
          stats.push(
            {
              table: _operation.table(),
              facteur: _operation.facteur(),
              data: data
            }
          )
        }
        return stats
      }, [])
  }
}

module.exports = {
  Tables: Tables,
  Operation: Operation
}

