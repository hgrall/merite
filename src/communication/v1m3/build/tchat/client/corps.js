"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var admin_1 = require("./admin");
var action_1 = require("./action");
var couleur_1 = require("./couleur");
var types_1 = require("../../bibliotheque/types");
var client_1 = require("../../bibliotheque/client");
var tchat_1 = require("../commun/tchat");
var ApresAdmin = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    background: ", ";\n    position: fixed;\n    top: 0;\n    left: 24vw;\n    width: calc(1vw);\n    height: calc(100vh);\n    border-style: solid;\n    border-width: 0 0.33vw;\n    border-color: ", ";\n"], ["\n    background: ", ";\n    position: fixed;\n    top: 0;\n    left: 24vw;\n    width: calc(1vw);\n    height: calc(100vh);\n    border-style: solid;\n    border-width: 0 0.33vw;\n    border-color: ", ";\n"])), couleur_1.CADRE, couleur_1.SEPARATION_CADRE);
var ApresAction = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    background: ", ";\n    position: fixed;\n    top: 0;\n    right: 0;\n    width: 1vw;\n    height: 100vh;\n    border-style: solid;\n    border-width: 0 0.33vw;\n    border-color: ", ";\n"], ["\n    background: ", ";\n    position: fixed;\n    top: 0;\n    right: 0;\n    width: 1vw;\n    height: 100vh;\n    border-style: solid;\n    border-width: 0 0.33vw;\n    border-color: ", ";\n"])), couleur_1.CADRE, couleur_1.SEPARATION_CADRE);
var EtatInterfaceTchat;
(function (EtatInterfaceTchat) {
    EtatInterfaceTchat[EtatInterfaceTchat["INITIAL"] = 0] = "INITIAL";
    EtatInterfaceTchat[EtatInterfaceTchat["NORMAL"] = 1] = "NORMAL";
    EtatInterfaceTchat[EtatInterfaceTchat["ERRONE"] = 2] = "ERRONE";
})(EtatInterfaceTchat || (EtatInterfaceTchat = {}));
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
        _this.adresseServeur = location.origin
            .replace(/^http/, 'ws'); // Même url, au protocole près
        _this.messageErreur = "Aucune erreur";
        _this.toutIndividu = {
            ID: types_1.creerIdentifiant('sommet', ID_TOUS),
            nom: "tous",
            fond: couleur_1.COUPLE_FOND_ENCRE_TOUS.fond,
            encre: couleur_1.COUPLE_FOND_ENCRE_TOUS.encre
        };
        _this.individuInconnu = {
            ID: types_1.creerIdentifiant('sommet', ID_INCONNU),
            nom: "inconnu",
            fond: couleur_1.COUPLE_FOND_ENCRE_INCONNU.fond,
            encre: couleur_1.COUPLE_FOND_ENCRE_INCONNU.encre
        };
        _this.state = {
            selection: _this.toutIndividu,
            messages: [],
            etatInterface: EtatInterfaceTchat.INITIAL,
        };
        _this.envoyerMessage = _this.envoyerMessage.bind(_this);
        _this.modifierSelection = _this.modifierSelection.bind(_this);
        return _this;
    }
    CorpsBrut.prototype.modifierSelection = function (i) {
        this.setState({ selection: i });
    };
    CorpsBrut.prototype.ajouterMessage = function (m) {
        this.setState(function (etatAvant) { return ({
            messages: etatAvant.messages.concat([m])
        }); });
    };
    CorpsBrut.prototype.individu = function (id) {
        if (id.val === this.individuSujet.ID.val) {
            return this.individuSujet;
        }
        if (this.individusObjets.contient(id)) {
            return this.individusObjets.valeur(id);
        }
        return this.individuInconnu;
    };
    CorpsBrut.prototype.mettreAJourMessageEnvoye = function (id, destinataire) {
        this.setState(function (etatAvant) { return ({
            messages: etatAvant.messages.map(function (v, i, tab) {
                if (v.ID.val === id.val) {
                    return {
                        ID: v.ID,
                        emetteur: v.emetteur,
                        destinataire: v.destinataire,
                        contenu: v.contenu,
                        cachet: v.cachet,
                        accuses: v.accuses.concat([destinataire.fond])
                    };
                }
                else {
                    return v;
                }
            })
        }); });
    };
    CorpsBrut.prototype.envoyerMessage = function (m, d) {
        var _this = this;
        this.ajouterMessage(m);
        if (m.destinataire.ID.val === ID_TOUS) {
            console.log("* Diffusion du message");
            this.individusObjets.iterer(function (c, v) {
                var msg = tchat_1.creerMessageCommunication(m.ID, m.emetteur.ID, v.ID, m.contenu, d.val());
                console.log("- brut : " + msg.brut());
                console.log("- net : " + msg.representation());
                _this.canal.envoyerMessage(msg);
            });
            return;
        }
        var msg = tchat_1.creerMessageCommunication(m.ID, m.emetteur.ID, m.destinataire.ID, m.contenu, d.val());
        console.log("* Envoi du message");
        console.log("- brut : " + msg.brut());
        console.log("- net : " + msg.representation());
        this.canal.envoyerMessage(msg);
    };
    CorpsBrut.prototype.render = function () {
        switch (this.state.etatInterface) {
            case EtatInterfaceTchat.NORMAL:
                return (React.createElement("div", { className: this.props.className },
                    React.createElement(admin_1.Admin, { sujet: this.individuSujet, objets: this.individusObjets.image(), tous: this.toutIndividu, selection: this.state.selection, modifSelection: this.modifierSelection }),
                    React.createElement(ApresAdmin, null),
                    React.createElement(action_1.Action, { sujet: this.individuSujet, messages: this.state.messages, selection: this.state.selection, envoiMessage: this.envoyerMessage }),
                    React.createElement(ApresAction, null)));
            case EtatInterfaceTchat.INITIAL:
                return (React.createElement("h1", null, "Connexion au serveur pour l'initialisation"));
            case EtatInterfaceTchat.ERRONE:
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
            var msg = new tchat_1.MessageTchat(m);
            console.log("* Réception");
            console.log("- du message brut : " + msg.brut());
            console.log("- du message net : " + msg.representation());
            var contenu = m.contenu;
            /* Message en transit */
            if (m.type === tchat_1.TypeMessageTchat.TRANSIT) {
                if (!_this.individusObjets.contient(m.ID_emetteur)) {
                    console.log("- message incohéent");
                    return;
                }
                if (m.ID_destinataire.val !== _this.individuSujet.ID.val) {
                    console.log("- message incohéent");
                    return;
                }
                var emetteur_1 = _this.individusObjets.valeur(m.ID_emetteur);
                var destinataire_1 = _this.individuSujet;
                _this.ajouterMessage({
                    ID: m.ID,
                    emetteur: emetteur_1,
                    destinataire: destinataire_1,
                    cachet: types_1.creerDateEnveloppe(m.date).representation(),
                    contenu: contenu,
                    accuses: []
                });
                return;
            }
            /* Message accusant réception */
            if (m.type === tchat_1.TypeMessageTchat.AR) {
                if (!_this.individusObjets.contient(m.ID_destinataire)) {
                    console.log("- message incohéent");
                    return;
                }
                if (m.ID_emetteur.val !== _this.individuSujet.ID.val) {
                    console.log("- message incohéent");
                    return;
                }
                var destinataire_2 = _this.individusObjets.valeur(m.ID_destinataire);
                _this.mettreAJourMessageEnvoye(m.ID, destinataire_2);
                return;
            }
            /* Messages d'erreur */
            var emetteur;
            var destinataire;
            _this.ajouterMessage({
                ID: _this.generateur.identifier('message'),
                emetteur: _this.individu(m.ID_emetteur),
                destinataire: _this.individu(m.ID_destinataire),
                cachet: types_1.creerDateEnveloppe(m.date).representation(),
                contenu: contenu,
                accuses: []
            });
            /* TODO passer les AR en tableau de couleurs dans les messages*/
        });
        console.log("- du traitement de la configuration");
        this.canal.enregistrerTraitementConfigurationRecue(function (c) {
            var config = tchat_1.creerConfigurationTchat(c);
            console.log("* Réception");
            console.log("- de la configuration brute : " + config.brut());
            console.log("- de la configuration nette : " + config.representation());
            console.log("* Initialisation du noeud du réseau");
            _this.noeud = tchat_1.creerNoeudTchatImmutable(tchat_1.decomposerConfiguration(config));
            _this.individuSujet = {
                ID: _this.noeud.val().centre.ID,
                nom: _this.noeud.val().centre.pseudo,
                fond: couleur_1.COUPLE_FOND_ENCRE_SUJET.fond,
                encre: couleur_1.COUPLE_FOND_ENCRE_SUJET.encre
            };
            _this.generateur = types_1.creerIdentificationParCompteur(_this.individuSujet.ID.val + "-ERR-");
            var suite = new couleur_1.SuiteCouplesFondEncre();
            _this.individusObjets =
                types_1.creerTableIdentificationImmutable('sommet', types_1.creerTableImmutable(_this.noeud.val().voisins).application(function (s) {
                    var c = suite.courant();
                    return {
                        ID: s.ID,
                        nom: s.pseudo,
                        fond: c.fond,
                        encre: c.encre
                    };
                }).val());
            _this.setState({
                etatInterface: EtatInterfaceTchat.NORMAL
            });
        });
        console.log("- du traitement d'une erreur rédhibitoire");
        this.canal.enregistrerTraitementErreurRecue(function (err) {
            var erreur = tchat_1.creerErreurTchat(err);
            console.log("* Réception");
            console.log("- de l'erreur rédhibitoire brute : " + erreur.brut());
            console.log("- de l'erreur rédhibitoire nette : " + erreur.representation());
            console.log("* Affichage de l'erreur");
            _this.messageErreur = erreur.representation();
            _this.setState({
                etatInterface: EtatInterfaceTchat.ERRONE,
            });
        });
    };
    return CorpsBrut;
}(React.Component));
exports.Corps = styled_components_1.default(CorpsBrut)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background: ", "\n"], ["\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background: ", "\n"])), couleur_1.FOND);
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=corps.js.map