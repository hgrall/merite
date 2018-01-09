import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { BarreEnvoi } from './BarreEnvoi';

interface messageProps {
  validation: () => void
}
/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export class DialogTransmettreMessage extends React.Component<messageProps, any> {
  state = {
    open: false,
    handedOver: false,
    lock: false,
  };


  //verouiller
  handleLock = () => {
    this.setState({ lock: true });
  };

  //deverouiller
  handleUnlock = () => {
    this.setState({ lock: false });
  };


  //transmission du message + deverouillage automatique 
  handleHandover = () => {
    this.setState({ open: true , lock: false});
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  valider = () => {
    this.handleClose();
    this.props.validation();
  }

  render() {
    const actions = [
      <FlatButton
        label="Valider"
        primary={true}
        keyboardFocused={true}
        onClick={this.valider}
      />,
      <FlatButton
        label="Annuler"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <FlatButton
          label="Transmettre"
          primary={true}
          onClick={this.handleHandover}
        />
        <Dialog
          title="Transmission du message"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          A qui voulez vous le transmettre ?
          <br />
          <BarreEnvoi />
        </Dialog>
      </div>
    );
  }
}