import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { MessageJeu1, FormatSommetJeu1 } from '../commun/communRoutage'
import {EnvoyePar} from './EnvoyePar';
import {MessageCases} from './MessageCases';
import {BarreEnvoi} from './BarreEnvoi'; 
import { Identifiant } from '../../bibliotheque/types/identifiant'
import { Mot } from '../../bibliotheque/binaire';

interface messageProps {
  message: MessageJeu1,
  voisinFst: FormatSommetJeu1,
  voisinSnd: FormatSommetJeu1,
  envoyerMessage: (dest: Identifiant<'sommet'>, id: Identifiant<'message'>, contenu: Mot) => void,
  }

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

  envoyerMessage = (dest: Identifiant<'sommet'>, contenu: Mot) => {
    this.props.envoyerMessage(dest, this.props.message.val().ID, contenu);
    this.handleClose();
  }

  source = () => {
    if (this.props.message.val().ID_origine.val == this.props.voisinFst.ID.val ) {
      return this.props.voisinFst;
    }
    return this.props.voisinSnd;
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
          <EnvoyePar source={this.source()}/>
          <MessageCases message={this.props.message.val().contenu} locked={true}/>
          <br />
          <BarreEnvoi 
            voisinFst={this.props.voisinFst} 
            voisinSnd={this.props.voisinSnd} 
            envoyerMessage={this.envoyerMessage} 
            contenu={this.props.message.val().contenu}
          />
        </Dialog>
      </div>
    );
  }
}