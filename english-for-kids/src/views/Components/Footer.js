import Helpers from "../../js/Utils/Helpers";
import createElement from "../../js/Utils/createElement";

const Footer = () => {
    const footer = createElement("div", "footer");
    footer.innerHTML = `
    <a href="https://rs.school/js/"> 
         <img src= "assets/img/rs_school_js.svg" width='30' height='30' alt="rs"/>
     </a>
     <div>2020</div>
     <a href="https://github.com/Arcuman">Arcuman</a>
    `;
    document.body.prepend(footer);
};
export default Footer;
