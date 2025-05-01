const cmds = {
    "help": ["Vis denne menu", 8, false],
    "log(f,c)": ["Vis alle logs eller en specifik med [[i;#fff;;]f]", 4, {
        "f": ["[string/int]", "Enten hele log navnet (ex log24) eller index'et"],
        "c": ["[boolean]\t", "Ryd skærmen inden logens indhold udskrives\n"]
    }],

    "pdf(f,c)": ["Vis alle pdf'er eller en specifik med [[i;#fff;;]f]", 4, {
        "f": ["[string/int]", "PDF navnet (ex gruppekontrakt), eller index'et"],
        "c": ["[boolean]\t", "Ryd skærmen inden logens indhold udskrives\n"]
    }],

    "flicker(s)": ["Slå TV effekt til/fra. Dette kan være rart at slå fra når PDF'er læses", 2, {
        "s": ["[boolean]\t", "true/false alt efter om effekten skal tændes eller ej\n"]
    }],

    "clear": ["Ryd skærmen", 7, false],
    "camera": ["Vis et live feed fra dit webcam (brug clear for at slukke)", 6, false],
    "play/pause": ["Start og/eller pause webcam feed'et", 2, false],
    "exit": ["Vis 'exit' animation", 8, false],
    "minge": ["Minge... min Oblivion karakter (han er en altmer)", 7, false]
}

const flickElm = document.getElementById('flick');
const scannElm = document.getElementById('scann');
const noiseElm = document.getElementById('noise');
var flickerState = true;

function help() {
    term.echo("\n[[bu;#fff;;]SCHWAG menu]")
    Object.entries(cmds).forEach(([key, value]) => {
        let tabAmount = parseInt(value[1]);

        term.echo(`- <b class="clickableComm">${key}</b>${"&ensp;".repeat(tabAmount)}${value[0]}`, { raw: true });
        if (value[2] != false) {
            let paramDict = value[2];
            Object.entries(paramDict).forEach(([param, desc]) => {
                term.echo(`\t- [[i;#fff;;]${param}] = ${desc[0]}\t${desc[1]}`);
            });
        }
    });

    term.echo("\n[[b;#fff;;]!OBS!]\nAlle parametre er 'optional'.");

    term.echo("\n[[b;#fff;;]!OBS OBS!]\nDette fungere som en javascript terminal, det vil sige, at skrive du console.log('bøvs') og inspicerer konsolen, vil der stå bøvs.");
    term.echo("Det er derfor vigtigt, at når der indskrives parametre, og det fx et er et filnavn (en string) så skal \"gåseøjne\" rundt om.");
    term.echo("Samtidigt, så er alle kommandoerne en funktion der bliver kaldt. Skal der ingen parametre med kan man undvære paranteserne.")

    refreshClickables();
}

function pdf(filename, clear) {
    if (clear) { term.clear(); }

    if (filename != null) {
        let fname = isNaN(filename) ? (filename.includes('.pdf') ? filename : `${filename}.pdf`) : pdfFNames[filename];
        term.echo(`<center><iframe class="pdf" src="pdfs/${fname}" width="800" height="800"></iframe></center>`, { raw: true });
    }
    else {
        term.echo(`\nFandt [[u;#fff;;]${pdfFNames.length}] pdf'er...`);
        for (let i = 0; i < pdfFNames.length; i++) {
            let fName = removeExt(pdfFNames[i]);
            term.echo(`${rawTab()}<b>[${i}]</b> <b class="clickableLink" onclick="pdf(${i})">${fName}</b>`, { raw: true });
        }
    }
}

function log(filename, clear) {
    if (typeof filename == "boolean") {
        clear = Boolean(filename);
        filename = null;
    }
    if (clear) { term.clear(); }

    if (filename != null) {
        parseLog(filename);
        refreshClickables();

        term.echo(`<hr/><b id="returnBtn" class="clickableComm">Vis alle logs</b><hr/>`, { raw: true });
        document.getElementById("returnBtn").addEventListener("click", function () {
            log(null, true);
        });
    }
    else {
        term.echo(`\nFandt [[u;#fff;;]${logFNames.length}] logs...\n`);
        for (let i = 0; i < logFNames.length; i++) {

            let fName = removeExt(logFNames[i])
            term.echo(`<button data-btn-index=${i} class="collapsible">${fName}</button><div id="div${i}" class="content"><br/></div>`, { raw: true });
            parseLog(i, false);

            // This flippin' sucks... but it works B^)
            let contentDiv = document.getElementById(`div${i}`);
            let output = document.querySelector("div.terminal-output").children;
            let startIndex = document.querySelectorAll(`div[data-index='${Number(contentDiv.parentElement.parentElement.dataset.index) + 1}']`)[0].dataset.index;
            let endIndex = Number(output[output.length - 1].dataset.index);

            for (let j = startIndex; j <= endIndex; j++) {
                let newline = false;
                let elm = document.querySelector(`div[data-index='${j}']`);

                let nlIndex = elm.innerText.indexOf("\\n");
                if (nlIndex != -1) {
                    if (nlIndex < 2) {
                        contentDiv.append(document.createElement('br'));
                    } else {
                        newline = true;
                    }
                    elm.innerHTML = elm.innerHTML.replaceAll("\\n", "\n");
                }

                contentDiv.append(elm);
                if (newline) { contentDiv.append(document.createElement('br')); }
            }
        }

        term.echo(`<hr/><b id="expAllBtn" class="clickableComm">Vis all</b> | <b id="colAllBtn" class="clickableComm">Skjul all</b><hr/>`, { raw: true });
        document.getElementById("colAllBtn").addEventListener("click", function () {
            toggleCollapsibles(true);
        });
        document.getElementById("expAllBtn").addEventListener("click", function () {
            toggleCollapsibles(false);
        });

        for (let ce of document.getElementsByClassName("collapsible")) {
            ce.addEventListener("click", function () {
                this.classList.toggle("active");
                let content = this.nextElementSibling;

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }

                refreshClickables();
                scrollToElem(this);
            });

            ce.addEventListener("dblclick", function () {
                log(Number(ce.dataset.btnIndex), true);
            });
        }
    }
}

function flicker(state) {
    if (state != null) { flickerState = Boolean(state); }
    else { flickerState = !flickerState }

    if (flickerState) {
        flickElm.classList.add("flicker");
        scannElm.classList.add("scanlines");
        noiseElm.classList.add("noise");
    }
    else {
        flickElm.classList.remove("flicker");
        scannElm.classList.remove("scanlines");
        noiseElm.classList.remove("noise");
    }
}

function minge(option) {
    clear();

    let opt = Boolean(option == null ? Math.floor(Math.random() * 2) : option);
    if (opt) {
        term.echo(`
            <center>
                <img id="mingeGif" src="minge/minge.png" style="border: 15px ridge #cc00cc"></img>
            </center>`,
            { raw: true }
        );
    }
    else {
        term.echo(`
            <center>
                <video autoplay style="border: 15px ridge #cc00cc">
                    <source src="minge/movie.mp4" type="video/mp4">
                    Your browser does not support minge (╥﹏╥)
                </video>
            </center>`,
            { raw: true }
        );
    }
    term.echo('<center><h1><b onclick="minge()">Minge</b>, my beloved ⸜(｡˃ ᵕ ˂ )⸝♡</h1></center>', { raw: true });
}