import {TableIdentificationMutable, creerTableIdentificationMutableVide} from '../../bibliotheque/types/tableIdentification';
import {Identifiant, FormatIdentifiableImmutable} from '../../bibliotheque/types/identifiant';
import {FormatDateFr, creerDateEnveloppe} from '../../bibliotheque/types/date';
import {jamais} from '../../bibliotheque/outils';
import {Mot} from '../../bibliotheque/binaire';
import {FormatMessage, Message} from '../../bibliotheque/communication/communication';
/* Table mutable des utilisateurs par message par domaine */

export type TableMutableUtilisateursParMessageParDomaine =
  TableIdentificationMutable<'sommet',
  TableIdentificationMutable<'message', Identifiant<'utilisateur'>, Identifiant<'utilisateur'>>,
  TableIdentificationMutable<'message', Identifiant<'utilisateur'>, Identifiant<'utilisateur'>>>;

export function creerTableMutableUtilisateurParMessageParDomaine(): TableMutableUtilisateursParMessageParDomaine {
return creerTableIdentificationMutableVide('sommet', (x) => x);
}

// Iditenfiants indéfinis utilisés dans des messages définis partiellement
export const sommetInconnu: Identifiant<'sommet'> = { val: "*", sorte: 'sommet' };
export const messageInconnu: Identifiant<'message'> = { val: "*", sorte: 'message' };
export const utilisateurInconnu: Identifiant<'utilisateur'> = { val: "*", sorte: 'utilisateur' };


export enum TypeMessageJeu1 {
  INIT,
  SUCCES_INIT,
  VERROU,
  ACTIF,
  SUCCES_ACTIF,
  INACTIF,
  TRANSIT,
  IGNOR,
  FIN,
  ESSAI,
  SUCCES_TRANSIT,
  ECHEC_TRANSIT,
  SUCCES_FIN,
  ECHEC_FIN,
  ERREUR_CONNEXION, // TODO
  ERREUR_EMET,
  ERREUR_DEST,
  ERREUR_TYPE,
  INTERDICTION
}

/* Message */
export interface FormatMessageJeu1
extends FormatMessage, FormatIdentifiableImmutable<'message'> {
readonly ID_emetteur: Identifiant<'utilisateur'>,
readonly ID_origine: Identifiant<'sommet'>,
readonly ID_destination: Identifiant<'sommet'>,
readonly type: TypeMessageJeu1,
readonly contenu: Mot,
readonly date: FormatDateFr // Emission
}

export type EtiquetteMessageJeu1 = 'ID' | 'type' | 'date' | 'ID_de' | 'ID_à' | 'contenu';

// Structure immutable
export class MessageJeu1 extends
Message<FormatMessageJeu1, FormatMessageJeu1, EtiquetteMessageJeu1> {

constructor(etat: FormatMessageJeu1) {
    super((x) => x, etat);
}

net(e: EtiquetteMessageJeu1): string {
    let msg = this.val();
    switch (e) {
        case 'ID': return msg.ID.val;
        case 'type': return TypeMessageJeu1[msg.type];
        case 'date': return creerDateEnveloppe(msg.date).representation();
        case 'ID_de': return msg.ID_origine.val;
        case 'ID_à': return msg.ID_destination.val;
        case 'contenu': return msg.contenu.representation();
    }
    return jamais(e);
}

representation(): string {
    let idm = this.net('ID');
    let dem = this.net('ID_de');
    let am = this.net('ID_à');
    let typem = this.net('type');
    let datem = this.net('date');
    let cm = this.net('contenu');
    return idm + " - " + datem + ", de " + dem + " à " + am + " (" + typem + ") - " + cm;
}

    // Client : envoyer au serveur avec une destination (un domaine).
    avecAdresse(id_destination: Identifiant<'sommet'>): MessageJeu1 {
        let msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: id_destination,
            type: msg.type,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    // Serveur : Identifier le message INIT.
    avecIdentifiant(id: Identifiant<'message'>): MessageJeu1 {
        let msg = this.val();
        return new MessageJeu1({
            ID: id,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: msg.type,
            contenu: msg.contenu,
            date: msg.date
        });
    }
    // Serveur : diffuser un message à un domaine.
    sansEmetteurPourTransit(): MessageJeu1 {
        let msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: utilisateurInconnu,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: TypeMessageJeu1.TRANSIT,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    // Client : verrouiller un message en transit.
    pourVerrouiller(id_emetteur: Identifiant<'utilisateur'>, id_origine: Identifiant<'sommet'>): MessageJeu1 {
        let msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: id_emetteur,
            ID_origine: id_origine,
            ID_destination: sommetInconnu,
            type: TypeMessageJeu1.VERROU,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    // Serveur : Accuser réception.
    avecAccuseReception(type: TypeMessageJeu1) {
        let msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: type,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    // 4. Client : Ignorer un message en TRANSIT (IGNOR).
    aIgnorer(): MessageJeu1 {
        let msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: TypeMessageJeu1.IGNOR,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    // 5. Client : Consulter un message en TRANSIT (FIN).
    aConsulter(): MessageJeu1 {
        let msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: msg.ID_origine,
            ID_destination: msg.ID_destination,
            type: TypeMessageJeu1.FIN,
            contenu: msg.contenu,
            date: msg.date
        });
    }

    // 5. Client : tester un message en FIN.
    aEssayer(contenu: Mot): MessageJeu1 {
        let msg = this.val();
        return new MessageJeu1({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_origine: sommetInconnu,
            ID_destination: sommetInconnu,
            type: TypeMessageJeu1.ESSAI,
            contenu: contenu,
            date: msg.date
        });
    }

}

