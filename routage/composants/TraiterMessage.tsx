import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {MessageCases} from './MessageCases';
import {DialogDecoderMessage} from './DialogDecoderMessage';
import {DialogTransmettreMessage} from './DialogTransmettreMessage';
import Add from 'material-ui/svg-icons/content/add';
import { Message } from './MessageBox';
/**
 * A modal dialog can only be closed by selecting one of the actions.
 */

const styles = {
  btn: {
    margin: '10px',
    alignSelf: "flex-end" as "flex-end"
  }
};

interface MessageProps {
  message: Message
}

export class TraiterMessage extends React.Component<MessageProps, any> {
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
      secondary={true}
      onClick={this.handleClose}
    />
    ];

    return (
      <div>
        <RaisedButton 
          label="Traiter" 
          icon={<Add/>}
          style={styles.btn}
          onClick={this.handleOpen} 
          disabled = {this.props.message.locked}
          primary={true}/>
        <Dialog
          title="Traiter le message"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
            <MessageCases message={this.props.message}/>
          Si tu penses que le message est pour toi, decode le.
          Sinon, transmet le a la personne concernee.
          Si le message est erronee, mets le a la poubelle.
        </Dialog>
      </div>
    );
  }
}