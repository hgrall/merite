import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanalClient, creerCanalClient } from '../bibliotheque/client';
import { FormatErreurJeu1, FormatConfigurationJeu1, messageAdmin, FormatMessageJeu1, EtiquetteMessageJeu1 } from '../routage/commun/communRoutage'
// Material-UI
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { hote, port2 } from '../routage/commun/communRoutage';
import { FormatConfigurationChat } from '../chat/commun/configurationChat';
import { RaisedButton } from 'material-ui/RaisedButton';

const styles = {
    container: {
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'flex-start' as 'flex-start',
        alignContent: 'center' as 'center',
        position: 'absolute' as 'absolute',
        left: '0',
        right: '0'
    },
    paper: {
        flexShrink: 1,
        flexGrow: 1,
        alignSelf: 'stretch' as 'stretch',
        margin: '30px',
        display: 'flex' as 'flex',
        flexDirection: 'column' as 'column',
        alignContent: 'center' as 'center'
    },
    title: {
        display: 'flex' as 'flex',
        margin: '30px',
        justifyContent: 'center' as 'center'
    },
    appTitle: {
        display: 'flex' as 'flex',
        justifyContent: 'center' as 'center'
    },
    message: {
        alignSelf: 'center' as 'center'
    },
    dom: {
        display: "flex" as 'flex',
        sflexWrap: "wrap" as 'wrap',
    }
};

type CanalAdmin = CanalClient<FormatErreurJeu1, FormatConfigurationJeu1, FormatMessageJeu1, FormatMessageJeu1, EtiquetteMessageJeu1>;


export class Admin extends React.Component<any, any> {
    private adresseServeur: string;
    private canal: CanalAdmin;
    private messageErreur: string;
    private config : boolean;

    constructor(props: any) {
        super(props);
        this.adresseServeur = hote + ':' + port2;
        this.messageErreur = 'Aucune erreur';
    }


    componentWillMount(): void {
        console.log('* Initialisation après montage du corps');

        // Creation canal de communication 
        this.canal = creerCanalClient(this.adresseServeur);

        //Envoie d'une requete admin au serveur

//        
        // Traitement des messages
        this.canal.enregistrerTraitementMessageRecu(() => {
        });

        this.canal.enregistrerTraitementAdmin();

        console.log('- du traitement de la configuration');
        this.canal.enregistrerTraitementConfigurationRecue((config: FormatConfigurationJeu1) => {
            if (config) {
                this.config = true; 
                return true;
            } else {
                this.config = false;
                return false; 
            }
        });
        // this.canal.envoyerMessage(messageAdmin());
    
    }

    componentDidMount(): void {
        
       //    this.canal.envoyerMessage(messageAdmin());

    }

    public render() {
        return (
            <div style={styles.container}>
                <AppBar title="Admin" titleStyle={styles.appTitle} showMenuIconButton={false} />
                SI Réseau non constitué
                Constitution du reseau : 
                - Choix du nombre de domaine (min 3)
                - Choix du nombre d'utilisateurs par domaine (min 1)

                SI NON Reseau constitué
                Statistiques : tableau  
                
            </div>
        );
    }
}