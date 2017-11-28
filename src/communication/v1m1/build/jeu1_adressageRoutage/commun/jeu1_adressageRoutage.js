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
var communication_1 = require("../../bibliotheque/communication");
var types_1 = require("../../bibliotheque/types");
var outils_1 = require("../../bibliotheque/outils");
var binaire_1 = require("../../bibliotheque/binaire");
exports.hote = "merite"; // hôte local via TCP/IP - DNS : cf. /etc/hosts - IP : 127.0.0.1
exports.port1 = 3001; // port de la essource 1 (serveur d'applications)
exports.port2 = 1111; // port de la ressouce 2 (serveur de connexions)
// Iditenfiants indéfinis utilisés dans des messages définis partiellement
exports.sommetInconnu = { val: "*", sorte: 'sommet' };
exports.messageInconnu = { val: "*", sorte: 'message' };
exports.utilisateurInconnu = { val: "*", sorte: 'utilisateur' };
var SommetJeu1 = /** @class */ (function (_super) {
    __extends(SommetJeu1, _super);
    function SommetJeu1(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    SommetJeu1.prototype.net = function (e) {
        var s = this.val();
        switch (e) {
            case 'domaine': return binaire_1.creerMot(s.domaine).representation();
            case 'ID': return s.ID.val;
        }
        return outils_1.jamais(e);
    };
    SommetJeu1.prototype.representation = function () {
        return this.net('domaine') + " (" + this.net('ID') + ")";
    };
    return SommetJeu1;
}(communication_1.Sommet));
exports.SommetJeu1 = SommetJeu1;
function creerSommetJeu1(s) {
    return new SommetJeu1(s);
}
exports.creerSommetJeu1 = creerSommetJeu1;
var NoeudJeu1EnveloppeMutable = /** @class */ (function (_super) {
    __extends(NoeudJeu1EnveloppeMutable, _super);
    function NoeudJeu1EnveloppeMutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoeudJeu1EnveloppeMutable.prototype.net = function (e) {
        var s = this.val();
        switch (e) {
            case 'centre': return creerSommetJeu1(s.centre).representation();
            case 'voisins': return types_1.creerTableImmutable(s.voisins).representation();
        }
        return outils_1.jamais(e);
    };
    NoeudJeu1EnveloppeMutable.prototype.representation = function () {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    };
    return NoeudJeu1EnveloppeMutable;
}(communication_1.NoeudEnveloppeMutable));
exports.NoeudJeu1EnveloppeMutable = NoeudJeu1EnveloppeMutable;
function creerNoeudJeu1Mutable(n) {
    return new NoeudJeu1EnveloppeMutable(n);
}
exports.creerNoeudJeu1Mutable = creerNoeudJeu1Mutable;
function creerNoeudSansVoisinsJeu1Mutable(centre) {
    return creerNoeudJeu1Mutable(communication_1.creerCentreSansVoisins(centre));
}
exports.creerNoeudSansVoisinsJeu1Mutable = creerNoeudSansVoisinsJeu1Mutable;
var NoeudJeu1EnveloppeImmutable = /** @class */ (function (_super) {
    __extends(NoeudJeu1EnveloppeImmutable, _super);
    function NoeudJeu1EnveloppeImmutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoeudJeu1EnveloppeImmutable.prototype.net = function (e) {
        var s = this.val();
        switch (e) {
            case 'centre': return creerSommetJeu1(s.centre).representation();
            case 'voisins': return types_1.creerTableImmutable(s.voisins).representation();
        }
        return outils_1.jamais(e);
    };
    NoeudJeu1EnveloppeImmutable.prototype.representation = function () {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    };
    return NoeudJeu1EnveloppeImmutable;
}(communication_1.NoeudEnveloppeImmutable));
exports.NoeudJeu1EnveloppeImmutable = NoeudJeu1EnveloppeImmutable;
function creerNoeudJeu1Immutable(n) {
    return new NoeudJeu1EnveloppeImmutable(n);
}
exports.creerNoeudJeu1Immutable = creerNoeudJeu1Immutable;
/*
Protocole : cf. structure.org
*/
var TypeMessageJeu1;
(function (TypeMessageJeu1) {
    TypeMessageJeu1[TypeMessageJeu1["INIT"] = 0] = "INIT";
    TypeMessageJeu1[TypeMessageJeu1["SUCCES_INIT"] = 1] = "SUCCES_INIT";
    TypeMessageJeu1[TypeMessageJeu1["VERROU"] = 2] = "VERROU";
    TypeMessageJeu1[TypeMessageJeu1["ACTIF"] = 3] = "ACTIF";
    TypeMessageJeu1[TypeMessageJeu1["SUCCES_ACTIF"] = 4] = "SUCCES_ACTIF";
    TypeMessageJeu1[TypeMessageJeu1["INACTIF"] = 5] = "INACTIF";
    TypeMessageJeu1[TypeMessageJeu1["TRANSIT"] = 6] = "TRANSIT";
    TypeMessageJeu1[TypeMessageJeu1["IGNOR"] = 7] = "IGNOR";
    TypeMessageJeu1[TypeMessageJeu1["FIN"] = 8] = "FIN";
    TypeMessageJeu1[TypeMessageJeu1["ESSAI"] = 9] = "ESSAI";
    TypeMessageJeu1[TypeMessageJeu1["SUCCES_TRANSIT"] = 10] = "SUCCES_TRANSIT";
    TypeMessageJeu1[TypeMessageJeu1["ECHEC_TRANSIT"] = 11] = "ECHEC_TRANSIT";
    TypeMessageJeu1[TypeMessageJeu1["SUCCES_FIN"] = 12] = "SUCCES_FIN";
    TypeMessageJeu1[TypeMessageJeu1["ECHEC_FIN"] = 13] = "ECHEC_FIN";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_CONNEXION"] = 14] = "ERREUR_CONNEXION";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_EMET"] = 15] = "ERREUR_EMET";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_DEST"] = 16] = "ERREUR_DEST";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_TYPE"] = 17] = "ERREUR_TYPE";
    TypeMessageJeu1[TypeMessageJeu1["INTERDICTION"] = 18] = "INTERDICTION";
})(TypeMessageJeu1 = exports.TypeMessageJeu1 || (exports.TypeMessageJeu1 = {}));
// Structure immutable
var MessageJeu1 = /** @class */ (function (_super) {
    __extends(MessageJeu1, _super);
    function MessageJeu1(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    MessageJeu1.prototype.net = function (e) {
        var msg = this.val();
        switch (e) {
            case 'ID': return msg.ID.val;
            case 'type': return TypeMessageJeu1[msg.type];
            case 'date': return types_1.creerDateEnveloppe(msg.date).representation();
            case 'ID_de': return msg.ID_origine.val;
            case 'ID_à': return msg.ID_destination.val;
            case 'contenu': return msg.contenu.representation();
        }
        return outils_1.jamais(e);
    };
    MessageJeu1.prototype.representation = function () {
        var idm = this.net('ID');
        var dem = this.net('ID_de');
        var am = this.net('ID_à');
        var typem = this.net('type');
        var datem = this.net('date');
        var cm = this.net('contenu');
        return idm + " - " + datem + ", de " + dem + " à " + am + " (" + typem + ") - " + cm;
    };
    // Client : envoyer au serveur avec une destination (un domaine).
    MessageJeu1.prototype.avecAdresse = function (id_destination) {
        var msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: id_destination,
            type: msg.type,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    // Serveur : Identifier le message INIT.
    MessageJeu1.prototype.avecIdentifiant = function (id) {
        var msg = this.val();
        return new MessageJeu1({
            ID: id,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: msg.type,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    // Serveur : diffuser un message à un domaine.
    MessageJeu1.prototype.sansEmetteurPourTransit = function () {
        var msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: exports.utilisateurInconnu,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: TypeMessageJeu1.TRANSIT,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    // Client : verrouiller un message en transit.
    MessageJeu1.prototype.pourVerrouiller = function (id_emetteur, id_origine) {
        var msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: id_emetteur,
            ID_origine: id_origine,
            ID_destination: exports.sommetInconnu,
            type: TypeMessageJeu1.VERROU,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    // Serveur : Accuser réception.
    MessageJeu1.prototype.avecAccuseReception = function (type) {
        var msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: type,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    // 4. Client : Ignorer un message en TRANSIT (IGNOR).
    MessageJeu1.prototype.aIgnorer = function () {
        var msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: TypeMessageJeu1.IGNOR,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    // 5. Client : Consulter un message en TRANSIT (FIN).
    MessageJeu1.prototype.aConsulter = function () {
        var msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: TypeMessageJeu1.FIN,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    // 5. Client : tester un message en FIN.
    MessageJeu1.prototype.aEssayer = function (contenu) {
        var msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: exports.sommetInconnu,
            ID_destination: exports.sommetInconnu,
            type: TypeMessageJeu1.ESSAI,
            contenu: contenu,
            date: msg.date
        });
    };
    return MessageJeu1;
}(communication_1.Message));
exports.MessageJeu1 = MessageJeu1;
// Client : Produire un message INIT.
function creerMessageInitial(id_emetteur, id_origine, contenu) {
    return new MessageJeu1({
        ID: exports.messageInconnu,
        ID_emetteur: id_emetteur,
        ID_origine: id_origine,
        ID_destination: exports.sommetInconnu,
        type: TypeMessageJeu1.INIT,
        contenu: contenu,
        date: types_1.creerDateMaintenant().val()
    });
}
exports.creerMessageInitial = creerMessageInitial;
function creerMessageEnveloppe(msg) {
    return new MessageJeu1(msg);
}
exports.creerMessageEnveloppe = creerMessageEnveloppe;
var Utilisateur = /** @class */ (function (_super) {
    __extends(Utilisateur, _super);
    function Utilisateur(u) {
        return _super.call(this, function (x) { return x; }, u) || this;
    }
    Utilisateur.prototype.net = function (e) {
        var u = this.val();
        switch (e) {
            case 'ID': return u.ID.val;
            case 'nom':
                return binaire_1.creerMot(u.pseudo).representation();
        }
        return outils_1.jamais(e);
    };
    Utilisateur.prototype.representation = function () {
        return this.net('nom') + " (" + this.net('ID') + ")";
    };
    return Utilisateur;
}(types_1.Enveloppe));
exports.Utilisateur = Utilisateur;
function creerUtilisateur(u) {
    return new Utilisateur(u);
}
exports.creerUtilisateur = creerUtilisateur;
function creerPopulationLocaleVide() {
    return types_1.creerTableIdentificationMutableVide('utilisateur', function (x) { return x; });
}
exports.creerPopulationLocaleVide = creerPopulationLocaleVide;
function creerPopulationLocale(pop) {
    return types_1.creerTableIdentificationMutable('utilisateur', function (x) { return x; }, pop);
}
exports.creerPopulationLocale = creerPopulationLocale;
function peuplerPopulationLocale(prefixe, noms) {
    var identification = types_1.creerIdentificationParCompteur(prefixe);
    var pop = creerPopulationLocaleVide();
    noms.forEach(function (nom, i, tab) {
        var u = { ID: identification.identifier('utilisateur'), pseudo: tab[i].tableauBinaire() };
        pop.ajouter(u.ID, u);
    });
    return pop;
}
exports.peuplerPopulationLocale = peuplerPopulationLocale;
var ConfigurationJeu1 = /** @class */ (function (_super) {
    __extends(ConfigurationJeu1, _super);
    function ConfigurationJeu1(c) {
        return _super.call(this, function (x) { return x; }, c) || this;
    }
    ConfigurationJeu1.prototype.net = function (e) {
        var config = this.val();
        switch (e) {
            case 'centre': return creerSommetJeu1(config.centre).representation();
            case 'population':
                return types_1.creerTableIdentificationImmutable('utilisateur', config.population).representation();
            case 'utilisateur': return creerUtilisateur(config.utilisateur).representation();
            case 'voisins': return types_1.creerTableIdentificationImmutable('sommet', config.voisins).representation();
            case 'date': return types_1.creerDateEnveloppe(config.date).representation();
        }
        return outils_1.jamais(e);
    };
    ConfigurationJeu1.prototype.representation = function () {
        var c = this.net('centre');
        var pop = this.net('population');
        var util = this.net('utilisateur');
        var v = this.net('voisins');
        var d = this.net('date');
        return "(centre : " + c
            + " ; population : " + pop
            + " ; utilisateur : " + util
            + " ; voisins : " + v
            + " ; créé à : " + d + ")";
    };
    return ConfigurationJeu1;
}(communication_1.Configuration));
exports.ConfigurationJeu1 = ConfigurationJeu1;
function creerConfigurationJeu1(c) {
    return new ConfigurationJeu1(c);
}
exports.creerConfigurationJeu1 = creerConfigurationJeu1;
function composerConfigurationJeu1(n, pop, u, date) {
    return new ConfigurationJeu1({
        configurationInitiale: types_1.Unite.ZERO,
        centre: n.centre,
        population: pop,
        utilisateur: u,
        voisins: n.voisins,
        date: date
    });
}
exports.composerConfigurationJeu1 = composerConfigurationJeu1;
function decomposerConfiguration(c) {
    var config = c.val();
    var centre = config.centre;
    var voisins = config.voisins;
    var n = { "centre": centre, "voisins": voisins };
    var pop = config.population;
    var u = config.utilisateur;
    return [n, pop, u];
}
exports.decomposerConfiguration = decomposerConfiguration;
var ErreurJeu1 = /** @class */ (function (_super) {
    __extends(ErreurJeu1, _super);
    function ErreurJeu1(err) {
        return _super.call(this, function (x) { return x; }, err) || this;
    }
    ErreurJeu1.prototype.net = function (e) {
        var erreur = this.val();
        switch (e) {
            case 'messageErreur': return erreur.messageErreur;
            case 'date': return types_1.creerDateEnveloppe(erreur.date).representation();
        }
        return outils_1.jamais(e);
    };
    ErreurJeu1.prototype.representation = function () {
        return "[" + this.net('date') + " : " + this.net('messageErreur') + "]";
    };
    return ErreurJeu1;
}(communication_1.ErreurRedhibitoire));
exports.ErreurJeu1 = ErreurJeu1;
function creerErreurJeu1(err) {
    return new ErreurJeu1(err);
}
exports.creerErreurJeu1 = creerErreurJeu1;
function composerErreurJeu1(msg, date) {
    return new ErreurJeu1({
        erreurRedhibitoire: types_1.Unite.ZERO,
        messageErreur: msg,
        date: date
    });
}
exports.composerErreurJeu1 = composerErreurJeu1;
function creerAnneauJeu1(domaines) {
    var assembleur = communication_1.creerAssemblageReseauEnAnneau(domaines.length, creerNoeudSansVoisinsJeu1Mutable);
    var identification = types_1.creerIdentificationParCompteur("DOM-");
    domaines.forEach(function (dom, i, tab) {
        var s = { ID: identification.identifier('sommet'), domaine: tab[i].tableauBinaire() };
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}
exports.creerAnneauJeu1 = creerAnneauJeu1;
var TableUtilisateurs = /** @class */ (function (_super) {
    __extends(TableUtilisateurs, _super);
    function TableUtilisateurs() {
        return _super.call(this, 'utilisateur', function (x) { return x; }) || this;
    }
    return TableUtilisateurs;
}(types_1.TableIdentificationMutable));
var PopulationParDomaineMutable = /** @class */ (function (_super) {
    __extends(PopulationParDomaineMutable, _super);
    function PopulationParDomaineMutable() {
        return _super.call(this, 'sommet', function (t) { return t.val(); }) || this;
    }
    PopulationParDomaineMutable.prototype.contientUtilisateur = function (ID_dom, ID_util) {
        if (!this.contient(ID_dom)) {
            return false;
        }
        return this.valeurEtat(ID_dom).contient(ID_util);
    };
    PopulationParDomaineMutable.prototype.utilisateur = function (ID_dom, ID_util) {
        return this.valeurEtat(ID_dom).valeur(ID_util);
    };
    PopulationParDomaineMutable.prototype.ajouterDomaine = function (ID_dom) {
        this.ajouter(ID_dom, new TableUtilisateurs());
    };
    PopulationParDomaineMutable.prototype.ajouterUtilisateur = function (ID_dom, u) {
        this.valeurEtat(ID_dom).ajouter(u.ID, u);
    };
    PopulationParDomaineMutable.prototype.retirerUtilisateur = function (ID_dom, ID_util) {
        this.valeurEtat(ID_dom).retirer(ID_util);
    };
    PopulationParDomaineMutable.prototype.selectionnerUtilisateur = function () {
        var ID_dom = this.selectionCleSuivantCritereEtat(function (pop) { return !pop.estVide(); });
        var ID_util = this.valeurEtat(ID_dom).selectionCle();
        return [ID_dom, ID_util];
    };
    return PopulationParDomaineMutable;
}(types_1.TableIdentificationMutable));
exports.PopulationParDomaineMutable = PopulationParDomaineMutable;
function creerVidePopulationParDomaine() {
    return new PopulationParDomaineMutable();
}
exports.creerVidePopulationParDomaine = creerVidePopulationParDomaine;
function assemblerPopulationParDomaine(reseau, noms) {
    var popDom = creerVidePopulationParDomaine();
    reseau.iterer(function (ID_dom, n) {
        popDom.ajouterDomaine(ID_dom);
        var popLoc = peuplerPopulationLocale("UTIL-" + ID_dom.val + "-", noms);
        popLoc.iterer(function (ID_util, u) {
            popDom.ajouterUtilisateur(ID_dom, u);
        });
    });
    return popDom;
}
exports.assemblerPopulationParDomaine = assemblerPopulationParDomaine;
function creerTableMutableUtilisateurParMessageParDomaine() {
    return types_1.creerTableIdentificationMutableVide('sommet', function (x) { return x; });
}
exports.creerTableMutableUtilisateurParMessageParDomaine = creerTableMutableUtilisateurParMessageParDomaine;
//# sourceMappingURL=jeu1_adressageRoutage.js.map