import {
    FormatMessage, Message,
    FormatErreurRedhibitoire, ErreurRedhibitoire,
    FormatConfigurationInitiale, Configuration
} from "../communication/communication";
import { Individu } from "../../chat/client/typesInterface";
import { Domain } from "domain";
import { Identifiant } from "../types/identifiant";
import {Sommet} from "../communication/communication"



export class CanalClient<
    FE extends FormatErreurRedhibitoire, FC extends FormatConfigurationInitiale, // Format d'entrée
    FMIN extends FMOUT, FMOUT extends FormatMessage, // Formats d'entrée et de sortie
    EM extends string
    > {

    adresse: string;
    lienServeur: WebSocket;
   

    constructor(adresse: string) {
        this.adresse = adresse;
        this.lienServeur = new WebSocket('ws://' + this.adresse, 'echo-protocol');
    };

    // Effet : send(String)
    envoyerMessage(msg: Message<FMIN, FMOUT, EM>): void {
        this.lienServeur.send(msg.brut());
    };

    // Effet: enregistrement comme écouteur
    enregistrerTraitementMessageRecu(traitement: (m: FMIN) => void): void {
        this.lienServeur.addEventListener("message", function (e: MessageEvent) {
            let msg = JSON.parse(e.data);
            if (msg.configurationInitiale !== undefined) {
                return;
            }
            if (msg.erreurRedhibitoire !== undefined) {
                return;
            }
            traitement(<FMIN>msg);
        });
    };
    // Effet: enregistrement comme écouteur
    enregistrerTraitementConfigurationRecue(traitement: (c: FC) => void): void {
        this.lienServeur.addEventListener("message", function (e: MessageEvent) {
            let contenuJSON = JSON.parse(e.data);
            if (contenuJSON.configurationInitiale === undefined) {
                return;
            }
            traitement(<FC>contenuJSON);
        });
    };
    // Effet: enregistrement comme écouteur
    enregistrerTraitementErreurRecue(traitement: (e: FE) => void): void {
        this.lienServeur.addEventListener("message", function (e: MessageEvent) {
            let contenuJSON = JSON.parse(e.data);
            if (contenuJSON.erreurRedhibitoire === undefined) {
                return;
            }
            traitement(<FE>contenuJSON);
        });
    };

 
};

export function creerCanalClient<
    FE extends FormatErreurRedhibitoire, FC extends FormatConfigurationInitiale,
    FMIN extends FMOUT,
    FMOUT extends FormatMessage, EM extends string
    >(adresse: string) {
    return new CanalClient<FE, FC, FMIN, FMOUT, EM>(adresse,);
}

export class canalClientUtilisateur<
    FE extends FormatErreurRedhibitoire, FC extends FormatConfigurationInitiale, // Format d'entrée
    FMIN extends FMOUT, FMOUT extends FormatMessage, // Formats d'entrée et de sortie
    EM extends string
    > extends CanalClient<
    FE extends FormatErreurRedhibitoire, FC extends FormatConfigurationInitiale, // Format d'entrée
    FMIN extends FMOUT, FMOUT extends FormatMessage, // Formats d'entrée et de sortie
    EM extends string
    >{
    utilisateur: Identifiant<'utilisateur'>;
    
    constructor(user:Identifiant<'utilisateur'>) {
        this.utilisateur=user;
    };

    /* recevoir[idUtilisateur](idMessage, idDomOrigine, idDomDestination, contenu)
    recevoir[idUtil](id, origine, dest, contenu)
    */
    recevoirMessage(msg:Identifiant<'message'>,
    idDomOrigine:Identifiant<'sommet'>,
    idDomDestination:Identifiant<'sommet'>,
    contenu:EM): void{
    
};

    //activer[idUtilisateur](idMessage, idDomOrigine, idDomDestination, contenu)
    activerMessage(msg:Identifiant<'message'>,
        idDomOrigine:Identifiant<'sommet'>,
        idDomDestination:Identifiant<'sommet'>,
        contenu:EM): void{
        
    };

    //detruire[idUtil](idMessage)
    detruireMessage(msg: Message<FMIN, FMOUT, EM>): void{
        
    };

    //gagner[idUtil](idMessage, idDom, contenu)
    gagner(msg:Identifiant<'message'>,
        idDom:Identifiant<'sommet'>,
        contenu:EM): void{
        
    };

    //perdre[idUtil](idMessage, idDom, contenu)
    perdre(msg:Identifiant<'message'>,
        idDom:Identifiant<'sommet'>,
        contenu:EM): void{
        
    };
};
