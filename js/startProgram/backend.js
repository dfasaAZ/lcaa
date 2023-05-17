import {CellularAutomaton} from './CellularAutomaton.mjs'

document.addEventListener("DOMContentLoaded", ()=>{
/**переменные--------------------------------------------*/
    let fR1 = new FileReader();
    let fR2 = new FileReader();
    let object1 = new CellularAutomaton();
    let object2 = new CellularAutomaton();

    let file = document.querySelector("#uploadButton>input");

    let nameObjectWindow1 = document.querySelector('.nameObjectWindow.first');
    let nameObjectWindow2 = document.querySelector('.nameObjectWindow.second');

    let viewDataWindowAll = document.querySelectorAll(".viewDataWindow");
    let viewDataWindow1 = document.querySelector(".viewDataWindow.first");
    let viewDataWindow2 = document.querySelector(".viewDataWindow.second");

    let startButton = document.querySelector(".startButton");
    let slidesWindow = document.querySelector('.slides');
    let msgbox = document.querySelector('.msgbox');
    let msgboxExit = document.querySelector('.msgbox .exit');
    let programCalculateWindow = document.querySelector(".programCalculate");
    let sliderButtons = document.querySelector(`div[class^="sliderButton"]`);
    let programCalculateTitle = document.querySelectorAll(`.titleWindow.main`);

    let ctx1 = document.querySelectorAll('#chartModel')[0]; //Диаграмма 1
    let chart1 = null;
    var defuzCh1 = null;
    let globalDataCtx1 = 0;

    let selectedLevel = document.querySelectorAll('#levels');

    let ctx2 = document.querySelectorAll('#chartModel')[1]; //Диаграмма 2
    let globalDataCtx2 = 0;
    var defuzCh2 = null;
    let chart2 = null;

    let defuzChart1 = document.querySelectorAll('#defuzModel')[0]; //Дефазификация диаграмма 1
    let defuzChart2 = document.querySelectorAll('#defuzModel')[1]; //Дефазификация диаграмма 1

    let transitions = document.querySelectorAll('.transitions'); //Внутреннее окно Transitions

    let termsLine = document.querySelectorAll('.validation .termsLine');

// Функция очистки таблиц
function clearTable(numObj){
  
    Array.from(document.querySelectorAll('.transitionsWindow .transitions')[numObj].children).map(e=>{
        e.remove();
    })
    
    Array.from(document.querySelectorAll(".terms .termsLine")[numObj].children).map(e=>{
        e.remove();
    })

}

/**событие по нажатии кнопки upload--------------------------------------------*/
    file.addEventListener("change", function(){
        try{
            /** Здесь происходят все основные вычисления массивов */

            //Обрабатываем клик по столбцу на графиках
        ctx1.onclick = async (e) => {
            let data = globalDataCtx1.sortedData;
            let foot = globalDataCtx1.FootPoints;
            const res = chart1.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            true
            );
            if (res.length == 0) return;
            data[res[0].index].level = selectedLevel[0].value;
            foot[selectedLevel[0].value].push({x:chart1.data.labels[res[0].index],y:data[res[0].index].value,index:res[0].index});
            [data,foot]=globalDataCtx1.FootPointsLevels(data,foot);
            await globalDataCtx1.Recalculate(data);

            chart1.destroy();
            defuzCh1.destroy();
            curObjK = 1;
            getValues(globalDataCtx1);
        }

        ctx2.onclick = async (e) => {
            let data = globalDataCtx2.sortedData;
            let foot = globalDataCtx2.FootPoints;
            const res = chart2.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            true
            );
            if (res.length == 0) return;
            data[res[0].index].level = selectedLevel[1].value;
            foot[selectedLevel[1].value].push({x:chart2.data.labels[res[0].index],y:data[res[0].index].value,index:res[0].index});
            [data,foot]=globalDataCtx2.FootPointsLevels(data,foot);
            chart2.destroy();
            defuzCh2.destroy();
            await globalDataCtx2.Recalculate(data);
            
            chart2.destroy();
            defuzCh2.destroy();
            curObjK = 0;
            getValues(globalDataCtx2);
        }

            let curObjK=1; //если 0, то сигнал о втором объекте
            function getValues(curObj){

                    /** Очистка::: все таблицы */
                    if (curObjK) {
                        clearTable(0);
                    } else {clearTable(1)};

                    /** *@param {Number} i Перменная для разграфки первого этапа*/
                    let i=0;
                    let dataSorted = []; //Для 1 ЭТАПА
                    for (let i of curObj.sortedData){ // Инициализация dataSorted
                        dataSorted.push(i); 
                    }

                    /** Заполнение STEP2 */
                    dataSorted.forEach(e=>{
                        i++;

                        if (curObjK){///Определение итерируемого объекта для заполнения 2 этапа
                            viewDataWindow1.innerHTML += `${i}) ${String(e.date).substr(4,11)}::${e.value}<br>`; // запись в окно 2 шага
                        }else{
                            viewDataWindow2.innerHTML += `${i}) ${String(e.date).substr(4,11)}::${e.value}<br>`; // запись в окно 2 шага
                        }
                    })

                    /** 1 ЭТАП::: Цвето-Разграфка */
                    //Задаём цвета
                        const red = ["rgb(150,0,0)", "rgb(150,0,0,0.5)"];
                        const yellow = ["rgb(255,215,0)", "rgb(255,215,0,0.5)"];
                        const green = ["rgb(0,100,0)", "rgb(0,100,0,0.5)"];
                        const colors = [red, yellow, green];
                        /**Добвляем цвета к элементам*/
                        var graphData = curObj.sortedData.map((element) => {
                        let color;
                        let bcolor;
                        if (element.level == 'Н') { color = colors[0][0]; bcolor = colors[0][1]; } else
                            if (element.level == 'С') { color = colors[1][0]; bcolor = colors[1][1]; } else
                            if (element.level == 'В') { color = colors[2][0]; bcolor = colors[2][1]; }
                            return {
                                ...element,
                                "color": color,
                                "bcolor": bcolor
                            }
                        })
                        
                        let labels = [];
                        let values = [];
                        let bColors = [];
                        let Colors = [];
                        //Заполняем данные для графика
                        Object.values(graphData).forEach(element => {
                            const date = element["date"].getDate() + "/" + element["date"].getMonth() + "/" + element["date"].getFullYear()
                            labels.push(date);
                            const value = element["value"];
                            values.push(value);
                            const color = element["color"];
                            Colors.push(color);
                            const bcolor = element["bcolor"];
                            bColors.push(bcolor);
                        });

                        //Построение графиков
                        if (curObjK) {
                            globalDataCtx1 = curObj; //Присвоение объекта в глобальную переменную

                            chart1 = new Chart (ctx1,{

                                type: 'bar',
                          
                                data: {
                          
                                 labels: labels,
                          
                                  datasets: [{
                                    type:"bar",
                                    label:"Values ",
                                    showLegend:false,
                          
                                    data: values,
                          
                                    backgroundColor: bColors,
                          
                                    borderColor: Colors,
                          
                                    borderWidth: 1,
                                    
                                  },
                                {label:"High",
                                  type:'line',
                                  data:curObj.FootPoints['В'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: green[0],
                                  xAxisID:'x',
                                  
                                },{
                                  label:"Medium",
                                  type:'line',
                                  data:curObj.FootPoints['С'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: yellow[0],
                                  xAxisID:'x',
                                  
                                },
                                {
                                  label:"Low",
                                  type:'line',
                                  data:curObj.FootPoints['Н'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: red[0],
                                  xAxisID:'x',
                                  
                                },]
                          
                                },
                          
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                        min:Math.min(...values)-(Math.max(...values)-Math.min(...values))*0.2,
                                        
                                        display:true,
                                        },
                                        
                                        x:{beginAtZero: true,min:0,max:values.length,},
                                        
                                    }
                          
                                }
                          
                              });
                                document.querySelectorAll(".predicateError .percent")[0].innerHTML = `  ${Math.round(curObj.ForecastError*100)/100}%`;
                        } else{
                            globalDataCtx2 = curObj;
                            chart2 = new Chart (ctx2,{
                                type: 'bar',
                                data: {
                                 labels: labels,
                                  datasets: [{
                                    type:"bar",
                                    label:"Значение ",
                                    showLegend:false,
                                    data: values,
                                    backgroundColor: bColors,
                                    borderColor: Colors,
                                    borderWidth: 1,
                                  },
                                {label:"High",
                                  type:'line',
                                  data:curObj.FootPoints['В'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: green[0],
                                  xAxisID:'x',
                                  
                                },{
                                  label:"Medium",
                                  type:'line',
                                  data:curObj.FootPoints['С'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: yellow[0],
                                  xAxisID:'x',
                                  
                                },
                                {
                                  label:"Low",
                                  type:'line',
                                  data:curObj.FootPoints['Н'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: red[0],
                                  xAxisID:'x',
                                  
                                },]
                          
                                },
                          
                                options: {
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      min:Math.min(...values)-(Math.max(...values)-Math.min(...values))*0.2,   
                                      display:true,
                                    },
                                    x:{beginAtZero: true,min:0,max:values.length,},  
                                  }
                          
                                }
                          
                            });
                            document.querySelectorAll(".predicateError .percent")[1].innerHTML = `  ${Math.round(curObj.ForecastError*100)/100}%`;
                        }

                        

                    /** 2 ЭТАП::: Заполнение таблиц переходов */
                    let configNumber = 1;
                    for (let i of curObj.counts){
                        if (curObjK){
                            transitions[0].insertAdjacentHTML('beforeend', `
                            <div class="transitionsLine first_obj">
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

                                document.querySelectorAll('.transitionsLine.first_obj .table .row .contains')[document.querySelectorAll('.transitionsLine.first_obj .table .row').length-1].insertAdjacentHTML('beforeend', 
                                `
                                        <div class="contain">
                                            <div class="transFrom"><p>${Object.entries(i)[t][0].slice(0,Object.entries(i)[t][0].length-1)}</p></div>
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
                        }else{
                            transitions[1].insertAdjacentHTML('beforeend', `
                            <div class="transitionsLine second_obj">
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
                                document.querySelectorAll('.transitionsLine.second_obj .table .row .contains')[document.querySelectorAll('.transitionsLine.second_obj .table .row').length-1].insertAdjacentHTML('beforeend', 
                                `
                                        <div class="contain">
                                            <div class="transFrom"><p>${Object.entries(i)[t][0].slice(0,Object.entries(i)[t][0].length-1)}</p></div>
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
                        }
                    
                        configNumber++;
                    }


                    /** 3 ЭТАП::: Заполнение таблиц валидации */
                    for (let i of curObj.validationTables){
                        let lowArr = [];
                        let middleArr = [];
                        let highArr = [];
                        [lowArr,middleArr,highArr] = Object.entries(i)[2][1].entries(); //деструктуризация мэпа уровней
                        let lowArrP = [];
                        let middleArrP = [];
                        let highArrP = [];
                        [lowArrP,middleArrP,highArrP] = Object.entries(i)[4][1].entries(); //деструктуризация мэпа вероятностей

                        if (curObjK) {
                            termsLine[0].insertAdjacentHTML('beforeend', `
                            <div class="instance first_obj">
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
                                    <div class="config"><p>${Object.entries(i)[1][1]}</p></div>
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
                                    <div class="eps">${Math.round(Object.entries(i)[3][1]*100)/100}</div>
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
                                document.querySelectorAll('.instance.first_obj .term')[document.querySelectorAll('.instance.first_obj .term').length-1].classList.add('true');
                            }else{
                                document.querySelectorAll('.instance.first_obj .term')[document.querySelectorAll('.instance.first_obj .term').length-1].classList.add('false');
                            }
                        }else{
                            termsLine[1].insertAdjacentHTML('beforeend', `
                            <div class="instance second_obj">
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
                                    <div class="config"><p>${Object.entries(i)[1][1]}</p></div>
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
                                    <div class="eps">${Math.round(Object.entries(i)[3][1]*100)/100}</div>
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
                                document.querySelectorAll('.instance.second_obj .term')[document.querySelectorAll('.instance.second_obj .term').length-1].classList.add('true');
                            }else{
                                document.querySelectorAll('.instance.second_obj .term')[document.querySelectorAll('.instance.second_obj .term').length-1].classList.add('false');
                            }
                        }
                    }

                    /** 4 ЭТАП::: Дефазификация */
                        let movAvg = []; //скользящая средняя
                        let initialValues = []; //начальные значения
                        let indexes_X=[]; //индексы для оси Х
                        let defuzPoints = []; //точки прогноза

                        dataSorted.map((e,index)=>{ //наполнение оси х индексами и отбор начальных значений
                            initialValues.push(e.value);
                            indexes_X.push(index);
                        })

                        
                        for (let i=0; i<dataSorted.length-curObj.memoryDepth; i++){ //формирование data для графика вида [x,y] скользящей
                            let sumArr=0;
                            for (let j=0; j<curObj.memoryDepth; j++){
                                sumArr+=Object.entries(dataSorted)[i+j][1].value;
                            }
                            movAvg.push([i+curObj.memoryDepth,sumArr/curObj.memoryDepth]);
                        }

                        curObj.predictionList.reverse().map((e,index)=>{ //формирование data для графика вида [x,y] прогнозирования
                            defuzPoints.push([index+curObj.memoryDepth,e]);
                        })


                        if (curObjK){
                            defuzCh1 = new Chart (defuzChart1,{

                                type: 'bar',
                          
                                data: {
                          
                                 labels: indexes_X,
                          
                                  datasets: [
                                    {label:"Sliding average",
                                    type:'line',
                                    data:movAvg,
                                    borderColor: green[0],
                                    xAxisID:'x',
                                    },
                                    {label:"Defuzzification",
                                    type:'line',
                                    data:defuzPoints,
                                    borderColor: yellow[0],
                                    xAxisID:'x',
                                    },
                                    {label:"Initial values",
                                    type: 'line',
                                    data:initialValues,
                                    borderColor: red[0],
                                    xAxisID:'x',
                                    }
                                ]
                                },
                                options: {
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      min:Math.min(...values)-(Math.max(...values)-Math.min(...values))*0.2,   
                                      display:true,
                                    },
                                    x:{type:'linear',beginAtZero: true,min:0,max:indexes_X.length+5},  
                                  }
                          
                                }
                          
                            });
                        }else{
                            defuzCh2 = new Chart (defuzChart2,{

                                type: 'bar',
                          
                                data: {
                          
                                 labels: indexes_X,
                          
                                  datasets: [
                                    {label:"Sliding average",
                                    type:'line',
                                    data:movAvg,
                                    borderColor: green[0],
                                    xAxisID:'x',
                                    },
                                    {label:"Defuzzification",
                                    type:'line',
                                    data:defuzPoints,
                                    borderColor: yellow[0],
                                    xAxisID:'x',
                                    },
                                    {label:"Initial values",
                                    type:'line',
                                    data:initialValues,
                                    borderColor: red[0],
                                    xAxisID:'x',
                                    }
                                ]
                                },
                                options: {
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      min:Math.min(...values)-(Math.max(...values)-Math.min(...values))*0.2,   
                                      display:true,
                                    },
                                    x:{type:'linear',beginAtZero: true,min:0,max:indexes_X.length+5},  
                                  }
                          
                                }
                          
                            });
                        }

                    curObjK=0;
                        
            }

            fR1.onload = async (e) => { // Обработка первого объекта
                    object1.LoadData(e.target.result); 
                    object1.placeLevel();
                    await object1.countLevelCombinations();
                    object1.Validation();
                    object1.defuzzyfication();
                    getValues(object1);
            }

            fR2.onload = async (e) => { // Обработка второго объекта
                object2.LoadData(e.target.result); 
                object2.placeLevel();
                await object2.countLevelCombinations();
                object2.Validation();
                object2.defuzzyfication();
                getValues(object2);
            }

            if (file.files.length==1){
                fR1.readAsText(file.files[0], "UTF-8"); // Чтение первого объекта
                document.querySelector(".programCalculate").style.justifyContent = "center";
                document.querySelector(".programCalculate>div").style.width="100%";
            }else{
                // Добавление окна STEP 2
                viewDataWindow2.style.display="flex";
                for (let i=0; i<viewDataWindowAll.length;i++){
                    viewDataWindowAll[i].classList.add("active");
                }

                // Добавление окна STEP 3
                nameObjectWindow2.style.display="block";

                fR1.readAsText(file.files[0], "UTF-8"); // Чтение первого объекта
                fR2.readAsText(file.files[1], "UTF-8"); // Чтение второго объекта

                // Добавление колонки в Calculate
                document.querySelector(".programCalculate>div:nth-child(2)").style.display="flex";
            }

        }
        catch{

        }
    })

/**событие по нажатии кнопки start--------------------------------------------*/
startButton.addEventListener('click', () => {
    if (file.files.length==1){
        if ( typeof (file.files[0]) === "undefined" || nameObjectWindow1.value==""){
            msgbox.classList.add('active');
        }else{
            slidesWindow.style.display="none";
            sliderButtons.style.display="none";
            programCalculateTitle[0].innerHTML = String(nameObjectWindow1.value);
            programCalculateWindow.style.display="flex";
        }
    }else{
        if ( typeof (file.files[0]) === "undefined" || nameObjectWindow1.value=="" || nameObjectWindow2.value==""){
            msgbox.classList.add('active');
        }else{
            slidesWindow.style.display="none";
            sliderButtons.style.display="none";
            programCalculateTitle[0].innerHTML = String(nameObjectWindow1.value);
            programCalculateTitle[1].innerHTML = String(nameObjectWindow2.value);
            programCalculateWindow.style.display="flex";
        }
    }
})

msgboxExit.addEventListener('click', ()=>{
    msgbox.classList.remove('active');
})


})

