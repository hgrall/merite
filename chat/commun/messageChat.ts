import { FormatDateFr, creerDateEnveloppe, creerDateMaintenant } from "../../bibliotheque/types/date";
import { Identifiant } from "../../bibliotheque/types/identifiant";
import { FormatMessage, Message} from "../../bibliotheque/communication/communication";
import { jamais } from "../../bibliotheque/outils";

// differents types de message Chat 
export enum TypeMessageChat {
    COM,
    TRANSIT,
    AR,
    ERREUR_CONNEXION,
    ERREUR_EMET,
    ERREUR_DEST,
    ERREUR_TYPE,
    INTERDICTION
}

// Format en lecture seulement
export interface FormatMessageChat extends FormatMessage {
    readonly ID: Identifiant<'message'>, 
    readonly ID_emetteur: Identifiant<'sommet'>,
    readonly ID_destinataire: Identifiant<'sommet'>,
    readonly type: TypeMessageChat,
    readonly contenu: string,
    readonly date: FormatDateFr
}

export type EtiquetteMessageChat = 'type' | 'date' | 'ID_de' | 'ID_a' | 'contenu';

// Structure immutable
export class MessageChat extends Message<FormatMessageChat, FormatMessageChat, EtiquetteMessageChat> {

    constructor(etat: FormatMessageChat) {
        super((x) => x, etat);
    }

    // renvoie un string correspondant a la valeur du parametre appelé
    net(e: EtiquetteMessageChat): string {
        let msg = this.val();
        switch (e) {
            case 'type': return TypeMessageChat[msg.type];
            case 'date': return creerDateEnveloppe(msg.date).representation();
            case 'ID_de': return msg.ID_emetteur.val;
            case 'ID_a': return msg.ID_destinataire.val;
            case 'contenu': return msg.contenu;
        }
        return jamais(e);
    }

    // ecrit la representation de message Chat 
    representation(): string {
        let dem = this.net('ID_de');
        let am = this.net('ID_a');
        let typem = this.net('type');
        let datem = this.net('date');
        let cm = this.net('contenu');
        return datem + ", de " + dem + " à " + am + " (" + typem + ") - " + cm;
    }

    // change le type du message pour TRANSIT
    transit(): MessageChat {
        let msg = this.val();
        return new MessageChat({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageChat.TRANSIT,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    // change le type du message pour AR cad avec accuse de reception
    avecAccuseReception(): MessageChat {
        let msg = this.val();
        return new MessageChat({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageChat.AR,
            contenu: msg.contenu,
            date: msg.date
        });
    }

}

// creation d'un message d'erreur pour la connexion 
export function creerMessageErreurConnexion(id: Identifiant<'message'>, idEmetteur: Identifiant<'sommet'>, messageErreur: string): MessageChat {
    return new MessageChat({
        ID: id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idEmetteur,
        type: TypeMessageChat.ERREUR_CONNEXION,
        contenu: messageErreur,
        date: creerDateMaintenant().val()
    });
}

export function creerMessageCommunication(id: Identifiant<'message'>, idEmetteur: Identifiant<'sommet'>, idDestinataire: Identifiant<'sommet'>, 
    texte: string, date : FormatDateFr ): MessageChat {
    return new MessageChat({
        ID : id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idDestinataire,
        type: TypeMessageChat.COM,
        contenu: texte,
        date: date
    });
}

// creation d'un message erreur qui vient du destinataire du message 
export function creerMessageRetourErreur(original: MessageChat, codeErreur: TypeMessageChat, messageErreur: string): MessageChat {
    return new MessageChat({
        ID : original.val().ID, 
        ID_emetteur: original.val().ID_emetteur,
        ID_destinataire: original.val().ID_destinataire,
        type: codeErreur,
        contenu: messageErreur,
        date: original.val().date
    });
}