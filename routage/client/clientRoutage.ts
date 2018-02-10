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
    canal.envoyerMessage(msg.aEssayer(contenu, emetteur))
}

<<<<<<< HEAD
var idUtil : Identifiant<'utilisateur'>;
var idDom : Identifiant<'domaine'>;
var idDomDest : Identifiant<'domaine'>;
var idMessage : Identifiant<'message'>;
var contenu : Mot;
const adresseServeur: string = hote + ":" + port2;

/*L’utilisateur demande au serveur d’initier la transmission 
du message qu’il doit envoyer // 
(a priori un unique message), 
après avoir indiqué le domaine voisin // 
destinataire et le contenu.
*/
export function initier(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idDomDest : Identifiant<'domaine'>,
contenu : Mot,
 ):void{
    console.log("* Initialisation après chargement du DOM");

    console.log("- du canal de communication avec le serveur d'adresse " + adresseServeur);
    var canal = creerCanalClient(adresseServeur);

    console.log("- du traitement des messages");
    canal.enregistrerTraitementMessageRecu((m: FormatMessageJeu1) => {
        let msg = new MessageJeu1(m);
        console.log("- du message brut : " + msg.brut());
        //console.log("- du message net : " + representerMessage(msg));
        //posterNL('logChats', representerMessage(msg));
})};

/*L’utilisateur reçoit un message du serveur et le place en transit. 
Les autres // utilisateurs du domaine ont reçu le même message.
 */
export function transit(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'sommet'>,
idDomDest : Identifiant<'sommet'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
):void{
};

/*L’utilisateur demande au serveur de verrouiller le message 
en transit.
 */
export function verouiller(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'sommet'>,
idDomDest : Identifiant<'sommet'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
=======
/* Demande de verrou d'un message */
export function verrou(canal: CanalJeu1, idMessage: Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, dom: Identifiant<'sommet'>, contenu: Mot) {
>>>>>>> 42a9dc13b24156d55a0cbff25306406b21f722f2
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
