function change() {
  // Добавление аватарки в localStorage
  const url = document.getElementById("urlAvatar").value;
  localStorage.setItem('Avatar', url);

  // Меняем аватарку на сайте, путем изымания из localStorage url картинки.
  const lS = localStorage.getItem("Avatar");
  const avatar = document.getElementById("avatar").src = lS;
}
