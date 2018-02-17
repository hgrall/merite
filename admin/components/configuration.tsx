import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

interface ConfigurationProps {
    envoiConfiguration: (nDom: number, nUtilDom: Array<number>) => void
}

interface ConfigurationState {
    nDom: number, 
    domConfig: boolean,
    errorMessage: string,
    nUtilDom: Array<number>
}

const styles = {
    container: {
        margin: '30px',
        display: "flex" as 'flex',
        alignItems: "flex-start" as 'flex-start',
        flexDirection: 'column' as 'column'
    },
    errorMessage: {
        color: 'red'
    }
};

export class Configuration extends React.Component<ConfigurationProps, ConfigurationState> {
   
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
                this.props.envoiConfiguration(this.state.nDom, this.state.nUtilDom);
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
                    <div> Nombre d'utilisateurs du domaine {i} : 
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
            <div style={styles.container}>
                <h3>Configuration du domaine : </h3>
                <div>
                    Nombre de domaines : 
                    <TextField
                    name="nDom"
                    type="number"
                    value={this.state.nDom}
                    onChange={this.handleChangeNDom}
                    />
                </div>
                {userConfigList}
                <p style={styles.errorMessage}> {this.state.errorMessage} </p>
                <RaisedButton 
                    label="Valider" 
                    onClick={this.validation}
                    primary={true} />
            </div>
        );
    }
}