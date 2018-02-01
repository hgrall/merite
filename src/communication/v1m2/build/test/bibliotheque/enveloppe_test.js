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
var chai = require("chai");
var types_1 = require("../../bibliotheque/types");
var outils_1 = require("../../bibliotheque/outils");
var Test = /** @class */ (function (_super) {
    __extends(Test, _super);
    function Test(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    Test.prototype.net = function (e) {
        var s = this.etat();
        switch (e) {
            case 'rep': return s.a.toString() + " - " + s.b;
        }
        return outils_1.jamais(e);
    };
    Test.prototype.representation = function () {
        return this.net('rep');
    };
    return Test;
}(types_1.Enveloppe));
describe('fonction Enveloppe.brut', function () {
    var t = new Test({ a: 3, b: "coco" });
    var oracle = JSON.stringify({ a: 3, b: "coco" });
    var r = t.brut();
    it('renvoie ' + r, function () {
        chai.expect(r).to.equal(oracle);
    });
});
describe('fonction Enveloppe.brut', function () {
    var t = new Test({ a: 3, b: "coco" });
    var oracle = JSON.stringify({ a: 3, b: "coco" });
    var r = t.brut();
    it('renvoie ' + r, function () {
        chai.expect(r).to.equal(oracle);
    });
});
//# sourceMappingURL=enveloppe_test.js.map