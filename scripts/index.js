const scanlines = $('.scanlines');
const tv = $('.tv');
function exit() {
    $('.tv').addClass('collapse');
    term.disable();
}

var pdfFNames = [];
var logFNames = [];

const apiDelay = 1500;
const apiUrl = "https://p0rtf0l10-4p1.netlify.app/api/";

$(document).ready(() => {
    $.ajax({
        url: `${apiUrl}logs/`,
        type: "GET",
        success: data => {
            logFNames = [];
            String(data).substring(0, data.length - 1).split(';').forEach(d => {
                logFNames.push(d)
            });

            let logsText = document.getElementById('logsText')
            logsText.innerHTML = "Loading logs[&#10004;]";
            logsText.style["color"] = "green";

            setTimeout(() => { logsText.remove(); }, apiDelay);
        },
        error: err => {
            console.error("Error fetching logs:", err);
        }
    });
    $.ajax({
        url: `${apiUrl}pdfs/`,
        type: "GET",
        success: data => {
            pdfFNames = [];
            String(data).substring(0, data.length - 1).split(';').forEach(d => {
                pdfFNames.push(d)
            });

            let pdfsText = document.getElementById('pdfsText')
            pdfsText.innerHTML = "Loading PDFs[&#10004;]";
            pdfsText.style["color"] = "green";

            setTimeout(() => { pdfsText.remove(); }, apiDelay + 250);
        },
        error: err => {
            console.error("Error fetching PDFs:", err);
        }
    });

    flicker();
});

// ref: https://stackoverflow.com/q/67322922/387194
let __EVAL = (s) => eval(`void (__EVAL = ${__EVAL}); ${s}`);
const sound = new Audio('https://cdn.jsdelivr.net/gh/jcubic/static@master/assets/mech-keyboard-keystroke_3.mp3')

const term = $('#terminal').terminal(function (command, term) {
    const cmd = $.terminal.parse_command(command);
    if (cmd.name === 'echo') {
        term.echo(cmd.rest);
    } else if (command !== '') {
        try {
            var result = __EVAL(command);
            if (result && result instanceof $.fn.init) {
                term.echo('<#jQuery>');
            } else if (result && typeof result === 'object') {
                tree(result);
            } else if (result && typeof result === 'function') {
                result();
            } else if (result !== undefined) {
                term.echo(new String(result));
            }

            if (String(command).indexOf('log') != -1) {
                var elem = document.getElementById('logTitle');
                if (elem != null) { elem.scrollIntoView(); }
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
        // sound.play();
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
  
  \`\`[[i;#aaa;;command]Det ligesom et normalt portefølje, men... terminal]´´ - mig B^)\n`;
        }, { formatters: false });
        this.echo('Skriv <b class="clickableComm">help</b> for at se tilgængelige kommandoer. <b class="clickableComm">pdf</b> for at se pdf\'er eller <b class="clickableComm">log</b> for logs.', { raw: true });
        // this.echo('Type [[b;#fff;;command]exit] to see turn off animation.');
        // this.echo('Type and execute [[b;#fff;;command]grab()] function to get the scre' +
        //     'enshot from your camera');
        // this.echo('Type [[b;#fff;;command]camera()] to get video and [[b;#fff;;command]pause()]/[[b;#fff;;command]play()] to stop/play');

        refreshClickables();
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

cssVars(); // ponyfill