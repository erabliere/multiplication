const couleurs = require('./couleurs.js')
const { demander, afficher, ligneVide, trait, delai } = require('./affichage.js')
const { formatter } = require('./nombres.js')
const { enregistrerDonnee, produireStatistiques } = require('./statistiques.js')
const { demanderStatistiques, envoyerDonnees } = require('./API.js')
const random = require('lodash.random')

const tables = require('./tables.js');

//const { sequence } = require('./epreuve.js');

(async function() {

  const table = demander('Quelle table? (aucune réponse: toutes les tables)', true)
  const dureeEpreuveMinutes = demander("Durée de l'épreuve (minutes)?", true)
  const nom = demander('Ton nom?')

  let tempsABattre
  let numTable
  let nombreDeQuestions = 0
  let sommeDuTemps = 0
  let moyenne = 0

  const lesDonnees = {}

  /*const lesDonnees = {
    sequence: undefined,
    hasard: undefined,
    reprise: undefined
  }*/

  try {
    tempsABattre = await demanderStatistiques(nom, table)
  } catch (e) { }

  if (tempsABattre) {
    afficher(`Temps à battre pour la table de [${couleurs.magenta(table === 0 ? 'toutes' : table)}]: ${couleurs.bleu(tempsABattre)} secondes`)
  }

  ligneVide(2)
  await delai(10, "Début de l'épreuve dans ~s~ seconde(s)")
  //sequence(table)
  ligneVide()

  /*if (table) {
    ligneVide(2)
    await delai(10, "Début de l'épreuve EN SÉQUENCE dans ~s~ seconde(s)")
    sequence(table)
    ligneVide()
  }*/

  /*return
 
  ligneVide(2)
  await delai(10, "Début de l'épreuve AU HASARD dans ~s~ seconde(s)")
  ligneVide()
 
  ligneVide(2)
  await delai(10, "Début de l'épreuve EN REPRISE dans ~s~ seconde(s)")
  ligneVide()*/

  const dureeEpreuveMillisecondes = dureeEpreuveMinutes * 60 * 1000
  const debutEpreuve = new Date()
  const finEpreuve = debutEpreuve.getTime() + dureeEpreuveMillisecondes


  const statistiques = {}

  statistiques['table'] = table
  statistiques['durée_épreuve'] = dureeEpreuveMinutes
  statistiques['date_épreuve'] = debutEpreuve.toISOString()
  statistiques['nom'] = nom
  statistiques['brut'] = {}

  while ((new Date()).getTime() <= finEpreuve) {
    numTable = table ? table - 2 : random(tables.length - 1)
    const hasard = random(tables[numTable].length - 1)
    const a = tables[numTable][hasard].a
    const b = tables[numTable][hasard].b
    const valeurVraie = tables[numTable][hasard].a_X_b
    const question = `${b} X ${a} =`
    const questionReponse = `${question} ${valeurVraie}`
    let reponse
    let debut, fin, temps, tempsFormatte

    trait(questionReponse.length)

    debut = new Date()
    reponse = demander(question, true)
    fin = new Date()

    temps = (fin - debut) / 1000

    if (valeurVraie !== reponse) {
      temps = 5 + temps //Pénalité de 5 secondes
    }

    enregistrerDonnee(a, b, temps, valeurVraie === reponse, lesDonnees)

    sommeDuTemps = sommeDuTemps + temps
    nombreDeQuestions++
    moyenne = sommeDuTemps / nombreDeQuestions

    tempsFormatte = couleurs.gris(formatter(temps) + ' s.')

    if (a * b === reponse) {
      afficher(questionReponse, 'vert')
    } else {
      afficher(questionReponse, 'rouge')
    }
    trait(questionReponse.length)

    if (tempsABattre) {
      if (moyenne < tempsABattre) {
        afficher(`${couleurs.vert('▼')}${tempsFormatte}`)
      } else if (moyenne > tempsABattre) {
        afficher(`${couleurs.rouge('▲')}${tempsFormatte}`)
      } else {
        afficher(tempsFormatte)
      }
    } else {
      if (moyenne > temps) {
        afficher(`${couleurs.vert('▼')}${tempsFormatte}`)
      } else if (moyenne < temps) {
        afficher(`${couleurs.rouge('▲')}${tempsFormatte}`)
      } else {
        afficher(tempsFormatte)
      }
    }

    ligneVide(2)

  }


  trait(38, '+')
  afficher('STATISTIQUES', 'magenta', 38)
  trait(38, '+')
  ligneVide()
  afficher('Les statistiques par opération vont de', 'gris')
  afficher('la moyenne de temps la meilleure à', 'gris')
  afficher('la moyenne de temps la plus lente', 'gris')
  ligneVide()

  statistiques['brut'] = lesDonnees

  statistiques['résultats'] = produireStatistiques(lesDonnees, debutEpreuve, new Date())

  afficher(JSON.stringify(statistiques['résultats'], null, 2))

  envoyerDonnees(statistiques)

})()
