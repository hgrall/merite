"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var types_1 = require("../../bibliotheque/types");
describe('classe IdentificationParCompteur', function () {
    var identification = types_1.creerIdentificationParCompteur("pref-");
    var val = {
        ID: identification.identifier('test'), mutable: types_1.Unite.ZERO
    };
    var r = JSON.stringify(val);
    var oracle = JSON.stringify({ ID: { val: "pref-0", sorte: 'test' }, mutable: types_1.Unite.ZERO });
    it('renvoie ' + r, function () {
        chai.expect(r).to.equal(oracle);
    });
    val = {
        ID: identification.identifier('test'), mutable: types_1.Unite.ZERO
    };
    r = JSON.stringify(val);
    oracle = JSON.stringify({ ID: { val: "pref-1", sorte: 'test' }, mutable: types_1.Unite.ZERO });
    it('renvoie ' + r, function () {
        chai.expect(r).to.equal(oracle);
    });
});
//# sourceMappingURL=identification_test.js.map