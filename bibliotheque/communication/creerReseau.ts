import {
    FormatIdentifiableMutable, FormatIdentifiableImmutable, Identifiant
} from "../types/identifiant"
import {
    FABRIQUE_TABLE
} from "../types/table"
import {
    TableIdentificationMutable, creerTableIdentificationMutable,
    creerTableIdentificationImmutable,
} from "../types/tableIdentification"

import{
    FormatNoeudImmutable, FormatNoeudMutable
}from "./noeud"


// Hypothèse : le réseau ne modifie ni les sommets ni les noeuds. 
//   Conséquence : un seul format est utilisé, pour les sommets et pour les noeuds respectivement.

export interface ReseauImmutable<S extends FormatIdentifiableImmutable<'sommet'>> {
    representation(): string;
    possedeNoeud(ID_sommet: Identifiant<'sommet'>): boolean;
    sontVoisins(ID_sommet1: Identifiant<'sommet'>, ID_sommet2: Identifiant<'sommet'>): boolean;
    iterer(f: (id: Identifiant<'sommet'>, n: FormatNoeudImmutable<S>) => void): void;
    noeud(ID_sommet: Identifiant<'sommet'>): FormatNoeudImmutable<S>;
    identifiantsNoeuds(): Identifiant<'sommet'>[];
    selectionNoeud(): Identifiant<'sommet'>;
}


export interface ReseauMutable<S extends FormatIdentifiableImmutable<'sommet'>> extends
    ReseauImmutable<S> {
    ajouterNoeud(n: FormatNoeudImmutable<S>): void;
    retirerNoeud(n: FormatNoeudImmutable<S>): void;
}

export class ReseauTableDeNoeuds<S extends FormatIdentifiableImmutable<'sommet'>>
extends TableIdentificationMutable<'sommet', FormatNoeudImmutable<S>, FormatNoeudImmutable<S>>
implements ReseauMutable<S> {

    constructor() {
        super('sommet', (x) => x);
    }

    representation(): string {
        return "réseau de " + this.net('taille') + " noeuds : "
            + this.net('graphe');
    }
    // (simple renommmage)
    possedeNoeud(ID_sommet: Identifiant<'sommet'>): boolean {
        return this.contient(ID_sommet);
    }
    // Précondition : id1 et id2 sont deux noeuds du réseau.
    sontVoisins(ID_sommet1: Identifiant<'sommet'>, ID_sommet2: Identifiant<'sommet'>): boolean {
        return creerTableIdentificationImmutable('sommet', this.valeurEtat(ID_sommet1).voisins).
            contient(ID_sommet2);
    }
    iterer(f: (id: Identifiant<'sommet'>, n: FormatNoeudImmutable<S>) => void) {
        this.itererEtat(f);
    }
    noeud(ID_sommet: Identifiant<'sommet'>): FormatNoeudImmutable<S> {
        return this.valeur(ID_sommet);
    }
    identifiantsNoeuds(): Identifiant<'sommet'>[] {
        return this.domaine();
    }
    selectionNoeud() {
        return this.selectionCle();
    }
    ajouterNoeud(n: FormatNoeudImmutable<S>): void {
        this.ajouter(n.centre.ID, n);
    }
    retirerNoeud(n: FormatNoeudImmutable<S>): void {
        this.retirer(n.centre.ID);
    }
}

export function creerReseauVide<S extends FormatIdentifiableImmutable<'sommet'>>(): ReseauMutable<S> {
    return new ReseauTableDeNoeuds();
}

export function creerCentreSansVoisins<S extends FormatIdentifiableImmutable<'sommet'>>(centre : S)
    : FormatNoeudMutable<S>
    {
    return {centre : centre, voisins: FABRIQUE_TABLE.videMutable()};
}