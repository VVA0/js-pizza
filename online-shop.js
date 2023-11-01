//!------------------------------------ПРОЕКТ С ПИЦЦЕЙ-------------------------------------
const conteiner = document.querySelector(".products__conteiner");
const categories = document.querySelectorAll(".category");
const searchInput = document.querySelector(".search__input");
const searchBtn = document.querySelector(".search__btn");
const select = document.querySelector(".select");
const cart = document.querySelector(".cart");
const basketWrapper = document.querySelector(".basket__wrapper");
const basketClose = document.querySelector(".basket__close");
const basketContainer = document.querySelector(".basket__list");
const basketCount = document.querySelectorAll(".count__value");
const basketSum = document.querySelectorAll(".sum__value");

let basketArray = [];
let apiCategory = "";
let apiSortBy = "";
let apiOrder = "";
let apiSearch = "";

categories.forEach((element) => {
  element.onclick = function () {
    removeCategories();
    element.classList.add("active");
    let categoryName = element.innerHTML.toLowerCase(); //! toLowerCase - привела символы к нижнему регистру (так как они в кнопке с большой буквы)
    if (categoryName == "вcе") {
      apiCategory = "";
    } else {
      apiCategory = categoryName;
    }
    renderProducts(apiCategory, apiSortBy, apiOrder, "");
  };
});

cart.onclick = function () {
  basketWrapper.classList.add("basket-active");
};

basketClose.onclick = function () {
  basketWrapper.classList.remove("basket-active");
};

searchBtn.onclick = function () {
  apiSearch = searchInput.value;
  renderProducts("", "", "", apiSearch);
};

select.onchange = function () {
  //! onchange это для селекта (обработчик события)
  if (select.value == "asc" || select.value == "desc") {
    apiOrder = select.value;
    apiSortBy = "price";
  } else if (select.value == "rate") {
    apiSortBy = "rate";
    apiOrder = "desc";
  } else {
    apiOrder = "";
    apiSortBy = "";
  }
  renderProducts(apiCategory, apiSortBy, apiOrder, "");
};

function removeCategories() {
  categories.forEach((element) => {
    element.classList.remove("active");
  });
}

function renderProducts(category, sortby, order, search) {
  conteiner.innerHTML = null;
  getAllProducts(category, sortby, order, search)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.forEach((element) => {
        //   let currentElement = basketArray.find(function (item) {
        //     //! Заношу результат нахождения элемента в корзине (это для того чтобы вывести кол-во выбранных элементов в корзине)
        //     return item.id == element.id;
        //   });
        //   console.log(currentElement);
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
      addListeners(data);
    });
}
function addListeners(data) {
  const counts = document.querySelectorAll(".count");
  const btns = document.querySelectorAll(".product__btn");
  btns.forEach((element, index) => {
    element.onclick = function () {
      let curentElement = basketArray.find(function (item) {
        return item.id == data[index].id;
      });
      if (curentElement) {
        curentElement.count++;
        counts[index].innerHTML = `(${curentElement.count})`;
      } else {
        counts[index].innerHTML = `(1)`;
        basketArray.push({
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
      renderCart();
    };
  });
}

renderProducts(apiCategory, apiSortBy, apiOrder, "");

function renderCart() {
  let sum = 0;
  let count = 0;
  basketContainer.innerHTML = null;
  basketArray.forEach((element) => {
    sum += parseFloat(element.price) * element.count; //! достаю дробную часть (перевожу из строки в дробное число)
    count += element.count;
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
    addBasketListeners();
  });
  basketCount.forEach((element) => {
    element.innerHTML = count; //! отображаю количество элементов в корзине
  });
  basketSum.forEach((element) => {
    element.innerHTML = sum;
  });
}

function addBasketListeners() {
  const btns = document.querySelectorAll(".product__delete");
  const btnsMinus = document.querySelectorAll(".btn__minus");
  const btnsPlus = document.querySelectorAll(".btn__plus");
  btnsPlus.forEach((element, index) => {
    element.onclick = function () {
      let curentElement = basketArray[index];
      curentElement.count++;
      renderCart();
    };
  });
  btnsMinus.forEach((element, index) => {
    element.onclick = function () {
      let curentElement = basketArray[index];
      if (curentElement.count > 1) {
        curentElement.count--;
        renderCart();
      }
    };
  });
  btns.forEach((element, index) => {
    element.onclick = function () {
      // basketArray = basketArray
      //   .filter
      //   (item) => item.id !== basketArray[index].id
      //   ({ id }) => id !== basketArray[index].id
      //   ();
      basketArray = basketArray.filter(function (item) {
        return item.id !== basketArray[index].id;
      });
      renderCart();
      //!! подумать как удалить товар (filter, splice)
    };
  });
}

//! Задокументировать этот код + использую правильную терминологию
