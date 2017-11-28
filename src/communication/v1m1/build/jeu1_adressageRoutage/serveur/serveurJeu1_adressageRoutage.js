"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs");
var types_1 = require("../../bibliotheque/types");
var binaire_1 = require("../../bibliotheque/binaire");
var serveurConnexions_1 = require("../../bibliotheque/serveurConnexions");
var serveurApplications_1 = require("../../bibliotheque/serveurApplications");
var jeu1_adressageRoutage_1 = require("../commun/jeu1_adressageRoutage");
var ServeurJeu1 = /** @class */ (function (_super) {
    __extends(ServeurJeu1, _super);
    function ServeurJeu1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServeurJeu1;
}(serveurConnexions_1.ServeurLiensWebSocket));
var LienJeu1 = /** @class */ (function (_super) {
    __extends(LienJeu1, _super);
    function LienJeu1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LienJeu1;
}(serveurConnexions_1.LienWebSocket));
/*
 * Etat du serveur - Partie 1 :
 * - réseau
 * - Population(idDomaine, utilisateurs)
 * - connexions(idUtilisateur, lien par Web Socket)
 * - répertoire principal
 * - serveur d'applications
 * - serveur de canaux
 */
var anneau = jeu1_adressageRoutage_1.creerAnneauJeu1([binaire_1.binaire(0), binaire_1.binaire(1), binaire_1.binaire(2), binaire_1.binaire(3)]);
//const reseauConnecte: TableNoeudsJeu1 = creerTableVideNoeuds();
var utilisateursParDomaine = jeu1_adressageRoutage_1.assemblerPopulationParDomaine(anneau, [binaire_1.binaire(0), binaire_1.binaire(1)]);
var utilisateursAConnecterParDomaine = jeu1_adressageRoutage_1.assemblerPopulationParDomaine(anneau, [binaire_1.binaire(0), binaire_1.binaire(1)]);
var utilisateursConnectesParDomaine = jeu1_adressageRoutage_1.assemblerPopulationParDomaine(anneau, []);
var connexions = types_1.creerTableIdentificationMutableVide('utilisateur', function (x) { return x; });
var repertoireHtml = shell.pwd() + "/build";
var serveurAppli = new serveurApplications_1.ServeurApplications(jeu1_adressageRoutage_1.hote, jeu1_adressageRoutage_1.port1);
var serveurCanaux = new ServeurJeu1(jeu1_adressageRoutage_1.port2, jeu1_adressageRoutage_1.hote);
/*
* Fin de l'état - Partie 1
*/
/*
* Configuration et démarrage du serveur d'applications
*/
serveurAppli.specifierRepertoireScriptsEmbarques("build");
{
    var racine_1 = "/";
    var ressource_1 = "interfaceJeu1.html";
    serveurAppli.enregistrerReponseARequeteGET(racine_1, function (i) {
        var d = types_1.creerDateMaintenant();
        console.log("* " + d.representationLog() + " - Service de " + ressource_1 + " en " + racine_1);
        i.servirFichier(repertoireHtml, ressource_1);
    });
}
serveurAppli.demarrer();
/*
* Configuration du serveur de canaux
*/
/*
* Config 1 - Traitemetn des connexions
*/
serveurCanaux.enregistrerTraitementConnexion(function (l) {
    var ids;
    try {
        ids = utilisateursAConnecterParDomaine.selectionnerUtilisateur();
    }
    catch (e) {
        var d_1 = types_1.creerDateMaintenant();
        console.log("* " + d_1.representationLog() + " - " + e.message);
        console.log("* " + d_1.representationLog() + " - Connexion impossible d'un client : le réseau est complet.");
        l.envoyerMessageErreur(jeu1_adressageRoutage_1.composerErreurJeu1("Jeu 1 (adressage - routage) - Il est impossible de se connecter : le réseau est déjà complet.", d_1.val()));
        return false;
    }
    var ID_dom = ids[0];
    var ID_util = ids[1];
    if (connexions.contient(ID_util)
        || utilisateursConnectesParDomaine.contientUtilisateur(ID_dom, ID_util)) {
        var d_2 = types_1.creerDateMaintenant();
        console.log("* " + d_2.representationLog() + " - Connexion impossible d'un client : le réseau est corrompu.");
        l.envoyerMessageErreur(jeu1_adressageRoutage_1.composerErreurJeu1("Jeu 1 (adressage - routage) - Réseau corrompu ! Il est impossible de se connecter : le réseau est corrompu. Contacter l'administrateur.", d_2.val()));
        return false;
    }
    // Cas où la sélection d'un utilisateur est réussie
    var d = types_1.creerDateMaintenant();
    console.log("* " + d.representationLog()
        + " - Connexion de l'utilisateur " + ID_util.val
        + " du domaine " + ID_dom.val + " par Web socket.");
    connexions.ajouter(ID_util, l);
    var n = anneau.noeud(ID_dom);
    var pop = utilisateursParDomaine.valeur(ID_dom);
    var u = utilisateursParDomaine.utilisateur(ID_dom, ID_util);
    var config = jeu1_adressageRoutage_1.composerConfigurationJeu1(n, pop, u, d.val());
    console.log("- envoi au client d'adresse " + l.adresseClient());
    console.log("  - de la configuration brute " + config.brut());
    console.log("  - de la configuration nette " + config.representation());
    l.envoyerConfiguration(config);
    utilisateursConnectesParDomaine.ajouterUtilisateur(ID_dom, u);
    utilisateursAConnecterParDomaine.retirerUtilisateur(ID_dom, ID_util);
    return true;
});
/*
* Etat du serveur - Partie 2 (messages) :
* - Identification des messages
* - Messages(idDomaine, idMessage, PERSONNE | idUtilisateur) : table
*/
var identificationMessages = types_1.creerIdentificationParCompteur("MSG-");
var tableVerrouillageMessagesParDomaine = jeu1_adressageRoutage_1.creerTableMutableUtilisateurParMessageParDomaine();
{
    anneau.iterer(function (id, n) {
        tableVerrouillageMessagesParDomaine.ajouter(id, types_1.creerTableIdentificationMutableVide('message', function (x) { return x; }));
    });
}
var PERSONNE = types_1.creerIdentifiant('utilisateur', 'LIBRE');
// TODO Consigne !
/*
* Config 2 - Traitement des messages
*/
function diffuser(msg) {
    var utilisateurs = utilisateursConnectesParDomaine.valeur(msg.val().ID_destination);
    types_1.creerTableIdentificationImmutable('utilisateur', utilisateurs).iterer(function (idU, u) {
        connexions.valeur(idU).envoyerAuClientDestinataire(msg);
    });
}
function accuserReception(msg) {
    connexions.valeur(msg.val().ID_emetteur).envoyerAuClientDestinataire(msg);
}
function verrouiller(msg) {
    var utilisateurs = utilisateursConnectesParDomaine.valeur(msg.val().ID_origine);
    types_1.creerTableIdentificationImmutable('utilisateur', utilisateurs).iterer(function (idU, u) {
        var ar = (types_1.egaliteIdentifiant(idU, msg.val().ID_emetteur)) ?
            jeu1_adressageRoutage_1.TypeMessageJeu1.ACTIF : jeu1_adressageRoutage_1.TypeMessageJeu1.INACTIF;
        connexions.valeur(idU).envoyerAuClientDestinataire(msg.avecAccuseReception(ar));
    });
}
serveurCanaux.enregistrerTraitementMessages(function (l, m) {
    console.log('TODO traitement messages');
    var msg = jeu1_adressageRoutage_1.creerMessageEnveloppe(m);
    console.log("* Traitement d'un message");
    console.log("- brut : " + msg.brut());
    console.log("- net : " + msg.representation());
    switch (m.type) {
        case jeu1_adressageRoutage_1.TypeMessageJeu1.INIT:
            // TODO tester erreurs
            // TODO ajouter log            
            msg = msg.avecIdentifiant(identificationMessages.identifier('message'));
            tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_destination).ajouter(msg.val().ID, PERSONNE);
            accuserReception(msg.avecAccuseReception(jeu1_adressageRoutage_1.TypeMessageJeu1.SUCCES_INIT));
            diffuser(msg.sansEmetteurPourTransit());
            break;
        case jeu1_adressageRoutage_1.TypeMessageJeu1.VERROU:
            // TODO tester erreurs.
            // TODO ajouter log
            var verrouilleur = tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).valeur(msg.val().ID);
            if (verrouilleur === PERSONNE) {
                tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).ajouter(msg.val().ID, msg.val().ID_emetteur);
                verrouiller(msg);
            }
            else {
                // TODO Rien à faire. 
            }
            break;
        case jeu1_adressageRoutage_1.TypeMessageJeu1.ACTIF:
            // TODO tester erreurs.
            // TODO ajouter log
            tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_origine).retirer(msg.val().ID);
            tableVerrouillageMessagesParDomaine.valeur(msg.val().ID_destination).ajouter(msg.val().ID, PERSONNE);
            accuserReception(msg.avecAccuseReception(jeu1_adressageRoutage_1.TypeMessageJeu1.SUCCES_ACTIF));
            diffuser(msg.sansEmetteurPourTransit());
            break;
        default:
    }
});
serveurCanaux.enregistrerTraitementFermeture(function (l, r, desc) {
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
//# sourceMappingURL=serveurJeu1_adressageRoutage.js.map