"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var types_1 = require("../../bibliotheque/types");
describe('classe TableIdentification', function () {
    var table = types_1.creerTableIdentificationMutableVide('test', function (x) { return x; });
    table.ajouter({ val: "id1", sorte: 'test' }, { a: 1, b: "coco1" });
    table.ajouter({ val: "id2", sorte: 'test' }, { a: 2, b: "coco2" });
    var oracle = 2;
    var r = table.taille();
    it('renvoie ' + r.toString(), function () {
        chai.expect(r).to.equal(oracle);
    });
    console.log("dom : " + table.domaine().map(function (v, i, t) { return v.val; }).toString());
    console.log("image : " + table.image().map(function (v, i, t) { return JSON.stringify(v); }).toString());
    console.log("net : " + table.net('taille'));
    console.log("net : " + table.net('image'));
    console.log("net : " + table.net('domaine'));
    console.log("net : " + table.net('graphe'));
    console.log("sélect : " + JSON.stringify(table.selectionCle()));
    var v = JSON.stringify(table.valeur({ val: "id1", sorte: 'test' }));
    it('renvoie ' + v, function () {
        chai.expect(v).to.equal(JSON.stringify({ a: 1, b: "coco1" }));
    });
    it('renvoie ' + table.estVide(), function () {
        chai.expect(table.estVide()).to.equal(false);
    });
    table.retirer({ val: "id1", sorte: 'test' });
    console.log("image : " + table.image().map(function (v, i, t) { return JSON.stringify(v); }).toString());
    console.log("sélect : " + JSON.stringify(table.selectionCle()));
});
//# sourceMappingURL=tableIdentification_test.js.map