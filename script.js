// Storage Controller
const StorageController = (function (){

    return{
        storageProduct : function(product){
            let products;
            if(localStorage.getItem('products')===null){
                products = [];
                products.push(product);
            }else{
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products));
        },

        getProducts : function(){
            let products;
            if(localStorage.getItem('products')===null){
                products = [];
            }else{
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },

        updateProduct : function(product){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((prd,index) =>{
                if(products.id == prd.id){
                    products.splice(index,1,product);
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        },

        deleteProduct : function(id){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((prd,index) =>{
                if(id == prd.id){
                    products.splice(index,1);
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        }
    }
})(); 


// Product Controller
const ProductController = (function () {

    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    }

    return {
        getProducts: function () {
            return data.products;
        },

        getData: function () {
            return data;
        },

        addProduct : function(name,price){
            let id;

            if(data.products.length > 0){
                id = data.products[data.products.length-1].id+1
            }else{
                id = 0;
            }

            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
    
        getTotal : function(){
            let total = 0;
            
            data.products.forEach(element =>{
                total += element.price;
            })

            data.totalPrice = total;
            return data.totalPrice;
        },

        getProductById : function(id){
            let product = null;
            
            data.products.forEach(function(prd){
                if(prd.id == id){
                    product = prd;
                }
            })

            return product;
        },

        setCurrentProduct : function(product){
            data.selectedProduct = product;
        },

        getCurrentProduct : function(){
            return data.selectedProduct;
        },

        updateProduct : function(name,price){
            let product = null;

            data.products.forEach(prd =>{
                if(prd.id == data.selectedProduct.id){
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            })

            return product;
        },

        deleteProduct : function(product){
            data.products.forEach((prd,index) =>{
                if(prd.id == product.id){
                    data.products.splice(index,1);
                }
            })
        }
    }
})();


// UI Controller 
const UIController = (function () { 

    const Selectors = {
        productList : "#item-list",
        productListItems : "#item-list tr",
        productName : "#productName",
        productPrice : "#productPrice",
        addButton : ".addButton",
        saveButton : ".saveButton",
        deleteButton : ".deleteButton",
        cancelButton : ".cancelButton",
        productCard : "#productCard",
        totalTl : "#total-tl",
        totalDolar : "#total-dolar",
    }

    return {

        createProductList: function (products) {

            let html = '';

            products.forEach(prd => {
                html += `
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td class="text-right">
                            <i class="far fa-edit edit-product"></i>
                        </td>
                    </tr>   
                    `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;

        },

        getSelectors : function(){
            return Selectors;
        },

        addProduct : function(prd){
            document.querySelector(Selectors.productCard).style.display ='block';
            var html =`
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                    <i class="far fa-edit edit-product"></i>
                </td>
            </tr> 
            `;

            document.querySelector(Selectors.productList).innerHTML += html;
        },

        clearInputs : function(){
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },

        hideCard : function(){
            document.querySelector(Selectors.productCard).style.display = 'none';
        },

        showTotal : function(total){
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTl).textContent = total*7;
        },

        addProductToForm : function(){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },

        addingState : function(){
            UIController.clearInputs();  
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.saveButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },

        editState : function(tr){
            this.clearWarnings();
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.saveButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        },

        updateProduct : function(prd){
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item =>{
                if(item.classList.contains("bg-warning")){
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            })

            return updatedItem;
        },

        clearWarnings : function(){
            const items = document.querySelectorAll(Selectors.productListItems);
            
            items.forEach(function(item){
                if(item.classList.contains('bg-warning')){
                    item.classList.remove('bg-warning');
                }
            })
        },

        deleteProduct : function(){
            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item =>{
                if(item.classList.contains('bg-warning')){
                    item.remove();
                }
            })
        }
    }
})();


// App Controller
const AppController = (function (ProductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    const loadEventListener = function(){

        // add product 
        document.querySelector(UISelectors.addButton).addEventListener('click',productAddSubmit);
    
        // edit product
        document.querySelector(UISelectors.productList).addEventListener('click',productEditClick);

        // product edit submit
        document.querySelector(UISelectors.saveButton).addEventListener('click',productEditSubmit);
    
        // product edit cancel
        document.querySelector(UISelectors.cancelButton).addEventListener('click',productCancelEdit);
    
        // product edit delete
        document.querySelector(UISelectors.deleteButton).addEventListener('click',productDeleteEdit);
    }

    // product Add
    const productAddSubmit = function(e){

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        
        if(productName !=='' && productPrice !==''){

            const newProduct = ProductCtrl.addProduct(productName,productPrice);
            
            UIController.addProduct(newProduct);

            // LS
            StorageCtrl.storageProduct(newProduct);

            const total = ProductCtrl.getTotal();
            
            UIController.showTotal(total);

            UIController.clearInputs();
        }
        e.preventDefault();
    }

    // product Edit 
    const productEditClick = function(e){

        if(e.target.classList.contains('edit-product')){
            
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            
            const product = ProductCtrl.getProductById(id);
            
            ProductCtrl.setCurrentProduct(product);

            UICtrl.clearWarnings();

            UICtrl.addProductToForm();
           
            UICtrl.editState(e.target.parentNode.parentNode);
        }


        e.preventDefault();
    }

    // product Edit Submit
    const productEditSubmit = function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        
        if(productName!=='' && productPrice !==''){
            const updatedProduct = ProductCtrl.updateProduct(productName,productPrice);

            let item = UICtrl.updateProduct(updatedProduct);

            const total = ProductCtrl.getTotal();
            
            UICtrl.showTotal(total);

            UICtrl.addingState();
        }


        e.preventDefault();
    }

    // product Cancel Edit
    const productCancelEdit = function(e){

        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }

    // product Delete Edit
    const productDeleteEdit= function(e){

        const selectedProduct = ProductCtrl.getCurrentProduct();

        ProductCtrl.deleteProduct(selectedProduct);

        UICtrl.deleteProduct();

        const total = ProductCtrl.getTotal();

        UICtrl.showTotal(total);

        // dlete from LS
        StorageCtrl.deleteProduct(selectedProduct.id);
        
        UICtrl.addingState();

        if(total===0){
            UICtrl.hideCard();
        }

        e.preventDefault();
    }

    return {
        init: function () {
            console.log('App is starting...');

            UICtrl.addingState();

            const products = ProductCtrl.getProducts();
            
            if(products.length === 0){
                UICtrl.hideCard();
            }else{
                UICtrl.createProductList(products);
            }

            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total)

            loadEventListener();
        }
    }
})(ProductController, UIController, StorageController);

AppController.init();
