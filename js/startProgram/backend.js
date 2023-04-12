import {CellularAutomaton} from './CellularAutomaton.mjs'

document.addEventListener("DOMContentLoaded", ()=>{
/**переменные--------------------------------------------*/
    let fR1 = new FileReader();
    let fR2 = new FileReader();
    let object1 = new CellularAutomaton();
    let object2 = new CellularAutomaton();
    let globalObjectCount=1;

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
    let selectedLevel = document.querySelector('#levels');
    let ctx2 = document.querySelectorAll('#chartModel')[1]; //Диаграмма 2

    let transitions = document.querySelectorAll('.transitions'); //Внутреннее окно Transitions
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
    let minLine = [];

    let termsLine = document.querySelectorAll('.validation .termsLine');
/**событие по нажатии кнопки upload--------------------------------------------*/
    file.addEventListener("change", function(){
        try{
            /** Здесь происходят все основные вычисления массивов */
            let curObjK=1; //если 0, то сигнал о втором объекте

            function getValues(curObj){

                    /** Очистка::: все таблицы */
                    if (document.querySelectorAll(".transitions .transitionsLine").length){ //Таблица Переходов
                        for (let i =0; i<document.querySelectorAll(".transitions .transitionsLine").length; i++){
                            document.querySelectorAll(".transitions .transitionsLine")[i].remove();
                        }
                    }

                    if (document.querySelectorAll(".termsLine .instance").length){ //Таблица Валидации
                        for (let i =0; i<document.querySelectorAll(".termsLine .instance").length; i++){
                            document.querySelectorAll(".termsLine .instance")[i].remove();
                        }
                    }

                    if (document.querySelectorAll(".termsLine .instance").length){ //Таблица Валидации
                        for (let i =0; i<document.querySelectorAll(".termsLine .instance").length; i++){
                            document.querySelectorAll(".termsLine .instance")[i].remove();
                        }
                    }

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
                            var chart1 = new Chart (ctx1,{

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
                                {label:"Высокий",
                                  type:'line',
                                  data:curObj.FootPoints['В'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: green[0],
                                  xAxisID:'x',
                                  
                                },{
                                  label:"Средний",
                                  type:'line',
                                  data:curObj.FootPoints['С'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: yellow[0],
                                  xAxisID:'x',
                                  
                                },
                                {
                                  label:"Низкий",
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
                        } else{
                            var chart2 = new Chart (ctx2,{

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
                                {label:"Высокий",
                                  type:'line',
                                  data:curObj.FootPoints['В'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: green[0],
                                  xAxisID:'x',
                                  
                                },{
                                  label:"Средний",
                                  type:'line',
                                  data:curObj.FootPoints['С'].sort((a,b)=>{return a.index-b.index}),
                                  borderColor: yellow[0],
                                  xAxisID:'x',
                                  
                                },
                                {
                                  label:"Низкий",
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
                        }

                        // ctx1.onclick = async (e) => {
                        //     const res = chart1.getElementsAtEventForMode(
                        //       e,
                        //       'nearest',
                        //       { intersect: true },
                        //       true
                        //     );
                        //     if (res.length == 0) return;
                        //     curObj.dataSorted[res[0].index].level = selectedLevel.value;
                        //     curObj.FootPoints[selectedLevel.value].push({x:chart1.curObj.dataSorted.labels[res[0].index],y:curObj.dataSorted[res[0].index].value,index:res[0].index});
                        //     console.log(curObj.FootPoints);
                        //     [curObj.dataSorted,curObj.FootPoints]=curObj.FootPointsLevels(curObj.dataSorted,curObj.FootPoints);
                        //     chart1.destroy();
                        //     curObj.dataSorted = await curObj.Recalculate(curObj.dataSorted);
                            
                        //     getValues(curObj.dataSorted,curObj.FootPoints);
                            
                        //   }


                    /** 2 ЭТАП::: Заполнение таблиц переходов */
                    let configNumber = 1;
                    for (let i of curObj.counts){
                        if (curObjK){
                            transitions[0].insertAdjacentHTML('beforeend', `
                            <div class="transitionsLine">
                                <div class="section">
                                    <div class="table">
                                        <div class="head">
                                            <div>Depth</div>
                                            <div>Transition from</div>
                                            <div>Transition to</div>
                                            <div>Count of transition</div>s
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
                        }else{
                            transitions[1].insertAdjacentHTML('beforeend', `
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
                        }


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
                        }else{
                            termsLine[1].insertAdjacentHTML('beforeend', `
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
                    }

                    /** 4 ЭТАП::: Дефазификация */
                        // console.log(curObj.predictionList);
                        // console.log(curObj.memoryDepth);
                        let movAvg = [];
                        for (let i=curObj.memoryDepth+1; i<dataSorted.length-curObj.memoryDepth; i++){
                            let sumArr=0;
                            for (let j=0; j<curObj.memoryDepth; j++){
                                sumArr+=Object.entries(dataSorted)[i+j][1].value;
                            }
                            movAvg.push(Math.round(sumArr/curObj.memoryDepth));
                        }
                        console.log(movAvg);

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
                getValues(object2);
            }

            if (file.files.length==1){
                fR1.readAsText(file.files[0], "UTF-8"); // Чтение первого объекта
                document.querySelector(".programCalculate").style.justifyContent = "center";
                document.querySelector(".programCalculate>div").style.width="100%";
            }else{
                globalObjectCount = 2;

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

