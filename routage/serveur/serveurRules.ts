import {Identification, Identifiant, creerIdentifiant, egaliteIdentifiant, creerIdentificationParCompteur, FormatIdentifiableMutable, FormatIdentifiableImmutable} from '../../bibliotheque/types/identifiant';
import {TableMutableUtilisateursParMessageParDomaine, creerTableMutableUtilisateurParMessageParDomaine, MessageJeu1, FormatMessageJeu1, TypeMessageJeu1, TableMutableMessagesParUtilisateurParDomaine, FormatSommetJeu1 } from '../commun/communRoutage'
import { Mot,binaire } from '../../bibliotheque/binaire';
import { TableIdentificationMutable, creerTableIdentificationImmutable } from '../../bibliotheque/types/tableIdentification'
import { FormatTableImmutable } from '../../bibliotheque/types/table'
import { Deux } from '../../bibliotheque/types/mutable'
import {Stats,PopulationParDomaineMutable, FormatUtilisateur, creerPopulationLocale, creerMessageInitial,ReseauJeu1} from '../commun/communRoutage';
import {
  connexions,
  configuration,
  identificationMessages, 
  tableVerrouillageMessagesParDomaine, 
  PERSONNE,
  messagesEnvoyesParDomaine,
  pointsParDomaine,
  messagesRecusParDomaine
} from './serveurRoutage';
import { FormatTableauImmutable } from '../../bibliotheque/types/tableau';
import { creerDateMaintenant, creerDateEnveloppe, FormatDateFr } from '../../bibliotheque/types/date';
import {
	creerCompteurParDomaine, 
	ajouterPointsParDomaine,
	ajouterMessageParDomaine,
	calculEcartMessageEnvoyesRecus,
	calculEcartPointsMessage,
	compteurGlobal
} from '../serveur/statistiques';

import { LienJeu1 } from './serveurRoutage'

/*
* TRAITEMENT DES MESSAGES
*/

export function initier(date: FormatDateFr, idUtil: Identifiant<'utilisateur'>, idDomOrigine: Identifiant<'sommet'>, idDomDest: Identifiant<'sommet'>, contenu: Mot): void {
    let id: Identifiant<'message'> = identificationMessages.identifier('message')// incrementation du compteur
    verrou(idDomDest, id, PERSONNE); // creation du message dans la table de verouillage
    diffusion(date, idUtil,id, idDomOrigine, idDomDest, contenu); // diffusion vers destinataire
    //si msg correctement envoye
    console.log("INITIER")
    ajouterMessageParDomaine(idDomOrigine,messagesEnvoyesParDomaine);
    //consigneEnvoi(idDomOrigine,idUtil,contenu);
  }

// verouille dans un domaine le message pour un utilisateur 
function verrou(domaine: Identifiant<'sommet'>, message: Identifiant<'message'>, utilisateur: Identifiant<'utilisateur'>) : void {
  tableVerrouillageMessagesParDomaine.valeur(domaine).ajouter(message, utilisateur);
}

// Diffusion d’un message à tous les utilisateurs d’un domaine (reception)
function diffusion(date: FormatDateFr, idUtil: Identifiant<'utilisateur'>,idMessage: Identifiant<'message'>, origin: Identifiant<'sommet'>, idDomaineDestination: Identifiant<'sommet'>, contenu: Mot) : void {
  console.log("DIFFUSION")
  
  return diffusionListeUtilisateur(date, idUtil, idMessage, origin, idDomaineDestination, contenu, utilisateurParDomaine(idDomaineDestination));
}

function utilisateurParDomaine (idDomaine: Identifiant<'sommet'>) : FormatTableImmutable<FormatUtilisateur> {
  return configuration.getUtilisateursConnectesParDomaine().valeur(idDomaine);
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
  let utilisateurs = configuration.getUtilisateursConnectesParDomaine().valeur(msg.val().ID_destination);
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

export function detruireMessageDomaine(date: FormatDateFr, id: Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine: Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot): void {
  detruire(date, id, emetteur, origine, contenu, utilisateurParDomaine(origine));
}

function detruire(date: FormatDateFr, id: Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine: Identifiant<'sommet'>, contenu: Mot, listeUtilisateurs: FormatTableImmutable<FormatUtilisateur>): void {
  tableVerrouillageMessagesParDomaine.valeur(origine).retirer(id);
  creerTableIdentificationImmutable('utilisateur', listeUtilisateurs).iterer((idU, u) => {
    connexions.valeur(idU).envoyerAuClientDestinataire(new MessageJeu1({
      ID: id,
      ID_emetteur: emetteur,
      ID_origine: origine,
      ID_destination: origine,
      type: TypeMessageJeu1.IGNOR,
      contenu: contenu,
      date: date
    }));
  });
}

// Le serveur transmet le message reçu s’il est verrouillé par l’émetteur.

export function transmettre(date: FormatDateFr, id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot): void {
  let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(origine).valeur(id);
  if (verrouilleur.val === emetteur.val) { // verification que le serveur est verouillé par l'emetteur
    detruire(date, id, emetteur, origine, contenu, utilisateurParDomaine(origine));
    verrou(dest, id, PERSONNE); 
    diffusion(date, emetteur, id, origine, dest, contenu);
  } 
}

// Le serveur vérifie que l’utilisateur interprète correctement le 
// message si celui-ci est verrouillé par l’utilisateur et indique 
// qu’il a gagné le cas échéant.

export function verifier(date: FormatDateFr, id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, contenu: Mot): void {
  //ajouterMessageParDomaine(origine,messagesRecusParDomaine);
  //recepteur du message
  let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(origine).valeur(id);

    if (verrouilleur.val === emetteur.val){
      if (consigne(origine, emetteur, contenu)){
        ajouterPointsParDomaine(origine,pointsParDomaine); //rajoute un "point" car bien deco
        //envoi reponse
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
        ajouterMessageParDomaine(origine,messagesRecusParDomaine); //compatabilise msg mal deco
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
    detruire(date, id, emetteur, origine, contenu, utilisateurParDomaine(origine));
}


export function deverrouiller(date : FormatDateFr,id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot): void {
  let verrouilleur = tableVerrouillageMessagesParDomaine.valeur(origine).valeur(id);
  if (verrouilleur === emetteur) { // verification que le serveur est bien verouille par l'emetteur concerne 
      verrou(dest, id, PERSONNE); 
      creerTableIdentificationImmutable('utilisateur', utilisateurParDomaine(origine)).iterer((idU, u) => {
        console.log(idU);
        connexions.valeur(idU).envoyerAuClientDestinataire(new MessageJeu1({
          ID: id,
          ID_emetteur: emetteur,
          ID_origine: origine,
          ID_destination: origine,
          type: TypeMessageJeu1.LIBE,
          contenu: contenu,
          date: date
        }));
      });
  } 
}


export function statistiques(lien: LienJeu1, date : FormatDateFr,id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, contenu: Mot): void {
  //Changer le contenu pour qu'il contienne les stats
    var stats: Stats = [];
    stats.push(["Messages envoyes : ",compteurGlobal(messagesEnvoyesParDomaine)]);
    stats.push(["Messages decodes : ",compteurGlobal(pointsParDomaine)]);
    stats.push(["Messages perdus : ",compteurGlobal(messagesRecusParDomaine)]);

  //envoie du bon contenu a la meme personne
  lien.envoyerAuClientDestinataire(new MessageJeu1({
    ID: id,
    ID_emetteur: emetteur,
    ID_origine: origine,
    ID_destination: origine,
    type: TypeMessageJeu1.STATISTIQUES,
    contenu: contenu,
    date: date,
    stats: stats,
  }));
}

//Verifie que le message envoye par l'utilisateur est correct --> cad bien decode
function consigne(origine:  Identifiant<'sommet'>, emetteur: Identifiant<'utilisateur'>, contenu: Mot): boolean {
  let tConsigne = configuration.getTableConsigneUtilisateurParDomaine().valeur(origine).valeur(emetteur)['structure'];  
  let tContenu = contenu['structure'];
  if (tContenu.taille !=tConsigne.taille) {
   // console.log("TAILLE DIFFERENTE  ");
    return false;
  }
  for (let i = 0; i < tConsigne.taille; i++) {
    if (tConsigne.tableau[i] != tContenu.tableau[i]) {
     // console.log("CARACTERE DIFFERENTE  ");
      return false;
    }
  }
  //console.log("LE MSG A BIEN ETE DECODE ");
  return true;
}
