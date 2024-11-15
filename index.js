let artStyle = ""
// let userRequest = ""

const input = document.querySelector("textarea");
const log = document.getElementById("promptText");
input.addEventListener("input", updateValue);

function updateValue(e) {
    log.textContent = e.target.value;
}

const checkboxes = document.querySelectorAll("input")
for (const checkbox of checkboxes) {
    checkbox.addEventListener("click", checkedValue);
}

function checkedValue(e) {
    artStyle += e.target.value
    console.log(artStyle)
}


function generateArt(uRequest) {

    // let description = prompt("Describe a picture/visual art you would like to create")
    // let artStyle = prompt("Write a style you would like your art to be")
    // let userRequest = "Create an image according to this request: " + description + " in style: " + artStyle

    fetch('https://api.openai.com/v1/images/generations', {
        body: JSON.stringify({
            prompt: uRequest,
            model: "dall-e-3",
            n: 1,
            size: "1024x1024",
            response_format: "url",
            style: "vivid"
        }),
        headers: { 'Content-Type': 'application/json'
        },
        method: 'POST'
    }).then(response => response.json()).then(result => {
        let link = result.data[0].url
        let userArt = document.querySelector("img")
        userArt.setAttribute("src", link)

        let download = document.querySelector("a")
        download.setAttribute("href", link)

    })
}

document.getElementById("generate").addEventListener("click", (event) => {
    event.preventDefault();
    let userRequest = createRequest(artStyle)
    generateArt(userRequest)
})

document.getElementById("create-new").addEventListener("click", (event) => {
    window.location.reload();
})

function createRequest(style) {
    let description = log.textContent
    let uRequest = "Create an image according to this request: " + description + " in style: " + style
    console.log(description)
    console.log(uRequest)
    return uRequest
}