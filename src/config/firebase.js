import firebase from 'firebase';

let config = {
  apiKey: "AIzaSyCadzINZnyDcVDpwjuQXh5H4RiCu9hgEys",
  authDomain: "chatify-d30d5.firebaseapp.com",
  databaseURL: "https://chatify-d30d5.firebaseio.com",
  projectId: "chatify-d30d5",
  storageBucket: "chatify-d30d5.appspot.com",
  messagingSenderId: "752254279622",
  appId: "1:752254279622:web:fc2d0893c97b4fc7"
}

firebase.initializeApp(config);

export default firebase