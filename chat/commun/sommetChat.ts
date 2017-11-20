
import { FormatIdentifiableImmutable } from "../../bibliotheque/types/identifiant";
import {Sommet} from "../../bibliotheque/communication/communication";
import { jamais } from "../../bibliotheque/outils";

export interface FormatSommetChat extends FormatIdentifiableImmutable<'sommet'> {
    readonly pseudo: string,
}

export type EtiquetteSommetChat = 'ID' | 'nom';

// La structure JSON décrivant le sommet est en lecture seulement. 
export class SommetChat
    extends Sommet<FormatSommetChat, FormatSommetChat, EtiquetteSommetChat> {

    constructor(etat: FormatSommetChat) {
        super((x) => x, etat);
    }
     // renvoie un string correspondant a la valeur du parametre appelé
    net(e: EtiquetteSommetChat): string {
        let s = this.val();
        switch (e) {
            case 'nom': return s.pseudo;
            case 'ID': return s.ID.val;
        }
        return jamais(e);
    }
    // renvoie la representation d'un sommet
    representation(): string {
        return this.net('nom') + " (" + this.net('ID') + ")";
    }
}

export function creerSommetChat(s: FormatSommetChat) {
    return new SommetChat(s);
}