import {
	port1,
	port2,
	hote,
	TableMutableMessagesParUtilisateurParDomaine,
	creerTableMutableMessageParUtilisateurParDomaine
} from '../commun/communRoutage';
import * as url from 'url';
import * as shell from 'shelljs';
import * as serveur from '../serveur/serveurRules';
import { Identification, creerIdentificationParCompteur } from '../../bibliotheque/types/identifiant';
import { Identifiant, creerIdentifiant, egaliteIdentifiant } from '../../bibliotheque/types/identifiant';
import { creerTableImmutable } from '../../bibliotheque/types/table';
import {
	TableIdentificationMutable,
	creerTableIdentificationMutableVide,
	creerTableIdentificationImmutable
} from '../../bibliotheque/types/tableIdentification';
import { creerDateEnveloppe, creerDateMaintenant } from '../../bibliotheque/types/date';

import {} from '../../bibliotheque/outils';
import { binaire, Mot, motAleatoire, creerMot , tableauBinaireAleatoire,nombreAleatoire, getRandomInt} from '../../bibliotheque/binaire';
import {} from '../../bibliotheque/communication';
import { NOMBRE_DE_DOMAINES, UTILISATEURS_PAR_DOMAINE, NOMBRE_UTILISATEURS_PAR_DOMAINE } from '../config';

import { ServeurLiensWebSocket, LienWebSocket } from '../../bibliotheque/serveurConnexions';
import { ServeurApplications, Interaction } from '../../bibliotheque/serveurApplications';
import {
	FormatErreurJeu1,
	EtiquetteErreurJeu1,
	FormatConfigurationJeu1,
	EtiquetteConfigurationJeu1,
	EtiquetteMessageJeu1,
	FormatMessageJeu1,
	ReseauJeu1,
	creerAnneauJeu1,
	PopulationParDomaineMutable,
	assemblerPopulationParDomaine,
	composerErreurJeu1,
	composerConfigurationJeu1,
	TableMutableUtilisateursParMessageParDomaine,
	creerTableMutableUtilisateurParMessageParDomaine,
	MessageJeu1,
	TypeMessageJeu1,
	creerMessageEnveloppe
} from '../commun/communRoutage';
import { Deux } from '../../bibliotheque/types/mutable';

import {
	creerCompteurParDomaine, 
	ajouterPointsParDomaine,
	ajouterMessageParDomaine,
	calculEcartMessageEnvoyesRecus,
	calculEcartPointsMessage,
	compteurMessageEnvoyes,
	compteurPointsParDomaine
} from '../serveur/statistiques';
import { config } from 'shelljs';
import { log } from 'util';
import{remplirTableConsigne,remplirTableCible, copieTableConsigne}from'../serveur/consigne';


class ServeurJeu1 extends ServeurLiensWebSocket<
	FormatErreurJeu1,
	FormatErreurJeu1,
	EtiquetteErreurJeu1,
	FormatConfigurationJeu1,
	FormatConfigurationJeu1,
	EtiquetteConfigurationJeu1,
	FormatMessageJeu1,
	FormatMessageJeu1,
	EtiquetteMessageJeu1
> {}

class LienJeu1 extends LienWebSocket<
	FormatErreurJeu1,
	FormatErreurJeu1,
	EtiquetteErreurJeu1,
	FormatConfigurationJeu1,
	FormatConfigurationJeu1,
	EtiquetteConfigurationJeu1,
	FormatMessageJeu1,
	FormatMessageJeu1,
	EtiquetteMessageJeu1
> {}

/*
 * Etat du serveur - Partie 1 :
 * - réseau
 * - Population(idDomaine, utilisateurs)
 * - connexions(idUtilisateur, lien par Web Socket)
 * - répertoire principal
 * - serveur d'applications
 * - serveur de canaux  
 */

// Création du nombre de domaines défini dans le fichier config.ts à la racine du dossier routage
let tableauReseau = [];
for (let i = 0; i < NOMBRE_DE_DOMAINES; i++) {
	tableauReseau.push(binaire(i));
}

const anneau: ReseauJeu1 = creerAnneauJeu1(tableauReseau);

//const reseauConnecte: TableNoeudsJeu1 = creerTableVideNoeuds();

// tmp - Création du nombre d'utilisateurs par domaine
let tableauDomaine = [];
for (let i = 0; i < UTILISATEURS_PAR_DOMAINE; i++) {
	tableauDomaine.push(binaire(i));
}

export const utilisateursParDomaine: PopulationParDomaineMutable = assemblerPopulationParDomaine(anneau, tableauDomaine);

const utilisateursAConnecterParDomaine: PopulationParDomaineMutable = assemblerPopulationParDomaine(anneau, tableauDomaine);

const utilisateursPourConsigneParDomaine: PopulationParDomaineMutable = assemblerPopulationParDomaine(anneau, tableauDomaine);

export const utilisateursConnectesParDomaine: PopulationParDomaineMutable = assemblerPopulationParDomaine(anneau, []);

export const connexions: TableIdentificationMutable<'utilisateur', LienJeu1, LienJeu1> = creerTableIdentificationMutableVide<
	'utilisateur',
	LienJeu1,
	LienJeu1
>('utilisateur', x => x);

const repertoireHtml: string = shell.pwd() + '/build';

const serveurAppli: ServeurApplications = new ServeurApplications(hote, port1);

const serveurCanaux = new ServeurJeu1(port2, hote);

//tmp
console.log('Anneau créé (anneau.representation) : ', anneau.representation());
// console.log('Anneau créé (anneau)', anneau);

//CREATION DE TOUTES LES VARIABLES DE COMPTEURS
export var pointsEnvoyesParDomaine = creerCompteurParDomaine(tableauReseau);
export var pointsRecusParDomaine = creerCompteurParDomaine(tableauReseau);
export var messagesEnvoyesParDomaine = creerCompteurParDomaine(tableauReseau);
export var messagesRecusParDomaine = creerCompteurParDomaine(tableauReseau);

/*
* Fin de l'état - Partie 1
*/

/*
* Configuration et démarrage du serveur d'applications
*/
serveurAppli.specifierRepertoireScriptsEmbarques('build');

{
	let racine = '/';
	let ressource = 'interfaceJeu1.html';

	serveurAppli.enregistrerReponseARequeteGET(racine, (i: Interaction) => {
		let d = creerDateMaintenant();
		console.log('* ' + d.representationLog() + ' - Service de ' + ressource + ' en ' + racine);
		i.servirFichier(repertoireHtml, ressource);
	});
}

serveurAppli.demarrer();

/*
* Configuration du serveur de canaux 
*/

/*
* Config 1 - Traitement des connexions
*/

serveurCanaux.enregistrerTraitementConnexion((l: LienJeu1) => {
	let ids: [Identifiant<'sommet'>, Identifiant<'utilisateur'>];
	try {
		ids = utilisateursAConnecterParDomaine.selectionnerUtilisateur();
	} catch (e) {
		let d = creerDateMaintenant();
		console.log('* ' + d.representationLog() + ' - ' + (<Error>e).message);
		console.log('* ' + d.representationLog() + " - Connexion impossible d'un client : le réseau est complet.");
		l.envoyerMessageErreur(
			composerErreurJeu1('Jeu 1 (adressage - routage) - Il est impossible de se connecter : le réseau est déjà complet.', d.val())
		);
		return false;
	}
	let ID_dom = ids[0];
	let ID_util = ids[1];
	//tmp
	console.log("ids: [Identifiant<'sommet'>, Identifiant<'utilisateur'>]", ids);
	if (connexions.contient(ID_util) || utilisateursConnectesParDomaine.contientUtilisateur(ID_dom, ID_util)) {
		let d = creerDateMaintenant();
		console.log('* ' + d.representationLog() + " - Connexion impossible d'un client : le réseau est corrompu.");
		l.envoyerMessageErreur(
			composerErreurJeu1(
				"Jeu 1 (adressage - routage) - Réseau corrompu ! Il est impossible de se connecter : le réseau est corrompu. Contacter l'administrateur.",
				d.val()
			)
		);
		return false;
	}
	// Cas où la sélection d'un utilisateur est réussie
	let d = creerDateMaintenant();
	console.log(
		'* ' + d.representationLog() + " - Connexion de l'utilisateur " + ID_util.val + ' du domaine ' + ID_dom.val + ' par Web socket.'
	);
	connexions.ajouter(ID_util, l);
	let n = anneau.noeud(ID_dom);
	let pop = utilisateursParDomaine.valeur(ID_dom);
	let u = utilisateursParDomaine.utilisateur(ID_dom, ID_util);
	
	//CONSIGNE : selection aleatoire d'un domaine et user destinataire
	//utlisateur qui se connecte -> on cherche son domaine et son numero d'utilisateur
	var domNb = parseInt(ID_dom.val.substr(4));
	var utilNb = creerMot(u.pseudo).base10();
	
	let config = composerConfigurationJeu1(n, pop, u, d.val(), tableCible[domNb][utilNb]);

	console.log("- envoi au client d'adresse " + l.adresseClient());
	console.log('  - de la configuration brute ' + config.brut());
	console.log('  - de la configuration nette ' + config.representation());
	l.envoyerConfiguration(config);
	utilisateursConnectesParDomaine.ajouterUtilisateur(ID_dom, u);
	utilisateursAConnecterParDomaine.retirerUtilisateur(ID_dom, ID_util);
	return true;
});

/*-
* Etat du serveur - Partie 2 (messages) :
* - Identification des messages
* - Messages(idDomaine, idMessage, PERSONNE | idUtilisateur) : table
*/
export const identificationMessages: Identification<'message'> = creerIdentificationParCompteur('MSG-');
export const tableVerrouillageMessagesParDomaine: TableMutableUtilisateursParMessageParDomaine = creerTableMutableUtilisateurParMessageParDomaine();
{
	anneau.iterer((id, n) => {
		tableVerrouillageMessagesParDomaine.ajouter(id, creerTableIdentificationMutableVide('message', x => x));
	});
}

//CREATION DU TABLEAU DE CONSIGNES
export var tableConsigneUtilisateurParDomaine: TableMutableMessagesParUtilisateurParDomaine = creerTableMutableMessageParUtilisateurParDomaine();
//tableConsigneUtilisateurParDomaine = remplirTableConsigne(utilisateursParDomaine,anneau,tableConsigneUtilisateurParDomaine);
tableConsigneUtilisateurParDomaine = remplirTableConsigne(utilisateursParDomaine,anneau);

//Copie de la tableConsigne pour pour enlever des elements en calculant la cible
//Mais garder consigne initiale pour verifier le decodage
var tableConsModif :TableMutableMessagesParUtilisateurParDomaine = creerTableMutableMessageParUtilisateurParDomaine();
tableConsModif = copieTableConsigne(utilisateursParDomaine,anneau,tableConsigneUtilisateurParDomaine);

//CREATION DU TABLEAU DE CIBLES
export const tableCible = remplirTableCible(utilisateursParDomaine,anneau,tableConsModif);

export const PERSONNE: Identifiant<'utilisateur'> = creerIdentifiant('utilisateur', 'LIBRE');

/*
* Config 2 - Traitement des messages
*/

serveurCanaux.enregistrerTraitementMessages((l: LienJeu1, m: FormatMessageJeu1) => {

  let msg: MessageJeu1 = creerMessageEnveloppe(m);
  console.log("* Traitement d'un message");
  console.log('- brut : ' + msg.brut());

  switch (m.type) {
    case TypeMessageJeu1.INIT:
      // TODO tester erreurs
	  // TODO ajouter log;
	  console.log('message recu ----------------',)
	  serveur.initier(
		  msg.val().date, 
		  msg.val().ID_emetteur, 
		  msg.val().ID_origine, 
		  msg.val().ID_destination, 
		  msg.val().contenu);
	  // En cas de succes, envoie SUCCES a l'emetteur 
	  connexions.valeur(msg.val().ID_emetteur).envoyerAuClientDestinataire(msg.avecAccuseReception(TypeMessageJeu1.SUCCES_INIT));
      break;
	case TypeMessageJeu1.VERROU:
	console.log('message verrou');
      serveur.verrouiller(
		  msg.val().date, 
		  msg.val().ID, 
		  msg.val().ID_emetteur, 
		  msg.val().ID_origine, 
		  msg.val().ID_destination, 
		  msg.val().contenu);
      break;
	case TypeMessageJeu1.SUIVANT:
	console.log('message suivant');
      serveur.transmettre(
		  msg.val().date, 
		  msg.val().ID, 
		  msg.val().ID_emetteur,
		  msg.val().ID_origine, 
		  msg.val().ID_destination, 
		  msg.val().contenu);
	  // En cas de succes, envoie SUCCES a l'emetteur 
	  connexions.valeur(msg.val().ID_emetteur).envoyerAuClientDestinataire(msg.avecAccuseReception(TypeMessageJeu1.SUCCES_TRANSIT));
	  break;
	case TypeMessageJeu1.IGNOR:
		console.log('message a ignorer');
		serveur.deverrouiller(
			msg.val().date,
			msg.val().ID,
			msg.val().ID_emetteur,
			msg.val().ID_origine,
			msg.val().ID_destination,
			msg.val().contenu);
		break;
    case TypeMessageJeu1.ESSAI:
	  console.log('message a verifier');
      serveur.verifier(
		  msg.val().date, 
		  msg.val().ID, 
		  msg.val().ID_emetteur, 
		  msg.val().ID_origine, 
		  msg.val().contenu);
    default:
  }


});

serveurCanaux.enregistrerTraitementFermeture((l: LienJeu1, r: number, desc: string) => {
	console.log('TODO traitement fermeture');
	/*
    let id: IdentifiantSommet = l.configuration().enJSON().centre.id;
    if ((connexions[id] === undefined) || (!reseauConnecte.possedeNoeud(id))) {
        console.log("* Impossibilité de fermer la connexion par Web socket : " + id + " est déjà déconnecté.");
        connexions[id] = l;
        return;
    }
    console.log(" * " + dateFrLog(new Date()) + " - Déconnexion du client utilisant l'adresse " + l.adresseClient() + ".");
    console.log("- identité : " + l.configuration().enJSON().centre.id);
    console.log("- raison : " + r + " ; description : " + desc);
    let n = reseauConnecte.noeud(id);
    reseauConnecte.retirerNoeud(n);
    delete connexions[id];
    anneau.ajouterNoeud(n);
    */
});

serveurCanaux.demarrer();
