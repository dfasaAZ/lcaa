import {CellularAutomaton} from './CellularAutomaton.mjs'


document.addEventListener("DOMContentLoaded", ()=>{
//переменные--------------------------------------------
    let fR = new FileReader();
    let nameObjectWindow = document.querySelector('.nameObjectWindow');
    let ctx = document.getElementById('chartModel');
    let obj = new CellularAutomaton();
    let file = document.querySelector("#uploadButton>input");
    let viewDataWindow = document.querySelector(".viewDataWindow");
    let startButton = document.querySelector(".startButton");
    let slidesWindow = document.querySelector('.slides');
    let msgbox = document.querySelector('.msgbox');
    let msgboxExit = document.querySelector('.msgbox .exit');
    let programCalculateWindow = document.querySelector(".programCalculate");
    let sliderButtons = document.querySelector(`div[class^="sliderButton"]`);
    let programCalculateTitle = document.querySelector(`.titleWindow.main`);
//событие по нажатии кнопки upload--------------------------------------------
    file.addEventListener("change", function(){
        try{
            function getValues(str){
                let i=0;
                str.forEach(e => {
                    i++;
                    viewDataWindow.innerHTML += `${i}) ${String(e.date).substr(4,11)}::${e.value}<br>`;
                    console.log(Math.round(e.value));
                });
            }

            fR.onload = (e) => {
                obj.LoadData(e.target.result);
                getValues(obj.data); 
            }
            fR.readAsText(file.files[0], "UTF-8");
        }
        catch{

        }
    })

//событие по нажатии кнопки start--------------------------------------------
startButton.addEventListener('click', () => {
    if ( typeof (file.files[0]) === "undefined" || nameObjectWindow.value==""){
        msgbox.classList.add('active');
    }else{
        slidesWindow.style.display="none";
        sliderButtons.style.display="none";
        programCalculateTitle.innerHTML = String(nameObjectWindow.value);
        programCalculateWindow.style.display="flex";
    }
})

msgboxExit.addEventListener('click', ()=>{
    msgbox.classList.remove('active');
})

//конфигурации графика--------------------------------------------
    var config = {
        type: 'bar',
        data: {
            labels: ["default"],
            datasets: [
                highArr={
                    label: ['Delenya'],
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: ['rgb(207, 0, 0, 0.5)','rgb(54, 162, 235)','rgb(154, 162, 235)'],
                    borderColor: 'red',
                    borderWidth: 2,
                    order:2
                },
                {
                    type: 'line',
                    label: 'Line',
                    data: [1,2,3],
                    fill: false,
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 2,
                    order:1
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                }],
            },
        }
    };

    new Chart (ctx,config);

    
})