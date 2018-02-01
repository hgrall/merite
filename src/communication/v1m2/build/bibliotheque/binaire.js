"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Revue 31/07 OK - Testé
var types_1 = require("./types");
var Mot = /** @class */ (function (_super) {
    __extends(Mot, _super);
    function Mot(etat) {
        return _super.call(this, etat) || this;
    }
    Mot.prototype.representation = function () {
        return "[" + this.net('valeurs') + "]";
    };
    Mot.prototype.base2 = function () {
        return this.foncteur(function (v) { return types_1.Deux[v]; }).reduction("", function (x, y) { return x + "." + y; }).slice(1);
    };
    Mot.prototype.base10 = function () {
        return parseInt(this.foncteur(function (v) { return v.toString(); }).reduction("", function (x, y) { return x + y; }), 2);
    };
    Mot.prototype.tableauBinaire = function () {
        return this.etat().tableau;
    };
    return Mot;
}(types_1.TableauImmutable));
exports.Mot = Mot;
function creerMot(mot) {
    return new Mot({
        taille: mot.length,
        tableau: mot
    });
}
exports.creerMot = creerMot;
function binaire(n) {
    var s = Array.from(n.toString(2));
    return creerMot(s.map(function (v, i, t) {
        switch (v) {
            case '0': return types_1.Deux.ZERO;
            case '1': return types_1.Deux.UN;
            default:
                throw new Error("[Erreur : binaire(" + n.toString + ") non défini.");
        }
    }));
}
exports.binaire = binaire;
function premiersBinaires(n) {
    var r = [];
    for (var i = 0; i < n; i++) {
        r.push(i);
    }
    return r.map(function (v, i, tab) { return binaire(v); });
}
exports.premiersBinaires = premiersBinaires;
//# sourceMappingURL=binaire.js.map