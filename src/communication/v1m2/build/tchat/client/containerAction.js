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
var couleur_1 = require("./couleur");
var containersMessages_1 = require("./containersMessages");
var ContenuContainerAction = /** @class */ (function (_super) {
    __extends(ContenuContainerAction, _super);
    function ContenuContainerAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContenuContainerAction.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: this.props.className },
            this.props.messages.map(function (m) {
                return ((m.emetteur.nom === _this.props.sujet.nom) ?
                    React.createElement(containersMessages_1.ContainerMessageEmis, { message: m }) :
                    React.createElement(containersMessages_1.ContainerMessageRecu, { message: m }));
            }),
            React.createElement(containersMessages_1.EntreeMessage, { sujet: this.props.sujet, destinataire: this.props.selection, envoiMessage: this.props.envoiMessage })));
    };
    return ContenuContainerAction;
}(React.Component));
exports.ContainerAction = styled_components_1.default(ContenuContainerAction)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    background: ", ";\n    position: absolute;\n    top: 0;\n    left: 0;\n    /* important / overflow : deux sens haut vers bas et gauche vers droite pour le d\u00E9passement */\n    min-width: calc(74vw);\n    min-height: calc(100vh);\n    /* occupe au moins la place du container */\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-end;\n"], ["\n    background: ", ";\n    position: absolute;\n    top: 0;\n    left: 0;\n    /* important / overflow : deux sens haut vers bas et gauche vers droite pour le d\u00E9passement */\n    min-width: calc(74vw);\n    min-height: calc(100vh);\n    /* occupe au moins la place du container */\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-end;\n"])), couleur_1.FOND);
var templateObject_1;
//# sourceMappingURL=containerAction.js.map