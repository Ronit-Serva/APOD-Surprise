const API_KEY = import.meta.env.VITE_NASA_API_KEY;

document.querySelector("#app").innerHTML = `
    <div class="loading-text" >
        <h1>✦✦✦ Loading the Astronomy Picture of the Day ✦✦✦</h1>
    </div>`;

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
    .then(api_response => api_response.json())
    .then(APOD => {
        
        // dynamically create the media element to display APOD based on it being video/img/UTube URL. 
        let media_element;
        media_element = apod_media(APOD)

        // DOB entering form for the user.
        let DOB_FORM;

        DOB_FORM = `
        <form id="dob-form" >
            <input type="date" id="datepicker">
            <button type="submit" id="dob-submit">Let's travel back...</button>
        </form>
        `;

        // display the title, media, and explanation of APOD on the website by adding them to the index.html
        document.querySelector("#app").innerHTML = `
        <h1>${APOD.title}</h1>
        ${media_element}
        <div id="explanation" >
            <p>${APOD.explanation}</p>
        </div>
        ${DOB_FORM}
        `;
    })
    .then(_ => {
        // Logic for DOB specific APOD display
        const dob_form_submit = document.getElementById("dob-submit")
        const dob_input = document.getElementById("datepicker")

        dob_form_submit.addEventListener("click", function(event) {

            //prevent submitting the form from reloading the website
            event.preventDefault();

            // get the value of the dob_input field
            const dob = dob_input.value;

            //print DOB value on console
            console.log(dob);

            //fetch and display the APOD for the date of birth collected
            display_apod_dob(dob);
        })
    })
    .catch(err => { //catch any error in executing this statement and display it on screen
        document.querySelector("#app").innerHTML = `Error: ${err.message}`;
    })

    // function to fetch and display APOD data on the website along with a custom loading page. 
function display_apod_dob(date_of_birth) {

    //display a loading text while data is being fetched
    document.querySelector("#app").innerHTML = `
    <div class="loading-text" >
        <h1>✦✦✦ Preparing your surprise ✦✦✦</h1>
    </div>`

    //fetch APOD data for user's DOB 
    let query;

    query = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date_of_birth}`

    fetch(query)
    .then(response => response.json())
    .then(apod_of_dob => {
        
        let media_element;
        media_element = apod_media(apod_of_dob);

        document.querySelector("#app").innerHTML = `
        <h1>This was the NASA APOD on the day you were born...❤️</h1>
        <h2>${apod_of_dob.title}</h2>
        ${media_element}
        <div id="explanation" >
            <p>${apod_of_dob.explanation}</p>
        </div>`

    })
}

// return the appropriate media element which will display APOD
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





// first you listen for the event of the form
// second: When that happens you check the value of the input field, and if it's valid then you proceed 
// you collect the DOB and call the fetch APOD_date function in order to fetch the APOD of a specific date; in the meantime you display a custom loading page. 
// you display the APOD for the specific day


    




