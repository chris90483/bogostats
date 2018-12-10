slots = {};
arrays = [];
itemsBought = [];
itemsAvailable =[];


$( document ).ready(function () {
    checkCookies();
    fillStore();
    fillSlots();
    document.getElementById("score").innerText += " " + getProgressField("score");
    // document.getElementById("array1").innerText = array.toString();
    var xmlHttpTest = new XMLHttpRequest();
    xmlHttpTest.open("GET", "/buy");
    xmlHttpTest.send("item=something");
});

// send an xmlHttpRequest
// type = 'GET','POST, etc.
// path = "/buy" for example
// contents = '{key=value}' (JSON)
function sendRequest(type, path, contents) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(type, path);
    xmlHttpRequest.send(contents);
}
function updateStore() {
    //TODO: something in the future
    return null;
}

function handleBtnClick(slotNumber) {
    sort(slotNumber);
    if (/*TODO: some condition in the future */ true) {
        updateStore();
    }
}

function addToStore(itemName, price) {
    var items = document.getElementById("store-items");
    var itemdiv = document.createElement("div");
    var itemtxt = document.createElement("p");
    var itembuy = document.createElement("button");
    itemdiv.className = "store-item";
    itemtxt.innerText = itemName + " cost: " + price;
    itemtxt.appendChild(document.createElement("br"));
    itembuy.innerText = "buy me";
    itemdiv.appendChild(itemtxt);
    itemdiv.appendChild(itembuy);
    items.appendChild(itemdiv);
}

// Ugly method
function addToSlots(item) {
    var items = document.getElementById("slots");
    var itemdiv = document.createElement("div");
    var itemrowdiv = document.createElement("div");
    itemrowdiv.className = "row";
    itemdiv.style = "text-align: center";
    itemdiv.id = "slot" + item['slotId'];
    var itemarrdiv = document.createElement("div");
    var itemarrdivcol = document.createElement("div");
    // This defines breedte of the arrdivcol-thing
    itemarrdivcol.className = "col-8";
    itemarrdiv.id = "array" + item['slotId'];
    itemarrdiv.className = "array";
    itemarrdivcol.appendChild(itemarrdiv);
    var itemsort = document.createElement("button");
    var itemsortcol = document.createElement("div");
    itemsortcol.className = "col-4";
    itemsort.onclick = function(){
        handleBtnClick(item['slotId'])
    };
    //TODO: Add name of sorting algorithm
    itemsort.innerText = "Sort!";
    itemsortcol.appendChild(itemsort);
    itemrowdiv.appendChild(itemsortcol);
    itemrowdiv.appendChild(itemarrdivcol);
    itemdiv.appendChild(itemrowdiv);
    items.appendChild(itemdiv);

}

function fillStore() {
    var items = getProgressField("itemsAvailable");
    for (var i = 0; i < items.length; i++) {
        addToStore(items[i]['itemName'], items[i]['price'])
    }
}

function fillSlots() {
    var items = getProgressField("slots");
    for (var i = 0; i < items.length; i++) {
        addToSlots(items[i]);
        var array = document.getElementById("array" + items[i]['slotId']);
        arrays[i] = generateArray(items[i]['length']);
        array.innerText = arrays[i];
    }
}

function generateArray(length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = i;
    }
    return shuffle(result);
}


function sort(slotNumber) {
    var new_arr = bogosort(arrays[slotNumber], slotNumber);
    document.getElementById("array" + parseInt(slotNumber)).innerText = new_arr.toString();
}

function bogosort(arr, slotNumber) {
    arr = shuffle(arr);
    if (sorted(arr)) {
        // update score
        var score = getProgressField("score");
        newScore = parseInt(score) + 1;
        setProgressField("score", newScore);
        document.getElementById("score").innerText = "Score: " + newScore;

        // do CSS animation
        var arr_duplicate = document.getElementById("array" + 1).cloneNode(true);
        arr_duplicate.setAttribute("style", "");
        arr_duplicate.style.position = "fixed";
        var offsets = getAbsoluteElemOffsets(document.getElementById("array" + slotNumber));
        arr_duplicate.style.top = offsets[0] + "px";
        arr_duplicate.style.left = (1.65 * offsets[1]) + "px";
        arr_duplicate.style.textAlign = "center";
        document.getElementById("slot" + slotNumber).children[0].appendChild(arr_duplicate);
        arr_duplicate.className = "array-solved";
        setTimeout(function() {
            var toRemove = document.getElementsByClassName("array-solved");
            for (var i = 0; i < toRemove.length; i++) {
                document.getElementById("slot" + slotNumber).children[0].removeChild(toRemove[i]);
            }
        }, 2000);
    }
    return arr;
}

function getAbsoluteElemOffsets(elem) {
    var pos = $( '#' + elem.id.toString() ).offset();
    return [pos.top, pos.left];
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function sorted(arr) {
    if (arr.length < 2) {
        return true
    } else {
        return arr[0] < arr[1] && sorted(arr.slice(1, arr.length))
    }

}

// Set a cookie
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

// Check if the required cookies exist, if not make them
function checkCookies() {
    var progress = getCookie("progress");
    if (progress !== "") {
        // progress exists
    } else {
        setCookie("progress", initProgress())
    }
}

function initProgress() {
    var obj = {};
    obj['score'] = 0;
    obj['itemsBought'] = [];
    obj['itemsAvailable'] = [];
    obj['slots'] = [];
    var initSlot = {};
    initSlot['length'] = 4;
    initSlot['slotId'] = 0;
    initSlot['algo'] = "bogosort";
    obj['slots'][0] = initSlot;
    return JSON.stringify(obj)
}

// Convert the cookie string into a js object, does not support arrays or nested objects.
function cookieStringToObj() {
    var obj = {};
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        key_value_pair = c.split('=');
        obj[key_value_pair[0]] = key_value_pair[1]
    }
    return obj;
}

function getProgressField(fieldName) {
    data = JSON.parse(getCookie("progress"));
    fields = fieldName.split(".");
    if (fields.length === 1) { // this can be used to extend support to nested objects in JSON
        return data[fieldName]
    }  else {
        return data[fieldName]
    }
}

function setProgressField(fieldName, value) {
    data = JSON.parse(getCookie("progress"));
    fields = fieldName.split(".");
    if (fields.length === 1) { // this can be used to extend support to nested objects in JSON
        data[fieldName] = value // if this gets extends be careful that not part of cookie gets deleted
    }  else {
        data[fieldName] = value
    }
    setCookie("progress", JSON.stringify(data))
}

// Get the value of a cookie by name
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}