const ingredients = document.querySelectorAll('.ingredient');
const bowlSlots = document.querySelectorAll('.bowl-slot');
const cookButton = document.querySelector('#cook-button');
const loading = document.querySelector('.loading');

let bowl = [];

ingredients.forEach(function (element){
    element.addEventListener('click', function (){
        addIngredient(element.innerText);
    })
});

cookButton.addEventListener('click', createRecipe);

function addIngredient(ingredient){
    const maxSlots = bowlSlots.length;

    // prima dell'inserimento
    if (bowl.length === maxSlots) {
        bowl.shift();
    }

    bowl.push(ingredient);

    bowlSlots.forEach(function (slot, index){
        if (bowl[index]) {
            slot.innerText = bowl[index];
        }
    });

    // dopo l'inserimento
    if (bowl.length === maxSlots) {
        cookButton.classList.remove('hidden');
    }
}

function createRecipe() {
    loading.classList.remove('hidden');
}