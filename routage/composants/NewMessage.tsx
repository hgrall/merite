import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {MessageCases} from './MessageCases';
import {DialogDecoderMessage} from './DialogDecoderMessage';
import {DialogTransmettreMessage} from './DialogTransmettreMessage';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export class NewMessage extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <DialogDecoderMessage validation={this.handleClose}/>,
      <DialogTransmettreMessage validation={this.handleClose}/>,
      <FlatButton
      label="Jeter"
      primary={true}
      onClick={this.handleClose}
    />
    ];

    return (
      <div>
        <RaisedButton label="Modal Dialog" onClick={this.handleOpen} />
        <Dialog
          title="Tu as recu un nouveau message"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
            <MessageCases/>
          Si tu penses que le message est pour toi, decode le.
          Sinon, transmet le a la personne concernee.
          Si le message est erronee, mets le a la poubelle.
        </Dialog>
      </div>
    );
  }
}