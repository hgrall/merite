import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {EnvoyePar} from './EnvoyePar';
import {MessageCases} from './MessageCases';
import {BarreEnvoi} from './BarreEnvoi'; 
import { Identifiant } from '../../bibliotheque/types/identifiant';
import { creerMot } from '../../bibliotheque/binaire'
import { Deux } from '../../bibliotheque/types/mutable';


const styles = {
  container: {
    alignSelf: 'flex-end' as 'flex-end',
    margin: '20px'
  }
}

interface MessageProps {
  envoyerMessage: (dest: Identifiant<'sommet'>) => void,
  voisinFst: Identifiant<'sommet'>,
  voisinSnd: Identifiant<'sommet'>
}

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export class NewMessage extends React.Component<MessageProps, any> {

  state = {
    open: false,
    message: creerMot([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
  };

  handleOpen = () => {
    this.setState({
      open: true,
      message: creerMot([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      message: this.state.message
    });
  };

  changeColor = (n:number) => {
    let message = this.state.message;
    let tab: Array<Deux> = [];
    for (let i of this.state.message['structure'].tableau) {
      if (i === n) {
        if (i === Deux.UN) {
          tab.push(Deux.ZERO)
        } else {
          tab.push(Deux.UN)
        }
      } else {
        tab.push(i)
      }
    }
    tab[n] = (tab[n] === 0)? 1 : 0;
    this.setState({
      open: true,
      message: creerMot(tab)
    })
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
          Code ton message en cliquant sur les cases !
          <MessageCases message={this.state.message} changeColor={this.changeColor} locked={false}/>
          <br /> 
          <BarreEnvoi envoyerMessage={this.props.envoyerMessage} voisinFst={this.props.voisinFst} voisinSnd={this.props.voisinSnd}/>
        </Dialog>
      </div>
    );
  }

  
}