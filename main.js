const OPENAI = {
    // inserisci la tua chiave
    API_KEY: '',
    API_BASE_URL: 'https://api.openai.com/v1',
    CHAT_ENDPOINT: '/chat/completions',
    IMAGE_ENDPOINT: '/images/generations',  
};

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

async function createRecipe() {
    loading.classList.remove('hidden');

    const prompt = `\
Crea una ricetta con questi ingredienti: ${bowl.join(', ')}.
La ricetta deve essere facile e con un titolo creativo e divertente.
Le tue risposte sono solo in formato JSON come questo esempio:

###

{
    "titolo": "Titolo ricetta",
    "ingredienti": "1 uovo e 1 pomodoro",
    "istruzioni": "mescola gli ingredienti e metti in forno"
}

###`;

    const recipeResponse = await makeRequest(OPENAI.CHAT_ENDPOINT, {
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'user',
            content: prompt,
        }]
    })

    const recipe = JSON.parse(recipeResponse.choices[0].message.content);

    
}

async function makeRequest(endpoint, payload) {
    const response = await fetch(OPENAI.API_BASE_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI.API_KEY}`
        },
        body: JSON.stringify(payload)
    });

    const json = await response.json();
    return json;
}