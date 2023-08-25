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
const loadingMessage = document.querySelector('.loading-message');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');
const recipeContent = document.querySelector('.recipe-content');
const recipeImage = document.querySelector('.recipe-image');

let bowl = [];

ingredients.forEach(function (element){
    element.addEventListener('click', function (){
        addIngredient(element.innerText);
    })
});

modalClose.addEventListener('click', function(){
    modal.classList.add('hidden');
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
    loadingMessage.innerText = getRandomLoadingMessage();
    loading.classList.remove('hidden');

    const interval = setInterval(() => {
        loadingMessage.innerText = getRandomLoadingMessage();
        
    }, 2000);

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

    loading.classList.add('hidden');
    modal.classList.remove('hidden');
    clearInterval(interval);

    recipeContent.innerHTML = `\
<h2>${recipe.titolo}</h2>
<p>${recipe.ingredienti}</p>
<p>${recipe.istruzioni}</p>`;

    const imageResponse = await makeRequest(OPENAI.IMAGE_ENDPOINT, {
        prompt:  recipe.titolo,
        n: 1,
        size:'512x512'
    });

    const imageUrl = imageResponse.data[0].url;
    recipeImage.innerHTML = `<img src="${imageUrl}" alt="recipe image"`;

    clearBowl();
}

function getRandomLoadingMessage() {
    const messages = [
        'Preparo gli ingredienti...',
        'Scaldo i fornelli...',
        'Mescolo nella ciotola...',
        'Scatto foto per Instagram...',
        'Prendo il mestolo...',
        'Metto il grembiule...',
        'Mi lavo le mani...',
        'Tolgo le bucce...',
        'Pulisco il ripiano...'
    ];

    const randomIndex = Math.floor(Math.random() * messages.length)
    return messages[randomIndex];
}

function clearBowl(params) {
    bowl = [];

    bowlSlots.forEach(function (slot){
        slot.innerText = '?';
    });
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