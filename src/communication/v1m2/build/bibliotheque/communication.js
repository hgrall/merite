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
var types_1 = require("./types");
;
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Message;
}(types_1.Enveloppe));
exports.Message = Message;
var Configuration = /** @class */ (function (_super) {
    __extends(Configuration, _super);
    function Configuration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Configuration;
}(types_1.Enveloppe));
exports.Configuration = Configuration;
var ErreurRedhibitoire = /** @class */ (function (_super) {
    __extends(ErreurRedhibitoire, _super);
    function ErreurRedhibitoire() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ErreurRedhibitoire;
}(types_1.Enveloppe));
exports.ErreurRedhibitoire = ErreurRedhibitoire;
/*
- réseau ::= noeud*
- noeud ::= (sommet, sommet*)
- sommet ::= {identifiant, ...}

- Serveur : agrégation d'un réseau
- Client : agrégation d'un noeud du réseau

- Remarque : compatibilité ES3 pour les objets.
*/
// - sommet ::= {identifiant, ...}
// La sorte pour les identifiants de sommets est 'sommet'. 
var Sommet = /** @class */ (function (_super) {
    __extends(Sommet, _super);
    function Sommet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Sommet;
}(types_1.Enveloppe));
exports.Sommet = Sommet;
var ReseauTableDeNoeuds = /** @class */ (function (_super) {
    __extends(ReseauTableDeNoeuds, _super);
    function ReseauTableDeNoeuds() {
        return _super.call(this, 'sommet', function (x) { return x; }) || this;
    }
    ReseauTableDeNoeuds.prototype.representation = function () {
        return "réseau de " + this.net('taille') + " noeuds : "
            + this.net('graphe');
    };
    // (simple renommmage)
    ReseauTableDeNoeuds.prototype.possedeNoeud = function (ID_sommet) {
        return this.contient(ID_sommet);
    };
    // Précondition : id1 et id2 sont deux noeuds du réseau.
    ReseauTableDeNoeuds.prototype.sontVoisins = function (ID_sommet1, ID_sommet2) {
        return types_1.creerTableIdentificationImmutable('sommet', this.valeurEtat(ID_sommet1).voisins).
            contient(ID_sommet2);
    };
    ReseauTableDeNoeuds.prototype.iterer = function (f) {
        this.itererEtat(f);
    };
    ReseauTableDeNoeuds.prototype.noeud = function (ID_sommet) {
        return this.valeur(ID_sommet);
    };
    ReseauTableDeNoeuds.prototype.identifiantsNoeuds = function () {
        return this.domaine();
    };
    ReseauTableDeNoeuds.prototype.selectionNoeud = function () {
        return this.selectionCle();
    };
    ReseauTableDeNoeuds.prototype.ajouterNoeud = function (n) {
        this.ajouter(n.centre.ID, n);
    };
    ReseauTableDeNoeuds.prototype.retirerNoeud = function (n) {
        this.retirer(n.centre.ID);
    };
    return ReseauTableDeNoeuds;
}(types_1.TableIdentificationMutable));
exports.ReseauTableDeNoeuds = ReseauTableDeNoeuds;
function creerReseauVide() {
    return new ReseauTableDeNoeuds();
}
exports.creerReseauVide = creerReseauVide;
function creerCentreSansVoisins(centre) {
    return { centre: centre, voisins: types_1.FABRIQUE_TABLE.videMutable() };
}
exports.creerCentreSansVoisins = creerCentreSansVoisins;
function conversionFormatNoeud(n) {
    return { centre: n.centre, voisins: types_1.conversionFormatTable(function (s) { return s; })(n.voisins) };
    // return n; correct mais conserve le champ mutable.
}
var NoeudEnveloppeMutable = /** @class */ (function (_super) {
    __extends(NoeudEnveloppeMutable, _super);
    function NoeudEnveloppeMutable(etat) {
        return _super.call(this, conversionFormatNoeud, etat) || this;
    }
    NoeudEnveloppeMutable.prototype.aPourVoisin = function (ID_sommet) {
        return types_1.creerTableIdentificationImmutable('sommet', this.etat().voisins).
            contient(ID_sommet);
    };
    NoeudEnveloppeMutable.prototype.itererVoisins = function (proc) {
        types_1.creerTableIdentificationImmutable('sommet', this.etat().voisins).iterer(proc);
    };
    NoeudEnveloppeMutable.prototype.ajouterVoisin = function (v) {
        types_1.creerTableIdentificationMutableEnveloppe('sommet', function (x) { return x; }, this.etat().voisins).ajouter(v.ID, v);
    };
    return NoeudEnveloppeMutable;
}(types_1.Enveloppe));
exports.NoeudEnveloppeMutable = NoeudEnveloppeMutable;
var NoeudEnveloppeImmutable = /** @class */ (function (_super) {
    __extends(NoeudEnveloppeImmutable, _super);
    function NoeudEnveloppeImmutable(etat) {
        return _super.call(this, conversionFormatNoeud, etat) || this;
    }
    NoeudEnveloppeImmutable.prototype.aPourVoisin = function (ID_sommet) {
        return types_1.creerTableIdentificationImmutable('sommet', this.etat().voisins).
            contient(ID_sommet);
    };
    NoeudEnveloppeImmutable.prototype.itererVoisins = function (proc) {
        types_1.creerTableIdentificationImmutable('sommet', this.etat().voisins).iterer(proc);
    };
    return NoeudEnveloppeImmutable;
}(types_1.Enveloppe));
exports.NoeudEnveloppeImmutable = NoeudEnveloppeImmutable;
var AssemblageReseauEnAnneau = /** @class */ (function (_super) {
    __extends(AssemblageReseauEnAnneau, _super);
    function AssemblageReseauEnAnneau(nombreSommets, fabriqueNoeudSansVoisins) {
        var _this = _super.call(this, function (x) { return x; }) || this;
        _this.nombreSommets = nombreSommets;
        _this.fabriqueNoeudSansVoisins = fabriqueNoeudSansVoisins;
        console.log("* Construction d'un réseau en anneau de " + nombreSommets.toString() + " éléments.");
        return _this;
    }
    // Les sommetts doivent avoir des identifiants deux à deux distincts.
    AssemblageReseauEnAnneau.prototype.ajouterSommet = function (s) {
        if (this.taille() < this.nombreSommets) {
            this.ajouterEnFin(s);
        }
        else {
            console.log("- Impossible d'ajouter un sommet : le réseau en anneau est complet.");
        }
    };
    AssemblageReseauEnAnneau.prototype.assembler = function () {
        var _this = this;
        var restant = this.nombreSommets - this.taille();
        if (restant > 0) {
            console.log("- Impossible d'assembler un réseau en anneau de la taille donnée : ajouter " + restant + " sommets.");
            throw new Error("[Exception : AssemblageReseau.assembler non défini.]");
        }
        // Définition du réseau
        var reseau = creerReseauVide();
        this.iterer(function (i, s) {
            var n = _this.fabriqueNoeudSansVoisins(s);
            n.ajouterVoisin(_this.valeurEtat((i + 1) % _this.nombreSommets));
            n.ajouterVoisin(_this.valeurEtat((i + (_this.nombreSommets - 1)) % _this.nombreSommets));
            reseau.ajouterNoeud(n.val());
        });
        return reseau;
    };
    return AssemblageReseauEnAnneau;
}(types_1.TableauMutable));
function creerAssemblageReseauEnAnneau(taille, fabriqueNoeudSansVoisins) {
    return new AssemblageReseauEnAnneau(taille, fabriqueNoeudSansVoisins);
}
exports.creerAssemblageReseauEnAnneau = creerAssemblageReseauEnAnneau;
//# sourceMappingURL=communication.js.map