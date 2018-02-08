import * as React from 'react';
import * as ReactDOM from 'react-dom';


// Material-UI
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

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


export class Admin extends React.Component<any, any> {
    
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