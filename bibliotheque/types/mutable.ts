import { normalisationNombre, jamais } from "../outils";

// Les enum sont des sous-types de number.
export enum Unite { ZERO }
export enum Deux {
    ZERO,
    UN
}

// Problème / readonly properties
// Cf. https://github.com/Microsoft/TypeScript/issues/13347
// Interface with readonly property is assignable to interface with mutable property.
// Remède : par défaut, les champs sont en lecture seulement. Lorsque ce n'est pas le cas, on rajoute 
//   un champ (mutable : Unite). Lorsqu'il s'agit de champs indexés, on introduit un champ table contenant 
//   la structure. Voir FormatTableMutable ci-dessous.
// On manipule ces structures indirectement via des modules 
//   pour limiter les conversions non sûres à ces modules. Voir les modules ci-dessous.

export interface Mutable {
    mutable: Unite
}

