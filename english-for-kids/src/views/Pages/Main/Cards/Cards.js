/* eslint-disable function-paren-newline,no-restricted-globals,operator-linebreak,comma-dangle */
import createElement from "../../../../js/Utils/createElement";
import PlayPanel from "../../../Components/WordCards/PlayPanel";
import WordCard from "../../../Components/WordCards/WordCard";
import starTemplate from "../../../Components/WordCards/templates/starTemplate";

function playNextAudio(audioPath, ms) {
    setTimeout(() => {
        const audio = new Audio(`assets/${audioPath}`);
        audio.play();
    }, ms);
}
function addStar(starContainer) {
    return function add(isWrong) {
        starContainer.appendChild(starTemplate(isWrong));
    };
}

export function CardContainerInit(startGame, repeat) {
    const container = createElement("div", "container-card");
    const playPanel = createElement("div", "play-panel");
    const starContainer = createElement("div", "star-container");
    const cardContainer = createElement("div", "container-word-card");

    playPanel.innerHTML = PlayPanel();

    container.appendChild(playPanel);
    container.appendChild(starContainer);
    container.appendChild(cardContainer);

    // TODO: How to change listener depending on state
    playPanel
        .querySelector(".play-panel-play")
        .addEventListener("click", () => {
            startGame();
        });
    playPanel
        .querySelector(".play-panel-repeat")
        .addEventListener("click", () => {
            repeat(true);
        });
    return container;
}

export function Cards(
    container,
    state,
    deleteLastAudio,
    addWrongAnswer,
    repeat,
    endGame
) {
    const playPanel = container.querySelector(".play-panel");
    const cardContainer = container.querySelector(".container-word-card");
    const starContainer = container.querySelector(".star-container");

    // const cardContainerVirtual = createElement("div", "container-word-card");

    cardContainer.innerHTML = "";
    const cards = state.cards.value.map((card) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        WordCard(
            card,
            state,
            deleteLastAudio,
            addWrongAnswer,
            addStar(starContainer)
        )
    );
    cards.forEach((card) => {
        cardContainer.appendChild(card);
    });
    // TODO: Fix Virtual DOM OR CHANGE IT ON CHECKING DATA ATTR
    // patch(recycleNode(cardContainerVirtual), cardContainer);
    // const cards = getCards(id, state);

    // cards.forEach((card) => {
    //     container.appendChild(card);
    // });
    if (state.playMode.value) {
        playPanel.classList.add("on");
    } else {
        playPanel.classList.remove("on");
    }

    if (state.gameState.value) {
        starContainer.classList.remove("invisible");
        const audioArr = state.audioArray.value;
        playPanel.querySelector(".play-panel-play").classList.remove("active");
        playPanel.querySelector(".play-panel-repeat").classList.add("active");
        if (
            state.audioArray.wrongAnswers === 0 &&
            audioArr.length === cards.length
        ) {
            playNextAudio(audioArr[audioArr.length - 1], 0);
        }
        if (state.audioArray.repeat) {
            playNextAudio(audioArr[audioArr.length - 1], 0);
            repeat(false);
        }
        if (state.audioArray.correctAnswer) {
            if (audioArr.length === 0) {
                endGame();
                if (state.audioArray.wrongAnswers === 0) {
                    location.hash = "/win";
                } else {
                    location.hash = "/fail";
                }
            } else {
                playNextAudio(audioArr[audioArr.length - 1], 600);
            }
        }
    } else {
        playPanel.querySelector(".play-panel-play").classList.add("active");
        playPanel
            .querySelector(".play-panel-repeat")
            .classList.remove("active");
        starContainer.classList.add("invisible");
        starContainer.innerHTML = "";
    }
}
