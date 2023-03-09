import {CellularAutomaton} from './CellularAutomaton.mjs'

document.addEventListener("DOMContentLoaded", ()=>{
    let file = document.querySelector("#uploadButton>input");
    let viewDataWindow = document.querySelector(".viewDataWindow");

    file.addEventListener("change", function(){
        try{
            let fR = new FileReader();

            function getValues(str){
                for (let key of str){
                    // viewDataWindow.innerHTML += `${String(st)},<br>`;
                    console.log(key);
                }
            }

            fR.onload = (e) => {
                let obj = new CellularAutomaton();
                obj.LoadData(e.target.result);
                getValues(obj.rawData); 
            }
            fR.readAsText(file.files[0], "UTF-8");
        }
        catch{

        }
    })



    
})