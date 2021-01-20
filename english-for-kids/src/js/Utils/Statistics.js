/* eslint-disable no-param-reassign */
import { get, set } from "./storage";
import DataBase from "../DataBase/cards";

export function saveStatistics(word) {}
export function resetStatistics() {
    const stat = [];
    DataBase[0].forEach((category, index) => {
        DataBase[index + 1].forEach((word) => {
            stat.push({
                id: word.audioSrc,
                clicks: 0,
                correct: 0,
                wrong: 0,
            });
        });
    });
    set("statistics", stat);
    return stat;
}
export function addClickToStatistics(wordAudio) {
    const statData = get("statistics");
    const newData = statData.map((stat) => {
        if (stat.id === wordAudio) {
            stat.clicks += 1;
        }
        return stat;
    });
    set("statistics", newData);
}

export function addCorrectToStatistics(wordAudio) {
    const statData = get("statistics");
    const newData = statData.map((stat) => {
        if (stat.id === wordAudio) {
            stat.correct += 1;
        }
        return stat;
    });
    set("statistics", newData);
}
export function addWrongToStatistics(wordImage) {
    const statData = get("statistics");
    const newData = statData.map((stat) => {
        if (stat.id === wordImage) {
            stat.wrong += 1;
        }
        return stat;
    });
    set("statistics", newData);
}

export function getStatistics() {
    let stat = get("statistics");
    if (!stat) {
        stat = resetStatistics();
    }
    return stat;
}
