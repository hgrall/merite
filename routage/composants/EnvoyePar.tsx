import * as React from 'react';

const styles = {
  margin: {
    margin: '15px'
  }
};
interface MessageProps {
    source: string
  }

const Messages = [];

export class EnvoyePar extends React.Component<MessageProps, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
        <div style={styles.margin}>Envoyé par : {this.props.source}</div>
    );
  }
}
