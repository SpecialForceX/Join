let recipes = [];
     /** Adds a new recipe to the recipes array based on input values from HTML elements.
         * 
         * @function add
         */
function add() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');

    let recipy = {
        "title": title.value,
        "description": description.value
    };

    recipes.push(recipy);
    console.log(recipes);
    title.value = "";
    description.value = "";
}