import {Identification, Identifiant, creerIdentifiant, egaliteIdentifiant, creerIdentificationParCompteur, FormatIdentifiableMutable, FormatIdentifiableImmutable} from '../../bibliotheque/types/identifiant';
import {TableMutableUtilisateursParMessageParDomaine, creerTableMutableUtilisateurParMessageParDomaine, MessageJeu1, FormatMessageJeu1, TypeMessageJeu1 } from '../commun/communRoutage'
import { Mot } from '../../bibliotheque/binaire';
import { TableIdentificationMutable, creerTableIdentificationImmutable } from '../../bibliotheque/types/tableIdentification'
import { FormatTableImmutable } from '../../bibliotheque/types/table'
import { Deux } from '../../bibliotheque/types/mutable'
import {PopulationParDomaineMutable, FormatUtilisateur, creerPopulationLocale, creerMessageInitial} from '../commun/communRoutage';
import {connexions, utilisateursConnectesParDomaine, identificationMessages, tableVerrouillageMessagesParDomaine, PERSONNE} from './serveurRoutage'
import { FormatTableauImmutable } from '../../bibliotheque/types/tableau';
import { creerDateMaintenant, creerDateEnveloppe, FormatDateFr } from '../../bibliotheque/types/date';

/*
* Traitement des messages
*/

export function initier(date: FormatDateFr, idUtil: Identifiant<'utilisateur'>, idDomOrigine: Identifiant<'sommet'>, idDomDest: Identifiant<'sommet'>, contenu: Mot): void {
    let id: Identifiant<'message'> = identificationMessages.identifier('message')// incrementation du compteur
    verrou(idDomDest, id, PERSONNE); // creation du message dans la table de verouillage
    diffusion(date, idUtil,id, idDomOrigine, idDomDest, contenu); // diffusion vers destinataire
}

// verouille dans un domaine le message pour un utilisateur 
function verrou(domaine: Identifiant<'sommet'>, message: Identifiant<'message'>, utilisateur: Identifiant<'utilisateur'>) : void {
  tableVerrouillageMessagesParDomaine.valeur(domaine).ajouter(message, utilisateur);
}

// Diffusion d’un message à tous les utilisateurs d’un domaine
function diffusion(date: FormatDateFr, idUtil: Identifiant<'utilisateur'>,idMessage: Identifiant<'message'>, origin: Identifiant<'sommet'>, idDomaineDestination: Identifiant<'sommet'>, contenu: Mot) : void {
  return diffusionListeUtilisateur(date, idUtil, idMessage, origin, idDomaineDestination, contenu, utilisateurParDomaine(idDomaineDestination));
}

function utilisateurParDomaine (idDomaine: Identifiant<'sommet'>) : FormatTableImmutable<FormatUtilisateur> {
  return utilisateursConnectesParDomaine.valeur(idDomaine);
}
''
// Récurrence sur les utilisateurs de la liste utilisateurs
function diffusionListeUtilisateur(date: FormatDateFr , idUtil: Identifiant<'utilisateur'>,idMessage: Identifiant<'message'>, origin: Identifiant<'sommet'>, idDomaineDestination: Identifiant<'sommet'>, contenu: Mot, listeUtilisateurs: FormatTableImmutable<FormatUtilisateur>) : void {
  // Completed to split the list 
  let message : MessageJeu1 = new MessageJeu1({
    ID: idMessage,
    ID_emetteur: idUtil,
    ID_origine: origin,
    ID_destination: idDomaineDestination,
    type: TypeMessageJeu1.TRANSIT,
    contenu: contenu,
    date: date
  });
  creerTableIdentificationImmutable('utilisateur', listeUtilisateurs).iterer((idU, u) => {
    connexions.valeur(idU).envoyerAuClientDestinataire(message);
    //recevoir[listeUtilisateurs.](idMessage, origin, idDomaineDestination, contenu); // Spe client
  });
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

// Le serveur verrouille le message id à la demande de emetteur du // domaine dest.

export function verrouiller(date : FormatDateFr,id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot): void {
  let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(origine).valeur(id);
  if (verrouilleur === PERSONNE) { // verification que le serveur n'est pas verouillé
    verrou(origine, id, emetteur);
    miseAJourAprèsVerrouillage(date, id, emetteur, origine, dest, contenu, utilisateurParDomaine(origine));
  } 
}

// Le serveur met à jour les autres utilisateurs du domaine dest, en // demandant la destruction du message id.

function miseAJourAprèsVerrouillage(date :FormatDateFr  ,id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot, listeUtilisateurs: FormatTableImmutable<FormatUtilisateur>): void {
  let ar; 
  creerTableIdentificationImmutable('utilisateur', listeUtilisateurs).iterer((idU, u) => {
    if (emetteur.val == idU.val) {
      ar = TypeMessageJeu1.ACTIF
    } else {
      ar = TypeMessageJeu1.INACTIF
    }
    connexions.valeur(idU).envoyerAuClientDestinataire(new MessageJeu1({
      ID: id,
      ID_emetteur: emetteur,
      ID_origine: origine,
      ID_destination: origine,
      type: ar,
      contenu: contenu,
      date: date
    }));
  });
}

// Le serveur transmet le message reçu s’il est verrouillé par l’émetteur.

export function transmettre(date: FormatDateFr, id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot): void {
  let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(origine).valeur(id);
  if (verrouilleur === emetteur) { // verification que le serveur est verouillé par l'emetteur
    tableVerrouillageMessagesParDomaine.valeur(origine).retirer(id);
    verrou(dest, id, PERSONNE); 
    diffusion(date, emetteur, id, origine, dest, contenu);
  } 
}

// Le serveur vérifie que l’utilisateur interprète correctement le 
// message si celui-ci est verrouillé par l’utilisateur et indique 
// qu’il a gagné le cas échéant.

export function verifier(date: FormatDateFr, id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, contenu: Mot): void {
  let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(origine).valeur(id);
    if (verrouilleur === emetteur){
      if (consigne(origine, emetteur, contenu)){
        connexions.valeur(emetteur).envoyerAuClientDestinataire(new MessageJeu1({
          ID: id,
          ID_emetteur: emetteur,
          ID_origine: origine,
          ID_destination: origine,
          type: TypeMessageJeu1.SUCCES_FIN,
          contenu: contenu,
          date: date
        }))
      } else {
        connexions.valeur(emetteur).envoyerAuClientDestinataire(new MessageJeu1({
          ID: id,
          ID_emetteur: emetteur,
          ID_origine: origine,
          ID_destination: origine,
          type: TypeMessageJeu1.ECHEC_FIN,
          contenu: contenu,
          date: date
        }))
      }
      
    }
}

function consigne(origine:  Identifiant<'sommet'>, emetteur: Identifiant<'utilisateur'>, contenu: Mot): boolean {
  // verifie que la consigne est correcte
  // renvoie un booleen
  return true;
}

export function deverrouiller(date : FormatDateFr,id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot): void {
  let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(origine).valeur(id);
  if (verrouilleur === emetteur) { // verification que le serveur est bien verouille par l'emetteur concerne 
      verrou(dest, id, PERSONNE); 
      miseAJourAprèsVerrouillage(date, id, emetteur, origine, dest, contenu, utilisateurParDomaine(dest));
  } 
}
