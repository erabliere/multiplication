const couleurs = require('./couleurs.js')
const { demander, afficher, ligneVide, trait, delai } = require('./affichage.js')
const { formatter } = require('./nombres.js')
const { demanderStatistiques, envoyerDonnees } = require('./API.js')
const { epreuve, afficherOperationComplete } = require('./epreuve.js')

const { Tables, Operation } = require('./tables.js')
const tables = new Tables();


async function afficherMode(mode) {
  ligneVide()
  afficher(`MODE: ${mode.toUpperCase()}`, 'magenta')
  await delai(10, "Début de l'épreuve dans ~s~ seconde(s)")
  ligneVide()
}

(async function () {

  const chalkAnimation = await import('chalk-animation');

  const table = demander('Quelle table? (aucune réponse: toutes les tables)', true)
  const dureeEpreuveHasardMinutes = demander("Durée de l'épreuve (minutes)?", true)
  const nom = demander('Ton nom?')


  const dureeEpreuveHasardMillisecondes = dureeEpreuveHasardMinutes * 60 * 1000
  const debutEpreuve = new Date()
  let finEpreuve, tempsABattre

  //Statistiques
  const statistiques = {}

  statistiques['table'] = table
  statistiques['durée_épreuve'] = dureeEpreuveHasardMinutes
  statistiques['date_épreuve'] = debutEpreuve.toISOString()
  statistiques['nom'] = nom
  statistiques['brut'] = {}

  try {
    tempsABattre = await demanderStatistiques(nom, table)
  } catch (e) { }

  if (tempsABattre) {
    afficher(`Temps à battre pour la table de [${couleurs.magenta(table === 0 ? 'toutes les tables' : table)}]: ${couleurs.bleu(tempsABattre)} secondes (mode HASARD)`)
  }




  if (table) {
    //Ordonné, une seule fois
    await afficherMode('ordonné')
    tables.modeOrdonne()
    tables.selectionnerOperationsDeLaTable(table)
    epreuve(tables)


    //Au hasard, limitée dans le temps
    await afficherMode('hasard')
    tables.modeHasard()
    finEpreuve = (new Date()).getTime() + dureeEpreuveHasardMillisecondes
    condition = () => new Date().getTime() < finEpreuve
    repetition = 1
    epreuve(tables, Operation.MODES.HASARD, repetition, condition)

    //Quinze répétitions, mode ordonné
    //Opérations sélectionnées: toutes celles dont la moyenne est supérieure
    //à la moyenne générale pour la table
    await afficherMode('reprise')
    tables.selectionnerOperationsSuperieuresALaMoyenneOuErronees(table)
    tables.modeOrdonne()
    const nombreOperationsSelectionnes = tables.nombreOperationsSelectionnes()
    repetition = 15
    condition = compteurSelection => compteurSelection < nombreOperationsSelectionnes
    epreuve(tables, Operation.MODES.ORDONNE, repetition, condition)

    //Au hasard, limitée dans le temps
    await afficherMode('hasard')
    tables.selectionnerOperationsDeLaTable(table)
    tables.modeHasard()
    finEpreuve = (new Date()).getTime() + dureeEpreuveHasardMillisecondes
    condition = () => new Date().getTime() < finEpreuve
    repetition = 1
    epreuve(tables, Operation.MODES.HASARD, repetition, condition)

    //Pour les statistiques
    tables.selectionnerOperationsDeLaTable(table)

  } else {
    //Au hasard, toutes les tables
    await afficherMode('hasard, toutes les tables')
    tables.selectionnerToutesLesOperations()
    tables.modeHasard()
    finEpreuve = (new Date()).getTime() + dureeEpreuveHasardMillisecondes
    condition = () => new Date().getTime() < finEpreuve
    repetition = 1
    epreuve(tables, Operation.MODES.HASARD, repetition, condition)

    //Ordonné, tables à moyenne supérieure à la moyenne générale
    await afficherMode('reprise, opérations à moyenne plus élevée ou erronées')
    tables.selectionnerOperationsSuperieuresALaMoyenneOuErronees()
    tables.modeOrdonne()
    finEpreuve = (new Date()).getTime() + dureeEpreuveHasardMillisecondes
    condition = () => new Date().getTime() < finEpreuve
    repetition = 4
    epreuve(tables, Operation.MODES.HASARD, repetition, condition)

    //Au hasard, toutes les tables
    await afficherMode('hasard, toutes les tables')
    tables.selectionnerToutesLesOperations()
    tables.modeHasard()
    finEpreuve = (new Date()).getTime() + dureeEpreuveHasardMillisecondes
    condition = () => new Date().getTime() < finEpreuve
    repetition = 1
    epreuve(tables, Operation.MODES.HASARD, repetition, condition)

    //Ordonné, tables à moyenne supérieure à la moyenne générale
    await afficherMode('reprise, opérations à moyenne plus élevée ou erronées')
    tables.selectionnerOperationsSuperieuresALaMoyenneOuErronees()
    tables.modeOrdonne()
    finEpreuve = (new Date()).getTime() + dureeEpreuveHasardMillisecondes
    condition = () => new Date().getTime() < finEpreuve
    repetition = 4
    epreuve(tables, Operation.MODES.HASARD, repetition, condition)
    //Pour les statistiques
    tables.selectionnerToutesLesOperations()
  }

  statistiques['résultats'] = tables.resumeStatistique()

  /*   console.log(statistiques)
    console.log(' ')
    statistiques['brut'] = tables.statistiquesBrutes()
    console.log(JSON.stringify(statistiques.brut, null, 2)) */
  ligneVide()
  trait(38, '+')
  afficher('STATISTIQUES', 'magenta', 38)
  trait(38, '+')
  ligneVide()


  const moyenneFormatee = formatter(statistiques['résultats'].moyenne_globale)
  afficher(`Moyenne: ${moyenneFormatee} s.`)
  afficher(`Opérations à revoir:`)
  tables.selectionnerOperationsSuperieuresALaMoyenneOuErronees(table)
  while (operation = tables.operationSuivante()) {
    afficherOperationComplete(operation)
  }

  ligneVide()

  let after = () => true

  if (tempsABattre) {
    if (statistiques['résultats'].moyenne_globale < tempsABattre) {
      after = () => {
        ligneVide(2)
        chalkAnimation.default.rainbow(`RECORD BATTU!!  -->>  ${moyenneFormatee} < ${tempsABattre} !!`)
        return true
      }
    } else {
      after = () => {
        ligneVide(2)
        afficher(`Meilleure chance la prochaine fois...`)
        afficher("Le record n'a pas été battu")
        afficher(`${moyenneFormatee} >= ${tempsABattre} :-(`)
        return true
      }
    }
  }

  ligneVide(2)

  envoyerDonnees(statistiques, after)

})()
