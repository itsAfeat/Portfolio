const scanlines = $('.scanlines');
const tv = $('.tv');
function exit() {
    $('.tv').addClass('collapse');
    term.disable();
}

// ref: https://stackoverflow.com/q/67322922/387194
let __EVAL = (s) => eval(`void (__EVAL = ${__EVAL}); ${s}`);
const sound = new Audio('https://cdn.jsdelivr.net/gh/jcubic/static@master/assets/mech-keyboard-keystroke_3.mp3')

const term = $('#terminal').terminal(function (command, term) {
    const cmd = $.terminal.parse_command(command);
    if (cmd.name === 'exit') {
        exit();
    } else if (cmd.name === 'echo') {
        term.echo(cmd.rest);
    } else if (command !== '') {
        try {
            var result = __EVAL(command);
            if (result && result instanceof $.fn.init) {
                term.echo('<#jQuery>');
            } else if (result && typeof result === 'object') {
                tree(result);
            } else if (result !== undefined) {
                term.echo(new String(result));
            }
        } catch (e) {
            term.error(new String(e));
        }
    }
}, {
    name: 'js_porte',
    onResize: set_size,
    exit: false,
    // detect iframe codepen preview
    enabled: $('body').attr('onload') === undefined,
    keydown() {
        sound.play();
    },
    onInit: function () {
        set_size();
        this.echo(() => {
            return `
 ░▒▓███████▓▒░░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░ ░▒▓██████▓▒░  
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
 ░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓█▓▒▒▓███▓▒░ 
       ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█████████████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░  
  
  \`\`[[i;;;]Det ligesom et normalt portefølje, men... terminal]´´ - mig B^)\n`;
        }, { formatters: false });
        this.echo('Type [[b;#fff;;command]exit] to see turn off animation.');
        this.echo('Type and execute [[b;#fff;;command]grab()] function to get the scre' +
            'enshot from your camera');
        this.echo('Type [[b;#fff;;command]camera()] to get video and [[b;#fff;;command]pause()]/[[b;#fff;;command]play()] to stop/play');
    },
    greetings: false,
    prompt: '\n#> '
});

term.on('click', '.command', function () {
    const command = $(this).data('text');
    term.exec(command, { typing: 100 });
});

function set_size() {
    // for window height of 170 it should be 2s
    const height = $(window).height();
    const width = $(window).width()
    const time = (height * 2) / 170;
    scanlines[0].style.setProperty("--time", time);
    tv[0].style.setProperty("--width", width);
    tv[0].style.setProperty("--height", height);
}

function tree(obj) {
    term.echo(treeify.asTree(obj, true, true));
}
var constraints = {
    audio: false,
    video: {
        width: { ideal: 1280 },
        height: { ideal: 1024 },
        facingMode: "environment"
    }
};

var acceptStream = (function () {
    return 'srcObject' in document.createElement('video');
})();

function camera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        term.pause();
        const media = navigator.mediaDevices.getUserMedia(constraints);
        media.then(function (mediaStream) {
            term.resume();
            let stream;
            if (!acceptStream) {
                stream = window.URL.createObjectURL(mediaStream);
            } else {
                stream = mediaStream;
            }
            term.echo('<video data-play="true" class="self"></video>', {
                raw: true,
                onClear: function () {
                    if (!acceptStream) {
                        URL.revokeObjectURL(stream);
                    }
                    mediaStream.getTracks().forEach(track => track.stop());
                },
                finalize: function (div) {
                    const video = div.find('video');
                    if (!video.length) {
                        return;
                    }
                    if (acceptStream) {
                        video[0].srcObject = stream;
                    } else {
                        video[0].src = stream;
                    }
                    if (video.data('play')) {
                        video[0].play();
                    }
                }
            });
        });
    }
}
var play = function () {
    const video = term.find('video').slice(-1);
    if (video.length) {
        video[0].play();
    }
}
function pause() {
    term.find('video').each(function () {
        this.pause();
    });
}


function grab() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        term.pause();
        const media = navigator.mediaDevices.getUserMedia(constraints);
        media.then(function (mediaStream) {
            const mediaStreamTrack = mediaStream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(mediaStreamTrack);
            return imageCapture.takePhoto();
        }).then(function (blob) {
            term.echo('<img src="' + URL.createObjectURL(blob) + '" class="self"/>', {
                raw: true,
                finialize: function (div) {
                    div.find('img').on('load', function () {
                        URL.revokeObjectURL(this.src);
                    });
                }
            }).resume();
        }).catch(function (error) {
            term.error('Device Media Error: ' + error);
        });
    }
}
async function pictuteInPicture() {
    const [video] = $('video');
    try {
        if (video) {
            if (video !== document.pictureInPictureElement) {
                await video.requestPictureInPicture();
            } else {
                await document.exitPictureInPicture();
            }
        }
    } catch (error) {
        term.error(error);
    }
}
function clear() {
    term.clear();
}

// Custom functions & variables
const cmds = {
    "help()": ["Vis denne menu", 3, false],
    "logs(f,c)": ["Vis alle logs eller en specifik med [[i;#fff;;]f]", 2, {
        "f": ["[string/int]", " Enten hele log navnet (ex log24) eller bare log nummeret (ex 24)"],
        "c": ["[boolean]\t", " Ryd skærmen inden logens indhold udskrives\n"]
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
}

function logs(logName, clear) {
    if (clear == true) { term.clear(); }

    if (logName != null) {
        let filename = isNaN(logName) ? logName : `log${logName}`;

        fetch(`logs/${filename}.txt`)
            .then(r => r.text())
            .then(text => {
                let lines = text.split("\n");
                lines.forEach((l) => {
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
                });
            });
    }
    else {
        $.getJSON('https://itsafeat.github.io/Portfolio/logs/', data => {
            term.echo(`\nFound [[u;#fff;;]${data.length}] log[[b;;;]s]...`)
            data.forEach((d) => term.echo(`\t- ${d}`))
        })
    }
}

// github('jcubic/jquery.terminal');
cssVars(); // ponyfill
