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
    var itemDocument = db.collection("Item");
    var saleDoc = db.collection("Sale");

    //get Item
    $("#submititem").click(function () {
        var uvuId = parseInt(document.getElementById("empid").value);
        var itemId = parseInt(document.getElementById("itemid").value);
        var retrievedQty = parseInt(document.getElementById("itemqty").value);
        var itemQty = 1
        if (retrievedQty > 0) {
            itemQty = retrievedQty;
        }

        itemQty = Math.abs(itemQty);
        console.log("uvuid", uvuId);
        console.log("itemId", itemId);
        console.log("itemQty", itemQty);

        customerDoc.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var idFromDB = parseInt(doc.data().UVUID);
                console.log("idFromDB", idFromDB);
                if (idFromDB == uvuId) {
                    //pull item from db
                    itemDocument.get().then(function (itemQuerySnapshot) {
                        itemQuerySnapshot.forEach(function (itemDoc) {
                            var itemIdFromDB = parseInt(itemDoc.data().ItemBarcode);
                            //match item to checkout code
                            if (itemId == itemIdFromDB) {
                                console.log("itemDoc.data()", itemDoc.data());
                                console.log("itemDoc barcode", itemDoc.data().ItemBarcode);

                                var itemCost = 0;
                                const unparsedItemCost = itemDoc.data().ItemPrice;
                                var itemCount = parseFloat(itemDoc.data().Quantity).toFixed(2);
                                var itemName = itemDoc.data().ItemName;
                                if (typeof unparsedItemCost == 'string') {
                                    console.log("item cost was a string");
                                    itemCost = Number(unparsedItemCost.replace(/[^0-9.-]+/g, ""));
                                } else {
                                    itemCost = unparsedItemCost;
                                }
                                itemCost = parseFloat(itemCost).toFixed(2);;
                                console.log("itemCost", itemCost);
                                console.log("itemCount", itemCount);

                                //create new transaction
                                saleDoc.add({
                                    ItemBarcode: itemId,
                                    SaleDate: new Date(),
                                    SalePrice: itemCost,
                                    SaleQuantity: itemQty,
                                    SaleTotal: itemCost * itemQty,
                                    UVUID: uvuId
                                })
                                    .then(function (Ref) {
                                        console.log("Document written with ID ", Ref.ID);

                                    })
                                    .catch(function (error) {
                                        console.log("Error addding Doc: ", error)
                                    });

                                //update item count
                                var fbitemId = itemDoc.id;
                                console.log("fbitemId", fbitemId);
                                var itemDocRef = itemDocument.doc(fbitemId);

                                if (!doc.data().CustomerDepartment) doc.data().CustomerDepartment = "x";
                                if (!doc.data().CustomerFirstName) doc.data().CustomerFirstName = "x";
                                if (!doc.data().CustomerLastName) doc.data().CustomerLastName = "x";
                                if (!doc.data().CustomerPhoneNumber) doc.data().CustomerPhoneNumber = "x";
                                itemDocRef.set({
                                    "ItemBarcode": itemDoc.data().ItemBarcode,
                                    "ItemName": itemName,
                                    "ItemPrice": itemDoc.data().ItemPrice,
                                    "Quantity": itemCount - itemQty
                                });


                                //update customer balance
                                var fbid = doc.id;
                                var DocRef = customerDoc.doc(fbid);
                                var oldBalance = doc.data().CustomerBalance;
                                var parsedBalance = 0;
                                if (typeof oldBalance == 'string') {
                                    parsedBalance = Number(oldBalance.replace(/[^0-9.-]+/g, ""));
                                } else {
                                    parsedBalance = oldBalance;
                                }
                                var newCustBalance = parseFloat(parsedBalance).toFixed(2) - (itemCost * itemQty);
                                console.log("newCustBalance", " => ", newCustBalance);

                                if (!doc.data().CustomerDepartment) doc.data().CustomerDepartment = "x";
                                if (!doc.data().CustomerFirstName) doc.data().CustomerFirstName = "x";
                                if (!doc.data().CustomerLastName) doc.data().CustomerLastName = "x";
                                if (!doc.data().CustomerPhoneNumber) doc.data().CustomerPhoneNumber = "x";
                                DocRef.set({
                                    "CustomerBalance": newCustBalance,
                                    "CustomerDepartment": doc.data().CustomerDepartment,
                                    "CustomerFirstName": doc.data().CustomerFirstName,
                                    "CustomerLastName": doc.data().CustomerLastName,
                                    "CustomerPhoneNumber": doc.data().CustomerPhoneNumber,
                                    "UVUID": doc.data().UVUID
                                });

                                //display cust balance checkoutresponse
                                document.getElementById("checkoutresponse").innerHTML = "Enjoy your " + itemName + "! Your new balance is : $" + newCustBalance.toFixed(2);
                            }
                        });
                    });
                }
            });
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
            document.getElementById("errors").innerHTML = error;
        });
    });

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
                    document.getElementById("balancecheck").innerHTML = "Your Balance is : $" + currentBalance.toFixed(2);
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
                    var fbid = doc.id;
                    var DocRef = customerDoc.doc(fbid);
                    var oldBalance = doc.data().CustomerBalance;
                    var intBalance = 0;
                    if (typeof oldBalance == 'string') {
                        intBalance = Number(oldBalance.replace(/[^0-9.-]+/g, ""));
                    } else {
                        intBalance = oldBalance;
                    }
                    console.log("intBalance", intBalance);
                    var addbalance = parseFloat(addMoney);
                    console.log("addbalance", addbalance);
                    var newCustBalance = addbalance + parseFloat(intBalance);
                    console.log("newCustBalance", " => ", newCustBalance);
                    if (!doc.data().CustomerDepartment) doc.data().CustomerDepartment = "x";
                    if (!doc.data().CustomerFirstName) doc.data().CustomerFirstName = "x";
                    if (!doc.data().CustomerLastName) doc.data().CustomerLastName = "x";
                    if (!doc.data().CustomerPhoneNumber) doc.data().CustomerPhoneNumber = "x";
                    DocRef.set({
                        "CustomerBalance": newCustBalance,
                        "CustomerDepartment": doc.data().CustomerDepartment,
                        "CustomerFirstName": doc.data().CustomerFirstName,
                        "CustomerLastName": doc.data().CustomerLastName,
                        "CustomerPhoneNumber": doc.data().CustomerPhoneNumber,
                        "UVUID": doc.data().UVUID
                    })
                    document.getElementById("mymoneyupdate").innerHTML = "Your Balance is now : $" + newCustBalance.toFixed(2);
                }
            });
        }).then(function () {
            console.log("Transaction successfully committed!");
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
            document.getElementById("errors").innerHTML = error;
        });
    });

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
                    document.getElementById("balancecheck").innerHTML = "Your Balance is : $" + currentBalance.toFixed(2);
                }
            });
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
            document.getElementById("errors").innerHTML = error;
        });
    });
    //admin jump
    $("#admin").click(function () {
        window.location.replace("http://www.ministore.com/admin.html");
    });


});