class Autenticacion {
  
  authEmailPass (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result => {
      if (result.user.emailVerified) {

        const photoURL = "https://lh3.googleusercontent.com/-Y0et8ydX-2o/XwNZ9TcnasI/AAAAAAAADuQ/aDpOH83Hyl81Hm1SMfdRloxuq9LYexkOwCEwYBhgLKtQDAL1OcqzuB77lJ7wYK1Ty_U4RF8fZYHeugLZaqKML-MNfScybFOCxXksBYyhdF4KgEHMk7IAn66wmW-nWgrrzb4pTwzjDG3lWXLjGmXod5cWAfUhzf6eOmTy_jWS2tqvsXIzgyiLZJYx0h5qFWx-YcovvpVSJWdXpQ2jNtPYgSI0GPfz3X8HexQMpnjcAQHRWUavb91lCE17EXUdtp8RceRfzdZEbTziedBG2I9V5FOaMvSwEhet0fka7o_b73nfF-w4IRp628nXksrcKPbTOSksoH3MIMwzdhLcb0NrAvxgQjXnYbgB2oc1oeoofoq0SYwC1PrqP2Ou3So-ex98-f4i83NjorrMcglKEbnif433YtCbUJ9DQiYCxF39XhZ_UeJ8ARV1axQ4Jy-qy12uujnPjpW0KRyb_hG2TY0iCiaeqrPmUGW4xF70StOTzZbAxBl3ta_ziNi4o9p0GTyg_rRtzRkJM5t5TdfZxq_4iD6FMKWm6XIhD1MoOMmksxvAxda50yh13PBBrRhU8c3sgAhny-J4pGOdzuWfnCNFVWeV79KnyU-tJsmYAPqanJO0-BUJR56EUaFXY62Ln6No4dwkkJf0jAcGxdwgP84Y9Fe6eNqr8MOL06vsF/w140-h140-p/IMG_2001.JPG"

        $('#avatar').attr('src', photoURL)
        // $('#avatar').attr('src', 'imagenes/usuario_auth.png')
        Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000)
      } else {
        firebase.auth().signOut()
        Materialize.toast(`Por favor verifica tu correo.`, 5000)

      }
    })
    $('.modal').modal('close')
  }

  crearCuentaEmailPass(email, password, nombres) {
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(result => {
      result.user.updateProfile({
        displayName: nombres,
      })

      const configuracion = {
        url : 'http://localhost:3000/'
      }

      result.user.sendEmailVerification(configuracion).catch(error => {
        console.error(error)
        Materialize.toast(error.message, 4000)
      })

      firebase.auth().signOut()
      Materialize.toast(`Bienvenido ${nombres} debes realizar el proceso de verificación`, 4000)
      
      $('.modal').modal('close')

    })
    .catch(error => {
      console.error(error)
      Materialize.toast(error.message, 4000)
    })
  }

  authCuentaGoogle () {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      $('#avatar').attr('src', result.user.photoURL)
      $('.modal').modal('close')
      Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
    })
    .catch(error => {
      console.error(error);
      Materialize.toast(`Error al autenticarse con Google. Error: ${error} `, 4000)
    })
    
  }

  authCuentaFacebook () {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log("User: ",result.user);
      $('#avatar').attr('src', result.user.photoURL)
      $('.modal').modal('close')
      Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
    })
    .catch(error => {
      console.error(error);
      Materialize.toast(`Error al autenticarse con Facebook. Error: ${error} `, 4000)
    })
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }
}
