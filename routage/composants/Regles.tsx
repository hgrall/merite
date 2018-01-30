import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Announcement from 'material-ui/svg-icons/action/announcement';
import RaisedButton from 'material-ui/RaisedButton';
import { Consigne } from '../commun/communRoutage'



interface ReglesProps {
  consigne: Consigne
}

const styles = {
  boutonRegles: {
    margin: '10px'
  }
};

export class Regles extends React.Component<ReglesProps, any> {
  state = {
    open: true,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        <RaisedButton 
          label="Regles du jeu" 
          secondary={true}
          style={styles.boutonRegles}
          icon={<Announcement/>}
          onClick={this.handleOpen} />
        <Dialog
          title="Regles du jeu"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Les regles du jeu sont les suivantes ...
          <br/>
          ID_DOM_CIBLE : {this.props.consigne.ID_dom_cible.val}
          <br/>
          ID_UTIL_CIBLE : {this.props.consigne.ID_util_cible.val}
          <br/>
          MOT_CIBLE : {this.props.consigne.mot_cible['structure'].tableau.toString()}

        </Dialog>
      </div>
    );
  }
}