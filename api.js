//! https://652d3037f9afa8ef4b26f0ee.mockapi.io/products --- основной url сервера
const baseUrl = "https://652d3037f9afa8ef4b26f0ee.mockapi.io/products";

function getAllProducts(name, sortby, order, search) {
  //! тут я получаю ответ от сервера, а именно для того, чтобы отобразить своих котов
  if (search.trim() == "") {
    return fetch(`${baseUrl}?category=${name}&sortby=${sortby}&order=${order}`);
  } else {
    return fetch(`${baseUrl}?sortby=${sortby}&order=${order}&search=${search}`);
  }
}
