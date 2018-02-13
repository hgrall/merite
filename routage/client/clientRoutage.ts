import { CanalClient} from "../../bibliotheque/client";
import { Identifiant, creerIdentifiant} from '../../bibliotheque/types/identifiant';
import { Mot } from '../../bibliotheque/binaire';
import {
    FormatMessageJeu1, EtiquetteMessageJeu1, MessageJeu1,
    FormatConfigurationJeu1,        
    FormatErreurJeu1,
    TypeMessageJeu1, sommetInconnu
} from '../commun/communRoutage';
import { conversionDate } from '../../bibliotheque/types/date'

type CanalJeu1 = CanalClient<FormatErreurJeu1, FormatConfigurationJeu1, FormatMessageJeu1, FormatMessageJeu1, EtiquetteMessageJeu1>;

/* Envoi d'un message initial au serveur */
export function envoiMessageInit(canal: CanalJeu1, emetteur:Identifiant<'utilisateur'>, dom: Identifiant<'sommet'>,dest: Identifiant<'sommet'>, contenu: Mot) {
    canal.envoyerMessage(new MessageJeu1({
        ID: creerIdentifiant('message', ''),
        ID_emetteur: emetteur,
        ID_origine: dom,
        ID_destination: dest,
        type: TypeMessageJeu1.INIT,
        contenu: contenu,
        date: conversionDate(new Date())
    }))
}

/* Transmission d'un message au serveur */
export function envoiMessage(canal: CanalJeu1, emetteur: Identifiant<'utilisateur'>, dom: Identifiant<'sommet'>, dest: Identifiant<'sommet'>, id: Identifiant<'message'>, contenu: Mot) {
    canal.envoyerMessage(new MessageJeu1({
        ID: id,
        ID_emetteur: emetteur,
        ID_origine: dom,
        ID_destination: dest,
        type: TypeMessageJeu1.SUIVANT,
        contenu: contenu,
        date: conversionDate(new Date())
    }))
}

/* Envoi du message décodé au serveur pour validation */
export function validerMessage(canal: CanalJeu1, emetteur: Identifiant<'utilisateur'>, contenu: Mot, msg: MessageJeu1) {
    canal.envoyerMessage(msg.aEssayer(contenu, emetteur));
}

/* Demande de verrou d'un message */
export function verrou(canal: CanalJeu1, idMessage: Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, dom: Identifiant<'sommet'>, contenu: Mot) {
    let msg = new MessageJeu1({
        ID: idMessage,
        ID_emetteur: emetteur,
        ID_origine: dom,
        ID_destination: sommetInconnu,
        type: TypeMessageJeu1.VERROU,
        contenu: contenu,
        date: conversionDate(new Date())
    })
    canal.envoyerMessage(msg);
}

/* Deverrouillage d'un message */
export function deverrouiller(canal: CanalJeu1, emetteur: Identifiant<'utilisateur'>, dom: Identifiant<'sommet'>, idMessage: Identifiant<'message'>, contenu: Mot) {
    let msg = new MessageJeu1({
        ID: idMessage,
        ID_emetteur: emetteur,
        ID_origine: dom,
        ID_destination: dom,
        type: TypeMessageJeu1.IGNOR,
        contenu: contenu,
        date: conversionDate(new Date())
    })
    canal.envoyerMessage(msg);
}

/* Demande de statistiques  */
export function statistiques(canal: CanalJeu1, emetteur: Identifiant<'utilisateur'>, contenu: Mot, msg: MessageJeu1) {
    canal.envoyerMessage(msg.aStatistiques(contenu, emetteur));
}