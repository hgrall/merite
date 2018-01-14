import {
    ReseauImmutable
} from "../../bibliotheque/communication/creerReseau";

import {Deux} from "../../bibliotheque/types/mutable"
import {FormatIdentifiableImmutable} from "../../bibliotheque/types/identifiant"
export interface FormatSommetJeuRoutage extends FormatIdentifiableImmutable<'sommet'> {
    readonly domaine: ReadonlyArray<Deux>
}

export type ReseauJeuRoutage = ReseauImmutable<FormatSommetJeuRoutage>;