function signUp() {
  const firstName = document.getElementById("firstName").value;
  const secondName = document.getElementById("secondName").value;

  const emailSignUp = document.getElementById("emailSignUp").value;
  const passwordSignUp = document.getElementById("passwordSignUp").value;

  const gender = document.getElementById("gender").value;

  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  const rememberMe = document.getElementById("rememberMeSignUp");

  const userId = getRandId();

  if (firstName !== '' || 
      secondName !== '' ||
      emailSignUp !== '' ||
      passwordSignUp !== '' ||
      year !== '') {
    firebase.auth().createUserWithEmailAndPassword(emailSignUp, passwordSignUp).then(() => {
      firebase.database().ref(`users/${userId}`).set({
        firstName: firstName,
        secondName: secondName,
        email: emailSignUp,
        password: passwordSignUp,
        gender: gender,
        day: day,
        month: month,
        year: year,
        userId: userId,
      }).then(() => {
        if (rememberMe.checked) {
          localStorage.setItem("rememberMeLAR", "true");
        }

        localStorage.setItem("emailLAR", emailSignUp);
        localStorage.setItem("nameLAR", firstName);
        localStorage.setItem("userIdLAR", userId);
        localStorage.setItem("surnameLAR", secondName);

        update();

        $('#signUp').modal('hide');

        console.log("Пользователь добавлен в базу данных!");
      }).catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка регистрации!',
          text: 'Возможно пользователь уже зарегистрирован!',
        });
      });
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка регистрации!',
        text: 'Возможно пользователь уже зарегистрирован!',
      });
    });
  }
}

function signIn() {
  const email = document.getElementById('emailSignIn').value;
  const password = document.getElementById('passwordSignIn').value;
  const rememberMe = document.getElementById("rememberMeSignIn");

  firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
    if (rememberMe.checked) {
      localStorage.setItem("rememberMeLAR", "true");
    }

    firebase.database().ref(`users/`).get().then((snapshot) => {
      for (key in snapshot.val()) {
        firebase.database().ref(`users/${key}`).get().then((snapshot) => {
          const firstNameDb = snapshot.val().firstName;
          const secondNameDb = snapshot.val().secondName;
          const emailDb = snapshot.val().email;

          if (emailDb === email) {
            localStorage.setItem("emailLAR", email);
            localStorage.setItem("nameLAR", firstNameDb);
            localStorage.setItem("surnameLAR", secondNameDb);   
          }
        });
      }
    });

    $('#signIn').modal('hide');
  }).catch((error) => {
    console.log(error);
    Swal.fire({
      icon: 'error',
      title: 'Ошибка входа!',
      text: 'Проверьте введенные вами данные!',
    })
  });
}

function signOut() {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem("rememberMe");

    location.reload();
  });
}

function resetPassword() {
  const auth = firebase.auth();
  const emailResetPassword = document.getElementById('emailResetPassword').value;

  auth.sendPasswordResetEmail(emailResetPassword).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Письмо отправлено на вашу почту!',
    });
  }).catch(() => {
    Swal.fire({
      icon: 'error',
      title: 'Ой, что-то не так!',
      text: 'Проверьте написанную почту!',
    });
  });  
}