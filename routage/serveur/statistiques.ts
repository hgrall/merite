import {Identifiant} from '../../bibliotheque/types/identifiant';
import { Mot} from '../../bibliotheque/binaire';
import {connexions, utilisateursConnectesParDomaine, identificationMessages, tableVerrouillageMessagesParDomaine, PERSONNE, tableConsigneUtilisateurParDomaine} from './serveurRoutage';


//Nombre de message par domaine --> pour comparer avec nombre de succes || besoin de faire deux listes: messages envoyes et messages recus
export function creerCompteurParDomaine(domaines:Mot[]) : Array<number>{
    var compteur: Array<number> = [];
    for (let i in domaines){
        compteur[i]=0;
    }
    console.log("COMPTEUR PAR DOMAINE "+compteur);
    return compteur;
};


//maj des points pour le domaine concerne || pointsEnvoyes pour bon envoi et pointsRecus pour bon decodage par la bonne personne
export function ajouterPointsParDomaine(domaine: Identifiant<'sommet'>,points:Array<number>){
    var dom = parseInt(domaine.val.substring(4,domaine.val.length));
    points[dom]+=1;
    console.log('POINTS PAR DOMAINE UPDATE  :  '+ points);
};


//maj du nombre de messages pour le domaine concerne || message recu ou envoye
export function ajouterMessageParDomaine(domaine: Identifiant<'sommet'>,messageNombre:Array<number>){
    var dom = parseInt(domaine.val.substring(4,domaine.val.length));
    messageNombre[dom]+=1;
    console.log('NOMBRE MESSAGE PAR DOMAINE UPDATE  :  '+ messageNombre);
};

//Nombre de messages bien receptionnes
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



export function compteurMessageEnvoyes(messageEnvoyesNombre:Array<number>){
    return messageEnvoyesNombre.length;
};

//points si un msg a bien ete code et envoyé OU si msg a bien ete decode par la bonne personne
//donne le nombre de points total par domaine
export function compteurPointsParDomaine(pointsEnvoyes:Array<number>,pointsRecus:Array<number>){
    var total:Array<number> = [];
    for(var i=0; i<pointsEnvoyes.length;i++){
        total.push(pointsEnvoyes[i]+pointsRecus[i]);
    }
    return total;
};