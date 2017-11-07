import * as url from 'url';
import * as shell from "shelljs";

import {
    Table,
    Identifiant,
    TableIdentification, creerTableIdentificationVide 
} from "../../bibliotheque/types";

import { creerReseauVide } from "../../bibliotheque/communication";
import {
    hote, port1, port2,
    SommetTchat,
    ReseauTchat, creerAnneauTchat,
    FormatNoeudTchatEX, 
    creerMessageErreurConnexion, creerMessageRetourErreur,
    TypeMessageTchat, FormatMessageTchatEX, EtiquetteMessageTchat,
    MessageTchat,
    composerConfigurationTchat, FormatConfigurationTchatEX, EtiquetteConfigurationTchat,
    composerErreurTchat, FormatErreurTchatEX, EtiquetteErreurTchat,
    
} from '../commun/tchat';
import { ServeurLiensWebSocket, LienWebSocket } from "../../bibliotheque/serveurConnexions";
import { ServeurApplications, Interaction } from "../../bibliotheque/serveurApplications";

import { creerDateMaintenant } from "../../bibliotheque/types"

class ServeurTchat extends ServeurLiensWebSocket<
    FormatErreurTchatEX, FormatErreurTchatEX, EtiquetteErreurTchat,
    FormatConfigurationTchatEX, FormatConfigurationTchatEX, EtiquetteConfigurationTchat,
    FormatMessageTchatEX, FormatMessageTchatEX, EtiquetteMessageTchat
    > { }

class LienTchat extends LienWebSocket<
    FormatErreurTchatEX, FormatErreurTchatEX, EtiquetteErreurTchat,
    FormatConfigurationTchatEX, FormatConfigurationTchatEX, EtiquetteConfigurationTchat,
    FormatMessageTchatEX, FormatMessageTchatEX, EtiquetteMessageTchat
    > { }


const anneau: ReseauTchat = creerAnneauTchat(["titi", "toto", "coco", "sissi"]);
const reseauConnecte: ReseauTchat = creerReseauVide();
const connexions: TableIdentification<'sommet', LienTchat, LienTchat>
    = creerTableIdentificationVide<'sommet', LienTchat, LienTchat>('sommet', (x) => x);

const repertoireHtml: string = shell.pwd() + "/build";

const serveurAppli: ServeurApplications = new ServeurApplications(hote, port1);

serveurAppli.specifierRepertoireScriptsEmbarques("build");

{
    let racine = "/";
    let ressource = "interfaceTchat.html";

    serveurAppli.enregistrerReponseARequeteGET(racine, (i: Interaction) => {
        console.log("* " + creerDateMaintenant().representationLog() + " - Service de " + ressource + " en " + racine);
        i.servirFichier(repertoireHtml, ressource);
    });
}

serveurAppli.demarrer();

const serveurCanaux = new ServeurTchat(port2, hote);

serveurCanaux.enregistrerTraitementConnexion((l: LienTchat) => {
    let ID_sommet: Identifiant<'sommet'>;
    try{
        ID_sommet = anneau.selectionNoeud();
    }catch(e){
        let d = creerDateMaintenant();
        console.log("* " + d.representationLog() + " - " + (<Error>e).message);
        console.log("* " + d.representationLog() + " - Connexion impossible d'un client : le réseau est complet.");
        l.envoyerMessageErreur(composerErreurTchat(
            "Tchat - Réseau complet ! Il est impossible de se connecter : le réseau est complet.",
            d.ex()));
        return false;
    }

    if (connexions.contient(ID_sommet) || reseauConnecte.possedeNoeud(ID_sommet)) {
        let d = creerDateMaintenant()
        console.log("* " + d.representationLog() + " - Connexion impossible d'un client : le réseau est corrompu.");
        l.envoyerMessageErreur(composerErreurTchat(
            "Tchat - Réseau corrompu ! Il est impossible de se connecter : le réseau est corrompu. Contacter l'administrateur.",
            d.ex()));
        return false;
    }

    // Cas où la sélection d'un noeud a réussi
    let d = creerDateMaintenant()
    console.log("* " + d.representationLog() + " - Connexion de " + ID_sommet.val + " par Web socket.");

    connexions.ajouter(ID_sommet, l);

    let n = anneau.noeud(ID_sommet);
    let config = composerConfigurationTchat(n, d.ex());
    console.log("- envoi au client d'adresse " + l.adresseClient());
    console.log("  - de la configuration brute " + config.brut());
    console.log("  - de la configuration nette " + config.representation());
    l.envoyerConfiguration(config);
    anneau.retirerNoeud(n);
    reseauConnecte.ajouterNoeud(n);
    return true;
});

serveurCanaux.enregistrerTraitementMessages((l: LienTchat, m: FormatMessageTchatEX) => {
    let msg: MessageTchat = new MessageTchat(m);
    console.log("* Traitement d'un message");
    console.log("- brut : " + msg.brut());
    console.log("- net : " + msg.representation());
    switch (m.type) {
        case TypeMessageTchat.COM:
            let ID_emetteurUrl = l.configuration().ex().centre.ID;
            let ID_emetteurMsg = m.ID_emetteur;
            let ID_destinataireMsg = m.ID_destinataire;
            // Contrôle de l'émetteur et du destinataire
            if (!(ID_emetteurUrl.val === ID_emetteurMsg.val)) {
                let msgErreur = "problème d'identité pour l'émetteur : le client utilisant l'adresse "
                    + l.adresseClient()
                    + " devrait signer ses messages " + ID_emetteurUrl + " et non " + ID_emetteurMsg + ".";
                console.log("- " + msgErreur);
                l.envoyerAuClientDestinataire(creerMessageRetourErreur(msg, TypeMessageTchat.ERREUR_EMET, msgErreur));
                break;
            }
            if (connexions.valeur(ID_emetteurMsg) === undefined) {
                let msgErreur = "problème de Web socket : la connexion n'est plus active. Fermer l'onglet et se reconnecter.";
                console.log("- " + msgErreur);
                l.envoyerAuClientDestinataire(creerMessageRetourErreur(msg, TypeMessageTchat.ERREUR_EMET, msgErreur));
                break;
            }
            if (connexions.valeur(ID_destinataireMsg) === undefined) {
                let msgErreur = "destinataire inconnu ou non connecté. Attendre sa connexion ou essayer un autre destinataire.";
                console.log("- " + msgErreur);
                l.envoyerAuClientDestinataire(creerMessageRetourErreur(msg, TypeMessageTchat.ERREUR_DEST, msgErreur));
                break;
            }
            // Contrôle des communications 
            if (!reseauConnecte.sontVoisins(ID_emetteurMsg, ID_destinataireMsg)) {
                let msgErreur = "communication interdite : le noeud émetteur "
                    + ID_emetteurMsg.val
                    + " n'est pas voisin du noeud destinataire " + ID_destinataireMsg.val + ".";
                console.log("- " + msgErreur);
                l.envoyerAuClientDestinataire(creerMessageRetourErreur(msg, TypeMessageTchat.INTERDICTION, msgErreur));
            }
            // Fonctionnement normal
            let lienDestinaire: LienTchat = connexions.valeur(ID_destinataireMsg);
            let lienEmetteur: LienTchat = connexions.valeur(ID_emetteurMsg);
            let msgTransit = msg.transit();
            console.log("- Envoi en transit au client utilisant l'adresse " + lienDestinaire.adresseClient());
            console.log("  - du message brut : " + msgTransit.brut());
            console.log("  - du message net : " + msgTransit.representation());
            lienDestinaire.envoyerAuClientDestinataire(msgTransit);
            let msgAR = msg.avecAccuseReception();
            console.log("- Envoi en accusé de réception au client utilisant l'adresse " + lienDestinaire.adresseClient());
            console.log("  - du message brut : " + msgAR.brut());
            console.log("  - du message net : " + msgAR.representation());
            lienEmetteur.envoyerAuClientDestinataire(msgAR);
            break;
        default:
            let msgErreur = "type de message non reconnu : le type doit être " + TypeMessageTchat.COM.toString() + " et non " + m.type + ".";
            console.log("- " + msgErreur);
            l.envoyerAuClientDestinataire(creerMessageRetourErreur(msg, TypeMessageTchat.ERREUR_TYPE, msgErreur));
            break;
    }
});

serveurCanaux.enregistrerTraitementFermeture((l: LienTchat, r: number, desc: string) => {
    let ID_centre = l.configuration().ex().centre.ID;
    if ((connexions.valeur(ID_centre) === undefined) || (!reseauConnecte.possedeNoeud(ID_centre))) {
        console.log("* Impossibilité de fermer la connexion par Web socket : " + ID_centre.val + " est déjà déconnecté.");
        connexions.ajouter(ID_centre, l);
        return;
    }
    console.log(" * " + creerDateMaintenant().representationLog()
        + " - Déconnexion du client " + ID_centre.val
        + " utilisant l'adresse " + l.adresseClient() + ".");
    console.log("- identité : " + l.configuration().ex().centre.ID.val);
    console.log("- raison : " + r + " ; description : " + desc);
    let n = reseauConnecte.noeud(ID_centre);
    reseauConnecte.retirerNoeud(n);
    connexions.retirer(ID_centre);
    anneau.ajouterNoeud(n);
});

serveurCanaux.demarrer();

