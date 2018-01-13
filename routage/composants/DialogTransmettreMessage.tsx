import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { MessageJeu1 } from '../commun/communRoutage'
import {EnvoyePar} from './EnvoyePar';
import {MessageCases} from './MessageCases';
import {BarreEnvoi} from './BarreEnvoi'; 

interface messageProps {
    validation:() => void,
    message: MessageJeu1
  }
/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export class DialogTransmettreMessage extends React.Component<messageProps, any> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  valider = () => {
    this.handleClose();
    this.props.validation();  
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
      <div>
        <FlatButton
            label="Transmettre"
            primary={true}
            onClick={this.handleOpen}
        />
        <Dialog
          title="Transmission du message"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          A qui veux tu transmettre le message ? 
          <EnvoyePar source={this.props.message.val().ID_emetteur.val}/>
          <MessageCases message={this.props.message}/>
          <br />
          <BarreEnvoi/>
        </Dialog>
      </div>
    );
  }
}