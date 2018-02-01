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
//export const hote: string = "192.168.1.18"; // hôte local via TCP/IP - DNS : cf. /etc/hosts - IP : 127.0.0.1 - ici : "merite"
exports.port1 = Number(process.env.PORT) || 8080; // port de la essource 1 (serveur d'applications)
exports.port2 = Number(process.env.PORT) || 8080; // port de la ressouce 2 (serveur de connexions)
// La structure JSON décrivant le sommet est en lecture seulement. 
var SommetTchat = /** @class */ (function (_super) {
    __extends(SommetTchat, _super);
    function SommetTchat(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    SommetTchat.prototype.net = function (e) {
        var s = this.val();
        switch (e) {
            case 'nom': return s.pseudo;
            case 'ID': return s.ID.val;
        }
        return outils_1.jamais(e);
    };
    SommetTchat.prototype.representation = function () {
        return this.net('nom') + " (" + this.net('ID') + ")";
    };
    return SommetTchat;
}(communication_1.Sommet));
exports.SommetTchat = SommetTchat;
function creerSommetTchat(s) {
    return new SommetTchat(s);
}
exports.creerSommetTchat = creerSommetTchat;
var NoeudTchatEnveloppeMutable = /** @class */ (function (_super) {
    __extends(NoeudTchatEnveloppeMutable, _super);
    function NoeudTchatEnveloppeMutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoeudTchatEnveloppeMutable.prototype.net = function (e) {
        var s = this.val();
        switch (e) {
            case 'centre': return creerSommetTchat(s.centre).representation();
            case 'voisins':
                return types_1.creerTableImmutable(s.voisins).representation();
        }
        return outils_1.jamais(e);
    };
    NoeudTchatEnveloppeMutable.prototype.representation = function () {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    };
    return NoeudTchatEnveloppeMutable;
}(communication_1.NoeudEnveloppeMutable));
function creerNoeudTchatMutable(n) {
    return new NoeudTchatEnveloppeMutable(n);
}
exports.creerNoeudTchatMutable = creerNoeudTchatMutable;
function creerNoeudSansVoisinsTchatMutable(centre) {
    return new NoeudTchatEnveloppeMutable(communication_1.creerCentreSansVoisins(centre));
}
exports.creerNoeudSansVoisinsTchatMutable = creerNoeudSansVoisinsTchatMutable;
var NoeudTchatEnveloppeImmutable = /** @class */ (function (_super) {
    __extends(NoeudTchatEnveloppeImmutable, _super);
    function NoeudTchatEnveloppeImmutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoeudTchatEnveloppeImmutable.prototype.net = function (e) {
        var s = this.val();
        switch (e) {
            case 'centre': return creerSommetTchat(s.centre).representation();
            case 'voisins':
                return types_1.creerTableImmutable(s.voisins).representation();
        }
        return outils_1.jamais(e);
    };
    NoeudTchatEnveloppeImmutable.prototype.representation = function () {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    };
    return NoeudTchatEnveloppeImmutable;
}(communication_1.NoeudEnveloppeImmutable));
function creerNoeudTchatImmutable(n) {
    return new NoeudTchatEnveloppeImmutable(n);
}
exports.creerNoeudTchatImmutable = creerNoeudTchatImmutable;
var TypeMessageTchat;
(function (TypeMessageTchat) {
    TypeMessageTchat[TypeMessageTchat["COM"] = 0] = "COM";
    TypeMessageTchat[TypeMessageTchat["TRANSIT"] = 1] = "TRANSIT";
    TypeMessageTchat[TypeMessageTchat["AR"] = 2] = "AR";
    TypeMessageTchat[TypeMessageTchat["ERREUR_CONNEXION"] = 3] = "ERREUR_CONNEXION";
    TypeMessageTchat[TypeMessageTchat["ERREUR_EMET"] = 4] = "ERREUR_EMET";
    TypeMessageTchat[TypeMessageTchat["ERREUR_DEST"] = 5] = "ERREUR_DEST";
    TypeMessageTchat[TypeMessageTchat["ERREUR_TYPE"] = 6] = "ERREUR_TYPE";
    TypeMessageTchat[TypeMessageTchat["INTERDICTION"] = 7] = "INTERDICTION";
})(TypeMessageTchat = exports.TypeMessageTchat || (exports.TypeMessageTchat = {}));
// Structure immutable
var MessageTchat = /** @class */ (function (_super) {
    __extends(MessageTchat, _super);
    function MessageTchat(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    MessageTchat.prototype.net = function (e) {
        var msg = this.val();
        switch (e) {
            case 'type': return TypeMessageTchat[msg.type];
            case 'date': return types_1.creerDateEnveloppe(msg.date).representation();
            case 'ID_de': return msg.ID_emetteur.val;
            case 'ID_à': return msg.ID_destinataire.val;
            case 'contenu': return msg.contenu;
        }
        return outils_1.jamais(e);
    };
    MessageTchat.prototype.representation = function () {
        var dem = this.net('ID_de');
        var am = this.net('ID_à');
        var typem = this.net('type');
        var datem = this.net('date');
        var cm = this.net('contenu');
        return datem + ", de " + dem + " à " + am + " (" + typem + ") - " + cm;
    };
    MessageTchat.prototype.transit = function () {
        var msg = this.val();
        return new MessageTchat({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageTchat.TRANSIT,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    MessageTchat.prototype.avecAccuseReception = function () {
        var msg = this.val();
        return new MessageTchat({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageTchat.AR,
            contenu: msg.contenu,
            date: msg.date
        });
    };
    return MessageTchat;
}(communication_1.Message));
exports.MessageTchat = MessageTchat;
function creerMessageErreurConnexion(id, idEmetteur, messageErreur) {
    return new MessageTchat({
        ID: id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idEmetteur,
        type: TypeMessageTchat.ERREUR_CONNEXION,
        contenu: messageErreur,
        date: types_1.creerDateMaintenant().val()
    });
}
exports.creerMessageErreurConnexion = creerMessageErreurConnexion;
function creerMessageCommunication(id, idEmetteur, idDestinataire, texte, date) {
    return new MessageTchat({
        ID: id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idDestinataire,
        type: TypeMessageTchat.COM,
        contenu: texte,
        date: date
    });
}
exports.creerMessageCommunication = creerMessageCommunication;
function creerMessageRetourErreur(original, codeErreur, messageErreur) {
    return new MessageTchat({
        ID: original.val().ID,
        ID_emetteur: original.val().ID_emetteur,
        ID_destinataire: original.val().ID_destinataire,
        type: codeErreur,
        contenu: messageErreur,
        date: original.val().date
    });
}
exports.creerMessageRetourErreur = creerMessageRetourErreur;
var ConfigurationTchat = /** @class */ (function (_super) {
    __extends(ConfigurationTchat, _super);
    function ConfigurationTchat(c) {
        return _super.call(this, function (x) { return x; }, c) || this;
    }
    ConfigurationTchat.prototype.net = function (e) {
        var config = this.val();
        switch (e) {
            case 'centre': return creerSommetTchat(config.centre).representation();
            case 'voisins': return types_1.creerTableImmutable(config.voisins).representation();
            case 'date': return types_1.creerDateEnveloppe(config.date).representation();
        }
        return outils_1.jamais(e);
    };
    ConfigurationTchat.prototype.representation = function () {
        var cc = this.net('centre');
        var vc = this.net('voisins');
        var dc = this.net('date');
        return "(centre : " + cc + " ; voisins : " + vc + ") créée " + dc;
    };
    return ConfigurationTchat;
}(communication_1.Configuration));
exports.ConfigurationTchat = ConfigurationTchat;
function creerConfigurationTchat(c) {
    return new ConfigurationTchat(c);
}
exports.creerConfigurationTchat = creerConfigurationTchat;
function composerConfigurationTchat(n, date) {
    return new ConfigurationTchat({
        "configurationInitiale": types_1.Unite.ZERO,
        "centre": n.centre,
        "voisins": n.voisins,
        "date": date
    });
}
exports.composerConfigurationTchat = composerConfigurationTchat;
function decomposerConfiguration(c) {
    var centre = c.val().centre;
    var voisins = c.val().voisins;
    return { "centre": centre, "voisins": voisins };
}
exports.decomposerConfiguration = decomposerConfiguration;
var ErreurTchat = /** @class */ (function (_super) {
    __extends(ErreurTchat, _super);
    function ErreurTchat(err) {
        return _super.call(this, function (x) { return x; }, err) || this;
    }
    ErreurTchat.prototype.net = function (e) {
        var erreur = this.val();
        switch (e) {
            case 'messageErreur': return erreur.messageErreur;
            case 'date': return types_1.creerDateEnveloppe(erreur.date).representation();
        }
        return outils_1.jamais(e);
    };
    ErreurTchat.prototype.representation = function () {
        return "[" + this.net('date') + " : " + this.net('messageErreur') + "]";
    };
    return ErreurTchat;
}(communication_1.ErreurRedhibitoire));
exports.ErreurTchat = ErreurTchat;
function creerErreurTchat(err) {
    return new ErreurTchat(err);
}
exports.creerErreurTchat = creerErreurTchat;
function composerErreurTchat(msg, date) {
    return new ErreurTchat({
        "erreurRedhibitoire": types_1.Unite.ZERO,
        "messageErreur": msg,
        "date": date
    });
}
exports.composerErreurTchat = composerErreurTchat;
function creerAnneauTchat(noms) {
    var assembleur = communication_1.creerAssemblageReseauEnAnneau(noms.length, creerNoeudSansVoisinsTchatMutable);
    var identification = types_1.creerIdentificationParCompteur("S-");
    noms.forEach(function (nom, i, tab) {
        var s = { ID: identification.identifier('sommet'), pseudo: tab[i] };
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}
exports.creerAnneauTchat = creerAnneauTchat;
//# sourceMappingURL=tchat.js.map