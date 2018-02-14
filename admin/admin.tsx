import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanalClient, creerCanalClient } from '../bibliotheque/client';
import { FormatErreurJeu1, FormatConfigurationJeu1, messageAdmin, FormatMessageJeu1, EtiquetteMessageJeu1, MessageJeu1, TypeMessageJeu1 } from '../routage/commun/communRoutage'
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
    appTitle: {
        display: 'flex' as 'flex',
        justifyContent: 'center' as 'center'
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
        this.config = true; 
    }

    componentWillMount(): void {
        console.log('* Initialisation après montage du corps');

        // Creation canal de communication 
        this.canal = creerCanalClient(this.adresseServeur);

        // Traitement des messages
        this.canal.enregistrerTraitementMessageRecu((m:FormatMessageJeu1) => {
            let msg = new MessageJeu1(m);
        
            switch (m.type) {
                case TypeMessageJeu1.NONCONF:
                    this.config = false; 
                    break;
                case TypeMessageJeu1.STATISTIQUES: 
                    this.config = true; 
                    // set the state statistiques
            }
        });

        this.canal.enregistrerTraitementAdmin();

        console.log('- du traitement de la configuration');    
    }

    public render() {
        if (this.config) {
            return (
                <div style={styles.container}>
                    <AppBar title="Admin" titleStyle={styles.appTitle} showMenuIconButton={false} />
                    Statistique Component 
                </div>
            );
        }
        else {
            return (
                <div style={styles.container}>
                    <AppBar title="Admin" titleStyle={styles.appTitle} showMenuIconButton={false} />
                    Change configuration Component 
                </div>
            );
        }
    }
}