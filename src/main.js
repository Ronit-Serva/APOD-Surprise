const API_KEY = import.meta.env.VITE_NASA_API_KEY;

document.querySelector("#app").innerHTML = '<h1>Loading... ⏳</h1>';

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
    .then(api_response => api_response.json())
    .then(APOD => {
        let media; // will contain the element which is going to display the APOD: <image>;<video>;<iframe>

        if (APOD.media_type === 'image') {
            media = `<image src="${APOD.url}"/>`;
        }

        else {
            if (APOD.url.includes('youtube')) {
                media = `<iframe src="${APOD.url}"></iframe>`;
            }
            else {
                media = `<video src="${APOD.url}" controls></video>`;
            }
        }

        // display the title, media, and explanation of APOD on the website by adding them to the index.html
        document.querySelector("#app").innerHTML = `
        <h1>${APOD.title}</h1>
        ${media}
        <p>${APOD.explanation}</p>`;
    })
    .catch(err => { //catch any error in executing this statement and display it on screen
        document.querySelector("#app").innerHTML = `Error: ${err.message}`;
    })

