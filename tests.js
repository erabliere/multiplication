
const {formatterTemps} = require('./nombres')

console.log(formatterTemps(1234))

return

const { Tables } = require('./tables.js')

const tables = new Tables()

console.log('SELECTION TOUTES')
tables.selectionnerToutesLesOperations()
while (operation = tables.operationSuivante()) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
}
console.log('FIN SELECTION TOUTES')

console.log('SELECTION TOUTES BIS')
while (operation = tables.operationSuivante()) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
}
console.log('FIN SELECTION TOUTES BIS')

console.log('DESELECTION')
tables.deselectionnerToutesLesOperations()
while (operation = tables.operationSuivante()) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
}
console.log('FIN DESELECTION')

console.log('CRITERES')
tables.selectionnerOperationsSelonCriteres(operation => [2, 3, 4].includes(operation.table()) && [10].includes(operation.facteur()))
while (operation = tables.operationSuivante()) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
}
console.log('FIN CRITERES')

console.log('CRITERES AU HASARD')
tables.selectionnerOperationsSelonCriteres(operation => [2, 3, 4].includes(operation.table()) && [10].includes(operation.facteur()))
tables.modeHasard()
let i = 0
while ((operation = tables.operationSuivante()) && i < 10) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
    i++
}
console.log('FIN CRITERES AU HASARD')
console.log('CRITERES AU HASARD BIS')
i = 0
while ((operation = tables.operationSuivante()) && i < 10) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
    i++
}
console.log('FIN CRITERES AU HASARD BIS')
console.log('CRITERES ORDONNE')
tables.modeOrdonne()
while (operation = tables.operationSuivante()) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
}
console.log('FIN CRITERES ORDONNE')
console.log('CRITERES ORDONNE BIS')
i = 0
tables.selectionnerToutesLesOperations()
while (operation = tables.operationSuivante()) {
    operation.demarrerChrono()
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
    operation.arreterChrono(30, { mode: 'ordre' })
    i++
}
console.log('FIN CRITERES ORDONNE BIS')

console.log('MODE HASARD')
tables.modeHasard()
i = 0
while ((operation = tables.operationSuivante()) && i < 400) {
    operation.demarrerChrono()
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
    operation.arreterChrono(40, { mode: 'hasard' })
    console.log(i)
    i++
}
console.log('FIN MODE HASARD')

console.log('CRITERES STATISTIQUES')
tables.selectionnerToutesLesOperations()
while (operation = tables.operationSuivante()) {
    console.log(`${operation.table()} X ${operation.facteur()} = ${operation.produit()}`)
    console.log(operation.statistiques())
}
console.log('FIN CRITERES STATISTIQUES')
