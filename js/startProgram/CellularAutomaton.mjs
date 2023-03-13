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
  /**Курсоры, указывающие на границы коридоров
   * 
   * Все элементы в отсортированном массиве с индексом меньше либо равном position должны иметь аттрибут с соответствующим именем 
   * 
   * TODO: процедурно генерировать курсоры на случай если точек будет не 60 и\или коридоров будет больше*/
  cursors = [
    { 'name': 'low', 'position': 20 },
    { 'name': 'medium', 'position': 40 },
    { 'name': 'high', 'position': 60 }

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
   * Расставляет уровень для каждого элемента в отсортированном списке  в соответствии с курсорами
   */
  placeLevel() {
    this.sortedData!=null?
    this.sortedData = this.data.sort((a, b) => {
      return a.value - b.value;
    }):this.sortByValue();
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
  getSequence(){
    var dataList=[];
    dataList=this.sortByDate();
    const levelArray = dataList.map(data => data.level);
    const sequence = levelArray.join('');
    this.sequence=sequence;


  }/**
   * Считает количество комбинаций в строке последовательностей
   * @param {*} combination Передаваемая комбинация, поиск которой пранируется осуществить
   * @returns количество совпадений
   */
  countCombinationOccurrences(seq,combination) {
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
  
    return count;
  }
/**
 * Производит поиск количества переходов, записывает результат в список counts
 * @param {number} iteration Номер итерации прохода (Изначально задавать 0)
 */
  countLevelCombinations(iteration) {
  let mipo=0;//количество элементов в результирующем массиве текущей итерации
    const levels = this.cursors.map(cursor => cursor.name);
    let sequence=this.sequence;
    var firstLevel;
    var longestList;
    if (this.counts[iteration]==null)this.counts.push({});
    if (this.counts[iteration-1]!=null){
    mipo=Object.keys(this.counts[iteration-1]).length;
  levels.length<mipo?longestList=mipo:longestList=levels.length;}else longestList=levels.length;
    for (let i = 0; i < longestList; i++) {
      iteration==0?firstLevel = levels[i]:firstLevel=Object.keys(this.counts[iteration-1])[i].replaceAll('-to-','');
      for (let j = 0; j < levels.length; j++) {
      if(iteration){if(this.counts[iteration-1][firstLevel]==0){break;};}
        const secondLevel = levels[j];
        const combination1 = `${firstLevel}${secondLevel}`;      
        const count1 = this.countCombinationOccurrences(combination1);
      this.counts[iteration][`${firstLevel}${secondLevel}`] = count1;
        
      }
      
      for (let k = 0; k <= Object.values(this.counts[iteration]).length; k++) {
        let element = Object.values(this.counts[iteration])[k];
        if (element > 1) {
          this.countLevelCombinations(iteration + 1);
          break;
        }
      }
      
    }
  
    this.memoryDepth=this.counts.length;
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
    const levels = ["low", "medium", "high"];
    // Slice the data array to exclude the specified number of elements from the end
    data = data.slice(0, -excludeItems || undefined);
    // Loop over each level of depth
    for (let depth = 0; depth < memoryDepth; depth++) {
      const lastElements = data.slice(-1 - depth).reverse();
      let lastLevel = '';
      let stageSum = { low: 0, medium: 0, high: 0 };

      // Loop over each element in the lastElements array
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
      var sum = stageSum.low + stageSum.medium + stageSum.high;
      if (sum==0)return meetIndexes;
      const lowMeetIndex = stageSum.low / sum;
      const mediumMeetIndex = stageSum.medium / sum;
      const highMeetIndex = stageSum.high / sum;
      // TODO: Создать накапливаемую переменную для индексов, прибавлять индексы к предыдущим значениям 
      meetIndexes.set('low', lowMeetIndex+(meetIndexes.has('low')?meetIndexes.get('low'):0));
      meetIndexes.set('medium', mediumMeetIndex+(meetIndexes.has('medium')?meetIndexes.get('medium'):0));
      meetIndexes.set('high', highMeetIndex+(meetIndexes.has('high')?meetIndexes.get('high'):0));
    }

    return meetIndexes;
  }
   
  }
}
