"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BLEU_TURQUIN = "rgb(66, 91, 138)";
var BLANC = "rgb(255, 255, 255)";
var NOIR = "rgb(0,0,0)";
var NOIR_CARBONE = "rgb(19, 14, 10)";
var ANTHRACITE = "rgb(48, 48, 48)";
var FRAISE = "rgb(191, 48, 48)";
var JAUNE_OR = "rgb(239, 216, 7)";
var ZINZOLIN = "rgb(108, 2, 119)";
var BLEU_CANARD = "rgb(0, 128, 128)";
var BLEU_CIEL = "rgb(119, 181, 254)";
var VERT_PRINTEMPS = "rgb(0, 255, 127)";
var GRIS_FER = "rgb(127, 127, 127)";
var LIN = "rgb(250, 240, 230)";
var ROUGE_FEU = "rgb(254, 27, 0)";
var FUMEE = "rgb(187, 210, 225)";
exports.FOND = LIN;
exports.CADRE = BLEU_CIEL;
exports.SELECTION = BLEU_TURQUIN;
exports.SEPARATION_CADRE = BLANC;
exports.TEXTE = NOIR;
exports.TEXTE_PALE = ANTHRACITE;
exports.TEXTE_INV = BLANC;
exports.TEXTE_ERREUR = ROUGE_FEU;
exports.FOND_TEXTE = BLANC;
exports.FOND_TEXTE_INV = NOIR_CARBONE;
var SuiteCouplesFondEncre = /** @class */ (function () {
    function SuiteCouplesFondEncre() {
        this.fonds = [JAUNE_OR, BLEU_CANARD, ZINZOLIN, VERT_PRINTEMPS]; /* TODO etendre ! */
        this.encres = [NOIR, BLANC, BLANC, NOIR]; /* TODO etendre ! */
        this.pos = 0;
    }
    SuiteCouplesFondEncre.prototype.courant = function () {
        var r = { fond: this.fonds[this.pos], encre: this.encres[this.pos] };
        this.pos = (this.pos + 1) % (this.encres.length);
        return r;
    };
    return SuiteCouplesFondEncre;
}());
exports.SuiteCouplesFondEncre = SuiteCouplesFondEncre;
exports.COUPLE_FOND_ENCRE_TOUS = {
    fond: GRIS_FER,
    encre: BLANC
};
exports.COUPLE_FOND_ENCRE_SUJET = {
    fond: FRAISE,
    encre: BLANC
};
exports.COUPLE_FOND_ENCRE_INCONNU = {
    fond: FUMEE,
    encre: NOIR
};
//# sourceMappingURL=couleur.js.map