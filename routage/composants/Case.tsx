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
  
interface CaseProps {
  colored: number,
  locked: boolean,
  changeColor?: (n : number) => void,
  id?: number
}

export class Case extends React.Component<CaseProps, any> {
    changeColor = () => {
        console.log(this.props.locked);
        if (this.props.locked == false && this.props.changeColor && this.props.id) {
            this.props.changeColor(this.props.id)
        }
      };
    

    public render() {
      return (
        <span style={this.props.colored == 1 ? caseNoire : caseBlanche} onClick={this.changeColor}>
        </span>
      );
    }
}