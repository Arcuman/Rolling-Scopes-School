/* eslint-disable implicit-arrow-linebreak,comma-dangle */
import CategoryCard from "../../../Components/Category/CategoryCard";
import DataBase from "../../../../js/DataBase/cards";
import createElement from "../../../../js/Utils/createElement";

const Categories = () => {
    const categories = DataBase[0]
        .map(
            (category) => `
            ${CategoryCard.render(category)}
            `
        )
        .join(" ");
    const cat = createElement("div", "container-card");
    cat.innerHTML = categories;
    return cat;
};
export default Categories;
