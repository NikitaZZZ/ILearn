const getRandId = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();

const firebaseConfig = {
    apiKey: "AIzaSyC65MsUKGaheodjyu62A-tmBiwGQDU4Gf8",
    authDomain: "learnandread-dd2c5.firebaseapp.com",
    databaseURL: "https://learnandread-dd2c5.firebaseio.com",
    projectId: "learnandread-dd2c5",
    storageBucket: "learnandread-dd2c5.appspot.com",
    messagingSenderId: "704232706479",
    appId: "1:704232706479:web:3160b2bfd2c5e7aee71f5a",
    measurementId: "G-RJD9EF1HS3"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();