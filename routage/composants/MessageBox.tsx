import * as React from 'react';
import { MessageATraiter } from './MessageATraiter';
import { MessageJeu1 } from '../commun/communRoutage';

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
  messages: Array<MessageJeu1>
}

export class MessageBox extends React.Component<MessageProps, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    var messageList = this.props.messages.map(function(mes){
      return <MessageATraiter message={mes}/>;
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
