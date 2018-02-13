import {Identifiant} from '../../bibliotheque/types/identifiant';
import { Mot} from '../../bibliotheque/binaire';
import {connexions, utilisateursConnectesParDomaine, identificationMessages, tableVerrouillageMessagesParDomaine, PERSONNE, tableConsigneUtilisateurParDomaine} from './serveurRoutage';


//Nombre de message par domaine --> pour comparer avec nombre de succes || besoin de faire deux listes: messages envoyes et messages recus
export function creerCompteurParDomaine(domaines:Mot[]) : Array<number>{
    var compteur: Array<number> = [];
    for (let i in domaines){
        compteur[i]=0;
    }
    return compteur;
};


//maj des points pour le domaine concerne || pointsEnvoyes pour bon envoi et pointsRecus pour bon decodage par la bonne personne
export function ajouterPointsParDomaine(domaine: Identifiant<'sommet'>,points:Array<number>){
    var dom = parseInt(domaine.val.substring(4,domaine.val.length));
    points[dom]+=1;
    //console.log('POINTS PAR DOMAINE UPDATE  :  '+ points);
};


//maj du nombre de messages pour le domaine concerne || message recu ou envoye
export function ajouterMessageParDomaine(domaine: Identifiant<'sommet'>,messageNombre:Array<number>){
    var dom = parseInt(domaine.val.substring(4,domaine.val.length));
    messageNombre[dom]+=1;
    //console.log('NOMBRE MESSAGE PAR DOMAINE UPDATE  :  '+ messageNombre);
};

//Nombre de messages mal decodes
export function calculEcartMessageEnvoyesRecus(messageEnvoyesNombre:Array<number>,messageRecusNombre:Array<number>){
    var ecart:Array<number> = [];
    let taille = messageEnvoyesNombre.length;
    for(var i = 0; i<taille; i++){
        ecart.push(messageEnvoyesNombre[i]-messageRecusNombre[i]);
    }
    return ecart;
};

//Nombre de msg bien decodes sur total recus OU Nombre de msg bien envoyes sur total a envoyer
export function calculEcartPointsMessage(points:Array<number>,messageNombre:Array<number>){
    var ecart:Array<number> = [];
    let taille = points.length;
    for(var i = 0; i<taille; i++){
        ecart.push(messageNombre[i]-points[i]);
    }
    return ecart;
};



export function compteurGlobal(messageEnvoyesNombre:Array<number>){
    var compt = 0;
    for(var i=0; i<messageEnvoyesNombre.length;i++){
        compt+=messageEnvoyesNombre[i];
    }
    return compt;
};