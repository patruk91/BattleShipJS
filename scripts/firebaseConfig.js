let firebaseConfig = {
    apiKey: "AIzaSyAVggAA9N-LVNqxRWakfDJMKeSY5a_u6FE",
    authDomain: "battleshipjs.firebaseapp.com",
    databaseURL: "https://battleshipjs.firebaseio.com",
    projectId: "battleshipjs",
    storageBucket: "",
    messagingSenderId: "6989014295",
    appId: "1:6989014295:web:db8daa7b8d36d6ed"
};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
