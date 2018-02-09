import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Dialog from 'material-ui/Dialog';
import { CanalClient, creerCanalClient } from '../bibliotheque/client';
import FlatButton from 'material-ui/FlatButton';
import { MuiThemeProvider } from 'material-ui/styles';
import { Regles } from './composants/Regles';
import { NewMessage } from './composants/NewMessage';
import { BarreEnvoi } from './composants/BarreEnvoi';
import {Identifiant, creerIdentifiant} from '../bibliotheque/types/identifiant'
import {FormatTableImmutable, FABRIQUE_TABLE} from '../bibliotheque/types/table'
import { creerDateMaintenant, conversionDate } from '../bibliotheque/types/date'
import { creerMot, Mot, concatMot } from '../bibliotheque/binaire'
import { MessageBox } from './composants/MessageBox';
import { IdentifiantCases } from './composants/IdentifiantCases';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { hote, port2, Consigne, FormatConfigurationJeu1, creerConfigurationJeu1, ConfigurationJeu1,creerSommetJeu1, FormatMessageJeu1, MessageJeu1, FormatErreurJeu1, EtiquetteMessageJeu1, FormatSommetJeu1, TypeMessageJeu1, FormatUtilisateur, sommetInconnu } from './commun/communRoutage';
import { Deux } from '../bibliotheque/types/mutable';
import { verouiller } from './client/clientRoutage';
import { isUndefined, isNull } from 'util';

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
	},
	dom : {
		display: "flex" as 'flex',
		sflexWrap: "wrap" as 'wrap',
	}
};

type CanalJeu1 = CanalClient<FormatErreurJeu1, FormatConfigurationJeu1, FormatMessageJeu1, FormatMessageJeu1, EtiquetteMessageJeu1>;

interface FormState { 
	dom: FormatSommetJeu1,
	util: FormatUtilisateur,
	messages: Array<MessageJeu1>,
	voisinFst: FormatSommetJeu1,
	voisinSnd: FormatSommetJeu1,
	openDialog: boolean,
	textDialog: string,
	consigne: Consigne
  }

export class Routage extends React.Component<any, FormState> {
	private adresseServeur: string;
	private canal: CanalJeu1;
	private config: ConfigurationJeu1;
	private messageErreur: string;

	state: FormState = {
		messages: [],
		dom: {ID: creerIdentifiant('sommet',''), domaine:[]},
		util: {ID: creerIdentifiant('utilisateur',''), pseudo:[]},
		voisinFst: {ID: creerIdentifiant('sommet',''), domaine:[]},
		voisinSnd: {ID: creerIdentifiant('sommet',''), domaine:[]},
		openDialog: false,
		textDialog: '',
		/*consigne: {
			ID_dom_cible: { ID: creerIdentifiant('sommet', ''), domaine: [] },
			ID_util_cible: { ID: creerIdentifiant('utilisateur', ''), pseudo: [] },
			mot_cible: creerMot([])
		}*/
		consigne:[
			{ ID: creerIdentifiant('sommet', ''), domaine: [] },
			{ ID: creerIdentifiant('utilisateur', ''), pseudo: [] },
			creerMot([])
		]
	}

	constructor(props: any) {
		super(props);
		this.adresseServeur = hote + ':' + port2;
		this.messageErreur = 'Aucune erreur';
	}

	envoiMessageInit = (dest: Identifiant<'sommet'>, contenu: Mot) => {
		this.canal.envoyerMessage(new MessageJeu1({
			ID: creerIdentifiant('message',''),
			ID_emetteur: this.state.util.ID,
			ID_origine: this.state.dom.ID,
			ID_destination: dest,
			type: TypeMessageJeu1.INIT,
			contenu: contenu,
			date: conversionDate(new Date())
		  }))
	}

	envoiMessage = (dest: Identifiant<'sommet'>, id: Identifiant<'message'>, contenu: Mot) => {
		this.canal.envoyerMessage(new MessageJeu1({
			ID: id,
			ID_emetteur: this.state.util.ID,
			ID_origine: this.state.dom.ID,
			ID_destination: dest,
			type: TypeMessageJeu1.SUIVANT,
			contenu: contenu,
			date: conversionDate(new Date())
		}))
	}

	detruireMessage = (msg: MessageJeu1) => {
		this.state.messages.splice(this.state.messages.findIndex(function (m) {
			if (m.val().ID.val === msg.val().ID.val) {
				return true;
			}
			return false;
		}), 1);
		this.setState({
			messages: this.state.messages
		})
		this.canal.envoyerMessage(msg.aIgnorer(this.state.util.ID))
	}

	validerMessage = (contenu: Mot, msg: MessageJeu1) => {
		this.canal.envoyerMessage(msg.aEssayer(contenu, this.state.util.ID))
	}

	verrou = (idMessage : Identifiant<'message'>,
	contenu : Mot) => {
		let msg = new MessageJeu1({
			ID: idMessage,
			ID_emetteur: this.state.util.ID,
			ID_origine: this.state.dom.ID,
			ID_destination: sommetInconnu,
			type: TypeMessageJeu1.VERROU,
			contenu: contenu,
			date: conversionDate(new Date())
		  })
		this.canal.envoyerMessage(msg);
	}

	deverrouiller = (idMessage: Identifiant<'message'>,
		contenu: Mot) => {
		let msg = new MessageJeu1({
			ID: idMessage,
			ID_emetteur: this.state.util.ID,
			ID_origine: this.state.dom.ID,
			ID_destination: this.state.dom.ID,
			type: TypeMessageJeu1.IGNOR,
			contenu: contenu,
			date: conversionDate(new Date())
		})
		this.canal.envoyerMessage(msg);
	}

	componentWillMount(): void {
		console.log('* Initialisation après montage du corps');

		console.log("- du canal de communication avec le serveur d'adresse " + this.adresseServeur);
		this.canal = creerCanalClient(this.adresseServeur);

		console.log('- du traitement des messages');
		this.canal.enregistrerTraitementMessageRecu((m: FormatMessageJeu1) => {
			let msg = new MessageJeu1(m);
			console.log('* Réception');
			console.log('- du message brut : ' + msg.brut());

			switch (m.type) {
				case TypeMessageJeu1.TRANSIT:
					this.state.messages.push(msg);
					this.setState({
						messages: this.state.messages,
						dom: this.state.dom,
						util: this.state.util,
						voisinFst: this.state.voisinFst,
						voisinSnd: this.state.voisinSnd,
					})
					// l'utilisateur recoit un message du serveur et le place en transit 
					break;
				case TypeMessageJeu1.ACTIF:
					// l'utilisateur active un message apres une demande de verouillage réussi coté serveur
					this.setState({
						messages: this.state.messages.map(function (msg) {
							if (msg.val().ID.val === m.ID.val) {
								return msg.aActiver();
							}
							else {
								return msg;
							}
						})
					})
					break;
				case TypeMessageJeu1.LIBE:
					// le message est déverrouiller 
					this.setState({
						messages: this.state.messages.map(function (msg) {
							if (msg.val().ID.val === m.ID.val) {
								return msg.aDeverrouiller();
							}
							else {
								return msg;
							}
						})
					})
					break;
				case TypeMessageJeu1.INACTIF:
					this.setState({
						messages: this.state.messages.map(function (msg) {
							if (msg.val().ID.val === m.ID.val) {
								return msg.aDesactiver();
							}
							else {
								return msg;
							}
						}),
						dom: this.state.dom,
						util: this.state.util,
						voisinFst: this.state.voisinFst,
						voisinSnd: this.state.voisinSnd,
					})
					break;
				case TypeMessageJeu1.SUCCES_INIT:
					// le message initial a bien été envoyé
					this.setState({textDialog: 'Le message a été envoyé !'});
					this.handleOpen();
					break;
				case TypeMessageJeu1.SUCCES_TRANSIT:
					// le message a bien été transmis
					this.setState({ textDialog: 'Le message a été transmis !' });
					this.handleOpen();
					break;
				case TypeMessageJeu1.SUCCES_FIN:
					// l'utilisateur gagne la partie
					this.setState({ textDialog: 'Le message a été décodé avec succès !' });
					this.handleOpen();
					break;
				case TypeMessageJeu1.ECHEC_FIN:
					// l'utilisateur perd la partie 
					this.setState({ textDialog: 'Perdu ...' });
					this.handleOpen();
					break;
				case TypeMessageJeu1.IGNOR:
					this.state.messages.splice(this.state.messages.findIndex(function (msg) {
						if (msg.val().ID.val === m.ID.val) {
							return true;
						}
						return false;
					}),1);
					this.setState({
						messages: this.state.messages
					})
					// l'utilisateur détruit le message à la demande du serveur 
					break;
				default:
				console.log('no match');
				break;
			}
			
		});

		console.log('- du traitement de la configuration');
		this.canal.enregistrerTraitementConfigurationRecue((c: FormatConfigurationJeu1) => {
			this.config = creerConfigurationJeu1(c);

			let voisinFst : FormatSommetJeu1 = {ID: creerIdentifiant('sommet',''), domaine:[]};
			let voisinSnd : FormatSommetJeu1 = {ID: creerIdentifiant('sommet',''), domaine:[]};
			let fst = true;
			for (let i =0 ; i<4; i++) {
				if (this.config.val().voisins.table['DOM-'+i]) {
					if (fst) {
						voisinFst = this.config.val().voisins.table['DOM-'+i];
						fst = false;
					} else {
						voisinSnd = this.config.val().voisins.table['DOM-'+i];
					}
				}
			}

			this.setState({
				dom: this.config.val().centre,
				messages: [],
				util: this.config.val().utilisateur,
				voisinFst: voisinFst,
				voisinSnd: voisinSnd,
				consigne: this.config.val().consigne
			});
			this.config.val().utilisateur.ID
			console.log(this.config.net("centre"));
			console.log('* Réception');
			console.log('- de la configuration brute : ' + this.config.brut());
			console.log('- de la configuration nette : ' + this.config.representation());
		});
	}

	handleOpen = () => {
		this.setState({ openDialog: true });
	};

	handleClose = () => {
		this.setState({ openDialog: false });
	};

	public render() {
		const actions = [
			<FlatButton
				label="OK"
				primary={true}
				onClick={this.handleClose}
			/>
		];

		return (
			<div style={styles.container}>
				<AppBar title="Merite" titleStyle={styles.appTitle} showMenuIconButton={false} />
				<Regles consigne={this.state.consigne }/>
				<div style={styles.dom}>
				Domaine : <IdentifiantCases int={this.state.dom.domaine} />
				</div>
				<div style={styles.dom}>
				Utilisateur : <IdentifiantCases int={this.state.util.pseudo} />
				</div>
				<Paper zDepth={2} style={styles.paper}>
					<h3 style={styles.title}>Messages à traiter</h3>
					<NewMessage 
						envoyerMessage={this.envoiMessageInit} 
						voisinFst={this.state.voisinFst} 
						voisinSnd={this.state.voisinSnd}
						consigne={this.state.consigne}/>
					<MessageBox 
						envoyerMessage={this.envoiMessage}
						verrou={this.verrou}
						deverrouiller={this.deverrouiller}
						detruireMessage={this.detruireMessage}
						messages={this.state.messages}
						voisinFst={this.state.voisinFst}
						validation={this.validerMessage}
						voisinSnd={this.state.voisinSnd}/>
				</Paper>
				

				<Dialog
					actions={actions}
					modal={false}
					open={this.state.openDialog}
					onRequestClose={this.handleClose}
				>
					{this.state.textDialog}
        		</Dialog>
				</div>
    );
  }
}