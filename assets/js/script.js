let modalQt = 1;
let modalKey = 0;
let cart = [];
//criação de uma constante que seleciona elementos.
const qS = (el) => document.querySelector(el);
const qSA = (el) => document.querySelectorAll(el);

//listagem das pizzas
pizzaJson.map((item, index) => {
    //inputamos as pizzas via JS como se fosse um JSON, então utilizamos a função cloneNode(true)
    //que normalmente funciona com elementos node (nó), essa função clona o elemento, e é utilizado o parámetro
    //true para clonar não só o elemento em si, mas também os filhos desse elemento dom.
    let pizzaItem = qS(".models .pizza-item").cloneNode(true);
    //logo abaixo pegamos as informações do nosso pizzaItem, isso lembrando que pizzaItem agora recebe valores variados dependendo de seu clone.
    //{
    pizzaItem.setAttribute("data-key", index);
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = "R$" + item.price.toFixed(2);
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    //}
    //colocar as informações na tela:
    //pizzaArea recebe pizzaItem como seu filho, lembrando dos clones/index.
    qS(".pizza-area").append(pizzaItem);
    //aqui vamos adicionar uma função de click no elemento a de pizzaItem, recebendo e que no caso é o próprio "a"
    pizzaItem.querySelector("a").addEventListener("click",(e)=> {
        e.preventDefault();
        //a gente poderia muito bem usar utilizar o key como valor do item.id
        //key é "a" porém com a função closest, pegamos o item mais próximo escolhido, ou seja o "pizza-item" mais próximo do a/e clicado.
        //pegamos esse .pizza-item com closest e pegamos o atributo data-key setado acima.
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        //setamos a variavel modalKey como key para podermos utilizar ela no cart, já que modalKey é uma variavel global.
        modalKey = key;
        //atualizamos o modalQt assim que reabrimos o modal.
        modalQt = 1;
        qS(".pizzaInfo--qt").innerHTML = modalQt;
        //aqui setamos todas as informações que iram aparecer no modal:
        //{
        qS(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        qS(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        qS(".pizzaInfo--actualPrice").innerHTML = "R$ " + pizzaJson[key].price.toFixed(2);
        qS(".pizzaBig img").src = pizzaJson[key].img;
        //}
        qS(".pizzaInfo--size.selected").classList.remove("selected");
        //nós removemos a class selected quando fechamos o modal, para dar um ar de reset
        qSA(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        //depois de setarmos todas as particularidades com as determinadas informações, fazemos após o clique, o modal aparecer
        qS(".pizzaWindowArea").style.opacity = 0;
        qS(".pizzaWindowArea").style.display = "flex";
        setTimeout(()=>{
            qS(".pizzaWindowArea").style.opacity = 1;
        }, 200);
    });
    //neste módulo estamos definindo como funciona a escolha dos tamanhos.
    qSA(".pizzaInfo--size").forEach((size, sizeIndex) => {
        size.addEventListener("click", (e)=> {
           qS(".pizzaInfo--size.selected").classList.remove("selected");
           size.classList.add("selected");
        });  
    });
    //escolha dos tamanhos finished.    
});
    //implementação da funcionalidade de aumentar a quantidade de pizzas e diminuir
    qS(".pizzaInfo--qtmais").addEventListener("click", () => {
        if(modalQt >= 1) {
            modalQt++;
            qS(".pizzaInfo--qt").innerHTML = modalQt;
        }
        //qS(".pizzaInfo--actualPrice").innerHTML = "R$ " +  modalQt * pizzaJson[key].price.toFixed(2); 
    });
    qS(".pizzaInfo--qtmenos").addEventListener("click", () => {
        if(modalQt > 1) {
            modalQt--;
            qS(".pizzaInfo--qt").innerHTML = modalQt;
        }
        //qS(".pizzaInfo--actualPrice").innerHTML = "R$ " +  modalQt * pizzaJson[key].price.toFixed(2); 
    });
    //eventos do modal
    qS(".pizzaInfo--cancelButton").addEventListener("click", closeModal);
    qS(".pizzaInfo--cancelMobileButton").addEventListener("click", closeModal);
    //no caso de muitos elementos, temos como criar um array, adicionar a função forEach e pegarmos o item, e para cada item executarmos um 
    //EventListener.
    function closeModal() { 
        qS(".pizzaWindowArea").style.opacity = 1;   
        setTimeout(()=>{
            qS(".pizzaWindowArea").style.opacity = 0;
        }, 100);
        setTimeout(()=>{
            qS(".pizzaWindowArea").style.display = "none";
        }, 400);  
    }
    //nesta etapa estamos incluindo as informações mo array global car por meio de objetos.
    qS(".pizzaInfo--addButton").addEventListener("click", ()=> {
        //utilizando o modalKey que foi atualizado ao abrir o modal, temos o index da pizza selecionada não apenas 
        //no compartimento modal, mas sim no código todo agora.
        let size = parseInt(qS(".pizzaInfo--size.selected").getAttribute("data-key"));
        //criando um identificador, achei bastante interessante, consigo pensar em varias coisas para ser utilizado.
        let identifier = pizzaJson[modalKey].id+"%"+size;
        //fazendo uma varredura em cart para saber se já tem algum item com o mesmo identifier
        let key = cart.findIndex((item) => item.identifier == identifier);
        if(key > -1) {
            cart[key].qt += modalQt;
        }
        else {
            cart.push({
                identifier,
                id: pizzaJson[modalKey].id,
                size,
                qt:modalQt
            });
        };
        //por se tratar de um carrinho, precisamos atualiza-lo após inserir ou retirar uma nova pizza
        //quando adicionamos ao carrinho fecha-se o modal
        
        closeModal();
        updateCart();
    });
        qS(".menu-openner").addEventListener("click",()=>{
            if(cart.length > 0) {
            qS("aside").style.left = "0";
            }
        });
        qS(".menu-closer").addEventListener("click",()=>{
            qS("aside").style.left = "100vw";
        });
    function updateCart() {
        qS(".menu-openner span").innerHTML = cart.length;
        if(cart.length > 0) {
            
            qS("aside").classList.add("show");
            qS(".cart").innerHTML = "";

            let subtotal = 0;
            let desconto = 0;
            let total = 0;
            for(let i in cart) {
                //esse for é usado pra mapear o pizzaJson e definir qual pizza é a que esta no carrinho, esse valor é armazenado em pizzaItem
                let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id); 
                subtotal += pizzaItem.price * cart[i].qt;

                let cartItem = qS(".models .cart--item").cloneNode(true);

                let pizzaSizeName;
                    
                
                    switch(cart[i].size) {
                        case 0:
                            pizzaSizeName = pizzaJson[modalKey].sizes[0];
                        break;
                        case 1:
                            pizzaSizeName = pizzaJson[modalKey].sizes[1];
                        break;
                        case 2:
                            pizzaSizeName = pizzaJson[modalKey].sizes[2];
                        break;
                    }

                    let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

                    cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
                    cartItem.querySelector(".cart--item img").src = pizzaItem.img;
                    cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
                    
                    cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
                        if(cart[i].qt > 1) {
                            cart[i].qt--; 
                            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
                                
                                updateCart();
                        }else{
                            cart.splice(i,1);
                        }
                        updateCart();
                        });
                    cartItem.querySelector(".cart--item-qtmais").addEventListener("click",()=>{
                        cart[i].qt++;
                        cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
                            
                        updateCart();
                    });
                    
                    qS(".cart").append(cartItem);
            }
            desconto = subtotal * 0.1;
            total = subtotal * 0.9;
            
            qS(".subtotal span:last-child").innerHTML = "R$ " + subtotal.toFixed(2);
            qS(".desconto span:last-child").innerHTML = "R$ " + desconto.toFixed(2);
            qS(".total span:last-child").innerHTML = "R$ " + total.toFixed(2);
            
        }else {
            qS("aside").classList.remove("show");
            qS("aside").style.left = "100vw";
        }

        
        //qS(".cart--finalizar").addEventListener("click", ()=> {
        //    qS("aside").classList.remove("show");
        //});
    };