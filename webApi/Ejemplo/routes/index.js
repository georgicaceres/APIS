var express = require('express');
var router = express.Router();
var axios = require('axios');
var token = "acá debería haber un token, pero por razones de seguridad no lo hay. Ver en el repo instrucciones para generar uno"

/*HOME*/
router.get('/', function(req,res,next){
  res.render('home')
})
/* Método de prueba, sirve para saber si la api está funcionando*/ 
router.get('/prueba', function(req, res, next) {
 axios
  .post('https://slack.com/api/api.test')
  .then(function (response) {
      var respuesta = JSON.stringify(response.data.ok);
      console.log(respuesta);
      res.render('index', {ok:respuesta})
  })
  .catch(function (error) {
      res.render('index', {data:'Parece que algo ha fallado =('});
  });
})

/* Método que no funciona para mostrar qué devuelve la API cuando el requerimiento falla. En este caso, no funciona porque falta el token de autorización*/
router.get('/error', function(req, res, next) {
 axios
 .get('https://slack.com/api/users.list')
  
  .then(function (response) {
    console.log(response)
     //del objeto respuesta, me quedo con los datos
     var data = response.data 
     //parámetro ok que determina si el requerimiento funcionó correctamente
     var ok = JSON.stringify(data.ok);
     //información que me trae (en este caso, el error)
     var info = JSON.stringify(data.error);

     res.render('index', {ok:ok, data:info })
  })
  
  .catch(function (error) {
    res.render('index', {respuesta:'Parece que algo ha fallado =('});
  });
});

/* Método que me trae les usuaries de mi espacio de trabajo */
router.get('/lista', function(req, res, next) {
 axios
 .get('https://slack.com/api/users.list', {
  params: {
    token:token
  }
  })
  
  .then(function (response) {
     //del objeto respuesta, me quedo con los datos
     var data = response.data 
     //parámetro ok que determina si el requerimiento funcionó correctamente
     var ok = JSON.stringify(data.ok);
     //información que me trae (en este caso, los miembros del grupo)
     var info = JSON.stringify(data.members);
     var members = data.members
     var ejemplo = JSON.stringify(members[4]);
     res.render('index', {ok:ok, data:info, extras:ejemplo})
  })
  
  .catch(function (error) {
    res.render('index', {respuesta:'Parece que algo ha fallado =('});
  });
});



module.exports = router;
