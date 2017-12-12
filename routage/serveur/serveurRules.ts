import {Identification, Identifiant, creerIdentifiant, egaliteIdentifiant, creerIdentificationParCompteur, FormatIdentifiableMutable, FormatIdentifiableImmutable} from '../../bibliotheque/types/identifiant';
import {TableMutableUtilisateursParMessageParDomaine, creerTableMutableUtilisateurParMessageParDomaine, MessageJeu1, TypeMessageJeu1} from '../commun/table'
import { Mot } from '../../bibliotheque/binaire';
import { TableIdentificationMutable, creerTableIdentificationImmutable } from '../../bibliotheque/types/tableIdentification'
import { FormatTableImmutable } from '../../bibliotheque/types/table'
import { Deux } from '../../bibliotheque/types/mutable'
import {connexions, utilisateursConnectesParDomaine, identificationMessages, tableVerrouillageMessagesParDomaine, PERSONNE} from './serveurRoutage'
////////////////////



/*
* Traitement des messages
*/

export function initier(idUtil: Identifiant<'utilisateur'>, idDomOrigine: Identifiant<'sommet'>, idDomDest: Identifiant<'sommet'>, contenu: Mot): void {
    // TODO : Recuperer Identifiant du message 
    console.log('initier le message');
    let id: Identifiant<'message'> = identificationMessages.identifier('message')// incrementation du compteur
    console.log('nouvel id', id);
    verrou(idDomDest, id, PERSONNE); // creation du message dans la table de verouillage
    //diffusion(id, idDomOrigine, idDomDest, contenu); // diffusion vers destinataire
}

// verouille dans un domaine le message pour un utilisateur 
function verrou(domaine: Identifiant<'sommet'>, message: Identifiant<'message'>, utilisateur: Identifiant<'utilisateur'>) : void {
  tableVerrouillageMessagesParDomaine.valeur(domaine).ajouter(message, utilisateur);
}

export function diffuser(msg: MessageJeu1): void {
  let utilisateurs = utilisateursConnectesParDomaine.valeur(msg.val().ID_destination);
  creerTableIdentificationImmutable('utilisateur', utilisateurs).iterer((idU, u) => {
    connexions.valeur(idU).envoyerAuClientDestinataire(msg);
  });
}

export function accuserReception(msg: MessageJeu1): void {
  connexions.valeur(msg.val().ID_emetteur).envoyerAuClientDestinataire(msg);
}

export function verrouiller(msg: MessageJeu1): void {
  let utilisateurs = utilisateursConnectesParDomaine.valeur(msg.val().ID_origine);
  creerTableIdentificationImmutable('utilisateur', utilisateurs).iterer((idU, u) => {
    let ar = egaliteIdentifiant(idU, msg.val().ID_emetteur) ? TypeMessageJeu1.ACTIF : TypeMessageJeu1.INACTIF;
    connexions.valeur(idU).envoyerAuClientDestinataire(msg.avecAccuseReception(ar));
  });
}


/////////////////////





// /* Etat du Serveur */

// // Compteur pour l’identification des messages
// const IdentificationMsg: Identification<'message'> = creerIdentificationParCompteur("MSG-");

// // Table des verroux pour les messages : message idMessage verrouillé // par (PERSONNE | idUtilisateur) de idDomaine
// // Verrou(idDomaine, idMessage, PERSONNE | idUtilisateur)*
// const tableVerrouillageMessagesParDomaine: TableMutableUtilisateursParMessageParDomaine
//     = creerTableMutableUtilisateurParMessageParDomaine();
// // TODO : complete tableVerrouillageMessagesParDomaine
// // {
// // anneau.iterer((id, n) => {
// //     tableVerrouillageMessagesParDomaine.ajouter(id, creerTableIdentificationMutableVide('message', (x) => x));
// // });
// // }

// // TODO : require utilisateursConnectesParDomaine du type PopulationParDomaineMutable
// // recupere la liste d'utilisateur d'un domaine 
// function utilisateurParDomaine (idDomaine: Identifiant<'sommet'>) : PopulationParDomaineMutable {
//     let utilisateurs = utilisateursConnectesParDomaine.valeur(idDomaine);
//     return utilisateurs; 
// }





// // Diffusion(
// // idMessage, idDomaineOrigine,
// // idDomaineDestination, contenu , listeUtilisateurs)
// // MiseAJourAprèsVerrouillage(
// // idMessage, idUtilisateur,
// // idDomaineOrigine, idDomaineDestination, contenu)
// // MiseAJourAprèsVerrouillage(
// // idMessage, idUtilisateur, idDomaineOrigine, idDomaineDestination, contenu,
// // listeUtilisateurs)
// // !Population(idDomaine, listeUtilisateurs)
// // Consigne(idDomaineDestinataire, idUtilisateurDestinataire, contenu)

// // Type Utilisateur utilisé quand il n'y a pas d'utilisateur
// const PERSONNE: Identifiant<'utilisateur'> = creerIdentifiant('utilisateur', 'LIBRE');

// /* Regles */
// function diffuser(message: MessageJeu1) {
//     //TODO : diffuse les messages au destinataire
// }

// // Le serveur initie la transmission en identifiant le message,


// // Le serveur diffuse le message à tous les utilisateurs d’un domaine, // qui le reçoivent.

// // Diffusion d’un message à tous les utilisateurs d’un domaine
// function diffusion( idMessage: Identifiant<'message'>, origin: Identifiant<'sommet'>, idDomaineDestination: Identifiant<'sommet'>, contenu: Mot) : void {
//     return diffusionListeUtilisateur(idMessage, origin, idDomaineDestination, contenu, utilisateurParDomaine(idDomaineDestination));
// }

// // Récurrence sur les utilisateurs de la liste utilisateurs
// function diffusionListeUtilisateur( idMessage: Identifiant<'message'>, origin: Identifiant<'sommet'>, idDomaineDestination: Identifiant<'sommet'>, contenu: Mot, listeUtilisateurs: PopulationParDomaineMutable) : void {
//     // Completed to split the list 
//     if (!listeUtilisateurs.estVide()) {
//         recevoir[listeUtilisateurs.](idMessage, origin, idDomaineDestination, contenu); // Spe client
//         return diffusionListeUtilisateur( idMessage, origin, idDomaineDestination, contenu, listeUtilisateurs);
//     }
// }

// // Le serveur verrouille le message id à la demande de emetteur du // domaine dest.

// function verrouiller(id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: string): void {
//     if () {
//         verrou(dest, id, emetteur); 
//         miseAJourAprèsVerrouillage(id, emetteur, origine, dest, contenu);
//     } 
// }
// // Le serveur met à jour les autres utilisateurs du domaine dest, en // demandant la destruction du message id.

// function miseAJourAprèsVerrouillage(id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: string): void {
//     miseAJourAprèsVerrouillageListeUtilisateur(id, emetteur, origine, dest, contenu, lu)
// } 

// function miseAJourAprèsVerrouillageListeUtilisateur(id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: string, listeUtilisateurs: string): void {
//     if (listeUtilisateurs.length() !== 0) {
//         if (listeUtilisateurs[0] === emetteur) {
//             detruire[u](id);
//         } else {
//             activer[u](id, origine, dest, contenu)
//         }
//         miseAJourAprèsVerrouillageListeUtilisateur(id, emetteur, origine, dest, contenu, listeUtilisateurs); // remove fst element 
//     }
// }

// // Le serveur transmet le message reçu s’il est verrouillé par l’émetteur.

// function transmettre(id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: string): void {
//     verrou(dest, id, PERSONNE); // on leve le verrou
//     diffusion(id, origine, dest, contenu); // on diffuse le message au destinataire choisi
// } 
// // Le serveur vérifie que l’utilisateur interprète correctement le 
// // message si celui-ci est verrouillé par l’utilisateur et indique 
// // qu’il a gagné le cas échéant.

// verifier(id, utilisateur, domaine, contenu) & Consigne(domaine, utilisateur, contenu) & Verrou(domaine, id, utilisateur)
// > gagner[utilisateur](id, domaine, contenu)

// serveurCanaux.enregistrerTraitementMessages((l: LienJeu1, m: FormatMessageJeu1) => {

//     let msg: MessageJeu1 = creerMessageEnveloppe(m);
//     console.log("* Traitement d'un message");
//     console.log("- brut : " + msg.brut());
//     console.log("- net : " + msg.representation());


//     switch (m.type) {
//         case TypeMessageJeu1.INIT:
//             msg = msg.avecIdentifiant(identificationMessages.identifier('message'));
//             tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_destination).ajouter(msg.val().ID, PERSONNE);
//             accuserReception(msg.avecAccuseReception(TypeMessageJeu1.SUCCES_INIT));
//             diffuser(msg.sansEmetteurPourTransit());
//             break;
//         case TypeMessageJeu1.VERROU:
//             // TODO tester erreurs.
//             // TODO ajouter log
//             let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).valeur(msg.val().ID);
//             if (verrouilleur === PERSONNE) {
//                 tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).ajouter(msg.val().ID, msg.val().ID_emetteur);
//                 verrouiller(msg);
//             } else {
//                 // TODO Rien à faire. 
//             }
//             break;
//         case TypeMessageJeu1.ACTIF:
//             // TODO tester erreurs.
//             // TODO ajouter log
//             tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).retirer(msg.val().ID);
//             tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_destination).ajouter(msg.val().ID, PERSONNE);
//             accuserReception(msg.avecAccuseReception(TypeMessageJeu1.SUCCES_ACTIF));
//             diffuser(msg.sansEmetteurPourTransit());
//             break;
//         default:
//     }

// });



// /// Helpers 
// export interface FormatUtilisateur extends FormatIdentifiableImmutable<'utilisateur'> {
//     readonly pseudo: ReadonlyArray<Deux>, // TODO ajouter d'autres caractéristiques
// }

// export type FormatPopulationLocaleImmutable = FormatTableImmutable<FormatUtilisateur>;

// class TableUtilisateurs
// extends TableIdentificationMutable<'utilisateur',
// FormatUtilisateur, FormatUtilisateur> {
// constructor() {
//     super('utilisateur', (x) => x);
// }
// }


// export class PopulationParDomaineMutable
// extends TableIdentificationMutable<'sommet',
// TableUtilisateurs,
// FormatPopulationLocaleImmutable
// > {

// constructor() {
//     super('sommet', (t: TableUtilisateurs) => t.val());
// }

// contientUtilisateur(ID_dom: Identifiant<'sommet'>, ID_util: Identifiant<'utilisateur'>): boolean {
//     if (!this.contient(ID_dom)) {
//         return false;
//     }
//     return this.valeurEtat(ID_dom).contient(ID_util);
// }

// utilisateur(ID_dom: Identifiant<'sommet'>, ID_util: Identifiant<'utilisateur'>): FormatUtilisateur {
//     return this.valeurEtat(ID_dom).valeur(ID_util);
// }


// ajouterDomaine(ID_dom: Identifiant<'sommet'>) {
//     this.ajouter(ID_dom, new TableUtilisateurs());
// }

// ajouterUtilisateur(ID_dom: Identifiant<'sommet'>, u: FormatUtilisateur) {
//     this.valeurEtat(ID_dom).ajouter(u.ID, u);
// }

// retirerUtilisateur(ID_dom: Identifiant<'sommet'>, ID_util: Identifiant<'utilisateur'>) {
//     this.valeurEtat(ID_dom).retirer(ID_util);
// }

// selectionnerUtilisateur(): [Identifiant<'sommet'>, Identifiant<'utilisateur'>] {
//     let ID_dom = this.selectionCleSuivantCritereEtat(pop => !pop.estVide());
//     let ID_util = this.valeurEtat(ID_dom).selectionCle();
//     return [ID_dom, ID_util];
// }

// }

// const utilisateursConnectesParDomaine: PopulationParDomaineMutable
// = assemblerPopulationParDomaine(anneau, []);
