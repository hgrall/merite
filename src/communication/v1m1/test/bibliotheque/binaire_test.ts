import * as chai from 'chai';
import * as mocha from 'mocha';

import { creerMot, binaire, premiersBinaires, Mot } from "../../bibliotheque/binaire";
import { Deux } from "../../bibliotheque/types";

describe('fonction binaire', () => {
    let oracle = creerMot([Deux.ZERO]);
    let arg = 0;
    let r: Mot = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});

describe('fonction binaire', () => {
    let oracle = creerMot([Deux.UN]);
    let arg = 1;
    let r = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});

describe('fonction binaire', () => {
    let oracle = creerMot([Deux.UN, Deux.ZERO]);
    let arg = 2;
    let r = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.valeur(1)).to.equal(oracle.valeur(1));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});

describe('fonction binaire', () => {
    let oracle = creerMot([Deux.UN, Deux.UN]);
    let arg = 3;
    let r = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.valeur(0)).to.equal(oracle.valeur(0));
        chai.expect(r.valeur(1)).to.equal(oracle.valeur(1));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});


describe('fonction premiersBinaires', () => {
    let oracle = [[Deux.ZERO], [Deux.UN], [Deux.UN, Deux.ZERO]].map(m => creerMot(m).representation()).toString();
    let arg = 3;
    let r = premiersBinaires(arg).map(m => m.representation()).toString();
    it('renvoie ' + r + ' pour ' + arg, () => {
        chai.expect(r).to.equal(oracle);
    });
});

describe('fonction base2', () => {
    let oracle = "UN.UN.UN";
    let arg = 7;
    let r = binaire(7);
    it('renvoie ' + r.base2() + ' pour ' + arg, () => {
        chai.expect(r.base2()).to.equal(oracle);
    });
});

describe('fonction base10', () => {
    let oracle = 7;
    let arg = 7;
    let r = binaire(7);
    it('renvoie ' + r.base10().toString() + ' pour ' + arg, () => {
        chai.expect(r.base10()).to.equal(oracle);
    });
});
