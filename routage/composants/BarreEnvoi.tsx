import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import { Identifiant } from '../../bibliotheque/types/identifiant'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import { Mot } from '../../bibliotheque/binaire';
/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */

const styles = {
    root: {
        display: "flex",
        justifyContent: "space-around" as "space-around"
    },
    arrowContainer: {
      display: "flex",
      flexDirection: "column" as "column"
    },
    largeIcon: {
        width: 60,
        height: 60,
      },
    large: {
        width: 120,
        height: 120,
        padding: 30,
    }
};
interface MessageProps {
  envoyerMessage: (dest: Identifiant<'sommet'>, contenu: Mot) => void,
  voisinFst: Identifiant<'sommet'>,
  voisinSnd: Identifiant<'sommet'>,
  contenu: Mot
}
export class BarreEnvoi extends React.Component<MessageProps, any> {

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.arrowContainer}>
          Envoyer au domaine : 
          {this.props.voisinFst.val}
          <IconButton
          tooltip="Envoyer"
            iconStyle={styles.largeIcon}
            style={styles.large}
            onClick={() => this.props.envoyerMessage(this.props.voisinFst, this.props.contenu)}
          >
          <ArrowBack/> 
        </IconButton>
        </div> 
        <div style={styles.arrowContainer}>
          Envoyer au domaine : 
          {this.props.voisinSnd.val}
          <IconButton
            tooltip="Envoyer"
            iconStyle={styles.largeIcon}
            style={styles.large}
            onClick={() => this.props.envoyerMessage(this.props.voisinSnd, this.props.contenu)}
          >
            <ArrowForward/>
          </IconButton>
        </div>
      </div>
    );
  }
}