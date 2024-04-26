const express =  require ('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express()
//motor de planilla
app.set( 'view engine', 'ejs' )

//carpeta para archivos estaticos
app.use (express.static('public'))
//procesar datos enviados desde los formularios
app.use (express.urlencoded({extended:true}))
app.use(express.json())

//para retornar las variables
dotenv.config({path: './env/.env'})

// para usar cookies
app.use(cookieParser())



//llamar al router
app.use('/',require('./routers/router'))

app.listen(5000, ()=>{
    console.log("Server en  http://localhost:5000")
})