// Importing the API_KEY from the env for making requests to NASA APOD API
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

// Function to fetch NASA APOD data and return the response converted into JS object.
async function fetch_apod(api_key, date = "today") {

    let query;
    if (date === "today") {
        query = `https://api.nasa.gov/planetary/apod?api_key=${api_key}`;
    }
    else {
        query = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${date}`
    }

    // For loop to for max 5 retries to fetch data. 
    let max_retries = 5;
    for (let attempts = 0; attempts < max_retries; attempts++) {

        try {
            const response = await fetch(query);
            if (response.ok) {
                return await response.json();
            }
        }
        catch (e) {
            if (attempts == max_retries -1) {
                throw new Error(`Failed after ${max_retries} attempts: ${e.message}`)
            }

        }
    }

}

// return the meida element to display APOD based on media_type attribute of API response
function apod_media (APOD) {
    let media; // will contain the element which is going to display the APOD: <image>;<video>;<iframe>

    if (APOD.media_type === 'image') {
            media = `<image src="${APOD.url}" style="width: 600px; height: auto;"/>`;
    }

    else {
        if (APOD.url.includes('youtube')) {
            media = `<iframe src="${APOD.url}"></iframe>`;
        }
        else {
            media = `<video src="${APOD.url}" controls></video>`;
        }
    }

    return media;
}


// Displaying the loading text till the APOD data is fetched and displayed on the website
document.querySelector("#app").innerHTML = `
    <div class="loading-text" >
        <h1>✦✦✦ Loading the Astronomy Picture of the Day ✦✦✦</h1>
    </div>`;

// call fetch_apod to fetch APOD for today and await for fulfillment of the promise returned
let APOD = null;
try {
    APOD = await fetch_apod(NASA_API_KEY);
} catch (e) {
    document.querySelector("#app").innerHTML =`
    <h1>Sorry, we ran into an error.</h1>
    <p>Tip: Try closing and revisting this website, open developer console move to the network tab and try reloading the website, it will most likely work.</p>`
}


let media_element = apod_media(APOD);

document.querySelector("#app").innerHTML = `
        <h1>${APOD.title}</h1>
        ${media_element}
        <div id="explanation" >
            <p>${APOD.explanation}</p>
        </div>
        <button type="button" id="time-travel">
            <h2>Let's Time Travel...</h2>
        </button>
        <dialog id="form-dailog">
            <div id="form-container">
                <form id="dob-form">
                    <p id="form-title">Enter your birthdate here, and we'll take you back in time...</p>
                    <input type="date" id="date-picker">
                    <button id="submit-btn" type="submit">Take Me Back</button>
                </form>
            </div>
        </dialog>
        `;


// Selecting the DOM elements to listen for events/collect values from
const form_btn = document.getElementById("time-travel");
const form_modal = document.getElementById("form-dailog");
const dob_form = document.getElementById("dob-form");
const dob_input = document.getElementById("date-picker");

// Listening for click on the "Take Me Back..." button
form_btn.addEventListener('click', _ => {
    form_modal.showModal();
    dob_form.addEventListener('submit', async event => {
        // prevent default page reload behaviour of form submit
        event.preventDefault();
        // collect the value of the date entering input field
        const dob = dob_input.value;
        
        // display a loading text while dob specific APOD is being fetched
        document.querySelector("#app").innerHTML = `
        <div class="loading-text" >
            <h1>✦✦✦ Preparing your surprise ✦✦✦</h1>
        </div>` 

        // fetch apod for the entered birthdate 
        const birthdate_APOD = await fetch_apod(NASA_API_KEY, dob);

        let dob_media_element = apod_media(birthdate_APOD);

        //display the birthdate specific APOD
        document.querySelector("#app").innerHTML = `
        <h1>This was the NASA APOD on the day you were born...❤️</h1>
        <h2>${birthdate_APOD.title}</h2>
        ${dob_media_element}
        <div id="explanation" >
            <p>${birthdate_APOD.explanation}</p>
        </div>`

    })
})