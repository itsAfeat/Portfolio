const cmds = {
    "help()": ["Vis denne menu", 3, false],
    "log(f,c)": ["Vis alle logs eller en specifik med [[i;#fff;;]f]", 3, {
        "f": ["[string/int]", "Enten hele log navnet (ex log24) eller bare log nummeret (ex 24)"],
        "c": ["[boolean]\t", "Ryd skærmen inden logens indhold udskrives\n"]
    }],

    "pdf(f,c)": ["Vis alle pdf'er eller en specifik med [[i;#fff;;]f]", 3, {
        "f": ["[string]", "PDF navnet (ex gruppekontrakt), eller index'et"],
        "c": ["[boolean]", "Ryd skærmen inden logens indhold udskrives\n"]
    }],

    "grab()": ["Tag et skærmbillede [[b;#e60000;;](virker ikke)", 3, false],
    "camera()": ["Vis et live feed fra dit webcam (brug clear for at slukke)", 3, false],
    "play()/pause()": ["Start og/eller pause webcam feed'et", 1, false]
}

function help() {
    term.echo("\n[[bu;#fff;;]SCHWAG menu]")
    Object.entries(cmds).forEach(([key, value]) => {
        let tabAmount = parseInt(value[1]);

        term.echo(` [[i;#fff;;]- ${key}]${"\t".repeat(tabAmount)}${value[0]}`);
        if (value[2] != false) {
            let paramDict = value[2];
            Object.entries(paramDict).forEach(([param, desc]) => {
                term.echo(`\t- [[i;#fff;;]${param}] = ${desc[0]}\t${desc[1]}`);
            });
        }
    });

    term.echo("\n[[b;#fff;;]!OBS!]\nDette fungere som en javascript terminal, det vil sige, at skrive du console.log('bøvs') og inspicerer konsolen, vil der stå bøvs.");
    term.echo("Det er derfor vigtigt, at når der indskrives parametre, og det fx et er et filnavn (en string) så skal \"gåseøjne\" rundt om.");
    term.echo("Samtidigt, så er alle kommandoerne en funktion der bliver kaldt. Skal der ingen parametre med kan man undvære paranteserne.")
}

function log(filename, clear) {
    if (clear) { term.clear(); }

    if (filename != null) {
        let fname = isNaN(filename) ? filename : `log${filename}`;

        fetch(`logs/${fname}.txt`)
            .then(r => r.text())
            .then(text => {
                let lines = text.split("\n");
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
                                    l = `[[bu;#fff;;]${l.substring(2)}]`;
                                    break;
                                case 'r':
                                    l = l.substring(2);
                                    isRaw = true;
                                    break;
                            }
                        }

                        l = l.replaceAll('\\t', '\t')
                            .replaceAll('\\n', '\n');

                        term.echo(l, { raw: isRaw });
                    }
                });
            });
    }
    else {
        term.echo(`\nFound [[u;#fff;;]${logFNames.length}] log(s)...`);
        logFNames.forEach(fn => {
            term.echo(`\t- ${fn}`);
        });
    }
}

function pdf(filename, clear) {
    if (clear) { term.clear(); }

    if (filename != null) {
        let fname = isNaN(filename) ? (filename.includes('.pdf') ? filename : `${filename}.pdf`) : pdfFNames[filename];
        term.echo(`<center><iframe class="pdf" src="pdfs/${fname}" width="800" height="800"></iframe></center>`, { raw: true });
    }
    else {
        term.echo(`\nFound [[u;#fff;;]${pdfFNames.length}] pdf(s)...`);
        for (let i = 0; i < pdfFNames.length; i++) { term.echo(`\t[${i}] ${pdfFNames[i]}`); }
    }
}