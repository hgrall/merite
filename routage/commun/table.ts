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
}

