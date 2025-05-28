/// One liners
const rawTab = () => { return "&ensp;".repeat(4); };
const getLogNum = (str) => { return Number(str.substring(3, str.indexOf(' '))); }
const removeExt = (str) => { return str.replace(/\.[^/.]+$/, ""); }

/// Variables & constants
var pdfFNames = [];
var logFNames = [];
var logContent = {};
const apiUrl = "https://p0rtf0l10-4p1.netlify.app/api/";

function initLogs() {
    let logDiv = document.getElementById("logDiv");

    if (logFNames.length != 0) {
        for (let i = 0; i < logFNames.length; i++) {
            let fname = logFNames[i];

            let btnElm = document.createElement("button");
            let divElm = document.createElement("div");
            let conElm = document.createElement("span");

            btnElm.type = "button"
            btnElm.innerText = fname;
            btnElm.classList = ["collapsible"];
            divElm.classList = ["col-content"];

            (async () => {
                conElm.innerHTML = parseHTML(await parseLog(fname));
            })()

            logDiv.appendChild(btnElm);
            logDiv.appendChild(divElm);
            divElm.appendChild(conElm);
        }

        var btns = document.getElementsByClassName("collapsible");
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function () {
                this.classList.toggle("col-active");
                let content = this.nextElementSibling;
                if (content.style.display == "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    }
}

// Functions
async function parseLog(logName) {
    if (logContent[logName] == undefined) {
        let result = await (await fetch(`../logs/${logName}`)).text();
        logContent[logName] = result;
        return result;

    } else {
        return logContent[logName];
    }
}

function parseHTML(text) {
    let result = "";
    let lines = String(text).split("\n");
    lines.forEach(l => {
        if (l && l.trim()) {
            if (l[0] == ';') {
                switch (l[1]) {
                    case 'd':
                        l = `<b style="color:#000">${l.substring(2)}</b>`;
                        break;
                    case 't':
                        l = `<h2><b id="logTitle">${l.substring(2)}</b></h2>`
                        break;
                    case 'r':
                        l = l.substring(2);
                        break;
                    case 's':
                        l = `<i style="color:#444">\u201C${l.substring(2)}\u201D</i>`;
                        break;
                }
            }

            l = l.replaceAll('\\n', '<br/>').replaceAll('\n', '<br/>').replaceAll('\\t', rawTab()).replaceAll('\t', rawTab());
            l = l.replace(/\[(\d+)\]/g, (_match, number) => {
                return `<b>{${number}}</b>`;
            }).replace(/\(([IVXLCDM]+)\)/g, (match, _number) => {
                return `<b>${match}</b>`;
            });

            if (/\{\d+\}/g.test(l)) {
                l = l.replace(/"([^"]*)"/g, '<i><u style="color:#444">"$1"</u></i>')
            }

            // result.replaceAll('\n', '<br/>').replaceAll('\t', rawTab());
            result += `${l}<br/>`;
        }
    });

    return `${result}<hr/>`;
}