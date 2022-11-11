
const codesCouleurs = {
  noir: 30,
  rouge: 31,
  vert: 32,
  jaune: 33,
  bleu: 34,
  magenta: 35,
  cyan: 36,
  gris: 90,
  grisClair: 37,
  rougeClair: 91,
  vertClair: 92,
  jauneClair: 93,
  bleuClair: 94,
  magentaClair: 95,
  cyanClair: 96,
  blanc: 97
}

function _colorer(texte, couleur) {
  const code = codesCouleurs[couleur]
  const prefixe = '\033[0;' + code + 'm'
  const postfixe = '\033[0m'
  const colore = `${prefixe}${texte}${postfixe}`
  return code ? colore : texte
}

/**
* Pour créer les fonctions colorant le texte dans la console.
* Le nom des fonctions correspond aux clefs des codes de couleurs
* de la constante codesCouleurs
*/
function _creerFonctions(listeDeCodes = codesCouleurs) {
  const couleurs = Object.keys(listeDeCodes)
  const fonctions = couleurs.reduce(
    (fonctions, couleur) => {
      fonctions[couleur] = texte => _colorer(texte, `${couleur}`)
      return fonctions
    },
    {}
  )
  return fonctions;
}

module.exports = _creerFonctions()