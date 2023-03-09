import {CellularAutomaton} from './CellularAutomaton.mjs'

document.addEventListener("DOMContentLoaded", ()=>{
    let file = document.querySelector("#uploadButton>input");
    let viewDataWindow = document.querySelector(".viewDataWindow");

    file.addEventListener("change", function(){
        try{
            let fR = new FileReader();

            function getValues(str){
                let i=0;
                str.forEach(e => {
                    i++;
                    viewDataWindow.innerHTML += `${i}) ${String(e.date).substr(4,11)}::${e.value}<br>`;
                });
            }

            fR.onload = (e) => {
                let obj = new CellularAutomaton();
                obj.LoadData(e.target.result);
                getValues(obj.data); 
            }
            fR.readAsText(file.files[0], "UTF-8");
        }
        catch{

        }
    })



    
})