import {Identification, Identifiant, creerIdentifiant, creerIdentificationParCompteur} from '../../bibliotheque/types/identifiant';
import {TableMutableUtilisateursParMessageParDomaine, creerTableMutableUtilisateurParMessageParDomaine, MessageJeu1} from '../commun/table'


/* Etat du Serveur */

// Compteur pour l’identification des messages
const IdentificationMsg: Identification<'message'> = creerIdentificationParCompteur("MSG-");

// Table des verroux pour les messages : message idMessage verrouillé // par (PERSONNE | idUtilisateur) de idDomaine
// Verrou(idDomaine, idMessage, PERSONNE | idUtilisateur)*
const tableVerrouillageMessagesParDomaine: TableMutableUtilisateursParMessageParDomaine
    = creerTableMutableUtilisateurParMessageParDomaine();
// TODO : complete tableVerrouillageMessagesParDomaine
// {
// anneau.iterer((id, n) => {
//     tableVerrouillageMessagesParDomaine.ajouter(id, creerTableIdentificationMutableVide('message', (x) => x));
// });
// }

// recupere la liste d'utilisateur d'un domaine 
function utilisateurParDomaine (idDomaine: Identifiant<'sommet'>) : string {
    // TODO
    return ''; 
}

// verouille dans un domaine le message pour un utilisateur 
function verrou(domaine: Identifiant<'sommet'>, message: Identifiant<'message'>, utilisateur: Identifiant<'utilisateur'>) : void {
    tableVerrouillageMessagesParDomaine.valeur(domaine).ajouter(message, utilisateur);
}

// Le serveur diffuse le message à tous les utilisateurs d’un domaine, // qui le reçoivent.

// Diffusion d’un message à tous les utilisateurs d’un domaine
function diffusion( idMessage: Identifiant<'message'>, origin: Identifiant<'sommet'>, idDomaineDestination: Identifiant<'sommet'>, contenu: string) : void {
    return diffusionListeUtilisateur(idMessage, origin, idDomaineDestination, contenu, utilisateurParDomaine(idDomaineDestination));
}

// Récurrence sur les utilisateurs de la liste utilisateurs
function diffusionListeUtilisateur( idMessage: Identifiant<'message'>, origin: Identifiant<'sommet'>, idDomaineDestination: Identifiant<'sommet'>, contenu: string, listeUtilisateurs: string) : void {
    // Completed to split the list 
    recevoir[u](idMessage, origin, idDomaineDestination, contenu);
    return diffusionListeUtilisateur( idMessage, origin, idDomaineDestination, contenu, listeUtilisateurs);
}
// Diffusion(
// idMessage, idDomaineOrigine,
// idDomaineDestination, contenu , listeUtilisateurs)
// MiseAJourAprèsVerrouillage(
// idMessage, idUtilisateur,
// idDomaineOrigine, idDomaineDestination, contenu)
// MiseAJourAprèsVerrouillage(
// idMessage, idUtilisateur, idDomaineOrigine, idDomaineDestination, contenu,
// listeUtilisateurs)
// !Population(idDomaine, listeUtilisateurs)
// Consigne(idDomaineDestinataire, idUtilisateurDestinataire, contenu)

// Type Utilisateur utilisé quand il n'y a pas d'utilisateur
const PERSONNE: Identifiant<'utilisateur'> = creerIdentifiant('utilisateur', 'LIBRE');

/* Regles */
function diffuser(message: MessageJeu1) {
    //TODO : diffuse les messages au destinataire
}

// Le serveur initie la transmission en identifiant le message,
function initier(idUtil: string, emetteur: Identifiant<'utilisateur'>, origin: Identifiant<
'sommet'>, dest: Identifiant<'sommet'>, contenu: string): void {
    
    IdentificationMsg.identifier(contenu); // incrementation du compteur
    verrou(dest, id, PERSONNE); // creation du message dans la table de verouillage
    diffuser(msg.sansEmetteurPourTransit()); // diffusion vers destinataire
}


serveurCanaux.enregistrerTraitementMessages((l: LienJeu1, m: FormatMessageJeu1) => {

    let msg: MessageJeu1 = creerMessageEnveloppe(m);
    console.log("* Traitement d'un message");
    console.log("- brut : " + msg.brut());
    console.log("- net : " + msg.representation());


    switch (m.type) {
        case TypeMessageJeu1.INIT:
            msg = msg.avecIdentifiant(identificationMessages.identifier('message'));
            tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_destination).ajouter(msg.val().ID, PERSONNE);
            accuserReception(msg.avecAccuseReception(TypeMessageJeu1.SUCCES_INIT));
            diffuser(msg.sansEmetteurPourTransit());
            break;
        case TypeMessageJeu1.VERROU:
            // TODO tester erreurs.
            // TODO ajouter log
            let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).valeur(msg.val().ID);
            if (verrouilleur === PERSONNE) {
                tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).ajouter(msg.val().ID, msg.val().ID_emetteur);
                verrouiller(msg);
            } else {
                // TODO Rien à faire. 
            }
            break;
        case TypeMessageJeu1.ACTIF:
            // TODO tester erreurs.
            // TODO ajouter log
            tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).retirer(msg.val().ID);
            tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_destination).ajouter(msg.val().ID, PERSONNE);
            accuserReception(msg.avecAccuseReception(TypeMessageJeu1.SUCCES_ACTIF));
            diffuser(msg.sansEmetteurPourTransit());
            break;
        default:
    }

});