Este é um projeto simples desenvolvido com HTML, CSS e Js.

projeto desenvolvido com fins de estudo Js (POO e DOM)

Temos o arquivo pizzas.js que funciona como uma fonte formato JSON, para não termos a necessidade de banco de dados guardando as informações.

então utilizamos a função cloneNode(true), que funciona com elementos node (nó), essa função clona o elemento, e é utilizado o parámetro "true" para clonar não só o elemento em si, mas também os filhos desse elemento dom.

esses elementos clonados são armazenados numa variável chamada pizzaItem que esta apontando para o elemento pizza-item do nosso HTML.

inserimos o atributo "data-key" em cada clone, utilizando a func "setAttribute("data-key", index)"

a partir destes clones (que representam o nosso pizzaJSON no arquivo pizzas.js), inputamos os valores que temos no pizzas.js em nossas tags HTML que estão ligadas a ca pizzaItem.

logo após utilizamos um "document.querySelector(".pizza-area").append(pizzaItem)" para assim mostrar na área designada todos os nossos "pizzaItem", cada um com seu determinado valor.