import * as chai from 'chai';
import * as mocha from 'mocha';

import { DateImmutable, creerDateEnveloppe, creerDateMaintenant } from "../../bibliotheque/types/date";

describe('creerDate', () => {
    let r = creerDateMaintenant();
    console.log("Date : " + JSON.stringify(r.val()));
    let oracle = creerDateEnveloppe(r.val());

    it('renvoie ' + r.representation(), () => {
        chai.expect(r.representation()).to.equal(oracle.representation());
    });
});

