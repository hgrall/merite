
import {
    PopulationParDomaineMutable,
    ReseauJeu1,
    creerAnneauJeu1,
    assemblerPopulationParDomaine,
    TableMutableMessagesParUtilisateurParDomaine,
    creerTableMutableMessageParUtilisateurParDomaine,
    Consigne
} from '../commun/communRoutage';
import {
    creerTableIdentificationMutableVide
} from '../../bibliotheque/types/tableIdentification';
import { tableVerrouillageMessagesParDomaine } from './serveurRoutage';
import { binaire, Mot } from '../../bibliotheque/binaire';
import { remplirTableConsigne, copieTableConsigne, remplirTableCible } from '../serveur/consigne';

export class Config {
    private utilisateursAConnecterParDomaine: PopulationParDomaineMutable;
    private utilisateursConnectesParDomaine: PopulationParDomaineMutable;
    private utilisateursParDomaine: PopulationParDomaineMutable;
    private anneau: ReseauJeu1;
    private tableCible: Consigne[][];
    private tableauReseau: Mot[];
    private tableConsigneUtilisateurParDomaine: TableMutableMessagesParUtilisateurParDomaine;
    private NOMBRE_DE_DOMAINES: number;
    private UTILISATEURS_PAR_DOMAINE: number[];

    constructor() {
    }

    setConf(conf: Array<number>): void {
        this.NOMBRE_DE_DOMAINES = conf[0];
        conf.splice(0,1);
        this.UTILISATEURS_PAR_DOMAINE = conf;

        // Création du nombre de domaines défini dans le fichier config.ts à la racine du dossier routage
        this.tableauReseau = [];
        for (let i = 0; i < this.NOMBRE_DE_DOMAINES; i++) {
            this.tableauReseau.push(binaire(i));
        }

        this.anneau = creerAnneauJeu1(this.tableauReseau);

        // tmp - Création du nombre d'utilisateurs par domaine //const reseauConnecte: TableNoeudsJeu1 = creerTableVideNoeuds();

        let tableauDomaine : Mot[][] = [];
        for (let n = 0; n < this.NOMBRE_DE_DOMAINES; n++) {
            tableauDomaine[n] = [];
            for (let i = 0; i < this.UTILISATEURS_PAR_DOMAINE[n]; i++) {
                tableauDomaine[n].push(binaire(i));
            }
        }
        this.utilisateursParDomaine = assemblerPopulationParDomaine(this.anneau, tableauDomaine);

        this.utilisateursAConnecterParDomaine = assemblerPopulationParDomaine(this.anneau, tableauDomaine);

        this.utilisateursConnectesParDomaine = assemblerPopulationParDomaine(this.anneau, []);
        console.log('Anneau créé (anneau.representation) : ', this.anneau.representation());

        {
            this.getAnneau().iterer((id, n) => {
                tableVerrouillageMessagesParDomaine.ajouter(id, creerTableIdentificationMutableVide('message', x => x));
            });
        }

        //CREATION DU TABLEAU DE CONSIGNES
        this.tableConsigneUtilisateurParDomaine = creerTableMutableMessageParUtilisateurParDomaine();
        //tableConsigneUtilisateurParDomaine = remplirTableConsigne(utilisateursParDomaine,anneau,tableConsigneUtilisateurParDomaine);
        this.tableConsigneUtilisateurParDomaine = remplirTableConsigne(this.utilisateursParDomaine, this.anneau);
        //Copie de la tableConsigne pour pour enlever des elements en calculant la cible
        //Mais garder consigne initiale pour verifier le decodage
        var tableConsModif: TableMutableMessagesParUtilisateurParDomaine = creerTableMutableMessageParUtilisateurParDomaine();
        tableConsModif = copieTableConsigne(this.utilisateursParDomaine, this.anneau, this.tableConsigneUtilisateurParDomaine);   
        //CREATION DU TABLEAU DE CIBLES
        this.tableCible = remplirTableCible(this.utilisateursParDomaine, this.anneau, tableConsModif);
    }

    getUtilisateursAConnecterParDomaine(): PopulationParDomaineMutable {
        return this.utilisateursAConnecterParDomaine;
    }

    getAnneau(): ReseauJeu1 {
        return this.anneau;
    }

    getUtilisateursConnectesParDomaine(): PopulationParDomaineMutable {
        return this.utilisateursConnectesParDomaine;
    }

    getUtilisateursParDomaine(): PopulationParDomaineMutable {
        return this.utilisateursParDomaine;
    }

    getTableCible(): Consigne[][] {
        return this.tableCible;
    }

    getTableauReseau(): Mot[] {
        return this.tableauReseau;
    }

    getTableConsigneUtilisateurParDomaine(): TableMutableMessagesParUtilisateurParDomaine{
        return this.tableConsigneUtilisateurParDomaine;
    }

    getNbUtilisateursParDomaine(): number[] {
        return this.UTILISATEURS_PAR_DOMAINE;
    }

    getNDomaine() : number {
        return this.NOMBRE_DE_DOMAINES;
    }

    getNMaxUtilParDomaine(): number {
        let max = 0 ; 
        for (let i = 0; i< this.getNDomaine(); i++){
            if (this.UTILISATEURS_PAR_DOMAINE[i]>max){
                max =this.UTILISATEURS_PAR_DOMAINE[i];
            }
        }
        return max;
    }
}