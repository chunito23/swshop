sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",

], function (Controller, History) {
    "use strict";

    return Controller.extend("eshop.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
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

        /**
         * Convenience method for getting the model by name.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the model in every view of the app.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
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


        //CAMBIAR
        _updateCartTotal: function () {
            let oCartModel = this.getOwnerComponent().getModel("cart");
            let aCartItems = oCartModel.getProperty("/items");
            let fTotal = aCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            oCartModel.setProperty("/total", fTotal);
        }
    });
});