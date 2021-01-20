/* eslint-disable indent,implicit-arrow-linebreak,function-paren-newline,no-unused-expressions */
import createElement from "../../../../js/Utils/createElement";
import DataBase from "../../../../js/DataBase/cards";
import {
    getStatistics,
    resetStatistics,
} from "../../../../js/Utils/Statistics";
import statTemplate from "./templates/statTemplate";

function findWord(wordAudio) {
    let result = {};
    DataBase.some((wordArr, index) => {
        if (index !== 0) {
            result = wordArr.find((word) => word.audioSrc === wordAudio);
            return !!result;
        }
        return false;
    });
    return result;
}

function getDifficultWords() {
    const stat = getStatistics();
    const allTrainedWords = [];
    stat.forEach((word) => {
        const countOfTrain = word.correct + word.wrong;
        if (countOfTrain && countOfTrain !== word.correct) {
            allTrainedWords.push({
                wordAudio: word.id,
                errAccuracy: (word.wrong / countOfTrain).toPrecision(3),
            });
        }
    });
    allTrainedWords.sort((a, b) => (a.errAccuracy < b.errAccuracy ? 1 : -1));
    const difficultWordArray = allTrainedWords.slice(0, 8);
    console.log(difficultWordArray);
    const result = difficultWordArray.map((difficultWord) =>
        findWord(difficultWord.wordAudio)
    );
    return result;
}

function sortTable(n) {
    const table = document.querySelector("#stat-table");
    let shouldSwitch;
    let i;
    let switchcount = 0;
    let switching = true;
    let dir = "asc";
    while (switching) {
        switching = false;
        const rows = table.getElementsByTagName("TR");
        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
            const firstElem = rows[i].getElementsByTagName("TD")[n];
            const secondElem = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir === "asc" && n < 3) {
                if (
                    firstElem.innerHTML.toLowerCase() >
                    secondElem.innerHTML.toLowerCase()
                ) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc" && n < 3) {
                if (
                    firstElem.innerHTML.toLowerCase() <
                    secondElem.innerHTML.toLowerCase()
                ) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "asc" && n >= 3) {
                if (
                    Number(firstElem.innerHTML) > Number(secondElem.innerHTML)
                ) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc" && n >= 3) {
                if (
                    Number(firstElem.innerHTML) < Number(secondElem.innerHTML)
                ) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount += 1;
        } else if (switchcount === 0 && dir === "asc") {
            dir = "desc";
            switching = true;
        }
    }
}

export default function Stats() {
    const stat = createElement("div", "statistics");
    let statData = getStatistics();
    stat.innerHTML = statTemplate(statData);

    stat.addEventListener("click", (e) => {
        e.stopPropagation();
        const { id } = e.target.dataset;
        const isReset = e.target.classList.contains("reset");
        const isRepeat = e.target.classList.contains("repeat");
        if (id) {
            sortTable(id);
            if (e.target.classList.contains("asc")) {
                e.target.classList.add("desc");
                e.target.classList.remove("asc");
            } else if (e.target.classList.contains("asc")) {
                e.target.classList.add("asc");
                e.target.classList.remove("desc");
            } else {
                const sortByAsc = stat.querySelector(".asc");
                const sortByDesc = stat.querySelector(".desc");
                sortByAsc && sortByAsc.classList.remove("desc", "asc");
                sortByDesc && sortByDesc.classList.remove("desc", "asc");
                e.target.classList.add("asc");
            }
        }
        if (isReset) {
            statData = resetStatistics();
            stat.innerHTML = statTemplate(statData);
        }
        if (isRepeat) {
            const difficultWords = getDifficultWords();
            console.log(difficultWords);
            DataBase.push(difficultWords);
            // eslint-disable-next-line no-restricted-globals
            location.hash = `/category/${DataBase.length - 1}`;
        }
    });
    return stat;
}
