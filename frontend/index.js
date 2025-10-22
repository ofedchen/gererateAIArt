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
    document.getElementById("generate").removeAttribute("disabled")
}

const checkboxes = document.querySelectorAll("input[type='checkbox']")
for (const checkbox of checkboxes) {
    checkbox.addEventListener("input", checkedValue);
}

function checkedValue(e) {
    artStyle += e.target.value
    console.log(artStyle)
}

function createRequest(style) {
    let description = input.value
    let uRequest = "Create an image according to this request: " + description + " in style:" + style
    console.log(description)
    console.log(uRequest)
    return uRequest
}

function generateArt(uRequest) {
    fetch('/api/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: uRequest
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            let userArt = document.querySelector("img")
            userArt.setAttribute("src", result.imageUrl)
            let download = document.querySelector("a")
            download.setAttribute("href", result.imageUrl)

            animatedH2.style.display = "none"
            buttonCreateNew.style.display = "block"
            buttonDownload.style.display = "block"
        } else {
            console.error('Error:', result.error)
            alert('Error generating image: ' + result.error)
        }
    })
    .catch(error => {
        console.error('Error:', error)
        alert('Error generating image: ' + error.message)
    })
}

document.querySelector("form").addEventListener("submit", (event) => {
    let userRequest = createRequest(artStyle)
    generateArt(userRequest)
    form.style.display = "none"
    log.style.display = "block"
    animatedH2.style.display = "block"
    styleOnPage.textContent = `Chosen style: ${artStyle}`
    wrapper.insertBefore(styleOnPage, buttonCreateNew)
    styleOnPage.style.display = "block"
    artStyle = ""
    event.preventDefault();
})

buttonCreateNew.addEventListener("click", () => { window.location.reload() })

