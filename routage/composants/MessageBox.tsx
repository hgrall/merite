import * as React from 'react';
import {MessageATraiter} from './MessageATraiter';

const styles = {
  root: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    flexDirection: "column" as "column",
    justifyContent: "center" as 'center',
    margin: '30px'
  }
};

export type Message = {
  corps : number[],
  locked : boolean,
  source : string 
}

let Messages : Message []= [{
  corps : [0,1,0,0,1,0,1,0,1,1,1,0,1,0,0,1],
  locked : false,
  source : 'DOM-2'
},{
  corps : [1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1],
  locked : true,
  source : 'DOM-3'
},{
  corps : [1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1],
  locked : false,
  source : 'DOM-3'
}];

export class MessageBox extends React.Component<any, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    var messageList = Messages.map(function(mes){
      return <MessageATraiter message={mes}/>;
    })
    return (
      <div>
        {(Messages.length == 0) ? (
        <div style={styles.root}>Pas de message a traiter </div>) :
        (<div style={styles.root}>{messageList}</div>)}
      </div>
    );
  }
}
