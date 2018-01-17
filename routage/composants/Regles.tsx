import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Announcement from 'material-ui/svg-icons/action/announcement';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  boutonRegles: {
    margin: '10px'
  }
};

export class Regles extends React.Component<any, any> {
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
        </Dialog>
      </div>
    );
  }
}