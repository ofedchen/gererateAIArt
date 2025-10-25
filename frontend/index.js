let artStyle = []
const input = document.querySelector("textarea");
const log = document.getElementById("promptText");
const styleOnPage = document.createElement("h4");
const wrapper = document.querySelector(".wrapper");
const form = document.querySelector("form");
const buttonDownload = document.getElementById("download");
const buttonCreateNew = document.getElementById("create-new");
const buttonTryAgain = document.getElementById("try-again");
const animatedH2 = document.getElementById("gen-animation");
const errorMessage = document.getElementById("error");

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
    if (e.target.checked) {
        if (!artStyle.includes(e.target.value)) {
            artStyle.push(e.target.value);
        }
    } else {
        artStyle = artStyle.filter(style => style !== e.target.value);
    }
    console.log(artStyle);
}

function createRequest(style) {
    let description = input.value;
    let uRequest = "Create an image according to this request: " + description + " in style: " + style;
    console.log(description);
    console.log(uRequest);
    return uRequest;
}

function generateArt(uRequest, style) {
    fetch("/api/generate-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: uRequest
        })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                let userArt = document.querySelector("img");
                userArt.setAttribute("src", result.imageUrl);
                let download = document.querySelector("#download-link");
                download.setAttribute("href", result.imageUrl);
                sendArtToDb(input.value, style, result.imageUrl);

                animatedH2.style.display = "none";
                buttonCreateNew.style.display = "block";
                buttonDownload.style.display = "block";
            } else {
                console.error("Error:", result.error);
                errorMessage.style.display = "block";
                buttonTryAgain.style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error generating image: " + error.message);
        });
}

function sendArtToDb(description, style, imageUrl) {
    fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description, style, imageUrl
        })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log("Art saved to database!");
            } else {
                console.error("Failed to save:", result.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error saving art: " + error.message);
        });
}

document.querySelector("form").addEventListener("submit", (event) => {
    let styleString = artStyle.join(", ");
    let userRequest = createRequest(styleString);
    generateArt(userRequest, styleString);

    form.style.display = "none";
    log.style.display = "block";
    animatedH2.style.display = "block";
    styleOnPage.textContent = `Chosen style: ${styleString}`;
    wrapper.insertBefore(styleOnPage, buttonCreateNew);
    styleOnPage.style.display = "block";

    artStyle = [];
    event.preventDefault();
});

buttonCreateNew.addEventListener("click", () => { window.location.reload() })

