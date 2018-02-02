"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var binaire_1 = require("../../bibliotheque/binaire");
var types_1 = require("../../bibliotheque/types");
describe('fonction binaire', function () {
    var oracle = binaire_1.creerMot([types_1.Deux.ZERO]);
    var arg = 0;
    var r = binaire_1.binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, function () {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});
describe('fonction binaire', function () {
    var oracle = binaire_1.creerMot([types_1.Deux.UN]);
    var arg = 1;
    var r = binaire_1.binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, function () {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});
describe('fonction binaire', function () {
    var oracle = binaire_1.creerMot([types_1.Deux.UN, types_1.Deux.ZERO]);
    var arg = 2;
    var r = binaire_1.binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, function () {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.valeur(1)).to.equal(oracle.valeur(1));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});
describe('fonction binaire', function () {
    var oracle = binaire_1.creerMot([types_1.Deux.UN, types_1.Deux.UN]);
    var arg = 3;
    var r = binaire_1.binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, function () {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.valeur(1)).to.equal(oracle.valeur(1));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});
describe('fonction premiersBinaires', function () {
    var oracle = [[types_1.Deux.ZERO], [types_1.Deux.UN], [types_1.Deux.UN, types_1.Deux.ZERO]].map(function (m) { return binaire_1.creerMot(m).representation(); }).toString();
    var arg = 3;
    var r = binaire_1.premiersBinaires(arg).map(function (m) { return m.representation(); }).toString();
    it('renvoie ' + r + ' pour ' + arg, function () {
        chai.expect(r).to.equal(oracle);
    });
});
describe('fonction base2', function () {
    var oracle = "UN.UN.UN";
    var arg = 7;
    var r = binaire_1.binaire(7);
    it('renvoie ' + r.base2() + ' pour ' + arg, function () {
        chai.expect(r.base2()).to.equal(oracle);
    });
});
describe('fonction base10', function () {
    var oracle = 7;
    var arg = 7;
    var r = binaire_1.binaire(7);
    it('renvoie ' + r.base10().toString() + ' pour ' + arg, function () {
        chai.expect(r.base10()).to.equal(oracle);
    });
});
//# sourceMappingURL=binaire_test.js.map