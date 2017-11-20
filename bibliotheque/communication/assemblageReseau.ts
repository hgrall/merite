import {
    FormatIdentifiableMutable, FormatIdentifiableImmutable, Identifiant,
} from "../types/identifiant"
import {
    TableauMutable
} from "../types/tableau"
import {
    TableIdentificationMutable, creerTableIdentificationMutable,
} from "../types/tableIdentification"

import{
     NoeudMutable
}from "./noeud"

import{
    ReseauMutable, creerReseauVide
} from "./creerReseau"

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