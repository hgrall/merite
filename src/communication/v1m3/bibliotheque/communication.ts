import {
    Unite,
    FormatIdentifiableMutable, FormatIdentifiableImmutable, Identifiant,
    Enveloppe,
    TableauMutable, creerTableauMutableVide,
    FABRIQUE_TABLE,
    TableIdentificationMutable, creerTableIdentificationMutable, creerTableIdentificationMutableEnveloppe,
    FormatTableMutable,
    FormatTableImmutable, conversionFormatTable,
    TableIdentificationImmutable, creerTableIdentificationImmutable
} from "./types"



// Cette interface pourrait être complétée à l'avenir.
export interface FormatConfigurationInitiale {
    readonly "configurationInitiale": Unite
};
// Cette interface pourrait être complétée à l'avenir.
export interface FormatErreurRedhibitoire {
    readonly "erreurRedhibitoire": Unite
}
// Cette interface pourrait être complétée à l'avenir.
// Clés "configurationInitiale" et "erreurRedhibitoire" interdites dans les messages
export interface FormatMessage { }

export abstract class Message<
    FMIN extends FormatMessage,
    FMEX extends FormatMessage,
    EM extends string
    >
    extends Enveloppe<FMIN, FMEX, EM> {

}

export abstract class Configuration<
    FCIN extends FormatConfigurationInitiale,
    FCEX extends FormatConfigurationInitiale,
    EC extends string
    >
    extends Enveloppe<FCIN, FCEX, EC> {

}

export abstract class ErreurRedhibitoire<
    FEIN extends FormatErreurRedhibitoire,
    FEEX extends FormatErreurRedhibitoire,
    EE extends string
    >
    extends Enveloppe<FEIN, FEEX, EE> {

}


/*
- réseau ::= noeud*
- noeud ::= (sommet, sommet*)
- sommet ::= {identifiant, ...}

- Serveur : agrégation d'un réseau
- Client : agrégation d'un noeud du réseau 

- Remarque : compatibilité ES3 pour les objets.
*/


// - sommet ::= {identifiant, ...}

// La sorte pour les identifiants de sommets est 'sommet'. 
export abstract class Sommet<
    TIN extends FormatIdentifiableImmutable<'sommet'>,
    TEX extends FormatIdentifiableImmutable<'sommet'>,
    E extends string
    >
    extends Enveloppe<TIN, TEX, E> {

}


// - réseau ::= noeud*

// Hypothèse : le réseau ne modifie ni les sommets ni les neouds. 
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

// - noeud ::= (sommet, sommet*)
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

export function creerCentreSansVoisins<S extends FormatIdentifiableImmutable<'sommet'>>(centre : S)
    : FormatNoeudMutable<S>
{
    return {centre : centre, voisins: FABRIQUE_TABLE.videMutable()};
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

export interface AssemblageReseau<S extends FormatIdentifiableImmutable<'sommet'>> {
    ajouterSommet(s: S): void;
    assembler(): ReseauMutable<S>;
}

class AssemblageReseauEnAnneau<S extends FormatIdentifiableImmutable<'sommet'>>
    extends TableauMutable<S, S>
    implements AssemblageReseau<S> {

    constructor(
        private nombreSommets: number,
        private fabriqueNoeudSansVoisins: (centre: S) => NoeudMutable<S>
    ) {
        super(x => x)
        console.log("* Construction d'un réseau en anneau de " + nombreSommets.toString() + " éléments.");
    }
    // Les sommetts doivent avoir des identifiants deux à deux distincts.
    ajouterSommet(s: S): void {
        if (this.taille() < this.nombreSommets) {
            this.ajouterEnFin(s);
        } else {
            console.log("- Impossible d'ajouter un sommet : le réseau en anneau est complet.");
        }
    }

    assembler(): ReseauMutable<S> {
        let restant = this.nombreSommets - this.taille();
        if (restant > 0) {
            console.log("- Impossible d'assembler un réseau en anneau de la taille donnée : ajouter " + restant + " sommets.");
            throw new Error("[Exception : AssemblageReseau.assembler non défini.]")
        }
        // Définition du réseau
        let reseau: ReseauMutable<S> = creerReseauVide();
        this.iterer((i: number, s: S) => {
            let n: NoeudMutable<S> = this.fabriqueNoeudSansVoisins(s);
            n.ajouterVoisin(this.valeurEtat((i + 1) % this.nombreSommets));
            n.ajouterVoisin(this.valeurEtat((i + (this.nombreSommets - 1)) % this.nombreSommets));
            reseau.ajouterNoeud(n.val());
        });
        return reseau;
    }
}

export function creerAssemblageReseauEnAnneau<SO extends FormatIdentifiableImmutable<'sommet'>>(
    taille: number,
    fabriqueNoeudSansVoisins: (centre: SO) => NoeudMutable<SO>)
    : AssemblageReseau<SO> {
    return new AssemblageReseauEnAnneau<SO>(taille, fabriqueNoeudSansVoisins);
}
