import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {EnvoyePar} from './EnvoyePar';
import {MessageCases} from './MessageCases';
import {BarreEnvoi} from './BarreEnvoi'; 
import { Identifiant } from '../../bibliotheque/types/identifiant';
import { Deux } from '../../bibliotheque/types/mutable';
import { FormatSommetJeu1, Consigne } from '../commun/communRoutage';
import { ConsigneDom } from './Consigne';
import { NOMBRE_DE_DOMAINES, UTILISATEURS_PAR_DOMAINE, NOMBRE_UTILISATEURS_PAR_DOMAINE } from '../config';
import { binaire, Mot, motAleatoire, creerMot , tableauBinaireAleatoire} from '../../bibliotheque/binaire';

const styles = {
  container: {
    alignSelf: 'flex-end' as 'flex-end',
    margin: '20px'
  }
}

interface MessageProps {
  envoyerMessage: (dest: Identifiant<'sommet'>, contenu: Mot) => void,
  voisinFst: FormatSommetJeu1,
  voisinSnd: FormatSommetJeu1, 
  consigne: Consigne
}

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export class NewMessage extends React.Component<MessageProps, any> {
  tailleMot = 12 
  + binaire(NOMBRE_DE_DOMAINES).tableauBinaire().length
  + binaire(UTILISATEURS_PAR_DOMAINE).tableauBinaire().length;

  state = {
    open: false,
   // message: creerMot([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    message: creerMot(Array.apply(null, Array(this.tailleMot)).map(Number.prototype.valueOf,0))
  };

  handleOpen = () => {
    this.setState({
      open: true,
     // message: creerMot([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
     message: creerMot(Array.apply(null, Array(this.tailleMot)).map(Number.prototype.valueOf,0))
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      message: this.state.message
    });
  };

  changeColor = (n:number) => {
    let tab: Array<Deux> = [];
    // recopie du tableau
    for (let i of this.state.message['structure'].tableau) {
      tab.push(i);
    }
    // modification de la case correspondante
    tab[n] = (this.state.message['structure'].tableau[n] === 0)? 1 : 0;
    this.setState({
      open: true,
      message: creerMot(tab)
    })
  }

  envoyerEtFermerMessage = (dest: Identifiant<'sommet'>, contenu: Mot) => {
    this.props.envoyerMessage(dest, contenu);
    this.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label="Annuler"
        secondary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ];
    
    return (
      <div style={styles.container}>
        <RaisedButton
            label="Nouveau message"
            primary={true}
            onClick={this.handleOpen}
        />
        <Dialog
          title="Nouveau Message"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <ConsigneDom consigne={this.props.consigne}/>
          Code ton message en cliquant sur les cases !
          <MessageCases message={this.state.message} changeColor={this.changeColor} locked={false}/>
          <br /> 
          <BarreEnvoi envoyerMessage={this.envoyerEtFermerMessage} voisinFst={this.props.voisinFst} voisinSnd={this.props.voisinSnd} contenu={this.state.message}/>
        </Dialog>
      </div>
    );
  }
}