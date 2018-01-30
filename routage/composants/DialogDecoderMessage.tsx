import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {MessageCases} from './MessageCases';
import { MessageJeu1 } from '../commun/communRoutage'
import { Mot, creerMot} from '../../bibliotheque/binaire';

interface messageProps {
  validation: (contenu: Mot, msg: MessageJeu1) => void,
  message: MessageJeu1
}
/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export class DialogDecoderMessage extends React.Component<messageProps, any> {
  state = {
    open: false,
    text: ''
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  valider = () => {
    this.handleClose();
    this.props.validation(creerMot(this.state.text.split('').map((x) => parseInt(x))), this.props.message); 
  }

  message = (event : any) => {
    this.setState({ text: event.target.value });
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
        secondary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <FlatButton
            label="Decoder"
            primary={true}
            onClick={this.handleOpen}
        />
        <Dialog
          title="Decoder"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Quel est le message ? 
          <br/>
          ex : 001001
          <br />
          <MessageCases message={this.props.message.val().contenu} locked={true}/>
          <TextField
            hintText="Decode ici le message"
            onChange={this.message}
          />
        </Dialog>
      </div>
    );
  }
}