// Рандомное число
const getRandId = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();

// user
const user = JSON.parse(localStorage.getItem('user'));

// Компонент task - задание
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
      <li class="list-group-item d-flex justify-content-between align-items-center" id="task">
        {{ data.name }}
        <span class="badge bg-danger rounded-pill" style="cursor: pointer;" @click="task_done()"><i class="fas fa-trash"></i></span>
      </li>
    `
});

// Vue часть
const vue = new Vue({
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
 
    // Методы
    methods: {
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

function add_task_db(index) {
    let nameElem = document.getElementById("name-task").value;
    let id = vue.$data.tasks[index].id;

    firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/tasks/task${id}`).set({
        name: nameElem,
        id: id,
    });
}

firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/tasks/`).get().then((snapshot) => {
    for (let key in snapshot.val()) {
        firebase.database().ref(`school${user.school}/teachers/teacher${user.code}/tasks/${key}`).get().then((snapshot) => {
            let nameTask = snapshot.val().name;
            let idTask = snapshot.val().id;

            vue.$data.tasks.push({
                name: nameTask,
                id: idTask,
            });
        });
    }
});

