/*
- réseau ::= noeud*
- noeud ::= (sommet, sommet*)
- sommet ::= {identifiant, ...}

- Serveur : agrégation d'un réseau
- Client : agrégation d'un noeud du réseau 

- Remarque : compatibilité ES3 pour les objets.

- Sorte: type d'identifiant (sommet par exemple)

- réseau ::= noeud*
*/
import {
    Unite
} from "../types/mutable"
import {
    Enveloppe
} from "../types/enveloppe"
import {
    FormatIdentifiableImmutable, Identifiant
} from "../types/identifiant"

// Cette interface pourrait être complétée à l'avenir.
export interface FormatConfigurationInitiale {
    readonly "configurationInitiale": Unite
};
// Cette interface pourrait être complétée à l'avenir.
export interface FormatErreurRedhibitoire {
    readonly "erreurRedhibitoire": Unite
}
// Cette interface pourrait être complétée à l'avenir.
// Clés "configurationInitiale" et "erreurRedhibitoire" interdites dans les messages
export interface FormatMessage { }

export abstract class Message<
    FMIN extends FormatMessage,
    FMEX extends FormatMessage,
    EM extends string
    >
    extends Enveloppe<FMIN, FMEX, EM> {

}

export abstract class Configuration<
    FCIN extends FormatConfigurationInitiale,
    FCEX extends FormatConfigurationInitiale,
    EC extends string
    >
    extends Enveloppe<FCIN, FCEX, EC> {

}

export abstract class ErreurRedhibitoire<
    FEIN extends FormatErreurRedhibitoire,
    FEEX extends FormatErreurRedhibitoire,
    EE extends string
    >
    extends Enveloppe<FEIN, FEEX, EE> {

}

// La sorte pour les identifiants de sommets est 'sommet'. 
export abstract class Sommet<
    TIN extends FormatIdentifiableImmutable<'sommet'>,
    TEX extends FormatIdentifiableImmutable<'sommet'>,
    E extends string
    >
    extends Enveloppe<TIN, TEX, E> {
}