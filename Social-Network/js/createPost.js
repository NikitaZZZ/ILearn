function createPost() {
  const date = new Date();

  const namePost = document.getElementById('namePost').value;
  const textPost = document.getElementById('textareaPost').value;
  const tematicPost = document.getElementById('selectTematic').value;

  const name = localStorage.getItem("nameLAR");
  const surname = localStorage.getItem("surnameLAR");

  const postId = getRandId();

  firebase.database().ref(`posts/${postId}`).set({
    nameAuthor: name,
    surnameAuthor: surname,
    name: namePost,
    text: textPost,
    tematic: tematicPost,
    id: postId,
    likes: 0,
    dislikes: 0,
    date: {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }
  });
}

//Render posts
function itRender() {
    var task = firebase.database().ref("it/");
    const lenta = document.getElementById("lenta").style.height = "500px";
    const lentaNews = document.getElementById("lentaNews").style.height = "500px";
    try {
      const post = document.getElementById("post");
      post.parentNode.removeChild(post);
    } catch {
      console.log("Pass");
    }

    try {
      const t1 = document.getElementById('t1');
      t1.parentNode.removeChild(t1);
      const t2 = document.getElementById("t2");
      t2.parentNode.removeChild(t2);
      const t3 = document.getElementById("t3");
      t3.parentNode.removeChild(t3);
    } catch {
      console.log("Pass");
    }
    task.on("child_added", function (data) {
        var taskValue = data.val();
        const date = new Date();
        document.getElementById("forRender").innerHTML += `
          <div id="post">
            <img src="avatar.png" id="avatar2">
            <p id="login__user">${taskValue.login}</p>
            <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
            <br>
            <p id="valuePost">${taskValue.opis}</p>
            <br>
            <hr>
          </div>
        `

        const lS = localStorage.getItem("Avatar");
        const avatar = document.getElementById("avatar2").src = lS;

      });
}

function photoRender() {
  var task = firebase.database().ref("photo/");
  const lenta = document.getElementById("lenta").style.height = "500px";
  const lentaNews = document.getElementById("lentaNews").style.height = "500px";
  try {
    const post = document.getElementById("post");
    post.parentNode.removeChild(post);
  } catch {
    console.log("Pass");
  }
  try {
    const t1 = document.getElementById('t1');
    t1.parentNode.removeChild(t1);
    const t2 = document.getElementById("t2");
    t2.parentNode.removeChild(t2);
    const t3 = document.getElementById("t3");
    t3.parentNode.removeChild(t3);
  } catch {
    console.log("Pass");
  }
  task.on("child_added", function (data) {
      var taskValue = data.val();
      const date = new Date();
      document.getElementById("forRender").innerHTML += `
        <div id="post">
          <img src="avatar.png" id="avatar2">
          <p id="login__user">${taskValue.login}</p>
          <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
          <br>
          <p id="valuePost">${taskValue.opis}</p>
          <br>
          <hr>
        </div>
      `

      const lS = localStorage.getItem("Avatar");
      const avatar = document.getElementById("avatar2").src = lS;

    });
}

function videoRender() {
  var task = firebase.database().ref("video/");
  const lenta = document.getElementById("lenta").style.height = "500px";
  const lentaNews = document.getElementById("lentaNews").style.height = "500px";
  try {
    const t1 = document.getElementById('t1');
    t1.parentNode.removeChild(t1);
    const t2 = document.getElementById("t2");
    t2.parentNode.removeChild(t2);
    const t3 = document.getElementById("t3");
    t3.parentNode.removeChild(t3);
  } catch {
    console.log("Pass");
  }
  task.on("child_added", function (data) {
      var taskValue = data.val();
      const date = new Date();
      document.getElementById("forRender").innerHTML += `
        <div id="post">
          <img src="avatar.png" id="avatar2">
          <p id="login__user">${taskValue.login}</p>
          <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
          <br>
          <p id="valuePost">${taskValue.opis}</p>
          <br>
          <hr>
        </div>
      `

      const lS = localStorage.getItem("Avatar");
      const avatar = document.getElementById("avatar2").src = lS;

    });

}

function musicRender() {
  var task = firebase.database().ref("music/");
  const lenta = document.getElementById("lenta").style.height = "500px";
  const lentaNews = document.getElementById("lentaNews").style.height = "500px";
  try {
    const t1 = document.getElementById('t1');
    t1.parentNode.removeChild(t1);
    const t2 = document.getElementById("t2");
    t2.parentNode.removeChild(t2);
    const t3 = document.getElementById("t3");
    t3.parentNode.removeChild(t3);
  } catch {
    console.log("Pass");
  }
  task.on("child_added", function (data) {
      var taskValue = data.val();
      const date = new Date();
      document.getElementById("forRender").innerHTML += `
        <div id="post">
          <img src="avatar.png" id="avatar2">
          <p id="login__user">${taskValue.login}</p>
          <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
          <br>
          <p id="valuePost">${taskValue.opis}</p>
          <br>
          <hr>
        </div>
      `

      const lS = localStorage.getItem("Avatar");
      const avatar = document.getElementById("avatar2").src = lS;

    });
}

function gamesRender() {
  var task = firebase.database().ref("games/");
  const lenta = document.getElementById("lenta").style.height = "500px";
  const lentaNews = document.getElementById("lentaNews").style.height = "500px";
  try {
    const t1 = document.getElementById('t1');
    t1.parentNode.removeChild(t1);
    const t2 = document.getElementById("t2");
    t2.parentNode.removeChild(t2);
    const t3 = document.getElementById("t3");
    t3.parentNode.removeChild(t3);
  } catch {
    console.log("Pass");
  }
  task.on("child_added", function (data) {
      var taskValue = data.val();
      const date = new Date();
      document.getElementById("forRender").innerHTML += `
        <div id="post">
          <img src="avatar.png" id="avatar2">
          <p id="login__user">${taskValue.login}</p>
          <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
          <br>
          <p id="valuePost">${taskValue.opis}</p>
          <br>
          <hr>
        </div>
      `

      const lS = localStorage.getItem("Avatar");
      const avatar = document.getElementById("avatar2").src = lS;

    });
}

function newsRender() {
  var task = firebase.database().ref("news/");
  const lenta = document.getElementById("lenta").style.height = "500px";
  const lentaNews = document.getElementById("lentaNews").style.height = "500px";
  try {
    const t1 = document.getElementById('t1');
    t1.parentNode.removeChild(t1);
    const t2 = document.getElementById("t2");
    t2.parentNode.removeChild(t2);
    const t3 = document.getElementById("t3");
    t3.parentNode.removeChild(t3);
  } catch {
    console.log("Pass");
  }
  task.on("child_added", function (data) {
      var taskValue = data.val();
      const date = new Date();
      document.getElementById("forRender").innerHTML += `
        <div id="post">
          <img src="avatar.png" id="avatar2">
          <p id="login__user">${taskValue.login}</p>
          <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
          <br>
          <p id="valuePost">${taskValue.opis}</p>
          <br>
          <hr>
        </div>
      `

      const lS = localStorage.getItem("Avatar");
      const avatar = document.getElementById("avatar2").src = lS;

    });
}

function sportRender() {
  var task = firebase.database().ref("sport/");
  const lenta = document.getElementById("lenta").style.height = "500px";
  const lentaNews = document.getElementById("lentaNews").style.height = "500px";
  try {
    const t1 = document.getElementById('t1');
    t1.parentNode.removeChild(t1);
    const t2 = document.getElementById("t2");
    t2.parentNode.removeChild(t2);
    const t3 = document.getElementById("t3");
    t3.parentNode.removeChild(t3);
  } catch {
    console.log("Pass");
  }
  task.on("child_added", function (data) {
      var taskValue = data.val();
      const date = new Date();
      document.getElementById("forRender").innerHTML += `
        <div id="post">
          <img src="avatar.png" id="avatar2">
          <p id="login__user">${taskValue.login}</p>
          <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
          <br>
          <p id="valuePost">${taskValue.opis}</p>
          <br>
          <hr>
        </div>
      `

      const lS = localStorage.getItem("Avatar");
      const avatar = document.getElementById("avatar2").src = lS;

    });
}

function cosmosRender() {
  var task = firebase.database().ref("cosmos/");
  const lenta = document.getElementById("lenta").style.height = "500px";
  const lentaNews = document.getElementById("lentaNews").style.height = "500px";
  try {
    const t1 = document.getElementById('t1');
    t1.parentNode.removeChild(t1);
    const t2 = document.getElementById("t2");
    t2.parentNode.removeChild(t2);
    const t3 = document.getElementById("t3");
    t3.parentNode.removeChild(t3);
  } catch {
    console.log("Pass");
  }
  task.on("child_added", function (data) {
      var taskValue = data.val();
      const date = new Date();
      document.getElementById("forRender").innerHTML += `
        <div id="post">
          <img src="avatar.png" id="avatar2">
          <p id="login__user">${taskValue.login}</p>
          <p id="clock">Добавлен: ${taskValue.day}:${taskValue.month}:${taskValue.year}</p>
          <br>
          <p id="valuePost">${taskValue.opis}</p>
          <br>
          <hr>
        </div>
      `

      const lS = localStorage.getItem("Avatar");
      const avatar = document.getElementById("avatar2").src = lS;

    });
}

function reload() {
  location.reload();
}
