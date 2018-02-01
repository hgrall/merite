import {
    FormatMessage, Message,
    FormatConfigurationInitiale, Configuration,
    FormatErreurRedhibitoire, ErreurRedhibitoire,
    Sommet, ReseauMutable, AssemblageReseau,
    creerCentreSansVoisins,
    NoeudEnveloppeMutable, NoeudEnveloppeImmutable, NoeudMutable, NoeudImmutable, FormatNoeudImmutable, FormatNoeudMutable, EtiquetteNoeud,
    creerAssemblageReseauEnAnneau
} from "../../bibliotheque/communication";

import {
    Unite, Mutable,
    FormatDateFr, creerDateEnveloppe, creerDateMaintenant,
    creerTableImmutable, FormatTableImmutable,
    FormatIdentifiableMutable, FormatIdentifiableImmutable,
    Identification, creerIdentificationParCompteur, Identifiant
} from "../../bibliotheque/types";
import { jamais } from "../../bibliotheque/outils";

//export const hote: string = "192.168.1.18"; // hôte local via TCP/IP - DNS : cf. /etc/hosts - IP : 127.0.0.1 - ici : "merite"
export const port1: number = Number(process.env.PORT) || 8080; // port de la essource 1 (serveur d'applications)
export const port2: number = Number(process.env.PORT) || 8080; // port de la ressouce 2 (serveur de connexions)

export interface FormatSommetTchat extends FormatIdentifiableImmutable<'sommet'> {
    readonly pseudo: string,
}

export type EtiquetteSommetTchat = 'ID' | 'nom';

// La structure JSON décrivant le sommet est en lecture seulement. 
export class SommetTchat
    extends Sommet<FormatSommetTchat, FormatSommetTchat, EtiquetteSommetTchat> {

    constructor(etat: FormatSommetTchat) {
        super((x) => x, etat);
    }

    net(e: EtiquetteSommetTchat): string {
        let s = this.val();
        switch (e) {
            case 'nom': return s.pseudo;
            case 'ID': return s.ID.val;
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('nom') + " (" + this.net('ID') + ")";
    }
}

export function creerSommetTchat(s: FormatSommetTchat) {
    return new SommetTchat(s);
}

export type FormatNoeudTchatMutable = FormatNoeudMutable<FormatSommetTchat>;
export type NoeudTchatMutable = NoeudMutable<FormatSommetTchat>;

class NoeudTchatEnveloppeMutable extends NoeudEnveloppeMutable<FormatSommetTchat>{

    net(e: EtiquetteNoeud): string {
        let s = this.val();
        switch (e) {
            case 'centre': return creerSommetTchat(s.centre).representation();
            case 'voisins':
                return creerTableImmutable(s.voisins).representation();
        }
        return jamais(e);
    }
    representation(): string {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    }
}

export function creerNoeudTchatMutable(n: FormatNoeudTchatMutable)  : NoeudTchatMutable {
    return new NoeudTchatEnveloppeMutable(n);
}

export function creerNoeudSansVoisinsTchatMutable(centre: FormatSommetTchat): NoeudTchatMutable {
    return new NoeudTchatEnveloppeMutable(creerCentreSansVoisins(centre));
}



export type FormatNoeudTchatImmutable = FormatNoeudImmutable<FormatSommetTchat>;
export type NoeudTchatImmutable = NoeudImmutable<FormatSommetTchat>;

class NoeudTchatEnveloppeImmutable extends NoeudEnveloppeImmutable<FormatSommetTchat>{

    net(e: EtiquetteNoeud): string {
        let s = this.val();
        switch (e) {
            case 'centre': return creerSommetTchat(s.centre).representation();
            case 'voisins':
                return creerTableImmutable(s.voisins).representation();
        }
        return jamais(e);
    }
    representation(): string {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    }
}

export function creerNoeudTchatImmutable(n: FormatNoeudTchatImmutable) : NoeudTchatImmutable{
    return new NoeudTchatEnveloppeImmutable(n);
}


export type ReseauTchat = ReseauMutable<FormatSommetTchat>;

export type AssemblageReseauTchat
    = AssemblageReseau<FormatSommetTchat>;

export enum TypeMessageTchat {
    COM,
    TRANSIT,
    AR,
    ERREUR_CONNEXION,
    ERREUR_EMET,
    ERREUR_DEST,
    ERREUR_TYPE,
    INTERDICTION
}
/*
export function chaineTypeMessageChat(x : TypeMessageChat) : string  {
    return TypeMessageChat[x];
}
*/

// Format en lecture seulement
export interface FormatMessageTchat extends FormatMessage {
    readonly ID: Identifiant<'message'>, 
    readonly ID_emetteur: Identifiant<'sommet'>,
    readonly ID_destinataire: Identifiant<'sommet'>,
    readonly type: TypeMessageTchat,
    readonly contenu: string,
    readonly date: FormatDateFr
}

export type EtiquetteMessageTchat = 'type' | 'date' | 'ID_de' | 'ID_à' | 'contenu';

// Structure immutable
export class MessageTchat extends Message<FormatMessageTchat, FormatMessageTchat, EtiquetteMessageTchat> {

    constructor(etat: FormatMessageTchat) {
        super((x) => x, etat);
    }

    net(e: EtiquetteMessageTchat): string {
        let msg = this.val();
        switch (e) {
            case 'type': return TypeMessageTchat[msg.type];
            case 'date': return creerDateEnveloppe(msg.date).representation();
            case 'ID_de': return msg.ID_emetteur.val;
            case 'ID_à': return msg.ID_destinataire.val;
            case 'contenu': return msg.contenu;
        }
        return jamais(e);
    }

    representation(): string {
        let dem = this.net('ID_de');
        let am = this.net('ID_à');
        let typem = this.net('type');
        let datem = this.net('date');
        let cm = this.net('contenu');
        return datem + ", de " + dem + " à " + am + " (" + typem + ") - " + cm;
    }

    transit(): MessageTchat {
        let msg = this.val();
        return new MessageTchat({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageTchat.TRANSIT,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    avecAccuseReception(): MessageTchat {
        let msg = this.val();
        return new MessageTchat({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageTchat.AR,
            contenu: msg.contenu,
            date: msg.date
        });
    }

}

export function creerMessageErreurConnexion(id: Identifiant<'message'>, idEmetteur: Identifiant<'sommet'>, messageErreur: string): MessageTchat {
    return new MessageTchat({
        ID: id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idEmetteur,
        type: TypeMessageTchat.ERREUR_CONNEXION,
        contenu: messageErreur,
        date: creerDateMaintenant().val()
    });
}

export function creerMessageCommunication(id: Identifiant<'message'>, idEmetteur: Identifiant<'sommet'>, idDestinataire: Identifiant<'sommet'>, 
    texte: string, date : FormatDateFr ): MessageTchat {
    return new MessageTchat({
        ID : id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idDestinataire,
        type: TypeMessageTchat.COM,
        contenu: texte,
        date: date
    });
}

export function creerMessageRetourErreur(original: MessageTchat, codeErreur: TypeMessageTchat, messageErreur: string): MessageTchat {
    return new MessageTchat({
        ID : original.val().ID, 
        ID_emetteur: original.val().ID_emetteur,
        ID_destinataire: original.val().ID_destinataire,
        type: codeErreur,
        contenu: messageErreur,
        date: original.val().date
    });
}


/*
Exemple de description d'une configuration
- noeud de centre : {"id":"id-1","pseudo":"toto"}
- noeud de voisins : {"id-2":{"id":"id-2","pseudo":"coco"},"id-0":{"id":"id-0","pseudo":"titi"}}

*/


/*
inutile :
export interface FormatConfigurationTchatIN
    extends FormatConfigurationInitiale {
    readonly "centre": FormatSommetTchatEX,
    readonly "voisins": { [cle: string]: FormatSommetTchatEX, mutable: undefined },
    readonly "date": Date
}
*/
export interface FormatConfigurationTchat extends FormatConfigurationInitiale {
    readonly "centre": FormatSommetTchat,
    readonly "voisins": FormatTableImmutable<FormatSommetTchat>,
    readonly "date": FormatDateFr
}


export type EtiquetteConfigurationTchat = 'centre' | 'voisins' | 'date';

export class ConfigurationTchat
    extends Configuration<
    FormatConfigurationTchat,
    FormatConfigurationTchat,
    EtiquetteConfigurationTchat> {

    constructor(c: FormatConfigurationTchat) {
        super((x) => x, c);
    }

    net(e: EtiquetteConfigurationTchat): string {
        let config = this.val();
        switch (e) {
            case 'centre': return creerSommetTchat(config.centre).representation();
            case 'voisins': return creerTableImmutable(config.voisins).representation();
            case 'date': return creerDateEnveloppe(config.date).representation();
        }
        return jamais(e);
    }
    representation(): string {
        let cc = this.net('centre');
        let vc = this.net('voisins');
        let dc = this.net('date');
        return "(centre : " + cc + " ; voisins : " + vc + ") créée " + dc;
    }
}

export function creerConfigurationTchat(c: FormatConfigurationTchat) {
    return new ConfigurationTchat(c);
}

export function composerConfigurationTchat(
    n: FormatNoeudTchatImmutable, date: FormatDateFr)
    : ConfigurationTchat {
    return new ConfigurationTchat({
        "configurationInitiale": Unite.ZERO,
        "centre": n.centre,
        "voisins": n.voisins,
        "date": date
    });
}

export function decomposerConfiguration(c: ConfigurationTchat)
    : FormatNoeudTchatImmutable {
    let centre: FormatSommetTchat = c.val().centre;
    let voisins = c.val().voisins;
    return { "centre": centre, "voisins": voisins };
}


export interface FormatErreurTchat extends FormatErreurRedhibitoire {
    readonly "messageErreur": string,
    readonly "date": FormatDateFr
}

export type EtiquetteErreurTchat = 'messageErreur' | 'date';

export class ErreurTchat
    extends ErreurRedhibitoire<FormatErreurTchat, FormatErreurTchat, EtiquetteErreurTchat> {

    constructor(err: FormatErreurTchat) {
        super((x) => x, err);
    }

    net(e: EtiquetteErreurTchat): string {
        let erreur = this.val();
        switch (e) {
            case 'messageErreur': return erreur.messageErreur;
            case 'date': return creerDateEnveloppe(erreur.date).representation();
        }
        return jamais(e);
    }
    representation(): string {
        return "[" + this.net('date') + " : " + this.net('messageErreur') + "]";
    }
}

export function creerErreurTchat(err: FormatErreurTchat): ErreurTchat {
    return new ErreurTchat(err);
}

export function composerErreurTchat(msg: string, date: FormatDateFr): ErreurTchat {
    return new ErreurTchat({
        "erreurRedhibitoire": Unite.ZERO,
        "messageErreur": msg,
        "date": date
    });
}

export function creerAnneauTchat(noms: string[]): ReseauTchat {
    let assembleur: AssemblageReseauTchat
        = creerAssemblageReseauEnAnneau(noms.length, creerNoeudSansVoisinsTchatMutable);
    let identification: Identification<'sommet'>
        = creerIdentificationParCompteur("S-");
    noms.forEach((nom: string, i: number, tab: string[]) => {
        let s: FormatSommetTchat
            = { ID: identification.identifier('sommet'), pseudo: tab[i]};
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}
