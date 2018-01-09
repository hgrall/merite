import * as React from 'react';
import {MessageATraiter} from './MessageATraiter'
const styles = {
  root: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    justifyContent: "center" as 'center',
    margin: '30px'
  }
};

let Messages : number []= [3];

export class MessageBox extends React.Component<any, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
      <div style={styles.root}>
        {(Messages.length == 0) ? (
        <div>Vous n'avez aucun message a traiter </div>) :
        (<MessageATraiter/>)}
      </div>
    );
  }
}
