const preguntas = {
    es: [
        {
            pregunta: "¿Qué es SRI?",
            opciones: ["Un sistema operativo", "Un módulo del ciclo formativo ASIR", "Un protocolo de red"],
            correcta: 1
        },
        {
            pregunta: "¿Qué servicio asigna direcciones IP dinámicas?",
            opciones: ["DNS", "FTP", "DHCP"],
            correcta: 2
        },
        {
            pregunta: "¿Para qué sirve el DNS?",
            opciones: ["Resolución de nombres de dominio", "Transferencia de archivos", "Acceso remoto seguro"],
            correcta: 0
        },
        {
            pregunta: "¿Qué herramienta se recomienda para análisis de redes?",
            opciones: ["Microsoft Excel", "Wireshark", "Microsoft Word"],
            correcta: 1
        },
        {
            pregunta: "¿Cuál es un objetivo de aprendizaje del módulo SRI?",
            opciones: ["Diseñar páginas web", "Configurar y administrar servicios de red", "Programar aplicaciones móviles"],
            correcta: 1
        }
    ],
    va: [
        {
            pregunta: "Què és SRI?",
            opciones: ["Un sistema operatiu", "Un mòdul del cicle formatiu ASIR", "Un protocol de xarxa"],
            correcta: 1
        },
        {
            pregunta: "Quin servei assigna adreces IP dinàmiques?",
            opciones: ["DNS", "FTP", "DHCP"],
            correcta: 2
        },
        {
            pregunta: "Per a què serveix el DNS?",
            opciones: ["Resolució de noms de domini", "Transferència d'arxius", "Accés remot segur"],
            correcta: 0
        },
        {
            pregunta: "Quina eina es recomana per a l'anàlisi de xarxes?",
            opciones: ["Microsoft Excel", "Wireshark", "Microsoft Word"],
            correcta: 1
        },
        {
            pregunta: "Quin és un objectiu d'aprenentatge del mòdul SRI?",
            opciones: ["Dissenyar pàgines web", "Configurar i administrar serveis de xarxa", "Programar aplicacions mòbils"],
            correcta: 1
        }
    ]
};

const textos = {
    es: {
        titulo: "Test de la Guía del Alumno - SRI",
        instrucciones: "Responde las 5 preguntas. Necesitas 3 aciertos para aprobar.",
        submit: "Corregir test",
        retry: "Volver a intentar",
        aprobado: "¡Aprobado!",
        suspenso: "Suspenso",
        aciertos: "aciertos de 5",
        nota: "Nota"
    },
    va: {
        titulo: "Test de la Guia de l'Alumne - SRI",
        instrucciones: "Respon les 5 preguntes. Necessites 3 encerts per aprovar.",
        submit: "Corregir test",
        retry: "Tornar a intentar",
        aprobado: "Aprovat!",
        suspenso: "Suspès",
        aciertos: "encerts de 5",
        nota: "Nota"
    }
};

let lang = 'es';

function getLanguage() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || 'es';
}

function renderTest(idioma) {
    lang = idioma;
    const data = preguntas[lang];
    const txt = textos[lang];
    const container = document.getElementById('test-container');

    let html = `<h1>${txt.titulo}</h1>`;
    html += `<p style="text-align:center;margin-bottom:2rem;color:#666;">${txt.instrucciones}</p>`;

    data.forEach((q, i) => {
        html += `<div class="question" data-index="${i}">`;
        html += `<h3>${i + 1}. ${q.pregunta}</h3>`;
        html += `<div class="options">`;
        q.opciones.forEach((opt, j) => {
            html += `<label data-optindex="${j}">`;
            html += `<input type="radio" name="q${i}" value="${j}">`;
            html += `${opt}</label>`;
        });
        html += `</div></div>`;
    });

    html += `<div style="text-align:center;">`;
    html += `<button class="btn-submit" onclick="corregir()">${txt.submit}</button>`;
    html += `</div>`;

    html += `<div id="result"></div>`;

    container.innerHTML = html;

    document.getElementById('lang-es').className = lang === 'es' ? 'active' : '';
    document.getElementById('lang-va').className = lang === 'va' ? 'active' : '';
    document.documentElement.lang = lang === 'va' ? 'va' : 'es';
}

function corregir() {
    const data = preguntas[lang];
    const txt = textos[lang];
    let aciertos = 0;

    data.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const labels = document.querySelectorAll(`.question[data-index="${i}"] .options label`);

        labels.forEach((label, j) => {
            label.classList.remove('selected', 'correct', 'incorrect');
            if (selected && parseInt(selected.value) === q.correcta) {
                if (j === q.correcta) label.classList.add('correct');
            } else if (selected && parseInt(selected.value) === j) {
                label.classList.add('incorrect');
            }
            if (!selected && j === q.correcta) {
                label.classList.add('correct');
            }
        });

        if (selected && parseInt(selected.value) === q.correcta) {
            aciertos++;
        }
    });

    const aprobado = aciertos >= 3;
    const resultDiv = document.getElementById('result');
    const nota = Math.round((aciertos / 5) * 10);

    resultDiv.innerHTML = `
        <h2>${txt.nota}</h2>
        <div class="score">${nota}/10</div>
        <div class="score">${aciertos} ${txt.aciertos}</div>
        <div class="message ${aprobado ? 'passed' : 'failed'}">
            ${aprobado ? txt.aprobado : txt.suspenso}
        </div>
        <button class="btn-retry" onclick="reiniciar()">${txt.retry}</button>
    `;

    document.querySelector('.btn-submit').disabled = true;
    document.querySelector('.btn-submit').style.opacity = '0.5';
    document.querySelectorAll('input[type="radio"]').forEach(el => el.disabled = true);
}

function reiniciar() {
    renderTest(lang);
}

document.addEventListener('DOMContentLoaded', function () {
    const currentLang = getLanguage();
    renderTest(currentLang);

    document.getElementById('lang-es').addEventListener('click', function (e) {
        e.preventDefault();
        renderTest('es');
        window.history.replaceState({}, '', '?lang=es');
    });

    document.getElementById('lang-va').addEventListener('click', function (e) {
        e.preventDefault();
        renderTest('va');
        window.history.replaceState({}, '', '?lang=va');
    });
});
