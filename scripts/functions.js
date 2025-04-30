const rawTab = () => { return "&ensp;".repeat(4); };
const getLogNum = (str) => { return Number(str.substring(3, str.indexOf(' '))); }
const removeExt = (str) => { return str.replace(/\.[^/.]+$/, ""); }

function scrollToElem(elem) {
    document.getElementsByClassName("cmd")[0].classList.remove("enabled");
    elem.scrollIntoView();
}

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
        if (func != undefined) {
            ce.onclick = function () { func() };
        }
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

function parseLog(index) {
    if (typeof index == "string") {
        let fname = `${index}.txt`;
        index = logFNames.indexOf(fname);
        if (index == -1) {
            fetch(`logs/${fname}`)
                .then(r => r.text())
                .then(text => {
                    logContent[index] = text;
                    index = logContent.length;
                });
        }
        // let fname = isNaN(filename) ? (filename[filename.length - 4] != '.' ? `${filename}.txt` : filename) : String(logFNames[filename]);
    }

    let lines = logContent[index].split("\n");
    lines.forEach((l) => {
        if (lines.indexOf(l) == 0) { term.echo(""); }
        if (l && l.trim()) {
            let isRaw = false;

            if (l[0] == ';') {
                switch (l[1]) {
                    case 'd':
                        l = `[[b;#fff;;]${l.substring(2)}]`;
                        break;
                    case 't':
                        l = `<b id="logTitle">${l.substring(2)}</b>`
                        isRaw = true;
                        break;
                    case 'r':
                        l = l.substring(2);
                        isRaw = true;
                        break;
                    case 's':
                        l = `[[i;#777;;]${l.substring(2)}]`;
                        break;
                }
            }

            l = l.replaceAll('\\t', '\t')
                .replaceAll('\\n', '\n')
                .replace(/\[(\d+)\]/g, (_match, number) => {
                    return isRaw ? `<b style="color:white;">{${number}}</b>` : `[[b;#fff;;]{${number}}]`;
                })
                .replace(/\(([IVXLCDM]+)\)/g, (match, _number) => {
                    return isRaw ? `<b style="color:white;">${match}</b>` : `[[b;#fff;;]${match}]`;
                });
            if (/\{\d+\}/g.test(l)) {
                l = l.replace(/"([^"]*)"/g, '[[iu;#aaa;;]"$1"]');
            }

            // result.push(l, isRaw);
            term.echo(l, { raw: isRaw });
        }
    });
}

function toggleCollapsibles(collapseAll) {
    for (let buttons of document.querySelectorAll("button.collapsible")) {
        if (collapseAll) {
            buttons.classList.remove("active");
            buttons.nextElementSibling.style.maxHeight = null;
        } else {
            buttons.classList.add("active");
            let content = buttons.nextElementSibling;
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }

    if (!collapseAll) { refreshClickables(); }
}