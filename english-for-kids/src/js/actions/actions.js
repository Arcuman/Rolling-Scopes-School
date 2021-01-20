import {
    CHANGE_MODE,
    CLEAR_AUDIO_ARRAY,
    END_GAME,
    IS_PLAY_MODE,
    SET_AUDIO_ARRAY,
    START_GAME,
    ANSWER_AUDIO,
    SHUFFLE_AUDIO_ARRAY,
    SET_REPEAT,
    DELETE_LAST_AUDIO,
    ADD_WRONG_ANSWER,
} from "../redux/types";

export function changePlayModeCasual() {
    return {
        type: CHANGE_MODE,
    };
}
export function isPlayMode() {
    return {
        type: IS_PLAY_MODE,
    };
}

export function clearAudioArray() {
    return {
        type: CLEAR_AUDIO_ARRAY,
    };
}
export function setAudioArray(arr) {
    return {
        type: SET_AUDIO_ARRAY,
        payload: arr,
    };
}
export function shuffleAudioArray() {
    return {
        type: SHUFFLE_AUDIO_ARRAY,
    };
}
export function deleteLastAudio() {
    return {
        type: DELETE_LAST_AUDIO,
    };
}
export function addWrongAnswer() {
    return {
        type: ADD_WRONG_ANSWER,
    };
}
export function setRepeat(isRepeat) {
    return {
        type: SET_REPEAT,
        payload: isRepeat,
    };
}

export function answer(path) {
    return {
        type: ANSWER_AUDIO,
        audioPath: path,
    };
}

export function setStartGame() {
    return {
        type: START_GAME,
    };
}
export function endGame() {
    return {
        type: END_GAME,
    };
}

export function changePlayMode() {
    return function change(dispatch) {
        dispatch(endGame());
        dispatch(changePlayModeCasual());
    };
}
export function startGame() {
    return function start(dispatch) {
        dispatch(shuffleAudioArray());
        dispatch(setStartGame());
    };
}

// export function asyncPlayCurrentAudio() {
//     return function (dispatch) {
//         setTimeout(() => {
//             dispatch(playCurrentAudio());
//         }, 1000);
//     };
// }
