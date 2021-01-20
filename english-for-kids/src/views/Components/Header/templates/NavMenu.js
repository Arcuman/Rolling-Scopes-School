/* eslint-disable indent */
// eslint-disable-next-line import/no-unresolved
/* eslint-disable implicit-arrow-linebreak,comma-dangle */
import DataBase from "../../../../js/DataBase/cards";

export default function createNavMenu() {
    const menuOptions = DataBase[0]
        .map(
            (MenuItem) => `
            <li>
                 <a href="/#/category/${MenuItem.id}" id="nav-link">${MenuItem.name}</a>
            </li>`
        )
        .join(" ");
    return `
    <div  class="nav leftslide">
        <ul class="nav-inner">
            <li>
                 <a class="active" href="/#/categories" id="nav-link">Categories</a>
           </li>
           ${menuOptions}
            <li>
                  <a href="/#/stats" id="nav-link">Stats</a>
            </li>
        </ul>
    </div>
    `;
}
