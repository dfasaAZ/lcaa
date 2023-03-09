export class CellularAutomaton {
  /**Неотформатированные данные, ключи - наименование стобца, значения - список значений столбца */
  rawData = null;
  data = [];
  sortedData = [];

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

  /**Достать данные в чистом виде из csv файла 
   * 
   * Возвращает список map'ов со всеми столбцами
   * 
   * !!!Использовать только с await!!!
   * 
   * @param {string} path Путь к файлу
  */
  extractData(csvString) {
    const results = [];
    csvString.replace(/\r/g, "");
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
   * @param {string}csvString: "\\путь\\к\\файлу"
   */
  async LoadData(csvString) {

    this.rawData = this.extractData(csvString);
    this.data = this.rawData.map((data) => {
      return {
        'date': new Date(data['<DATE>']),
        'value': parseFloat(data['<CLOSE>'])
      };
    });
    this.sortByValue();
    this.getSequence();
  }


  /**
   * Сортирует по значению, и помещает в отдельную переменную, затем расставляет уровни
   */
  sortByValue() {

    this.sortedData = this.data.sort((a, b) => {
      return a.value - b.value;
    });
    this.placeLevel();
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
    this.cursors.sort((a, b) => a.position - b.position);

    this.sortedData = this.sortedData.map((data, index) => {
      const cursorIndex = this.cursors.findIndex(c => index <= c.position);//Для всех где индекс меньше либо равен позиции курсора
      const levelValue = cursorIndex !== -1 ? this.cursors[cursorIndex].name : 'unknown';
      return {
        ...data,
        level: levelValue
      };
    });
  }


  /**
   * Передвинуть курсор указанного уровня на указанное число элементов
   * 
   * @param {String} level Строка имени изменяемого уровня 
   * 
   * Пример - "high"
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


  }
}
