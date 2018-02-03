import {Identifiant} from '../../bibliotheque/types/identifiant';
import { Mot} from '../../bibliotheque/binaire';
import {connexions, utilisateursConnectesParDomaine, identificationMessages, tableVerrouillageMessagesParDomaine, PERSONNE, tableConsigneUtilisateurParDomaine} from './serveurRoutage';


export function creerPointsParDomaine(domaines:Mot[]) : Array<number>{
    var points: Array<number> = [];
    for (let i in domaines){
        points[i]=0;
    }
    return points;
}

//mag des points pour le domaine concerne
export function ajouterPointsParDomaine(domaine: Identifiant<'sommet'>,points:Array<number>){
    var dom = parseInt(domaine.val.substring(4,domaine.val.length));
    points[dom]+=1;
    console.log('POINTS PAR DOMAINE UPDATE  :  '+ points);
}