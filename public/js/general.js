$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  
  // Init Firebase nuevamente
  firebase.initializeApp(varConfig);
  
  // Adicionar el service worker
  navigator.serviceWorker.register('notificaciones-sw.js')
  .then(registro => {
    console.log('service worker registrado');
    firebase.messaging().useServiceWorker(registro)
  })
  .catch(error => {
    console.error(`Error al registrar el service worker: ${error}`)
  })

  const messaging = firebase.messaging()

  // Registrar LLave publica de messaging
  messaging.usePublicVapidKey('BGrmTWIR0nziDPJ0c7wtkCBrZ9f_qRZAPlnpeikE_r8fdOBOk1CAEXFIXqLF98X8YOiHY9mHZAReHsSgn_WCnH0')


  // Solicitar permisos para las notificaciones
  messaging.requestPermission()
  .then( () => {
    console.log('permiso obtenido');
    return messaging.getToken()
  })
  .then(token => {
    const db = firebase.firestore()
    db.settings({timestampsInSnapshots: true})
    db.collection('tokens').doc(token).set({'token':token})
  })
  .catch(error => {
    console.log(`Error al insertar el token en la base de datos ${error}`);
  })
  
  // Obtener el token cuando se refresca
  messaging.onTokenRefresh( () => {
    messaging.getToken()
    .then(token => {
      const db = firebase.firestore()
      db.settings({timestampsInSnapshots: true})
      db.collection('tokens').doc(token).set({'token':token})
    })
    .catch(error => {
      console.log(`Error al insertar el token en la base de datos ${error}`);
    })

  })


  // TODO: Recibir las notificaciones cuando el usuario esta foreground
  messaging.onMessage(payload => {
    Materialize.toast(`Ya tenemos un nuevo post. Revisalo, se llama ${payload.data.titulo}`, 6000)
  })

  // TODO: Recibir las notificaciones cuando el usuario esta background

  // Listening real time
  const post = new Post()
  post.consultarTodosPost()

  // Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#btnInicioSesion').text('Salir')
      if (user.photoURL) {
        $('#avatar').attr('src', user.photoURL)
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
      }
    } else {
      $('#btnInicioSesion').text('Iniciar sesión')
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })

  // Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      $('#btnInicioSesion').text('Iniciar sesión')
      return firebase.auth().signOut().then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`SignOut correcto.`, 4000)
      })
      .catch(error => {
        Materialize.toast(`Error al hacer el SignOut ${error}.`, 4000)

      })
    }
    

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    firebase.auth().signOut()
    .then(() => {
      $('#avatar').attr('src', 'imagenes/usuario.png')
      Materialize.toast(`SignOut correcto`, 4000)
    })
    .catch(error => {
      console.error(error.message)
      Materialize.toast(`Error al realizar el SignOut. Error: ${error}`, 4000)
    })
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')
    const post = new Post()
    post.consultarTodosPost()
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      const post = new Post()
      post.consultarPostxUsuario(user.email)
    }
    $('#tituloPost').text('Mis Posts')
    Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)
  })
})
