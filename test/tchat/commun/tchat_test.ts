import * as chai from 'chai';
import * as mocha from 'mocha';

import { Identifiant } from "../../../bibliotheque/types/identifiant";

import {  } from "../../../bibliotheque/communication";
import {
    creerMessageErreurConnexion, creerMessageRetourErreur,
    TypeMessageChat, FormatMessageChat, MessageChat
} from '../../../chat/commun/messageChat';
import {
    creerAnneauChat, ReseauChat
} from '../../../chat/commun/reseauChat';



const anneau: ReseauChat= creerAnneauChat(["Morgane", "Elisa", "Loïc", "Jules"]);

let IDs_noeuds = anneau.identifiantsNoeuds();

for (let j in IDs_noeuds) {
    describe('fonction creerAnneauChat', () => {
        describe('méthode TableIdentification.possedeNoeud ', () => {
            it('renvoie true', () => {
                let res = anneau.possedeNoeud(IDs_noeuds[j]);
                chai.expect(res).to.equal(true);
            });
        })
    });
}

describe('fonction creerAnneauChat', () => {
    let ID_n : Identifiant<'sommet'> = { val : "mauvaise", sorte : 'sommet' }
    describe('méthode TableIdentification.possedeNoeud ', () => {
        it('renvoie false', () => {
            let res = anneau.possedeNoeud(ID_n);
            chai.expect(res).to.equal(false);
        });
    })
});

for (let j in IDs_noeuds) {
    describe('fonction creerAnneauChat', () => {
        describe('méthode TableIdentification.valeur', () => {
            console.log(j);
            console.log(JSON.stringify(anneau.noeud(IDs_noeuds[j])));
            let ID_res = anneau.noeud(IDs_noeuds[j]).centre.ID;
            it('renvoie ' + ID_res.val, () => {
                chai.expect(ID_res.val).to.equal(IDs_noeuds[j].val);
            });
        })
    });
}
