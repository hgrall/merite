"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function jamais(x) {
    throw new Error("* Erreur impossible : " + x);
}
exports.jamais = jamais;
function normalisationNombre(n, taille) {
    var r = n.toString();
    while (r.length < taille) {
        r = "0" + r;
    }
    return r;
}
exports.normalisationNombre = normalisationNombre;
//# sourceMappingURL=outils.js.map