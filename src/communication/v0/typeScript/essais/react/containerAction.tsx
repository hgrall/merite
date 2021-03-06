import * as React from "react";

import styled from "styled-components";

import TextareaAutosize from 'react-textarea-autosize';

import { Couleur, BLANC, NOIR, FOND_NOIR, GRIS_NOIR, FOND, ROUGE, JAUNE, VIOLET, BLEU_CANARD, VERT, TOUS, OMBRE_RECEPTION, OMBRE_EMISSION } from "./couleur";

import { Individu, Message } from "./typesInterface";

import { ContainerMessageEmis, ContainerMessageRecu, EntreeMessage } from "./containersMessages";

interface ProprietesAction {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    sujet: Individu;
    messages: Message[];
    selection: Individu;
}



class ContenuContainerAction extends React.Component<ProprietesAction, {}> {
    render() {
        return (
            <div className={this.props.className}>
                {
                    this.props.messages.map((m : Message) =>
                        ((m.emetteur.nom === this.props.sujet.nom)?
                            <ContainerMessageEmis message={m} /> :
                            <ContainerMessageRecu message={m} />
                        ) 
                    )
                }
                <EntreeMessage sujet={this.props.sujet} destinataire={this.props.selection} />
            </div>
        );
    }
}

export const ContainerAction = styled(ContenuContainerAction) `
    background: ${FOND};
    position: absolute;
    top: 0;
    left: 0;
    /* important / overflow : deux sens haut vers bas et gauche vers droite pour le dépassement */
    min-width: calc(74vw);
    min-height: calc(100vh);
    /* occupe au moins la place du container */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

