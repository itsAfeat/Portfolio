const rawTab = () => { return "&ensp;&ensp;&ensp;&ensp;"; };
const getLogNum = (str) => { return Number(str.substring(3, str.indexOf(' '))); }
const removeExt = (str) => { return str.replace(/\.[^/.]+$/, ""); }

function getApiArray(url) {
    $.ajax({
        url: url,
        type: "GET",
        success: data => {
            let arr = [];
            String(data).substring(0, data.length - 1).split(';').forEach(d => {
                arr.push(d);
            })

            return arr;
        },
        error: err => {
            console.error(`Error fetching data: `, err);
        }
    });
}

// Get func from string without the use of eval
function getFunctionFromString(str) {
    var scope = window;
    var scopeArr = str.split('.');

    for (let i = 0; i < scopeArr.length - 1; i++) {
        scope = scope[scopeArr[i]];
        if (scope == undefined) return;
    }

    return scope[scopeArr[scopeArr.length - 1]];
}

function refreshClickables() {
    let comElems = document.getElementsByClassName("clickableComm")
    let imgElems = document.getElementsByTagName("img");

    for (let ce of comElems) {
        let eText = ce.innerHTML;
        if ((eText.indexOf('(')) != -1 || eText.indexOf('|') != -1) {
            eText = eText.split(/[\W]+/)[0];
        }

        let func = getFunctionFromString(eText);
        ce.onclick = function () { func() };
    }

    for (let ie of imgElems) {
        let src = ie.src;
        let ext = src.substring(src.lastIndexOf('.'));

        // Make sure it doesn't apply to the geocities gifs
        if (ext != ".gif" && !ie.classList.contains('geoImg')) {
            ie.onclick = function () { window.open(src, '_blank'); }
            ie.style["cursor"] = "zoom-in";
        }
    }
}