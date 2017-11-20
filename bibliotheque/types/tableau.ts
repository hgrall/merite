import { Enveloppe } from "./enveloppe"; 
import { Mutable, Unite } from "./mutable"; 
import { jamais } from "../outils"

export interface FormatTableauMutable<T> extends Mutable {
    readonly taille: number;
    readonly tableau: T[]
}

export interface FormatTableauImmutable<T> {
    readonly taille: number;
    readonly tableau: ReadonlyArray<T>
}

/*
* Module définissant les fonctions utiles pour les structures JSON 
* représentant les tableaux (FormatTableauX).
*/
class FabriqueTableau {

    videMutable<T>(): FormatTableauMutable<T> {
        return { taille: 0, tableau: [], mutable: Unite.ZERO };
    }

    videImmutable<T>(): FormatTableauImmutable<T> {
        return { taille: 0, tableau: [] };
    }

    enveloppeMutable<T>(tab: T[]): FormatTableauMutable<T> {
        return { taille: tab.length, tableau: tab, mutable: Unite.ZERO };
    }

    enveloppeImmutable<T>(tab: ReadonlyArray<T>): FormatTableauImmutable<T> {
        return { taille: tab.length, tableau: tab };
    }
}

const FABRIQUE_TABLEAU = new FabriqueTableau();

class ModuleTableau {
    // permet l'iteration a travers le tableau 
    iterer<T>(
        f: (index: number, val: T, tab?: ReadonlyArray<T>) => void,
        t: FormatTableauImmutable<T>
    ): void {
        t.tableau.forEach((v, i, t) => f(i, v, t));
    }

    // retourne la valeur associé a l'index donné dans le tableau 
    valeur<T>(t: FormatTableauImmutable<T>, index: number): T {
        return t.tableau[index];
    }

    // retourne la taille du tableau 
    taille<T>(t: FormatTableauImmutable<T>): number {
        return t.tableau.length;
    }

    // retourne le tableau avec le resultat de ses valeurs initiales par la fonction f
    foncteur<T, S>(t: FormatTableauImmutable<T>, f: (x: T) => S): FormatTableauMutable<S> {
        let r: S[] = [];
        this.iterer((i, v) => {
            r[i] = f(v);
        }, t);
        return FABRIQUE_TABLEAU.enveloppeMutable(r);
    }

    // reduction du tableau en appliquant la fonction op
    reduction<T>(t: FormatTableauImmutable<T>, neutre: T, op: (x: T, y: T) => T): T {
        let r: T = neutre;
        this.iterer((i, v) => {
            r = op(r, v);
        }, t);
        return r;
    }

    // ajoute un element à la fin du tableau 
    ajouterEnFin<T>(t: FormatTableauMutable<T>, x: T): void {
        t.tableau.push(x);
    }

    // retire un élément a la fin du tableau
    retirerEnFin<T>(t: FormatTableauMutable<T>): T {
        if (t.taille === 0) {
            throw new Error("[Exception : retirerEnFin() non défini.]");
        }
        return <T>t.tableau.pop();
    }

}

const MODULE_TABLEAU = new ModuleTableau();

export type EtiquetteTableau = 'taille' | 'valeurs';

// Conversion pour les tableaux
export function conversionFormatTableau<TIN, TEX>(conv: (x: TIN) => TEX)
    : (t: FormatTableauMutable<TIN>) => FormatTableauImmutable<TEX> {
    return (
        (t: FormatTableauMutable<TIN>) => {
            let r: TEX[] = new Array(t.taille);
            MODULE_TABLEAU.iterer((i, v) => {
                r[i] = conv(v);
            }, t);
            return FABRIQUE_TABLEAU.enveloppeImmutable(r);
        });
}

// Tableau immutable : TIN = TEX (recommandé : immutable)
export class TableauImmutable<TEX>
    extends Enveloppe<FormatTableauImmutable<TEX>, FormatTableauImmutable<TEX>, EtiquetteTableau> {
    constructor(etat: FormatTableauImmutable<TEX>) {
        super((x) => x, etat);
    }
    // retourne la valeau associé a taille ou valeurs en fonction de l'etiquette
    net(e: EtiquetteTableau): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'valeurs': return this.etat().tableau.toString();
        }
        return jamais(e);
    }
    representation(): string {
        return "[" + this.net('valeurs') + "]";
    }

    // les fonctions suivantes ont été décrites lors de leur déclaration plus haut dans le fichier
    iterer(
        f: (index: number, val: TEX, tab?: TEX[]) => void
    ): void {
        MODULE_TABLEAU.iterer(f, this.etat());
    }
    foncteur<S>(f: (x: TEX) => S): TableauImmutable<S> {
        return new TableauImmutable(MODULE_TABLEAU.foncteur(this.etat(), f));
    }
    reduction(neutre: TEX, op: (x: TEX, y: TEX) => TEX): TEX {
        return MODULE_TABLEAU.reduction(this.etat(), neutre, op);
    }
    valeur(index: number): TEX {
        return MODULE_TABLEAU.valeur(this.etat(), index);
    }
    taille(): number {
        return MODULE_TABLEAU.taille(this.etat());
    }
    estVide(): boolean {
        return this.taille() === 0;
    }
}

export function creerTableauImmutable<TEX>(t: ReadonlyArray<TEX>)
    : TableauImmutable<TEX> {
    return new TableauImmutable(FABRIQUE_TABLEAU.enveloppeImmutable(t));
}

// Tableau mutable - TIN peut être différent de TEX.
//   Recommandé : TEX immutable.
// Attention : la méthode val() requiert un parcours du tableau formant l'état.
export class TableauMutable<TIN, TEX>
    extends Enveloppe<FormatTableauMutable<TIN>, FormatTableauImmutable<TEX>, EtiquetteTableau> {

    constructor(
        protected etatVersVal: (x: TIN) => TEX,
        etat: FormatTableauMutable<TIN> = FABRIQUE_TABLEAU.videMutable()) {
        super(conversionFormatTableau(etatVersVal), etat);
    }

    // les fonctions suivantes ont été décrites lors de leur déclaration plus haut dans le fichier
    net(e: EtiquetteTableau): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'valeurs': return this.etat().tableau.toString();
        }
        return jamais(e);
    }
    representation(): string {
        return "[" + this.net('valeurs') + "]";
    }

    protected itererEtat(
        f: (index: number, val: TIN, tab?: TIN[]) => void
    ): void {
        MODULE_TABLEAU.iterer(f, this.etat());
    }

    iterer(
        f: (index: number, val: TEX) => void
    ): void {
        this.itererEtat((i, v, t) => f(i, this.etatVersVal(v)));
    }
    protected valeurEtat(i: number): TIN {
        return MODULE_TABLEAU.valeur(this.etat(), i);
    }

    valeur(i: number): TEX {
        return this.etatVersVal(this.valeurEtat(i));
    }
    taille(): number {
        return MODULE_TABLEAU.taille(this.etat());
    }
    estVide(): boolean {
        return this.taille() === 0;
    }
    ajouterEnFin(x: TIN): void {
        MODULE_TABLEAU.ajouterEnFin(this.etat(), x);
    }
    retirerEnFin(): void {
        MODULE_TABLEAU.retirerEnFin(this.etat());
    }
}

export function creerTableauMutableVide<TIN, TEX>(etatVersVal: (x: TIN) => TEX) {
    return new TableauMutable(etatVersVal);
}

// Partage du tableau passé en argument.
export function creerTableauMutableEnveloppe<TIN, TEX>(etatVersVal: (x: TIN) => TEX, t: TIN[])
    : TableauMutable<TIN, TEX> {
    return new TableauMutable(etatVersVal, FABRIQUE_TABLEAU.enveloppeMutable(t));
}

/*
* Création par copie du tableau.
*/
export function creerTableauMutable<TIN, TEX>(
    etatVersVal: (x: TIN) => TEX,
    t: TIN[]
) {
    let r = creerTableauMutableVide(etatVersVal);
    MODULE_TABLEAU.iterer((c, v) => r.ajouterEnFin(v), FABRIQUE_TABLEAU.enveloppeMutable(t));
    return r;
}