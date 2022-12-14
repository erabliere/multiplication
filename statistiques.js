const { formatter } = require('./nombres.js')

module.exports = {

  enregistrerDonnee(b, a, temps, succes, lesDonnees) {
    lesDonnees[a + '_X_' + b] = Array.isArray(lesDonnees[a + '_X_' + b]) ? lesDonnees[a + '_X_' + b] : []
    lesDonnees[a + '_X_' + b].push({ temps: temps, succes: succes })
  },
  produireStatistiques(lesDonnees) {
    const keys = Object.keys(lesDonnees)
    const len = keys.length
    const statistiques = []
    let i = 0, nombreDeQuestions = 0, succes = 0, totalSucces = 0, temps = 0, tempsTotal = 0

    for (i; i < len; i++) {
      nombreDeQuestions = nombreDeQuestions + lesDonnees[keys[i]].length
      temps = lesDonnees[keys[i]].reduce((somme, donnee) => somme + donnee.temps, 0)
      tempsTotal = tempsTotal + temps
      succes = lesDonnees[keys[i]].reduce((somme, donnee) => somme + (donnee.succes ? 1 : 0), 0)
      totalSucces = totalSucces + succes
      statistiques.push({
        operation: keys[i],
        succes: succes,
        erreurs: lesDonnees[keys[i]].length - succes,
        pourcentage: succes / lesDonnees[keys[i]].length * 100,
        moyenne: temps / lesDonnees[keys[i]].length,
        min: lesDonnees[keys[i]].reduce((min, donnee) => donnee.temps <= min ? donnee.temps : min, Infinity),
        max: lesDonnees[keys[i]].reduce((max, donnee) => donnee.temps >= max ? donnee.temps : max, 0)
      })
    }
    statistiques.sort((a, b) => a.moyenne - b.moyenne)
    return {
      nombre_de_questions: nombreDeQuestions,
      nombre_total_de_succes: totalSucces,
      nombre_total_d_erreurs: nombreDeQuestions - totalSucces,
      pourcentage_global: formatter(totalSucces / nombreDeQuestions * 100, 0),
      temps_total: formatter(tempsTotal),
      moyenne_globale: formatter(tempsTotal / nombreDeQuestions),
      statistiques_par_operation: statistiques.map(op => {
        op.pourcentage = formatter(op.pourcentage, 0)
        op.moyenne = formatter(op.moyenne)
        op.min = formatter(op.min)
        op.max = formatter(op.max)
        return op
      }),
    };
  }
}