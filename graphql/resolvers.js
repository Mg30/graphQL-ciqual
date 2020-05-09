const axios = require('axios')
const url = 'https://ciqual.anses.fr/esearch/aliments/_search'
const { Aliment } = require('./models')

function buildQuery (aliment, size) {
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
    async SearchAliment ({ value, size }) {
        const query = buildQuery(value, size)
        const results = await axios.post(url, query)
        const aliments = results.data.hits.hits.map(data => new Aliment(data))
        return aliments

    }
}