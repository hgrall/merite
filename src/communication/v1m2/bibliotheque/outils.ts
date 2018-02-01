export function jamais(x: never): never {
    throw new Error("* Erreur impossible : " + x);
}

export function normalisationNombre(n : number, taille : number){
    let r = n.toString();
    while(r.length < taille){
        r = "0" + r;
    }
    return r;
}