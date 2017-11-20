// Types formats JSON : FormatX par convention
// Il est recommandé de choisir le plus possible des formats immutables.
// Format ::= { (readonly etiquette : Format)*} 
//          | { (readonly etiquette : Format)*, (etiquette : Format)+, mutable : Unite} 
//          | { readonly table: { readonly [cle: string]: T }}
//          | { readonly table: { [cle: string]: T }}
//          | { table: { readonly [cle: string]: T }, mutable : Unite}
//          | { table: { [cle: string]: T }, mutable : Unite}

// Modèle générique d'une enveloppe d'un état
//
// TEX : type de sortie immutable (souvent format JSON en lecture seulement)
// TIN : type d'entrée pour l'état en format JSON ou non (mutable ou non, confiné si mutable)
// E : étiquettes utiles pour une représentation (cf. méthode net)
//
// La différence entre TIN et TEX permet de gérer les effets de bord sur l'état, souvent au format JSON.
// Une fonction de conversion de TIN vers TEX est requise.
// Toute méthode ayant une occurrence positive de TIN est protected. En effet, elle peut permettre d'obtenir l'état mutable
// et de réaliser un effet de bord sur l'état s'il est mutable.
// Cette classe abstraite doit être étedue ;
// - implémentation de net et représenter,
// - extension par des méthodes modifiant ou observant l'état.
// Sérialisation
// C'est le type interne TIN qui est utilisé pour la sérilisation (via la méthode brut()). 
// En conséquence, un format sérialisable doit être utilisé : types primitifs, 
// et comme contructeurs de types les tableaux et les structures indexées.

// Enveloppe de l'état qui est donc partagé.
export abstract class Enveloppe<TIN, TEX, E extends string> {
    private structure: TIN;
    protected etatEnVal: (x: TIN) => TEX;
    constructor(etatEnVal: (x: TIN) => TEX, etat: TIN) {
        this.structure = etat;
        this.etatEnVal = etatEnVal;
    }
    protected etat(): TIN {
        return this.structure;
    }
    val(): TEX {
        return this.etatEnVal(this.structure);
    }
    // transformation brute du json de type TIN en string
    brut(): string {
        return JSON.stringify(this.structure);
    };
    // représentation dans un json simplifié
    abstract net(etiquette: E): string;
    abstract representation(): string;
}
