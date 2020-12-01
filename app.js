const express = require("express")
const {Client} = require("pg")


const app = express()
const dbClient = new Client({
    connectionString: "postgresql://postgres:zoo123@localhost:5432/zoo"
})

dbClient.connect( error=>{
    if ( error ){
        console.log(error)
    }
    else{
        console.log("Contectado BD")
    }
})

/* MIDDLEWARE */
app.use( express.static("build") )
app.use( express.json() )

//------------------------------
// GETS
//------------------------------

app.get( "/get/animals/:id", async (req, res)=>{
  const idQ = req.params.id
  const query = 'SELECT * FROM "Animals" where id=$1'
  dbClient.query( query, [idQ], (error, db_response)=>{
      let status
      let response = {}
      if ( error ){
          status = 500
          response = { data:null, message: error, status }
      }
      else if( db_response.rows.length === 0 ){
        status = 404
        response = { data: null, message: "El animal no fue encontrado", status }
      }
      else{
          status = 200
          response = { data: db_response.rows, message: "Animales cargados exítosamente", status }
      }
      res.status(status).json( response )
  })
})

app.get( "/get/animals", async (req, res)=>{
  const query = 'SELECT * FROM "Animals"'
  dbClient.query( query, [], (error, db_response)=>{
      let status
      let response = {}
      if ( error ){
          status = 500
          response = { data:null, message: error, status }
      }
      else{
          status = 200
          response = { data: db_response.rows, message: "Animales cargados exítosamente", status }
      }
      res.status(status).json( response )
  })
})

app.get( "/get/news", async (req, res)=>{
  const query = 'SELECT * FROM "News"'
  dbClient.query( query, [], (error, db_response)=>{
      let status
      let response = {}
      if ( error ){
          status = 500
          response = { data:null, message: error, status }
      }
      else{
          status = 200
          response = { data: db_response.rows, message: "Noticias cargadas exítosamente", status }
      }
      res.status(status).json( response )
  })
})

app.get("/*", (req, res)=>{
  console.log("AQUI :V", req.url)
  res.sendFile("build/index.html")
})


//------------------------------
// POSTS
//------------------------------

app.post( "/post/tickets", async (req, res) => {
  let info = req.body
  const values = [info.name, info.date, info.parking, info.email, info.adultTickets, info.kidTickets, info.total]
  for( let i in values ){
    if ( values[i] === undefined || values[i] === null ){
      res.status(501).send( "Incomplete information" )
    }
  }
  const query = 'INSERT INTO "Tickets" (name, date, parking, email, "adultTickets", "kidTickets", total) VALUES ($1, $2, $3, $4, $5, $6, $7)'
  dbClient.query( query, values, (error, db_response) =>{
      let status = 0
      let response = {}
      if ( error ){
          status = 500
          response = { status, message: error}
      }
      else{
        status = 200
        response = { status, message: error }
      }
      res.status(status).json( response )
  })
})

/*
PARA PASAR LO QUE SE TENÍA DEL REDUX A LA BD
*/
app.post( "/post/animals", async (req, res) => {
  let info = req.body
  const values = [info.name, info.img, info.id, info.description, info.bg_description, info.bg_img]
  const query = 'INSERT INTO "Animals" (name, img, id, description, bg_description, bg_img) VALUES ($1, $2, $3, $4, $5, $6)'
  dbClient.query( query, values, (error, db_response) =>{
      if ( error ){
          res.send( "Test failed" )
      }
      else{
          res.send( "Test successfull" )
      }
  })
})

/*
PARA PASAR LO QUE SE TENÍA DEL REDUX A LA BD
*/
app.post( "/post/news", async (req, res) => {
  req.body.noticias.map( async (info)=>{
    const values = [info.id, info.titulo, info.contenido, info.imagen]
    const query = 'INSERT INTO "News" (id, titulo, contenido, imagen) VALUES ($1, $2, $3, $4)'
    dbClient.query( query, values, (error, db_response) =>{
        if ( error ){
            res.send( "Test failed" )
        }
        else{
            res.send( "Test successfull" )
        }
    })
  })
  
})

app.listen(5000, () => {
    console.log("El servidor se ha iniciado")
})