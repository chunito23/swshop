sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict"

    return BaseController.extend("eshop.controller.SubCategory", {
        onInit: function () {
            let oRouter = this.getRouter();
            oRouter.getRoute("SubCategory").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            console.log("entre")
            let subId = oEvent.getParameter("arguments").subId;
            let oModel = this.getOwnerComponent().getModel("products");
            let oData = oModel.getData();
        
            // Filtrar productos por subId
            let aFilteredProducts = oData.products.reduce((acc, product) => {
                if (product.subcategoryId === subId) {
                    acc.push(product);
                }
                return acc;
            }, []);
        
            console.log("Productos filtrados:", aFilteredProducts);
        
            // Asignar el modelo con los productos filtrados
            let oFilteredModel = new sap.ui.model.json.JSONModel({ products: aFilteredProducts });
            this.getView().setModel(oFilteredModel, "filteredProducts");
        },

        onProductPress: function (oEvent) {
            let oItem = oEvent.getSource();
            let oCtx = oItem.getBindingContext("filteredProducts"); // IMPORTANTE: Usa el modelo correcto
            let oObject = oCtx.getObject();
        
            this.getRouter().navTo("Detail", {
                productId: oObject.id
            });
        }
        
    })
})