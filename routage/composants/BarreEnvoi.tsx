import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */

const styles = {
    root: {
        justifyContent: "space-between" as "space-between"
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

export class BarreEnvoi extends React.Component<any, any> {
  render() {
    return (
      <div style={styles.root}>
       <IconButton
       tooltip="Send"
         iconStyle={styles.largeIcon}
         style={styles.large}
       >
         <ArrowBack/> 
       </IconButton> 
       <IconButton
       tooltip="Send"
         iconStyle={styles.largeIcon}
         style={styles.large}
       >
         <ArrowForward/>
       </IconButton>
      </div>
    );
  }
}