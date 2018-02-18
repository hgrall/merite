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
    TableMutableMessagesParUtilisateurParDomaine,
    TableMutableUtilisateursParMessageParDomaine,
    Consigne,
	creerTableMutableUtilisateurParMessageParDomaine,
	MessageJeu1,
	TypeMessageJeu1,
	creerMessageEnveloppe,
    FormatSommetJeu1,
    FormatUtilisateur,
    creerTableMutableMessageParUtilisateurParDomaine,
} from '../commun/communRoutage';
import { binaire, Mot, motAleatoire, creerMot , tableauBinaireAleatoire,nombreAleatoire, getRandomInt} from '../../bibliotheque/binaire';
import {} from '../../bibliotheque/communication';
import {configuration} from './serveurRoutage'
import { Identification, creerIdentificationParCompteur } from '../../bibliotheque/types/identifiant';
import { Identifiant, creerIdentifiant, egaliteIdentifiant } from '../../bibliotheque/types/identifiant';
import { creerTableImmutable, creerTableMutable } from '../../bibliotheque/types/table';
import {
	TableIdentificationMutable,
	creerTableIdentificationMutableVide,
	creerTableIdentificationImmutable
} from '../../bibliotheque/types/tableIdentification';


/*
* PREPARATION DE LA CONSIGNE
*/

//export function remplirTableConsigne(utilisateursParDomaine: PopulationParDomaineMutable,anneau:ReseauJeu1,tableConsigneUtilisateurParDomaine: TableMutableMessagesParUtilisateurParDomaine):TableMutableMessagesParUtilisateurParDomaine{
export function remplirTableConsigne(utilisateursParDomaine: PopulationParDomaineMutable,anneau:ReseauJeu1):TableMutableMessagesParUtilisateurParDomaine{    
    var tableConsigneUtilisateurParDomaine: TableMutableMessagesParUtilisateurParDomaine = creerTableMutableMessageParUtilisateurParDomaine();
    anneau.iterer((id, n) => {
          var tableDom: TableIdentificationMutable<'utilisateur', Mot, Mot> = creerTableIdentificationMutableVide('utilisateur', x => x);
          let pop = utilisateursParDomaine.valeur(id);
          creerTableImmutable(pop).iterer((cle, util) => {
              var randomContenu = motAleatoire(12);
              tableDom.ajouter(util.ID,randomContenu);
          });
          tableConsigneUtilisateurParDomaine.ajouter(id, tableDom);
    });
    console.log("TABLE CONSIGNE");
    console.log(tableConsigneUtilisateurParDomaine.representation());
    return tableConsigneUtilisateurParDomaine;
}

//Copie table en parametre dans une nouvelle table
export function copieTableConsigne(utilisateursParDomaine: PopulationParDomaineMutable,anneau:ReseauJeu1,tableConsigne:TableMutableMessagesParUtilisateurParDomaine):TableMutableMessagesParUtilisateurParDomaine{    
    var tableCopie: TableMutableMessagesParUtilisateurParDomaine = creerTableMutableMessageParUtilisateurParDomaine();
    anneau.iterer((id, n) => {
            var tableDom: TableIdentificationMutable<'utilisateur', Mot, Mot> = creerTableIdentificationMutableVide('utilisateur', x => x);
            let pop = utilisateursParDomaine.valeur(id);
            creerTableImmutable(pop).iterer((cle, util) => {
            var tmp = tableConsigne.valeur(id).valeur(util.ID);
            tableDom.ajouter(util.ID,tmp);
            });
            tableCopie.ajouter(id, tableDom);
    });
    return tableCopie;
}

function shuffle(a:Array<[Identifiant<'sommet'>,Identifiant<'utilisateur'>,Mot]>) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

export function remplirTableCible(utilisateursParDomaine: PopulationParDomaineMutable,anneau:ReseauJeu1,tableConsigneUtilisateurParDomaine: TableMutableMessagesParUtilisateurParDomaine):Consigne[][]{
    var cible = new Array<Array<Consigne>>();
    var tableConsigne = creerTableMutableMessageParUtilisateurParDomaine();
    tableConsigne = copieTableConsigne(utilisateursParDomaine,anneau,tableConsigneUtilisateurParDomaine);
    var dom:number = 0;
    var nbAleatDom = 0;
    var randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
    var nbAleatUtil = 0;
    var randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
    //Cas pour les dom de 0 à n-1 (cas special pour le dernier dom s'il ne reste a choisir que lui-meme)
    for(dom;dom<configuration.getNDomaine()-1;dom++){
        let row:Consigne[]  = new Array<Consigne>();  
        for(var util:number=0;util<configuration.getNbUtilisateursParDomaine()[dom];util++){
            //initialisation
            //Domaine cible aleatoire : while tant que le domaine est egal a celui en cours
            nbAleatDom = nombreAleatoire(configuration.getNDomaine(),dom);
            randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
            //tant que ce domaine n'existe pas dans la table de consigne, c'est qu'il a été attribué  
            console.log(tableConsigne);
            console.log(randomDomId);
            while(tableConsigne.valeur(randomDomId).estVide()){
                nbAleatDom = nombreAleatoire(configuration.getNDomaine(),dom); //nbAleat different de dom
                randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
            };
            //Utlisateur cible aleatoire
            nbAleatUtil = getRandomInt(configuration.getNbUtilisateursParDomaine()[nbAleatDom]);
            randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
            //tant que ce user est dans la table de consigne, il n'a pas été attribué donc s'il n'y est pas, c'est qu'il a ete attribue
            while(!tableConsigne.valeur(randomDomId).contient(randomUtilId)){
                nbAleatUtil = getRandomInt(configuration.getNbUtilisateursParDomaine()[nbAleatDom]);
                randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
            };
            let ID_dom_cible = anneau.noeud(randomDomId).centre;
            let ID_util_cible = utilisateursParDomaine.utilisateur(randomDomId,randomUtilId);
            let mot_cible= tableConsigne.valeur(randomDomId).valeur(randomUtilId);
            row.push([ID_dom_cible,ID_util_cible,mot_cible]);
        //Retirer l'utilisateur choisi de la table de consigne
        tableConsigne.valeur(randomDomId).retirer(randomUtilId);
        }        
        cible.push(row);
    }//FIN DE LA BOUCLE SUR DOM : CAS DE DOM N
    let row:Consigne[]  = new Array<Consigne>();  
    var domFinalID= creerIdentifiant('sommet',"DOM-"+dom);
    //itere sur table pr stocker id_util restant
    var reste :Array<[Identifiant<'sommet'>,Identifiant<'utilisateur'>,Mot]>=[];
    tableConsigne.iterer((idDom,tableUtil)=>{
        tableUtil.iterer((idUtil,mot)=>{
            reste.push([idDom,idUtil,mot]);
        });
    });
    shuffle(reste); //comme attribution se fait ensuite dans l'ordre, pour mélanger un peu
    
    //creation de liste de cible deja permutees pr eviter la boucle infinie --> 0 si pas encore, 1 sinon
    var dejaPermutes : Array<Array<Number>> = [];
    for (var i=0; i<configuration.getNDomaine();i++){
        var l = Array.apply(null, Array(configuration.getNbUtilisateursParDomaine()[i])).map(Number.prototype.valueOf,0);

        dejaPermutes.push(l);
    }

    for(var i=0;i<reste.length;i++){ //reste.length == nb util dans dernier dom sans consigne
        if(reste[i][0].val === domFinalID.val){
            //dom a permuter : choix aleatoire jusqua different de dom actuel ET different d'un user qui a déjà été permuté
            nbAleatDom = nombreAleatoire(configuration.getNDomaine(),dom);
            nbAleatUtil = getRandomInt(configuration.getNbUtilisateursParDomaine()[nbAleatDom]);
            //Si cible avec laquelle on veut échanger a comme domaine celui du dernier, on doit de nouveau tirer aléatoirement
            while( dejaPermutes[nbAleatDom][nbAleatUtil]===1 || cible[nbAleatDom][nbAleatUtil][0].ID.val===domFinalID.val){
                nbAleatDom = nombreAleatoire(configuration.getNDomaine(),dom); //nbAleat different de dom
                nbAleatUtil = getRandomInt(configuration.getNbUtilisateursParDomaine()[nbAleatDom]);
            };            
            dejaPermutes[nbAleatDom][nbAleatUtil]=1;
            row.push(cible[nbAleatDom][nbAleatUtil]);                                
            cible[nbAleatDom][nbAleatUtil]=[anneau.noeud(reste[i][0]).centre,
                                            utilisateursParDomaine.utilisateur(reste[i][0],reste[i][1]),
                                            reste[i][2]
            ];                              
            tableConsigne.valeur(reste[i][0]).retirer(reste[i][1]);       
        }else{ //attribution classique
            let ID_dom_cible = anneau.noeud(reste[i][0]).centre;
            let ID_util_cible = utilisateursParDomaine.utilisateur(reste[i][0],reste[i][1]);
            let mot_cible= tableConsigne.valeur(reste[i][0]).valeur(reste[i][1]);
            row.push([ID_dom_cible,ID_util_cible,mot_cible]);
            tableConsigne.valeur(reste[i][0]).retirer(reste[i][1]);
        }
    }
    cible.push(row);
    return cible;
}