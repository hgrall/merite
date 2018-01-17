import * as React from 'react';
import { MessageATraiter } from './MessageATraiter';
import { MessageJeu1, FormatSommetJeu1 } from '../commun/communRoutage';
import {Identifiant} from '../../bibliotheque/types/identifiant';
import { Mot } from '../../bibliotheque/binaire';

const styles = {
  root: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    flexDirection: "column" as "column",
    justifyContent: "center" as 'center',
    margin: '30px'
  }
};

interface MessageProps {
  messages: Array<MessageJeu1>,
  voisinFst: FormatSommetJeu1,
  voisinSnd: FormatSommetJeu1,
  envoyerMessage: (dest: Identifiant<'sommet'>, contenu: Mot) => void,
}

export class MessageBox extends React.Component<MessageProps, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    var voisinFst= this.props.voisinFst;
    var voisinSnd = this.props.voisinSnd;
    var envoyerMessage = this.props.envoyerMessage;
    var messageList = this.props.messages.map(function(mes){
      return <MessageATraiter message={mes} voisinFst={voisinFst} voisinSnd={voisinSnd} envoyerMessage={envoyerMessage}/>;
    })
    return (
      <div>
        {(this.props.messages.length == 0) ? (
        <div style={styles.root}>Pas de message a traiter </div>) :
        (<div style={styles.root}>{messageList}</div>)}
      </div>
    );
  }
}
