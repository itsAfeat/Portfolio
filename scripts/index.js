function toggleNav() {
    var navs = document.getElementsByClassName("topnav");
    for (let n of navs) {
        if (n.className === "topnav") {
            n.className += " responsive";
        } else {
            n.className = "topnav";
        }
    }
}

function changePage(id) {
    let clicked = document.getElementById(id);
    let clicker = document.querySelector("a.active");

    try {
        if (clicker.id != id) {
            clicked.classList.add("active");
            clicker.classList.remove("active");
        }
    } catch (ex) {
        changePage(id);
    }

    if (`${id}` == '2') {
        
    }
}