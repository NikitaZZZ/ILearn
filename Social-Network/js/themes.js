function darkThemes() {
  //localStorage set theme
  localStorage.setItem("Theme", "dark");

  // Nav
  let nav = document.getElementById("nav").style.background = "#575757";
  let home_button = document.getElementById("home_button").style.background = "#575757";
  let home_button_color = document.getElementById("home_button").style.color = "rgb(53, 223, 240)";
  let icon_nav = document.getElementById("img").style.background = "#575757";
  let icon_button_nav = document.getElementById("imgP").style.background = "#575757";

  // Icon src 
  let icon_src_nav = document.getElementById("img").src = "lar.png";
  let icon_src_whatNew = document.getElementById("icon2").src = "lar.png";

  //CreatePost on nav
  let createPost = document.getElementById("createPost").style.background = "#575757";
  let createPost_color = document.getElementById("createPost").style.color = "#fff";

  //Body
  document.body.style.background = "rgb(98, 96, 96)";

  // Divs
  let profile_div = document.getElementById("profile").style.background = "rgb(89, 89, 89)";
  let whatNew_div = document.getElementById("whatNew").style.background = "rgb(89,89,89)";
  let whatNews_borderBottom = document.getElementById("whatNew").style.borderBottom = "1px solid silver";
  let whatNews_borderLeft = document.getElementById("whatNew").style.borderLeft = "none";
  let whatNews_borderRight = document.getElementById("whatNew").style.borderRight = "none";
  let whatNews_borderTop = document.getElementById("whatNew").style.borderTop = "none";
  let lentaNews_background_div = document.getElementById("lentaNews").style.background = "rgb(89,89,89)";
  let popularTematics_div = document.getElementById("popular").style.background = "rgb(89,89,89)";

  // Elements on profile div
  let email_user = document.getElementById("email_user").style.color = "#fff";
  let signOut = document.getElementById("signOut").style.background = "#575757";
  let signOut_color = document.getElementById("signOut").style.color = "#fff";
  let settings = document.getElementById("settings").style.background = "#575757";
  let settings_color = document.getElementById("settings").style.color = "#fff";

  // Elements on lentaNews div
  let newQuest = document.getElementById("newQuest").style.height = "34px";
  let newQuest_background = document.getElementById("newQuest").style.background = "#575757";
  let newQuest_color = document.getElementById("newQuest").style.color = "#fff";
  let newQuest_border = document.getElementById("newQuest").style.border = "1px solid silver";
  let send_background = document.getElementById("send").style.background = "#575757";
  let send_border = document.getElementById("send").style.border = "1px solid silver";
  let send_color = document.getElementById("send").style.color = "#fff";
  let t1 = document.getElementById("t1").style.color = "#fff";
  let t2 = document.getElementById("t2").style.color = "#fff";
  let t3 = document.getElementById("t3").style.color = "#fff";

  try {

  } catch {
    
  }
}
