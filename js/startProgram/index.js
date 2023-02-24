document.addEventListener("DOMContentLoaded", ()=>{
    let uploadButton = document.querySelector("#uploadButton");

    uploadButton.addEventListener("mouseover", ()=>{
        document.querySelector("#uploadButton audio").play();
    })
})