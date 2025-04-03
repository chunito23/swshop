sap.ui.define([
    "sap/ui/core/UIComponent",
    "eshop/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models,JSONModel) => {
    "use strict";

    return UIComponent.extend("eshop.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
           
            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
            
            let oCartModel = new JSONModel({
                items: [],
                total: 0
            });
            this.setModel(oCartModel, "cart");

        }
    });
});