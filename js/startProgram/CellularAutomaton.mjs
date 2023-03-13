export class CellularAutomaton {
  /**Неотформатированные данные, ключи - наименование стобца, значения - список значений столбца */
  rawData = null;
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
  
   
  }
}
