import { Individu, Message } from '../../chat/client/typesInterface';
import { Domaine } from '../../chat/serveur/domaine'

export class RoutageService {

    public utilisateur: Individu;


    public getDomainesVoisins(): Domaine[] {
        return [];
    }

    public getUtilisateursVoisins(): Individu[] {
        return [];
    }

    //cf bloc configuration message dans ServuerJeu1
        //cf fct diffuser
    public transmettreMessageADomaine(message: Message, domaine: Domaine) {
        console.log("Transmission du message au domaine :", domaine.name);
    }
      
    public transmettreMessageAUtilisateur(message: Message, utilisateur: Individu) {
        console.log("Transmission du message à l'utilisateur :", utilisateur.nom);
    }

    public creerMessage(contenu: string, domaineDestinataire: Domaine, utilisateurDestinataire: string) {
        return null;
    }

    public decoderMessage(message: Message): string[] {
        return [message.destinataire.nom, message.contenu]
    }

    public jeterMessage(message: Message): void {
        console.log('Destruction du message');
    }

}