class Aliment {
    constructor(data) {
        this.data = data
        this.code = data._source.code
        this.groupe = data._source.groupeAfficheFr
        this.nom = data._source.nomFr
    }

    nutriments ({ filter }) {
        const regex = new RegExp(filter,'i')
        return this.data._source.compos.reduce((acc, nutr) => {
            if (nutr.constNomFr.match(regex)) {
                acc.push(new Nutriment(nutr))
            }
            return acc
        }, [])
    }
}


class Nutriment {


    constructor(data) {
        this.compoMax = data.compoMax
        this.compoMin = data.compoMin
        this.compoTeneur = data.compoTeneur
        this.constNomFr = data.constNomFr
        this.codeConfiance = data.compoCodeConfiance
    }
}

module.exports = {
    Aliment,
    Nutriment
}

