import {
    FormatIdentifiableMutable, FormatIdentifiableImmutable, Identifiant,
} from "../types/identifiant"
import {
    Enveloppe
} from "../types/enveloppe"
import {
    TableIdentificationMutable, creerTableIdentificationMutable, creerTableIdentificationMutableEnveloppe,
    TableIdentificationImmutable, creerTableIdentificationImmutable,
} from "../types/tableIdentification"
import {
    FormatTableMutable,
    FormatTableImmutable, conversionFormatTable,
} from "../types/table"


// Hypothèse : un noeud ne modifie pas les sommets.
//    Conséquence : un seul format (sortie) est utilisé pour les sommets.
export interface FormatNoeudMutable<S extends FormatIdentifiableImmutable<'sommet'>> {
    readonly centre: S;
    readonly voisins: FormatTableMutable<S>
}

export interface FormatNoeudImmutable<S extends FormatIdentifiableImmutable<'sommet'>> {
    readonly centre: S;
    readonly voisins: FormatTableImmutable<S>
}


function conversionFormatNoeud<S extends FormatIdentifiableImmutable<'sommet'>>(
    n: FormatNoeudMutable<S>): FormatNoeudImmutable<S> {
    return { centre: n.centre, voisins: conversionFormatTable<S, S>((s) => s)(n.voisins) }; 
    // return n; correct mais conserve le champ mutable.
}


export type EtiquetteNoeud = 'centre' | 'voisins';


export interface NoeudImmutable<S extends FormatIdentifiableImmutable<'sommet'>> {
    aPourVoisin(ID_sommet: Identifiant<'sommet'>): boolean;
    itererVoisins(proc: (ID_sommet: Identifiant<'sommet'>, v: S) => void): void;
    val() : FormatNoeudImmutable<S>
}

export interface NoeudMutable<S extends FormatIdentifiableImmutable<'sommet'>>
    extends NoeudImmutable<S> {
    ajouterVoisin(v: S): void;
}


export abstract class NoeudEnveloppeMutable<S extends FormatIdentifiableImmutable<'sommet'>>
    extends Enveloppe<FormatNoeudMutable<S>, FormatNoeudImmutable<S>, EtiquetteNoeud>
    implements NoeudMutable<S> {

    constructor(etat: FormatNoeudMutable<S>) {
        super(conversionFormatNoeud, etat);
    }

    aPourVoisin(ID_sommet: Identifiant<'sommet'>): boolean {
        return creerTableIdentificationImmutable('sommet', this.etat().voisins).
            contient(ID_sommet);
    }
    itererVoisins(proc: (ID_sommet: Identifiant<'sommet'>, v: S) => void) {
        creerTableIdentificationImmutable('sommet', this.etat().voisins).iterer(proc);
    }

    ajouterVoisin(v: S): void {
        creerTableIdentificationMutableEnveloppe('sommet', (x) => x, this.etat().voisins).ajouter(v.ID, v);
    }

}

export abstract class NoeudEnveloppeImmutable<S extends FormatIdentifiableImmutable<'sommet'>>
    extends Enveloppe<FormatNoeudImmutable<S>, FormatNoeudImmutable<S>, EtiquetteNoeud>
    implements NoeudImmutable<S> {

    constructor(etat: FormatNoeudImmutable<S>) {
        super(conversionFormatNoeud, etat);
    }

    aPourVoisin(ID_sommet: Identifiant<'sommet'>): boolean {
        return creerTableIdentificationImmutable('sommet', this.etat().voisins).
            contient(ID_sommet);
    }
    itererVoisins(proc: (ID_sommet: Identifiant<'sommet'>, v: S) => void) {
        creerTableIdentificationImmutable('sommet', this.etat().voisins).iterer(proc);
    }

}