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
var RaisedButton_1 = require("material-ui/RaisedButton");
var react_router_dom_1 = require("react-router-dom");
var BoutonJeu = /** @class */ (function (_super) {
    __extends(BoutonJeu, _super);
    function BoutonJeu(props) {
        return _super.call(this, props) || this;
    }
    BoutonJeu.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(RaisedButton_1.default, { label: this.props.nom, disabled: this.props.disabled, fullWidth: true, primary: true, containerElement: React.createElement(react_router_dom_1.Link, { to: this.props.link }) })));
    };
    return BoutonJeu;
}(React.Component));
exports.BoutonJeu = BoutonJeu;
//# sourceMappingURL=BoutonJeu.js.map