export class CellularAutomaton {
  /**Неотформатированные данные, ключи - наименование стобца, значения - список значений столбца */
  rawData = null;
   /**Глубина памяти */
   memoryDepth=0;
  data = [];
  /**Отсортированные данные с расставленными уровнями */
  sortedData = [];
  /**Объект, хранящий таблицу переходов */
  counts=[];
  /**Строка всех последовательных уровней*/
  sequence="";
  /**Таблицы этапа валидации */
  validationTables=[];
  /**Ошибка прогноза */
  ForecastError=0;
  /**Опорные точки */
  FootPoints={'Н':[],'С':[],'В':[]};
  /**Список прогнозных значений */
  predictionList=[];
  /**Курсоры, указывающие на границы коридоров
   * 
   * Все элементы в отсортированном массиве с индексом меньше либо равном position должны иметь аттрибут с соответствующим именем 
   * 
   * TODO: процедурно генерировать курсоры на случай если точек будет не 60 и\или коридоров будет больше*/
  cursors = [
    { 'name': 'Н', 'position': 0 },
    { 'name': 'С', 'position': 1 },
    { 'name': 'В', 'position': 2 }

  ];
  /**Достать данные в чистом виде из csv строки 
   * 
   * Возвращает список map'ов со всеми столбцами
   * 
   * @param {string} csvString Строка в формате csv
  */
  extractData(csvString) {
    const results = [];
    csvString=csvString.replace(/\r\n/g, "\n");
    const rows = csvString.split("\n"); // Split string into rows
    const headers = rows.shift().split(","); // Remove first row and use it as headers
    
    const result = rows.map(row => {
      const values = row.split(",");
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
    
    return result;
  }
  /**
       * Достать столбцы с датой и значениями и подготовить к использованию
       * 
       * @param {string}csvString: "строка в формате csv"
       */
  async LoadData(csvString) {

    this.rawData = this.extractData(csvString);
    this.data = this.rawData.map((data) => {
      var dateString = data['<DATE>'];
      if (dateString) {
        if (dateString.includes('.')) {
          const [day, month, year] = dateString.split('.');
          dateString = new Date(`${year}-${month}-${day}`);
        } else {
          dateString = new Date(dateString);
        }
      }
      return {
        'date': dateString,
        'value': parseFloat(data['<CLOSE>'])
      };
    });
    
    this.sortByValue();
    this.getSequence();
  }
  /**
   * Сортирует по значению, и помещает в отдельную переменную
   */
  sortByValue() {
    this.sortedData.sort((a, b) => {
      return a.value - b.value;
    });
  }
   /**
   * Сортирует список с уровнями по дате
   */
   sortByDate() {
    return this.sortedData.sort((a, b) => {
      return a.date - b.date;
    });
  }
  /**
   * Определить границы курсоров в зависимости от размера данных
   */
  defCursors(data = this.sortedData, cursors = this.cursors) {
    const length = data.length;
    const step = (length / 3) | 0;
cursors.sort((a, b) => b.position - a.position);
for (let i = 0; i < cursors.length; i++) {
      cursors[i].position =length- step * (i);
}
    this.cursors = cursors;
    return cursors
  }
  /**
   * Расставляет уровень для каждого элемента в отсортированном списке  в соответствии с курсорами
   */
  placeLevel() {
    if(this.sortedData!=null){
    this.sortedData = this.data.sort((a, b) => {
      return a.value - b.value;
    })}else{this.sortByValue();}
    if (this.cursors[0].position===0) this.defCursors();
    this.cursors.sort((a, b) => a.position - b.position);

    this.sortedData = this.sortedData.map((data, index) => {
      const cursorIndex = this.cursors.findIndex(c => index <= c.position);//Для всех где индекс меньше либо равен позиции курсора
      const levelValue = cursorIndex !== -1 ? this.cursors[cursorIndex].name : 'unknown';
      return {
        ...data,
        level: levelValue
      };
    });
    this.sortByDate();
    this.getSequence();
  }
  /**
   * Передвинуть курсор указанного уровня на указанное число элементов
   * 
   * @param {String} level Строка имени изменяемого уровня 
   * 
   * Пример - "high","medium", "low"
   * @param {Number} amount Число на которое нужно сдвинуть позицию уровня(отрицательное для сдвига вниз)
   */
  moveLevel(level, amount) {
    this.cursors[this.cursors.findIndex(c => c.name === level)].position += amount;
    this.placeLevel();
  }
  getSequence(dataList=this.sortByDate()){
    
    
    const levelArray = dataList.map(data => data.level);
    const sequence = levelArray.join('');
    if(dataList.length>this.memoryDepth){
    this.sequence=sequence;}
    return sequence;


  }/**
   * Считает количество комбинаций в строке последовательностей
   * @param {*} combination Передаваемая комбинация, поиск которой пранируется осуществить
   * @returns количество совпадений
   */
 async countCombinationOccurrences(combination,seq=this.sequence) {
   let sequence=seq;
    const combinationLength = combination.length;
    let count = 0;
  
    for (let i = 0; i < sequence.length - combinationLength + 1; i++) {
      let match = true;
      for (let j = 0; j < combinationLength; j++) {
        if (sequence[i + j] !== combination[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        count++;
      }
    }
  const result=[combination,count];
    return result
  }
/**
 * Производит поиск количества переходов, записывает результат в список counts
 * @param {number} iteration Номер итерации прохода (Изначально задавать 0)
 */
async countLevelCombinations(iteration = 0) {
  const levels = this.cursors.map(cursor => cursor.name);
  const counts = this.counts;

  const isFirstIteration = iteration === 0;
  const isLastIteration = iteration === counts.length-1;

  const mipo = counts[iteration-1]!=null ? Object.keys(counts[iteration-1]).length : 0;
  const longestList = Math.max(levels.length, mipo);
  if (this.counts[iteration]==null)this.counts.push({});
  const promises = [];
  for (let i = 0; i < longestList; i++) {
    let firstLevel;
    if (isFirstIteration) {
      firstLevel = levels[i];
    } else {
      firstLevel = Object.keys(counts[iteration - 1])[i];
      let occ=0;
      //ниже идет проверка на условие: если два из трех элементов группы раны нулю
      for (let l = 0; l < levels.length; l++) {
        if (counts[iteration - 1][firstLevel.slice(0,-1).concat(levels[l])]==0) {
          occ+=1;
        }
      }
      if (counts[iteration - 1][firstLevel] === 0) {
        continue;
      }
      //строка ниже, если не закомменчена, дает соответствующее алгоритму кол-во конфигураций, но ИНОГДА ошибка становится больше
     else if(occ>=(levels.length-1)){continue};
    }

    const subPromises = [];
    for (let j = 0; j < levels.length; j++) {
      const secondLevel = levels[j];
      const combination1 = `${firstLevel}${secondLevel}`;      

  const promise = new Promise(resolve => {
    // resolve({combination1: this.countCombinationOccurrences(combination1)});
    resolve(this.countCombinationOccurrences(combination1));
  });
  subPromises.push(promise);
}
promises.push(subPromises);

   
  }

  const results = await Promise.all(promises.flat());
      
  for (let i = 0; i < results.length; i++) {
    const combination =Object.values(results[i])[0];
    counts[iteration][combination] = Object.values(results[i])[1];
    }
      
 // if (!isLastIteration) {
    for (let k = 0; k < Object.values(counts[iteration]).length; k++) {
      const element = Object.values(counts[iteration])[k];
        if (element > 1) {
        await this.countLevelCombinations(iteration + 1);
          break;
        }
      }
 // }
      
  this.memoryDepth = counts.length;
    }
  
   /**
   * Возвращает чистые значения для расчета вероятности терма следующей точки
   * 
   * @param {*} excludeItems Количество элементов с конца, которые следует игнорировать(по умочанию 0)
   * @param {*} data Список с данными
   * @param {*} counts Список с переходами
   * @param {*} memoryDepth Глубина памяти
   * 
   * @returns 
   */
   calculateMeetIndexes(excludeItems=0,data=this.sortedData, counts=this.counts, memoryDepth=this.memoryDepth) {
    const meetIndexes = new Map();
    const levels = this.cursors.map(cursor => cursor.name);
    // Slice the data array to exclude the specified number of elements from the end
    data = data.slice(0, -excludeItems || undefined);
    // Loop over each level of depth
    for (let depth = 0; depth < memoryDepth; depth++) {
      const lastElements = data.slice(-1 - depth).reverse();
      let lastLevel = '';
      let stageSum = { Н: 0, С: 0, В: 0 };

      // Loop over each element in the levels array
      for (let i = 0; i < 3; i++) {
        const currentLevel = levels[i];

        lastLevel='';
        // Check if the last level has changed
        for (let j=0;j<lastElements.length;j++){
          lastLevel+=lastElements[j].level;
        }

        // Calculate the count based on the current level and last level
        const key = lastLevel + currentLevel;
        const count = counts[depth][key];

        // Add the count to the stage sum
        if (count !== undefined) {
          stageSum[currentLevel] += count;
        }
      }

      // Calculate the meet index for each level and add it to the meetIndexes map
      var sum = 0;
      for (let iq = 0; iq < levels.length; iq++) {
       
        sum+=stageSum[levels[iq]];
      }
      if (sum==0)return meetIndexes;
      let MeetIndex=[];
      for (let iq = 0; iq < levels.length; iq++) {
      MeetIndex.push( stageSum[levels[iq]]/sum);
      }
      
      

      // const lowMeetIndex = stageSum.low / sum;
      // const mediumMeetIndex = stageSum.medium / sum;
      // const highMeetIndex = stageSum.high / sum;
      // TODO: Создать накапливаемую переменную для индексов, прибавлять индексы к предыдущим значениям 
      for (let i = 0; i < levels.length; i++) {
        meetIndexes.set(levels[i], MeetIndex[i]+(meetIndexes.has(levels[i])?meetIndexes.get(levels[i]):0));
        
      }
      // meetIndexes.set('low', lowMeetIndex+(meetIndexes.has('low')?meetIndexes.get('low'):0));
      // meetIndexes.set('medium', mediumMeetIndex+(meetIndexes.has('medium')?meetIndexes.get('medium'):0));
      // meetIndexes.set('high', highMeetIndex+(meetIndexes.has('high')?meetIndexes.get('high'):0));
    }

    return meetIndexes;
  }
  Validation(){
    this.validationTables=[];
let val_template={"index":0,"sequence":'',"raw":new Map(),"sum":0,"oddities":new Map(),"term":'',"Correct":false};
for (let i = 0; i < this.sortedData.length-this.memoryDepth; i++) {
  const index = this.sortedData.length-i;
  const sequence= this.getSequence(this.sortedData.slice(-this.memoryDepth-i,this.sortedData.length-i));
  const raw=this.calculateMeetIndexes(i);
  const sum = [...raw.values()].reduce((acc, val) => acc + val, 0);
  const oddities = new Map(Array.from(raw.entries()).map(([k, v]) => [k, v / sum]));
  const term=Array.from(oddities.entries())
  .reduce((max, [k, v]) => v > oddities.get(max) ? k : max, Array.from(oddities.keys())[0]); 
  const Correct=this.sortedData[index]!=null?(term==this.sortedData[index].level):true;
  this.validationTables.push({...val_template, index, sequence, raw, sum, oddities, term, Correct});

  }
  return this.getForecasterror();
}
getForecasterror() {
  const count = this.validationTables.filter(obj => obj.Correct).length;
  const percentage=100 -(count / this.validationTables.length * 100);
this.ForecastError=percentage;
  return percentage
}
calculatePrediction(data=this.sortedData,odds,levels=this.cursors.map(cursor => cursor.name)){
  let prediction;
  let lows = 0;
  let mediums = 0;
  let highs = 0;
  let lowc = 0;
  let mediumc = 0;
  let highc = 0;

  data.forEach(element => {
    if (element.level === 'В') {
      highs += element.value;
      highc += 1;
    }
    if (element.level === 'С') {
      mediums += element.value;
      mediumc += 1;
    }
    if (element.level === 'Н') {
      lows += element.value;
      lowc += 1;
    }
  });

  const oddsLow = odds.get("Н");
  const oddsMedium = odds.get("С");
  const oddsHigh = odds.get("В");
  const avgMediums = (mediums / mediumc) * oddsMedium;  
  const avgLows =(lows / !!lowc) * oddsLow ||0;
  const avgHighs =(highs / highc)  ;
  const maxOdds = Math.max(oddsLow, oddsMedium, oddsHigh);
let totalAvg=0;

if (maxOdds === oddsLow &&avgLows!=0) {
   totalAvg=avgLows;
} else if (oddsMedium>oddsHigh&&avgMediums!=0||avgHighs==0) {
  totalAvg=avgMediums;
} else if (avgHighs!=0) {
  totalAvg=avgHighs; 
}
  

  
  prediction = totalAvg;
  return prediction;
}


defuzzyfication(){
  let result=[];
  let sequence;
  let i=0;
  for (i=0;i<this.validationTables.length-1;i++){
  sequence=this.sortedData.slice(-this.memoryDepth-i,this.sortedData.length-i);
  const odds =new Map( this.validationTables[i].oddities);
 


result.push(this.calculatePrediction(sequence,odds));
//console.log(result);
  }
  this.predictionList=result;
  return result
}
isBelowLine(lineDot1,lineDot2,dot){
  const x1=lineDot1.index;
  const y1=lineDot1.y;
  const x2=lineDot2.index;
  const y2=lineDot2.y;
  //const {x,y}=dot;
  const x=dot.index;
  const y = dot.value;
  const idealY=(((x-x1)/(x2-x1))*(y2-y1))+y1;
  return y<=idealY
}
FootPointsLevels(data=this.sortedData,foot=this.FootPoints){
  
// Get all level names (N, C, B)
let levels = Object.keys(foot);

// Loop through each level 
for (let level of levels) {

 if(foot[level][0]!=undefined){ // Add first point with index -1 
  foot[level].unshift({
    x: foot[level][0].x,
    y: foot[level][0].y,
    index: -1 
  })
  
  // Add last point with index +1000
  foot[level].push({
    x: foot[level][foot[level].length - 1].x,
    y: foot[level][foot[level].length - 1].y,
    index: foot[level][foot[level].length - 1].index + 1000
  })}}

  for (let i = 0; i < data.length; i++) {
    let dot = data[i];
    dot={index:i,...dot};
    let isUnder = false;
    for (let level in foot) {
      const points = foot[level];
      for (let j = 0; j < points.length - 1; j++) {
        const lineDot1 = points[j];
        const lineDot2 = points[j + 1];
        if(dot.index>=lineDot1.index&&dot.index<=lineDot2.index){
        
        if (this.isBelowLine(lineDot1, lineDot2, dot)) {
          console.log(`${dot.date} is below ${level} line`);
          data[i].level=level;
          isUnder = true;
          break;
        }}else continue;
      }
      if (isUnder) break;
    }
    if (!isUnder) console.log(`${dot.date} is not under any lines`);
  }
  // Remove first and last points 
for (let level of levels) {
if(foot[level].length>2){
    foot[level].shift();
    foot[level].pop(); 
}
}
return [data,foot]}
async Recalculate(data=this.sortedData){
  this.sortedData=data;
  this.getSequence();
await this.countLevelCombinations();
this.Validation();
this.defuzzyfication();
return this.sortedData
}
}
