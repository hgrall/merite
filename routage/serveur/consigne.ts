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


//export function remplirTableConsigne(utilisateursParDomaine: PopulationParDomaineMutable,anneau:ReseauJeu1,tableConsigneUtilisateurParDomaine: TableMutableMessagesParUtilisateurParDomaine):TableMutableMessagesParUtilisateurParDomaine{
export function copieTableConsigne(utilisateursParDomaine: PopulationParDomaineMutable,anneau:ReseauJeu1,tableConsigne:TableMutableMessagesParUtilisateurParDomaine):TableMutableMessagesParUtilisateurParDomaine{    
    var tableCopie: TableMutableMessagesParUtilisateurParDomaine = creerTableMutableMessageParUtilisateurParDomaine();
    anneau.iterer((id, n) => {
            var tableDom: TableIdentificationMutable<'utilisateur', Mot, Mot> = creerTableIdentificationMutableVide('utilisateur', x => x);
            let pop = utilisateursParDomaine.valeur(id);
            creerTableImmutable(pop).iterer((cle, util) => {
            var tmp = tableConsigne.valeur(id).valeur(util.ID);
            console.log("TMP  :  "+tmp.representation());
            tableDom.ajouter(util.ID,tmp);
            });
            tableCopie.ajouter(id, tableDom);
    });
    console.log("TABLE CONPIEE");
    console.log(tableCopie.representation());
    return tableCopie;
}


//type cible= [FormatSommetJeu1,FormatUtilisateur,Mot];
/*
export type Consigne = {
  ID_dom_cible : FormatSommetJeu1,
  ID_util_cible: FormatUtilisateur;
  mot_cible: Mot
}
*/

export function remplirTableCible(utilisateursParDomaine: PopulationParDomaineMutable,anneau:ReseauJeu1,tableConsigneUtilisateurParDomaine: TableMutableMessagesParUtilisateurParDomaine):Consigne[][]{
    //[NOMBRE_DE_DOMAINES],[UTILISATEURS_PAR_DOMAINE]
    //var cible : Consigne[][]=[];
    //var cible : Array<Consigne>=[]; 
    var cible = new Array<Array<Consigne>>();
    var tableConsigne = creerTableMutableMessageParUtilisateurParDomaine();
    tableConsigne = tableConsigneUtilisateurParDomaine;

    for(var dom:number = 0;dom<NOMBRE_DE_DOMAINES;dom++){
        let row:Consigne[]  = new Array<Consigne>();  
        for(var util:number=0;util<UTILISATEURS_PAR_DOMAINE;util++){  
            //Domaine cible aleatoire : while tant que le domaine est egal a celui en cours
			var nbAleatDom = nombreAleatoire(NOMBRE_DE_DOMAINES,dom);
			var randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);

            //tant que ce domaine n'existe pas dans la table de consigne, c'est qu'il a été attribué  
			while(tableConsigne.valeur(randomDomId).estVide()){
				nbAleatDom = nombreAleatoire(NOMBRE_DE_DOMAINES,dom);
				randomDomId= creerIdentifiant('sommet',"DOM-"+nbAleatDom);
			};
            
            //Utlisateur cible aleatoire
            var nbAleatUtil = getRandomInt(UTILISATEURS_PAR_DOMAINE);
            var randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);

            //tant que ce user est dans la table de consigne, il n'a pas été attribué
            while(!tableConsigne.valeur(randomDomId).contient(randomUtilId)){
                nbAleatUtil = getRandomInt(UTILISATEURS_PAR_DOMAINE);
                randomUtilId = creerIdentifiant('utilisateur',"UTIL-DOM-"+nbAleatDom+"-"+nbAleatUtil);
            };
            
            //TRAITEMENT POUR LE DERNIER ELEMENT SI CEST LUI MEME
            
            let ID_dom_cible = anneau.noeud(randomDomId).centre;
            let ID_util_cible = utilisateursParDomaine.utilisateur(randomDomId,randomUtilId);
            let mot_cible= tableConsigne.valeur(randomDomId).valeur(randomUtilId);

            row.push([ID_dom_cible,
                ID_util_cible,
                mot_cible]);

           /* cible[dom][util] =[
                ID_dom_cible,
                ID_util_cible,
                mot_cible
            ];*/
        //Retirer l'utilisateur choisi de la table de consigne
        tableConsigne.valeur(randomDomId).retirer(randomUtilId);
        }
        cible.push(row);
    }
    console.log("CIBLE   ");
    console.log(cible);
    return cible;
}