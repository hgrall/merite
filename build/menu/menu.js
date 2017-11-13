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
var BoutonJeu_1 = require("./composants/BoutonJeu");
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(props) {
        return _super.call(this, props) || this;
    }
    Menu.prototype.render = function () {
        var jeux = [
            {
                nom: "Chat",
                disabled: false,
                link: "/Chat/"
            },
            {
                nom: "Adressage et Routage",
                disabled: true,
                link: ""
            },
            {
                nom: "Jeu 3",
                disabled: true,
                link: ""
            },
            {
                nom: "Jeu 4",
                disabled: true,
                link: ""
            },
            {
                nom: "Jeu 5",
                disabled: true,
                link: ""
            }
        ];
        return (React.createElement("div", null, jeux.map(function (jeu) {
            return React.createElement(BoutonJeu_1.BoutonJeu, { nom: jeu.nom, disabled: jeu.disabled, link: jeu.link });
        })));
    };
    return Menu;
}(React.Component));
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map