const firebaseConfig = {
    apiKey: "AIzaSyDtF1q1vlIaS4EksIPHY2VeQOSFmjSoHHI",
    authDomain: "ilearn-7629c.firebaseapp.com",
    projectId: "ilearn-7629c",
    storageBucket: "ilearn-7629c.appspot.com",
    messagingSenderId: "378249969862",
    appId: "1:378249969862:web:3ce54177ee96f6871617c7",
    measurementId: "G-84YD2XPDKB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Рандомное число
const getRandId = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();

let storageRef = firebase.storage().ref();