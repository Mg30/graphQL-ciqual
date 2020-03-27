const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const schema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')


const app = express()
const router = express.Router()




router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));


router.get('/hello-world', (req, res) => {
    res.json({hello: "world"})
  })

app.use('/', router)
module.exports = app