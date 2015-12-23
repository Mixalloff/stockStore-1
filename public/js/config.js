
var server = "http://ec2-54-200-218-253.us-west-2.compute.amazonaws.com:8080";
var localServer = "/public/html/";

var Config = {

  //для запросов
  getStocks: server + "/company/stocks/me", //получение всех акций компании
  getCompanyInfo: server + "/company/companies/me", //получение информации о компании
  createStock: server + "/company/stocks/create", //создание акции
  editStock: server + "/company/stocks/edit", //редактирование акции
  removeStock: server + "/company/stocks/remove",
  registerCompany: server + "/company/register", //регистрация компании
  authorizeCompany: server + "/company/authorize", //авторизация компании

  //спиннер
  spinner: {
    start: function(el){
      window._spinner = new Spinner({color:'#000', lines: 12}).spin(document.getElementById(el));
    },
    stop: function(){
      window._spinner.stop();
    }
  },

  //числовые константы
  cookieExpiredDays: 100,
  menuItemOffset: 35,
  menuFadeIn: 500,

  //локальный сервер (после продакшена поменять)

  pageCompany: localServer + "company.html",
  pageMain: localServer + "main.html",


  //сообщения (уведомления)
  mesWrongRegister: "Не удалось зарегистрироваться",
  mesWrongAuthorize: "Не удалось авторизоваться",
  mesWrongGetStocks: "Не удалось получить акции компании",
  mesWrongGetCompanyInfo: "Не удалось полуить информацию о компании",
  mesWrongAddStock: "Не удалось добавить акцию",
  mesWrongEditStock: "Не удалось обновить акцию",
  mesWrongRemoveStock: "Не удалось удалить акцию",
  mesSuccessRemoveStock: "Акция успешно удалена",


  //пункты меню
  menuCompanyItems: ["Домой", "Акции", "Статистика"]



};