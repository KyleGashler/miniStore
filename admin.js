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
    var itemDocument = db.collection("Item");

    //check balance
    $("#findbal").click(function () {
        var uvuId = parseInt(document.getElementById("checkbal").value);
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
                    document.getElementById("balancecheck").innerHTML = "Your Balance is : $" + currentBalance.toFixed(2);
                }
            });
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
            document.getElementById("errors").innerHTML = error;
        });
    });

     //check inventory
     $("#submititem").click(function () {
        var itemId = parseInt(document.getElementById("itemid").value);
        console.log("itemId", itemId);
        itemDocument.get().then(function (querySnapshot) {
            console.log("querySnapshot", querySnapshot);
            querySnapshot.forEach(function (doc) { //10688754
                console.log("doc", doc.data().ItemBarcode);
                var idFromDB = parseInt(doc.data().ItemBarcode);
                console.log("idFromDB", idFromDB);
                if (idFromDB == itemId) {
                    console.log(doc.id, " => ", doc.data().Quantity);
                    var qty = doc.data().Quantity;
                    var name = doc.data().ItemName;
                    document.getElementById("checkoutresponse").innerHTML = "Quantity Remaining for " + name + " is " + qty;
                }
            });
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
            document.getElementById("errors").innerHTML = error;
        });
    });
    //Add User
    $("#submituser").click(function () {
        var custId = parseInt(document.getElementById("adduser").value);
        console.log("custId", custId);
        var dept = parseInt(document.getElementById("dept").value);
        console.log("dept", dept);
        var last = parseInt(document.getElementById("last").value);
        console.log("last", last);
        var first = parseInt(document.getElementById("first").value);
        console.log("first", first);
        var phone = parseInt(document.getElementById("phone").value);
        console.log("phone", phone);
        customerDoc.add({
            CustomerBalance: 0,
            CustomerDepartment: dept,
            CustomerFirstName: first,
            CustomerLastName: last,
            CustomerPhoneNumber: phone,
            UVUID: custId
        })
        .then(function(){
            document.getElementById("mymoneyupdate").innerHTML = "Customer added : " + custId;
        })
        .catch(function(error){
            console.log("Error addding Doc: ", error);
            document.getElementById("errors").innerHTML = error;
        });

    });
});