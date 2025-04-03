sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",

], function (Controller, History) {
    "use strict";

    return Controller.extend("eshop.controller.BaseController", {

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var SpreviousHash = oHistory.getPreviousHash();

            if (SpreviousHash) {
                window.history.go(-1)
            } else {
                this.getRouter().navTo("RouteMain", {}, true);
            }
        },


        getModel: function (sName) {
            return this.getView().getModel(sName);
        },


        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

  
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
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

        onRemoveFromCart: function (oEvent) {
            // Obtener el modelo del carrito
            let oCartModel = this.getOwnerComponent().getModel("cart");
            
            // Obtener la lista actual de productos en el carrito
            let aCartItems = oCartModel.getProperty("/items");
        
            // Obtener el contexto del ítem seleccionado
            let oItem = oEvent.getSource();
            let oCtx = oItem.getBindingContext("cart");
        
            // Obtener el objeto del producto
            let oProductToRemove = oCtx.getObject();

            let aUpdatedCart

            if (oProductToRemove.quantity > 1){
                oProductToRemove.quantity -= 1
                aUpdatedCart = [...aCartItems]

            }else{
                aUpdatedCart = aCartItems.filter(item => item.id !== oProductToRemove.id);
            }
        
            // Filtrar la lista para excluir el producto que se quiere eliminar
            
        
            // Actualizar el modelo con la nueva lista de productos
            oCartModel.setProperty("/items", aUpdatedCart);
            this._updateCartTotal()
            // Mostrar mensaje de confirmación
            sap.m.MessageToast.show(`${oProductToRemove.name} eliminado del carrito`);
        },
        
        onProductPress: function (oEvent) {
            let oItem = oEvent.getSource();
            let oCtx = oItem.getBindingContext("products");
            let oObject = oCtx.getObject()
            this.getOwnerComponent().getRouter().navTo("Detail", {
                productId: oObject.id
            });
        },


        //CAMBIAR
        _updateCartTotal: function () {
            let oCartModel = this.getOwnerComponent().getModel("cart");
            let aCartItems = oCartModel.getProperty("/items");
            let fTotal = aCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            oCartModel.setProperty("/total", fTotal);
        }
    });
});