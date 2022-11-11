require('dotenv').config({ path: './node_modules/.urls' })
const axios = require('axios')
const { afficher } = require('./affichage.js')

const url = process.env['URL']

module.exports = {
  envoyerDonnees(data) {
    axios.post(url, data)
      .then(function(response) {
        if (response.data.status === 'ok') {
          afficher(response.data.message, 'vert')
        } else {
          afficher("ERREUR: Les données n'ont pu être enregistrées dans le chiffrier", 'rouge')
          afficher(`Message d'erreur: ${response.data.message}`, 'rouge')
        }
      })
      .catch(function(error) {
        afficher("ERREUR: Les données n'ont pu être enregistrées dans le chiffrier", 'rouge')
        afficher(`Message d'erreur: ${error}`, 'rouge')
      });
  },
  async demanderStatistiques(nom, table) {
    const resp = await axios.get(url, { params: { nom: nom, table: table } })
    return resp.data.status === 'ok' ? resp.data.temps_minimal : false
  }
}

