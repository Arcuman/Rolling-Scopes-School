import DataBase from "../../../../../js/DataBase/cards";
import { getStatistics } from "../../../../../js/Utils/Statistics";

function generateWords(index, category, statData) {
    let info;
    let procent;
    const words = DataBase[index + 1].map((word) => {
        info = statData.find((stat) => stat.id === word.audioSrc);
        procent =
            info.correct + info.wrong
                ? (info.wrong / (info.correct + info.wrong)).toPrecision(3)
                : Number(0).toPrecision(3);
        return `<tr>
            <td aria-label="Word">${word.word}</td>
            <td aria-label="Translation">${word.translation}</td>
            <td class="spec" aria-label="Category">${category.name}</td>
            <td aria-label="Trained">${info.clicks}</td>
            <td aria-label="Correct">${info.correct}</td>
            <td aria-label="Wrong">${info.wrong}</td>
            <td aria-label="%">${procent}</td>
        </tr>`;
    });
    return words.join("");
}

export default function statTemplate(statData) {
    const table = DataBase[0]
        .map((category, index) => generateWords(index, category, statData))
        .join("");
    return `
            <div class="statistics-buttons">
                <div class="btn-stat reset">Reset</div>
                <div class="btn-stat repeat">Train difficult words</div>
            </div>
            <div class="statistics-table">
                <table id="stat-table">
                    <tr>
                        <th data-id="0">Word</th>
                        <th data-id="1">Translation</th>
                        <th class="spec" data-id="2">Category</th>
                        <th data-id="3">Trained</th>
                        <th data-id="4">Correct</th>
                        <th data-id="5">Wrong</th>
                        <th data-id="6">%Error</th>
                    </tr>
                    ${table}
                </table>
            </div>
        `;
}
