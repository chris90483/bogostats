currentalg = "bogo"
score = 0
array = [3, 2, 1, 0]

$( document ).ready(function () {
    document.getElementById("array").innerText = array.toString();
});

function sort() {
    new_arr = []
    if (currentalg == "bogo") {
        new_arr = bogosort(array);
    }
    document.getElementById("array").innerText = new_arr.toString();
}

function bogosort(arr) {
    arr = shuffle(arr);
    if (sorted(arr)) {
        score += 1;
        document.getElementById("score").innerText = "Score: " + score.toString();
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