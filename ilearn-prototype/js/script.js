// date
const date = new Date();

// window onload
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

        const todo = document.querySelector('#todo');
        todo.parentNode.removeChild(todo);

        ILVue.logIn = true;
        ILVue.currentUser = 'student';
        document.querySelector('.main-app-student').style.display = 'block';
        startStudentApp();
        innerNews();
        chatWithTeachersAndStudents();
    }
}

// teacher component
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
                        <a href="itests.html" target="_blank" style="cursor: pointer;" class="list-group-item list-group-item-action" aria-current="true">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <img alt="icon" src="../itests/img/pizap.png" style="border-radius: 20px; width: 30px; height: 30px;" class="d-inline-block align-text-top">
                                    ITests
                                </h5>
                                <small class="text-muted">Открыть</small>
                            </div>
                            <p class="mb-1">Создавайте тесты для учеников.</p>
                        </a>
                        <a data-bs-toggle="modal" data-bs-target="#todo" style="cursor: pointer" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <img alt="icon" src="../todo-list/public/bg.png" style="border-radius: 20px; width: 30px; height: 30px;" class="d-inline-block align-text-top">
                                    To Do List
                                </h5>
                                <small class="text-muted">Открыть</small>
                            </div>
                            <p class="mb-1">Создавайте заметки, чтобы не забывать важные вещи.</p>
                        </a>
                        <a data-bs-toggle="modal" data-bs-target="#chat" style="cursor: pointer" class="list-group-item list-group-item-action">
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
            <div id="notifications"></div>
            
            <div class="modal fade" id="itests" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div id="main">
                            <div class="nav nav-pills" id="v-pills-tab" role="tablist">
                                <a class="nav-link active" onclick="resultsStudentsList()" id="v-pills-results-students-tab" data-bs-toggle="pill" href="#results_students" role="tab" aria-controls="v-pills-results-students" aria-selected="false">Результаты тестов</a>
                                <a class="nav-link" onclick="tests()" id="v-pills-results-students-tab" data-bs-toggle="pill" href="#tests" role="tab" aria-controls="v-pills-results-students" aria-selected="false">Тесты</a>
                                <a class="nav-link" onclick="createTest()" id="v-pills-tests-tab" data-bs-toggle="pill" href="#createTest" role="tab" aria-controls="v-pills-tests" aria-selected="false">Создать тест</a>
                            </div>
                            <div class="tab-content" id="div_tests">
                                <div class="tab-pane active" id="results_students" role="tabpanel" aria-labelledby="results-students-tab">
                                    <div id="results_students_table"></div>
                                </div>
                                <div class="tab-pane fade" id="tests" role="tabpanel" aria-labelledby="tests-tab">
                                            <div class="accordion" id="accordionExample">
                                                <div class="card">
                                                    <div class="card-header" id="algebraCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#algebra" aria-expanded="true" aria-controls="collapseOne">
                                                                Алгебра <span class="badge bg-primary" id="algebra-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="algebra" class="collapse" aria-labelledby="headingOne">
                                                        <div class="card-body"></div>
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="mathCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#math" aria-expanded="true" aria-controls="collapseOne">
                                                                Математика <span class="badge bg-primary" id="math-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="math" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="englishCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#english" aria-expanded="true" aria-controls="collapseOne">
                                                                Английский язык <span class="badge bg-primary" id="english-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="english" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="biologyCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#biology" aria-expanded="true" aria-controls="collapseOne">
                                                                Биология <span class="badge bg-primary" id="biology-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="biology" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="okrworldCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#okrworld" aria-expanded="true" aria-controls="collapseOne">
                                                                Окружающий мир <span class="badge bg-primary" id="okrworld-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="okrworld" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="geographyCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#geography" aria-expanded="true" aria-controls="collapseOne">
                                                                География <span class="badge bg-primary" id="geography-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="geography" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="geometryCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#geometry" aria-expanded="true" aria-controls="collapseOne">
                                                                Геометрия <span class="badge bg-primary" id="geometry-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="geometry" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="historyCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#history" aria-expanded="true" aria-controls="collapseOne">
                                                                История <span class="badge bg-primary" id="history-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="history" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="literatureCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#literature" aria-expanded="true" aria-controls="collapseOne">
                                                                Литература <span class="badge bg-primary" id="literature-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="literature" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="physicsCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#physics" aria-expanded="true" aria-controls="collapseOne">
                                                                Физика <span class="badge bg-primary" id="physics-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="physics" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="chemistryCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#alchemy" aria-expanded="true" aria-controls="collapseOne">
                                                                Химия <span class="badge bg-primary" id="alchemy-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="alchemy" class="collapse" aria-labelledby="headingOne"></div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="russianCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#russian" aria-expanded="true" aria-controls="collapseOne">
                                                                Русский язык <span class="badge bg-primary" id="russian-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="russian" class="collapse" aria-labelledby="headingOne"></div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="obzhCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#obzh" aria-expanded="true" aria-controls="collapseOne">
                                                                ОБЖ <span class="badge bg-primary" id="obzh-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="obzh" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="peCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#pe" aria-expanded="true" aria-controls="collapseOne">
                                                                Физическая культура <span class="badge bg-primary" id="pe-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="pe" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="techCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#tech" aria-expanded="true" aria-controls="collapseOne">
                                                                Технология <span class="badge bg-primary" id="tech-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="tech" class="collapse" aria-labelledby="headingOne">
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="socialScienceCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#obsh" aria-expanded="true" aria-controls="collapseOne">
                                                                Обществознание <span class="badge bg-primary" id="obsh-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="obsh" class="collapse" aria-labelledby="headingOne">
                        
                                                    </div>
                                                </div>
                                                <div class="card">
                                                    <div class="card-header" id="itCard">
                                                        <h5 class="mb-0">
                                                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#it" aria-expanded="true" aria-controls="collapseOne">
                                                                Информатика <span class="badge bg-primary" id="it-counter">0</span>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                
                                                    <div id="it" class="collapse" aria-labelledby="headingOne"></div>
                                                </div>
                                            </div>
                                        </div>
                                <div class="tab-pane fade" id="createTest" role="tabpanel">
                                            <div class="container-fluid" id="create_test">
                                                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                   <li class="nav-item">
                                                        <button class="btn btn-outline-primary" id="plus-question-icon" data-bs-toggle="collapse" data-bs-target="#pills-plus" style="float: left;">Форма создания вопроса</button>
                                                        <button class="btn btn-outline-success" data-bs-toggle="collapse" data-bs-target="#pills-create" id="create-test-admin-btn">Создать тест</button>
                                                   </li>
                                                </ul>
                        
                                                <div class="container-fluid" id="questions"></div>
                                       
                                                <div class="collapse show" id="pills-plus">
                                                    <div class="tab-pane" role="tabpanel" aria-labelledby="pills-plus-tab">
                                                        <div class="form" id="create-question">
                                                            <div class="form-group row">
                                                                <h3>Вопрос</h3>
                                                                <div class="col-sm-10">
                                                                    <input type="text" placeholder="Текст вопроса" class="form-control" id="input_question">
                                                                </div>
                                                            </div>
                                                            <fieldset class="form-group">
                                                                <div class="row mt-3">
                                                                    <legend class="col-form-label col-sm-2 pt-0">Варианты ответа</legend>
                                                                    <div class="col-sm-10">
                                                                        <div class="form-check">
                                                                            <input class="form-check-input" type="radio" name="gridRadios" id="option_radio1" value="option1">
                                                                            <input type="text" placeholder="Первый вариант ответа" class="form-control" id="inputText1">
                                                                            <br>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio" name="gridRadios" id="option_radio2" value="option1">
                                                                        <input type="text" placeholder="Второй вариант ответа" class="form-control" id="inputText2">
                                                                        <br>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio" name="gridRadios" id="option_radio3" value="option1">
                                                                        <input type="text" placeholder="Третий вариант ответа" class="form-control" id="inputText3">
                                                                        <br>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio" name="gridRadios" id="option_radio4" value="option1">
                                                                        <input type="text" placeholder="Четвертый вариант ответа" class="form-control" id="inputText4">
                                                                        <br>
                                                                    </div>
                                                                </div>
                                                                <legend class="col-form-label col-sm-2 pt-0">Изображение: </legend>
                                                                <div class="col-sm-10">
                                                                    <div class="form">
                                                                        <div class="form-group">
                                                                            <input type="file" id="files" />
                                                                            <div class="custom-control custom-checkbox">
                                                                                <input type="checkbox" class="custom-control-input" id="checkbox_file">
                                                                                <label class="custom-control-label" id="checkbox_file_label" for="checkbox_file">Без изображения</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                            <div class="form-group row">
                                                                <div class="col-sm-10">
                                                                    <button type="submit" class="btn btn-outline-success" onclick="create_question()">Создать вопрос</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="collapse" id="pills-create">
                                                    <div class="tab-pane" role="tabpanel" aria-labelledby="pills-plus-tab">
                                                        <div class="container-fluid">
                                                            <label class="my-1 mr-2 mt-2 d-flex justify-content-center" for="klassGeneralTest">Класс</label>
                                                            <input type="text" placeholder="Класс (Без буквы)" class="form-control w-25 m-auto" id="klassGeneralTest">
                                                    
                                                            <label class="my-1 mr-2 mt-2 d-flex justify-content-center" for="subjectGeneralTest">Предмет</label>
                                                            <div class="w-25" style="margin: 0 auto;">
                                                                <select class="form-select my-1 mr-sm-2" id="subjectGeneralTest">
                                                                    <option>Алгебра</option>
                                                                    <option>Математика</option>
                                                                    <option>Английский язык</option>
                                                                    <option>Биология</option>
                                                                    <option>Окружающий мир</option>
                                                                    <option>География</option>
                                                                    <option>Геометрия</option>
                                                                    <option>История</option>
                                                                    <option>Литература</option>
                                                                    <option>Физика</option>
                                                                    <option>Химия</option>
                                                                    <option>Русский язык</option>
                                                                    <option>ОБЖ</option>
                                                                    <option>Физическая культура</option>
                                                                    <option>Технология</option>
                                                                    <option>Обществознание</option>
                                                                    <option>Информатика</option>
                                                                </select>
                                                            </div>
                                                            <label for="themeGeneralTest" class="my-1 mr-2 mt-2 d-flex justify-content-center">Тема</label>
                                                            <input type="text" placeholder="Тема вопроса" class="form-control w-25 m-auto" id="themeGeneralTest">
                        
                                                            <div class="d-flex justify-content-center mt-3">
                                                                <button class="btn btn-outline-success" onclick="createGeneralTest()">Создать</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
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

// student component
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
                        <a href="tests.html" target="_blank" class="list-group-item list-group-item-action" aria-current="true">
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
                            <ol class="list-group" style="padding: 0;" id="chats"></ol>
                        </div>
                    </div>
                </div>
            </div>
            <div id="notifications"></div>
        </div>
    `
});

// task component
Vue.component('task', {
    props: ['data'],
    data() {
        return {}
    },

    methods: {
        task_done() {
            this.$emit('task_done')
        }
    },

    template: `
      <div class="card text-dark bg-warning mb-3">
        <div class="card-body">
          <h5 class="card-text">{{ data.name }}</h5>
    
          <button class="btn btn-outline-danger" style="cursor: pointer; float: right;" @click="task_done()"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `
});

// vue start
let ILVue = new Vue({
    el: '#app',

    data: {
        // Содержание объекта в массиве
        new_task: {
            name: '',
            id: '',
        },

        // Для поиска таска в массиве
        currentTask: 0,

        // Массивы To Do
        tasks: [],
    },

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
                        isOnline: true,
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
                    chatWithStudents();
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
                        chatWithStudents();
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
                        isOnline: true,
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
                    chatWithTeachersAndStudents();
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
                            chatWithTeachersAndStudents();
                        }
                    });
                }
            });
        },

        // Добавить задание
        add_task() {
            if (this.new_task.name === '') {
                Swal.fire({
                    title: "Заполни все поля!",
                    icon: "error"
                })
            } else {
                const idTask = getRandId();

                this.tasks.push({
                    name: this.new_task.name,
                    id: idTask,
                });

                add_task_db(this.currentTask);
                this.currentTask += 1;

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });

                Toast.fire({
                    icon: 'success',
                    title: 'Таск создан!'
                });
            }
        },

        // Удалить задание
        delete_task(name, id_task) {
            const index = this.tasks.findIndex(item => item.id === id_task);
            this.tasks.splice(index, 1);

            firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/tasks/task${id_task}`).remove();
        },
    }
});

// teacher app
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

// student app
function startStudentApp() {
    let user = JSON.parse(localStorage.getItem('user'));

    window.onblur = () => {
        firebase.database().ref(`school${user.school}/students/student${user.fullName.toLowerCase().trim()} ${user.klass.toLowerCase().trim()}/isOnline`).set(false);
    }

    window.onfocus = () => {
        firebase.database().ref(`school${user.school}/students/student${user.fullName.toLowerCase().trim()} ${user.klass.toLowerCase().trim()}/isOnline`).set(true);
    }

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

// inner news
function innerNews() {
    const user = JSON.parse(localStorage.getItem('user'));

    // global news
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
                                <button class="btn btn-outline-success" type="button" id="btn-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}')">Написать</button>
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
                                <button class="btn btn-outline-success" type="button" id="btn-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}')">Написать</button>
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

        // comments
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

        switch (user.who) {
            case 'student':
                firebase.database().ref(`school${user.school}/students/student${user.fullName.toLowerCase()} ${userClass.toLowerCase()}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val()

                    if (emotions === 'like') {
                        const likePostElem = document.getElementById(`likePostIcon${newsId}`)

                        likePostElem.className = 'fas fa-heart'
                    } else if (emotions === 'dislike') {
                        const dislikePostElem = document.getElementById(`dislikePostIcon${newsId}`)

                        dislikePostElem.className = 'fas fa-thumbs-down'
                    }
                })
                ; break;
            case "teacher":
                firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val()

                    if (emotions === 'like') {
                        const likePostElem = document.getElementById(`likePostIcon${newsId}`)

                        likePostElem.className = 'fas fa-heart'
                    } else if (emotions === 'dislike') {
                        const dislikePostElem = document.getElementById(`dislikePostIcon${newsId}`)

                        dislikePostElem.className = 'fas fa-thumbs-down'
                    }
                })
            ; break;
        }
    });

    try {
        userClass = `${user.myClass[0]}${user.myClass = user.myClass[1].toUpperCase()}`;
    } catch {
        userClass = `${user.klass[0]}${user.klass = user.klass[1].toUpperCase()}`
    }

    // news from class
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
                                <button class="btn btn-outline-success" type="button" id="btn-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}', '${userClass}')">Написать</button>
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
                                <button class="btn btn-outline-success" type="button" id="btn-comment" onclick="postComment('${newsId}', '${user.fullName}', '${user.school}', '${userClass}')">Написать</button>
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

        switch (user.who) {
            case 'student':
                firebase.database().ref(`school${user.school}/students/student${user.fullName.toLowerCase()} ${userClass.toLowerCase()}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val()

                    if (emotions === 'like') {
                        const likePostElem = document.getElementById(`likePostIcon${newsId}`)

                        likePostElem.className = 'fas fa-heart'
                    } else if (emotions === 'dislike') {
                        const dislikePostElem = document.getElementById(`dislikePostIcon${newsId}`)

                        dislikePostElem.className = 'fas fa-thumbs-down'
                    }
                })
            ; break;
            case "teacher":
                firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val()

                    if (emotions === 'like') {
                        const likePostElem = document.getElementById(`likePostIcon${newsId}`)

                        likePostElem.className = 'fas fa-heart'
                    } else if (emotions === 'dislike') {
                        const dislikePostElem = document.getElementById(`dislikePostIcon${newsId}`)

                        dislikePostElem.className = 'fas fa-thumbs-down'
                    }
                })
            ; break;
        }
    });
}

// create news
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

// comment post
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

// like post
function likePost(newsId, school, klass = '') {
    const user = JSON.parse(localStorage.getItem('user'));

    switch (user.who) {
        case 'student':
            if (klass === '') {
                firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();

                    if (emotions === 'dislike') {
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

                            firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).set('like');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => {
                            likes = snapshot.val().likes;
                            likes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news/${newsId}/likes`).set(likes);

                            const likePostElem = document.getElementById(`likePost${newsId}`)
                            likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;

                            firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).set('like');
                        });
                    }
                });
            } else if (klass !== '') {
                firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();
                    if (emotions === 'dislike') {
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

                            firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).set('like');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => {
                            likes = snapshot.val().likes;
                            likes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news${klass}/${newsId}/likes`).set(likes);

                            const likePostElem = document.getElementById(`likePost${newsId}`)
                            likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;

                            firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).set('like');
                        });
                    }
                });
            }
        ; break;

        case 'teacher':
            if (klass === '') {
                firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();

                    if (emotions === 'dislike') {
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

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('like');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => {
                            likes = snapshot.val().likes;
                            likes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news/${newsId}/likes`).set(likes);

                            const likePostElem = document.getElementById(`likePost${newsId}`)
                            likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('like');
                        });
                    }
                });
            } else if (klass !== '') {
                firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();
                    if (emotions === 'dislike') {
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

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('like');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => {
                            likes = snapshot.val().likes;
                            likes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news${klass}/${newsId}/likes`).set(likes);

                            const likePostElem = document.getElementById(`likePost${newsId}`)
                            likePostElem.innerHTML = `<i class="fas fa-heart"></i> ${likes}`;

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('like');
                        });
                    }
                });
            }
        ; break;
    }
}

// dislike post
function dislikePost(newsId, school, klass = '') {
    const user = JSON.parse(localStorage.getItem('user'));

    switch (user.who) {
        case 'student':
            if (klass === '') {
                firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();
                    if (emotions === 'like') {
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

                            firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).set('dislike');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => {
                            dislikes = snapshot.val().dislikes;
                            dislikes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news/${newsId}/dislikes`).set(dislikes);

                            const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
                            dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;

                            firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).set('dislike');
                        });
                    }
                });
            } else if (klass !== '') {
                firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();

                    if (emotions === 'like') {
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

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('dislike');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => {
                            dislikes = snapshot.val().dislikes;
                            dislikes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news${klass}/${newsId}/dislikes`).set(dislikes);

                            const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
                            dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;

                            firebase.database().ref(`school${school}/students/student${user.fullName.toLowerCase()} ${user.klass.toLowerCase()}/likes/emotions${newsId}/`).set('dislike');
                        });
                    }
                });
            }
        ; break;
        case 'teacher':
            if (klass === '') {
                firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();
                    if (emotions === 'like') {
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

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('dislike');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news/${newsId}`).get().then((snapshot) => {
                            dislikes = snapshot.val().dislikes;
                            dislikes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news/${newsId}/dislikes`).set(dislikes);

                            const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
                            dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('dislike');
                        });
                    }
                });
            } else if (klass !== '') {
                firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}/`).get().then((snapshot) => {
                    let emotions = snapshot.val();

                    if (emotions === 'like') {
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

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('dislike');
                        });
                    } else if (emotions === null) {
                        firebase.database().ref(`school${school}/news${klass}/${newsId}`).get().then((snapshot) => {
                            dislikes = snapshot.val().dislikes;
                            dislikes++;
                        }).then(() => {
                            firebase.database().ref(`school${school}/news${klass}/${newsId}/dislikes`).set(dislikes);

                            const dislikePostElem = document.getElementById(`dislikePost${newsId}`)
                            dislikePostElem.innerHTML = `<i class="fas fa-thumbs-down"></i> ${dislikes}`;

                            firebase.database().ref(`school${school}/teachers/teacher${user.code}/likes/emotions${newsId}`).set('dislike');
                        });
                    }
                });
            }
        ; break;
    }
}

// sign out teacher
function signOutTeacher() {
    localStorage.removeItem('user');
    document.querySelector('.main-app-teacher').style.display = 'none';
    ILVue.logIn = false;
    ILVue.currentUser = '';

    location.reload();
}

// sign out student
function signOutStudent() {
    localStorage.removeItem('user');
    document.querySelector('.main-app-student').style.display = 'none';
    ILVue.logIn = false;
    ILVue.currentUser = '';

    location.reload();
}

// add task to database
function add_task_db(index) {
    const user = JSON.parse(localStorage.getItem('user'));

    let nameElem = document.getElementById("name-task").value;
    let id = ILVue.$data.tasks[index].id;

    firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/tasks/task${id}`).set({
        name: nameElem,
        id: id,
    });
}

// user
let user = JSON.parse(localStorage.getItem('user'));

// todo list
firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/tasks/`).get().then((snapshot) => {
    for (let key in snapshot.val()) {
        firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/tasks/${key}`).get().then((snapshot) => {
            let nameTask = snapshot.val().name;
            let idTask = snapshot.val().id;

            ILVue.$data.tasks.push({
                name: nameTask,
                id: idTask,
            });
        });
    }
});