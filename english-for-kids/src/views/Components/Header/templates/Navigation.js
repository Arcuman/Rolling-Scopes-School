import NavMenu from "./NavMenu";
import MenuBtn from "./MenuBtn";

export default function createMenuBtn() {
    return `
  <nav class="navigation">
  ${MenuBtn()} ${NavMenu()}
   </nav>
  `;
}
