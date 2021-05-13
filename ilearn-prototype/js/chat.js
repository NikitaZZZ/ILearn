function chatWithStudents() {
    let user = JSON.parse(localStorage.getItem('user'));

    document.getElementById('chatUI').innerHTML = '';

    firebase.database().ref(`school${user.school}/students/`).on('child_added', (data) => {
        document.getElementById('chatUI').innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-start" style="cursor: pointer" onclick="chatTeacherAndStudent('${data.val().fullName}', '${user.fullName}', '${data.val().klass}')">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${data.val().fullName}</div>
                </div>
                <span class="badge secondary rounded-pill" id="isOnline${data.val().fullName}"></span>
            </li>
        `;
    });

    firebase.database().ref(`school${user.school}/students/`).on('value', (snapshot) => {
        for (let key in snapshot.val()) {
            firebase.database().ref(`school${user.school}/students/${key}`).on('value', (snapshot) => {
                try {
                    const isOnline = snapshot.val().isOnline;
                    let isOnlineSpan = document.getElementById(`isOnline${snapshot.val().fullName}`);

                    switch (isOnline) {
                        case true:
                            isOnlineSpan.innerHTML = `В сети`;
                            isOnlineSpan.className = `badge bg-success rounded-pill`;
                            break;
                        case false:
                            isOnlineSpan.innerHTML = `Не в сети`;
                            isOnlineSpan.className = `badge bg-secondary rounded-pill`;
                            break;
                    }
                } catch {}
            });
        }
    });
}

function chatWithTeachersAndStudents() {
    let user = JSON.parse(localStorage.getItem('user'));

    firebase.database().ref(`school${user.school}/students/`).on('child_added', (data) => {
        if (user.fullName === data.val().fullName) {} else if (user.fullName !== data.val().fullName) {
            document.getElementById('chatsStudents').innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-start" style="cursor: pointer" onclick="chatStudentAndTeacher('${data.val().fullName}', '${user.fullName}', '${data.val().klass}')">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">${data.val().fullName}</div>
                    </div>
                    <span class="badge secondary rounded-pill" id="isOnline${data.val().fullName}"></span>
                </li>
            `;
        }
    });

    firebase.database().ref(`school${user.school}/teachers/`).on('child_added', (data) => {
        document.getElementById('chatsTeachers').innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-start" style="cursor: pointer" onclick="chatStudentAndTeacher('${data.val().fullName}', '${user.fullName}', '${data.val().teacherClass}')">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${data.val().fullName}</div>
                </div>
                <span class="badge secondary rounded-pill" id="isOnline${data.val().fullName}"></span>
            </li>
        `;
    });

    firebase.database().ref(`school${user.school}/teachers/`).on('value', (snapshot) => {
        for (let key in snapshot.val()) {
            firebase.database().ref(`school${user.school}/teachers/${key}`).on('value', (snapshot) => {
                try {
                    const isOnline = snapshot.val().isOnline;
                    let isOnlineSpan = document.getElementById(`isOnline${snapshot.val().fullName}`);

                    switch (isOnline) {
                        case true:
                            isOnlineSpan.innerHTML = `В сети`;
                            isOnlineSpan.className = `badge bg-success rounded-pill`;
                            break;
                        case false:
                            isOnlineSpan.innerHTML = `Не в сети`;
                            isOnlineSpan.className = `badge bg-secondary rounded-pill`;
                            break;
                    }
                } catch {}
            });
        }
    });
}

// Ученик с учителем / одноклассниками
function renderMessagesStudent(username, name, klass) {
    let user = JSON.parse(localStorage.getItem('user'));
    firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${username}`).orderByChild('date/minutes').on('child_added', (data) => {
        try {
            const fullName = data.val().fullName;
            const message = data.val().message;

            const hour = data.val().date.hour;
            const minutes = data.val().date.minutes;
            const seconds = data.val().date.seconds;

            const day = data.val().date.day;
            const month = data.val().date.month;
            const year = data.val().date.year;

            let messageId = data.val().messageId;

            document.getElementById('messages').innerHTML += `
                <div class="card">
                    <div class="card-body">
                        <span class="text-secondary" id="checkMessage${messageId}" style="float: right"><i class="fas fa-check-double"></i></span>
                        <h5 class="card-title">${fullName}</h5>
                        <span class="text-muted" style="float: right;">${hour}:${minutes}:${seconds}</span>
                        <span class="text-muted" style="margin-right: 0.5em; float: right;">${day}.${month}.${year}</span>
                        <p class="card-text">${message} <span class="position-absolute top-0 start-100 translate-middle p-2 badge"></span></p>
                    </div>
                </div>
            `;

            if (fullName !== user.fullName && document.getElementById('chat').className !== 'modal fade show') {
                document.getElementById('notifications').innerHTML += `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: -1">
                        <div class="toast hide" id="notification${messageId}" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <strong class="me-auto">${fullName}</strong>
                                <small>${hour}:${minutes}:${seconds}</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                            </div>
                            <div class="toast-body">
                                ${message}
                            </div>
                        </div>
                    </div>
                `;

                $(`#notification${messageId}`).toast('show');
            }
        } catch { }
    });

    firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${username}`).on('value', (snapshot) => {
        for (let key in snapshot.val()) {
            firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${username}/${key}`).on('value', (snapshot) => {
                let checkMsg = snapshot.val().checkMessage;
                let messageId = snapshot.val().messageId;

                if (checkMsg === false && user.fullName !== snapshot.val().fullName) {
                    checkMsg = true;
                    const checkMsgElem = document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                    firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${username}/${key}/checkMessage`).set(checkMsg);
                } else if (checkMsg === true) {
                    console.log(document.getElementById(`checkMessage${messageId}`));
                    document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                }
            });
        }
    });

    firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${username}`).orderByChild('date/minutes').on('child_added', (data) => {
        try {
            const fullName = data.val().fullName;
            const message = data.val().message;

            const hour = data.val().date.hour;
            const minutes = data.val().date.minutes;
            const seconds = data.val().date.seconds;

            const day = data.val().date.day;
            const month = data.val().date.month;
            const year = data.val().date.year;

            let messageId = data.val().messageId;

            document.getElementById('messages').innerHTML += `
                <div class="card">
                    <div class="card-body">
                        <span class="text-secondary" id="checkMessage${messageId}" style="float: right"><i class="fas fa-check-double"></i></span>
                        <h5 class="card-title">${fullName}</h5>
                        <span class="text-muted" style="float: right;">${hour}:${minutes}:${seconds}</span>
                        <span class="text-muted" style="margin-right: 0.5em; float: right;">${day}.${month}.${year}</span>
                        <p class="card-text">${message} <span class="position-absolute top-0 start-100 translate-middle p-2 badge"></span></p>
                    </div>
                </div>
            `;

            if (fullName !== user.fullName && document.getElementById('chat').className !== 'modal fade show') {
                document.getElementById('notifications').innerHTML += `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: -1">
                        <div class="toast hide" id="notification${messageId}" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <strong class="me-auto">${fullName}</strong>
                                <small>${hour}:${minutes}:${seconds}</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                            </div>
                            <div class="toast-body">
                                ${message}
                            </div>
                        </div>
                    </div>
                `;

                $(`#notification${messageId}`).toast('show');
            }
        } catch { }
    });

    firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${username}`).on('value', (snapshot) => {
        for (let key in snapshot.val()) {
            firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${username}/${key}`).on('value', (snapshot) => {
                let checkMsg = snapshot.val().checkMessage;
                let messageId = snapshot.val().messageId;

                if (checkMsg === false && user.fullName !== snapshot.val().fullName) {
                    checkMsg = true;
                    document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                    firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${username}/${key}/checkMessage`).set(checkMsg);
                } else {
                    document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                }
            });
        }
    });
}

// Учитель с учениками
function renderMessagesTeacher(username, name, klass) {
    let user = JSON.parse(localStorage.getItem('user'));

    firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${name}`).orderByChild('date/minutes').on('child_added', (data) => {
        try {
            const fullName = data.val().fullName;
            const message = data.val().message;

            const hour = data.val().date.hour;
            const minutes = data.val().date.minutes;
            const seconds = data.val().date.seconds;

            const day = data.val().date.day;
            const month = data.val().date.month;
            const year = data.val().date.year;

            const messageId = data.val().messageId;

            document.getElementById('messages').innerHTML += `
                <div class="card">
                    <div class="card-body">
                        <span class="text-secondary" id="checkMessage${messageId}" style="float: right"><i class="fas fa-check-double"></i></span>
                        <h5 class="card-title">${fullName}</h5>
                        <span class="text-muted" style="float: right;">${hour}:${minutes}:${seconds}</span>
                        <span class="text-muted" style="margin-right: 0.5em; float: right;">${day}.${month}.${year}</span>
                        <p class="card-text">${message} <span class="position-absolute top-0 start-100 translate-middle p-2 badge"></span></p>
                    </div>
                </div>
            `;

            if (fullName !== user.fullName && document.getElementById('chat').className !== 'modal fade show') {
                document.getElementById('notifications').innerHTML += `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: -1">
                        <div class="toast hide" id="notification${messageId}" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <strong class="me-auto">${fullName}</strong>
                                <small>${hour}:${minutes}:${seconds}</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                            </div>
                            <div class="toast-body">
                                ${message}
                            </div>
                        </div>
                    </div>
                `;

                $(`#notification${messageId}`).toast('show');
            }
        } catch { }
    });

    firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${name}`).on('value', (snapshot) => {
        for (let key in snapshot.val()) {
            firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${name}/${key}`).on('value', (snapshot) => {
                let checkMsg = snapshot.val().checkMessage;
                let messageId = snapshot.val().messageId;

                if (checkMsg === false && user.fullName !== snapshot.val().fullName) {
                    checkMsg = true;
                    document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                    firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesFrom${name}/${key}/checkMessage`).set(checkMsg);
                } else if (checkMsg === true) {
                    console.log(`checkMessage${messageId}`);
                    document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                }
            });
        }
    });

    firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${name}`).orderByChild('date/minutes').on('child_added', (data) => {
        try {
            const fullName = data.val().fullName;
            const message = data.val().message;

            const hour = data.val().date.hour;
            const minutes = data.val().date.minutes;
            const seconds = data.val().date.seconds;

            const day = data.val().date.day;
            const month = data.val().date.month;
            const year = data.val().date.year;

            const messageId = data.val().messageId;

            document.getElementById('messages').innerHTML += `
                <div class="card">
                    <div class="card-body">
                        <span class="text-secondary" id="checkMessage${messageId}" style="float: right"><i class="fas fa-check-double"></i></span>
                        <h5 class="card-title">${fullName}</h5>
                        <span class="text-muted" style="float: right;">${hour}:${minutes}:${seconds}</span>
                        <span class="text-muted" style="margin-right: 0.5em; float: right;">${day}.${month}.${year}</span>
                        <p class="card-text">${message} <span class="position-absolute top-0 start-100 translate-middle p-2 badge"></span></p>
                    </div>
                </div>
            `;

            if (fullName !== user.fullName && document.getElementById('chat').className !== 'modal fade show') {
                document.getElementById('notifications').innerHTML += `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: -1">
                        <div class="toast hide" id="notification${messageId}" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <strong class="me-auto">${fullName}</strong>
                                <small>${hour}:${minutes}:${seconds}</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                            </div>
                            <div class="toast-body">
                                ${message}
                            </div>
                        </div>
                    </div>
                `;

                $(`#notification${messageId}`).toast('show');
            }
        } catch { }
    });

    firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${name}`).on('value', (snapshot) => {
        try {
            for (let key in snapshot.val()) {
                firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${name}/${key}`).on('value', (snapshot) => {
                    let checkMsg = snapshot.val().checkMessage;
                    let messageId = snapshot.val().messageId;

                    if (checkMsg === false && user.fullName !== snapshot.val().fullName) {
                        checkMsg = true;
                        const checkMsgElem = document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                        firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${klass.toLowerCase().trim()}/messagesTo${name}/${key}/checkMessage`).set(checkMsg);
                    } else if (checkMsg === true) {
                        document.getElementById(`checkMessage${messageId}`).className = 'text-primary';
                    }
                });
            }
        } catch {}
    });
}

function chatTeacherAndStudent(username, myName, studentKlass) {
    document.getElementById('chatUI').innerHTML = `
        <div id="user"></div>

        <form id="chat">
            <div style="position: relative;" id="messages"></div>
        </form>

        <div class="input-group" id="sendMsgDiv">
            <input type="text" id="messageInput" class="form-control" placeholder="Сообщение">
            <button class="btn btn-success" id="sendMsg" onclick="sendMsgToStudent('${username}', '${myName}', '${studentKlass}')">Отправить</button>
        </div> 
    `;

    document.getElementById('user').innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <button style="border: none; background: none;" onclick="chatWithStudents()"><i class="fas fa-arrow-left"></i></button>
            <div class="ms-2 me-auto">
                <div class="fw-bold">${username}</div>
            </div>
            <span class="badge bg-secondary rounded-pill" id="isOnline${username}">Не в сети</span>
        </li>
    `;

    renderMessagesTeacher(`${username}`, `${myName}`, `${studentKlass}`);
}

function chatStudentAndTeacher(username, myName, studentKlass) {
    document.getElementById('chatUI').innerHTML = `
        <div id="user"></div>

        <form id="chat">
            <div style="position: relative;" id="messages"></div>
        </form>

        <div class="input-group" id="sendMsgDiv">
            <input type="text" id="messageInput" class="form-control" placeholder="Сообщение">
            <button class="btn btn-success" id="sendMsg" onclick="sendMsgToTeacher('${username}', '${myName}', '${studentKlass}')">Отправить</button>
        </div> 
    `;

    document.getElementById('user').innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <button style="border: none; background: none;" onclick="chatWithTeachersAndStudents()"><i class="fas fa-arrow-left"></i></button>
            <div class="ms-2 me-auto">
                <div class="fw-bold">${username}</div>
            </div>
            <span class="badge bg-secondary rounded-pill" id="isOnline${username}">Не в сети</span>
        </li>
    `;

    renderMessagesStudent(`${username}`, `${myName}`, `${studentKlass}`);
}

function sendMsgToTeacher(username, name, studentKlass) {
    let user = JSON.parse(localStorage.getItem('user'));

    const message = document.getElementById('messageInput').value;
    const date = new Date();

    const messageId = getRandId();

    firebase.database().ref(`school${user.school}/students/student${name.toLowerCase().trim()} ${studentKlass.toLowerCase().trim()}/messagesTo${username}/${messageId}`).set({
        fullName: name,
        message: message,
        checkMessage: false,
        messageId: messageId,
        date: {
            hour: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        }
    });

    document.getElementById('messageInput').value = '';
}

function sendMsgToStudent(username, name, studentKlass) {
    let user = JSON.parse(localStorage.getItem('user'));

    const message = document.getElementById('messageInput').value;
    const date = new Date();

    const messageId = getRandId();

    firebase.database().ref(`school${user.school}/students/student${username.toLowerCase().trim()} ${studentKlass.toLowerCase().trim()}/messagesFrom${name}/${messageId}`).set({
        fullName: name,
        message: message,
        checkMessage: false,
        messageId: messageId,
        date: {
            hour: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        }
    });

    document.getElementById('messageInput').value = '';
}

