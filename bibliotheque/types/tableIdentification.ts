import { Enveloppe } from './enveloppe';
import { FormatTableImmutable, FormatTableMutable, MODULE_TABLE, EtiquetteTable, conversionFormatTable, FABRIQUE_TABLE } from './table';
import { Identifiant, creerIdentifiant } from './identifiant';
import { jamais } from '../outils';

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

