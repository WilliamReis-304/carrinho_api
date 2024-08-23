document.addEventListener('DOMContentLoaded', () => {
    const listaProdutos = document.getElementById('lista-produtos');
    const linkCarrinho = document.getElementById('link-carrinho');
    const contagemCarrinho = document.getElementById('contagem-carrinho');
    const cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
    const listaCarrinho = document.getElementById('itens-carrinho');
    const totalCarrino = document.getElementById('total-carrinho');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4';
                productCard.innerHTML = `
                    <div class="card">
                        <div id="imagem" style={width: 200px; height: 250px;}>
                            <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <h3 class="card-text">$${product.price.toFixed(2)}</h3>
                            <button class="btn btn-outline-success add-to-cart" data-id="${product.id}">Adicionar ao Carrinho +</button>
                        </div>
                    </div>
                `;
                listaProdutos.appendChild(productCard);
            });
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
        });

    function addToCart(event) {
        const productId = event.target.getAttribute('data-id');
        const product = cart.find(item => item.id === productId);

        if (product) {
            product.quantity++;
        } else {
            const newProduct = {
                id: productId,
                title: event.target.parentElement.querySelector('.card-title').textContent,
                price: parseFloat(event.target.parentElement.querySelector('.card-text').textContent.replace('$', '')),
                quantity: 1
            };
            cart.push(newProduct);
        }

        updateCart();
    }

    function updateCart() {
        contagemCarrinho.textContent = `(${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    linkCarrinho.addEventListener('click', () => {
        listaCarrinho.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.title} - ${item.quantity} x $${item.price.toFixed(2)}`;
            listaCarrinho.appendChild(listItem);
            total += item.quantity * item.price;
        });

        totalCarrino.textContent = total.toFixed(2);
        cartModal.show();
    });

    checkoutBtn.addEventListener('click', () => {
        alert('Compra realizada! Obrigado pela compra.');
        cart = [];
        updateCart();
        cartModal.hide();
    });

    updateCart();
});
