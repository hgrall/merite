// Revue 02/08 - Testé.
// Revue 18/09 - Renommage - Testé.

import { normalisationNombre, jamais } from "./outils";

// Les enum sont des sous-types de number.
export enum Unite { ZERO }
export enum Deux {
    ZERO,
    UN
}

// Problème / readonly properties
// Cf. https://github.com/Microsoft/TypeScript/issues/13347
// Interface with readonly property is assignable to interface with mutable property.
// Remède : par défaut, les champs sont en lecture seulement. Lorsque ce n'est pas le cas, on rajoute 
//   un champ (mutable : Unite). Lorsqu'il s'agit de champs indexés, on introduit un champ table contenant 
//   la structure. Voir FormatTableMutable ci-dessous.
// On manipule ces structures indirectement via des modules 
//   pour limiter les conversions non sûres à ces modules. Voir les modules ci-dessous.

export interface Mutable {
    mutable: Unite
}

// Inutile.
export type EnLecture<T> = {
    readonly [P in keyof T]: T[P];
}

// Types formats JSON : FormatX par convention
// Il est recommandé de choisir le plus possible des formats immutables.
// Format ::= { (readonly etiquette : Format)*} 
//          | { (readonly etiquette : Format)*, (etiquette : Format)+, mutable : Unite} 
//          | { readonly table: { readonly [cle: string]: T }}
//          | { readonly table: { [cle: string]: T }}
//          | { table: { readonly [cle: string]: T }, mutable : Unite}
//          | { table: { [cle: string]: T }, mutable : Unite}

// Modèle générique d'une enveloppe d'un état
// TEX : type de sortie immutable (souvent format JSON en lecture seulement)
// TIN : type d'entrée pour l'état en format JSON ou non (mutable ou non, confiné si mutable)
// E : étiquettes utiles pour une représentation (cf. méthode net)
// La différence entre TIN et TEX permet de gérer les effets de bord sur l'état, souvent au format JSON.
// Une fonction de conversion de TIN vers TEX est requise.
// Toute méthode ayant une occurrence positive de TIN est protected. En effet, elle peut permettre d'obtenir l'état mutable
// et de réaliser un effet de bord sur l'état s'il est mutable.
// Cette classe abstraite doit être étedue ;
// - implémentation de net et représenter,
// - extension par des méthodes modifiant ou observant l'état.
// Sérialisation
// C'est le type interne TIN qui est utilisé pour la sérilisation (via la méthode brut()). 
// En conséquence, un format sérialisable doit être utilisé : types primitifs, 
// et comme contructeurs de types les tableaux et les structures indexées.

// Enveloppe de l'état qui est donc partagé.
export abstract class Enveloppe<TIN, TEX, E extends string> {
    private structure: TIN;
    protected etatEnVal: (x: TIN) => TEX;
    constructor(etatEnVal: (x: TIN) => TEX, etat: TIN) {
        this.structure = etat;
        this.etatEnVal = etatEnVal;
    }
    protected etat(): TIN {
        return this.structure;
    }
    val(): TEX {
        return this.etatEnVal(this.structure);
    }
    // transformation brute du json de type TIN en string
    brut(): string {
        return JSON.stringify(this.structure);
    };
    // représentation dans un json simplifié
    abstract net(etiquette: E): string;
    abstract representation(): string;
}

/* ***********************************************************************************************
* Dates
*/

export enum Semaine {
    LUNDI,
    MARDI,
    MERCREDI,
    JEUDI,
    VENDREDI,
    SAMEDI,
    DIMANCHE
}

export enum Mois {
    JANVIER, FEVRIER, MARS,
    AVRIL, MAI, JUIN,
    JUILLET, AOUT, SEPTEMBRE,
    OCTOBRE, NOVEMBRE, DECEMBRE
}

export interface FormatDateFr {
    readonly seconde: number;
    readonly minute: number;
    readonly heure: number;
    readonly jourSemaine: Semaine;
    readonly jourMois: number;
    readonly mois: Mois;
    readonly annee: number;
}

export type EtiquetteDateFr =
    'heure'
    | 'jourSemaine' | 'jourMois'
    | 'moisLettre' | 'moisNumero'
    | 'annee'
    | 'date' | 'dateLongue';


export interface DateImmutable {
    val(): FormatDateFr;
    detail(e: EtiquetteDateFr): string;
    representation(): string;
    representationLongue(): string;
    representationLog(): string;
}

export function conversionDate(d: Date): FormatDateFr {
    return {
        seconde: d.getSeconds(),
        minute: d.getMinutes(),
        heure: d.getHours(),
        jourSemaine: (d.getDay() + 6) % 7,
        jourMois: d.getDate(),
        mois: d.getMonth(),
        annee: d.getFullYear()
    };
}

class DateFrEnveloppe extends Enveloppe<FormatDateFr, FormatDateFr, EtiquetteDateFr>
    implements DateImmutable {


    net(e: EtiquetteDateFr): string {
        // A déplacer sous les cas.
        let s = normalisationNombre(this.etat().seconde, 2);
        let min = normalisationNombre(this.etat().minute, 2);
        let h = normalisationNombre(this.etat().heure, 2);
        let js = this.etat().jourSemaine;
        let jsL = Semaine[js].toLowerCase();
        let jm = normalisationNombre(this.etat().jourMois, 2);
        let mo = this.etat().mois;
        let moL = Mois[mo].toLowerCase();
        let moN = normalisationNombre(mo + 1, 2);
        let a = this.etat().annee.toString();

        switch (e) {
            case 'heure': return `${h}:${min}:${s}`;
            case 'jourSemaine': return jsL;
            case 'jourMois': return jm;
            case 'moisLettre': return moL;
            case 'moisNumero': return moN;
            case 'annee': return a;
            case 'date': return `${jm}/${moN}/${a}`;
            case 'dateLongue': return `${jsL} ${jm} ${moL} ${a}`
        }
        return jamais(e);
    }
    detail(e: EtiquetteDateFr): string {
        return this.net(e); // Simple renommage
    }
    representation(): string {
        return this.net('heure') + ", le " + this.net('date');
    }
    representationLongue(): string {
        return this.net('heure') + ", le " + this.net('dateLongue');
    }
    representationLog(): string {
        return this.net('heure') + " " + this.net('date');
    }

}

export function creerDateMaintenant(): DateImmutable {
    return new DateFrEnveloppe(x => x, conversionDate(new Date()));
}

export function creerDateEnveloppe(d: FormatDateFr): DateImmutable {
    return new DateFrEnveloppe(x => x, d);
}

/* ************************************************************************************************
* Tableau.
*/

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

    iterer<T>(
        f: (index: number, val: T, tab?: ReadonlyArray<T>) => void,
        t: FormatTableauImmutable<T>
    ): void {
        t.tableau.forEach((v, i, t) => f(i, v, t));
    }


    valeur<T>(t: FormatTableauImmutable<T>, index: number): T {
        return t.tableau[index];
    }

    taille<T>(t: FormatTableauImmutable<T>): number {
        return t.tableau.length;
    }

    foncteur<T, S>(t: FormatTableauImmutable<T>, f: (x: T) => S): FormatTableauMutable<S> {
        let r: S[] = [];
        this.iterer((i, v) => {
            r[i] = f(v);
        }, t);
        return FABRIQUE_TABLEAU.enveloppeMutable(r);
    }
    reduction<T>(t: FormatTableauImmutable<T>, neutre: T, op: (x: T, y: T) => T): T {
        let r: T = neutre;
        this.iterer((i, v) => {
            r = op(r, v);
        }, t);
        return r;
    }
    ajouterEnFin<T>(t: FormatTableauMutable<T>, x: T): void {
        t.tableau.push(x);
    }

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

    iterer<T>(
        f: (cle: string, val: T, tab?: { [cle: string]: T }) => void,
        t: FormatTableImmutable<T>
    ): void {
        for (let c in t.table) {
            f(c, t.table[c], t.table);
        }
    }


    valeur<T>(t: FormatTableImmutable<T>, cle: string): T {
        return t.table[cle];
    }
    contient<T>(t: FormatTableImmutable<T>, cle: string): boolean {
        if (t.table[cle]) {
            return true;
        }
        return false;;
    }
    image<T>(t: FormatTableImmutable<T>): T[] {
        let tab: T[] = [];
        this.iterer((c, v) => {
            tab.push(v);
        }, t);
        return tab;
    }
    domaine<T>(t: FormatTableImmutable<T>): string[] {
        let tab: string[] = [];
        this.iterer((c, v) => {
            tab.push(c);
        }, t);
        return tab;
    }

    taille<T>(t: FormatTableImmutable<T>): number {
        let n: number = 0;
        this.iterer((c, v) => {
            n++;
        }, t);
        return n;
    }

    foncteur<T, S>(t: FormatTableImmutable<T>, f: (x: T) => S): FormatTableMutable<S> {
        let r: { [cle: string]: S }
            = {};
        this.iterer((c, v) => {
            r[c] = f(v);
        }, t);
        return FABRIQUE_TABLE.enveloppeMutable(r);
    }

    transformationTableVersTableau<T, S>(t: FormatTableImmutable<T>, f: (cle: string, x: T) => S): S[] {
        let r: S[] = [];
        this.iterer((c, v) => {
            r.push(f(c, v));
        }, t);
        return r;
    }

    selectionCle<T>(t: FormatTableImmutable<T>): string {
        // sélection d'une clé
        for (let c in t.table) { // une seule itération
            return c;
        }
        throw new Error("[Exception : selectionCle() non défini.]");
    }

    selectionCleSuivantCritere<T>(t: FormatTableImmutable<T>, prop: (x: T) => boolean): string {
        // sélection d'une clé
        for (let c in t.table) {
            if (prop(t.table[c])) {
                return c;
            }
        }
        throw new Error("[Exception : selectionCleSuivantCritere() non défini.]");
    }


    ajouter<T>(t: FormatTableMutable<T>, cle: string, x: T): void {
        t.table[cle] = x;
    }

    retirer<T>(t: FormatTableMutable<T>, cle: string): void {
        delete t.table[cle];
    }

}

const MODULE_TABLE = new ModuleTable();

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
export class TableImmutable<TEX>
    extends Enveloppe<FormatTableImmutable<TEX>, FormatTableImmutable<TEX>, EtiquetteTable> {
    constructor(etat: FormatTableImmutable<TEX>) {
        super((x) => x, etat);
    }
    net(e: EtiquetteTable): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().toString();
            case 'image': return this.image().map((v, i, t) => JSON.stringify(v)).toString();
            case 'graphe': return JSON.stringify(this.etat().table);
        }
        return jamais(e);
    }
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

export function creerTableMutableVide<TIN, TEX>(etatVersVal: (x: TIN) => TEX) {
    return new TableMutable(etatVersVal);
}

// Partage de la  table passée en argument.
export function creerTableMutableEnveloppe<TIN, TEX>(etatVersVal: (x: TIN) => TEX, t: { [cle: string]: TIN })
    : TableMutable<TIN, TEX> {
    return new TableMutable(etatVersVal, FABRIQUE_TABLE.enveloppeMutable(t));
}

/*
* Création par copie de la table.
*/
export function creerTableMutable<TIN, TEX>(
    etatVersVal: (x: TIN) => TEX,
    t: { [cle: string]: TIN }
): TableMutable<TIN, TEX> {
    let r = creerTableMutableVide(etatVersVal);
    MODULE_TABLE.iterer((c, v) => r.ajouter(c, v), FABRIQUE_TABLE.enveloppeMutable(t));
    return r;
}

/* ***********************************************************************************************
 * Identifiant
// à utiliser avec Sorte = 'sorte à identifier' (chaine singleton)
// Usage : 
// - let id :Identifiant<'sorte'>
// - lecture : id.sorte de type string
// - création :  { sorte : "identite"} 
// Permet de typer les identifiants par sorte.
// Les identifiants sont toujours accéder via un champ nommé ID ou ID_x.
*/
export type Identifiant<Sorte extends string> = {
    readonly val: string;
    readonly sorte: Sorte;
}

export interface FormatIdentifiableMutable<Sorte extends string> extends Mutable {
    ID: Identifiant<Sorte>; // en majuscule par exception
}

export interface FormatIdentifiableImmutable<Sorte extends string> {
    readonly ID: Identifiant<Sorte>; // en majuscule par exception
}

export interface Identification<Sorte extends string> {
    identifier(s: Sorte): Identifiant<Sorte>;
}

class IdentificationParCompteur<Sorte extends string>
    implements Identification<Sorte> {
    private compteur: number;
    constructor(private prefixe: string) {
        this.compteur = 0;
    }
    identifier(s: Sorte): Identifiant<Sorte> {
        let id: string = this.prefixe + this.compteur;
        this.compteur++;
        return creerIdentifiant(s, id);
    }

}

export function creerIdentificationParCompteur<
    Sorte extends string
    >(prefixe: string)
    : Identification<Sorte> {
    return new IdentificationParCompteur(prefixe);
}

export function creerIdentifiant<Sorte extends string>(
    s: Sorte, cle: string
): Identifiant<Sorte> {
    return {
        val: cle,
        sorte: s
    };
}

export function egaliteIdentifiant<Sorte extends string>(
    id1: Identifiant<Sorte>,
    id2: Identifiant<Sorte>
): boolean {
    return id1.val === id2.val;
}

/*
* Table utilisant des identificateurs comme clé.
* Remarque : les tables précédentes fondées sur les tables en JSON utilisent nécessairement le type string pour les clés. 
*/
export class TableIdentificationMutable<Sorte extends string, TIN, TEX>
    extends Enveloppe<FormatTableMutable<TIN>, FormatTableImmutable<TEX>, EtiquetteTable> {
    protected sorte: Sorte; // la sorte des clés
    protected etatVersVal: (x: TIN) => TEX;
    constructor(
        sorte: Sorte,
        etatVersVal: (x: TIN) => TEX,
        table: FormatTableMutable<TIN> = FABRIQUE_TABLE.videMutable()
    ) {
        super(conversionFormatTable(etatVersVal), table);
        this.sorte = sorte;
        this.etatVersVal = etatVersVal;
    }

    net(e: EtiquetteTable): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map((v, i, t) => JSON.stringify(v)).toString();
            case 'image': return this.image().map((v, i, t) => JSON.stringify(v)).toString();
            case 'graphe': return JSON.stringify(this.val().table);
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('graphe');
    }

    protected itererEtat(
        f: (ID_sorte: Identifiant<Sorte>, val: TIN, tab?: { [cle: string]: TIN }) => void
    ): void {
        MODULE_TABLE.iterer((id, v, t) => f(creerIdentifiant(this.sorte, id), v, t), this.etat());
    }
    iterer(
        f: (ID_sorte: Identifiant<Sorte>, val: TEX) => void
    ): void {
        this.itererEtat((c, v, t) => f(c, this.etatVersVal(v)))
        // moins efficace (deux parcours) : MODULE_TABLE.iterer(f, this.ex());
    }

    protected valeurEtat(ID_sorte: Identifiant<Sorte>): TIN {
        return MODULE_TABLE.valeur(this.etat(), ID_sorte.val);
    }

    valeur(ID_sorte: Identifiant<Sorte>): TEX {
        return this.etatVersVal(this.valeurEtat(ID_sorte));
    }
    contient(ID_sorte: Identifiant<Sorte>): boolean {
        return MODULE_TABLE.contient(this.etat(), ID_sorte.val);
    }
    protected imageEtat(): TIN[] {
        return MODULE_TABLE.image(this.etat());
    }
    image(): TEX[] {
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), (c, v) => this.etatVersVal(v));
        // moins efficace : MODULE_TABLE.image(this.val());
    }


    domaine(): Identifiant<Sorte>[] {
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), (c, v) => creerIdentifiant(this.sorte, c));
        // moins efficace : return MODULE_TABLE.domaine(this.etat()).
        //    map((s) => { return { val: s, sorte: this.sorte } });
    }
    selectionCle(): Identifiant<Sorte> {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCle(this.etat()), );
    }
    protected selectionCleSuivantCritereEtat(prop: (x: TIN) => boolean): Identifiant<Sorte> {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop));
    }

    selectionCleSuivantCritere(prop: (x: TEX) => boolean): Identifiant<Sorte> {
        return this.selectionCleSuivantCritereEtat(x => prop(this.etatVersVal(x)));
        // moins efficace : MODULE_TABLE.selectionCleSuivantCritere(this.ex(), prop);
    }

    taille(): number {
        return MODULE_TABLE.taille(this.etat());
    }
    estVide(): boolean {
        return this.taille() === 0;
    }


    ajouter(ID_sorte: Identifiant<Sorte>, x: TIN): void {
        MODULE_TABLE.ajouter(this.etat(), ID_sorte.val, x);
    }

    retirer(ID_sorte: Identifiant<Sorte>): void {
        MODULE_TABLE.retirer(this.etat(), ID_sorte.val);
    }
}
export function creerTableIdentificationMutableVide<Sorte extends string, TIN, TEX>(
    sorte: Sorte,
    etatVersVal: (x: TIN) => TEX
) {
    return new TableIdentificationMutable<Sorte, TIN, TEX>(sorte, etatVersVal);
}
/*
* Création par copie de la table.
*/
export function creerTableIdentificationMutable<Sorte extends string, TIN, TEX>(
    sorte: Sorte, etatVersVal: (x: TIN) => TEX,
    table: FormatTableImmutable<TIN>
) {
    let r = creerTableIdentificationMutableVide(sorte, etatVersVal);
    MODULE_TABLE.iterer((c, v) => r.ajouter(creerIdentifiant(sorte, c), v), table);
    return r;
}

/*
 *  Création d'une enveloppe de la table passée en argument (qui est donc partagée).
 */
export function creerTableIdentificationMutableEnveloppe<Sorte extends string, TIN, TEX>(
    sorte: Sorte, etatVersVal: (x: TIN) => TEX,
    table: FormatTableMutable<TIN>
) {
    return new TableIdentificationMutable<Sorte, TIN, TEX>(sorte, etatVersVal, table);
}


// Version immutable
export class TableIdentificationImmutable<Sorte extends string, TEX>
    extends Enveloppe<FormatTableImmutable<TEX>, FormatTableImmutable<TEX>, EtiquetteTable> {
    protected sorte: Sorte; // la sorte des clés
    constructor(
        sorte: Sorte,
        table: FormatTableImmutable<TEX> = FABRIQUE_TABLE.videImmutable()) {
        super(conversionFormatTable((x) => x), table);
        this.sorte = sorte;
    }

    net(e: EtiquetteTable): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map((v, i, t) => JSON.stringify(v)).toString();
            case 'image': return this.image().map((v, i, t) => JSON.stringify(v)).toString();
            case 'graphe': return JSON.stringify(this.val().table);
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('graphe');
    }

    iterer(
        f: (ID_sorte: Identifiant<Sorte>, val: TEX, tab?: { [cle: string]: TEX }) => void
    ): void {
        MODULE_TABLE.iterer((id, v, t) => f(creerIdentifiant(this.sorte, id), v, t), this.etat());
    }

    valeur(ID_sorte: Identifiant<Sorte>): TEX {
        return MODULE_TABLE.valeur(this.etat(), ID_sorte.val);
    }

    contient(ID_sorte: Identifiant<Sorte>): boolean {
        return MODULE_TABLE.contient(this.etat(), ID_sorte.val);
    }
    image(): TEX[] {
        return MODULE_TABLE.image(this.etat());
    }
    domaine(): Identifiant<Sorte>[] {
        return MODULE_TABLE.transformationTableVersTableau(this.etat(), (c, v) => creerIdentifiant(this.sorte, c));
    }
    selectionCle(): Identifiant<Sorte> {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCle(this.etat()));
    }
    selectionCleSuivantCritere(prop: (x: TEX) => boolean): Identifiant<Sorte> {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.etat(), prop));
    }

    taille(): number {
        return MODULE_TABLE.taille(this.etat());
    }
    estVide(): boolean {
        return this.taille() === 0;
    }

}

export function creerTableIdentificationImmutable<Sorte extends string, TEX>(
    sorte: Sorte,
    table: FormatTableImmutable<TEX>)
    : TableIdentificationImmutable<Sorte, TEX> {
    return new TableIdentificationImmutable<Sorte, TEX>(sorte, table);
}

