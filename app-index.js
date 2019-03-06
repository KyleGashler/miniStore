$(document).ready(function () {
      // Required for side-effects
      console.log('page start');
      require("firebase/firestore");
  
   
    const firebase = require("firebase");
    // Initialize Firebase
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDdvRfCUadiJLJVSdvDw3Zte677VlPSSxE",
        authDomain: "snack-shack-4a69c.firebaseapp.com",
        databaseURL: "https://snack-shack-4a69c.firebaseio.com",
        projectId: "snack-shack-4a69c",
        storageBucket: "snack-shack-4a69c.appspot.com",
        messagingSenderId: "613097035757"
    };

    firebase.initializeApp(config);

    var firestore1 = firebase.firestore();
    const settings = {
        timestampsInSnapshots: true
    };
    firestore1.settings(settings);

    firestore1.collection("SnackShack").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    });



})