import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

interface ConfigurationState {
    nDom: number, 
    domConfig: boolean,
    errorMessage: string,
    nUtilDom: Array<number>
}

export class Configuration extends React.Component<any, ConfigurationState> {
   
    state: ConfigurationState = {
        nDom: 3, 
        domConfig: false,
        errorMessage: '',
        nUtilDom: []
    }

    handleChangeNDom = (event: any) => {
        let nDom = parseInt(event.target.value);
        if (!isNaN(nDom)) {
            this.setState({
                nDom: nDom,
                nUtilDom: new Array(nDom),
                domConfig: false
            });
        }
    };

    handleChangeNUtilDom = (event: any, i: number) => {
        let nUtilDom = parseInt(event.target.value);
        if (!isNaN(nUtilDom)) {
            this.state.nUtilDom[i] = nUtilDom;
            this.setState({
                nUtilDom: this.state.nUtilDom
            });
        }    
    };

    validation = () => {
        if (this.state.domConfig == false) {
            if (this.state.nDom >= 3) {
                this.setState({
                    domConfig: true,
                    errorMessage: ''
                });
            } else {
                this.setState({
                    errorMessage: 'Le nombre de domaine doit être supérieur ou égal à 3'
                })
            }
        } else {
            let valide = true;
            for (let i=0; i<this.state.nDom; i++) {
                if (this.state.nUtilDom[i] == undefined || this.state.nUtilDom[i]<=0) {
                    valide = false; 
                }
            }
            if (valide) {
                // envoi Conf serveur 
                console.log('envoie Conf au serveur');
            } else {
                // message d'erreur
                this.setState({
                    errorMessage: "Le nombre d'utilisateur par domaine doit etre un nombre supérieur à 0"
                })
            }
        }
    };


    render() {
        var userConfigList : Array<any> = [];
        if (this.state.domConfig) {
            for (let i = 0; i < this.state.nDom; i++) {
                userConfigList.push(
                    <div> Nombre d'utilisateur du domaine {i} : 
                        <TextField
                            name={"nUtil"+i}
                            type="number"
                            onChange={(e) => this.handleChangeNUtilDom(e, i)}
                        />
                    </div>
                );
            }
        }

        return (
            <div>
                Configuration du domaine : 
                Nombre de domaines : 
                <TextField
                name="nDom"
                type="number"
                value={this.state.nDom}
                onChange={this.handleChangeNDom}
                />
                {userConfigList}
                {this.state.errorMessage}
                <RaisedButton 
                    label="Valider" 
                    onClick={this.validation}
                    primary={true} />
                
            </div>
        );
    }
}