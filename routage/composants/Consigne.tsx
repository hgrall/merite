import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Consigne } from '../commun/communRoutage'; 
import { IdentifiantCases } from './IdentifiantCases';
import { binaire, Mot, motAleatoire, creerMot , tableauBinaireAleatoire} from '../../bibliotheque/binaire';

interface ConsigneProps {
  consigne: Consigne
}

const styles = {
  divCase : {
    display: 'flex' as 'flex'
  }
};

export class ConsigneDom extends React.Component<ConsigneProps, any> {
  render() {
    return (
      <div>
        <div style={styles.divCase}>
        Domaine destinataire: <IdentifiantCases int={this.props.consigne[0].domaine} />
        </div>
        <br/>
        <div style={styles.divCase}>
        Utilisateur destinataire: <IdentifiantCases int={this.props.consigne[1].pseudo} />
        </div>
        <br/>
        <div style={styles.divCase}>
        Contenu du message à envoyer: {this.props.consigne[2]['structure'].tableau.toString()}
        </div>
      </div>
    );
  }
}