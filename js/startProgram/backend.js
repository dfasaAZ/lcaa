import {CellularAutomaton} from './CellularAutomaton.mjs'

document.addEventListener("DOMContentLoaded", ()=>{
/**переменные--------------------------------------------*/
    let fR = new FileReader();
    let nameObjectWindow = document.querySelector('.nameObjectWindow');
    let object = new CellularAutomaton();
    let file = document.querySelector("#uploadButton>input");
    let viewDataWindow = document.querySelector(".viewDataWindow");
    let startButton = document.querySelector(".startButton");
    let slidesWindow = document.querySelector('.slides');
    let msgbox = document.querySelector('.msgbox');
    let msgboxExit = document.querySelector('.msgbox .exit');
    let programCalculateWindow = document.querySelector(".programCalculate");
    let sliderButtons = document.querySelector(`div[class^="sliderButton"]`);
    let programCalculateTitle = document.querySelector(`.titleWindow.main`);
    let ctx = document.getElementById('chartModel'); //Диаграмма 
    let transitions = document.querySelector('.transitions'); //Внутреннее окно Transitions
    let greenColorA = "rgb(0, 100, 0, 0.5)";
    let greenColor = "rgb(0, 100, 0)";
    let yellowColorA = "rgb(255, 215, 0, 0.5)";
    let yellowColor = "rgb(255, 215, 0)";
    let redColorA = "rgb(150, 0, 0, 0.5)";
    let redColor = "rgb(150, 0, 0)";
    let numbersArrForChart = []; //для графика значения
    let labelsArrForChart = [];  //для графика легенды
    let backgroundColorsArrForChart = [];  //для background-color столбцов
    let borderColorsArrForChart = [];  //для border-color столбцов
    // let minNumbersArrForChart; 
    // let maxNumbersArrForChart; 
    let minDotsArrForChartLine = [];
    let mediumDotsArrForChartLine = [];
    let maxDotsArrForChartLine = [];
    let minLine = [];
/**событие по нажатии кнопки upload--------------------------------------------*/
    file.addEventListener("change", function(){
        try{
            /** Здесь происходят все основные вычисления массивов */
            function getValues(object){
                /**
                *@param {Number} i Перменная для разграфки первого этапа
                */
                let i=0;
                let dataSorted = []; //Для 1 ЭТАПА
                let modificationArr = new Map(); //Для 2 ЭТАПА


                for (let i of object.sortedData){ // Инициализация dataSorted
                    dataSorted.push(i); 
                }
  


                /** 1 ЭТАП::: Цвето-Разграфка */
                dataSorted.forEach (e=>{
                    i++;
                    viewDataWindow.innerHTML += `${i}) ${String(e.date).substr(4,11)}::${e.value}<br>`; // запись в окно 2 шага
                    numbersArrForChart.push(Math.round(e.value)); 
                    labelsArrForChart.push(String(e.date).substr(4,11));
                    if (e.level == "Н"){
                        backgroundColorsArrForChart.push(redColorA);
                        borderColorsArrForChart.push(redColor);
                    }
                    else if (e.level == "С") {
                        backgroundColorsArrForChart.push(yellowColorA);
                        borderColorsArrForChart.push(yellowColor);
                    }
                    else {
                        backgroundColorsArrForChart.push(greenColorA);
                        borderColorsArrForChart.push(greenColor);
                    }
                })

                /** 2 ЭТАП::: Заполнение таблиц переходов */
                let configNumber = 1;
                for (let i of object.counts){
                    console.log(i);
                    let length;
                    let temporaryArr=[];
                    let lastChar="";
                    let currentCombination="";

                    transitions.insertAdjacentHTML('beforeend', `
                    <div class="transitionsLine">
                        <div class="section">
                            <div class="table">
                                <div class="head">
                                    <div>Depth</div>
                                    <div>Transition from</div>
                                    <div>Transition to</div>
                                    <div>Count of transition</div>
                                    <div>Total transitions</div>
                                </div>
                                <div class="row">
                                    <div class="confColumn"><div>${configNumber} config</div></div>
                                    <div class="contains">
                                    </div>
                                </div>   
                            </div>
                        </div>
                    </div>
                    `)

                        Object.entries(i).forEach(e=>{
                            if (e[0].length-1 == configNumber){
                                let string = Array.from(e[0]);
                                if (string.slice(0,string.length-1).join("")==lastChar){
                                    temporaryArr.push(e[0].substr(-1));
                                }else{
                                    // console.log(temporaryArr);
                                }
                                
                                document.querySelectorAll('.row .contains')[document.querySelectorAll('.row .contains').length-1].insertAdjacentHTML('beforeend',
                                `<div class="contain">
                                    <div class="transFrom">
                                        <div class="valFrom">${string.reverse().slice(1,string.length).reverse().join("")}</div>
                                    </div>
                                    <div class="transTo">
                                        <div class="low">${(e[0]).substr(-1)}</div>
                                        <div class="medium">${(e[0]).substr(-1)}</div>
                                        <div class="high">${(e[0]).substr(-1)}</div>
                                    </div>
                                    <div class="countTrans">
                                        <div class="low">1</div>
                                        <div class="medium">2</div>
                                        <div class="high">3</div>
                                    </div>
                                    <div class="totalTrans">43</div>
                                </div>
                                `);
                                
                                lastChar=string.slice(0,string.length-1).join("");
                                // lastChar1=string.reverse().slice(1,string.length).reverse().join("");
                            }else{
                                
                            }
                        })
                     


                    configNumber++;
                }




                /** Нахождение на кусочках (по 10 точек) мин, сред, макс. точек */
                // const chunkSize = 10; 
                // for (let i = 0; i < dataSorted.length-1; i+=chunkSize){
                //     let pieceArr = numbersArrForChart.slice(i,i + chunkSize);
                //     minDotsArrForChartLine.push({value:Math.min.apply(null, numbersArrForChart.slice(i,i + chunkSize)), position:pieceArr.indexOf(Math.min.apply(null, numbersArrForChart.slice(i,i + chunkSize)))+i});
                //     maxDotsArrForChartLine.push({value:Math.max.apply(null, numbersArrForChart.slice(i,i + chunkSize)), position:pieceArr.indexOf(Math.max.apply(null, numbersArrForChart.slice(i,i + chunkSize)))+i});
                // }
                
                // for (let p = minDotsArrForChartLine[0].value - minDotsArrForChartLine[0].position; p<=minDotsArrForChartLine[0].value; p++){
                //     minLine.push(p);
                // }

                // for (let i = 1; i < 6; i++){
                //     let val = 0;
                //     let t = minDotsArrForChartLine[i-1].value;
                //     for (let p = 0; p < minDotsArrForChartLine[i].position; p++){
                //         t+=(minDotsArrForChartLine[i].value - minDotsArrForChartLine[i-1].value)/minDotsArrForChartLine[i].position;
                //         minLine.push(t);
                //     }
                // }


                // maxNumbersArrForChart = Math.max.apply(null, numbersArrForChart);
                // minNumbersArrForChart = Math.min.apply(null, numbersArrForChart);
            }

            fR.onload = async (e) => {
                object.LoadData(e.target.result); 
                object.placeLevel();
                await object.countLevelCombinations();
                getValues(object);
            }
            fR.readAsText(file.files[0], "UTF-8");
        }
        catch{

        }
    })

/**событие по нажатии кнопки start--------------------------------------------*/
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
        labels: labelsArrForChart,
        datasets: [
            {
                label: [''],
                data: numbersArrForChart,
                backgroundColor: backgroundColorsArrForChart,
                borderColor: borderColorsArrForChart,
                borderWidth: 2,
                order:2
            },
            {
                type: 'line',
                label: 'HighLevel',
                data: minLine,
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
            y:{
                min:200,
                max:350
            },
        },
    }
};

new Chart (ctx,config);
    
})

