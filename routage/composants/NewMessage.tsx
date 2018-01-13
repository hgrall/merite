import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {EnvoyePar} from './EnvoyePar';
import {MessageCases} from './MessageCases';
import {BarreEnvoi} from './BarreEnvoi'; 
import { Identifiant } from '../../bibliotheque/types/identifiant';


const styles = {
  container: {
    alignSelf: 'flex-end' as 'flex-end',
    margin: '20px'
  }
}

interface MessageProps {
  envoyerMessage: () => void,
  voisinFst: Identifiant<'sommet'>,
  voisinSnd: Identifiant<'sommet'>
}

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export class NewMessage extends React.Component<MessageProps, any> {

  state = {
    open: false,
    message: {
      corps : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      locked : false,
      source : ''
    }
  };

  handleOpen = () => {
    this.setState({
      open: true,
      message: {
        corps : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        locked : false,
        source : ''
      }
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
    message.corps[n] = (this.state.message.corps[n] === 0)? 1 : 0;
    this.setState({
      open: true,
      message: message
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
          {/* <MessageCases message={this.state.message} changeColor={this.changeColor}/> */}
          <br /> 
          <BarreEnvoi envoyerMessage={this.props.envoyerMessage} voisinFst={this.props.voisinFst} voisinSnd={this.props.voisinSnd}/>
        </Dialog>
      </div>
    );
  }

  
}