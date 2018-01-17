import * as React from 'react';
import {MessageCases} from './MessageCases';
import {TraiterMessage} from './TraiterMessage';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { EnvoyePar } from './EnvoyePar'
import { MessageJeu1, TypeMessageJeu1 } from '../commun/communRoutage'
import { Identifiant } from '../../bibliotheque/types/identifiant'
import { Mot } from '../../bibliotheque/binaire';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import LockClose from 'material-ui/svg-icons/action/lock-outline';
import { FormatSommetJeu1 } from '../commun/communRoutage';

const styles = {
  root: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    justifyContent: "center" as 'center',
    flexDirection: "column" as "column",
    alignItems : "stretch" as "stretch",
    margin: '30px'
  },
  container: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    justifyContent: "space-between" as 'space-between',
    margin: '30px',
    alignItems: 'baseline' as 'baseline'
  },
  margin: {
    margin: '15px'
  },
  btn: {
    margin: '10px',
    alignSelf: "flex-end" as "flex-end"
  }
};
interface MessageProps {
    message: MessageJeu1,
    voisinFst: FormatSommetJeu1,
    voisinSnd: FormatSommetJeu1,
    envoyerMessage: (dest: Identifiant<'sommet'>, contenu: Mot) => void,
  }

interface MessageState {
  locked: boolean
}

const Messages = [];

export class MessageATraiter extends React.Component<MessageProps, MessageState> {
  
  constructor(props: any){
      super(props);
      this.state= ({
        locked: false
      })
  }

  public render() {
    return (
      <div style={styles.root}>
       <Paper zDepth={2}>
        <EnvoyePar source={this.props.message.val().ID_emetteur.val}/>
        <MessageCases message={this.props.message.val().contenu} locked={true}/>
        <div style={styles.container}>
          {this.state.locked ? <LockClose/> : <LockOpen/>}
          <RaisedButton 
          label={this.state.locked? "Deverouiller" : "Verouiller"}
          style={styles.btn}
          onClick={() => this.setState({
            locked: !this.state.locked
          })} 
          primary={true}/>
          <TraiterMessage 
            message={this.props.message}
            voisinFst={this.props.voisinFst}
            voisinSnd={this.props.voisinSnd} 
            locked={this.state.locked}
            envoyerMessage={this.props.envoyerMessage}/>
        </div>
       </Paper>
        
      </div>
    );
  }
}
