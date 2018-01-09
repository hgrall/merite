import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

interface messageProps {
    validation:() => void,
    verifier:() => void
  }
/**
 * Decodage : message a deja ete verouille par user
 * c'est a l'utilisateur de donner son interpretation du msg
 * verrouillage (dans le dialogue de transmission) --> ouverture --> INPUT user --> verifier
 * 
 */
export class DialogResultMessage extends React.Component<messageProps, any> {
  state = {
    gagne: false,
  };

  //ouvrir msg
  handleClose = () => {
    this.setState({open: false});
  };

  //demande au serveur de verifier que interpretation du msg est correcte
  verifier = () => {
    this.props.verifier();  
  }

  render() {
      /*
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
    */

    return (
      <div>
         
        <Dialog
          title="Résultat"
         // actions={actions}
          modal={false}
          open={this.state.gagne}
          onRequestClose={this.handleClose}
        >
        </Dialog>
      </div>
    );
  }
}