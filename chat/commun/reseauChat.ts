import {
    Sommet
} from "../../bibliotheque/communication/communication";
import {ReseauMutable} from "../../bibliotheque/communication/creerReseau";
import {
    creerAssemblageReseauEnAnneau, AssemblageReseau
} from "../../bibliotheque/communication/assemblageReseau";
import {Identification, creerIdentificationParCompteur} from "../../bibliotheque/types/identifiant";
import { jamais } from "../../bibliotheque/outils";
import {FormatSommetChat} from "./sommetChat";
import {creerNoeudSansVoisinsChatMutable} from "./noeudChat";

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
            = { ID: identification.identifier('sommet'), pseudo: tab[i]};
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}
