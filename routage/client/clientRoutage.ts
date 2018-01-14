/*
    INITIE
    !Utilisateur(idUtil, idDom)
    Transit(idMessage, idUtil, idDomOrigine, idDomDest, contenu)*
    Actif(idMessage, idUtil, idDomOrigine, idDomDest, contenu)*
    Gagné(id, idUtil, idDom, contenu)*
    Perdu(id, idUtil, idDom, contenu)*


    Fonctions utilises lors des actions client.

    */


    // function diffuser(msg: MessageJeu1): void {


import {CanalClient, creerCanalClient} from "../../bibliotheque/client";
import { Identifiant, creerIdentifiant, egaliteIdentifiant } from '../../bibliotheque/types/identifiant';
import { binaire, Mot } from '../../bibliotheque/binaire';
import {
    hote, port2,
    NoeudJeu1EnveloppeImmutable, creerNoeudJeu1Immutable,
    SommetJeu1, FormatSommetJeu1, creerSommetJeu1,
    FormatMessageJeu1, EtiquetteMessageJeu1, MessageJeu1,
    FormatConfigurationJeu1, EtiquetteConfigurationJeu1, creerConfigurationJeu1,
        decomposerConfiguration,        
    FormatErreurJeu1, EtiquetteErreurJeu1,
    ErreurJeu1, creerErreurJeu1,
    PopulationLocaleMutable, creerPopulationLocale, 
    Utilisateur, creerUtilisateur, TypeMessageJeu1, creerMessageInitial
} from '../commun/communRoutage';





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

     let msg = creerMessageInitial(idUtil,idDom,contenu);

     //verouille un msg en transit
    msg.pourVerrouiller(idUtil,idDomDest);

};

/*
 */
export function deverouiller(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idDomDest : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
};

/*L’utilisateur active un message après un verrouillage réussi côté serveur.
 */
export function actif(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idDomDest : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
};

/*L’utilisateur demande au serveur de transmettre le message 
à la destination // indiquée (un domaine voisin).
 */
export function transmettre(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idDomDest : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
};

/* L’utilisateur demande au serveur de vérifier que 
son interprétation du message est correcte.
 */
export function verifier(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
interpretation : Mot,
 ):void{
};

/*L’utilisateur gagne la partie après vérification de l’interprétation // par le serveur.
 */
export function gagner(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
};

/*L’utilisateur perd la partie après vérification de l’interprétation // par le serveur.
 */
export function perdre(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
};

/*L’utilisateur détruit le message à la demande du serveur // (après un verrouillage réussi).
*/
export function detruire(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
};


export function ignorer(idUtil :Identifiant<'utilisateur'>,
idDom : Identifiant<'domaine'>,
idMessage : Identifiant<'message'>,
contenu : Mot,
 ):void{
};