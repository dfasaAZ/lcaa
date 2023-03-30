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

    let termsLine = document.querySelector('.validation .termsLine');
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
                                    <div class="contains"></div>
                                </div>   
                            </div>
                        </div>
                    </div>
                    `)


                    let t = 0;
                    let totalTrans = 0;
                    for (t = 0; t<Object.entries(i).length; t+=3){
                        totalTrans = Object.entries(i)[t][1]+Object.entries(i)[t+1][1]+Object.entries(i)[t+2][1];
                        document.querySelectorAll('.transitionsLine .table .row .contains')[document.querySelectorAll('.transitionsLine .table .row').length-1].insertAdjacentHTML('beforeend', 
                        `
                                <div class="contain">
                                    <div class="transFrom">${Object.entries(i)[t][0].slice(0,Object.entries(i)[t][0].length-1)}</div>
                                    <div class="transTo">
                                        <div>${Object.entries(i)[t][0].slice(-1)}</div>
                                        <div>${Object.entries(i)[t+1][0].slice(-1)}</div>
                                        <div>${Object.entries(i)[t+2][0].slice(-1)}</div>
                                    </div>
                                    <div class="countTrans">
                                        <div>${Object.entries(i)[t][1]}</div>
                                        <div>${Object.entries(i)[t+1][1]}</div>
                                        <div>${Object.entries(i)[t+2][1]}</div>
                                    </div>
                                    <div class="totalTrans">${totalTrans}</div>
                                </div>
                        `)

                        totalTrans = 0;
                    }


                    configNumber++;
                }


                /** 3 ЭТАП::: Заполнение таблиц валидации */
                for (let i of object.validationTables){
                    let lowArr = [];
                    let middleArr = [];
                    let highArr = [];
                    [lowArr,middleArr,highArr] = Object.entries(i)[2][1].entries(); //деструктуризация мэпа уровней
                    let lowArrP = [];
                    let middleArrP = [];
                    let highArrP = [];
                    [lowArrP,middleArrP,highArrP] = Object.entries(i)[4][1].entries(); //деструктуризация мэпа вероятностей

                    termsLine.insertAdjacentHTML('beforeend', `
                    <div class="instance">
                        <div class="header">
                            <div class="num">№ point</div>
                            <div class="num">Configuration</div>
                            <div class="num">Transitions</div>
                            <div class="num">γ</div>
                            <div class="num">Σ</div>
                            <div class="num">P</div>
                            <div class="num">Term</div>
                        </div>
                        <div class="contain">
                            <div class="numberLine">${Object.entries(i)[0][1]}</div>
                            <div class="config">${Object.entries(i)[1][1]}</div>
                            <div class="transitions">
                                <div class="div">${lowArr[0]}</div>
                                <div class="div">${middleArr[0]}</div>
                                <div class="div">${highArr[0]}</div>
                            </div>
                            <div class="gamma">
                                <div class="div">${Math.round(lowArr[1]*100)/100}</div>
                                <div class="div">${Math.round(middleArr[1]*100)/100}</div>
                                <div class="div">${Math.round(highArr[1]*100)/100}</div>
                            </div>
                            <div class="eps">${Object.entries(i)[3][1]}</div>
                            <div class="propability">
                                <div class="div">${Math.round(lowArrP[1]*100)/100}</div>
                                <div class="div">${Math.round(middleArrP[1]*100)/100}</div>
                                <div class="div">${Math.round(highArrP[1]*100)/100}</div>
                            </div>
                            <div class="term">${Object.entries(i)[5][1]}</div>
                        </div>
                    </div>
                    `)

                    if(Object.entries(i)[6][1]===true){
                        document.querySelectorAll('.instance .term')[document.querySelectorAll('.instance .term').length-1].classList.add('true');
                    }else{
                        document.querySelectorAll('.instance .term')[document.querySelectorAll('.instance .term').length-1].classList.add('false');
                    }
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
                object.Validation();
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

