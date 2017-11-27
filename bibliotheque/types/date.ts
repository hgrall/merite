import { normalisationNombre, jamais } from "../outils";

import {Enveloppe} from "./enveloppe";
/* ***********************************************************************************************
* Dates
*/

export enum Semaine {
    LUNDI,
    MARDI,
    MERCREDI,
    JEUDI,
    VENDREDI,
    SAMEDI,
    DIMANCHE
}

export enum Mois {
    JANVIER, FEVRIER, MARS,
    AVRIL, MAI, JUIN,
    JUILLET, AOUT, SEPTEMBRE,
    OCTOBRE, NOVEMBRE, DECEMBRE
}

// Format pour date et heure francaise
export interface FormatDateFr {
    readonly seconde: number;
    readonly minute: number;
    readonly heure: number;
    readonly jourSemaine: Semaine;
    readonly jourMois: number;
    readonly mois: Mois;
    readonly annee: number;
}

export type EtiquetteDateFr =
    'heure'
    | 'jourSemaine' | 'jourMois'
    | 'moisLettre' | 'moisNumero'
    | 'annee'
    | 'date' | 'dateLongue';


export interface DateImmutable {
    val(): FormatDateFr;
    detail(e: EtiquetteDateFr): string;
    representation(): string;
    representationLongue(): string;
    representationLog(): string;
}

// conversion du type Date au format Date Francaise
export function conversionDate(d: Date): FormatDateFr {
    return {
        seconde: d.getSeconds(),
        minute: d.getMinutes(),
        heure: d.getHours(),
        jourSemaine: (d.getDay() + 6) % 7,
        jourMois: d.getDate(),
        mois: d.getMonth(),
        annee: d.getFullYear()
    };
}


class DateFrEnveloppe extends Enveloppe<FormatDateFr, FormatDateFr, EtiquetteDateFr>
    implements DateImmutable {

    // renvoie sous forme String la valeur du parametre appelé
    net(e: EtiquetteDateFr): string {
        // A déplacer sous les cas.
        let s = normalisationNombre(this.etat().seconde, 2);
        let min = normalisationNombre(this.etat().minute, 2);
        let h = normalisationNombre(this.etat().heure, 2);
        let js = this.etat().jourSemaine;
        let jsL = Semaine[js].toLowerCase();
        let jm = normalisationNombre(this.etat().jourMois, 2);
        let mo = this.etat().mois;
        let moL = Mois[mo].toLowerCase();
        let moN = normalisationNombre(mo + 1, 2);
        let a = this.etat().annee.toString();

        switch (e) {
            case 'heure': return `${h}:${min}:${s}`;
            case 'jourSemaine': return jsL;
            case 'jourMois': return jm;
            case 'moisLettre': return moL;
            case 'moisNumero': return moN;
            case 'annee': return a;
            case 'date': return `${jm}/${moN}/${a}`;
            case 'dateLongue': return `${jsL} ${jm} ${moL} ${a}`
        }
        return jamais(e);
    }

    detail(e: EtiquetteDateFr){
        return this.net(e);
    }

    // represente la date par 12:53:53, le 02/02/2017
    representation(): string {
        return this.detail('heure') + ", le " + this.detail('date');
    }

    // represente la date par 12:53:53, le vendredi 02 fevrier 2017
    representationLongue(): string {
        return this.detail('heure') + ", le " + this.detail('dateLongue');
    }

    // represente la date par 12:53:53 02/02/2017
    representationLog(): string {
        return this.detail('heure') + " " + this.detail('date');
    }

}

// Creation d'une date avec pour valeur l'instant present ou la fonction est appelé
export function creerDateMaintenant(): DateImmutable {
    return new DateFrEnveloppe(x => x, conversionDate(new Date()));
}


// Creation d'une date
export function creerDateEnveloppe(d: FormatDateFr): DateImmutable {
    return new DateFrEnveloppe(x => x, d);
}