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
var React = require("react");
var styled_components_1 = require("styled-components");
var couleur_1 = require("./couleur");
var client_1 = require("../../bibliotheque/client");
var jeu1_adressageRoutage_1 = require("../commun/jeu1_adressageRoutage");
var EtatInterfaceJeu1;
(function (EtatInterfaceJeu1) {
    EtatInterfaceJeu1[EtatInterfaceJeu1["INITIAL"] = 0] = "INITIAL";
    EtatInterfaceJeu1[EtatInterfaceJeu1["NORMAL"] = 1] = "NORMAL";
    EtatInterfaceJeu1[EtatInterfaceJeu1["ERRONE"] = 2] = "ERRONE";
})(EtatInterfaceJeu1 || (EtatInterfaceJeu1 = {}));
;
var ID_TOUS = "TOUS";
var ID_INCONNU = "?";
/*
 * Degré du graphe limité à 4 - Cf. la liste des couples de couleurs.
 */
var CorpsBrut = /** @class */ (function (_super) {
    __extends(CorpsBrut, _super);
    function CorpsBrut(props) {
        var _this = _super.call(this, props) || this;
        _this.adresseServeur = jeu1_adressageRoutage_1.hote + ":" + jeu1_adressageRoutage_1.port2;
        _this.messageErreur = "Aucune erreur";
        _this.state = {
            etatInterface: EtatInterfaceJeu1.INITIAL,
        };
        return _this;
    }
    CorpsBrut.prototype.render = function () {
        switch (this.state.etatInterface) {
            case EtatInterfaceJeu1.NORMAL:
                return (React.createElement("div", { className: this.props.className },
                    React.createElement("h1", null, "Configuration termin\u00E9e"),
                    this.config.brut(),
                    React.createElement("br", null),
                    this.config.representation()));
            case EtatInterfaceJeu1.INITIAL:
                return (React.createElement("h1", null, "Connexion au serveur pour l'initialisation"));
            case EtatInterfaceJeu1.ERRONE:
                return (React.createElement("div", null,
                    React.createElement("h1", null, "Fin de l'application apr\u00E8s l'erreur suivante : "),
                    React.createElement("div", { style: { color: couleur_1.TEXTE_ERREUR } }, this.messageErreur)));
        }
    };
    CorpsBrut.prototype.componentDidMount = function () {
        var _this = this;
        console.log("* Initialisation après montage du corps");
        console.log("- du canal de communication avec le serveur d'adresse " + this.adresseServeur);
        this.canal = client_1.creerCanalClient(this.adresseServeur);
        console.log("- du traitement des messages");
        this.canal.enregistrerTraitementMessageRecu(function (m) {
            // TODO
        });
        console.log("- du traitement de la configuration");
        this.canal.enregistrerTraitementConfigurationRecue(function (c) {
            _this.config = jeu1_adressageRoutage_1.creerConfigurationJeu1(c);
            console.log("* Réception");
            console.log("- de la configuration brute : " + _this.config.brut());
            console.log("- de la configuration nette : " + _this.config.representation());
            _this.setState({
                etatInterface: EtatInterfaceJeu1.NORMAL
            });
        });
        console.log("- du traitement d'une erreur rédhibitoire");
        this.canal.enregistrerTraitementErreurRecue(function (err) {
            var erreur = jeu1_adressageRoutage_1.creerErreurJeu1(err);
            console.log("* Réception");
            console.log("- de l'erreur rédhibitoire brute : " + erreur.brut());
            console.log("- de l'erreur rédhibitoire nette : " + erreur.representation());
            console.log("* Affichage de l'erreur");
            _this.messageErreur = erreur.representation();
            _this.setState({
                etatInterface: EtatInterfaceJeu1.ERRONE,
            });
        });
    };
    return CorpsBrut;
}(React.Component));
exports.Corps = (_a = ["\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background: ", "\n"], _a.raw = ["\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background: ", "\n"], styled_components_1.default(CorpsBrut)(_a, couleur_1.FOND));
var _a;
//# sourceMappingURL=corps.js.map