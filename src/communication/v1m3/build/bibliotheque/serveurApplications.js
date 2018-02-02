"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var sysFichier = require("fs");
var types_1 = require("./types");
/*
Serveur utilisant Express
http://expressjs.com/en/api.html
*/
/*
Classe à développer
*/
var Interaction = /** @class */ (function () {
    function Interaction(requete, reponse, suite) {
        this._requete = requete;
        this._reponse = reponse;
        this._suite = suite;
    }
    Interaction.prototype.servirVueDynamiquement = function (prefixe, remplacement) {
        this._reponse.render(prefixe, remplacement);
    };
    Interaction.prototype.servirFichier = function (chemin, fichier) {
        var options = {
            root: chemin,
        };
        this._reponse.sendFile(fichier, options);
    };
    Interaction.prototype.servirContenuSimple = function (contenu) {
        this._reponse.send(contenu);
    };
    return Interaction;
}());
exports.Interaction = Interaction;
var ServeurApplications = /** @class */ (function () {
    function ServeurApplications(port) {
        this.appli = express();
        this.port = port;
    }
    ServeurApplications.prototype.serveurHttp = function () {
        return this.serveur;
    };
    ServeurApplications.prototype.demarrer = function () {
        var _this = this;
        var ceServeur = this;
        this.serveur =
            this.appli.listen(this.port, function () {
                console.log("* " + types_1.creerDateMaintenant().representationLog()
                    + " - Le serveur écoute le port " + _this.port + " de l'hôte (local ou heroku).");
            });
    };
    /*
    Les pages se terminant par suffixe sont paramétrées.
    Attention : le typage de la paramétrisation n'est pas vérifié.
    */
    ServeurApplications.prototype.definirParametrisationVuesDynamique = function (suffixe, rep, cles) {
        this.appli.engine(suffixe, function (chemin, remplacement, continuation) {
            sysFichier.readFile(chemin, function (err, contenu) {
                if (err)
                    return continuation(err);
                var rendu = contenu.toString();
                cles.forEach(function (c, i, tab) {
                    rendu = rendu.replace("#" + c + "#", remplacement[c]);
                });
                return continuation(err, rendu);
            });
        });
        this.appli.set('view engine', suffixe); // enregistre la paramétrisation
        this.appli.set('views', rep); // spécifie le répertoire des vues dynamiques
    };
    /*    specifierRepertoireVuesStatiques(rep : string) : void {
        TODO ???
    }*/
    ServeurApplications.prototype.specifierRepertoireScriptsEmbarques = function (rep) {
        this.appli.use(express.static(rep)); // répertoire local visible
    };
    ServeurApplications.prototype.enregistrerReponseARequeteGET = function (chemin, calcul) {
        this.appli.get(chemin, function (requete, reponse, suite) {
            calcul(new Interaction(requete, reponse, suite));
        });
    };
    return ServeurApplications;
}());
exports.ServeurApplications = ServeurApplications;
//# sourceMappingURL=serveurApplications.js.map