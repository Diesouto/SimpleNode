/* MANEJAR WEB */
const express = require('express')
const app = express()
const port=8080

//require('hbs)
app.set ('view engine', 'hbs' ) ;
app.set('views', __dirname + '/public/views');
// Servir contenido estático
app.use(express.static('public'));

//require(bodyparser)
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',  (req, res) =>{
    res.render('home');
});


//#region leer JSON
let fs = require('fs');

var json_users=fs.readFileSync('src/clientes.json', 'utf-8', (err, data) => {
    if(err) {
      console.log('error: ', err);
    } 
});
  
var users = JSON.parse(json_users);
//#endregion

//Cargar listado
app.get('/listado',  (req, res) =>{
  res.type('text/html');
  res.render('listado.hbs', {
      tituloBody:'Datos clientes',
      clientes: users
  }, function(err, html){
      if(err) throw err;
      res.send(html);
  });
});

//Insertar datos
app.post('/insertar', (req, res) => {
    //Almacenamos variables post
    var _nombre = req.body.nombre;
    var _apellidos = req.body.apellidos;
    var _nif = req.body.nif;
    var _provincia = req.body.provincia;

    var obj = { nombre: _nombre , apellidos: _apellidos, nif: _nif, provincia: _provincia }
    
    //El método push () agrega nuevos elementos al final de una matriz y devuelve la nueva longitud
    users.push(obj);
    
    //Guardar el nuevo registro en un archivo json
    fs.writeFileSync('src/clientes.json',JSON.stringify(users),'utf-8');
  
    console.log('nuevo usuario:', users);
    res.redirect('/listado'); 
  });

app.get('/borrar',  (req, res) =>{
    res.render('borrar');
});

//Borrar datos
app.post('/borrar',  (req, res) =>{
    var _nif = req.body.nif;

    var index = users.findIndex(a=> a.nif === _nif);
    if (index > -1) {
        users.splice(index, 1);
    }
    
    res.redirect('/listado'); 
});

app.get('/*', (req, res)  =>{
    res.sendFile(__dirname+'/public/404.html')
});

app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`)
});


