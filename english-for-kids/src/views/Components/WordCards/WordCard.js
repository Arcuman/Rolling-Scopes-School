/* eslint-disable */
import createElement from "../../../js/Utils/createElement";
import wordCardTemplate from "./templates/wordCardTemplate";
import {
    addClickToStatistics,
    addCorrectToStatistics,
    addWrongToStatistics,
} from "../../../js/Utils/Statistics";

function playNextAudio(audioPath, ms) {
    setTimeout(() => {
        const audio = new Audio(`assets/${audioPath}`);
        audio.play();
    }, ms);
}

function flip(card) {
    card.querySelector(".word-card__inner").classList.add("rotate");
}

function addHandlers(
    card,
    state,
    audioSrc,
    deleteLastAudio,
    addWrongAnswer,
    addStar
) {
    card.querySelector(".word-card-flip").addEventListener("click", (e) => {
        e.stopPropagation();
        flip(card);
    });
    card.querySelector(".word-card__inner").addEventListener(
        "mouseleave",
        () => {
            card.querySelector(".word-card__inner").classList.remove("rotate");
        }
    );
    card.addEventListener("click", () => {
        if (card.getAttribute("disabled") === "true") {
            return;
        }
        if (!state.playMode.value) {
            addClickToStatistics(audioSrc);
            const audio = new Audio(`assets/${audioSrc}`);
            audio.play();
        } else if (state.gameState.value) {
            const audioArray = state.audioArray.value;
            if (audioArray[audioArray.length - 1] === audioSrc) {
                // right answer
                const audio = new Audio("assets/audio/correct.mp3");
                audio.play();
                addCorrectToStatistics(audioSrc);
                addStar(false);
                deleteLastAudio();
            } else {
                // wrong answer
                const audio = new Audio("assets/audio/error.mp3");
                audio.play();
                addWrongToStatistics(audioArray[audioArray.length - 1]);
                addStar(true);
                addWrongAnswer();
            }
        }
    });
}

export default function WordCard(
    { word, image, translation, audioSrc },
    state,
    deleteLastAudio,
    addWrongAnswer,
    addStar
) {
    const card = createElement("div", "word-card");
    card.innerHTML = wordCardTemplate(word, image, translation).trim();
    addHandlers(
        card,
        state,
        audioSrc,
        deleteLastAudio,
        addWrongAnswer,
        addStar
    );

    if (state.gameState.value && !state.audioArray.value.includes(audioSrc)) {
        card.classList.add("word-card-disabled");
        card.setAttribute("disabled", "true");
    } else {
        card.classList.remove("word-card-disabled");
        card.setAttribute("disabled", "false");
    }
    return card;
}
