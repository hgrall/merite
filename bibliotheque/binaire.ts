import {
    Deux,
} from "./types/mutable";

import {
    TableauImmutable, FormatTableauImmutable
} from "./types/tableau";

import {
    jamais
} from "./outils";


export type FormatMot = FormatTableauImmutable<Deux>;

export class Mot
    extends TableauImmutable<Deux> {

    constructor(etat: FormatMot) {
        super(etat);
    }

    representation(): string {
        return "[" + this.net('valeurs') + "]";
    }

    base2(): string {
        return this.foncteur(v => Deux[v]).reduction("", (x, y) => x + "." + y).slice(1);
    }
    base10(): number {
        return parseInt(this.foncteur(v => v.toString()).reduction("", (x, y) => x + y), 2);
    }
    tableauBinaire(): ReadonlyArray<Deux> {
         return this.val;
    }
}

export function creerMot(mot: ReadonlyArray<Deux>): Mot {
    return new Mot({
        taille: mot.length,
        tableau: mot
    });
}

export function binaire(n: number): Mot {
    let s: string[] = Array.from(n.toString(2));
    return creerMot(s.map((v, i, t) => {
        switch (v) {
            case '0': return Deux.ZERO;
            case '1': return Deux.UN;
            default:
                throw new Error(
                    "[Erreur : binaire(" + n.toString + ") non défini.");
        }
    }));
}

export function premiersBinaires(n: number): Mot[] {
    let r = [];
    for (let i = 0; i < n; i++) {
        r.push(i);
    }
    return r.map((v, i, tab) => binaire(v));
}