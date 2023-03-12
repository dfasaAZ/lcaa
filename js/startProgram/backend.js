import {CellularAutomaton} from './CellularAutomaton.mjs'

document.addEventListener("DOMContentLoaded", ()=>{
/**переменные--------------------------------------------*/
    let fR = new FileReader();
    let nameObjectWindow = document.querySelector('.nameObjectWindow');
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
    let ctx = document.getElementById('chartModel');
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
    let minNumbersArr;
    let maxNumbersArr;
/**событие по нажатии кнопки upload--------------------------------------------*/
    file.addEventListener("change", function(){
        try{
            /** Здесь происходят все основные вычисления массивов */
            function getValues(str){
                let i=0;
                str.forEach(e => {
                    i++;
                    viewDataWindow.innerHTML += `${i}) ${String(e.date).substr(4,11)}::${e.value}<br>`; // запись в окно 2 шага
                    numbersArrForChart.push(Math.round(e.value)); 
                    labelsArrForChart.push(String(e.date).substr(4,11));
                });

                maxNumbersArr = Math.max.apply(null, numbersArrForChart);
                minNumbersArr = Math.min.apply(null, numbersArrForChart);

                numbersArrForChart.forEach (e=>{
                    if (e < minNumbersArr + (maxNumbersArr-minNumbersArr)/3){
                        backgroundColorsArrForChart.push(redColorA);
                        borderColorsArrForChart.push(redColor);
                    }
                    else if ( e >= minNumbersArr + (maxNumbersArr-minNumbersArr) / 3 && e < minNumbersArr + (maxNumbersArr-minNumbersArr) * 2 / 3) {
                        backgroundColorsArrForChart.push(yellowColorA);
                        borderColorsArrForChart.push(yellowColor);
                    }
                    else {
                        backgroundColorsArrForChart.push(greenColorA);
                        borderColorsArrForChart.push(greenColor);
                    }
                })
            }

            fR.onload = (e) => {
                obj.LoadData(e.target.result);
                getValues(obj.data); 
                obj.placeLevel();
                console.log(obj.sortedData);
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
                label: 'Line',
                data: [],
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

