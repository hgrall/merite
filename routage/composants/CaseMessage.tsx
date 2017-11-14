import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router-dom';

const caseBlanche = {
    display: 'block',
    height: '30px',
    width: '30px',
    background: 'white',
    'border-style': 'solid'
};
const caseNoire = {
    display: 'block',
    height: '30px',
    width: '30px',
    background: 'black'
};
  
export class CaseMessage extends React.Component<any, any> {
    state = {
        colored: false,
    };
    
    changeColor = () => {
        this.setState({colored: !this.state.colored});
      };
    

    public render() {
      return (
        <span style={this.state.colored ? caseNoire : caseBlanche} onClick={this.changeColor}>
        </span>
      );
    }
}