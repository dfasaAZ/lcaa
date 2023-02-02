document.addEventListener("DOMContentLoaded",()=>{
    document.querySelector(".header_button").addEventListener("mouseover",()=>{
        document.querySelector(".header_button").classList.add("active");
        document.querySelector(".header_button div").classList.add("active");
    })

    document.querySelector(".header_button").addEventListener("mouseout",()=>{
        document.querySelector(".header_button").classList.remove("active");
        document.querySelector(".header_button div").classList.remove("active");
    })
})