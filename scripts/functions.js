const rawTab = () => { return "&ensp;&ensp;&ensp;&ensp;"; };

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
    let elems = document.getElementsByClassName("clickableComm")
    for (let e of elems) {
        let eText = e.innerHTML;
        if ((eText.indexOf('(')) != -1 || eText.indexOf('|') != -1) {
            eText = eText.split(/[\W]+/)[0];
        }

        let func = getFunctionFromString(eText);
        e.onclick = function () { func() };
    }
}