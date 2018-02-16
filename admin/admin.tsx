import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanalClient, creerCanalClient } from '../bibliotheque/client';
import { hote, port2, FormatErreurJeu1, FormatConfigurationJeu1, messageAdmin, FormatMessageJeu1, EtiquetteMessageJeu1, MessageJeu1, TypeMessageJeu1 } from '../routage/commun/communRoutage'
import { FormatConfigurationChat } from '../chat/commun/configurationChat';
// Material-UI
import Statistiques from '../routage/composants/Statistiques'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { RaisedButton } from 'material-ui/RaisedButton';

//Fonction clientes '../routage/commun/communRoutage'
import{statistiques}from '../routage/client/clientRoutage'


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

interface AdminState{
    message : Array<MessageJeu1>;
}


export class Admin extends React.Component<any, any> {
    private adresseServeur: string;
    private canal: CanalAdmin;
    private messageErreur: string;
    private config : boolean;
    private messages : Array<MessageJeu1>;

    state: AdminState = {
        message: []
    }

    constructor(props: any) {
        super(props);
        this.adresseServeur = hote + ':' + port2;
        this.messageErreur = 'Aucune erreur';
        this.config = false; 
        this.messages=[];
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
                console.log("TYPE STATISTIQUE");
                    this.config = true; 
                    this.state.message.push(msg);
                    this.setState({
                        message: this.state.message,
                    })
                    //this.messages.push(msg);
                    // set the state statistiques
            }
            //console.log("MESSAGES  traitement  : "+this.messages[0])
            /*if(this.messages[this.messages.length-1].val().stats!= undefined){
                console.log("Stats : "+ this.messages[this.messages.length-1].val().stats);
            }else{
                console.log("No stats");
            }*/

            if(this.state.message[this.state.message.length-1].val().stats!= undefined){
                console.log("Stats : "+ this.state.message[this.state.message.length-1].val().stats);
            }else{
                console.log("No stats");
            }
            
        });

        this.canal.enregistrerTraitementAdmin();
        console.log("MESSAGES  traitement admin  : "+this.state.message[0])

        console.log('- du traitement de la configuration');  
        
        //demande stats
        //statistiques(this.canal, this.)
    }

    public render() {
        if (this.config) {
            return (
                <div style={styles.container}>
                    <AppBar title="Admin" titleStyle={styles.appTitle} showMenuIconButton={false} />
                    Statistique Component  <br/>
                   <Statistiques message = {this.state.message[0]} />
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