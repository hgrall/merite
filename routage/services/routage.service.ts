import { Individu } from '../../chat/client/typesInterface';
import { Domaine } from '../../chat/serveur/domaine'

export class RoutageService {

    public utilisateur: Individu;

    // getDomainesVoisins(Utilisateur | Domaine): Domaine[]
    // getUtilisateursVoisins(Utilisateurs): Utilisateur[] #sûrement déjà fait
    // transmettreMessageADomaine(Message, Domaine): void
    // transmettreMessageAVoisin(Message, Utilisateur): void
    // creerMessage(contenu, idUtilisateur, Domaine(idUtilisateur)): void
    // decoderMessage(Message): contenu
    // jeterMessage(Message): void

    /**
     * getDomainesVoisins
     */
    public getDomainesVoisins(): Domaine[] {
        return [];
    }

    

}