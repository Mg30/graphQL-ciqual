const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type User {
    name: String
    age: Int
  }
  type Prout {
      crotte : String
  }
  type RootQuery {
      User: User
      Prout(typeCrotte: String!) : Prout
  }
  schema {
      query: RootQuery
  }
`);