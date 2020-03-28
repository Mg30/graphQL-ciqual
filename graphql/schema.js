const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Compo {
    compoMax: String
    compoMin : String
    compoTeneur : String
    constNomFr: String
    compoCodeConfiance: String
  }
  type Aliment {
    code : String
    groupe: String
    nom: String
    compos : [Compo]
  }

  type RootQuery {
      SearchAliment(value:String, size:Int): [Aliment]
  }
  schema {
      query: RootQuery
  }
`);