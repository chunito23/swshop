sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("eshop.controller.Detail", {
        onInit: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            let productId = oEvent.getParameter("arguments").productId;
            let oModel = this.getOwnerComponent().getModel("products");
            let oData = oModel.getData();
            
            let oSelectedProduct = oData.products.find(product => product.id === productId);
            if (oSelectedProduct) {
                oModel.setProperty("/selectedProduct", oSelectedProduct);
            }
        },

        onAddToCart: function () {
            let oCartModel = this.getOwnerComponent().getModel("cart");
            let oProduct = this.getOwnerComponent().getModel("products").getProperty("/selectedProduct");
            
            let aCartItems = oCartModel.getProperty("/items");
            let oExistingItem = aCartItems.find(item => item.id === oProduct.id);
            
            if (oExistingItem) {
                oExistingItem.quantity += 1;
            } else {
                aCartItems.push({
                    id: oProduct.id,
                    name: oProduct.name,
                    price: oProduct.price,
                    quantity: 1,
                    image: oProduct.image
                });
            }
            
            oCartModel.setProperty("/items", aCartItems);
            this._updateCartTotal();

            console.log("Carrito actualizado:", oCartModel.getProperty("/items"));
        },

        _updateCartTotal: function () {
            let oCartModel = this.getOwnerComponent().getModel("cart");
            let aCartItems = oCartModel.getProperty("/items");
            let fTotal = aCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            oCartModel.setProperty("/total", fTotal);
        }
    });
});