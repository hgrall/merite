
import {FormatDateFr, creerDateEnveloppe} from "../../bibliotheque/types/date";
import {Unite} from "../../bibliotheque/types/mutable";
import {FormatErreurRedhibitoire, ErreurRedhibitoire} from "../../bibliotheque/communication/communication";
import { jamais } from "../../bibliotheque/outils";

// creation d'un format pour une erreur au niveau de chat 
// string messageErreur 
// FormatDateFr date -> format pour date francaise 
export interface FormatErreurChat extends FormatErreurRedhibitoire {
    readonly "messageErreur": string,
    readonly "date": FormatDateFr
}

export type EtiquetteErreurChat = 'messageErreur' | 'date';

export class ErreurChat
    extends ErreurRedhibitoire<FormatErreurChat, FormatErreurChat, EtiquetteErreurChat> {

    constructor(err: FormatErreurChat) {
        super((x) => x, err);
    }

    // renvoie un string correspondant a la valeur du parametre appelé
    net(e: EtiquetteErreurChat): string {
        let erreur = this.val();
        switch (e) {
            case 'messageErreur': return erreur.messageErreur;
            case 'date': return creerDateEnveloppe(erreur.date).representation();
        }
        return jamais(e);
    }

    // ecrit le message d'erreur
    representation(): string {
        return "[" + this.net('date') + " : " + this.net('messageErreur') + "]";
    }
}

//creation d'une erreur chat à partir du format
export function creerErreurChat(err: FormatErreurChat): ErreurChat {
    return new ErreurChat(err);
}

//creation d'une erreur chat à partir du message et de la date 
export function composerErreurChat(msg: string, date: FormatDateFr): ErreurChat {
    return new ErreurChat({
        "erreurRedhibitoire": Unite.ZERO,
        "messageErreur": msg,
        "date": date
    });
}
