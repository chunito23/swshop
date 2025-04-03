sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("eshop.controller.Detail", {
        onInit: function () {
            let oRouter = this.getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            let productId = oEvent.getParameter("arguments").productId;
            let oModel = this.getOwnerComponent().getModel("products");
            let oData = oModel.getData();
            

            //cambiar a seleccionar cuando se toca un boton no cuando entro a la pagina
            let oSelectedProduct = oData.products.find(product => product.id === productId);
            if (oSelectedProduct) {
                oModel.setProperty("/selectedProduct", oSelectedProduct);
            } //selecciono el producto y lo guardo en una propiedad nueva(no se si da problemas)
            console.log("desde detail controlador " + oSelectedProduct.id)
        },

        
    });
});