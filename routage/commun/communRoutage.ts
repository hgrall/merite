import { creerAssemblageReseauEnAnneau, AssemblageReseau } from '../../bibliotheque/communication/assemblageReseau';
import { ReseauImmutable, creerCentreSansVoisins } from '../../bibliotheque/communication/creerReseau';
import {
  NoeudEnveloppeImmutable,
  NoeudImmutable,
  FormatNoeudImmutable,
  EtiquetteNoeud,
  NoeudEnveloppeMutable,
  FormatNoeudMutable,
  NoeudMutable
} from '../../bibliotheque/communication/noeud';
import {
  ErreurRedhibitoire,
  FormatErreurRedhibitoire,
  Configuration,
  FormatConfigurationInitiale,
  Message,
  FormatMessage,
  Sommet
} from '../../bibliotheque/communication/communication';
import {
  creerTableIdentificationImmutable,
  creerTableIdentificationMutable,
  creerTableIdentificationMutableVide,
  TableIdentificationMutable
} from '../../bibliotheque/types/tableIdentification';
import { Enveloppe } from '../../bibliotheque/types/enveloppe';
import { creerDateMaintenant, creerDateEnveloppe, FormatDateFr } from '../../bibliotheque/types/date';
import { FormatTableImmutable, creerTableImmutable, FormatTableMutable } from '../../bibliotheque/types/table';
import { Unite, Deux, Mutable } from '../../bibliotheque/types/mutable';
import {
  creerIdentificationParCompteur,
  Identification,
  FormatIdentifiableImmutable,
  Identifiant
} from '../../bibliotheque/types/identifiant';

// import {
//     FormatMessage, Message,
//     FormatConfigurationInitiale, Configuration,
//     FormatErreurRedhibitoire, ErreurRedhibitoire,
//     Sommet, ReseauImmutable, AssemblageReseau,
//     creerCentreSansVoisins,
//     NoeudEnveloppeMutable, NoeudEnveloppeImmutable, NoeudMutable, NoeudImmutable, FormatNoeudImmutable, FormatNoeudMutable, EtiquetteNoeud,
//     creerAssemblageReseauEnAnneau
// } from "../../bibliotheque/communication";

import { jamais } from '../../bibliotheque/outils';

import { Mot, creerMot } from '../../bibliotheque/binaire';

export const hote: string = 'merite'; // hôte local via TCP/IP - DNS : cf. /etc/hosts - IP : 127.0.0.1
export const port1 = 3002; // port de la ressource 1 (serveur d'applications)
export const port2: number = 1112; // port de la ressouce 2 (serveur de connexions)

// Iditenfiants indéfinis utilisés dans des messages définis partiellement
export const sommetInconnu: Identifiant<'sommet'> = { val: '*', sorte: 'sommet' };
export const messageInconnu: Identifiant<'message'> = { val: '*', sorte: 'message' };
export const utilisateurInconnu: Identifiant<'utilisateur'> = { val: '*', sorte: 'utilisateur' };

// On choisit de ne pas placer la population du domaine dans le sommet pour éviter de
//   découvrir la population des domaines voisins.

export interface FormatSommetJeu1 extends FormatIdentifiableImmutable<'sommet'> {
  readonly domaine: ReadonlyArray<Deux>;
}

export type EtiquetteSommetJeu1 = 'ID' | 'domaine';

export class SommetJeu1 extends Sommet<FormatSommetJeu1, FormatSommetJeu1, EtiquetteSommetJeu1> {
  constructor(etat: FormatSommetJeu1) {
    super(x => x, etat);
  }

  net(e: EtiquetteSommetJeu1): string {
    let s = this.val();
    switch (e) {
      case 'domaine':
        return creerMot(s.domaine).representation();
      case 'ID':
        return s.ID.val;
    }
    return jamais(e);
  }
  representation(): string {
    return this.net('domaine') + ' (' + this.net('ID') + ')';
  }
}

export function creerSommetJeu1(s: FormatSommetJeu1): SommetJeu1 {
  return new SommetJeu1(s);
}

export type FormatNoeudJeu1Mutable = FormatNoeudMutable<FormatSommetJeu1>;
export type NoeudJeu1Mutable = NoeudMutable<FormatSommetJeu1>;

export class NoeudJeu1EnveloppeMutable extends NoeudEnveloppeMutable<FormatSommetJeu1> {
  net(e: EtiquetteNoeud): string {
    let s = this.val();
    switch (e) {
      case 'centre':
        return creerSommetJeu1(s.centre).representation();
      case 'voisins':
        return creerTableImmutable(s.voisins).representation();
    }
    return jamais(e);
  }
  representation(): string {
    return '(centre : ' + this.net('centre') + ' ; voisins : ' + this.net('voisins') + ')';
  }
}

export function creerNoeudJeu1Mutable(n: FormatNoeudJeu1Mutable): NoeudJeu1Mutable {
  return new NoeudJeu1EnveloppeMutable(n);
}

export function creerNoeudSansVoisinsJeu1Mutable(centre: FormatSommetJeu1): NoeudJeu1Mutable {
  return creerNoeudJeu1Mutable(creerCentreSansVoisins(centre));
}

export type FormatNoeudJeu1Immutable = FormatNoeudImmutable<FormatSommetJeu1>;
export type NoeudJeu1Immutable = NoeudImmutable<FormatSommetJeu1>;

export class NoeudJeu1EnveloppeImmutable extends NoeudEnveloppeImmutable<FormatSommetJeu1> {
  net(e: EtiquetteNoeud): string {
    let s = this.val();
    switch (e) {
      case 'centre':
        return creerSommetJeu1(s.centre).representation();
      case 'voisins':
        return creerTableImmutable(s.voisins).representation();
    }
    return jamais(e);
  }
  representation(): string {
    return '(centre : ' + this.net('centre') + ' ; voisins : ' + this.net('voisins') + ')';
  }
}

export function creerNoeudJeu1Immutable(n: FormatNoeudJeu1Immutable): NoeudJeu1Immutable {
  return new NoeudJeu1EnveloppeImmutable(n);
}

export type ReseauJeu1 = ReseauImmutable<FormatSommetJeu1>;

export type AssemblageReseauJeu1 = AssemblageReseau<FormatSommetJeu1>;

/*
Protocole : cf. structure.org
*/

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

export interface FormatMessageJeu1 extends FormatMessage, FormatIdentifiableImmutable<'message'> {
  readonly ID_emetteur: Identifiant<'utilisateur'>;
  readonly ID_origine: Identifiant<'sommet'>;
  readonly ID_destination: Identifiant<'sommet'>;
  readonly type: TypeMessageJeu1;
  readonly contenu: Mot;
  readonly date: FormatDateFr; // Emission
}

export type EtiquetteMessageJeu1 = 'ID' | 'type' | 'date' | 'ID_de' | 'ID_à' | 'contenu';

// Structure immutable
export class MessageJeu1 extends Message<FormatMessageJeu1, FormatMessageJeu1, EtiquetteMessageJeu1> {
  constructor(etat: FormatMessageJeu1) {
    super(x => x, etat);
  }

  net(e: EtiquetteMessageJeu1): string {
    let msg = this.val();
    switch (e) {
      case 'ID':
        return msg.ID.val;
      case 'type':
        return TypeMessageJeu1[msg.type];
      case 'date':
        return creerDateEnveloppe(msg.date).representation();
      case 'ID_de':
        return msg.ID_origine.val;
      case 'ID_à':
        return msg.ID_destination.val;
      case 'contenu':
        return msg.contenu.representation();
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
    return idm + ' - ' + datem + ', de ' + dem + ' à ' + am + ' (' + typem + ') - ' + cm;
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
  pourVerrouiller(
    id_emetteur: Identifiant<'utilisateur'>, 
    id_origine: Identifiant<'sommet'>): MessageJeu1 {
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

// Client : Produire un message INIT.
export function creerMessageInitial(id_emetteur: Identifiant<'utilisateur'>, id_origine: Identifiant<'sommet'>, contenu: Mot) {
  return new MessageJeu1({
    ID: messageInconnu,
    ID_emetteur: id_emetteur,
    ID_origine: id_origine,
    ID_destination: sommetInconnu,
    type: TypeMessageJeu1.INIT,
    contenu: contenu,
    date: creerDateMaintenant().val()
  });
}

export function creerMessageEnveloppe(msg: FormatMessageJeu1) {
  return new MessageJeu1(msg);
}

/* TODO gestion des erreurs


export function creerMessageErreurConnexion(emetteur: string, messageErreur: string): MessageJeu1 {
    return new MessageJeu1({
        "emetteur": emetteur,
        "destinataire": emetteur,
        "type": TypeMessageJeu1.ERREUR_CONNEXION,
        "contenu": messageErreur,
        "date": new Date()
    });
}

export function creerMessageCommunication(emetteur: string, destinataire: string, texte: string): MessageJeu1 {
    return new MessageJeu1({
        "emetteur": emetteur,
        "destinataire": destinataire,
        "type": TypeMessageJeu1.COM,
        "contenu": texte,
        "date": new Date()
    });
}

export function creerMessageRetourErreur(original: MessageJeu1, codeErreur: TypeMessageJeu1, messageErreur: string): MessageJeu1 {
    return new MessageJeu1({
        "emetteur": original.enJSON().emetteur,
        "destinataire": original.enJSON().destinataire,
        "type": codeErreur,
        "contenu": messageErreur,
        "date": original.enJSON().date
    });
}
*/

/*
Exemple de description d'une configuration - TODO à actualiser
- noeud de centre : {"id":"id-1","domaine":[BLANC, NOIR, BLANC], "population" : { "nombre":4, utilisateurs : {"titi" : ...}}}
- noeud de voisins : {"id-2":{"id":"id-2","domaine":[NOIR, NOIR, BLANC]},"id-0":{"id":"id-0","domaine":[BLANC, NOIR, NOIR]}}

*/

export interface FormatUtilisateur extends FormatIdentifiableImmutable<'utilisateur'> {
  readonly pseudo: ReadonlyArray<Deux>; // TODO ajouter d'autres caractéristiques
}

export type EtiquetteUtilisateur = 'ID' | 'nom';

export class Utilisateur extends Enveloppe<FormatUtilisateur, FormatUtilisateur, EtiquetteUtilisateur> {
  constructor(u: FormatUtilisateur) {
    super(x => x, u);
  }

  net(e: EtiquetteUtilisateur): string {
    let u = this.val();
    switch (e) {
      case 'ID':
        return u.ID.val;
      case 'nom':
        return creerMot(u.pseudo).representation();
    }
    return jamais(e);
  }

  representation(): string {
    return this.net('nom') + ' (' + this.net('ID') + ')';
  }
}

export function creerUtilisateur(u: FormatUtilisateur): Utilisateur {
  return new Utilisateur(u);
}

export type FormatPopulationLocaleImmutable = FormatTableImmutable<FormatUtilisateur>;

export type PopulationLocaleMutable = TableIdentificationMutable<'utilisateur', FormatUtilisateur, FormatUtilisateur>;

export function creerPopulationLocaleVide(): PopulationLocaleMutable {
  return creerTableIdentificationMutableVide('utilisateur', x => x);
}
export function creerPopulationLocale(pop: FormatPopulationLocaleImmutable): PopulationLocaleMutable {
  return creerTableIdentificationMutable('utilisateur', x => x, pop);
}

export function peuplerPopulationLocale(prefixe: string, noms: Mot[]): PopulationLocaleMutable {
  let identification: Identification<'utilisateur'> = creerIdentificationParCompteur(prefixe);
  let pop = creerPopulationLocaleVide();
  noms.forEach((nom: Mot, i: number, tab: Mot[]) => {
    let u: FormatUtilisateur = {
      ID: identification.identifier('utilisateur'),
      pseudo: tab[i].tableauBinaire()
    };
    pop.ajouter(u.ID, u);
  });
  return pop;
}

export interface FormatConfigurationJeu1 extends FormatConfigurationInitiale {
  readonly centre: FormatSommetJeu1;
  readonly population: FormatPopulationLocaleImmutable;
  readonly utilisateur: FormatUtilisateur;
  readonly voisins: FormatTableImmutable<FormatSommetJeu1>;
  readonly date: FormatDateFr;
}

export type EtiquetteConfigurationJeu1 = 'centre' | 'population' | 'utilisateur' | 'voisins' | 'date';

export class ConfigurationJeu1 extends Configuration<FormatConfigurationJeu1, FormatConfigurationJeu1, EtiquetteConfigurationJeu1> {
  constructor(c: FormatConfigurationJeu1) {
    super(x => x, c);
  }

  net(e: EtiquetteConfigurationJeu1): string {
    let config = this.val();
    switch (e) {
      case 'centre':
        return creerSommetJeu1(config.centre).representation();
      case 'population':
        return creerTableIdentificationImmutable('utilisateur', config.population).representation();
      case 'utilisateur':
        return creerUtilisateur(config.utilisateur).representation();
      case 'voisins':
        return creerTableIdentificationImmutable('sommet', config.voisins).representation();
      case 'date':
        return creerDateEnveloppe(config.date).representation();
    }
    return jamais(e);
  }

  representation(): string {
    let c = this.net('centre');
    let pop = this.net('population');
    let util = this.net('utilisateur');
    let v = this.net('voisins');
    let d = this.net('date');
    return '(centre : ' + c + ' ; population : ' + pop + ' ; utilisateur : ' + util + ' ; voisins : ' + v + ' ; créé à : ' + d + ')';
  }
}

export function creerConfigurationJeu1(c: FormatConfigurationJeu1) {
  return new ConfigurationJeu1(c);
}

export function composerConfigurationJeu1(
  n: FormatNoeudJeu1Immutable,
  pop: FormatPopulationLocaleImmutable,
  u: FormatUtilisateur,
  date: FormatDateFr
): ConfigurationJeu1 {
  return new ConfigurationJeu1({
    configurationInitiale: Unite.ZERO,
    centre: n.centre,
    population: pop,
    utilisateur: u,
    voisins: n.voisins,
    date: date
  });
}

export function decomposerConfiguration(
  c: ConfigurationJeu1
): [FormatNoeudJeu1Immutable, FormatPopulationLocaleImmutable, FormatUtilisateur] {
  let config = c.val();
  let centre: FormatSommetJeu1 = config.centre;
  let voisins = config.voisins;
  let n: FormatNoeudJeu1Immutable = { centre: centre, voisins: voisins };
  let pop = config.population;
  let u = config.utilisateur;
  return [n, pop, u];
}

export interface FormatErreurJeu1 extends FormatErreurRedhibitoire {
  readonly messageErreur: string;
  readonly date: FormatDateFr;
}

export type EtiquetteErreurJeu1 = 'messageErreur' | 'date';

export class ErreurJeu1 extends ErreurRedhibitoire<FormatErreurJeu1, FormatErreurJeu1, EtiquetteErreurJeu1> {
  constructor(err: FormatErreurJeu1) {
    super(x => x, err);
  }

  net(e: EtiquetteErreurJeu1): string {
    let erreur = this.val();
    switch (e) {
      case 'messageErreur':
        return erreur.messageErreur;
      case 'date':
        return creerDateEnveloppe(erreur.date).representation();
    }
    return jamais(e);
  }
  representation(): string {
    return '[' + this.net('date') + ' : ' + this.net('messageErreur') + ']';
  }
}

export function creerErreurJeu1(err: FormatErreurJeu1): ErreurJeu1 {
  return new ErreurJeu1(err);
}

export function composerErreurJeu1(msg: string, date: FormatDateFr): ErreurJeu1 {
  return new ErreurJeu1({
    erreurRedhibitoire: Unite.ZERO,
    messageErreur: msg,
    date: date
  });
}

export function creerAnneauJeu1(domaines: Mot[]): ReseauJeu1 {
  let assembleur: AssemblageReseauJeu1 = creerAssemblageReseauEnAnneau(domaines.length, creerNoeudSansVoisinsJeu1Mutable);
  let identification: Identification<'sommet'> = creerIdentificationParCompteur('DOM-');
  domaines.forEach((dom: Mot, i: number, tab: Mot[]) => {
    let s: FormatSommetJeu1 = {
      ID: identification.identifier('sommet'),
      domaine: tab[i].tableauBinaire()
    };
    assembleur.ajouterSommet(s);
  });
  return assembleur.assembler();
}

class TableUtilisateurs extends TableIdentificationMutable<'utilisateur', FormatUtilisateur, FormatUtilisateur> {
  constructor() {
    super('utilisateur', x => x);
  }
}

export class PopulationParDomaineMutable extends TableIdentificationMutable<'sommet', TableUtilisateurs, FormatPopulationLocaleImmutable> {
  constructor() {
    super('sommet', (t: TableUtilisateurs) => t.val());
  }

  contientUtilisateur(ID_dom: Identifiant<'sommet'>, ID_util: Identifiant<'utilisateur'>): boolean {
    if (!this.contient(ID_dom)) {
      return false;
    }
    return this.valeurEtat(ID_dom).contient(ID_util);
  }

  utilisateur(ID_dom: Identifiant<'sommet'>, ID_util: Identifiant<'utilisateur'>): FormatUtilisateur {
    return this.valeurEtat(ID_dom).valeur(ID_util);
  }

  ajouterDomaine(ID_dom: Identifiant<'sommet'>) {
    this.ajouter(ID_dom, new TableUtilisateurs());
  }

  ajouterUtilisateur(ID_dom: Identifiant<'sommet'>, u: FormatUtilisateur) {
    this.valeurEtat(ID_dom).ajouter(u.ID, u);
  }

  retirerUtilisateur(ID_dom: Identifiant<'sommet'>, ID_util: Identifiant<'utilisateur'>) {
    this.valeurEtat(ID_dom).retirer(ID_util);
  }

  selectionnerUtilisateur(): [Identifiant<'sommet'>, Identifiant<'utilisateur'>] {
    let ID_dom = this.selectionCleSuivantCritereEtat(pop => !pop.estVide());
    let ID_util = this.valeurEtat(ID_dom).selectionCle();
    return [ID_dom, ID_util];
  }
}

export function creerVidePopulationParDomaine() {
  return new PopulationParDomaineMutable();
}

export function assemblerPopulationParDomaine(reseau: ReseauJeu1, noms: Mot[]): PopulationParDomaineMutable {
  let popDom = creerVidePopulationParDomaine();
  reseau.iterer((ID_dom, n) => {
    popDom.ajouterDomaine(ID_dom);
    let popLoc = peuplerPopulationLocale('UTIL-' + ID_dom.val + '-', noms);
    popLoc.iterer((ID_util, u) => {
      popDom.ajouterUtilisateur(ID_dom, u);
    });
  });
  return popDom;
}

export type TableMutableUtilisateursParMessageParDomaine = TableIdentificationMutable<
  'sommet',
  TableIdentificationMutable<'message', Identifiant<'utilisateur'>, Identifiant<'utilisateur'>>,
  TableIdentificationMutable<'message', Identifiant<'utilisateur'>, Identifiant<'utilisateur'>>
>;

export function creerTableMutableUtilisateurParMessageParDomaine(): TableMutableUtilisateursParMessageParDomaine {
  return creerTableIdentificationMutableVide('sommet', x => x);
}
