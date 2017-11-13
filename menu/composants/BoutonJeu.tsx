import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router-dom';
export class BoutonJeu extends React.Component<any, any> {
    constructor(props: any){
        super(props);
    }

    public render() {
      return (
        <div>
          <RaisedButton 
            label={this.props.nom}
            disabled={this.props.disabled}
            fullWidth={true}
            primary={true}
            containerElement={<Link to={this.props.link}/>}
          >
          </RaisedButton>
        </div>
      );
    }
}