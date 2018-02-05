import { TableauImmutable, FormatTableauImmutable } from './types/tableau';
import { Deux } from './types/mutable';

import { jamais } from './outils';

export type FormatMot = FormatTableauImmutable<Deux>;

export class Mot extends TableauImmutable<Deux> {
  constructor(etat: FormatMot) {
    super(etat);
  }

  representation(): string {
    return '[' + this.net('valeurs') + ']';
  }

  base2(): string {
    return this.foncteur(v => Deux[v])
      .reduction('', (x, y) => x + '.' + y)
      .slice(1);
  }
  base10(): number {
    return parseInt(this.foncteur(v => v.toString()).reduction('', (x, y) => x + y), 2);
  }

  tableauBinaire(): ReadonlyArray<Deux> {
    return this.etat().tableau;
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
  return creerMot(
    s.map((v, i, t) => {
      switch (v) {
        case '0':
          return Deux.ZERO;
        case '1':
          return Deux.UN;
        default:
          throw new Error('[Erreur : binaire(' + n.toString + ') non défini.');
      }
    })
  );
}

export function concatMot(mot1: Mot, mot2: Mot): Mot {
  var tab1 = mot1.val().tableau;
  var tab2 = mot2.val().tableau;
  var total = tab1.concat(tab2);
  return creerMot(total);
}

export function premiersBinaires(n: number): Mot[] {
  let r = [];
  for (let i = 0; i < n; i++) {
    r.push(i);
  }
  return r.map((v, i, tab) => binaire(v));
}

export function motAleatoire(length: number): Mot {
  let r = [];
  for (let i = 0; i < length; i++) {
    r.push(Math.floor(Math.random() * Math.floor(2)));
  }
  return creerMot(r);
}

export function getRandomInt(max: number) {
	return Math.floor(Math.random() * Math.floor(max));
}

export function tableauBinaireAleatoire(nb : number){
  var tableauAleat = binaire(getRandomInt(nb)).tableauBinaire();
  var tableauMax = binaire(nb).tableauBinaire();
  let zero = binaire(0).tableauBinaire();
  while(tableauAleat.length!=tableauMax.length){
    tableauAleat = zero.concat(tableauAleat);
  }
  return tableauAleat;
}