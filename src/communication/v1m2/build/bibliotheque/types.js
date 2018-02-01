"use strict";
// Revue 02/08 - Testé.
// Revue 18/09 - Renommage - Testé.
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
var outils_1 = require("./outils");
// Les enum sont des sous-types de number.
var Unite;
(function (Unite) {
    Unite[Unite["ZERO"] = 0] = "ZERO";
})(Unite = exports.Unite || (exports.Unite = {}));
var Deux;
(function (Deux) {
    Deux[Deux["ZERO"] = 0] = "ZERO";
    Deux[Deux["UN"] = 1] = "UN";
})(Deux = exports.Deux || (exports.Deux = {}));
// Types formats JSON : FormatX par convention
// Il est recommandé de choisir le plus possible des formats immutables.
// Format ::= { (readonly etiquette : Format)*} 
//          | { (readonly etiquette : Format)*, (etiquette : Format)+, mutable : Unite} 
//          | { readonly table: { readonly [cle: string]: T }}
//          | { readonly table: { [cle: string]: T }}
//          | { table: { readonly [cle: string]: T }, mutable : Unite}
//          | { table: { [cle: string]: T }, mutable : Unite}
// Modèle générique d'une enveloppe d'un état
// TEX : type de sortie immutable (souvent format JSON en lecture seulement)
// TIN : type d'entrée pour l'état en format JSON ou non (mutable ou non, confiné si mutable)
// E : étiquettes utiles pour une représentation (cf. méthode net)
// La différence entre TIN et TEX permet de gérer les effets de bord sur l'état, souvent au format JSON.
// Une fonction de conversion de TIN vers TEX est requise.
// Toute méthode ayant une occurrence positive de TIN est protected. En effet, elle peut permettre d'obtenir l'état mutable
// et de réaliser un effet de bord sur l'état s'il est mutable.
// Cette classe abstraite doit être étedue ;
// - implémentation de net et représenter,
// - extension par des méthodes modifiant ou observant l'état.
// Sérialisation
// C'est le type interne TIN qui est utilisé pour la sérilisation (via la méthode brut()). 
// En conséquence, un format sérialisable doit être utilisé : types primitifs, 
// et comme contructeurs de types les tableaux et les structures indexées.
// Enveloppe de l'état qui est donc partagé.
var Enveloppe = /** @class */ (function () {
    function Enveloppe(etatEnVal, etat) {
        this.structure = etat;
        this.etatEnVal = etatEnVal;
    }
    Enveloppe.prototype.etat = function () {
        return this.structure;
    };
    Enveloppe.prototype.val = function () {
        return this.etatEnVal(this.structure);
    };
    // transformation brute du json de type TIN en string
    Enveloppe.prototype.brut = function () {
        return JSON.stringify(this.structure);
    };
    ;
    return Enveloppe;
}());
exports.Enveloppe = Enveloppe;
/* ***********************************************************************************************
* Dates
*/
var Semaine;
(function (Semaine) {
    Semaine[Semaine["LUNDI"] = 0] = "LUNDI";
    Semaine[Semaine["MARDI"] = 1] = "MARDI";
    Semaine[Semaine["MERCREDI"] = 2] = "MERCREDI";
    Semaine[Semaine["JEUDI"] = 3] = "JEUDI";
    Semaine[Semaine["VENDREDI"] = 4] = "VENDREDI";
    Semaine[Semaine["SAMEDI"] = 5] = "SAMEDI";
    Semaine[Semaine["DIMANCHE"] = 6] = "DIMANCHE";
})(Semaine = exports.Semaine || (exports.Semaine = {}));
var Mois;
(function (Mois) {
    Mois[Mois["JANVIER"] = 0] = "JANVIER";
    Mois[Mois["FEVRIER"] = 1] = "FEVRIER";
    Mois[Mois["MARS"] = 2] = "MARS";
    Mois[Mois["AVRIL"] = 3] = "AVRIL";
    Mois[Mois["MAI"] = 4] = "MAI";
    Mois[Mois["JUIN"] = 5] = "JUIN";
    Mois[Mois["JUILLET"] = 6] = "JUILLET";
    Mois[Mois["AOUT"] = 7] = "AOUT";
    Mois[Mois["SEPTEMBRE"] = 8] = "SEPTEMBRE";
    Mois[Mois["OCTOBRE"] = 9] = "OCTOBRE";
    Mois[Mois["NOVEMBRE"] = 10] = "NOVEMBRE";
    Mois[Mois["DECEMBRE"] = 11] = "DECEMBRE";
})(Mois = exports.Mois || (exports.Mois = {}));
function conversionDate(d) {
    return {
        seconde: d.getSeconds(),
        minute: d.getMinutes(),
        heure: d.getHours(),
        jourSemaine: (d.getDay() + 6) % 7,
        jourMois: d.getDate(),
        mois: d.getMonth(),
        annee: d.getFullYear()
    };
}
exports.conversionDate = conversionDate;
var DateFrEnveloppe = /** @class */ (function (_super) {
    __extends(DateFrEnveloppe, _super);
    function DateFrEnveloppe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateFrEnveloppe.prototype.net = function (e) {
        // A déplacer sous les cas.
        var s = outils_1.normalisationNombre(this.etat().seconde, 2);
        var min = outils_1.normalisationNombre(this.etat().minute, 2);
        var h = outils_1.normalisationNombre(this.etat().heure, 2);
        var js = this.etat().jourSemaine;
        var jsL = Semaine[js].toLowerCase();
        var jm = outils_1.normalisationNombre(this.etat().jourMois, 2);
        var mo = this.etat().mois;
        var moL = Mois[mo].toLowerCase();
        var moN = outils_1.normalisationNombre(mo + 1, 2);
        var a = this.etat().annee.toString();
        switch (e) {
            case 'heure': return h + ":" + min + ":" + s;
            case 'jourSemaine': return jsL;
            case 'jourMois': return jm;
            case 'moisLettre': return moL;
            case 'moisNumero': return moN;
            case 'annee': return a;
            case 'date': return jm + "/" + moN + "/" + a;
            case 'dateLongue': return jsL + " " + jm + " " + moL + " " + a;
        }
        return outils_1.jamais(e);
    };
    DateFrEnveloppe.prototype.detail = function (e) {
        return this.net(e); // Simple renommage
    };
    DateFrEnveloppe.prototype.representation = function () {
        return this.net('heure') + ", le " + this.net('date');
    };
    DateFrEnveloppe.prototype.representationLongue = function () {
        return this.net('heure') + ", le " + this.net('dateLongue');
    };
    DateFrEnveloppe.prototype.representationLog = function () {
        return this.net('heure') + " " + this.net('date');
    };
    return DateFrEnveloppe;
}(Enveloppe));
function creerDateMaintenant() {
    return new DateFrEnveloppe(function (x) { return x; }, conversionDate(new Date()));
}
exports.creerDateMaintenant = creerDateMaintenant;
function creerDateEnveloppe(d) {
    return new DateFrEnveloppe(function (x) { return x; }, d);
}
exports.creerDateEnveloppe = creerDateEnveloppe;
/*
* Module définissant les fonctions utiles pour les structures JSON
* représentant les tableaux (FormatTableauX).
*/
var FabriqueTableau = /** @class */ (function () {
    function FabriqueTableau() {
    }
    FabriqueTableau.prototype.videMutable = function () {
        return { taille: 0, tableau: [], mutable: Unite.ZERO };
    };
    FabriqueTableau.prototype.videImmutable = function () {
        return { taille: 0, tableau: [] };
    };
    FabriqueTableau.prototype.enveloppeMutable = function (tab) {
        return { taille: tab.length, tableau: tab, mutable: Unite.ZERO };
    };
    FabriqueTableau.prototype.enveloppeImmutable = function (tab) {
        return { taille: tab.length, tableau: tab };
    };
    return FabriqueTableau;
}());
var FABRIQUE_TABLEAU = new FabriqueTableau();
var ModuleTableau = /** @class */ (function () {
    function ModuleTableau() {
    }
    ModuleTableau.prototype.iterer = function (f, t) {
        t.tableau.forEach(function (v, i, t) { return f(i, v, t); });
    };
    ModuleTableau.prototype.valeur = function (t, index) {
        return t.tableau[index];
    };
    ModuleTableau.prototype.taille = function (t) {
        return t.tableau.length;
    };
    ModuleTableau.prototype.foncteur = function (t, f) {
        var r = [];
        this.iterer(function (i, v) {
            r[i] = f(v);
        }, t);
        return FABRIQUE_TABLEAU.enveloppeMutable(r);
    };
    ModuleTableau.prototype.reduction = function (t, neutre, op) {
        var r = neutre;
        this.iterer(function (i, v) {
            r = op(r, v);
        }, t);
        return r;
    };
    ModuleTableau.prototype.ajouterEnFin = function (t, x) {
        t.tableau.push(x);
    };
    ModuleTableau.prototype.retirerEnFin = function (t) {
        if (t.taille === 0) {
            throw new Error("[Exception : retirerEnFin() non défini.]");
        }
        return t.tableau.pop();
    };
    return ModuleTableau;
}());
var MODULE_TABLEAU = new ModuleTableau();
// Conversion pour les tableaux
function conversionFormatTableau(conv) {
    return (function (t) {
        var r = new Array(t.taille);
        MODULE_TABLEAU.iterer(function (i, v) {
            r[i] = conv(v);
        }, t);
        return FABRIQUE_TABLEAU.enveloppeImmutable(r);
    });
}
exports.conversionFormatTableau = conversionFormatTableau;
// Tableau immutable : TIN = TEX (recommandé : immutable)
var TableauImmutable = /** @class */ (function (_super) {
    __extends(TableauImmutable, _super);
    function TableauImmutable(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    TableauImmutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'valeurs': return this.etat().tableau.toString();
        }
        return outils_1.jamais(e);
    };
    TableauImmutable.prototype.representation = function () {
        return "[" + this.net('valeurs') + "]";
    };
    TableauImmutable.prototype.iterer = function (f) {
        MODULE_TABLEAU.iterer(f, this.etat());
    };
    TableauImmutable.prototype.foncteur = function (f) {
        return new TableauImmutable(MODULE_TABLEAU.foncteur(this.etat(), f));
    };
    TableauImmutable.prototype.reduction = function (neutre, op) {
        return MODULE_TABLEAU.reduction(this.etat(), neutre, op);
    };
    TableauImmutable.prototype.valeur = function (index) {
        return MODULE_TABLEAU.valeur(this.etat(), index);
    };
    TableauImmutable.prototype.taille = function () {
        return MODULE_TABLEAU.taille(this.etat());
    };
    TableauImmutable.prototype.estVide = function () {
        return this.taille() === 0;
    };
    return TableauImmutable;
}(Enveloppe));
exports.TableauImmutable = TableauImmutable;
function creerTableauImmutable(t) {
    return new TableauImmutable(FABRIQUE_TABLEAU.enveloppeImmutable(t));
}
exports.creerTableauImmutable = creerTableauImmutable;
// Tableau mutable - TIN peut être différent de TEX.
//   Recommandé : TEX immutable.
// Attention : la méthode val() requiert un parcours du tableau formant l'état.
var TableauMutable = /** @class */ (function (_super) {
    __extends(TableauMutable, _super);
    function TableauMutable(etatVersVal, etat) {
        if (etat === void 0) { etat = FABRIQUE_TABLEAU.videMutable(); }
        var _this = _super.call(this, conversionFormatTableau(etatVersVal), etat) || this;
        _this.etatVersVal = etatVersVal;
        return _this;
    }
    TableauMutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'valeurs': return this.etat().tableau.toString();
        }
        return outils_1.jamais(e);
    };
    TableauMutable.prototype.representation = function () {
        return "[" + this.net('valeurs') + "]";
    };
    TableauMutable.prototype.itererEtat = function (f) {
        MODULE_TABLEAU.iterer(f, this.etat());
    };
    TableauMutable.prototype.iterer = function (f) {
        var _this = this;
        this.itererEtat(function (i, v, t) { return f(i, _this.etatVersVal(v)); });
    };
    TableauMutable.prototype.valeurEtat = function (i) {
        return MODULE_TABLEAU.valeur(this.etat(), i);
    };
    TableauMutable.prototype.valeur = function (i) {
        return this.etatVersVal(this.valeurEtat(i));
    };
    TableauMutable.prototype.taille = function () {
        return MODULE_TABLEAU.taille(this.etat());
    };
    TableauMutable.prototype.estVide = function () {
        return this.taille() === 0;
    };
    TableauMutable.prototype.ajouterEnFin = function (x) {
        MODULE_TABLEAU.ajouterEnFin(this.etat(), x);
    };
    TableauMutable.prototype.retirerEnFin = function () {
        MODULE_TABLEAU.retirerEnFin(this.etat());
    };
    return TableauMutable;
}(Enveloppe));
exports.TableauMutable = TableauMutable;
function creerTableauMutableVide(etatVersVal) {
    return new TableauMutable(etatVersVal);
}
exports.creerTableauMutableVide = creerTableauMutableVide;
// Partage du tableau passé en argument.
function creerTableauMutableEnveloppe(etatVersVal, t) {
    return new TableauMutable(etatVersVal, FABRIQUE_TABLEAU.enveloppeMutable(t));
}
exports.creerTableauMutableEnveloppe = creerTableauMutableEnveloppe;
/*
* Création par copie du tableau.
*/
function creerTableauMutable(etatVersVal, t) {
    var r = creerTableauMutableVide(etatVersVal);
    MODULE_TABLEAU.iterer(function (c, v) { return r.ajouterEnFin(v); }, FABRIQUE_TABLEAU.enveloppeMutable(t));
    return r;
}
exports.creerTableauMutable = creerTableauMutable;
// Un module réservoir de fonctions utiles sur les tables.
var FabriqueTable = /** @class */ (function () {
    function FabriqueTable() {
    }
    FabriqueTable.prototype.videMutable = function () {
        return { table: {}, mutable: Unite.ZERO };
    };
    FabriqueTable.prototype.videImmutable = function () {
        return { table: {} };
    };
    FabriqueTable.prototype.enveloppeMutable = function (tab) {
        return { table: tab, mutable: Unite.ZERO };
    };
    FabriqueTable.prototype.enveloppeImmutable = function (tab) {
        return { table: tab };
    };
    return FabriqueTable;
}());
exports.FABRIQUE_TABLE = new FabriqueTable();
var ModuleTable = /** @class */ (function () {
    function ModuleTable() {
    }
    ModuleTable.prototype.iterer = function (f, t) {
        for (var c in t.table) {
            f(c, t.table[c], t.table);
        }
    };
    ModuleTable.prototype.valeur = function (t, cle) {
        return t.table[cle];
    };
    ModuleTable.prototype.contient = function (t, cle) {
        if (t.table[cle]) {
            return true;
        }
        return false;
        ;
    };
    ModuleTable.prototype.image = function (t) {
        var tab = [];
        this.iterer(function (c, v) {
            tab.push(v);
        }, t);
        return tab;
    };
    ModuleTable.prototype.domaine = function (t) {
        var tab = [];
        this.iterer(function (c, v) {
            tab.push(c);
        }, t);
        return tab;
    };
    ModuleTable.prototype.taille = function (t) {
        var n = 0;
        this.iterer(function (c, v) {
            n++;
        }, t);
        return n;
    };
    ModuleTable.prototype.foncteur = function (t, f) {
        var r = {};
        this.iterer(function (c, v) {
            r[c] = f(v);
        }, t);
        return exports.FABRIQUE_TABLE.enveloppeMutable(r);
    };
    ModuleTable.prototype.transformationTableVersTableau = function (t, f) {
        var r = [];
        this.iterer(function (c, v) {
            r.push(f(c, v));
        }, t);
        return r;
    };
    ModuleTable.prototype.selectionCle = function (t) {
        // sélection d'une clé
        for (var c in t.table) {
            return c;
        }
        throw new Error("[Exception : selectionCle() non défini.]");
    };
    ModuleTable.prototype.selectionCleSuivantCritere = function (t, prop) {
        // sélection d'une clé
        for (var c in t.table) {
            if (prop(t.table[c])) {
                return c;
            }
        }
        throw new Error("[Exception : selectionCleSuivantCritere() non défini.]");
    };
    ModuleTable.prototype.ajouter = function (t, cle, x) {
        t.table[cle] = x;
    };
    ModuleTable.prototype.retirer = function (t, cle) {
        delete t.table[cle];
    };
    return ModuleTable;
}());
var MODULE_TABLE = new ModuleTable();
// Conversion pour les tables 
function conversionFormatTable(conv) {
    return (function (t) {
        var r = {};
        MODULE_TABLE.iterer(function (c, v) {
            r[c] = conv(v);
        }, t);
        return exports.FABRIQUE_TABLE.enveloppeImmutable(r);
    });
}
exports.conversionFormatTable = conversionFormatTable;
// Table immutable : TIN = TEX (recommandé : immutable)
var TableImmutable = /** @class */ (function (_super) {
    __extends(TableImmutable, _super);
    function TableImmutable(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    TableImmutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().toString();
            case 'image': return this.image().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'graphe': return JSON.stringify(this.etat().table);
        }
        return outils_1.jamais(e);
    };
    TableImmutable.prototype.representation = function () {
        return this.net('graphe');
    };
    TableImmutable.prototype.iterer = function (f) {
        MODULE_TABLE.iterer(f, this.etat());
    };
    TableImmutable.prototype.valeur = function (cle) {
        return MODULE_TABLE.valeur(this.etat(), cle);
    };
    TableImmutable.prototype.contient = function (cle) {
        return MODULE_TABLE.contient(this.etat(), cle);
    };
    TableImmutable.prototype.image = function () {
        return MODULE_TABLE.image(this.etat());
    };
    TableImmutable.prototype.domaine = function () {
        return MODULE_TABLE.domaine(this.etat());
    };
    TableImmutable.prototype.taille = function () {
        return MODULE_TABLE.taille(this.etat());
    };
    TableImmutable.prototype.selectionCle = function () {
        return MODULE_TABLE.selectionCle(this.etat());
    };
    TableImmutable.prototype.selectionCleSuivantCritere = function (prop) {
        return MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop);
    };
    TableImmutable.prototype.application = function (f) {
        return new TableImmutable(MODULE_TABLE.foncteur(this.etat(), f));
    };
    return TableImmutable;
}(Enveloppe));
exports.TableImmutable = TableImmutable;
function creerTableImmutable(t) {
    return new TableImmutable(t);
}
exports.creerTableImmutable = creerTableImmutable;
// Table mutable - TIN peut être différent de TEX.
//   Recommandé : TEX immutable.
// Attention : la méthode val() requiert un parcours de la table formant l'état.
var TableMutable = /** @class */ (function (_super) {
    __extends(TableMutable, _super);
    function TableMutable(etatVersVal, table) {
        if (table === void 0) { table = exports.FABRIQUE_TABLE.videMutable(); }
        var _this = _super.call(this, conversionFormatTable(etatVersVal), table) || this;
        _this.etatVersVal = etatVersVal;
        return _this;
    }
    TableMutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().toString();
            case 'image': return this.image().map(function (v, i) { return JSON.stringify(v); }).toString();
            case 'graphe': return JSON.stringify(this.val().table);
        }
        return outils_1.jamais(e);
    };
    TableMutable.prototype.representation = function () {
        return this.net('graphe');
    };
    TableMutable.prototype.itererEtat = function (f) {
        MODULE_TABLE.iterer(f, this.etat());
    };
    TableMutable.prototype.iterer = function (f) {
        var _this = this;
        this.itererEtat(function (c, v, t) { return f(c, _this.etatVersVal(v)); });
        // moins efficace (deux parcours) : MODULE_TABLE.iterer(f, this.ex());
    };
    TableMutable.prototype.valeurEtat = function (cle) {
        return MODULE_TABLE.valeur(this.etat(), cle);
    };
    TableMutable.prototype.valeur = function (cle) {
        return this.etatVersVal(this.valeurEtat(cle));
        // moins efficace : MODULE_TABLE.valeur(this.val(), cle);
    };
    TableMutable.prototype.contient = function (cle) {
        return MODULE_TABLE.contient(this.etat(), cle);
    };
    TableMutable.prototype.imageEtat = function () {
        return MODULE_TABLE.image(this.etat());
    };
    TableMutable.prototype.image = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), function (c, v) { return _this.etatVersVal(v); });
        // moins efficace : MODULE_TABLE.image(this.val());
    };
    TableMutable.prototype.domaine = function () {
        return MODULE_TABLE.domaine(this.etat());
    };
    TableMutable.prototype.taille = function () {
        return MODULE_TABLE.taille(this.etat());
    };
    TableMutable.prototype.estVide = function () {
        return this.taille() === 0;
    };
    TableMutable.prototype.selectionCle = function () {
        return MODULE_TABLE.selectionCle(this.etat());
    };
    TableMutable.prototype.selectionCleSuivantCritereEtat = function (prop) {
        return MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop);
    };
    TableMutable.prototype.selectionCleSuivantCritere = function (prop) {
        var _this = this;
        return this.selectionCleSuivantCritereEtat(function (x) { return prop(_this.etatVersVal(x)); });
        // moins efficace : MODULE_TABLE.selectionCleSuivantCritere(this.val(), prop);
    };
    TableMutable.prototype.ajouter = function (cle, x) {
        MODULE_TABLE.ajouter(this.etat(), cle, x);
    };
    TableMutable.prototype.retirer = function (cle) {
        MODULE_TABLE.retirer(this.etat(), cle);
    };
    return TableMutable;
}(Enveloppe));
exports.TableMutable = TableMutable;
function creerTableMutableVide(etatVersVal) {
    return new TableMutable(etatVersVal);
}
exports.creerTableMutableVide = creerTableMutableVide;
// Partage de la  table passée en argument.
function creerTableMutableEnveloppe(etatVersVal, t) {
    return new TableMutable(etatVersVal, exports.FABRIQUE_TABLE.enveloppeMutable(t));
}
exports.creerTableMutableEnveloppe = creerTableMutableEnveloppe;
/*
* Création par copie de la table.
*/
function creerTableMutable(etatVersVal, t) {
    var r = creerTableMutableVide(etatVersVal);
    MODULE_TABLE.iterer(function (c, v) { return r.ajouter(c, v); }, exports.FABRIQUE_TABLE.enveloppeMutable(t));
    return r;
}
exports.creerTableMutable = creerTableMutable;
var IdentificationParCompteur = /** @class */ (function () {
    function IdentificationParCompteur(prefixe) {
        this.prefixe = prefixe;
        this.compteur = 0;
    }
    IdentificationParCompteur.prototype.identifier = function (s) {
        var id = this.prefixe + this.compteur;
        this.compteur++;
        return creerIdentifiant(s, id);
    };
    return IdentificationParCompteur;
}());
function creerIdentificationParCompteur(prefixe) {
    return new IdentificationParCompteur(prefixe);
}
exports.creerIdentificationParCompteur = creerIdentificationParCompteur;
function creerIdentifiant(s, cle) {
    return {
        val: cle,
        sorte: s
    };
}
exports.creerIdentifiant = creerIdentifiant;
function egaliteIdentifiant(id1, id2) {
    return id1.val === id2.val;
}
exports.egaliteIdentifiant = egaliteIdentifiant;
/*
* Table utilisant des identificateurs comme clé.
* Remarque : les tables précédentes fondées sur les tables en JSON utilisent nécessairement le type string pour les clés.
*/
var TableIdentificationMutable = /** @class */ (function (_super) {
    __extends(TableIdentificationMutable, _super);
    function TableIdentificationMutable(sorte, etatVersVal, table) {
        if (table === void 0) { table = exports.FABRIQUE_TABLE.videMutable(); }
        var _this = _super.call(this, conversionFormatTable(etatVersVal), table) || this;
        _this.sorte = sorte;
        _this.etatVersVal = etatVersVal;
        return _this;
    }
    TableIdentificationMutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'image': return this.image().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'graphe': return JSON.stringify(this.val().table);
        }
        return outils_1.jamais(e);
    };
    TableIdentificationMutable.prototype.representation = function () {
        return this.net('graphe');
    };
    TableIdentificationMutable.prototype.itererEtat = function (f) {
        var _this = this;
        MODULE_TABLE.iterer(function (id, v, t) { return f(creerIdentifiant(_this.sorte, id), v, t); }, this.etat());
    };
    TableIdentificationMutable.prototype.iterer = function (f) {
        var _this = this;
        this.itererEtat(function (c, v, t) { return f(c, _this.etatVersVal(v)); });
        // moins efficace (deux parcours) : MODULE_TABLE.iterer(f, this.ex());
    };
    TableIdentificationMutable.prototype.valeurEtat = function (ID_sorte) {
        return MODULE_TABLE.valeur(this.etat(), ID_sorte.val);
    };
    TableIdentificationMutable.prototype.valeur = function (ID_sorte) {
        return this.etatVersVal(this.valeurEtat(ID_sorte));
    };
    TableIdentificationMutable.prototype.contient = function (ID_sorte) {
        return MODULE_TABLE.contient(this.etat(), ID_sorte.val);
    };
    TableIdentificationMutable.prototype.imageEtat = function () {
        return MODULE_TABLE.image(this.etat());
    };
    TableIdentificationMutable.prototype.image = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), function (c, v) { return _this.etatVersVal(v); });
        // moins efficace : MODULE_TABLE.image(this.val());
    };
    TableIdentificationMutable.prototype.domaine = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), function (c, v) { return creerIdentifiant(_this.sorte, c); });
        // moins efficace : return MODULE_TABLE.domaine(this.etat()).
        //    map((s) => { return { val: s, sorte: this.sorte } });
    };
    TableIdentificationMutable.prototype.selectionCle = function () {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCle(this.etat()));
    };
    TableIdentificationMutable.prototype.selectionCleSuivantCritereEtat = function (prop) {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop));
    };
    TableIdentificationMutable.prototype.selectionCleSuivantCritere = function (prop) {
        var _this = this;
        return this.selectionCleSuivantCritereEtat(function (x) { return prop(_this.etatVersVal(x)); });
        // moins efficace : MODULE_TABLE.selectionCleSuivantCritere(this.ex(), prop);
    };
    TableIdentificationMutable.prototype.taille = function () {
        return MODULE_TABLE.taille(this.etat());
    };
    TableIdentificationMutable.prototype.estVide = function () {
        return this.taille() === 0;
    };
    TableIdentificationMutable.prototype.ajouter = function (ID_sorte, x) {
        MODULE_TABLE.ajouter(this.etat(), ID_sorte.val, x);
    };
    TableIdentificationMutable.prototype.retirer = function (ID_sorte) {
        MODULE_TABLE.retirer(this.etat(), ID_sorte.val);
    };
    return TableIdentificationMutable;
}(Enveloppe));
exports.TableIdentificationMutable = TableIdentificationMutable;
function creerTableIdentificationMutableVide(sorte, etatVersVal) {
    return new TableIdentificationMutable(sorte, etatVersVal);
}
exports.creerTableIdentificationMutableVide = creerTableIdentificationMutableVide;
/*
* Création par copie de la table.
*/
function creerTableIdentificationMutable(sorte, etatVersVal, table) {
    var r = creerTableIdentificationMutableVide(sorte, etatVersVal);
    MODULE_TABLE.iterer(function (c, v) { return r.ajouter(creerIdentifiant(sorte, c), v); }, table);
    return r;
}
exports.creerTableIdentificationMutable = creerTableIdentificationMutable;
/*
 *  Création d'une enveloppe de la table passée en argument (qui est donc partagée).
 */
function creerTableIdentificationMutableEnveloppe(sorte, etatVersVal, table) {
    return new TableIdentificationMutable(sorte, etatVersVal, table);
}
exports.creerTableIdentificationMutableEnveloppe = creerTableIdentificationMutableEnveloppe;
// Version immutable
var TableIdentificationImmutable = /** @class */ (function (_super) {
    __extends(TableIdentificationImmutable, _super);
    function TableIdentificationImmutable(sorte, table) {
        if (table === void 0) { table = exports.FABRIQUE_TABLE.videImmutable(); }
        var _this = _super.call(this, conversionFormatTable(function (x) { return x; }), table) || this;
        _this.sorte = sorte;
        return _this;
    }
    TableIdentificationImmutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'image': return this.image().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'graphe': return JSON.stringify(this.val().table);
        }
        return outils_1.jamais(e);
    };
    TableIdentificationImmutable.prototype.representation = function () {
        return this.net('graphe');
    };
    TableIdentificationImmutable.prototype.iterer = function (f) {
        var _this = this;
        MODULE_TABLE.iterer(function (id, v, t) { return f(creerIdentifiant(_this.sorte, id), v, t); }, this.etat());
    };
    TableIdentificationImmutable.prototype.valeur = function (ID_sorte) {
        return MODULE_TABLE.valeur(this.etat(), ID_sorte.val);
    };
    TableIdentificationImmutable.prototype.contient = function (ID_sorte) {
        return MODULE_TABLE.contient(this.etat(), ID_sorte.val);
    };
    TableIdentificationImmutable.prototype.image = function () {
        return MODULE_TABLE.image(this.etat());
    };
    TableIdentificationImmutable.prototype.domaine = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), function (c, v) { return creerIdentifiant(_this.sorte, c); });
    };
    TableIdentificationImmutable.prototype.selectionCle = function () {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCle(this.etat()));
    };
    TableIdentificationImmutable.prototype.selectionCleSuivantCritere = function (prop) {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop));
    };
    TableIdentificationImmutable.prototype.taille = function () {
        return MODULE_TABLE.taille(this.etat());
    };
    TableIdentificationImmutable.prototype.estVide = function () {
        return this.taille() === 0;
    };
    return TableIdentificationImmutable;
}(Enveloppe));
exports.TableIdentificationImmutable = TableIdentificationImmutable;
function creerTableIdentificationImmutable(sorte, table) {
    return new TableIdentificationImmutable(sorte, table);
}
exports.creerTableIdentificationImmutable = creerTableIdentificationImmutable;
//# sourceMappingURL=types.js.map