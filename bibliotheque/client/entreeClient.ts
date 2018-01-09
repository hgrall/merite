/**
 * INTERACTIONS AVEC L'UTILISATEUR
 */

import {
    FormatMessage, Message,
    FormatErreurRedhibitoire, ErreurRedhibitoire,
    FormatConfigurationInitiale, Configuration
} from "../communication/communication";

export class EntreeClient{

    //EntreeEssai(idMessage, contenu)
    entreeEssai():void{

    };

    //EntreeEnvoi(idMessage, idDest)
    entreeEnvoi():void{
        
    };

    //EntreeIgnorer(idMessage)
    entreeIgnorer():void{
        
    };

    //EntreeInit(idDomDestination, contenu)
    entreeInit():void{
    };

    //EntreeLibe(idMessage)
    entreeLibe():void{
        
    };

    //EntreeVerrou(idMessage)
    entreeVerrou():void{
        
    };
};