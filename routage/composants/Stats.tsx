import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Announcement from 'material-ui/svg-icons/action/announcement';
import RaisedButton from 'material-ui/RaisedButton';
import { Consigne,MessageJeu1 } from '../commun/communRoutage'; 
import { ConsigneDom } from './Consigne';
import { IdentifiantCases } from './IdentifiantCases';



interface StatsProps {
  consigne: Consigne
}

const styles = {
  boutonStats: {
    margin: '10px'
  }
};

export class Stats extends React.Component<StatsProps, any> {
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
          label="Statistiques" 
          secondary={true}
          style={styles.boutonStats}
          icon={<Announcement/>}
          onClick={this.handleOpen} />
        <Dialog
          title="Statistiques"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Les statistiques du jeu sont les suivants ...
          <br/>
          <ConsigneDom consigne={this.props.consigne}/>
        </Dialog>
      </div>
    );
  }
}