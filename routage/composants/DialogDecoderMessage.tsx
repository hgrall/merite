import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

interface messageProps {
    validation:() => void
  }
/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export class DialogDecoderMessage extends React.Component<messageProps, any> {
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
          <br />
          <TextField
            hintText="Hint Text"
          />
        </Dialog>
      </div>
    );
  }
}