import {Identification, Identifiant, creerIdentifiant, egaliteIdentifiant, creerIdentificationParCompteur, FormatIdentifiableMutable, FormatIdentifiableImmutable} from '../../bibliotheque/types/identifiant';
import {TableMutableUtilisateursParMessageParDomaine, creerTableMutableUtilisateurParMessageParDomaine, MessageJeu1, FormatMessageJeu1, TypeMessageJeu1 } from '../commun/table'
import { Mot } from '../../bibliotheque/binaire';
import { TableIdentificationMutable, creerTableIdentificationImmutable } from '../../bibliotheque/types/tableIdentification'
import { FormatTableImmutable } from '../../bibliotheque/types/table'
import { Deux } from '../../bibliotheque/types/mutable'
import {PopulationParDomaineMutable, FormatUtilisateur, creerPopulationLocale, creerMessageInitial} from '../commun/communRoutage';
import {connexions, utilisateursConnectesParDomaine, identificationMessages, tableVerrouillageMessagesParDomaine, PERSONNE} from './serveurRoutage'
import { FormatTableauImmutable } from '../../bibliotheque/types/tableau';
import { creerDateMaintenant, creerDateEnveloppe, FormatDateFr } from '../../bibliotheque/types/date';
////////////////////



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
      verrou(dest, id, emetteur); 
      miseAJourAprèsVerrouillage(date, id, emetteur, origine, dest, contenu, utilisateurParDomaine(dest));
  } 
}

// Le serveur met à jour les autres utilisateurs du domaine dest, en // demandant la destruction du message id.

function miseAJourAprèsVerrouillage(date :FormatDateFr  ,id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: Mot, listeUtilisateurs: FormatTableImmutable<FormatUtilisateur>): void {
  let ar; 
  creerTableIdentificationImmutable('utilisateur', listeUtilisateurs).iterer((idU, u) => {
    if (emetteur == idU) {
      ar = TypeMessageJeu1.ACTIF
    } else {
      ar = TypeMessageJeu1.INACTIF
    }
    connexions.valeur(idU).envoyerAuClientDestinataire(new MessageJeu1({
      ID: id,
      ID_emetteur: emetteur,
      ID_origine: origine,
      ID_destination: dest,
      type: ar,
      contenu: contenu,
      date: date
    }));
  });
}

// Le serveur transmet le message reçu s’il est verrouillé par l’émetteur.

// function transmettre(id : Identifiant<'message'>, emetteur: Identifiant<'utilisateur'>, origine:  Identifiant<'sommet'>, dest: Identifiant<'sommet'>, contenu: string): void {
//     verrou(dest, id, PERSONNE); // on leve le verrou
//     diffusion(id, origine, dest, contenu); // on diffuse le message au destinataire choisi
//} 
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
