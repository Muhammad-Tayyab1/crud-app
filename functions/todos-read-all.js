const faunadb = require('faunadb');
q = faunadb.query



require("dotenv").config()


exports.handler = async function(event, context) {

    try {

        const client = new faunadb.Client({secret: process.env.FAUNADB_SECRET})
        let result = await client.query(
            q.Map(
                q.Paginate(q.Match(q.Index("all_messages"))),
                 q.Lambda("x", q.Get(q.Var("x")))
              ) 
        )
        
        console.log("all the entries " + result.data.map(x => x.data))
        return {
            statusCode: 200,
            body: JSON.stringify(result.data),
          }

    } catch(error){

        return {
                statusCode: 400 ,
                message: error.toString()
            }
    }

}
