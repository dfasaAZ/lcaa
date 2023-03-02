document.addEventListener("DOMContentLoaded", ()=>{
    let uploadButton = document.querySelector("#uploadButton");
    let file = document.querySelector("#uploadButton>input");
    let viewDataWindow = document.querySelector(".viewDataWindow");
    
    uploadButton.addEventListener("change", function(){
        try{
            let fR = new FileReader();
            let fileContent;
            fR.readAsText(file.files[0], "UTF-8");
            fR.onload = ()=>{
                viewDataWindow.innerHTML = fR.result;
            }
        }
        catch{}
    })
})