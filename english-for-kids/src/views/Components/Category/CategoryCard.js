const CategoryCard = {
    render: ({ name, image, id }) => `
        <a href="/#/category/${id}" class="category card" style="width: 18rem;">
            <img class="card-img-top" src="assets/${image}" alt="Category">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
            </div>
        </a>
        `,
};
export default CategoryCard;
