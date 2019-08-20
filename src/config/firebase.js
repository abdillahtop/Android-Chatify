import Firebase from 'firebase';

let config = {
  apiKey: "AIzaSyCadzINZnyDcVDpwjuQXh5H4RiCu9hgEys",
  authDomain: "chatify-d30d5.firebaseapp.com",
  databaseURL: "https://chatify-d30d5.firebaseio.com",
  projectId: "chatify-d30d5",
  storageBucket: "",
  messagingSenderId: "752254279622",
}

let app = Firebase.initializeApp(config);

export const Database = app.database();
export const Auth = app.auth();
