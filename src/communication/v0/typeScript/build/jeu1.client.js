/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 248);
/******/ })
/************************************************************************/
/******/ ({

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CanalClient = (function () {
    function CanalClient(adresse) {
        this.adresse = adresse;
        this.lienServeur = new WebSocket('ws://' + this.adresse, 'echo-protocol');
    }
    ;
    // Effet : send(String)
    CanalClient.prototype.envoyerMessage = function (msg) {
        this.lienServeur.send(msg.brut());
    };
    ;
    // Effet: enregistrement comme écouteur
    CanalClient.prototype.enregistrerTraitementMessageRecu = function (traitement) {
        this.lienServeur.addEventListener("message", function (e) {
            var msg = JSON.parse(e.data);
            if (msg.configurationInitiale !== undefined) {
                return;
            }
            if (msg.erreurRedhibitoire !== undefined) {
                return;
            }
            traitement(msg);
        });
    };
    ;
    // Effet: enregistrement comme écouteur
    CanalClient.prototype.enregistrerTraitementConfigurationRecue = function (traitement) {
        this.lienServeur.addEventListener("message", function (e) {
            var contenuJSON = JSON.parse(e.data);
            if (contenuJSON.configurationInitiale === undefined) {
                return;
            }
            traitement(contenuJSON);
        });
    };
    ;
    // Effet: enregistrement comme écouteur
    CanalClient.prototype.enregistrerTraitementErreurRecue = function (traitement) {
        this.lienServeur.addEventListener("message", function (e) {
            var contenuJSON = JSON.parse(e.data);
            if (contenuJSON.erreurRedhibitoire === undefined) {
                return;
            }
            traitement(contenuJSON);
        });
    };
    ;
    return CanalClient;
}());
exports.CanalClient = CanalClient;
;
function creerCanalClient(adresse) {
    return new CanalClient(adresse);
}
exports.creerCanalClient = creerCanalClient;


/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

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
var types_1 = __webpack_require__(53);
;
var Message = (function (_super) {
    __extends(Message, _super);
    function Message() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Message;
}(types_1.Enveloppe));
exports.Message = Message;
var Configuration = (function (_super) {
    __extends(Configuration, _super);
    function Configuration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Configuration;
}(types_1.Enveloppe));
exports.Configuration = Configuration;
var ErreurRedhibitoire = (function (_super) {
    __extends(ErreurRedhibitoire, _super);
    function ErreurRedhibitoire() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ErreurRedhibitoire;
}(types_1.Enveloppe));
exports.ErreurRedhibitoire = ErreurRedhibitoire;
/*
- réseau ::= noeud*
- noeud ::= (sommet, sommet*)
- sommet ::= {identifiant, ...}

- Serveur : agrégation d'un réseau
- Client : agrégation d'un noeud du réseau

- Remarque : compatibilité ES3 pour les objets.
*/
// - sommet ::= {identifiant, ...}
// La sorte pour les identifiants de sommets est 'sommet'. 
var Sommet = (function (_super) {
    __extends(Sommet, _super);
    function Sommet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Sommet;
}(types_1.Enveloppe));
exports.Sommet = Sommet;
var ReseauTableDeNoeuds = (function (_super) {
    __extends(ReseauTableDeNoeuds, _super);
    function ReseauTableDeNoeuds() {
        return _super.call(this, 'sommet', function (x) { return x; }) || this;
    }
    ReseauTableDeNoeuds.prototype.representation = function () {
        return "réseau de " + this.net('taille') + " noeuds : "
            + this.net('graphe');
    };
    // (simple renommmage)
    ReseauTableDeNoeuds.prototype.possedeNoeud = function (ID_sommet) {
        return this.contient(ID_sommet);
    };
    // Précondition : id1 et id2 sont deux noeuds du réseau.
    ReseauTableDeNoeuds.prototype.sontVoisins = function (ID_sommet1, ID_sommet2) {
        return types_1.creerTableIdentificationImmutable('sommet', this.valeurIN(ID_sommet1).voisins).
            contient(ID_sommet2);
    };
    ReseauTableDeNoeuds.prototype.pourChaqueNoeud = function (f) {
        this.pourChaqueIn(f);
    };
    ReseauTableDeNoeuds.prototype.noeud = function (ID_sommet) {
        return this.valeur(ID_sommet);
    };
    ReseauTableDeNoeuds.prototype.identifiantsNoeuds = function () {
        return this.domaine();
    };
    ReseauTableDeNoeuds.prototype.selectionNoeud = function () {
        return this.selectionCle();
    };
    ReseauTableDeNoeuds.prototype.ajouterNoeud = function (n) {
        this.ajouter(n.centre.ID, n);
    };
    ReseauTableDeNoeuds.prototype.retirerNoeud = function (n) {
        this.retirer(n.centre.ID);
    };
    return ReseauTableDeNoeuds;
}(types_1.TableIdentification));
exports.ReseauTableDeNoeuds = ReseauTableDeNoeuds;
function creerReseauVide() {
    return new ReseauTableDeNoeuds();
}
exports.creerReseauVide = creerReseauVide;
function conversionFormatNoeud(n) {
    return { centre: n.centre, voisins: types_1.conversionFormatTable(function (s) { return s; })(n.voisins) };
}
var NoeudIN = (function (_super) {
    __extends(NoeudIN, _super);
    function NoeudIN(etat) {
        return _super.call(this, conversionFormatNoeud, etat) || this;
    }
    NoeudIN.prototype.aPourVoisin = function (ID_sommet) {
        return types_1.creerTableIdentificationImmutable('sommet', this.in().voisins).
            contient(ID_sommet);
    };
    NoeudIN.prototype.pourChaqueVoisin = function (proc) {
        types_1.creerTableIdentificationImmutable('sommet', this.in().voisins).pourChaque(proc);
    };
    NoeudIN.prototype.ajouterVoisin = function (v) {
        return types_1.creerTableIdentification('sommet', function (x) { return x; }, this.in().voisins)
            .ajouter(v.ID, v);
    };
    return NoeudIN;
}(types_1.Enveloppe));
exports.NoeudIN = NoeudIN;
var NoeudEX = (function (_super) {
    __extends(NoeudEX, _super);
    function NoeudEX(etat) {
        return _super.call(this, conversionFormatNoeud, etat) || this;
    }
    NoeudEX.prototype.aPourVoisin = function (ID_sommet) {
        return types_1.creerTableIdentificationImmutable('sommet', this.in().voisins).
            contient(ID_sommet);
    };
    NoeudEX.prototype.pourChaqueVoisin = function (proc) {
        types_1.creerTableIdentificationImmutable('sommet', this.in().voisins).pourChaque(proc);
    };
    return NoeudEX;
}(types_1.Enveloppe));
exports.NoeudEX = NoeudEX;
var AssemblageReseauEnAnneau = (function (_super) {
    __extends(AssemblageReseauEnAnneau, _super);
    function AssemblageReseauEnAnneau(nombreSommets, fabriqueNoeud) {
        var _this = _super.call(this, function (x) { return x; }) || this;
        _this.nombreSommets = nombreSommets;
        _this.fabriqueNoeud = fabriqueNoeud;
        console.log("* Construction d'un réseau en anneau de " + nombreSommets.toString() + " éléments.");
        return _this;
    }
    // Les sommetts doivent avoir des identifiants deux à deux distincts.
    AssemblageReseauEnAnneau.prototype.ajouterSommet = function (s) {
        if (this.taille() < this.nombreSommets) {
            this.ajouterEnFin(s);
        }
        else {
            console.log("- Impossible d'ajouter un sommet : le réseau en anneau est complet.");
        }
    };
    AssemblageReseauEnAnneau.prototype.assembler = function () {
        var _this = this;
        var restant = this.nombreSommets - this.taille();
        if (restant > 0) {
            console.log("- Impossible d'assembler un réseau en anneau de la taille donnée : ajouter " + restant + " sommets.");
            throw new Error("[Exception : AssemblageReseau.assembler non défini.]");
        }
        // Définition du réseau
        var reseau = creerReseauVide();
        this.pourChaque(function (i, s) {
            var n = _this.fabriqueNoeud({ centre: s, voisins: { table: {}, mutable: types_1.Unite.ZERO } });
            n.ajouterVoisin(_this.valeurIn((i + 1) % _this.nombreSommets));
            n.ajouterVoisin(_this.valeurIn((i + (_this.nombreSommets - 1)) % _this.nombreSommets));
            reseau.ajouterNoeud(n.ex());
        });
        return reseau;
    };
    return AssemblageReseauEnAnneau;
}(types_1.Tableau));
function creerAssemblageReseauEnAnneau(taille, fabriqueNoeud) {
    return new AssemblageReseauEnAnneau(taille, fabriqueNoeud);
}
exports.creerAssemblageReseauEnAnneau = creerAssemblageReseauEnAnneau;


/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function recupererElementHTML(id) {
    var r = document.getElementById(id);
    if (typeof r === "undefined") {
        throw new Error("[Erreur : elementParId(" + id + ") non d\u00E9fini.]");
    }
    return r;
}
function elementParId(id) {
    return recupererElementHTML(id);
}
exports.elementParId = elementParId;
function entreeParId(id) {
    return recupererElementHTML(id);
}
exports.entreeParId = entreeParId;
function recupererEntree(id) {
    return entreeParId(id).value;
}
exports.recupererEntree = recupererEntree;
function initialiserEntree(id, val) {
    entreeParId(id).value = val;
}
exports.initialiserEntree = initialiserEntree;
function initialiserDocument(contenu) {
    document.write(contenu);
}
exports.initialiserDocument = initialiserDocument;
function contenuBalise(champ) {
    var r = recupererElementHTML(champ);
    return r.innerHTML;
}
exports.contenuBalise = contenuBalise;
function poster(id, val) {
    var r = recupererElementHTML(id);
    r.innerHTML += val;
}
exports.poster = poster;
function posterNL(id, val) {
    poster(id, val + "<br>");
}
exports.posterNL = posterNL;
function gererEvenementDocument(type, gestionnaire) {
    console.log("- Document : enregistrement d'un gestionnaire pour l'événement " + type);
    document.addEventListener(type, gestionnaire);
}
exports.gererEvenementDocument = gererEvenementDocument;
function gererEvenementElement(id, type, gestionnaire) {
    var r = recupererElementHTML(id);
    r.addEventListener(type, gestionnaire);
}
exports.gererEvenementElement = gererEvenementElement;
function elementSaisieEnvoi(idSaisie, idBoutonEnvoi, msg) {
    return '<input type="text" id="' + idSaisie + '">'
        + '<input class="button" type="button" id="' + idBoutonEnvoi + '" value="' + msg + '" >';
}
exports.elementSaisieEnvoi = elementSaisieEnvoi;


/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(53);
var vueClient_1 = __webpack_require__(220);
var client_1 = __webpack_require__(213);
var jeu1_adressageRoutage_1 = __webpack_require__(249);
console.log("* Chargement du script");
var adresseServeur = jeu1_adressageRoutage_1.hote + ":" + jeu1_adressageRoutage_1.port2;
// A initialiser
var canal;
var noeud;
var population;
var utilisateur;
function envoyerMessage(texte, destinataire) {
    /*
    let msg: MessageJeu1 = creerMessageCommunication(noeud.centre().enJSON().id, destinataire, texte);
    console.log("- Envoi du message brut : " + msg.brut());
    console.log("- Envoi du message net : " + representerMessage(msg));
    canal.envoyerMessage(msg);
    */
}
// A exécuter après chargement de la page
// - pas d'interruption de la fonction
function initialisation() {
    console.log("* Initialisation après chargement du DOM");
    console.log("- du canal de communication avec le serveur d'adresse " + adresseServeur);
    canal = client_1.creerCanalClient(adresseServeur);
    console.log("- du traitement des messages");
    canal.enregistrerTraitementMessageRecu(function (m) {
        /*let msg = new MessageTchat(m);
        console.log("* Réception");
        console.log("- du message brut : " + msg.brut());
        console.log("- du message net : " + representerMessage(msg));
        posterNL('logChats', representerMessage(msg));
        */
    });
    console.log("- du traitement de la configuration");
    canal.enregistrerTraitementConfigurationRecue(function (c) {
        var config = jeu1_adressageRoutage_1.creerConfigurationJeu1(c);
        console.log("* Réception");
        console.log("- de la configuration brute : " + config.brut());
        console.log("- de la configuration nette : " + config.representation());
        console.log("* Initialisation du noeud du réseau");
        var decConfig = jeu1_adressageRoutage_1.decomposerConfiguration(config);
        noeud = jeu1_adressageRoutage_1.creerNoeudJeu1EX(decConfig[0]);
        population = jeu1_adressageRoutage_1.creerPopulationLocale(decConfig[1]);
        utilisateur = jeu1_adressageRoutage_1.creerUtilisateur(decConfig[2]);
        voir();
    });
    console.log("- du traitement d'une erreur rédhibitoire");
    canal.enregistrerTraitementErreurRecue(function (err) {
        var erreur = jeu1_adressageRoutage_1.creerErreurJeu1(err);
        console.log("* Réception");
        console.log("- de l'erreur rédhibitoire brute : " + erreur.brut());
        console.log("- de l'erreur rédhibitoire nette : " + erreur.representation());
        console.log("* Initialisation du document");
        vueClient_1.initialiserDocument(erreur.representation());
    });
}
function voir() {
    console.log("* Consolidation de la vue");
    console.log("- adresse, domaine, domaines voisins, utilisateur, autres utilisateurs du domaine");
    vueClient_1.poster("adresseServeur", adresseServeur);
    vueClient_1.poster("centre", jeu1_adressageRoutage_1.creerSommetJeu1(noeud.ex().centre).representation());
    vueClient_1.poster("voisins", types_1.creerTableImmutable(noeud.ex().voisins).representation());
    vueClient_1.poster("utilisateur", utilisateur.representation());
    vueClient_1.poster("utilisateursDomaine", population.representation());
    /*
    console.log("- formulaire");
    let voisinsNoeud = noeud.voisins();
    let contenuFormulaire = "";
    for (let idV in voisinsNoeud) {
        poster("formulaire", elementSaisieEnvoi("message_" + idV, "boutonEnvoi_" + idV,
            "Envoyer un message à " + representerSommet(voisinsNoeud[idV]) + "."));
    }
    let type = "click";
    for (const idV in voisinsNoeud) {
        console.log("- Element " + idV + " : enregistrement d'un gestionnaire pour l'événement " + type);
        gererEvenementElement("boutonEnvoi_" + idV, type, e => {
            let entree = recupererEntree("message_" + idV);
            initialiserEntree("message_" + idV, "");
            console.log("* Entree : " + entree);
            envoyerMessage(entree, ID(idV));
        });
    }
    */
    /*
      <input type="text" id="message_id1">
      <input class="button" type="button" id="boutonEnvoi_id1" value="Envoyer un message à {{nom id1}}."
         onClick="envoyerMessage(this.form.message.value, "id1")">
    */
}
// Gestion des événements pour le document
console.log("* Enregistrement de l'initialisation au chargement");
vueClient_1.gererEvenementDocument('DOMContentLoaded', initialisation);
/*
<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', initialisation());
</script>

*/


/***/ }),

/***/ 249:
/***/ (function(module, exports, __webpack_require__) {

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
var communication_1 = __webpack_require__(214);
var types_1 = __webpack_require__(53);
var outils_1 = __webpack_require__(89);
exports.hote = "merite"; // hôte local via TCP/IP - DNS : cf. /etc/hosts - IP : 127.0.0.1
exports.port1 = 3001; // port de la essource 1 (serveur d'applications)
exports.port2 = 1111; // port de la ressouce 2 (serveur de connexions)
// Iditenfiants indéfinis utilisés dans des messages définis partiellement
exports.sommetInconnu = { val: "INCONNU", sorte: 'sommet' };
exports.messageInconnu = { val: "INCONNU", sorte: 'message' };
var SommetJeu1 = (function (_super) {
    __extends(SommetJeu1, _super);
    function SommetJeu1(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    SommetJeu1.prototype.net = function (e) {
        var s = this.ex();
        switch (e) {
            case 'domaine': return s.domaine.representation();
            case 'ID': return s.ID.val;
        }
        return outils_1.jamais(e);
    };
    SommetJeu1.prototype.representation = function () {
        return this.net('domaine') + " (" + this.net('ID') + ")";
    };
    return SommetJeu1;
}(communication_1.Sommet));
exports.SommetJeu1 = SommetJeu1;
function creerSommetJeu1(s) {
    return new SommetJeu1(s);
}
exports.creerSommetJeu1 = creerSommetJeu1;
var NoeudJeu1IN = (function (_super) {
    __extends(NoeudJeu1IN, _super);
    function NoeudJeu1IN() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoeudJeu1IN.prototype.net = function (e) {
        var s = this.ex();
        switch (e) {
            case 'centre': return creerSommetJeu1(s.centre).representation();
            case 'voisins': return types_1.creerTableImmutable(s.voisins).representation();
        }
        return outils_1.jamais(e);
    };
    NoeudJeu1IN.prototype.representation = function () {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    };
    return NoeudJeu1IN;
}(communication_1.NoeudIN));
exports.NoeudJeu1IN = NoeudJeu1IN;
function creerNoeudJeu1IN(n) {
    return new NoeudJeu1IN(n);
}
exports.creerNoeudJeu1IN = creerNoeudJeu1IN;
var NoeudJeu1EX = (function (_super) {
    __extends(NoeudJeu1EX, _super);
    function NoeudJeu1EX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoeudJeu1EX.prototype.net = function (e) {
        var s = this.ex();
        switch (e) {
            case 'centre': return creerSommetJeu1(s.centre).representation();
            case 'voisins': return types_1.creerTableImmutable(s.voisins).representation();
        }
        return outils_1.jamais(e);
    };
    NoeudJeu1EX.prototype.representation = function () {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    };
    return NoeudJeu1EX;
}(communication_1.NoeudEX));
exports.NoeudJeu1EX = NoeudJeu1EX;
function creerNoeudJeu1EX(n) {
    return new NoeudJeu1EX(n);
}
exports.creerNoeudJeu1EX = creerNoeudJeu1EX;
/*
Protocole
Client | Serveur
1. Produire un message INIT | .
2. Transmettre un message INIT pour TRANSIT | Identifier le message en TRANSIT.
3. Transmettre un message TRANSIT pour TRANSIT | Accuser réception en TRANSIT (SUCCES ou ECHEC).
4. Ignorer un message en TRANSIT (IGNOR) | .
5. Consulter un message en TRANSIT (FIN) | Accuser réception du message FIN (SUCCES ou ECHEC).
*/
var AR;
(function (AR) {
    AR[AR["SUCCES"] = 0] = "SUCCES";
    AR[AR["ECHEC"] = 1] = "ECHEC";
})(AR = exports.AR || (exports.AR = {}));
var TypeMessageJeu1;
(function (TypeMessageJeu1) {
    TypeMessageJeu1[TypeMessageJeu1["INIT"] = 0] = "INIT";
    TypeMessageJeu1[TypeMessageJeu1["TRANSIT"] = 1] = "TRANSIT";
    TypeMessageJeu1[TypeMessageJeu1["IGNOR"] = 2] = "IGNOR";
    TypeMessageJeu1[TypeMessageJeu1["FIN"] = 3] = "FIN";
    TypeMessageJeu1[TypeMessageJeu1["SUCCES_TRANSIT"] = 4] = "SUCCES_TRANSIT";
    TypeMessageJeu1[TypeMessageJeu1["ECHEC_TRANSIT"] = 5] = "ECHEC_TRANSIT";
    TypeMessageJeu1[TypeMessageJeu1["SUCCES_FIN"] = 6] = "SUCCES_FIN";
    TypeMessageJeu1[TypeMessageJeu1["ECHEC_FIN"] = 7] = "ECHEC_FIN";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_CONNEXION"] = 8] = "ERREUR_CONNEXION";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_EMET"] = 9] = "ERREUR_EMET";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_DEST"] = 10] = "ERREUR_DEST";
    TypeMessageJeu1[TypeMessageJeu1["ERREUR_TYPE"] = 11] = "ERREUR_TYPE";
    TypeMessageJeu1[TypeMessageJeu1["INTERDICTION"] = 12] = "INTERDICTION";
})(TypeMessageJeu1 = exports.TypeMessageJeu1 || (exports.TypeMessageJeu1 = {}));
// Structure immutable
var MessageJeu1 = (function (_super) {
    __extends(MessageJeu1, _super);
    function MessageJeu1(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    MessageJeu1.prototype.net = function (e) {
        var msg = this.ex();
        switch (e) {
            case 'ID': return msg.ID.val;
            case 'type': return TypeMessageJeu1[msg.type];
            case 'date': return types_1.creerDate(msg.date).representation();
            case 'ID_de': return msg.ID_origine.val;
            case 'ID_à': return msg.ID_destination.val;
            case 'contenu': return msg.contenu.representation();
        }
        return outils_1.jamais(e);
    };
    MessageJeu1.prototype.representation = function () {
        var idm = this.net('ID');
        var dem = this.net('ID_de');
        var am = this.net('ID_à');
        var typem = this.net('type');
        var datem = this.net('date');
        var cm = this.net('contenu');
        return idm + " - " + datem + ", de " + dem + " à " + am + " (" + typem + ") - " + cm;
    };
    // 2. Client : Transmettre un message INIT pour TRANSIT.
    // 3. Client : Transmettre un message TRANSIT pour TRANSIT.
    MessageJeu1.prototype.avecAdresses = function (ID_origine, ID_destination) {
        var msg = this.ex();
        return new MessageJeu1({
            "ID": msg.ID,
            "ID_origine": { val: ID_origine, sorte: 'sommet' },
            "ID_destination": { val: ID_destination, sorte: 'sommet' },
            "type": msg.type,
            "contenu": msg.contenu,
            "date": msg.date
        });
    };
    // 2. Serveur : Identifier le message en TRANSIT.
    MessageJeu1.prototype.enTransit = function () {
        var msg = this.ex();
        return new MessageJeu1({
            "ID": msg.ID,
            "ID_origine": msg.ID_origine,
            "ID_destination": msg.ID_destination,
            "type": TypeMessageJeu1.TRANSIT,
            "contenu": msg.contenu,
            "date": msg.date
        });
    };
    // 3. Serveur : Accuser réception en TRANSIT (SUCCES ou ECHEC).
    MessageJeu1.prototype.transitAvecAccuseReception = function (statut) {
        var msg = this.ex();
        var type;
        switch (statut) {
            case AR.SUCCES:
                type = TypeMessageJeu1.SUCCES_TRANSIT;
                break;
            case AR.ECHEC:
                type = TypeMessageJeu1.ECHEC_TRANSIT;
                break;
            default: return outils_1.jamais(statut);
        }
        return new MessageJeu1({
            "ID": msg.ID,
            "ID_origine": msg.ID_origine,
            "ID_destination": msg.ID_destination,
            "type": type,
            "contenu": msg.contenu,
            "date": msg.date
        });
    };
    // 4. Client : Ignorer un message en TRANSIT (IGNOR).
    MessageJeu1.prototype.aIgnorer = function () {
        var msg = this.ex();
        return new MessageJeu1({
            "ID": msg.ID,
            "ID_origine": msg.ID_origine,
            "ID_destination": msg.ID_destination,
            "type": TypeMessageJeu1.IGNOR,
            "contenu": msg.contenu,
            "date": msg.date
        });
    };
    // 5. Client : Consulter un message en TRANSIT (FIN).
    MessageJeu1.prototype.aConsulter = function () {
        var msg = this.ex();
        return new MessageJeu1({
            "ID": msg.ID,
            "ID_origine": msg.ID_origine,
            "ID_destination": msg.ID_destination,
            "type": TypeMessageJeu1.FIN,
            "contenu": msg.contenu,
            "date": msg.date
        });
    };
    // 5. Serveur : Accuser réception en FIN (SUCCES ou ECHEC).
    MessageJeu1.prototype.aConsulterAvecAccuseReception = function (statut) {
        var msg = this.ex();
        var type;
        switch (statut) {
            case AR.SUCCES:
                type = TypeMessageJeu1.SUCCES_FIN;
                break;
            case AR.ECHEC:
                type = TypeMessageJeu1.ECHEC_FIN;
                break;
            default: return outils_1.jamais(statut);
        }
        return new MessageJeu1({
            "ID": msg.ID,
            "ID_origine": msg.ID_origine,
            "ID_destination": msg.ID_destination,
            "type": type,
            "contenu": msg.contenu,
            "date": msg.date
        });
    };
    return MessageJeu1;
}(communication_1.Message));
exports.MessageJeu1 = MessageJeu1;
// 1. Client : Produire un message INIT.
function creerMessageInitial(contenu) {
    return new MessageJeu1({
        "ID": exports.messageInconnu,
        "ID_origine": exports.sommetInconnu,
        "ID_destination": exports.sommetInconnu,
        "type": TypeMessageJeu1.INIT,
        "contenu": contenu,
        "date": types_1.creerDateMaintenant().ex()
    });
}
exports.creerMessageInitial = creerMessageInitial;
var Utilisateur = (function (_super) {
    __extends(Utilisateur, _super);
    function Utilisateur(u) {
        return _super.call(this, function (x) { return x; }, u) || this;
    }
    Utilisateur.prototype.net = function (e) {
        var u = this.ex();
        switch (e) {
            case 'ID': return u.ID.val;
            case 'nom': return u.pseudo.representation();
        }
        return outils_1.jamais(e);
    };
    Utilisateur.prototype.representation = function () {
        return this.net('nom') + " (" + this.net('ID') + ")";
    };
    return Utilisateur;
}(types_1.Enveloppe));
exports.Utilisateur = Utilisateur;
function creerUtilisateur(u) {
    return new Utilisateur(u);
}
exports.creerUtilisateur = creerUtilisateur;
// inutile export type EtiquettePopulationLocale = 'effectif' | 'utilisateurs';
var PopulationLocale = (function (_super) {
    __extends(PopulationLocale, _super);
    function PopulationLocale(pop) {
        return _super.call(this, 'utilisateur', function (x) { return x; }, pop) || this;
    }
    PopulationLocale.prototype.pourChaque = function (f) {
        this.pourChaque(f);
    };
    return PopulationLocale;
}(types_1.TableIdentification));
exports.PopulationLocale = PopulationLocale;
function creerPopulationLocaleVide() {
    return new PopulationLocale({ table: {} });
}
exports.creerPopulationLocaleVide = creerPopulationLocaleVide;
function creerPopulationLocale(pop) {
    return new PopulationLocale(pop);
}
exports.creerPopulationLocale = creerPopulationLocale;
function peuplerPopulationLocale(prefixe, noms) {
    var identification = types_1.creerIdentificationParCompteur(prefixe);
    var pop = creerPopulationLocaleVide();
    noms.forEach(function (nom, i, tab) {
        var u = { ID: identification.identifier('utilisateur'), pseudo: tab[i] };
        pop.ajouter(u.ID, u);
    });
    return pop;
}
exports.peuplerPopulationLocale = peuplerPopulationLocale;
var ConfigurationJeu1 = (function (_super) {
    __extends(ConfigurationJeu1, _super);
    function ConfigurationJeu1(c) {
        return _super.call(this, function (x) { return x; }, c) || this;
    }
    ConfigurationJeu1.prototype.net = function (e) {
        var config = this.ex();
        switch (e) {
            case 'centre': return creerSommetJeu1(config.centre).representation();
            case 'population':
                return types_1.creerTableImmutable(config.population).representation();
            case 'utilisateur': return creerUtilisateur(config.utilisateur).representation();
            case 'voisins': return types_1.creerTableImmutable(config.voisins).representation();
            case 'date': return types_1.creerDate(config.date).representation();
        }
        return outils_1.jamais(e);
    };
    ConfigurationJeu1.prototype.representation = function () {
        var c = this.net('centre');
        var pop = this.net('population');
        var util = this.net('utilisateur');
        var v = this.net('voisins');
        var d = this.net('date');
        return "(centre : " + c
            + " ; population : " + pop
            + " ; utilisateur : " + util
            + " ; voisins : " + v
            + " ; crée le : " + d + ")";
    };
    return ConfigurationJeu1;
}(communication_1.Configuration));
exports.ConfigurationJeu1 = ConfigurationJeu1;
function creerConfigurationJeu1(c) {
    return new ConfigurationJeu1(c);
}
exports.creerConfigurationJeu1 = creerConfigurationJeu1;
function composerConfigurationJeu1(n, pop, u, date) {
    return new ConfigurationJeu1({
        "configurationInitiale": types_1.Unite.ZERO,
        "centre": n.centre,
        "population": pop,
        "utilisateur": u,
        "voisins": n.voisins,
        "date": date
    });
}
exports.composerConfigurationJeu1 = composerConfigurationJeu1;
function decomposerConfiguration(c) {
    var config = c.ex();
    var centre = config.centre;
    var voisins = config.voisins;
    var n = { "centre": centre, "voisins": voisins };
    var pop = config.population;
    var u = config.utilisateur;
    return [n, pop, u];
}
exports.decomposerConfiguration = decomposerConfiguration;
var ErreurJeu1 = (function (_super) {
    __extends(ErreurJeu1, _super);
    function ErreurJeu1(err) {
        return _super.call(this, function (x) { return x; }, err) || this;
    }
    ErreurJeu1.prototype.net = function (e) {
        var erreur = this.ex();
        switch (e) {
            case 'messageErreur': return erreur.messageErreur;
            case 'date': return types_1.creerDate(erreur.date).representation();
        }
        return outils_1.jamais(e);
    };
    ErreurJeu1.prototype.representation = function () {
        return "[" + this.net('date') + " : " + this.net('messageErreur') + "]";
    };
    return ErreurJeu1;
}(communication_1.ErreurRedhibitoire));
exports.ErreurJeu1 = ErreurJeu1;
function creerErreurJeu1(err) {
    return new ErreurJeu1(err);
}
exports.creerErreurJeu1 = creerErreurJeu1;
function composerErreurJeu1(msg, date) {
    return new ErreurJeu1({
        "erreurRedhibitoire": types_1.Unite.ZERO,
        "messageErreur": msg,
        "date": date
    });
}
exports.composerErreurJeu1 = composerErreurJeu1;
function creerAnneauJeu1(domaines) {
    var assembleur = communication_1.creerAssemblageReseauEnAnneau(domaines.length, creerNoeudJeu1IN);
    var identification = types_1.creerIdentificationParCompteur("DOM-");
    domaines.forEach(function (dom, i, tab) {
        var s = { ID: identification.identifier('sommet'), domaine: tab[i] };
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}
exports.creerAnneauJeu1 = creerAnneauJeu1;
var TableUtilisateurs = (function (_super) {
    __extends(TableUtilisateurs, _super);
    function TableUtilisateurs() {
        return _super.call(this, 'utilisateur', function (x) { return x; }) || this;
    }
    return TableUtilisateurs;
}(types_1.TableIdentification));
var PopulationParDomaine = (function (_super) {
    __extends(PopulationParDomaine, _super);
    function PopulationParDomaine() {
        return _super.call(this, 'sommet', function (t) { return t.ex(); }) || this;
    }
    PopulationParDomaine.prototype.contientUtilisateur = function (ID_dom, ID_util) {
        if (!this.contient(ID_dom)) {
            return false;
        }
        return this.valeurIN(ID_dom).contient(ID_util);
    };
    PopulationParDomaine.prototype.utilisateur = function (ID_dom, ID_util) {
        return this.valeurIN(ID_dom).valeur(ID_util);
    };
    PopulationParDomaine.prototype.ajouterDomaine = function (ID_dom) {
        this.ajouter(ID_dom, new TableUtilisateurs());
    };
    PopulationParDomaine.prototype.ajouterUtilisateur = function (ID_dom, u) {
        this.valeurIN(ID_dom).ajouter(u.ID, u);
    };
    PopulationParDomaine.prototype.retirerUtilisateur = function (ID_dom, ID_util) {
        this.valeurIN(ID_dom).retirer(ID_util);
    };
    PopulationParDomaine.prototype.selectionnerUtilisateur = function () {
        var ID_dom = this.selectionCleSuivantCritereIn(function (pop) { return !pop.estVide(); });
        var ID_util = this.valeurIN(ID_dom).selectionCle();
        return [ID_dom, ID_util];
    };
    return PopulationParDomaine;
}(types_1.TableIdentification));
exports.PopulationParDomaine = PopulationParDomaine;
function creerVidePopulationParDomaine() {
    return new PopulationParDomaine();
}
exports.creerVidePopulationParDomaine = creerVidePopulationParDomaine;
function assemblerPopulationParDomaine(reseau, noms) {
    var popDom = creerVidePopulationParDomaine();
    reseau.pourChaqueNoeud(function (ID_dom, n) {
        popDom.ajouterDomaine(ID_dom);
        var popLoc = peuplerPopulationLocale("UTIL-" + ID_dom.val + "-", noms);
        popLoc.pourChaque(function (ID_util, u) {
            popDom.ajouterUtilisateur(ID_dom, u);
        });
    });
    return popDom;
}
exports.assemblerPopulationParDomaine = assemblerPopulationParDomaine;


/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

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
// Revue 02/08 - Testé.
var outils_1 = __webpack_require__(89);
// Les enum sont des sous-types de number.
var Unite;
(function (Unite) {
    Unite[Unite["ZERO"] = 0] = "ZERO";
})(Unite = exports.Unite || (exports.Unite = {}));
var Deux;
(function (Deux) {
    Deux[Deux["ZERO"] = 0] = "ZERO";
    Deux[Deux["UN"] = 1] = "UN";
})(Deux = exports.Deux || (exports.Deux = {}));
// Types formats JSON : FormatX par convention
// Il est recommandé de choisir le plus possible des formats immutables.
// Format ::= { (readonly etiquette : Format)*} 
//          | { (readonly etiquette : Format)*, (etiquette : Format)+, mutable : Unite} 
//          | { readonly table: { readonly [cle: string]: T }}
//          | { readonly table: { [cle: string]: T }}
//          | { table: { readonly [cle: string]: T }, mutable : Unite}
//          | { table: { [cle: string]: T }, mutable : Unite}
// Modèle générique d'une enveloppe d'un état
// TEX : type de sortie immutable (souvent format JSON en lecture seulement)
// TIN : type d'entrée pour l'état en format JSON ou non (mutable ou non, confiné si mutable)
// E : étiquettes utiles pour une représentation (cf. méthode net)
// La différence entre TIN et TEX permet de gérer les effets de bord sur l'état, souvent au format JSON.
// Une fonction de conversion de TIN vers TEX est requise.
// Toute méthode ayant une occurrence positive de TIN est protected. En effet, elle est susceptible
//   de permettre un effet de bord sur l'état s'il est mutable.
// Cette classe abstraite doit être étedue ;
// - implémentation de net et représenter,
// - extension par de méthodes modifiant ou observant l'état.
var Enveloppe = (function () {
    function Enveloppe(inEnEx, etat) {
        this.etat = etat;
        this.inEnEx = inEnEx;
    }
    Enveloppe.prototype.in = function () {
        return this.etat;
    };
    Enveloppe.prototype.ex = function () {
        return this.inEnEx(this.etat);
    };
    // transformation brute du json de type TIN en string
    Enveloppe.prototype.brut = function () {
        return JSON.stringify(this.etat);
    };
    ;
    return Enveloppe;
}());
exports.Enveloppe = Enveloppe;
/* ***********************************************************************************************
*
*/
var Semaine;
(function (Semaine) {
    Semaine[Semaine["LUNDI"] = 0] = "LUNDI";
    Semaine[Semaine["MARDI"] = 1] = "MARDI";
    Semaine[Semaine["MERCREDI"] = 2] = "MERCREDI";
    Semaine[Semaine["JEUDI"] = 3] = "JEUDI";
    Semaine[Semaine["VENDREDI"] = 4] = "VENDREDI";
    Semaine[Semaine["SAMEDI"] = 5] = "SAMEDI";
    Semaine[Semaine["DIMANCHE"] = 6] = "DIMANCHE";
})(Semaine = exports.Semaine || (exports.Semaine = {}));
var Mois;
(function (Mois) {
    Mois[Mois["JANVIER"] = 0] = "JANVIER";
    Mois[Mois["FEVRIER"] = 1] = "FEVRIER";
    Mois[Mois["MARS"] = 2] = "MARS";
    Mois[Mois["AVRIL"] = 3] = "AVRIL";
    Mois[Mois["MAI"] = 4] = "MAI";
    Mois[Mois["JUIN"] = 5] = "JUIN";
    Mois[Mois["JUILLET"] = 6] = "JUILLET";
    Mois[Mois["AOUT"] = 7] = "AOUT";
    Mois[Mois["SEPTEMBRE"] = 8] = "SEPTEMBRE";
    Mois[Mois["OCTOBRE"] = 9] = "OCTOBRE";
    Mois[Mois["NOVEMBRE"] = 10] = "NOVEMBRE";
    Mois[Mois["DECEMBRE"] = 11] = "DECEMBRE";
})(Mois = exports.Mois || (exports.Mois = {}));
function conversionDate(d) {
    return {
        seconde: d.getSeconds(),
        minute: d.getMinutes(),
        heure: d.getHours(),
        jourSemaine: (d.getDay() + 6) % 7,
        jourMois: d.getDate(),
        mois: d.getMonth(),
        annee: d.getFullYear()
    };
}
exports.conversionDate = conversionDate;
var DateFrEnveloppe = (function (_super) {
    __extends(DateFrEnveloppe, _super);
    function DateFrEnveloppe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateFrEnveloppe.prototype.net = function (e) {
        // A déplacer sous les cas.
        var s = outils_1.normalisationNombre(this.in().seconde, 2);
        var min = outils_1.normalisationNombre(this.in().minute, 2);
        var h = outils_1.normalisationNombre(this.in().heure, 2);
        var js = this.in().jourSemaine;
        var jsL = Semaine[js].toLowerCase();
        var jm = outils_1.normalisationNombre(this.in().jourMois, 2);
        var mo = this.in().mois;
        var moL = Mois[mo].toLowerCase();
        var moN = outils_1.normalisationNombre(mo + 1, 2);
        var a = this.in().annee.toString();
        switch (e) {
            case 'heure': return h + ":" + min + ":" + s;
            case 'jourSemaine': return jsL;
            case 'jourMois': return jm;
            case 'moisLettre': return moL;
            case 'moisNumero': return moN;
            case 'annee': return a;
            case 'date': return jm + "/" + moN + "/" + a;
            case 'dateLongue': return jsL + " " + jm + " " + moL + " " + a;
        }
        return outils_1.jamais(e);
    };
    DateFrEnveloppe.prototype.detail = function (e) {
        return this.detail(e);
    };
    DateFrEnveloppe.prototype.representation = function () {
        return this.net('heure') + ", le " + this.net('date');
    };
    DateFrEnveloppe.prototype.representationLongue = function () {
        return this.net('heure') + ", le " + this.net('dateLongue');
    };
    DateFrEnveloppe.prototype.representationLog = function () {
        return this.net('heure') + " " + this.net('date');
    };
    return DateFrEnveloppe;
}(Enveloppe));
exports.DateFrEnveloppe = DateFrEnveloppe;
function creerDateMaintenant() {
    return new DateFrEnveloppe(function (x) { return x; }, conversionDate(new Date()));
}
exports.creerDateMaintenant = creerDateMaintenant;
function creerDate(d) {
    return new DateFrEnveloppe(function (x) { return x; }, d);
}
exports.creerDate = creerDate;
var ModuleTableau = (function () {
    function ModuleTableau() {
    }
    ModuleTableau.prototype.pourChaque = function (f, t) {
        t.tableau.forEach(function (v, i, t) { return f(i, v, t); });
    };
    ModuleTableau.prototype.valeur = function (t, index) {
        return t.tableau[index];
    };
    ModuleTableau.prototype.taille = function (t) {
        return t.tableau.length;
    };
    ModuleTableau.prototype.foncteur = function (t, f) {
        var r = [];
        this.pourChaque(function (i, v) {
            r[i] = f(v);
        }, t);
        return { taille: r.length, tableau: r, mutable: Unite.ZERO };
    };
    ModuleTableau.prototype.reduction = function (t, neutre, op) {
        var r = neutre;
        this.pourChaque(function (i, v) {
            r = op(r, v);
        }, t);
        return r;
    };
    ModuleTableau.prototype.ajouterEnFin = function (t, x) {
        t.tableau.push(x);
    };
    ModuleTableau.prototype.retirerEnFin = function (t) {
        if (t.taille === 0) {
            throw new Error("[Exception : retirerEnFin() non défini.]");
        }
        return t.tableau.pop();
    };
    return ModuleTableau;
}());
exports.ModuleTableau = ModuleTableau;
var MODULE_TABLEAU = new ModuleTableau();
// Conversion pour les tables 
function conversionFormatTableau(conv) {
    return (function (t) {
        var r = new Array(t.taille);
        MODULE_TABLEAU.pourChaque(function (i, v) {
            r[i] = conv(v);
        }, t);
        return { taille: t.taille, tableau: r };
    });
}
exports.conversionFormatTableau = conversionFormatTableau;
// Tableau immutable : TIN = TEX (recommandé : immutable)
var TableauImmutable = (function (_super) {
    __extends(TableauImmutable, _super);
    function TableauImmutable(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    TableauImmutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'valeurs': return this.in().tableau.toString();
        }
        return outils_1.jamais(e);
    };
    TableauImmutable.prototype.representation = function () {
        return "[" + this.net('valeurs') + "]";
    };
    TableauImmutable.prototype.pourChaque = function (f) {
        MODULE_TABLEAU.pourChaque(f, this.in());
    };
    TableauImmutable.prototype.foncteur = function (f) {
        return new TableauImmutable(MODULE_TABLEAU.foncteur(this.in(), f));
    };
    TableauImmutable.prototype.reduction = function (neutre, op) {
        return MODULE_TABLEAU.reduction(this.in(), neutre, op);
    };
    TableauImmutable.prototype.valeur = function (index) {
        return MODULE_TABLEAU.valeur(this.in(), index);
    };
    TableauImmutable.prototype.taille = function () {
        return MODULE_TABLEAU.taille(this.in());
    };
    TableauImmutable.prototype.estVide = function () {
        return this.taille() === 0;
    };
    return TableauImmutable;
}(Enveloppe));
exports.TableauImmutable = TableauImmutable;
function creerTableauImmutable(t) {
    return new TableauImmutable({
        taille: t.length,
        tableau: t
    });
}
exports.creerTableauImmutable = creerTableauImmutable;
// Tableau mutable - TIN peut être différent de TEX.
//   Recommandé : TEX immutable.
// Attention : la méthode ex() requiert un parcours du tableau formant l'état.
var Tableau = (function (_super) {
    __extends(Tableau, _super);
    function Tableau(valInVersEx, etat) {
        if (etat === void 0) { etat = { taille: 0, tableau: [], mutable: Unite.ZERO }; }
        var _this = _super.call(this, conversionFormatTableau(valInVersEx), etat) || this;
        _this.valInVersEx = valInVersEx;
        return _this;
    }
    Tableau.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'valeurs': return this.in().tableau.toString();
        }
        return outils_1.jamais(e);
    };
    Tableau.prototype.representation = function () {
        return "[" + this.net('valeurs') + "]";
    };
    Tableau.prototype.pourChaqueIn = function (f) {
        MODULE_TABLEAU.pourChaque(f, this.in());
    };
    Tableau.prototype.pourChaque = function (f) {
        var _this = this;
        this.pourChaqueIn(function (i, v, t) { return f(i, _this.valInVersEx(v)); });
    };
    Tableau.prototype.valeurIn = function (i) {
        return MODULE_TABLEAU.valeur(this.in(), i);
    };
    Tableau.prototype.valeur = function (i) {
        return this.valInVersEx(this.valeurIn(i));
    };
    Tableau.prototype.taille = function () {
        return MODULE_TABLEAU.taille(this.in());
    };
    Tableau.prototype.estVide = function () {
        return this.taille() === 0;
    };
    Tableau.prototype.ajouterEnFin = function (x) {
        MODULE_TABLEAU.ajouterEnFin(this.in(), x);
    };
    Tableau.prototype.retirerEnFin = function () {
        MODULE_TABLEAU.retirerEnFin(this.in());
    };
    return Tableau;
}(Enveloppe));
exports.Tableau = Tableau;
function creerTableauVide(valInVersEx) {
    return new Tableau(valInVersEx);
}
exports.creerTableauVide = creerTableauVide;
// Un module réservoir de fonctions utiles sur les tables.
var ModuleTable = (function () {
    function ModuleTable() {
    }
    ModuleTable.prototype.pourChaque = function (f, t) {
        for (var c_1 in t.table) {
            f(c_1, t.table[c_1], t.table);
        }
    };
    ModuleTable.prototype.valeur = function (t, cle) {
        return t.table[cle];
    };
    ModuleTable.prototype.contient = function (t, cle) {
        if (t.table[cle]) {
            return true;
        }
        return false;
        ;
    };
    ModuleTable.prototype.image = function (t) {
        var tab = [];
        this.pourChaque(function (c, v) {
            tab.push(v);
        }, t);
        return tab;
    };
    ModuleTable.prototype.domaine = function (t) {
        var tab = [];
        this.pourChaque(function (c, v) {
            tab.push(c);
        }, t);
        return tab;
    };
    ModuleTable.prototype.taille = function (t) {
        var n = 0;
        this.pourChaque(function (c, v) {
            n++;
        }, t);
        return n;
    };
    ModuleTable.prototype.foncteur = function (t, f) {
        var r = {};
        this.pourChaque(function (c, v) {
            r[c] = f(v);
        }, t);
        return { table: r, mutable: Unite.ZERO };
    };
    ModuleTable.prototype.transformationTableVersTableau = function (t, f) {
        var r = [];
        this.pourChaque(function (c, v) {
            r.push(f(c, v));
        }, t);
        return r;
    };
    ModuleTable.prototype.selectionCle = function (t) {
        // sélection d'une clé
        for (var c_2 in t.table) {
            return c_2;
        }
        throw new Error("[Exception : selectionCle() non défini.]");
    };
    ModuleTable.prototype.selectionCleSuivantCritere = function (t, prop) {
        // sélection d'une clé
        for (var c_3 in t.table) {
            if (prop(t.table[c_3])) {
                return c_3;
            }
        }
        throw new Error("[Exception : selectionCleSuivantCritere() non défini.]");
    };
    ModuleTable.prototype.ajouter = function (t, cle, x) {
        t.table[cle] = x;
    };
    ModuleTable.prototype.retirer = function (t, cle) {
        delete t.table[cle];
    };
    return ModuleTable;
}());
exports.ModuleTable = ModuleTable;
var MODULE_TABLE = new ModuleTable();
// Conversion pour les tables 
function conversionFormatTable(conv) {
    return (function (t) {
        var r = {};
        MODULE_TABLE.pourChaque(function (c, v) {
            r[c] = conv(v);
        }, t);
        return { table: r };
    });
}
exports.conversionFormatTable = conversionFormatTable;
// Table immutable : TIN = TEX (recommandé : immutable)
var TableImmutable = (function (_super) {
    __extends(TableImmutable, _super);
    function TableImmutable(etat) {
        return _super.call(this, function (x) { return x; }, etat) || this;
    }
    TableImmutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().toString();
            case 'image': return this.image().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'graphe': return this.brut();
        }
        return outils_1.jamais(e);
    };
    TableImmutable.prototype.representation = function () {
        return this.net('graphe');
    };
    TableImmutable.prototype.pourChaque = function (f) {
        MODULE_TABLE.pourChaque(f, this.in());
    };
    TableImmutable.prototype.valeur = function (cle) {
        return MODULE_TABLE.valeur(this.in(), cle);
    };
    TableImmutable.prototype.contient = function (cle) {
        return MODULE_TABLE.contient(this.in(), cle);
    };
    TableImmutable.prototype.image = function () {
        return MODULE_TABLE.image(this.in());
    };
    TableImmutable.prototype.domaine = function () {
        return MODULE_TABLE.domaine(this.in());
    };
    TableImmutable.prototype.taille = function () {
        return MODULE_TABLE.taille(this.in());
    };
    TableImmutable.prototype.selectionCle = function () {
        return MODULE_TABLE.selectionCle(this.in());
    };
    TableImmutable.prototype.selectionCleSuivantCritere = function (prop) {
        return MODULE_TABLE.selectionCleSuivantCritere(this.in(), prop);
    };
    TableImmutable.prototype.application = function (f) {
        return new TableImmutable(MODULE_TABLE.foncteur(this.in(), f));
    };
    return TableImmutable;
}(Enveloppe));
exports.TableImmutable = TableImmutable;
function creerTableImmutable(t) {
    return new TableImmutable(t);
}
exports.creerTableImmutable = creerTableImmutable;
// Table mutable - TIN peut être différent de TEX.
//   Recommandé : TEX immutable.
// Attention : la méthode ex() requiert un parcours de la table formant l'état.
var Table = (function (_super) {
    __extends(Table, _super);
    function Table(valInVersEx, etat) {
        var _this = _super.call(this, conversionFormatTable(valInVersEx), etat) || this;
        _this.valInVersEx = valInVersEx;
        return _this;
    }
    Table.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().toString();
            case 'image': return this.image().map(function (v, i) { return JSON.stringify(v); }).toString();
            case 'graphe': return this.brut();
        }
        return outils_1.jamais(e);
    };
    Table.prototype.representation = function () {
        return this.net('graphe');
    };
    Table.prototype.pourChaqueIn = function (f) {
        MODULE_TABLE.pourChaque(f, this.in());
    };
    Table.prototype.pourChaque = function (f) {
        var _this = this;
        this.pourChaqueIn(function (c, v, t) { return f(c, _this.valInVersEx(v)); });
        // moins efficace (deux parcours) : MODULE_TABLE.pourChaque(f, this.ex());
    };
    Table.prototype.valeurIn = function (cle) {
        return MODULE_TABLE.valeur(this.in(), cle);
    };
    Table.prototype.valeur = function (cle) {
        return this.valInVersEx(this.valeurIn(cle));
        // moins efficace : MODULE_TABLE.valeur(this.ex(), cle);
    };
    Table.prototype.contient = function (cle) {
        return MODULE_TABLE.contient(this.in(), cle);
    };
    Table.prototype.imageIn = function () {
        return MODULE_TABLE.image(this.in());
    };
    Table.prototype.image = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.in(), function (c, v) { return _this.valInVersEx(v); });
        // moins efficace : MODULE_TABLE.image(this.ex());
    };
    Table.prototype.domaine = function () {
        return MODULE_TABLE.domaine(this.in());
    };
    Table.prototype.taille = function () {
        return MODULE_TABLE.taille(this.in());
    };
    Table.prototype.estVide = function () {
        return this.taille() === 0;
    };
    Table.prototype.selectionCle = function () {
        return MODULE_TABLE.selectionCle(this.in());
    };
    Table.prototype.selectionCleSuivantCritereIn = function (prop) {
        return MODULE_TABLE.selectionCleSuivantCritere(this.in(), prop);
    };
    Table.prototype.selectionCleSuivantCritere = function (prop) {
        var _this = this;
        return this.selectionCleSuivantCritereIn(function (x) { return prop(_this.valInVersEx(x)); });
        // moins efficace : MODULE_TABLE.selectionCleSuivantCritere(this.ex(), prop);
    };
    Table.prototype.ajouter = function (cle, x) {
        MODULE_TABLE.ajouter(this.in(), cle, x);
    };
    Table.prototype.retirer = function (cle) {
        MODULE_TABLE.retirer(this.in(), cle);
    };
    return Table;
}(Enveloppe));
exports.Table = Table;
function creerTableVide(valInVersEx) {
    return new Table(valInVersEx, { table: {}, mutable: Unite.ZERO });
}
exports.creerTableVide = creerTableVide;
var IdentificationParCompteur = (function () {
    function IdentificationParCompteur(prefixe) {
        this.prefixe = prefixe;
        this.compteur = 0;
    }
    IdentificationParCompteur.prototype.identifier = function (s) {
        var id = this.prefixe + this.compteur;
        this.compteur++;
        return creerIdentifiant(s, id);
    };
    return IdentificationParCompteur;
}());
exports.IdentificationParCompteur = IdentificationParCompteur;
function creerIdentificationParCompteur(prefixe) {
    return new IdentificationParCompteur(prefixe);
}
exports.creerIdentificationParCompteur = creerIdentificationParCompteur;
function creerIdentifiant(s, cle) {
    return {
        val: cle,
        sorte: s
    };
}
exports.creerIdentifiant = creerIdentifiant;
/*
* Table utilisant des identificateurs comme clé.
* Remarque : les tables précédentes fondées sur les tables en JSON utilisent nécessdairement le type string pour les clés.
*/
var TableIdentification = (function (_super) {
    __extends(TableIdentification, _super);
    function TableIdentification(sorte, valInVersEx, pop) {
        if (pop === void 0) { pop = { table: {} }; }
        var _this = _super.call(this, conversionFormatTable(valInVersEx), { table: pop.table, mutable: Unite.ZERO }) || this;
        _this.sorte = sorte;
        _this.valInVersEx = valInVersEx;
        return _this;
    }
    TableIdentification.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'image': return this.image().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'graphe': return JSON.stringify(this.ex().table);
        }
        return outils_1.jamais(e);
    };
    TableIdentification.prototype.representation = function () {
        return this.net('graphe');
    };
    TableIdentification.prototype.pourChaqueIn = function (f) {
        var _this = this;
        MODULE_TABLE.pourChaque(function (id, v, t) { return f(creerIdentifiant(_this.sorte, id), v, t); }, this.in());
    };
    TableIdentification.prototype.pourChaque = function (f) {
        var _this = this;
        this.pourChaqueIn(function (c, v, t) { return f(c, _this.valInVersEx(v)); });
        // moins efficace (deux parcours) : MODULE_TABLE.pourChaque(f, this.ex());
    };
    TableIdentification.prototype.valeurIN = function (ID_sorte) {
        return MODULE_TABLE.valeur(this.in(), ID_sorte.val);
    };
    TableIdentification.prototype.valeur = function (ID_sorte) {
        return this.valInVersEx(this.valeurIN(ID_sorte));
    };
    TableIdentification.prototype.contient = function (ID_sorte) {
        return MODULE_TABLE.contient(this.in(), ID_sorte.val);
    };
    TableIdentification.prototype.imageIn = function () {
        return MODULE_TABLE.image(this.in());
    };
    TableIdentification.prototype.image = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.in(), function (c, v) { return _this.valInVersEx(v); });
        // moins efficace : MODULE_TABLE.image(this.ex());
    };
    TableIdentification.prototype.domaine = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.in(), function (c, v) { return creerIdentifiant(_this.sorte, c); });
        // moins efficace : return MODULE_TABLE.domaine(this.in()).
        //    map((s) => { return { val: s, sorte: this.sorte } });
    };
    TableIdentification.prototype.selectionCle = function () {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCle(this.in()));
    };
    TableIdentification.prototype.selectionCleSuivantCritereIn = function (prop) {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.in(), prop));
    };
    TableIdentification.prototype.selectionCleSuivantCritere = function (prop) {
        var _this = this;
        return this.selectionCleSuivantCritereIn(function (x) { return prop(_this.valInVersEx(x)); });
        // moins efficace : MODULE_TABLE.selectionCleSuivantCritere(this.ex(), prop);
    };
    TableIdentification.prototype.taille = function () {
        return MODULE_TABLE.taille(this.in());
    };
    TableIdentification.prototype.estVide = function () {
        return this.taille() === 0;
    };
    TableIdentification.prototype.ajouter = function (ID_sorte, x) {
        MODULE_TABLE.ajouter(this.in(), ID_sorte.val, x);
    };
    TableIdentification.prototype.retirer = function (ID_sorte) {
        MODULE_TABLE.retirer(this.in(), ID_sorte.val);
    };
    return TableIdentification;
}(Enveloppe));
exports.TableIdentification = TableIdentification;
function creerTableIdentificationVide(sorte, valInVersEx) {
    return new TableIdentification(sorte, valInVersEx);
}
exports.creerTableIdentificationVide = creerTableIdentificationVide;
function creerTableIdentification(sorte, valInVersEx, pop) {
    return new TableIdentification(sorte, valInVersEx, pop);
}
exports.creerTableIdentification = creerTableIdentification;
// Version immutable
var TableIdentificationImmutable = (function (_super) {
    __extends(TableIdentificationImmutable, _super);
    function TableIdentificationImmutable(sorte, pop) {
        if (pop === void 0) { pop = { table: {} }; }
        var _this = _super.call(this, conversionFormatTable(function (x) { return x; }), pop) || this;
        _this.sorte = sorte;
        return _this;
    }
    TableIdentificationImmutable.prototype.net = function (e) {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'image': return this.image().map(function (v, i, t) { return JSON.stringify(v); }).toString();
            case 'graphe': return JSON.stringify(this.ex().table);
        }
        return outils_1.jamais(e);
    };
    TableIdentificationImmutable.prototype.representation = function () {
        return this.net('graphe');
    };
    TableIdentificationImmutable.prototype.pourChaque = function (f) {
        var _this = this;
        MODULE_TABLE.pourChaque(function (id, v, t) { return f(creerIdentifiant(_this.sorte, id), v, t); }, this.in());
    };
    TableIdentificationImmutable.prototype.valeur = function (ID_sorte) {
        return MODULE_TABLE.valeur(this.in(), ID_sorte.val);
    };
    TableIdentificationImmutable.prototype.contient = function (ID_sorte) {
        return MODULE_TABLE.contient(this.in(), ID_sorte.val);
    };
    TableIdentificationImmutable.prototype.image = function () {
        return MODULE_TABLE.image(this.in());
    };
    TableIdentificationImmutable.prototype.domaine = function () {
        var _this = this;
        return MODULE_TABLE.transformationTableVersTableau(this.in(), function (c, v) { return creerIdentifiant(_this.sorte, c); });
    };
    TableIdentificationImmutable.prototype.selectionCle = function () {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCle(this.in()));
    };
    TableIdentificationImmutable.prototype.selectionCleSuivantCritere = function (prop) {
        return creerIdentifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.in(), prop));
    };
    TableIdentificationImmutable.prototype.taille = function () {
        return MODULE_TABLE.taille(this.in());
    };
    TableIdentificationImmutable.prototype.estVide = function () {
        return this.taille() === 0;
    };
    return TableIdentificationImmutable;
}(Enveloppe));
exports.TableIdentificationImmutable = TableIdentificationImmutable;
function creerTableIdentificationImmutableVide(sorte) {
    return new TableIdentificationImmutable(sorte);
}
exports.creerTableIdentificationImmutableVide = creerTableIdentificationImmutableVide;
function creerTableIdentificationImmutable(sorte, pop) {
    return new TableIdentificationImmutable(sorte, pop);
}
exports.creerTableIdentificationImmutable = creerTableIdentificationImmutable;


/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function jamais(x) {
    throw new Error("* Erreur impossible : " + x);
}
exports.jamais = jamais;
function normalisationNombre(n, taille) {
    var r = n.toString();
    while (r.length < taille) {
        r = "0" + r;
    }
    return r;
}
exports.normalisationNombre = normalisationNombre;


/***/ })

/******/ });
//# sourceMappingURL=jeu1.client.js.map