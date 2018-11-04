currentalg = "bogo";
array = [3, 2, 1, 0];

$( document ).ready(function () {
    checkCookies();
    document.getElementById("score").innerText += " " + getCookie("score");
    document.getElementById("array").innerText = array.toString();
});

function sort() {
    new_arr = [];
    if (currentalg === "bogo") {
        new_arr = bogosort(array);
    }
    document.getElementById("array").innerText = new_arr.toString();
}

function bogosort(arr) {
    arr = shuffle(arr);
    if (sorted(arr)) {
        var score = getCookie("score");
        newScore = parseInt(score) + 1;
        setCookie("score", newScore);
        document.getElementById("score").innerText = "Score: " + newScore;
    }
    return arr;
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
    if (arr.length == 1) {
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
    var score = getCookie("score");
    if (score !== "") {
        // score exists
    } else {
        setCookie("score", 0)
    }
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

// Get the value of a cookie by name
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}