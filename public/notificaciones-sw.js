importScripts("https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js")

firebase.initializeApp({
  projectId: "bloggeekplatzimaster",
  messagingSenderId: "466580409581",
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(payload => {
  const tituloNotificacion = 'Ya tenemos un nuevo post'
  const opcionesNotificacion = {
    body: payload.data.titulo,
    icon: 'icons/icon_new_post.png',
    click_action: "https://bloggeekplatzimaster.firebaseapp.com/"
  }
  return self.registration.showNotification(
    tituloNotificacion,
    opcionesNotificacion
  )
})
