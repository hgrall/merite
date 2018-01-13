import * as React from 'react';
import {MessageCases} from './MessageCases';
import {TraiterMessage} from './TraiterMessage';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { EnvoyePar } from './EnvoyePar'
import { MessageJeu1, TypeMessageJeu1 } from '../commun/communRoutage'
import { Identifiant } from '../../bibliotheque/types/identifiant'
import { Mot } from '../../bibliotheque/binaire';

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
  }
};
interface MessageProps {
    message: MessageJeu1,
    voisinFst: Identifiant<'sommet'>,
    voisinSnd: Identifiant<'sommet'>,
    envoyerMessage: (dest: Identifiant<'sommet'>, contenu: Mot) => void,
  }

const Messages = [];

export class MessageATraiter extends React.Component<MessageProps, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
      <div style={styles.root}>
       <Paper zDepth={2}>
        <EnvoyePar source={this.props.message.val().ID_emetteur.val}/>
        <MessageCases message={this.props.message.val().contenu} locked={true}/>
        <div style={styles.container}>
          Verrouillé : {this.props.message.val().type === TypeMessageJeu1.VERROU ? 'Oui' : 'Non'}
          <TraiterMessage message={this.props.message} voisinFst={this.props.voisinFst} voisinSnd={this.props.voisinSnd} 
          envoyerMessage={this.props.envoyerMessage}/>
        </div>
       </Paper>
        
      </div>
    );
  }
  verouiller(){
      return false; 
  }
}
