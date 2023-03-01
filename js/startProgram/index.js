document.addEventListener("DOMContentLoaded", ()=>{
    let uploadButton = document.querySelector("#uploadButton");

    uploadButton.addEventListener("mouseover", ()=>{
        document.querySelector("#uploadButton audio").play();
    })

    let sliderLeftButton = document.querySelector(".sliderButton-left");
    let sliderRightButton = document.querySelector(".sliderButton-right");
    let currentFrame = document.querySelector(".slides>div");
    sliderRightButton.addEventListener('click', ()=>{
        currentFrame.style.marginLeft += "calc(100% * 2 / 3)";
    })


})