import {Mutable, Unite} from "./mutable";
import {Enveloppe} from "./enveloppe";
import {jamais} from "../outils"

/* ***********************************************************************************************
 * Tables.
 * On définit un format pour les tables car il est impossible d'avoir un type indexé avec un champ 
 * supplémentaire comme ci-dessous :
 * { [cle: string]: T }, mutable : Unite
*/
export interface FormatTableMutable<T> extends Mutable {
    readonly table: { [cle: string]: T }
}

export interface FormatTableImmutable<T> {
    readonly table: { readonly [cle: string]: T }
}

// Un module réservoir de fonctions utiles sur les tables.

class FabriqueTable {

    videMutable<T>(): FormatTableMutable<T> {
        return { table: {}, mutable: Unite.ZERO };
    }

    videImmutable<T>(): FormatTableImmutable<T> {
        return { table: {} };
    }

    enveloppeMutable<T>(tab: { [cle: string]: T; }): FormatTableMutable<T> {
        return { table: tab, mutable: Unite.ZERO };
    }

    enveloppeImmutable<T>(tab: { readonly [cle: string]: T }): FormatTableImmutable<T> {
        return { table: tab };
    }

}

export const FABRIQUE_TABLE = new FabriqueTable();

class ModuleTable {
    // iteration a travers la table 
    iterer<T>(
        f: (cle: string, val: T, tab?: { [cle: string]: T }) => void,
        t: FormatTableImmutable<T>
    ): void {
        for (let c in t.table) {
            f(c, t.table[c], t.table);
        }
    }

    // valeur de la clé associé a la table
    valeur<T>(t: FormatTableImmutable<T>, cle: string): T {
        return t.table[cle];
    }

    // retourne true si la table contient la clé
    contient<T>(t: FormatTableImmutable<T>, cle: string): boolean {
        if (t.table[cle]) {
            return true;
        }
        return false;;
    }

    // retourne la liste des valeurs de la clé
    image<T>(t: FormatTableImmutable<T>): T[] {
        let tab: T[] = [];
        this.iterer((c, v) => {
            tab.push(v);
        }, t);
        return tab;
    }

    // retourne la liste des clés de la table 
    domaine<T>(t: FormatTableImmutable<T>): string[] {
        let tab: string[] = [];
        this.iterer((c, v) => {
            tab.push(c);
        }, t);
        return tab;
    }

    // retourne le nombre de clés de la table
    taille<T>(t: FormatTableImmutable<T>): number {
        let n: number = 0;
        this.iterer((c, v) => {
            n++;
        }, t);
        return n;
    }

    // retourne la table avec le resultat de l'appel de f sur les valeurs
    foncteur<T, S>(t: FormatTableImmutable<T>, f: (x: T) => S): FormatTableMutable<S> {
        let r: { [cle: string]: S }
            = {};
        this.iterer((c, v) => {
            r[c] = f(v);
        }, t);
        return FABRIQUE_TABLE.enveloppeMutable(r);
    }

    // transforme la table vers le tableau 
    transformationTableVersTableau<T, S>(t: FormatTableImmutable<T>, f: (cle: string, x: T) => S): S[] {
        let r: S[] = [];
        this.iterer((c, v) => {
            r.push(f(c, v));
        }, t);
        return r;
    }

    // retourne la premiere clé trouvé si elle existe 
    selectionCle<T>(t: FormatTableImmutable<T>): string {
        // sélection d'une clé
        for (let c in t.table) { // une seule itération
            return c;
        }
        throw new Error("[Exception : selectionCle() non défini.]");
    }

    // retourne la premiere clé repondant a la propriéte prop
    selectionCleSuivantCritere<T>(t: FormatTableImmutable<T>, prop: (x: T) => boolean): string {
        // sélection d'une clé
        for (let c in t.table) {
            if (prop(t.table[c])) {
                return c;
            }
        }
        throw new Error("[Exception : selectionCleSuivantCritere() non défini.]");
    }
        
    // ajoute la valeur x à la clé c dans la table
    ajouter<T>(t: FormatTableMutable<T>, cle: string, x: T): void {
        t.table[cle] = x;
    }

    // retire de la table la clé c
    retirer<T>(t: FormatTableMutable<T>, cle: string): void {
        delete t.table[cle];
    }

}

export const MODULE_TABLE = new ModuleTable();

// Conversion pour les tables 
export function conversionFormatTable<TIN, TEX>(conv: (x: TIN) => TEX)
    : (t: FormatTableMutable<TIN>) => FormatTableImmutable<TEX> {
    return (
        (t: FormatTableMutable<TIN>) => {
            let r: { [cle: string]: TEX } = {};
            MODULE_TABLE.iterer((c, v) => {
                r[c] = conv(v);
            }, t);
            return FABRIQUE_TABLE.enveloppeImmutable(r);
        });
}
export type EtiquetteTable = 'taille' | 'graphe' | 'domaine' | 'image';

// Table immutable : TIN = TEX (recommandé : immutable)
// Les fonctions de la classe sont définis dans leur implémentation plus haut dans le document
export class TableImmutable<TEX>
    extends Enveloppe<FormatTableImmutable<TEX>, FormatTableImmutable<TEX>, EtiquetteTable> {
    constructor(etat: FormatTableImmutable<TEX>) {
        super((x) => x, etat);
    }
    // retourne la valeur associé au parametre demandé (exemple : taille, graphe, domaine, image)
    net(e: EtiquetteTable): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().toString();
            case 'image': return this.image().map((v, i, t) => JSON.stringify(v)).toString();
            case 'graphe': return JSON.stringify(this.etat().table);
        }
        return jamais(e);
    }
    // retourne la representation JSON du graphe 
    representation(): string {
        return this.net('graphe');
    }
    iterer(
        f: (cle: string, val: TEX, tab?: { [cle: string]: TEX }) => void
    ): void {
        MODULE_TABLE.iterer(f, this.etat());
    }
    valeur(cle: string): TEX {
        return MODULE_TABLE.valeur(this.etat(), cle);
    }
    contient(cle: string): boolean {
        return MODULE_TABLE.contient(this.etat(), cle);
    }
    image(): TEX[] {
        return MODULE_TABLE.image(this.etat());
    }
    domaine(): string[] {
        return MODULE_TABLE.domaine(this.etat());
    }
    taille(): number {
        return MODULE_TABLE.taille(this.etat());
    }
    selectionCle(): string {
        return MODULE_TABLE.selectionCle(this.etat());
    }
    selectionCleSuivantCritere(prop: (x: TEX) => boolean): string {
        return MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop);
    }

    application<T>(f: (x: TEX) => T): TableImmutable<T> {
        return new TableImmutable<T>(
            MODULE_TABLE.foncteur(this.etat(), f)
        );
    }
}

export function creerTableImmutable<TEX>(t: FormatTableImmutable<TEX>)
    : TableImmutable<TEX> {
    return new TableImmutable(t);
}

// Table mutable - TIN peut être différent de TEX.
//   Recommandé : TEX immutable.
// Attention : la méthode val() requiert un parcours de la table formant l'état.

// Les fonctions de la classe sont définis dans leur implémentation plus haut dans le document
export class TableMutable<TIN, TEX>
    extends Enveloppe<FormatTableMutable<TIN>, FormatTableImmutable<TEX>, EtiquetteTable> {

    constructor(
        protected etatVersVal: (x: TIN) => TEX,
        table: FormatTableMutable<TIN> = FABRIQUE_TABLE.videMutable()
    ) {
        super(conversionFormatTable(etatVersVal), table);
    }

    net(e: EtiquetteTable): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().toString();
            case 'image': return this.image().map((v, i) => JSON.stringify(v)).toString();
            case 'graphe': return JSON.stringify(this.val().table);
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('graphe');
    }
    protected itererEtat(
        f: (cle: string, val: TIN, tab?: { [cle: string]: TIN }) => void
    ): void {
        MODULE_TABLE.iterer(f, this.etat());
    }
    iterer(
        f: (cle: string, val: TEX) => void
    ): void {
        this.itererEtat((c, v, t) => f(c, this.etatVersVal(v)))
        // moins efficace (deux parcours) : MODULE_TABLE.iterer(f, this.ex());
    }
    valeurEtat(cle: string): TIN {
        return MODULE_TABLE.valeur(this.etat(), cle);
    }

    valeur(cle: string): TEX {
        return this.etatVersVal(this.valeurEtat(cle));
        // moins efficace : MODULE_TABLE.valeur(this.val(), cle);
    }
    contient(cle: string): boolean {
        return MODULE_TABLE.contient(this.etat(), cle);
    }
    protected imageEtat(): TIN[] {
        return MODULE_TABLE.image(this.etat());
    }
    image(): TEX[] {
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), (c, v) => this.etatVersVal(v));
        // moins efficace : MODULE_TABLE.image(this.val());
    }
    domaine(): string[] {
        return MODULE_TABLE.domaine(this.etat());
    }
    taille(): number {
        return MODULE_TABLE.taille(this.etat());
    }
    estVide(): boolean {
        return this.taille() === 0;
    }
    selectionCle(): string {
        return MODULE_TABLE.selectionCle(this.etat());
    }
    protected selectionCleSuivantCritereEtat(prop: (x: TIN) => boolean): string {
        return MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop);
    }
    selectionCleSuivantCritere(prop: (x: TEX) => boolean): string {
        return this.selectionCleSuivantCritereEtat(x => prop(this.etatVersVal(x)));
        // moins efficace : MODULE_TABLE.selectionCleSuivantCritere(this.val(), prop);
    }
    ajouter(cle: string, x: TIN): void {
        MODULE_TABLE.ajouter(this.etat(), cle, x);
    }
    retirer(cle: string): void {
        MODULE_TABLE.retirer(this.etat(), cle);
    }
}

// Creation d'une table mutable vide
export function creerTableMutableVide<TIN, TEX>(etatVersVal: (x: TIN) => TEX) {
    return new TableMutable(etatVersVal);
}

// Partage de la  table passée en argument.
export function creerTableMutableEnveloppe<TIN, TEX>(etatVersVal: (x: TIN) => TEX, t: { [cle: string]: TIN })
    : TableMutable<TIN, TEX> {
    return new TableMutable(etatVersVal, FABRIQUE_TABLE.enveloppeMutable(t));
}


//Création par copie de la table.
export function creerTableMutable<TIN, TEX>(
    etatVersVal: (x: TIN) => TEX,
    t: { [cle: string]: TIN }
): TableMutable<TIN, TEX> {
    let r = creerTableMutableVide(etatVersVal);
    MODULE_TABLE.iterer((c, v) => r.ajouter(c, v), FABRIQUE_TABLE.enveloppeMutable(t));
    return r;
}