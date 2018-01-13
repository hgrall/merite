import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {MessageCases} from './MessageCases';
import {DialogDecoderMessage} from './DialogDecoderMessage';
import {DialogTransmettreMessage} from './DialogTransmettreMessage';
import Create from 'material-ui/svg-icons/content/create';
import { MessageJeu1, TypeMessageJeu1 } from '../commun/communRoutage'
import {EnvoyePar} from './EnvoyePar';
import { Identifiant } from '../../bibliotheque/types/identifiant';
import { Mot } from '../../bibliotheque/binaire'

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */

const styles = {
  btn: {
    margin: '10px',
    alignSelf: "flex-end" as "flex-end"
  },
  actions: {
    display: 'flex' as 'flex',
    justifyContent: 'space-aroud' as 'space-around'
  },
  title: {
    display: 'flex' as 'flex',
    justifyContent: "center" as 'center',
  }
};

interface MessageProps {
  message: MessageJeu1,
  voisinFst: Identifiant<'sommet'>,
  voisinSnd: Identifiant<'sommet'>,
  envoyerMessage: (dest: Identifiant<'sommet'>, contenu: Mot) => void,
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
      <DialogDecoderMessage message={this.props.message} validation={this.handleClose}/>,
      <DialogTransmettreMessage message={this.props.message} 
        validation={this.handleClose} 
        voisinFst={this.props.voisinFst} 
        voisinSnd={this.props.voisinSnd}
        envoyerMessage={this.props.envoyerMessage}/>,
      <FlatButton
        label="Jeter"
        secondary={true}
        onClick={this.handleClose}
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
        <RaisedButton 
          label="Traiter" 
          icon={<Create/>}
          style={styles.btn}
          onClick={this.handleOpen} 
          disabled = {this.props.message.val().type === TypeMessageJeu1.VERROU}
          primary={true}/>
        <Dialog
          title="Traiter le message"
          actions={actions}
          actionsContainerStyle={styles.actions}
          modal={false}
          titleStyle={styles.title}
          onRequestClose={this.handleClose}
          open={this.state.open}
        >
          <EnvoyePar source={this.props.message.val().ID_emetteur.val}/>
          <MessageCases message={this.props.message.val().contenu} locked={true}/>

          Si tu penses que le message est pour toi, decode le.
          Sinon, transmet le a la personne concernee.
          Si le message est erronee, mets le a la poubelle.
        </Dialog>
      </div>
    );
  }
}