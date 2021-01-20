/* eslint-disable operator-linebreak,no-restricted-globals,no-case-declarations */

import { rootReducer } from "./js/redux/rootReducer";
import Categories from "./views/Pages/Main/Categories/Categories";
import { CardContainerInit, Cards } from "./views/Pages/Main/Cards/Cards";
import Stats from "./views/Pages/Main/Stats/Stats";
import HeaderInit, { setCurrentMenu } from "./views/Components/Header/Header";
import { Main, MainInit } from "./views/Components/Main/Main";
import Error from "./views/Pages/Main/Error";
import Helpers from "./js/Utils/Helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./styles/style.scss";
import Win from "./views/Pages/Main/Win";
import Fail from "./views/Pages/Main/Fail";
import DataBase from "./js/DataBase/cards";

import { connect } from "./js/redux/createStore";
import {
    addWrongAnswer,
    changePlayMode,
    deleteLastAudio,
    endGame,
    setAudioArray,
    setRepeat,
    startGame,
} from "./js/actions/actions";
import { setCards } from "./views/Pages/Main/Cards/actions/actions";
import { getStatistics } from "./js/Utils/Statistics";
import Footer from "./views/Components/Footer";

function createParsedUrl(request) {
    return (
        (request.resource ? `/${request.resource}` : "/") +
        (request.id ? "/:id" : "") +
        (request.verb ? `/${request.verb}` : "")
    );
}

const router = (state, cardContainer, setCardsHandler) => {
    setCurrentMenu(location.hash);
    const request = Helpers.parseRequestURL();
    const parsedURL = createParsedUrl(request);
    const content = document.querySelector(".main-container");
    content.innerHTML = "";
    switch (parsedURL) {
        case "/":
        case "/categories":
            content.appendChild(Categories());
            break;
        case "/category/:id":
            if (request.id > 0 && request.id < DataBase.length) {
                const arr = DataBase[request.id].map((card) => card.audioSrc);
                setCardsHandler(DataBase[request.id], arr);
                content.appendChild(cardContainer);
            } else if (request.id === "stat") {
                content.appendChild(cardContainer);
            } else {
                content.appendChild(Error("Page not found"));
            }
            break;
        case "/stats":
            content.appendChild(Stats());
            break;
        case "/win":
            content.appendChild(Win());
            break;
        case "/fail":
            content.appendChild(Fail(state));
            break;
        default:
            content.appendChild(Error("Page not found"));
    }
};

const create = () => {
    location.hash = "/";
    getStatistics();
    const store = connect(rootReducer);
    Footer();
    MainInit();

    const startGameHandler = () => {
        const request = Helpers.parseRequestURL();
        const audios = DataBase[request.id].map((card) => card.audioSrc);
        store.dispatch(setAudioArray(audios));
        store.dispatch(startGame());
    };
    const repeat = (value) => store.dispatch(setRepeat(value));

    const cardContainer = CardContainerInit(startGameHandler, repeat);

    const changeMode = () => store.dispatch(changePlayMode());

    const addWrongAnswerHandler = () => store.dispatch(addWrongAnswer());
    const deleteLastAudioHandler = () => store.dispatch(deleteLastAudio());
    const endGameHandler = () => store.dispatch(endGame());

    const setCardsHandler = (cards) => {
        store.dispatch(endGame());
        store.dispatch(setCards(cards));
    };

    HeaderInit(changeMode);

    store.subscribe(() => {
        const state = store.getState();

        document.body.classList = state.playMode.value ? "play-mode" : "";

        Cards(
            cardContainer,
            state,
            deleteLastAudioHandler,
            addWrongAnswerHandler,
            repeat,
            endGameHandler
        );
    });
    store.dispatch({ type: "INIT_APPLICATION" });
    router(store.getState(), cardContainer, setCardsHandler);
    // Listen on hash change:
    window.addEventListener("hashchange", (e) => {
        router(store.getState(), cardContainer, setCardsHandler);
    });
};
// Listen on page load:
window.addEventListener("load", create);
