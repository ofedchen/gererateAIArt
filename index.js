let artStyle = ""
const input = document.querySelector("textarea");
const log = document.getElementById("promptText");
const styleOnPage = document.createElement("h4")
const wrapper = document.querySelector(".wrapper")
const form = document.querySelector("form")
const buttonDownload = document.getElementById("download")
const buttonCreateNew = document.getElementById("create-new")
const animatedH2 = document.getElementById("gen-animation")

input.addEventListener("input", onInput);

function onInput(e) {
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

function createRequest(style) {
    let description = log.textContent
    let uRequest = "Create an image according to this request: " + description + " in style:" + style
    console.log(description)
    console.log(uRequest)
    return uRequest
}

function generateArt(uRequest) {
    console.log(uRequest)
    fetch('https://api.openai.com/v1/images/generations', {
        body: JSON.stringify({
            prompt: uRequest,
            model: "dall-e-3",
            n: 1,
            size: "1024x1024",
            response_format: "url",
            style: "vivid"
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }).then(response => response.json()).then(result => {
        let link = result.data[0].url
        let userArt = document.querySelector("img")
        userArt.setAttribute("src", link)
        let download = document.querySelector("a")
        download.setAttribute("href", link)

        animatedH2.style.display = "none"
        buttonCreateNew.style.display = "block"
        buttonDownload.style.display = "block"
    })
}

document.getElementById("generate").addEventListener("click", (event) => {
    event.preventDefault();
    let userRequest = createRequest(artStyle)
    generateArt(userRequest)
    form.style.display = "none"
    log.style.display = "block"
    animatedH2.style.display = "block"
    styleOnPage.textContent = `Chosen style: ${artStyle}`
    wrapper.insertBefore(styleOnPage, buttonCreateNew)
    styleOnPage.style.display = "block"
})

buttonCreateNew.addEventListener("click", () => { window.location.reload() })

