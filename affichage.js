const prompt = require('prompt-sync')()
const couleurs = require('./couleurs.js')

function _aUnCodeDeCouleur(texte) {
  //return texte.search(/033\[0;[0-9]{2}m/gm) > -1
  return texte.search(/\[0;[0-9]{2}m/gm) > -1
}

function _afficher(message) {
  console.log(message)
}

function _trait(nombreDeCaracteres, caractere, couleur) {
  let trait = caractere.repeat(nombreDeCaracteres)
  trait = couleur === 'blanc' ? trait : couleurs[couleur](message)
  return trait
}

function _justifier(texte, longueurLigne) {
  const longueurTexte = _aUnCodeDeCouleur(texte) ? texte.length - 11 : texte.length
  const difference = longueurLigne - longueurTexte >= 0 ? longueurLigne - longueurTexte : 0
  const longueurDebutDeLigne = Math.floor(difference / 2)
  return `${' '.repeat(longueurDebutDeLigne)}${texte}`
}

function _ligneVide(nombreDeLignes) {
  return `
  `.repeat(nombreDeLignes)
}

module.exports = {
  demander(question, estNumerique = false) {
    const reponse = prompt(question + ' ')
    return estNumerique ? reponse * 1 : reponse
  },
  async delai(secondes = 3, message = 'Attente: ~s~ secondes') {

    let count = secondes + 1

    function printMessage(resolve) {

      if (count === 0) return resolve()

      const id = setInterval(() => {
        count--
        process.stdout.write(message.replace('~s~', count) + "\r")
        if (count === 0) {
          clearInterval(id)
          return resolve()
        }

      }, 1000)
    }
    return new Promise(resolve => printMessage(resolve));
  },
  afficher(message, couleur = 'blanc', longueurLigne = 0) {
    message = message + ''
    message = couleur === 'blanc' ? message : couleurs[couleur](message)
    _afficher(_justifier(message, longueurLigne))
  },
  ligneVide(nombreDeLignes = 1) {
    _afficher(_ligneVide(nombreDeLignes))
  },
  trait(nombreDeCaracteres = 8, caractere = '-', couleur = 'blanc') {
    _afficher(_trait(nombreDeCaracteres, caractere, couleur))
  }
}