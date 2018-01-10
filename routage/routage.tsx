import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanalClient, creerCanalClient } from '../bibliotheque/client';

import { MuiThemeProvider } from 'material-ui/styles';
import { Regles } from './composants/Regles';
import { NewMessage } from './composants/NewMessage';
import { BarreEnvoi } from './composants/BarreEnvoi';

import { MessageBox } from './composants/MessageBox';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { FormatErreurChat } from '../chat/commun/erreurChat';
import { FormatConfigurationChat, creerConfigurationChat, ConfigurationChat } from '../chat/commun/configurationChat';
import { FormatMessageChat, EtiquetteMessageChat } from '../chat/commun/messageChat';
import { hote, port2 } from './commun/communRoutage';

const styles = {
	container: {
		display: 'flex' as 'flex',
		flexDirection: 'column' as 'column',
		justifyContent: 'flex-start' as 'flex-start',
		alignContent: 'center' as 'center',
		position: 'absolute' as 'absolute',
		left: '0',
		right: '0'
	},
	paper: {
		flexShrink: 1,
		flexGrow: 1,
		alignSelf: 'stretch' as 'stretch',
		margin: '30px',
		display: 'flex' as 'flex',
		flexDirection: 'column' as 'column',
		alignContent: 'center' as 'center'
	},
	title: {
		display: 'flex' as 'flex',
		margin: '30px',
		justifyContent: 'center' as 'center'
	},
	appTitle: {
		display: 'flex' as 'flex',
		justifyContent: 'center' as 'center'
	},
	message: {
		alignSelf: 'center' as 'center'
	}
};

type CanalChat = CanalClient<FormatErreurChat, FormatConfigurationChat, FormatMessageChat, FormatMessageChat, EtiquetteMessageChat>;

export class Routage extends React.Component<any, any> {
	private adresseServeur: string;
	private canal: CanalChat;
	private config: ConfigurationChat;
	private messageErreur: string;

	constructor(props: any) {
		super(props);
		this.adresseServeur = hote + ':' + port2;

		this.messageErreur = 'Aucune erreur';
	}

	componentDidMount(): void {
		console.log('* Initialisation après montage du corps');

		console.log("- du canal de communication avec le serveur d'adresse " + this.adresseServeur);
		this.canal = creerCanalClient(this.adresseServeur);

		console.log('- du traitement des messages');
		this.canal.enregistrerTraitementMessageRecu((m: any) => {
			// TODO
			console.log('TODO: enregistrerTraitementMessageRecu');
		});

		console.log('- du traitement de la configuration');
		this.canal.enregistrerTraitementConfigurationRecue((c: FormatConfigurationChat) => {
			this.config = creerConfigurationChat(c);
			console.log('* Réception');
			console.log('- de la configuration brute : ' + this.config.brut());
			console.log('- de la configuration nette : ' + this.config.representation());
		});
	}

	public render() {
		return (
			<div style={styles.container}>
				<AppBar title="Merite" titleStyle={styles.appTitle} showMenuIconButton={false} />
				<Regles />
				<Paper zDepth={2} style={styles.paper}>
					<h3 style={styles.title}>Messages à traiter</h3>
					<NewMessage />
					<MessageBox />
				</Paper>
			</div>
		);
	}
}
