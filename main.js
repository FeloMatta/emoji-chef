const ingredients = document.querySelectorAll('.ingredient');
const bowlSlots = document.querySelectorAll('.bowl-slot');

let bowl = [];

ingredients.forEach(function (element){
    element.addEventListener('click', function (){
        addIngredient(element.innerText);
    })
});

function addIngredient(ingredient){
    if (bowl.length === bowlSlots.length) {
        bowl.shift();
    }
    
    bowl.push(ingredient);

    bowlSlots.forEach(function (slot, index){
        if (bowl[index]) {
            slot.innerText = bowl[index];
        }
    });
}