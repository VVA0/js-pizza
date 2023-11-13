//!------------------------------------ПРОЕКТ С ПИЦЦЕЙ-------------------------------------
const conteiner = document.querySelector(".products__conteiner"); //? Достаем из HTML контейнер по классу для работы с JS
const categories = document.querySelectorAll(".category"); //? Достаем из HTML категории пицц по классу для работы с JS
const searchInput = document.querySelector(".search__input"); //? Достаем из HTML input для поиска товаров, для работы с JS
const searchBtn = document.querySelector(".search__btn"); //? Достаем из HTML кнопку (найти), для связки с input (для работы с JS)
const select = document.querySelector(".select"); //? Достаем из HTML выбор сортировки цены (для работы с JS)
const cart = document.querySelector(".cart"); //? Достаем из HTML корзину (JS)
const basketWrapper = document.querySelector(".basket__wrapper"); //? Достаем из HTML блок для работы с корзиной и выбранными товарами (JS)
const basketClose = document.querySelector(".basket__close"); //? Достаем из HTML кнопку для удаления товара из корзины (JS)
const basketContainer = document.querySelector(".basket__list"); //? Достаем из HTML блок, который располагается в корзине с карточкой товара где указана цена и количество товаров (JS)
const basketCount = document.querySelectorAll(".count__value"); //? Достаем из HTML блок, который располагаетс в корзине с карточкой, где указана общее количество товаров и общая сумма, расположены сверху (JS)
const basketSum = document.querySelectorAll(".sum__value"); //? Достаем из HTML блок, который располагается в корзине с карточкой, где указана общая сумма. располагается сверху (JS)

let basketArray = []; //? Создаем пустой массив для работы с корзиной
let apiCategory = ""; //? Создаем переменную в которую будем заносить категорию пиццы
let apiSortBy = ""; //?  Создаем переменную куда будем заносить выбранный пользователей вариант фильтрации
let apiOrder = ""; //? Фильтрация с выпадающим списком (цены по возрастанию и убыванию)
let apiSearch = ""; //? Создаем переменную в которую будем заносить результат поиска

categories.forEach((element) => {
  //? Работаем с массивом категорий
  element.onclick = function () {
    //? Для каждой выбранной категории вешаем клик
    removeCategories(); //? Тут мы вызываем функцию, которая снимает активный класс. Каждый раз, нажимая онклик, функция позволит снять активный класс. Чтобы была нажата только одна категория.
    element.classList.add("active"); //? Добавляем активный класс по клику, это логическое действие для онклик.
    let categoryName = element.innerHTML.toLowerCase(); //? toLowerCase - привела символы к нижнему регистру (так как они в кнопке с большой буквы). Заношу результат в переменную, изменяя регистр элемента ( т.е категории)
    if (categoryName == "вcе") {
      //? Делаю проверку if, для одной из категории "все"
      apiCategory = ""; //? Тут присваиваю пустые кавычки, для того, чтобы отобразить все пиццы в хаотичном порядке.
    } else {
      //? Если проверка if false, то выполняется вторая проверка else, где мы заносим результат выбранной пользователем категории пиццы в переменную.
      apiCategory = categoryName;
    }
    renderProducts(apiCategory, apiSortBy, apiOrder, ""); //! Тут мы вызываем функцию, которая отвечает за проявление верстки на странице, куда мы передаем 4 параметра (Категория пиццы,  )
  };
});

cart.onclick = function () {
  //? Вешаем онклик на корзину
  basketWrapper.classList.add("basket-active"); //? Добавляем активный класс т.е открываем корзину на сайте
};

basketClose.onclick = function () {
  //? Добавляем онклик на закрытие корзины (крестик слева от блока с корзиной по центру)
  basketWrapper.classList.remove("basket-active"); //? Снимаем активный класс (корзина скрывается)
};

searchBtn.onclick = function () {
  //? Вешаем онклик на кнопку (найти)
  apiSearch = searchInput.value; //? Заносим значение в переменную результат поиска из searchInput
  renderProducts("", "", "", apiSearch); //? Вызываем функцию, которая оторажает результат поиска
};

select.onchange = function () {
  //? Обработчик события для селекта (выпадающий список, выбор фильтрации по цене)
  //! onchange это для селекта (обработчик события)
  if (select.value == "asc" || select.value == "desc") {
    //? Выполняем проверку с данными из API, где одно из значений это по возрастанию и по убыванию цены
    apiOrder = select.value; //? Заносим значение селекта в переменную
    apiSortBy = "price";
  } else if (select.value == "rate") {
    //? Проверка значение по рейтингу
    apiSortBy = "rate"; //? Заносим результат переменной (по рейтингу)
    apiOrder = "desc"; //? Заносим результат фильтрации по возрастанию
  } else {
    //? А иначе,
    apiOrder = ""; //? По умолчанию
    apiSortBy = ""; //? По умолчанию
  }
  renderProducts(apiCategory, apiSortBy, apiOrder, ""); //? Вызываем функцию и передаем параметры соответствующие работе ончендж. (Выбранная категогрия пиццы? Фильтрация от API по возрст. или убыв., выбранное значение из выпадающего списка)
};

function removeCategories() {
  //? Пишем функцияю, которая будет удалять активный класс
  //?
  categories.forEach((element) => {
    //? Проходимся по массиву с категориями и для каждой категории чистим активный класс
    element.classList.remove("active");
  });
}

function renderProducts(category, sortby, order, search) {
  //? Объявляем функцию для отображения товаров на сайте (категория пицц? вариант фильтрации, ордер? кнопка поиска? )
  conteiner.innerHTML = null; //? Обновляем контейнер
  getAllProducts(category, sortby, order, search) //? Объявляем функцию для обработки ответа с backend
    .then(function (response) {
      //? Обрабатываем ответ от backend
      return response.json(); //? Переводим полученные данные в формат для работы тут
    })
    .then(function (data) {
      //? Получаем ответ (массив с данными)
      data.forEach((element) => {
        //? Для каждого элемента массива
        conteiner.insertAdjacentHTML(
          "beforeend",
          `<div class="product">
			 <div>
			 <img
				class="product__img"
				src=${element.image} 
				alt=""
			 />
			 <p class="product__name">${element.name}</p> 
			 <p class="product__description">${element.description}</p> 
			 </div>
			 <div class="product__info">
				<p class="product__price">${element.price} ₽</p>
				<button class="product__btn">Выбрать <span class="count"></span></button>
			 </div>
		  </div>`
        );
      });
      addListeners(data); //? Вызываем функцию
    });
}
function addListeners(data) {
  //? Объявляем функцию для работы с корзиной
  const counts = document.querySelectorAll(".count"); //? Достаем счетчик для общего кол-ва пицц
  const btns = document.querySelectorAll(".product__btn"); //? Достаем кнопки (выбрать)
  btns.forEach((element, index) => {
    //? Для массива с кнопками используем метод перебора элементов с индексом
    element.onclick = function () {
      //? На каждый элемент массива (т.е кнопки- выбрать), вешаем онклик
      let curentElement = basketArray.find(function (item) {
        //? Объявлянем переменную счетчик элементов и присваиваем результат метода find (из корзины)
        return item.id == data[index].id; //? Возвращаем  (id кнопки равняется массив,индекс,id). Получаем id карточки по нажатию кнопки для работы далее
      });
      if (curentElement) {
        curentElement.count++; //? Увеличиваем счетчик на 1
        counts[index].innerHTML = `(${curentElement.count})`; //? Меняем значение счетчика в HTML и присваимваем цифру счетчика
      } else {
        counts[index].innerHTML = `(1)`; //? Тут как-бы по умолчанию стоит 1шт, потому что товар уже в корзине и он не может быть 0шт
        basketArray.push({
          //? Добавляем в корзину объект с счетчиком
          name: data[index].name,
          description: data[index].description,
          price: data[index].price,
          id: data[index].id,
          image: data[index].image,
          count: 1,
        });
      }
      //!тут добавляю "выбрать" в "корзину"
      console.log(basketArray);
      renderCart(); //? Вызываем функцию, которая покажет корзину
    };
  });
}

renderProducts(apiCategory, apiSortBy, apiOrder, ""); //? вызываем функцию которая покажет весь список товаров

function renderCart() {
  //? Объявляем функцию для показа корзины
  let sum = 0; //? Объявляем переменную для того, чтобы заносить туда общую сумму товаров
  let count = 0; //? Объявляем переменную, где будет храниться общее кол-во товаров
  basketContainer.innerHTML = null; //? Обновляем карточку с товаром
  basketArray.forEach((element) => {
    //? Идем по массиву товаров в корзине
    sum += parseFloat(element.price) * element.count; //! достаю дробную часть (перевожу из строки в дробное число)
    count += element.count; //? Присваиваем результат к счетчику
    basketContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="basket__product">
	 <div class="basket__delete">
		<div class="basket__flex">
		  <img
			 class="product__image"
			 src=${element.image}
			 alt=""
		  />
		  <div class="product__information">
			 <h3 class="product__title">${element.name}</h3>
			 <div class="product__weight">${element.description}</div>
		  </div>
		</div>
		<button class="product__delete">x</button>
	 </div>
	 <div class="basket__counter">
		<div class="product__price">${element.price} ₽</div>
		<div class="product__count">
		  <button class="btn__minus">-</button>
		  <div class="btn__count">${element.count}</div>
		  <button class="btn__plus">+</button>
		</div>
	 </div>
  </li>`
    );
    addBasketListeners(); //? Вызываем функцию
  });
  basketCount.forEach((element) => {
    //? Идем по массиву счетчика
    element.innerHTML = count; //! отображаю количество элементов в корзине
  });
  basketSum.forEach((element) => {
    //? Идем по массиву с общей суммой
    element.innerHTML = sum; //? Отображаю общую сумму
  });
}

function addBasketListeners() {
  //? объявляю функцию для работы с корзиной
  const btns = document.querySelectorAll(".product__delete"); //? Достаем кнопки для удаления товаров
  const btnsMinus = document.querySelectorAll(".btn__minus"); //? Достаем кнопку уменьшения кол-ва товаров
  const btnsPlus = document.querySelectorAll(".btn__plus"); //? Достаем кнопку увеличения кол-ва товаров
  btnsPlus.forEach((element, index) => {
    //? Идем по массиву кнопок работая с элементами и индексами
    element.onclick = function () {
      //? Вешаем онклик на каждую кнопку удаления
      let curentElement = basketArray[index]; //? Заносим элемент из корзины в переменную ***
      curentElement.count++; //? Увеличиваем счетчик
      renderCart(); //? Показываем корзину с внесенными изменениями
    };
  });
  btnsMinus.forEach((element, index) => {
    //? Методом перебора идем по кнопкам (минус), работая с элементами и индексами
    element.onclick = function () {
      //? На каждую кнопку вещаем онклик
      let curentElement = basketArray[index]; //? Заносим элемент из корзины в переменную ***
      if (curentElement.count > 1) {
        //? Устанавливаем ограничение до 1
        curentElement.count--; //? Минусуем счетчик
        renderCart(); //? Показываем корзину с изменениями
      }
    };
  });
  btns.forEach((element, index) => {
    //? Методом перебора по массиву кнопок
    element.onclick = function () {
      //? Для каждого элемента вешаем онклик
      basketArray = basketArray.filter(function (item) {
        //? Заносим результат удаления товара из корзины
        return item.id !== basketArray[index].id;
      });
      renderCart(); //? Вызываем функцию с обновленными данными
    };
  });
}

//! Задокументировать этот код + использую правильную терминологию
