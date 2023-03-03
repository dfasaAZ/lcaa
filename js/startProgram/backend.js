document.addEventListener("DOMContentLoaded", ()=>{
    let file = document.querySelector("#uploadButton>input");
    let viewDataWindow = document.querySelector(".viewDataWindow");
    let fileContent = [];

    file.addEventListener("change", function(){
        try{
            let fR = new FileReader();

            function getValues(str){
                str.split(',').map(e=>{
                    fileContent.push(Number(e));
                    viewDataWindow.innerHTML += `${Number(e)},<br>`;
                })
            }

            fR.onload = (e)=> {
                getValues(e.target.result); 
            }
            fR.readAsText(file.files[0], "UTF-8");
        }
        catch{

        }
    })



    
})