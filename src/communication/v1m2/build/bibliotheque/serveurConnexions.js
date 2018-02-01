"use strict";
// Serveur établissant les connexions par Web Socket
// - Configuration à la connexion
// - Communication entre clients
// - Déconnexion
Object.defineProperty(exports, "__esModule", { value: true });
var websocket = require("websocket");
var LienWebSocket = /** @class */ (function () {
    function LienWebSocket(requete) {
        this._connexion = requete.accept('echo-protocol', requete.origin);
        this._adresseIPClient = requete.remoteAddress;
        /* TODO
        console.log("url socket : " + r.resource);
        console.log("url socket : " + r.httpRequest.url);
        console.log("- auth: " + this._url.auth);
        console.log("- hostname: " + this._url.hostname);
        console.log("- port: " + this._url.port);
        console.log("- protocol : " + this._url.protocol);
        console.log("- search: " + this._url.search);
        console.log("- href: " + this._url.href);
        console.log("- path: " + this._url.path);
        console.log("- pathname: " + this._url.pathname);
        */
    }
    LienWebSocket.prototype.adresseClient = function () {
        return this._adresseIPClient;
    };
    LienWebSocket.prototype.enregistrerTraitementMessages = function (traitementMessages) {
        var ceLien = this;
        this._connexion.on('message', function (message) {
            var m = message.utf8Data;
            if (typeof m === "undefined") {
                throw new Error("[Erreur : contenu du message non défini.]");
            }
            var msg = JSON.parse(m.toString());
            traitementMessages(ceLien, msg);
        });
        console.log("- Enregistrement du traitement des messages.");
    };
    LienWebSocket.prototype.enregistrerTraitementFermeture = function (traitementFermeture) {
        var ceLien = this;
        this._connexion.on('close', function (raison, description) {
            traitementFermeture(ceLien, raison, description);
        });
        console.log("- Enregistrement du traitement de la fermeture de la connexion par Web socket.");
    };
    LienWebSocket.prototype.envoyerAuClientDestinataire = function (m) {
        this._connexion.sendUTF(m.brut());
    };
    LienWebSocket.prototype.envoyerConfiguration = function (c) {
        this._connexion.sendUTF(c.brut());
        this._config = c;
    };
    LienWebSocket.prototype.estConfigure = function () {
        return this._config !== undefined;
    };
    LienWebSocket.prototype.configuration = function () {
        return this._config;
    };
    LienWebSocket.prototype.envoyerMessageErreur = function (e) {
        this._connexion.sendUTF(e.brut());
    };
    LienWebSocket.creer = function () { };
    return LienWebSocket;
}());
exports.LienWebSocket = LienWebSocket;
var ServeurLiensWebSocket = /** @class */ (function () {
    function ServeurLiensWebSocket(port) {
        this.port = port;
    }
    ServeurLiensWebSocket.prototype.enregistrerTraitementConnexion = function (traitementConnexion) {
        this.traiterConnexion = traitementConnexion;
    };
    ServeurLiensWebSocket.prototype.enregistrerTraitementFermeture = function (traitementFermeture) {
        this.traiterFermeture = traitementFermeture;
    };
    ServeurLiensWebSocket.prototype.enregistrerTraitementMessages = function (traitementMessages) {
        this.traiterMessages = traitementMessages;
    };
    ServeurLiensWebSocket.prototype.demarrer = function (serveurHttp) {
        var ceServeur = this;
        /*
        let serveurHTTP: http.Server = http.createServer(function (requete, reponse) { });
        let p = this.port;
        serveurHTTP.listen(p, h, function () {
            console.log("* " + creerDateMaintenant().representationLog() + " - Le serveur écoute le port " + p + " de l'hôte " + h + ".");
        });
        */
        var serveurWS = new websocket.server({
            httpServer: serveurHttp
        });
        serveurWS.on('request', function (r) {
            var l = new LienWebSocket(r);
            var estConnecte = ceServeur.traiterConnexion(l);
            if (!estConnecte) {
                return;
            }
            // Enregistre le traitement des messages
            l.enregistrerTraitementMessages(ceServeur.traiterMessages);
            // Enregistre le traitement de la fermeture de la connexion
            l.enregistrerTraitementFermeture(ceServeur.traiterFermeture);
        });
    };
    return ServeurLiensWebSocket;
}());
exports.ServeurLiensWebSocket = ServeurLiensWebSocket;
//# sourceMappingURL=serveurConnexions.js.map