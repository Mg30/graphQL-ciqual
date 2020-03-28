const axios = require('axios')
const url = 'https://ciqual.anses.fr/esearch/aliments/_search'



class Proteine {
    constructor(){
        
    }
}

class Aliment {
    constructor(ciqualHitsApiCall){
        this.data = ciqualHitsApiCall._source
    }
}

const mapName = {
    "Energie, Règlement UE N° 1169/2011 (kJ/100g)": "",
    "Energie, Règlement UE N° 1169/2011 (kcal/100g)":"",
    "Energie, N x facteur Jones, avec fibres  (kJ/100g)":"",
    "Energie, N x facteur Jones, avec fibres  (kcal/100g)":"",
    "Eau (g/100g)":"",
    "Cendres (g/100g)":"",
    "Sel chlorure de sodium (g/100g)":"",
    "Sodium (mg/100g)":"",
    "Phosphore (mg/100g)":"",
    "Potassium (mg/100g)" : "", 
    "Calcium (mg/100g)" : "",
  
     "Fer (mg/100g)" : "",
  
     "Zinc (mg/100g)" : "",
  
     "Protéines (g/100g)" : "",
  
     "Protéines brutes, N x 6.25 (g/100g)" : "",
  
     "Glucides (g/100g)" : "",
  
     "Sucres (g/100g)" : "",
  
     "Amidon (g/100g)" : "",
  
     "Polyols totaux (g/100g)" : "",
  
     "Fibres alimentaires (g/100g)" : "",
  
     "Lipides (g/100g)" : "",
  
     "AG saturés (g/100g)" : "",
  
     "AG monoinsaturés (g/100g)" : "",
  
     "AG polyinsaturés (g/100g)" : "",
  
     "Rétinol (µg/100g)" : "",
  
     "Beta-Carotène (µg/100g)" : "",
  
     "Vitamine D (µg/100g)" : "",
  
     "Vitamine E (mg/100g)" : "",
  
     "Vitamine C (mg/100g)" : "",
  
     "Vitamine B1 ou Thiamine (mg/100g)" : "",
  
     "Vitamine B2 ou Riboflavine (mg/100g)" : "",
  
     "Vitamine B3 ou PP ou Niacine (mg/100g)" : "",
  
     "Vitamine B6 (mg/100g)" : "",
  
     "Vitamine B9 ou Folates totaux (µg/100g)" : "",
  
     "Alcool (g/100g)" : "",
  
     "Acides organiques (g/100g)" : "",
  
     "Cholestérol (mg/100g)" : "",
  }

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