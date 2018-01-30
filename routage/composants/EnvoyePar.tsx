import * as React from 'react';
import { IdentifiantCases } from './IdentifiantCases';
import { FormatSommetJeu1 } from '../commun/communRoutage';

const styles = {
  margin: {
    margin: '15px'
  }
};
interface MessageProps {
  source: FormatSommetJeu1
}

const Messages = [];

export class EnvoyePar extends React.Component<MessageProps, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
        <div style={styles.margin}>Envoyé par : <IdentifiantCases int={this.props.source.domaine} /></div>
    );
  }
}
