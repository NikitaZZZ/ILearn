const date = new Date();

window.onload = () => {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user == null) {
        Swal.mixin({
            showDenyButton: true,
            confirmButtonText: 'Да',
            denyButtonText: 'Нет',
            progressSteps: ['1', '2'],
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).queue([
            'Вы зарегистрированы?', // question 1
            { // question 2
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonText: 'Я - Учитель',
                denyButtonText: 'Я - Ученик',
            },
        ]).then((result) => {
            if (result.value) {
                const answers = result.value;
    
                if (answers[0] === true /* зареган */ && answers[1] === true /* учитель */) {
                    ILVue.signInTeacher();
                } else if (answers[0] === false /* не зареган */ && answers[1] === true /* учитель */) {
                    ILVue.signUpTeacher();
                } else if (answers[0] === true /* зареган */ && answers[1] === false /* ученик */) {
                    ILVue.signInStudent();
                } else if (answers[0] === false /* не зареган */ && answers[1] === false /* ученик */) {
                    ILVue.signUpStudent();
                }
            }
        });
    } else if (user.who === 'teacher') {
        const studentDiv = document.querySelector('.main-app-student');
        studentDiv.parentNode.removeChild(studentDiv);

        ILVue.logIn = true;
        ILVue.currentUser = 'teacher';
        document.querySelector('.main-app-teacher').style.display = 'block';
        startTeacherApp();
        innerNews();
        chatWithStudents();
    } else if (user.who === 'student') {
        const teacherDiv = document.querySelector('.main-app-teacher');
        teacherDiv.parentNode.removeChild(teacherDiv);

        ILVue.logIn = true;
        ILVue.currentUser = 'student';
        document.querySelector('.main-app-student').style.display = 'block';
        startStudentApp();
        innerNews();
        chatWithTeachersAndStudents();
    }
}

Vue.component('teacher-app', {
    template: `
        <div class="container mt-3 main-app-teacher" style="display: none;">
            <div class="row">
                <div class="col-sm mt-3" id="profile">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title" id="profile-name"></h4>
                            <p class="card-subtitle mb-2 text-muted" id="profile-who">Учитель</p>
                            <a data-bs-toggle="offcanvas" data-bs-target="#myClass" title="Мой класс" class="card-link" id="profile-class"></a>
                            <a class="text-muted" id="profile-school"></a>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-outline-danger" onclick="signOutTeacher()">
                                Выйти из профиля
                                <i class="fas fa-sign-out-alt" id="signOut"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-sm mt-3" id="news">
                    <form>
                        <div class="input-group mb-2">
                            <input type="text" class="form-control" id="name-news" placeholder="Имя новости">
                            <button type="button" class="btn btn-outline-success" id="btn-create-news" data-bs-toggle="collapse" data-bs-target="#createNewNews">Далее</button>
                        </div>
                        <div class="collapse" id="createNewNews">
                            <form>
                                <div class="row mb-3">
                                    <label for="text-news" class="col-sm-2 col-form-label">Текст</label>
                                    <div class="col-sm-10">
                                        <textarea class="form-control" id="text-news"></textarea>
                                    </div>
                                </div>
                                <fieldset class="row mb-3">
                                    <legend class="col-form-label col-sm-2 pt-0">Показ</legend>
                                    <div class="col-sm-10">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="gridRadios" id="showNewsForAll" value="option1" checked>
                                            <label class="form-check-label" for="showNewsForAll">
                                                Для всех
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="gridRadios" id="showNewsForClass" value="option2">
                                            <label class="form-check-label" for="showNewsForClass">
                                                Только для моего класса
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                                <div class="row mb-3">
                                    <div class="col-sm-10 offset-sm-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="showMyNameNews">
                                            <label class="form-check-label" for="showMyNameNews">
                                                Показывать мое имя
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-success mb-2" onclick="createNews()">Создать</button>
                            </form>
                        </div>
                    </form>
                    <div id="news"></div>
                </div>
                <div class="col-sm mt-3 text-center" id="services">
                    <div class="list-group">
                        <a href="../itests/admin.html" target="_blank" class="list-group-item list-group-item-action" aria-current="true">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <img alt="icon" src="../itests/img/pizap.png" style="border-radius: 20px; width: 30px; height: 30px;" class="d-inline-block align-text-top">
                                    ITests
                                </h5>
                                <small class="text-muted">Открыть</small>
                            </div>
                            <p class="mb-1">Создавайте тесты для учеников.</p>
                        </a>
                        <a data-bs-toggle="modal" data-bs-target="#todoapp" style="cursor: pointer" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <img alt="icon" src="../todo-list/public/bg.png" style="border-radius: 20px; width: 30px; height: 30px;" class="d-inline-block align-text-top">
                                    To Do List
                                </h5>
                                <small class="text-muted">Открыть</small>
                            </div>
                            <p class="mb-1">Создавайте заметки, чтобы не забывать важные вещи.</p>
                        </a>
                        <a href="../todo-list/public/index.html" style="cursor: pointer" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <img alt="icon" src="../Social-Network/img/lar_black.png" style="width: 30px; height: 30px;" class="d-inline-block align-text-top">
                                    LAR Chat
                                </h5>
                                <small class="text-muted">Открыть</small>
                            </div>
                            <p class="mb-1">Общайтесь с учениками.</p>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="chat" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div id="chatUI">
                            <ol class="list-group" style="padding: 0;" id="chats"></ol>
                        </div>
                    </div>
                </div>
            </div>

            <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="myClass" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="myClassTitle">Мой класс: 9Г</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
                </div>
                <div class="offcanvas-body">
                    <small class="offcanvas-text text-muted">Показаны только зарегистрированные ученики</small>

                    <ol class="list-group list-group-numbered" id="myClassList"></ol>
                </div>
            </div>
        </div>
    `,
});

Vue.component('student-app', {
    template: `
        <div class="container mt-3 main-app-student" style="display: none;">
            <div class="row">
                <div class="col-sm mt-3" id="profile">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title" id="profile-name-student"></h4>
                            <p class="card-subtitle mb-2 text-muted" id="profile-who">Ученик</p>
                            <a class="card-link" id="profile-class-student"></a>
                            <a class="text-muted" id="profile-school-student"></a>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-outline-danger" onclick="signOutStudent()">
                                Выйти из профиля
                                <i class="fas fa-sign-out-alt" id="signOut"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-sm mt-3">
                    <div id="news"></div>
                </div>
                <div class="col-sm mt-3 text-center" id="services">
                    <div class="list-group">
                        <a href="../itests/admin.html" target="_blank" class="list-group-item list-group-item-action" aria-current="true">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <img alt="icon" src="../itests/img/pizap.png" style="border-radius: 20px; width: 30px; height: 30px;" class="d-inline-block align-text-top">
                                    ITests
                                </h5>
                                <small class="text-muted">Открыть</small>
                            </div>
                            <p class="mb-1">Проходите тесты от ваших учителей.</p>
                        </a>
                        <a data-bs-toggle="modal" data-bs-target="#chat" style="cursor: pointer" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <img alt="icon" src="../Social-Network/img/lar_black.png" style="width: 30px; height: 30px;" class="d-inline-block align-text-top">
                                    LAR Chat
                                </h5>
                                <small class="text-muted">Открыть</small>
                            </div>
                            <p class="mb-1">Общайтесь с учителем или с вашими одноклассниками.</p>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="chat" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div id="chatUI">
                            <ol class="list-group" style="padding: 0;" id="chatsTeachers"></ol>     
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
});

function startTeacherApp() {
    const user = JSON.parse(localStorage.getItem('user'));

    window.onblur = () => {
        firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/isOnline`).set(false);
    }

    window.onfocus = () => {
        firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/isOnline`).set(true);
    }

    firebase.database().ref(`school${user.school}/teachers/teacher${user.code}`).get().then((snapshot) => {
        const fullName = snapshot.val().fullName;
        const school = snapshot.val().school;
        const klass = snapshot.val().teacherClass;
        // const teacherId = snapshot.val().teacherId;

        document.getElementById('profile-name').innerHTML = fullName;
        document.getElementById('profile-class').innerHTML = `Мой класс: ${klass}`;
        document.getElementById('profile-school').innerHTML = `/ Школа №${school}`;

        firebase.database().ref(`school${user.school}/students`).on('child_added', (data) => {
            const fullName = data.val().fullName;

            document.getElementById('myClassList').innerHTML += `
                <li class="list-group-item">${fullName}</li>
            `;
        });
    });
}

function startStudentApp() {
    let user = JSON.parse(localStorage.getItem('user'));

    window.onblur = () => {
        firebase.database().ref(`school${user.school}/students/student${user.fullName.toLowerCase().trim()} ${user.klass.toLowerCase().trim()}/isOnline`).set(false);
    }

    window.onfocus = () => {
        firebase.database().ref(`school${user.school}/students/student${user.fullName.toLowerCase().trim()} ${user.klass.toLowerCase().trim()}/isOnline`).set(true);
    }

    console.log(`school${user.school}/students/student${user.fullName.toLowerCase().trim()} ${user.klass.toLowerCase().trim()}`);
    firebase.database().ref(`school${user.school}/students/student${user.fullName.toLowerCase().trim()} ${user.klass.toLowerCase().trim()}`).get().then((snapshot) => {
        const fullName = snapshot.val().fullName;
        const school = snapshot.val().school;
        const klass = snapshot.val().klass;
        // const teacherId = snapshot.val().teacherId;

        document.getElementById('profile-name-student').innerHTML = fullName;
        document.getElementById('profile-class-student').innerHTML = `Я учусь в ${klass} классе`;
        document.getElementById('profile-school-student').innerHTML = `/ Школа №${school}`;
    });
}

function innerNews() {
    const user = JSON.parse(localStorage.getItem('user'));

    firebase.database().ref(`school${user.school}/news/`).on('child_added', (data) => {
        const nameNews = data.val().nameNews;
        const textNews = data.val().textNews;
        const fullName = data.val().fullName;
        const newsId = data.val().newsId;
        const likes = data.val().likes;
        const dislikes = data.val().dislikes;
        const day = data.val().date.day;
        const month = data.val().date.month;
        const year = data.val().date.year;

        if (fullName === undefined) {
            document.getElementById('news').innerHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-subtitle text-muted" style="float: right">${day}.${month}.${year}</h6>
                        <h5 class="card-title">${nameNews}</h5>
                        <p class="card-text">${textNews}</p>
                    </div>
                    <div class="collapse" id="comments${newsId}">
                        <div id="innerComments${newsId}"></div>
                        <form>
                            <div class="input-group">
                                <input type="text" class="form-control" id="commentInput${newsId}" placeholder="Комментарий...">
                                <button class="btn btn-outline-success" type="button" id="button-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}')">Написать</button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="card-link likePost" id="likePost${newsId}" onclick="likePost(${newsId}, '${user.school}')"><i class="far fa-heart" id="likePostIcon${newsId}"></i> ${likes}</a>
                        <a href="#" class="card-link dislikePost" id="dislikePost${newsId}" onclick="dislikePost(${newsId}, '${user.school}')"><i class="far fa-thumbs-down" id="dislikePostIcon${newsId}"></i> ${dislikes}</a>
                        <a data-bs-toggle="collapse" href="#comments${newsId}" class="card-link" id="commentsPost" style="float: right;"><i class="far fa-comments" id="iconComments"></i> Комментарии</a>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('news').innerHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-subtitle text-muted" style="float: right">${day}.${month}.${year}</h6>
                        <h5 class="card-title">${nameNews}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${fullName}</h6>
                        <p class="card-text">${textNews}</p>
                    </div>
                    <div class="collapse" id="comments${newsId}">
                        <div id="innerComments${newsId}"></div>
                        <form>
                            <div class="input-group">
                                <input type="text" class="form-control" id="commentInput${newsId}" placeholder="Комментарий...">
                                <button class="btn btn-outline-success" type="button" id="button-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}')">Написать</button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="card-link likePost" id="likePost${newsId}" onclick="likePost(${newsId}, '${user.school}')"><i class="far fa-heart" id="likePostIcon${newsId}"></i> ${likes}</a>
                        <a href="#" class="card-link dislikePost" id="dislikePost${newsId}" onclick="dislikePost(${newsId}, '${user.school}')"><i class="far fa-thumbs-down" id="dislikePostIcon${newsId}"></i> ${dislikes}</a>
                        <a data-bs-toggle="collapse" href="#comments${newsId}" class="card-link" id="commentsPost" style="float: right;"><i class="far fa-comments" id="iconComments"></i> Комментарии</a>
                    </div>
                </div>
            `;
        }

        firebase.database().ref(`school${user.school}/news/${newsId}/comments/`).on('child_added', (snapshot) => {
            const fullName = snapshot.val().fullName;
                    const comment = snapshot.val().comment;

                    const commentsDiv = document.getElementById(`innerComments${newsId}`);
                    commentsDiv.innerHTML += `
                        <div class="card comment m-auto mb-2">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">${fullName}</h6>
                                <p class="card-text">${comment}</p>
                            </div>
                        </div>
                    `;
        });
    
        if (localStorage.getItem(`emotions${newsId}`) === 'like') {
          const likePostElem = document.getElementById(`likePostIcon${newsId}`);
    
          likePostElem.className = 'fas fa-heart';
        } else if (localStorage.getItem(`emotions${newsId}`) === 'dislike') {
          const dislikePostElem = document.getElementById(`dislikePostIcon${newsId}`);
    
          dislikePostElem.className = 'fas fa-thumbs-down';
        }
    });

    try {
        userClass = `${user.myClass[0]}${user.myClass = user.myClass[1].toUpperCase()}`;
    } catch {
        userClass = `${user.klass[0]}${user.klass = user.klass[1].toUpperCase()}`
    }

    firebase.database().ref(`school${user.school}/news${userClass}/`).on('child_added', (data) => {
        const nameNews = data.val().nameNews;
        const textNews = data.val().textNews;
        const fullName = data.val().fullName;
        const newsId = data.val().newsId;
        const likes = data.val().likes;
        const dislikes = data.val().dislikes;
        const day = data.val().date.day;
        const month = data.val().date.month;
        const year = data.val().date.year;

        if (fullName === undefined) {
            document.getElementById('news').innerHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-subtitle text-muted" style="float: right">${day}.${month}.${year}</h6>
                        <h5 class="card-title">${nameNews}</h5>
                        <p class="card-text">${textNews}</p>
                    </div>
                    <div class="collapse" id="comments${newsId}">
                        <div id="innerComments${newsId}"></div>
                        <form>
                            <div class="input-group">
                                <input type="text" class="form-control" id="commentInput${newsId}" placeholder="Комментарий...">
                                <button class="btn btn-outline-success" type="button" id="button-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}', '${userClass}')">Написать</button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="card-link likePost" id="likePost${newsId}" onclick="likePost(${newsId}, '${user.school}', '${userClass}')"><i class="far fa-heart" id="likePostIcon${newsId}"></i> ${likes}</a>
                        <a href="#" class="card-link dislikePost" id="dislikePost${newsId}" onclick="dislikePost(${newsId}, '${user.school}', '${userClass}')"><i class="far fa-thumbs-down" id="dislikePostIcon${newsId}"></i> ${dislikes}</a>
                        <a data-bs-toggle="collapse" href="#comments${newsId}" class="card-link" id="commentsPost" style="float: right;"><i class="far fa-comments" id="iconComments"></i> Комментарии</a>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('news').innerHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-subtitle text-muted" style="float: right">${day}.${month}.${year}</h6>
                        <h5 class="card-title">${nameNews}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${fullName}</h6>
                        <p class="card-text">${textNews}</p>
                    </div>
                    <div class="collapse" id="comments${newsId}">
                        <div id="innerComments${newsId}"></div>
                        <form>
                            <div class="input-group">
                                <input type="text" class="form-control" id="commentInput${newsId}" placeholder="Комментарий...">
                                <button class="btn btn-outline-success" type="button" id="button-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}', '${userClass}')">Написать</button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="card-link likePost" id="likePost${newsId}" onclick="likePost(${newsId}, '${user.school}', '${userClass}')"><i class="far fa-heart" id="likePostIcon${newsId}"></i> ${likes}</a>
                        <a href="#" class="card-link dislikePost" id="dislikePost${newsId}" onclick="dislikePost(${newsId}, '${user.school}', '${userClass}')"><i class="far fa-thumbs-down" id="dislikePostIcon${newsId}"></i> ${dislikes}</a>
                        <a data-bs-toggle="collapse" href="#comments${newsId}" class="card-link" id="commentsPost" style="float: right;"><i class="far fa-comments" id="iconComments"></i> Комментарии</a>
                    </div>
                </div>
            `;
        }

        firebase.database().ref(`school${user.school}/news${userClass}/${newsId}/comments/`).on('child_added', (snapshot) => {
            console.log('work?')
                    const fullName = snapshot.val().fullName;
                    const comment = snapshot.val().comment;

                    const commentsDiv = document.getElementById(`innerComments${newsId}`);
                    commentsDiv.innerHTML += `
                        <div class="card comment m-auto mb-2">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted">${fullName}</h6>
                                <p class="card-text">${comment}</p>
                            </div>
                        </div>
                    `;
        });
    
        if (localStorage.getItem(`emotions${newsId}`) === 'like') {
          const likePostElem = document.getElementById(`likePostIcon${newsId}`);
    
          likePostElem.className = 'fas fa-heart';
        } else if (localStorage.getItem(`emotions${newsId}`) === 'dislike') {
          const dislikePostElem = document.getElementById(`dislikePostIcon${newsId}`);
    
          dislikePostElem.className = 'fas fa-thumbs-down';
        }
    });
}

function createNews() {
    const nameNews = document.getElementById('name-news').value;
    const textNews = document.getElementById('text-news').value;

    const showForAll = document.getElementById('showNewsForAll').checked;
    const showForClass = document.getElementById('showNewsForClass').checked;

    const showMyName = document.getElementById('showMyNameNews').checked;

    const user = JSON.parse(localStorage.getItem('user'));

    if (!nameNews || !textNews) {
        Swal.fire({
            icon: 'error',
            title: 'Заполните все поля!',
        });
    } else {
        const newsId = getRandId();

        if (showForAll === true) {
            if (showMyName === true) {
                firebase.database().ref(`school${user.school}/news/${newsId}`).set({
                    nameNews: nameNews,
                    textNews: textNews,
                    fullName: user.fullName,
                    newsId: newsId,
                    likes: 0,
                    dislikes: 0,
                    date: {
                        day: date.getDate(),
                        month: date.getMonth() + 1,
                        year: date.getFullYear(),
                    }
                });
            } else {
                firebase.database().ref(`school${user.school}/news/${newsId}`).set({
                    nameNews: nameNews,
                    textNews: textNews,
                    newsId: newsId,
                    likes: 0,
                    dislikes: 0,
                    date: {
                        day: date.getDate(),
                        month: date.getMonth() + 1,
                        year: date.getFullYear(),
                    }
                });
            }
        } else if (showForClass === true) {
            if (showMyName === true) {
                firebase.database().ref(`school${user.school}/news${user.myClass}/${newsId}`).set({
                    nameNews: nameNews,
                    textNews: textNews,
                    fullName: user.fullName,
                    newsId: newsId,
                    likes: 0,
                    dislikes: 0,
                    date: {
                        day: date.getDate(),
                        month: date.getMonth() + 1,
                        year: date.getFullYear(),
                    }
                });
            } else {
                firebase.database().ref(`school${user.school}/news${user.myClass}/${newsId}`).set({
                    nameNews: nameNews,
                    textNews: textNews,
                    newsId: newsId,
                    likes: 0,
                    dislikes: 0,
                    date: {
                        day: date.getDate(),
                        month: date.getMonth() + 1,
                        year: date.getFullYear(),
                    }
                });
            }
        }
    }
}

function postComment(newsId, fullName, school, klass = '') {
    const commentInput = document.getElementById(`commentInput${newsId}`).value;
    const commentId = getRandId();

    if (klass === '') {
        firebase.database().ref(`school${school}/news/${newsId}/comments/comment${commentId}`).set({
            comment: commentInput,
            fullName: fullName
        });
    } else if (klass !== '') {
        firebase.database().ref(`school${school}/news${klass}/${newsId}/comments/comment${commentId}`).set({
            comment: commentInput,
            fullName: fullName
        });
    }
}

function likePost(newsId, school, klass = '') {
    if (klass === '') {
        if (localStorage.getItem(`emotions${newsId}`) === 'dislike') {
            firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => { 
                likes = snapshot.val().likes;
                likes++;

                dislikes = snapshot.val().dislikes;
                dislikes--;
            }).then(() => {
                firebase.database().ref(`school${school}/news/${newsId}/likes`).set(likes);
                firebase.database().ref(`school${school}/news/${newsId}/dislikes`).set(dislikes);
            
                const likePostElem = document.getElementById(`likePost${newsId}`)
                const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
            
                likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
                dislikePostElem.innerHTML = `<i class="far fa-thumbs-down"></i> ${dislikes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'like');
            });
        } else if (localStorage.getItem(`emotions${newsId}`) == null) {
            firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => {
                likes = snapshot.val().likes;
                likes++;
            }).then(() => {
                firebase.database().ref(`school${school}/news/${newsId}/likes`).set(likes);
            
                const likePostElem = document.getElementById(`likePost${newsId}`)
                likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'like');
            });
        }
    } else if (klass !== '') {
        if (localStorage.getItem(`emotions${newsId}`) === 'dislike') {
            firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => {
                likes = snapshot.val().likes;
                likes++;

                dislikes = snapshot.val().dislikes;
                dislikes--;
            }).then(() => {
                firebase.database().ref(`school${school}/news${klass}/${newsId}/likes`).set(likes);
                firebase.database().ref(`school${school}/news${klass}/${newsId}/dislikes`).set(dislikes);
            
                const likePostElem = document.getElementById(`likePost${newsId}`)
                const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
            
                likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
                dislikePostElem.innerHTML = `<i class="far fa-thumbs-down"></i> ${dislikes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'like');
            });
        } else if (localStorage.getItem(`emotions${newsId}`) == null) {
            firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => {
                likes = snapshot.val().likes;
                likes++;
            }).then(() => {
                firebase.database().ref(`school${school}/news${klass}/${newsId}/likes`).set(likes);
            
                const likePostElem = document.getElementById(`likePost${newsId}`)
                likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'like');
            });
        }
    }
}
  
function dislikePost(newsId, school, klass = '') {
    if (klass === '') {
        if (localStorage.getItem(`emotions${newsId}`) === 'like') {
            firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => { 
                dislikes = snapshot.val().dislikes;
                dislikes++;

                likes = snapshot.val().likes;
                likes--;
            }).then(() => {
                firebase.database().ref(`school${school}/news/${newsId}/likes`).set(likes);
                firebase.database().ref(`school${school}/news/${newsId}/dislikes`).set(dislikes);
            
                const likePostElem = document.getElementById(`likePost${newsId}`)
                const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
            
                likePostElem.innerHTML = `<i class="far fa-heart"></i> ${likes}`;
                dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'dislike');
            });
        } else if (localStorage.getItem(`emotions${newsId}`) == null) {
            firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => { 
                dislikes = snapshot.val().dislikes;
                dislikes++;
            }).then(() => {
                firebase.database().ref(`school${school}/news/${newsId}/dislikes`).set(dislikes);
            
                const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
                dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'dislike');
            });
        }
    } else if (klass !== '') {
        if (localStorage.getItem(`emotions${newsId}`) === 'like') {
            firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => { 
                dislikes = snapshot.val().dislikes;
                dislikes++;
            
                likes = snapshot.val().likes;
                likes--;
            }).then(() => {
                firebase.database().ref(`school${school}/news${klass}/${newsId}/likes`).set(likes);
                firebase.database().ref(`school${school}/news${klass}/${newsId}/dislikes`).set(dislikes);
            
                const likePostElem = document.getElementById(`likePost${newsId}`)
                const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
            
                likePostElem.innerHTML = `<i class="far fa-heart"></i> ${likes}`;
                dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'dislike');
            });
        } else if (localStorage.getItem(`emotions${newsId}`) == null) {
            firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => {
                dislikes = snapshot.val().dislikes;
                dislikes++;
            }).then(() => {
                firebase.database().ref(`school${school}/news${klass}/${newsId}/dislikes`).set(dislikes);
            
                const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
                dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;
            
                localStorage.setItem(`emotions${newsId}`, 'dislike');
            });
        }
    }
}

function signOutTeacher() {
    localStorage.removeItem('user');
    document.querySelector('.main-app-teacher').style.display = 'none';
    ILVue.logIn = false;
    ILVue.currentUser = '';

    location.reload();
}

function signOutStudent() {
    localStorage.removeItem('user');
    document.querySelector('.main-app-student').style.display = 'none';
    ILVue.logIn = false;
    ILVue.currentUser = '';

    location.reload();
}

let ILVue = new Vue({
    el: '#app',

    methods: {
        signUpTeacher: function () {
            Swal.fire({
                title: 'Регистрация аккаунта',
                html: `
                    <input type="text" id="fullNameTeacherSignUp" class="swal2-input" placeholder="Имя и фамилия">
                    <input type="text" id="schoolTeacherSignUp" class="swal2-input" placeholder="Школа">
                    <input type="text" id="yourClassTeacherSignUp" class="swal2-input" placeholder="Ваш класс">
                `,
                confirmButtonText: 'Далее',
                showDenyButton: true,
                denyButtonText: 'Войти',
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    const fullName = Swal.getPopup().querySelector('#fullNameTeacherSignUp').value
                    const school = Swal.getPopup().querySelector('#schoolTeacherSignUp').value
                    const yourClass = Swal.getPopup().querySelector('#yourClassTeacherSignUp').value

                    if (!fullName || !school || !yourClass) {
                        Swal.showValidationMessage(`Введите имя и фамилию!`)
                    } return { fullName: fullName, school: school, yourClass: yourClass }
                }
            }).then((result) => {
                if (result.isDenied) {
                    this.signInTeacher();
                } else {
                    const teacherId = getRandId();

                    firebase.database().ref(`school${result.value.school}/teachers/teacher${teacherId}`).set({
                        fullName: result.value.fullName,
                        school: result.value.school,
                        teacherClass: result.value.yourClass,
                        teacherId: teacherId,
                    });
    
                    Swal.fire({
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        html: `
                            <h4> ${result.value.fullName}, ваш код для входа: ${teacherId} 
                            <br /> Не забудьте! </h4>
                        `,
                    });

                    localStorage.setItem('user', JSON.stringify({
                        who: 'teacher',
                        fullName: result.value.fullName,
                        school: result.value.school,
                        myClass: result.value.yourClass,
                        code: teacherId,
                    }));
    
                    ILVue.logIn = true;
                    ILVue.currentUser = 'teacher';
                    document.querySelector('.main-app-teacher').style.display = 'block';
                    startTeacherApp();
                    innerNews();
                }
            });
        },

        signInTeacher: function () {
            Swal.fire({
                title: 'Вход в аккаунт',
                html: `
                    <input type="text" id="fullNameTeacherSignIn" class="swal2-input" placeholder="Имя и фамилия">
                    <input type="text" id="codeTeacherSignIn" class="swal2-input" placeholder="Код">
                    <input type="text" id="schoolTeacherSignIn" class="swal2-input" placeholder="Школа">
                    <input type="text" id="klassTeacherSignIn" class="swal2-input" placeholder="Ваш класс">`,
                confirmButtonText: 'Войти',
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    const fullName = Swal.getPopup().querySelector('#fullNameTeacherSignIn').value
                    const school = Swal.getPopup().querySelector('#schoolTeacherSignIn').value
                    const klass = Swal.getPopup().querySelector('#klassTeacherSignIn').value
                    const code = Swal.getPopup().querySelector('#codeTeacherSignIn').value
                    if (!school || !code || !fullName || !klass) {
                        Swal.showValidationMessage(`Пожалуйста, заполните все поля`)
                    } return { fullName: fullName, school: school, myClass: klass, code: code }
                }
            }).then((result) => {
                firebase.database().ref(`school${result.value.school}/teachers/teacher${result.value.code}`).get().then((snapshot) => {
                    if (snapshot.val() == null) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ошибка входа в аккаунт!',
                            text: 'Проверьте введенные данные!',
                            showDenyButton: true,
                            denyButtonText: 'Зарегистрироваться',
                            focusConfirm: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then((result) => {
                            if (result.isDenied) {
                                this.signUpTeacher();
                            } else {
                                this.signInTeacher();
                            }
                        });
                    } else {
                        localStorage.setItem('user', JSON.stringify({
                            who: 'teacher',
                            fullName: result.value.fullName,
                            myClass: result.value.myClass,
                            school: result.value.school,
                            code: result.value.code,
                        }));

                        ILVue.logIn = true;
                        ILVue.currentUser = 'teacher';
                        document.querySelector('.main-app-teacher').style.display = 'block';
                        startTeacherApp();
                        innerNews();
                    }
                }).catch((error) => {
                    console.log(error);
                    this.signInTeacher();
                });
            });
        },

        signUpStudent: function () {
            Swal.fire({
                title: 'Регистрация аккаунта',
                html: `
                    <input type="text" id="fullNameSignUpStudent" class="swal2-input" placeholder="Имя и Фамилия">
                    <input type="text" id="schoolSignUpStudent" class="swal2-input" placeholder="Школа">
                    <input type="text" id="klassSignUpStudent" class="swal2-input" placeholder="Класс">`,
                confirmButtonText: 'Далее',
                showDenyButton: true,
                denyButtonText: 'Войти',
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    const fullName = Swal.getPopup().querySelector('#fullNameSignUpStudent').value
                    const school = Swal.getPopup().querySelector('#schoolSignUpStudent').value
                    const klass = Swal.getPopup().querySelector('#klassSignUpStudent').value
                    if (!fullName || !school || !klass) {
                        Swal.showValidationMessage(`Заполните все поля`)
                    } return { fullName: fullName, school: school, klass: klass }
                }
            }).then((result) => {
                if (result.isDenied) {
                    this.signInStudent();
                } else {
                    const studentId = getRandId();

                    firebase.database().ref(`school${result.value.school}/students/student${result.value.fullName.toLowerCase().trim()} ${result.value.klass.toLowerCase().trim()}`).set({
                        fullName: result.value.fullName,
                        school: result.value.school,
                        klass: result.value.klass,
                        studentId: studentId,
                    });

                    localStorage.setItem('user', JSON.stringify({
                        who: 'student',
                        fullName: result.value.fullName,
                        school: result.value.school,
                        klass: result.value.klass,
                        isOnline: true,
                    }));

                    ILVue.logIn = true;
                    ILVue.currentUser = 'student';
                    document.querySelector('.main-app-student').style.display = 'block';
                    startStudentApp();
                }
            });
        },

        signInStudent: function () {
            Swal.fire({
                title: 'Вход в аккаунт',
                html: `
                    <input type="text" id="fullNameSignInStudent" class="swal2-input" placeholder="Имя и Фамилия">
                    <input type="text" id="schoolSignInStudent" class="swal2-input" placeholder="Школа">
                    <input type="text" id="klassSignInStudent" class="swal2-input" placeholder="Класс">`,
                confirmButtonText: 'Далее',
                showDenyButton: true,
                denyButtonText: 'Зарегистрироваться',
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    const fullName = Swal.getPopup().querySelector('#fullNameSignInStudent').value
                    const school = Swal.getPopup().querySelector('#schoolSignInStudent').value
                    const klass = Swal.getPopup().querySelector('#klassSignInStudent').value
                    if (!fullName || !school || !klass) {
                        Swal.showValidationMessage(`Заполните все поля`)
                    } return { fullName: fullName, school: school, klass: klass }
                }
            }).then((result) => {
                if (result.isDenied) {
                    this.signUpStudent();
                } else {
                    firebase.database().ref(`school${result.value.school}/students/student${result.value.fullName.toLowerCase().trim()} ${result.value.klass.toLowerCase().trim()}`).get().then((snapshot) => {
                        if (snapshot.val() == null) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ошибка входа в аккаунт!',
                                text: 'Проверьте введенные данные!',
                                showDenyButton: true,
                                denyButtonText: 'Зарегистрироваться',
                                focusConfirm: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            }).then((result) => {
                                if (result.isDenied) {
                                    this.signUpStudent();
                                } else {
                                    this.signInStudent();
                                }
                            });
                        } else {
                            localStorage.setItem('user', JSON.stringify({
                                who: 'student',
                                fullName: result.value.fullName,
                                school: result.value.school,
                                klass: result.value.klass,
                            }));

                            firebase.database().ref(`school${result.value.school}/students/student${result.value.fullName.toLowerCase().trim()} ${result.value.klass.toLowerCase().trim()}/isOnline`).set(true);
                            ILVue.logIn = true;
                            ILVue.currentUser = 'student';
                            document.querySelector('.main-app-student').style.display = 'block';
                            startStudentApp();
                        }
                    });
                }
            });
        },
    }
});