"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var types_1 = require("../../bibliotheque/types");
describe('classe Table', function () {
    var table = types_1.creerTableMutableVide(function (x) { return x; });
    table.ajouter("a1", { a: 1, b: "coco1" });
    table.ajouter("a2", { a: 2, b: "coco2" });
    var oracle = 2;
    var r = table.taille();
    it('renvoie ' + r.toString(), function () {
        chai.expect(r).to.equal(oracle);
    });
    console.log("dom : " + table.domaine().toString());
    console.log("image : " + table.image().map(function (v, i, t) { return JSON.stringify(v); }).toString());
    it('renvoie ' + table.estVide(), function () {
        chai.expect(table.estVide()).to.equal(false);
    });
    table.retirer("a1");
    console.log("image : " + table.image().map(function (v, i, t) { return JSON.stringify(v); }).toString());
});
//# sourceMappingURL=table_test.js.map