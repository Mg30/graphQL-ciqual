const axios = require('axios')

const url = 'https://ciqual.anses.fr/esearch/aliments/_search'

function buildQuery (aliment , size){
    return {
        "from": 0,
        "size": size,
        "query": {

            "bool": {
                "must": [{
                    "multi_match": {
                        "query": `${aliment}`,
                        "fields": ["nomIndexFr^2", "nomFr"]
                    }
                }],
                "should": [{
                    "prefix": {
                        "nomSortFr": {
                            "value": `${aliment}`,
                            "boost": 2
                        }
                    }
                }]
            }

        },
        "_source": ["nomFr", "code", "groupeAfficheFr", "compos"]

    }
}



module.exports = {
    async SearchAliment({value, size}) {
        const query = buildQuery(value,size)
        const results = await axios.post(url,query)
        const aliments = results.data.hits.hits.reduce((acc,obj)=>{
            const aliment = {
                code : obj._source.code,
                groupe : obj._source.groupeAfficheFr,
                nom: obj._source.nomFr,
                compos : obj._source.compos.map(compo => {
                    return {
                        compoMin : compo.compoMin,
                        compoMax: compo.compoMax,
                        compoTeneur: compo.compoTeneur,
                        constNomFr : compo.constNomFr,
                        compoCodeConfiance: compo.CodeConfiance
                    }})
            }
            acc.push(aliment)
            return acc
        },[])
        return aliments

    }
}