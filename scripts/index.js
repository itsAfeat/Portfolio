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
}

VANTA.WAVES({
    el: "#wave",
    mouseControls: true,
    touchControls: false,
    gyroControls: true,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00
})