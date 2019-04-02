//import { parse } from "querystring";

$(document).ready(function () {
    // Required for side-effects
    console.log('page start');
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
    var db = firebase.firestore();
    var customerDoc = db.collection("Customer");
    var itemDoc = firebase.firestore().collection("Item");
    var saleDoc = firebase.firestore().collection("Sale");


    //check balance
    $("#findbal").click(function () {
        var uvuId = parseInt(document.getElementById("empid").value);
        console.log("uvuid", uvuId);
        customerDoc.get().then(function (querySnapshot) {
            console.log("querySnapshot", querySnapshot);
            querySnapshot.forEach(function (doc) { //10688754
                console.log("doc", doc.data().UVUID);
                var idFromDB = parseInt(doc.data().UVUID);
                console.log("idFromDB", idFromDB);
                if (idFromDB == uvuId) {
                    console.log(doc.id, " => ", doc.data().CustomerBalance);
                    currentBalance = doc.data().CustomerBalance;
                    document.getElementById("balancecheck").innerHTML = "Your Balance is : $" + currentBalance;
                }
            });
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
            document.getElementById("errors").innerHTML = error;    
        });
    });


    //add to balance
    $("#submitmoney").click(function () {
        var uvuId = document.getElementById("empid").value;
        var addMoney = document.getElementById("addmoney").value;
        console.log("addMoney", addMoney);
        console.log("uvuid", uvuId);
        customerDoc.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) { //10688754
                if (doc.data().UVUID == uvuId) {
                    console.log(doc.id, " => ", doc.data());
                    console.log('into match');
                    var fbid = doc.id;
                    var DocRef = customerDoc.doc(fbid);
                    var oldBalance = doc.data().CustomerBalance;
                    var intBalance = 0;
                    if(typeof oldBalance == 'string'){
                        intBalance = Number(oldBalance.replace(/[^0-9.-]+/g, ""));
                    }else{
                        intBalance = oldBalance;
                    }
                    console.log("intBalance",intBalance);
                    var addbalance = parseFloat(addMoney);
                    console.log("addbalance",addbalance);
                    var newCustBalance = addbalance + parseFloat(intBalance);
                    console.log("newCustBalance", " => ", newCustBalance);
                    if(!doc.data().CustomerDepartment)doc.data().CustomerDepartment="x";
                    if(!doc.data().CustomerFirstName)doc.data().CustomerFirstName="x";
                    if(!doc.data().CustomerLastName)doc.data().CustomerLastName="x";
                    if(!doc.data().CustomerPhoneNumber)doc.data().CustomerPhoneNumber="x";
                    DocRef.set({
                        "CustomerBalance": newCustBalance,
                        "CustomerDepartment": doc.data().CustomerDepartment,
                        "CustomerFirstName": doc.data().CustomerFirstName,
                        "CustomerLastName": doc.data().CustomerLastName,
                        "CustomerPhoneNumber": doc.data().CustomerPhoneNumber,
                        "UVUID": doc.data().UVUID
                    })
                    document.getElementById("mymoneyupdate").innerHTML = "Your Balance is now : $" + newCustBalance;
                }
            });
        }).then(function () {
            console.log("Transaction successfully committed!");
            mymoneyupdate
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
            document.getElementById("errors").innerHTML = error;    
        });

    });


});