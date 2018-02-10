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
import { NOMBRE_DE_DOMAINES, UTILISATEURS_PAR_DOMAINE, NOMBRE_UTILISATEURS_PAR_DOMAINE } from '../config';
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
    console.log("TABLE COPIEE");
    console.log(tableCopie.representation());
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

    for(dom;dom<NOMBRE_DE_DOMAINES-1;dom++){
        let row:Consigne[]  = new Array<Consigne>();  
        for(var util:number=0;util<UTILISATEURS_PAR_DOMAINE;util++){
            //initialisation
            if(dom!== NOMBRE_DE_DOMAINES-1){
                //Domaine cible aleatoire : while tant que le domaine est egal a celui en cours
                nbAleatDom = nombreAleatoire(NOMBRE_DE_DOMAINES,dom);
                randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
                //tant que ce domaine n'existe pas dans la table de consigne, c'est qu'il a été attribué  
                while(tableConsigne.valeur(randomDomId).estVide()){
                    nbAleatDom = nombreAleatoire(NOMBRE_DE_DOMAINES,dom); //nbAleat different de dom
                    randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
                };
                //Utlisateur cible aleatoire
                nbAleatUtil = getRandomInt(UTILISATEURS_PAR_DOMAINE);
                randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
                //tant que ce user est dans la table de consigne, il n'a pas été attribué
                //donc s'il n'y est pas, c'est qu'il a ete attribue
                while(!tableConsigne.valeur(randomDomId).contient(randomUtilId)){
                    nbAleatUtil = getRandomInt(UTILISATEURS_PAR_DOMAINE);
                    randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
                };
            }else{
            }
            
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
    //dom++;
    var domFinalID= creerIdentifiant('sommet',"DOM-"+dom);
    //itere sur table pr stocker id_util restant
    var reste :Array<[Identifiant<'sommet'>,Identifiant<'utilisateur'>,Mot]>=[];
    tableConsigne.iterer((idDom,tableUtil)=>{
      //  console.log("RESTE  id  :"+idDom.val+"  util  :"+tableUtil.representation());
        tableUtil.iterer((idUtil,mot)=>{
        //    console.log("RESTE id : "+idUtil.val+"  mot : "+mot.representation());
            reste.push([idDom,idUtil,mot]);
        });
    });

    shuffle(reste);
    /*
    for(var i=0;i<reste.length;i++){ 
        console.log("RESTE  "+reste[i][0].val);
        console.log("RESTE  "+reste[i][1].val);
        console.log("RESTE  "+reste[i][2].representation());
    }*/
    
    for(var i=0;i<reste.length;i++){ //reste.length == nb util dans dernier dom sans consigne
        if(reste[i][0].val === domFinalID.val){
            console.log("PERMUTATION  ");
            //Permutation avec un autre user
            var nbUtilActuel = parseInt(reste[i][1].val.substring(reste[i][1].val.lastIndexOf("-")+1));
            console.log("NB UTIL ACTUEL  "+nbUtilActuel);
            //dom a permuter : choix aleatoire jusqua diffrent de dom actuel
            nbAleatDom = nombreAleatoire(NOMBRE_DE_DOMAINES,dom);
            randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
            nbAleatUtil = getRandomInt(UTILISATEURS_PAR_DOMAINE);
            randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
            console.log("DOM ALEAT 1 "+nbAleatDom+"  UTIL ALEAT  "+nbAleatUtil);
           // while(tableConsigne.valeur(randomDomId).estVide()){
               console.log("CIBLE DE ALEAT "+cible[nbAleatDom][nbAleatUtil][0].ID.val);
             while(cible[nbAleatDom][nbAleatUtil][0].ID.val===domFinalID.val){
                nbAleatDom = nombreAleatoire(NOMBRE_DE_DOMAINES,dom); //nbAleat different de dom
                randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
                nbAleatUtil = getRandomInt(UTILISATEURS_PAR_DOMAINE);
                randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
                console.log("DOM ALEAT WHILE  "+nbAleatDom+"  UTIL ALEAT  "+nbAleatUtil);
            };
            //
            row.push(cible[nbAleatDom][nbAleatUtil]);
            cible[nbAleatDom][nbAleatUtil]=[anneau.noeud(randomDomId).centre,
                                            utilisateursParDomaine.utilisateur(randomDomId,randomUtilId),
                                            reste[i][2]
                                            ];
            tableConsigne.valeur(randomDomId).retirer(randomUtilId);         
        }else{ //attribution classique
            console.log("ATTRIBUTION CLASSIQUE ");
            console.log("DOM "+reste[i][0].val+"UTIL "+reste[i][1].val+"MOT "+reste[i][2].representation());
            let ID_dom_cible = anneau.noeud(reste[i][0]).centre;
            let ID_util_cible = utilisateursParDomaine.utilisateur(reste[i][0],reste[i][1]);
            let mot_cible= tableConsigne.valeur(reste[i][0]).valeur(reste[i][1]);
            row.push([ID_dom_cible,ID_util_cible,mot_cible]);
            tableConsigne.valeur(reste[i][0]).retirer(reste[i][1]);
        }
    }
    cible.push(row);

    console.log("CIBLE   ");
    //console.log(cible);

    for(var i = 0; i<NOMBRE_DE_DOMAINES; i++){
        for(var j=0; j<UTILISATEURS_PAR_DOMAINE; j++){
            console.log("Element : "+i+"-"+j);
            console.log("Sommet  "+cible[i][j][0].ID.val);
            console.log("Utilisateur  "+cible[i][j][1].ID.val);
            console.log("Mot  "+cible[i][j][2].representation());
        }
    }

    return cible;
}