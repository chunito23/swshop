sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("eshop.controller.Main", {
        onInit: function () {
            this.getView().setModel(this.getOwnerComponent().getModel("categories"), "categories");
            this.getView().setModel(this.getOwnerComponent().getModel("products"), "products");
        },

        

        onAddToCartMain: function (oEvent) {
            // Obtener el contexto del producto clickeado
            //despues cambiar la funcion de agregar desde el detail
            let oItem = oEvent.getSource().getBindingContext("products").getObject();
            let oModel = this.getOwnerComponent().getModel("products");
            oModel.setProperty("/selectedProduct", oItem);
            this.onAddToCart()
            sap.m.MessageToast.show(`${oItem.name} añadido al carrito`);
        },

        onBuyNow: function (oEvent) {
            let oItem = oEvent.getSource().getBindingContext("products").getObject();
            MessageToast.show(`Comprando ${oItem.name}`);
        }
    });
});