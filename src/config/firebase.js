import firebase from 'firebase';

class Fire {
    constructor() {
      this.init();
      // this.observeAuth();
    }
  
    init = () => {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey            : '*****', //your apiKey firebase
          authDomain        : '*****', //your autDomian
          databaseURL       : '*****', //your databaseURL
          projectId         : '*****', //your projectId
          storageBucket     : '',
          messagingSenderId : '*****', //your MessagingSenderId
        });
      }
    };
} 

Fire.shared = new Fire();
export default Fire;