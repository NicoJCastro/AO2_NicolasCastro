document.addEventListener('DOMContentLoaded', function ()  {
    const form = document.getElementById('productForm');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const totalStock = document.getElementById('totalStock');

    let products = JSON.parse(localStorage.getItem('products')) || [];

    function renderProducts() {
        productTable.innerHTML = '';
        let total = 0;

        products.forEach(product => {
            const subtotal = calculateSubtotal(product);
            total += subtotal;

            const row = productTable.insertRow();
            row.className = product.iva == 10 ? 'iva-10' : 'iva-21';
            row.innerHTML = `
                <td>${product.codigo}</td>
                <td>${product.descripcion}</td>
                <td>${product.marca}</td>
                <td>${product.cantidad}</td>
                <td>${product.precio}</td>
                <td>${product.iva}%</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct('${product.codigo}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.codigo}')">Eliminar</button>
                </td>
            `;
        });

        totalStock.textContent = total.toFixed(2);
    }

    function calculateSubtotal(product) {
        const subtotal = (product.precio * product.cantidad) + ((product.precio * product.cantidad) * product.iva / 100);
        return subtotal;
    }

    form.addEventListener('submit', function (e)  {
        e.preventDefault();

        const codigo = document.getElementById('codigo').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const marca = document.getElementById('marca').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value.trim());
        const precio = parseFloat(document.getElementById('precio').value.trim());
        const iva = parseInt(document.getElementById('iva').value.trim());

        if (codigo.length < 3 || descripcion.length < 3 || marca.length < 3) {
            alert('Código y Descripción deben tener al menos tres caracteres.');
            return;
        }        

        const product = { codigo, descripcion, marca, cantidad, precio, iva };

        const existingProductIndex = editingProductCodigo ? products.findIndex(function(p) { return p.codigo === editingProductCodigo; }) : -1;
        if (existingProductIndex >= 0) {
            products[existingProductIndex] = product;
        } else {
            products.push(product);
        }
    
        editingProductCodigo = null;
    
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        form.reset();
    });

    let editingProductCodigo = null;
    window.editProduct = function (codigo)  {
        const product = products.find(function(p) { return p.codigo === codigo; });
        if (product) {
            editingProductCodigo = product.codigo;
          
            document.getElementById('codigo').value = product.codigo;
            document.getElementById('descripcion').value = product.descripcion;
            document.getElementById('marca').value = product.marca;
            document.getElementById('cantidad').value = product.cantidad;
            document.getElementById('precio').value = product.precio;
            document.getElementById('iva').value = product.iva;
        }
        console.log(editingProductCodigo);
    };

    window.deleteProduct = function (codigo) {
        products = products.filter(function(p) { return p.codigo !== codigo; });
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    };

    renderProducts();
});
