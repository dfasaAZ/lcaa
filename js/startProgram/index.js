document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelector("#uploadButton audio").volume = 0.1;
    
    let uploadButton = document.querySelector("#uploadButton");

    uploadButton.addEventListener("mouseover", ()=>{
        document.querySelector("#uploadButton audio").play();
    })

    let sliderLeftButton = document.querySelector(".sliderButton-left");
    let sliderRightButton = document.querySelector(".sliderButton-right");
    let currentFrame = document.querySelector(".slides");
    let slidesWindows = document.querySelectorAll(".slides>div");
    let sliderIndex = 0;

    sliderRightButton.addEventListener('click', ()=>{
        if (sliderIndex < slidesWindows.length - 1) sliderIndex++;
        currentFrame.style.right = `calc(100% * ${sliderIndex})`;
        sliderIndex== slidesWindows.length - 1 ? sliderRightButton.classList.add("active") : sliderRightButton.classList.remove("active");
        sliderIndex!=0 ? sliderLeftButton.classList.remove("active") : sliderLeftButton.classList.add("active");
    })

    sliderLeftButton.addEventListener('click', ()=>{
        if (sliderIndex > 0) sliderIndex--;
        currentFrame.style.right = `calc(100% * ${sliderIndex})`;
        sliderIndex==slidesWindows.length - 1 ? sliderRightButton.classList.add("active") : sliderRightButton.classList.remove("active");
        sliderIndex==0 ? sliderLeftButton.classList.add("active") : sliderLeftButton.classList.remove("active");
    })


})