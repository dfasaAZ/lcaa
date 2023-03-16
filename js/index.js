document.addEventListener("DOMContentLoaded",()=>{
    setTimeout(()=>{
        document.querySelector(".main_text.p1").style.animation = "none";
        document.querySelector(".main_text.p1").style.border = "none";
        document.querySelector(".main_text.p2").style.display = "flex";
    },4000)
})