import { CellularAutomaton } from "./CellularAutomaton.mjs";

document.addEventListener("DOMContentLoaded", ()=>{
    let file = document.querySelector("#uploadButton>input");
    let viewDataWindow = document.querySelector(".viewDataWindow");

    file.addEventListener("change", function(){
        try{
            let fR = new FileReader();

            function getValues(str){
                console.log(JSON.parse(JSON.stringify(str)));
                str.split(',').map(e=>{
                    viewDataWindow.innerHTML += `${Number(e)},<br>`;
                })
            }

            fR.onload = (e)=> {
                getValues(e.target.result);
                let obj = new CellularAutomaton();
                obj.LoadData(String(e.target.value));
                console.log(obj.rawData);
            }
            fR.readAsText(file.files[0], "UTF-8");
        }
        catch{

        }
    })
})