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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styled_components_1 = require("styled-components");
var types_1 = require("../../bibliotheque/types");
var couleur_1 = require("./couleur");
var react_textarea_autosize_1 = require("react-textarea-autosize");
var Role;
(function (Role) {
    Role[Role["Emetteur"] = 0] = "Emetteur";
    Role[Role["Recepteur"] = 1] = "Recepteur";
})(Role || (Role = {}));
;
var InterlocuteurBrut = /** @class */ (function (_super) {
    __extends(InterlocuteurBrut, _super);
    function InterlocuteurBrut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InterlocuteurBrut.prototype.render = function () {
        return (React.createElement("div", { className: this.props.className }, ((this.props.role === Role.Emetteur) ? "De : " : "A : ") + this.props.nom));
    };
    return InterlocuteurBrut;
}(React.Component));
var Interlocuteur = styled_components_1.default(InterlocuteurBrut)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        flex: none;\n        background-color: ", ";\n        color : ", ";                \n        text-align: center;\n        padding: 1ex;\n        \n        width: 18ex;\n        margin: 1ex;\n        border-radius: 1ex;\n    "], ["\n        flex: none;\n        background-color: ", ";\n        color : ", ";                \n        text-align: center;\n        padding: 1ex;\n        \n        width: 18ex;\n        margin: 1ex;\n        border-radius: 1ex;\n    "])), function (props) { return props.fond; }, function (props) { return props.encre; });
var MessageFixe = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    flex: auto;\n    background: ", ";\n    color: ", ";\n    text-align: justify;\n    padding: 1ex;\n    \n    min-width: 24ex;\n    max-width: 72ex;\n    margin: 1ex;\n    white-space: pre-wrap;\n    overflow-wrap: break-word;\n"], ["\n    flex: auto;\n    background: ", ";\n    color: ", ";\n    text-align: justify;\n    padding: 1ex;\n    \n    min-width: 24ex;\n    max-width: 72ex;\n    margin: 1ex;\n    white-space: pre-wrap;\n    overflow-wrap: break-word;\n"])), couleur_1.FOND_TEXTE, couleur_1.TEXTE);
var Cachet = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    font-size: x-small;\n    color: ", ";\n    text-align: right;\n"], ["\n    font-size: x-small;\n    color: ", ";\n    text-align: right;\n"])), couleur_1.TEXTE_PALE);
var PastilleBrute = /** @class */ (function (_super) {
    __extends(PastilleBrute, _super);
    function PastilleBrute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PastilleBrute.prototype.render = function () {
        return (React.createElement("div", { className: this.props.className }));
    };
    return PastilleBrute;
}(React.Component));
var Pastille = styled_components_1.default(PastilleBrute)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        display: inline-block;\n        width: 2ex;\n        height: 2ex;\n        border-radius: 100%;\n        background-color: ", ";\n        margin: 0 1ex 0 1ex;\n    "], ["\n        display: inline-block;\n        width: 2ex;\n        height: 2ex;\n        border-radius: 100%;\n        background-color: ", ";\n        margin: 0 1ex 0 1ex;\n    "])), function (props) { return props.fond; });
var ContainerMessageBrut = /** @class */ (function (_super) {
    __extends(ContainerMessageBrut, _super);
    function ContainerMessageBrut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContainerMessageBrut.prototype.render = function () {
        return (React.createElement("div", { className: this.props.className },
            React.createElement(Interlocuteur, { fond: this.props.message.emetteur.fond, encre: this.props.message.emetteur.encre, nom: this.props.message.emetteur.nom, role: Role.Emetteur }),
            React.createElement(MessageFixe, { style: { color: (this.props.message.ID.val.includes('ERR')) ? couleur_1.TEXTE_ERREUR : couleur_1.TEXTE } },
                this.props.message.contenu,
                React.createElement(Cachet, null,
                    this.props.message.accuses.map(function (c) {
                        return React.createElement(Pastille, { fond: c });
                    }),
                    this.props.message.cachet)),
            React.createElement(Interlocuteur, { fond: this.props.message.destinataire.fond, encre: this.props.message.destinataire.encre, nom: this.props.message.destinataire.nom, role: Role.Recepteur })));
    };
    return ContainerMessageBrut;
}(React.Component));
exports.ContainerMessageRecu = styled_components_1.default(ContainerMessageBrut)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    flex: initial;\n    background: ", ";\n    box-shadow: -1ex 1ex 3ex -1ex ", ";\n    border-radius: 1ex; \n    margin: 1ex 1em 1ex 1ex;\n    align-self: flex-end;\n    /* Contrainte : marge plus grande que la largeur des ascenseurs. */\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: flex-start;\n    min-width: 80ex;\n"], ["\n    flex: initial;\n    background: ", ";\n    box-shadow: -1ex 1ex 3ex -1ex ", ";\n    border-radius: 1ex; \n    margin: 1ex 1em 1ex 1ex;\n    align-self: flex-end;\n    /* Contrainte : marge plus grande que la largeur des ascenseurs. */\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: flex-start;\n    min-width: 80ex;\n"])), couleur_1.FOND_TEXTE, function (props) { return props.message.emetteur.fond; });
exports.ContainerMessageEmis = styled_components_1.default(ContainerMessageBrut)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    flex: initial;\n    background: ", ";\n    box-shadow: 1ex 1ex 3ex -1ex ", ";\n    border-radius: 1ex;\n    margin: 1ex 1ex 1ex 1em;\n    align-self: flex-start;\n    /* Contrainte : marge plus grande que la largeur des ascenseurs. */\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: flex-start;\n    min-width: 80ex;\n"], ["\n    flex: initial;\n    background: ", ";\n    box-shadow: 1ex 1ex 3ex -1ex ", ";\n    border-radius: 1ex;\n    margin: 1ex 1ex 1ex 1em;\n    align-self: flex-start;\n    /* Contrainte : marge plus grande que la largeur des ascenseurs. */\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: flex-start;\n    min-width: 80ex;\n"])), couleur_1.FOND_TEXTE, couleur_1.COUPLE_FOND_ENCRE_SUJET.fond);
var styleTexteBrut = {
    alignSelf: "flex-end",
    flex: "auto",
    resize: "vertical",
    overflow: "auto",
    margin: "1ex",
    background: couleur_1.FOND_TEXTE_INV,
    color: couleur_1.TEXTE_INV,
    fontSize: "medium"
};
var EnvoiBrut = /** @class */ (function (_super) {
    __extends(EnvoiBrut, _super);
    function EnvoiBrut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnvoiBrut.prototype.render = function () {
        return (React.createElement("button", { className: this.props.className, onClick: this.props.onClick }, "A : " + this.props.nom));
    };
    return EnvoiBrut;
}(React.Component));
var Envoi = styled_components_1.default(EnvoiBrut)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n        flex: none;\n        background-color: ", ";\n        color : ", ";                \n        text-align: center;\n        padding: 1ex;\n        height: 4ex;\n        width: 18ex;\n        margin: 1ex;\n        border-radius: 1ex;\n    "], ["\n        flex: none;\n        background-color: ", ";\n        color : ", ";                \n        text-align: center;\n        padding: 1ex;\n        height: 4ex;\n        width: 18ex;\n        margin: 1ex;\n        border-radius: 1ex;\n    "])), function (props) { return props.fond; }, function (props) { return props.encre; });
var EntreeMessageBrut = /** @class */ (function (_super) {
    __extends(EntreeMessageBrut, _super);
    function EntreeMessageBrut(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { texte: '' };
        _this.generateur = types_1.creerIdentificationParCompteur(_this.props.sujet.ID.val + "-MSG-");
        _this.mettreAJourEntree = _this.mettreAJourEntree.bind(_this);
        return _this;
    }
    EntreeMessageBrut.prototype.mettreAJourEntree = function (event) {
        this.setState({ texte: event.target.value });
    };
    EntreeMessageBrut.prototype.reinitialiserEntree = function () {
        this.setState({ texte: "" });
    };
    EntreeMessageBrut.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: this.props.className },
            React.createElement(Interlocuteur, { fond: this.props.sujet.fond, encre: this.props.sujet.encre, nom: this.props.sujet.nom, role: Role.Emetteur }),
            React.createElement(react_textarea_autosize_1.default, { value: this.state.texte, placeholder: "Entrez le texte de votre message puis appuyez sur le bouton \u00E0 droite indiquant le destinataire pour l'envoyer.", minRows: 3, cols: 72, style: styleTexteBrut, onChange: this.mettreAJourEntree }),
            React.createElement(Envoi, { fond: this.props.destinataire.fond, encre: this.props.destinataire.encre, nom: this.props.destinataire.nom, role: Role.Recepteur, onClick: function () {
                    var d = types_1.creerDateMaintenant();
                    _this.props.envoiMessage({
                        ID: _this.generateur.identifier('message'),
                        emetteur: _this.props.sujet,
                        destinataire: _this.props.destinataire,
                        cachet: d.representation(),
                        contenu: _this.state.texte,
                        accuses: []
                    }, d);
                    _this.reinitialiserEntree();
                } })));
    };
    return EntreeMessageBrut;
}(React.Component));
exports.EntreeMessage = styled_components_1.default(EntreeMessageBrut)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    flex: initial;\n    background: ", ";\n    box-shadow: 1ex 1ex 3ex -1ex ", ";\n    border-radius: 1ex;\n    margin: 1ex 1ex 1ex 1em;\n    align-self: flex-start;\n    /* Contrainte : marge plus grande que la largeur des ascenseurs. */\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: flex-start;\n    min-width: 80ex;\n    max-width: calc(50vw);\n"], ["\n    flex: initial;\n    background: ", ";\n    box-shadow: 1ex 1ex 3ex -1ex ", ";\n    border-radius: 1ex;\n    margin: 1ex 1ex 1ex 1em;\n    align-self: flex-start;\n    /* Contrainte : marge plus grande que la largeur des ascenseurs. */\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: flex-start;\n    min-width: 80ex;\n    max-width: calc(50vw);\n"])), couleur_1.FOND_TEXTE, couleur_1.COUPLE_FOND_ENCRE_SUJET.fond);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=containersMessages.js.map