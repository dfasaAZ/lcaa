document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelector("#uploadButton audio").volume = 0.1;
    
    let uploadButton = document.querySelector("#uploadButton");
    let uploadButtonInput = document.querySelector("#uploadButton input");

    uploadButton.addEventListener("mouseover", ()=>{
        document.querySelector("#uploadButton audio").play();
    })
    uploadButtonInput.addEventListener('change', ()=>{
        sliderRightButton.click();
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

/**Для кнопки скрытия разделов II.Transitions */
    event.target.addEventListener("click", (e)=>{
        if (e.target.classList.contains("hidderBut") && e.target.parentNode.classList.contains("transitionsWindow")) {
            if (e.target.classList.contains("active")) {
                e.target.classList.remove("active");
                e.target.parentNode.lastElementChild.style.display="block";
            }else{
                e.target.classList.add("active");
                e.target.parentNode.lastElementChild.style.display="none";
            }
        }
    })

/**Для кнопки скрытия разделов III.Validation */
    event.target.addEventListener("click", (e)=>{
        if (e.target.classList.contains("hidderBut") && e.target.parentNode.classList.contains("validation")) {
            if (e.target.classList.contains("active")) {
                e.target.classList.remove("active");
                e.target.parentNode.lastElementChild.style.display="flex";
            }else{
                e.target.classList.add("active");
                e.target.parentNode.lastElementChild.style.display="none";
            }
        }
    })

/**Для кнопки скрытия разделов IV.Defuzzification */
event.target.addEventListener("click", (e)=>{
    if (e.target.classList.contains("hidderBut") && e.target.parentNode.classList.contains("defuzzification")) {
        if (e.target.classList.contains("active")) {
            e.target.classList.remove("active");
            e.target.parentNode.lastElementChild.style.display="flex";
        }else{
            e.target.classList.add("active");
            e.target.parentNode.lastElementChild.style.display="none";
        }
    }
})

})