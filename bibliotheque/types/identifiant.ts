import { Mutable } from "./mutable"
import { Enveloppe } from "./enveloppe"
import { FormatTableImmutable, FormatTableMutable, EtiquetteTable, FABRIQUE_TABLE, conversionFormatTable } from "./table"

/* ***********************************************************************************************
 * Identifiant
// à utiliser avec Sorte = 'sorte à identifier' (chaine singleton)
// Usage : 
// - let id :Identifiant<'sorte'>
// - lecture : id.sorte de type string
// - création :  { sorte : "identite"} 
// Permet de typer les identifiants par sorte.
// Les identifiants sont toujours accéder via un champ nommé ID ou ID_x.
*/
export type Identifiant<Sorte extends string> = {
    readonly val: string;
    readonly sorte: Sorte;
}

export interface FormatIdentifiableMutable<Sorte extends string> extends Mutable {
    ID: Identifiant<Sorte>; // en majuscule par exception
}

export interface FormatIdentifiableImmutable<Sorte extends string> {
    readonly ID: Identifiant<Sorte>; // en majuscule par exception
}

export interface Identification<Sorte extends string> {
    identifier(s: Sorte): Identifiant<Sorte>;
}

// L'identification est choisi par compteur, commencant à 0 et s'incrementant à chaque appel
class IdentificationParCompteur<Sorte extends string>
    implements Identification<Sorte> {
    private compteur: number;
    constructor(private prefixe: string) {
        this.compteur = 0;
    }
    identifier(s: Sorte): Identifiant<Sorte> {
        let id: string = this.prefixe + this.compteur;
        this.compteur++;
        return creerIdentifiant(s, id);
    }

}

export function creerIdentificationParCompteur<
    Sorte extends string
    >(prefixe: string)
    : Identification<Sorte> {
    return new IdentificationParCompteur(prefixe);
}

export function creerIdentifiant<Sorte extends string>(
    s: Sorte, cle: string
): Identifiant<Sorte> {
    return {
        val: cle,
        sorte: s
    };
}

// fonction equals pour les valeurs des identifiants 
export function egaliteIdentifiant<Sorte extends string>(
    id1: Identifiant<Sorte>,
    id2: Identifiant<Sorte>
): boolean {
    return id1.val === id2.val;
}
