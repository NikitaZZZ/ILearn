const rememberMeLc = localStorage.getItem("rememberMeLAR");
let itCounter = 0;
let newsCounter = 0;
let humorCounter = 0;
let travelCounter = 0;
let sportCounter = 0;
let cinemaCounter = 0;
let scienceCounter = 0;
let photoCounter = 0;
let musicCounter = 0;

if (rememberMeLc != null) {
  update();
}

function update() {
  const emailUser = localStorage.getItem("emailLAR");
  let firstName = localStorage.getItem('nameLAR');
  let secondName = localStorage.getItem('surnameLAR');

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // Изменяем background
      document.body.style.backgroundImage = "url('img/forest-branch-green-jungle-fauna-vegetation-135323-pxhere.com.jpg')";

      // Удаляем основные дивы, если юзер вошел или зарегистрировался
      const lDiv = document.getElementById("left-div")
      lDiv.parentNode.removeChild(lDiv);
  
      const rDiv = document.getElementById("right-div");
      rDiv.parentNode.removeChild(rDiv);
  
      //Добавляем новые дивы
      const forNav = document.getElementById("nav");

      forNav.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              <img src="img/lar.png" width="30" height="30" class="d-inline-block align-top" alt="" loading="lazy">
              LearnAndRead
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbar">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item active">
                  <a class="nav-link active" href="#">Главная</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="link-profile" data-bs-toggle="collapse" data-bs-target="#profileDiv">Профиль</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="link-tematics" data-bs-toggle="collapse" data-bs-target="#tematicsDiv">Тематики</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="link-lenta" data-bs-toggle="collapse" data-bs-target="#lentaDiv">Лента</a>
                </li>
              </ul>
              <form class="d-flex">
                <span class="navbar-text me-2" id="hello-name"></span>

                <button type="button" class="btn btn-outline-success my-2 my-sm-0 ml-2" data-bs-toggle="modal" data-bs-target="#newPost">
                  Новый пост <i class="fas fa-plus"></i>
                </button>  
              </form>
            </div>
          </div>
        </nav>

        <div class="modal fade" id="newPost" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content bg-dark">
              <div class="modal-header">
                <h5 class="modal-title text-white" id="newPostTitle">Создать пост</h5>
                <button type="button" class="close" id="close" data-bs-dismiss="modal" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body text-white">
                <div class="form-group">
                  <label for="namePost">Название</label>
                  <input type="text" class="form-control bg-dark text-white text-center" id="namePost">
                </div>
                <div class="form-group">
                  <label for="textareaPost">Текст</label>
                  <textarea class="form-control bg-dark text-white" id="textareaPost"></textarea>
                </div>
                <div class="form-group">
                  <label for="selectTematic">Выберите тематику</label>
                  <select class="form-control bg-dark text-white" id="selectTematic">
                    <option>IT</option>
                    <option>Новости</option>
                    <option>Юмор</option>
                    <option>Туризм</option>
                    <option>Спорт</option>
                    <option>Кино</option>
                    <option>Наука</option>
                    <option>Фото</option>
                    <option>Музыка</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                <button type="button" class="btn btn-success" id="createPost" onclick="createPost()">Создать</button>
              </div>
            </div>
          </div>
        </div>

        <div style="float: left;">
          <div class="collapse p-4 collapse" id="profileDiv">
            <div class="card text-white bg-dark" style="width: 18rem;">
              <div class="card-body">
                <h4 class="card-title" id="profile-name"></h4>
                <h6 class="card-subtitle mb-2 text-muted" id="profile-email"></h6>
                <h6 class="card-subtitle mb-2 text-muted" id="profile-gender"></h6>
                <a href="#" class="card-link" id="profile-birthday"></a>
              </div>
              <div class="card-footer">
                <button class="btn btn-outline-danger" onclick="signOut()">
                  Выйти из профиля
                  <i class="fas fa-sign-out-alt" id="signOut"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="collapse p-4 collapse" id="tematicsDiv">
            <div class="bg-dark text-white" id="tematics">
              <ul class="list-group">
                <button onclick="renderTematic('IT')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  IT
                  <span class="badge bg-primary rounded-pill" id="itCounter"></span>
                </button>
                <button onclick="renderTematic('Новости')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Новости
                  <span class="badge bg-primary rounded-pill" id="newsCounter"></span>
                </button>
                <button onclick="renderTematic('Юмор')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Юмор
                  <span class="badge bg-primary rounded-pill" id="humorCounter"></span>
                </button>
                <button onclick="renderTematic('Туризм')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Туризм
                  <span class="badge bg-primary rounded-pill" id="travelCounter"></span>
                </button>
                <button onclick="renderTematic('Спорт')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Спорт
                  <span class="badge bg-primary rounded-pill" id="sportCounter"></span>
                </button>
                <button onclick="renderTematic('Кино')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Кино
                  <span class="badge bg-primary rounded-pill" id="cinemaCounter"></span>
                </button>
                <button onclick="renderTematic('Наука')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Наука
                  <span class="badge bg-primary rounded-pill" id="scienceCounter"></span>
                </button>
                <button onclick="renderTematic('Фото')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Фото
                  <span class="badge bg-primary rounded-pill" id="photoCounter"></span>
                </button>
                <button onclick="renderTematic('Музыка')" class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                  Музыка
                  <span class="badge bg-primary rounded-pill" id="musicCounter"></span>
                </button>
              </ul>
            </div>
          </div>
        </div>

        <div class="collapse p-4 active collapse show" id="lentaDiv"></div>
      `;

      const lentaDiv = document.getElementById('lentaDiv');

      firebase.database().ref('posts/').on('child_added', (data) => {
        const nameAuthor = data.val().nameAuthor;
        const surnameAuthor = data.val().surnameAuthor;

        const namePost = data.val().name;
        const textPost = data.val().text;
        const tematicPost = data.val().tematic;

        const idPost = data.val().id;

        const likes = data.val().likes;
        const dislikes = data.val().dislikes;

        const day = data.val().date.day;
        const month = data.val().date.month;
        const year = data.val().date.year;

        switch (tematicPost) {
          case 'IT': itCounter += 1; break;
          case 'Новости': newsCounter += 1; break;
          case 'Юмор': humorCounter += 1; break;
          case 'Туризм': travelCounter += 1; break;
          case 'Спорт': sportCounter += 1; break;
          case 'Кино': cinemaCounter += 1; break;
          case 'Наука': scienceCounter += 1; break;
          case 'Фото': photoCounter += 1; break;
          case 'Музыка': musicCounter += 1; break;
        }

        document.getElementById('itCounter').innerHTML = itCounter;
        document.getElementById('newsCounter').innerHTML = newsCounter;
        document.getElementById('humorCounter').innerHTML = humorCounter;
        document.getElementById('travelCounter').innerHTML = travelCounter;
        document.getElementById('sportCounter').innerHTML = sportCounter;
        document.getElementById('cinemaCounter').innerHTML = cinemaCounter;
        document.getElementById('scienceCounter').innerHTML = scienceCounter;
        document.getElementById('photoCounter').innerHTML = photoCounter;
        document.getElementById('musicCounter').innerHTML = musicCounter;

        lentaDiv.innerHTML += `
          <div class="card text-white bg-dark post" style="width: 20rem;">
            <div class="card-body">
              <h6 class="card-subtitle text-muted" style="float: right">${day}.${month}.${year}</h6>
              <h5 class="card-title">${namePost}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${nameAuthor} ${surnameAuthor}</h6>
              <p class="card-text">${textPost}</p>
            </div>
            <div class="collapse" id="comments${idPost}">
              <div id="innerComments${idPost}"></div>
              <form>
                <div class="input-group">
                  <input type="text" class="form-control bg-dark text-white" id="commentInput${idPost}" placeholder="Комментарий...">
                  <button class="btn btn-outline-dark text-white" type="button" id="button-comment" onclick="postComment('${idPost}', '${firstName}', '${secondName}')">Написать</button>
                </div>
              </form>
            </div>
            <div class="card-footer">
              <a href="#" class="card-link likePost" id="likePost${idPost}" onclick="likePost(${idPost})"><i class="far fa-heart" id="likePostIcon${idPost}"></i> ${likes}</a>
              <a href="#" class="card-link dislikePost" id="dislikePost${idPost}" onclick="dislikePost(${idPost})"><i class="far fa-thumbs-down" id="dislikePostIcon${idPost}"></i> ${dislikes}</a>
              <a data-bs-toggle="collapse" href="#comments${idPost}" class="card-link" id="commentsPost" style="float: right;"><i class="far fa-comments" id="iconComments"></i> Комментарии</a>
            </div>
          </div>
        `;

        const commentsDiv = document.getElementById(`innerComments${idPost}`);
        firebase.database().ref(`posts/${idPost}/comments`).on('child_added', (data) => {
          const name = data.val().name;
          const surname = data.val().surname;
          const comment = data.val().comment;

          commentsDiv.innerHTML += `
            <div class="card text-white bg-dark comment m-auto mb-2" style="width: 19rem;">
              <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">${name} ${surname}</h6>
                <p class="card-text">${comment}</p>
              </div>
            </div>
          `;
        });

        if (localStorage.getItem(`emotions${idPost}`) == 'like') {
          const likePostElem = document.getElementById(`likePostIcon${idPost}`);
          const dislikePostElem = document.getElementById(`dislikePostIcon${idPost}`);
    
          likePostElem.className = 'fas fa-heart';
    
          likePostElem.addEventListener('click', () => { console.log('помойка ебаная') });
          dislikePostElem.addEventListener('click', () => { dislikePost(idPost) });
        } else if (localStorage.getItem(`emotions${idPost}`) == 'dislike') {
          const likePostElem = document.getElementById(`likePostIcon${idPost}`);
          const dislikePostElem = document.getElementById(`dislikePostIcon${idPost}`);
    
          dislikePostElem.className = 'fas fa-thumbs-down';
    
          likePostElem.addEventListener('click', () => { likePost(idPost) });
          dislikePostElem.addEventListener('click', () => { console.log('помойка ебаная') });
        }
      });

      // nav
      const helloName = document.getElementById("hello-name");

      // profile div
      const profileName = document.getElementById("profile-name");
      const profileEmail = document.getElementById("profile-email");
      const profileGender = document.getElementById("profile-gender");
      const profileBirthday = document.getElementById("profile-birthday");

      firebase.database().ref(`users/`).get().then((snapshot) => {
        for (key in snapshot.val()) {
          firebase.database().ref(`users/${key}`).get().then((snapshot) => {
            if (emailUser == snapshot.val().email) {
              let month;

              switch (snapshot.val().month) {
                case 'Январь': month = '01'; break;
                case 'Февраль': month = '02'; break;
                case 'Март': month = '03'; break;
                case 'Апрель': month = '04'; break;
                case 'Май': month = '05'; break;
                case 'Июнь': month = '06'; break;
                case 'Июль': month = '07'; break;
                case 'Август': month = '08'; break;
                case 'Сентябрь': month = '09'; break;
                case 'Октябрь': month = '10'; break;
                case 'Ноябрь': month = '11'; break;
                case 'Декабрь': month = '12'; break;
              }
      
              helloName.innerHTML = `Привет, ${snapshot.val().firstName}!`;
      
              profileName.innerHTML = `${snapshot.val().firstName} ${snapshot.val().secondName}`;
              profileEmail.innerHTML = `Email: ${snapshot.val().email}`;
              profileGender.innerHTML = `Пол: ${snapshot.val().gender}`;
              profileBirthday.innerHTML = `День рождения: ${snapshot.val().day}.${month}.${snapshot.val().year}`;
            }
          });
        }
      });
    } else {
      console.log("Пользователь не зарегистрирован или не вошел");
    }
  });
}

function renderTematic(tematic) {
  lentaDiv.innerHTML = ``;

  firebase.database().ref('posts/').get().then((snapshot) => {
    for (key in snapshot.val()) {
      firebase.database().ref(`posts/${key}`).get().then((snapshot) => {
        const nameAuthor = snapshot.val().nameAuthor;
        const surnameAuthor = snapshot.val().surnameAuthor;
    
        const namePost = snapshot.val().name;
        const textPost = snapshot.val().text;
        const tematicPost = snapshot.val().tematic;
    
        const idPost = snapshot.val().id;
    
        const likes = snapshot.val().likes;
        const dislikes = snapshot.val().dislikes;
    
        const day = snapshot.val().date.day;
        const month = snapshot.val().date.month;
        const year = snapshot.val().date.year;
    
        if (tematic == tematicPost) {
          lentaDiv.innerHTML += `
            <div class="card text-white bg-dark post" style="width: 20rem;">
              <div class="card-body">
                <h6 class="card-subtitle text-muted" style="float: right">${day}.${month}.${year}</h6>
                <h5 class="card-title">${namePost}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${nameAuthor} ${surnameAuthor}</h6>
                <p class="card-text">${textPost}</p>
              </div>
              <div class="collapse" id="comments${idPost}">
                <div id="innerComments${idPost}"></div>
                <form>
                  <div class="input-group">
                    <input type="text" class="form-control bg-dark text-white" id="commentInput${idPost}" placeholder="Комментарий...">
                    <button class="btn btn-outline-dark text-white" type="button" id="button-comment" onclick="postComment('${idPost}', '${firstName}', '${secondName}')">Написать</button>
                  </div>
                </form>
              </div>
              <div class="card-footer">
                <a href="#" class="card-link likePost" id="likePost${idPost}" onclick="likePost(${idPost})"><i class="far fa-heart" id="likePostIcon${idPost}"></i> ${likes}</a>
                <a href="#" class="card-link dislikePost" id="dislikePost${idPost}" onclick="dislikePost(${idPost})"><i class="far fa-thumbs-down" id="dislikePostIcon${idPost}"></i> ${dislikes}</a>
                <a data-bs-toggle="collapse" href="#comments${idPost}" class="card-link" id="commentsPost" style="float: right;"><i class="far fa-comments" id="iconComments"></i> Комментарии</a>
              </div>
            </div>
          `;
  
          firebase.database().ref(`posts/${idPost}/comments/`).get().then((snapshot) => {
            for (key in snapshot.val()) {
              firebase.database().ref(`posts/${idPost}/comments/${key}`).get().then((snapshot) => {
                const name = snapshot.val().name;
                const surname = snapshot.val().surname;
                const comment = snapshot.val().comment;

                const commentsDiv = document.getElementById(`innerComments${idPost}`);
                commentsDiv.innerHTML += `
                  <div class="card text-white bg-dark comment m-auto mb-2" style="width: 19rem;">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2 text-muted">${name} ${surname}</h6>
                      <p class="card-text">${comment}</p>
                    </div>
                  </div>
                `;  
              });
            }
          });
        }
    
        if (localStorage.getItem(`emotions${idPost}`) == 'like') {
          const likePostElem = document.getElementById(`likePostIcon${idPost}`);
    
          likePostElem.className = 'fas fa-heart';
        } else if (localStorage.getItem(`emotions${idPost}`) == 'dislike') {
          const dislikePostElem = document.getElementById(`dislikePostIcon${idPost}`);
    
          dislikePostElem.className = 'fas fa-thumbs-down';
        }
      });
    }
  });
}

function postComment(idPost, name, surname) {
  const commentInput = document.getElementById(`commentInput${idPost}`).value;
  const commentId = getRandId();

  firebase.database().ref(`posts/${idPost}/comments/comment${commentId}`).set({
    comment: commentInput,
    name: name,
    surname: surname,
  });
}

function likePost(idPost) {
  if (localStorage.getItem(`emotions${idPost}`) == 'dislike') {
    firebase.database().ref(`posts/${idPost}`).get().then((snapshot) => { 
      likes = snapshot.val().likes;
      likes += 1;
  
      dislikes = snapshot.val().dislikes;
      dislikes -= 1;
    }).then(() => {
      firebase.database().ref(`posts/${idPost}/likes`).set(likes);
      firebase.database().ref(`posts/${idPost}/dislikes`).set(dislikes);
  
      const likePostElem = document.getElementById(`likePost${idPost}`)
      const dislikePostElem = document.getElementById(`dislikePost${idPost}`)
  
      likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
      dislikePostElem.innerHTML = `<i class="far fa-thumbs-down"></i> ${dislikes}`;
  
      localStorage.setItem(`emotions${idPost}`, 'like');
    });
  } else if (localStorage.getItem(`emotions${idPost}`) == null) {
    firebase.database().ref(`posts/${idPost}`).get().then((snapshot) => { 
      likes = snapshot.val().dislikes;
      likes += 1;
    }).then(() => {
      firebase.database().ref(`posts/${idPost}/likes`).set(likes);
  
      const likePostElem = document.getElementById(`likePost${idPost}`)
      likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
  
      localStorage.setItem(`emotions${idPost}`, 'like');
    });
  }
}

function dislikePost(idPost) {
  if (localStorage.getItem(`emotions${idPost}`) == 'like') {
    firebase.database().ref(`posts/${idPost}`).get().then((snapshot) => { 
      dislikes = snapshot.val().dislikes;
      dislikes += 1;
  
      likes = snapshot.val().likes;
      likes -= 1;
    }).then(() => {
      firebase.database().ref(`posts/${idPost}/likes`).set(likes);
      firebase.database().ref(`posts/${idPost}/dislikes`).set(dislikes);
  
      const likePostElem = document.getElementById(`likePost${idPost}`)
      const dislikePostElem = document.getElementById(`dislikePost${idPost}`)
  
      likePostElem.innerHTML = `<i class="far fa-heart"></i> ${likes}`;
      dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;
  
      localStorage.setItem(`emotions${idPost}`, 'dislike');
    });
  } else if (localStorage.getItem(`emotions${idPost}`) == null) {
    firebase.database().ref(`posts/${idPost}`).get().then((snapshot) => { 
      dislikes = snapshot.val().dislikes;
      dislikes += 1;
    }).then(() => {
      firebase.database().ref(`posts/${idPost}/dislikes`).set(dislikes);
  
      const dislikePostElem = document.getElementById(`dislikePost${idPost}`)
      dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;
  
      localStorage.setItem(`emotions${idPost}`, 'dislike');
    });
  }
}