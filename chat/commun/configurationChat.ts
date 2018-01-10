
import { FormatDateFr, creerDateEnveloppe } from "../../bibliotheque/types/date";
import { Unite } from "../../bibliotheque/types/mutable";
import { creerTableImmutable, FormatTableImmutable } from "../../bibliotheque/types/table";
import {FormatConfigurationInitiale, Configuration} from "../../bibliotheque/communication/communication";
import { jamais } from "../../bibliotheque/outils";
import {FormatSommetChat, creerSommetChat} from "./sommetChat";
import {FormatNoeudChatImmutable} from "./noeudChat"

/*
Configuration du chat
Exemple de description d'une configuration
- noeud de centre : {"id":"id-1","pseudo":"toto"}
- noeud de voisins : {"id-2":{"id":"id-2","pseudo":"coco"},"id-0":{"id":"id-0","pseudo":"titi"}}
*/

export interface FormatConfigurationChat extends FormatConfigurationInitiale {
    readonly "centre": FormatSommetChat,
    readonly "voisins": FormatTableImmutable<FormatSommetChat>,
    readonly "date": FormatDateFr
}

export type EtiquetteConfigurationChat = 'centre' | 'voisins' | 'date';

export class ConfigurationChat
    extends Configuration<
    FormatConfigurationChat,
    FormatConfigurationChat,
    EtiquetteConfigurationChat> {

    constructor(c: FormatConfigurationChat) {
        super((x) => x, c);
    }

    // renvoie un string correspondant a la valeur du parametre appelé
    net(e: EtiquetteConfigurationChat): string {
        let config = this.val();
        switch (e) {
            case 'centre': return creerSommetChat(config.centre).representation();
            case 'voisins': return creerTableImmutable(config.voisins).representation();
            case 'date': return creerDateEnveloppe(config.date).representation();
        }
        return jamais(e);
    }

    // Ecrit la representation du noeud central et de ses voisins 
    representation(): string {
        let cc = this.net('centre');
        let vc = this.net('voisins');
        let dc = this.net('date');
        return "(centre : " + cc + " ; voisins : " + vc + ") créée " + dc;
    }
}

//creation d'une configuration chat à partir du format
export function creerConfigurationChat(c: FormatConfigurationChat) {
    return new ConfigurationChat(c);
}

// compose la configuration a partir du noeud du chat et de la date
export function composerConfigurationChat(
    n: FormatNoeudChatImmutable, date: FormatDateFr)
    : ConfigurationChat {
    return new ConfigurationChat({
        "configurationInitiale": Unite.ZERO,
        "centre": n.centre,
        "voisins": n.voisins,
        "date": date
    });
}

// recupere le format du noeud à partir de la configuration
export function decomposerConfiguration(c: ConfigurationChat)
    : FormatNoeudChatImmutable {
    let centre: FormatSommetChat = c.val().centre;
    let voisins = c.val().voisins;
    return { "centre": centre, "voisins": voisins };
}