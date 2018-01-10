import {
    Sommet
} from "../../bibliotheque/communication/communication";
import {ReseauMutable, ReseauImmutable, creerCentreSansVoisins} from "../../bibliotheque/communication/creerReseau";
import {
    creerAssemblageReseauEnAnneau, AssemblageReseau
} from "../../bibliotheque/communication/assemblageReseau";
import {NoeudMutable, FormatNoeudMutable, NoeudEnveloppeMutable, EtiquetteNoeud} from "../../bibliotheque/communication/noeud";
import {Identification, creerIdentificationParCompteur, FormatIdentifiableImmutable} from "../../bibliotheque/types/identifiant";
import {creerTableImmutable} from "../../bibliotheque/types/table";
import { jamais } from "../../bibliotheque/outils";
import {FormatSommetChat} from "./sommetChat";
import {creerNoeudSansVoisinsChatMutable} from "./noeudChat";
import {Mot, binaire, creerMot } from "../../bibliotheque/binaire"
import { Deux } from "../../bibliotheque/types/mutable"

export const hote: string = "merite"; // hôte local via TCP/IP - DNS : cf. /etc/hosts - IP : 127.0.0.1
export const port1 = 3000; // port de la essource 1 (serveur d'applications)
export const port2: number = 1110; // port de la ressouce 2 (serveur de connexions)

export type ReseauChat = ReseauMutable<FormatSommetChat>;

export type AssemblageReseauChat
    = AssemblageReseau<FormatSommetChat>;

// creation d'un anneau Chat à partir de la liste des noms 
export function creerAnneauChat(noms: string[]): ReseauChat {
    let assembleur: AssemblageReseauChat
        = creerAssemblageReseauEnAnneau(noms.length, creerNoeudSansVoisinsChatMutable);
    let identification: Identification<'sommet'>
        = creerIdentificationParCompteur("S-");
    noms.forEach((nom: string, i: number, tab: string[]) => {
        let s: FormatSommetChat
            = { ID: identification.identifier('sommet'), pseudo: tab[i], binId: binaire(i)};
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}

export interface FormatSommetAnneau extends FormatIdentifiableImmutable<'sommet'> {
    readonly domaine: ReadonlyArray<Deux>
}

export type ReseauAnneau = ReseauImmutable<FormatSommetAnneau>;
export type AssemblageReseauJeu1
= AssemblageReseau<FormatSommetAnneau>;

export type NoeudAnneauMutable = NoeudMutable<FormatSommetAnneau>;
export type FormatNoeudAnneauMutable = FormatNoeudMutable<FormatSommetAnneau>;
export class NoeudAnneauEnveloppeMutable extends NoeudEnveloppeMutable<FormatSommetAnneau>{
    
    net(e: EtiquetteNoeud): string {
        let s = this.val();
        switch (e) {
            case 'centre': return creerSommetAnneau(s.centre).representation();
            case 'voisins': return creerTableImmutable(s.voisins).representation();
        }
        return jamais(e);
    }
    representation(): string {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    }
}
export type EtiquetteSommetAnneau = 'ID' | 'domaine';
export class SommetAnneau
    extends Sommet<FormatSommetAnneau, FormatSommetAnneau, EtiquetteSommetAnneau> {

    constructor(etat: FormatSommetAnneau) {
        super((x) => x, etat);
    }

    net(e: EtiquetteSommetAnneau): string {
        let s = this.val();
        switch (e) {
            case 'domaine': return creerMot(s.domaine).representation();
            case 'ID': return s.ID.val;
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('domaine') + " (" + this.net('ID') + ")";
    }
}
   

export function creerNoeudAnneauMutable(n: FormatNoeudAnneauMutable): NoeudAnneauMutable {
    return new NoeudAnneauEnveloppeMutable(n);
}
export function creerSommetAnneau(s: FormatSommetAnneau): SommetAnneau {
    return new SommetAnneau(s);
}
export function creerNoeudSansVoisinsAnneauMutable(centre: FormatSommetAnneau): NoeudAnneauMutable {
    return creerNoeudAnneauMutable(creerCentreSansVoisins(centre));
}
export function creerSuperAnneau(domaines: Mot[]): ReseauAnneau {
    domaines.forEach((dom: Mot, i: number, tab: Mot[]) => {
        console.log(tab[i]); 
        // let s: FormatSommetAnneau
        //     = { ID: identification.identifier('sommet'), domaine: tab[i] };
        // assembleur.ajouterSommet(s);
    });
    
    let assembleur: AssemblageReseauJeu1
        = creerAssemblageReseauEnAnneau(domaines.length, creerNoeudSansVoisinsAnneauMutable);
    let identification: Identification<'sommet'>
        = creerIdentificationParCompteur("DOM-");
    domaines.forEach((dom: Mot, i: number, tab: Mot[]) => {
        console.log(tab); 
        // let s: FormatSommetAnneau
        //     = { ID: identification.identifier('sommet'), domaine: tab[i] };
        // assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}
