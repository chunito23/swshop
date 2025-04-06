sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("eshop.controller.App", {
        onInit() {
            let oHboxMenu = this.byId("HboxMenus");
            let oDataCategories = this.getOwnerComponent().getModel("categories").getData();
            this._createMenu(oHboxMenu, oDataCategories);
        },

        onMenuPress: async function(oEvent) {
            const oButton = oEvent.getSource();
            const oCtx = oButton.getBindingContext("categories");
            const aSubCats = oCtx.getProperty("subCategories");

            // Cargar el fragmento
            const oView = this.getView();

            let oMenu = await Fragment.load({
                id: oView.getId(), // importante para el lifecycle
                name: "eshop.view.fragment.SubCategoryMenu",
                controller: this
            });

            // Limpiar items viejos si el fragment ya fue creado antes
            oMenu.destroyItems();

            // Agregar subcategorías
            aSubCats.forEach((subcat) => {
                oMenu.addItem(new MenuItem({
                    text: subcat,
                    press: () => {
                        sap.m.MessageToast.show("Subcategoría: " + subcat);
                        // Podés hacer routing o filtrar productos acá
                    }
                }));
            });

            oMenu.openBy(oButton);
        },

        _createMenu: function (oHboxMenu, oDataCategories) {
            let oRouter = this.getRouter(); // Guarda la referencia del router
            oDataCategories.categories.forEach(category => {
                let aSubCategoryItems = category.subCategories.map(subCategory => {
                    return new sap.m.MenuItem({
                        text: subCategory,
                        press: function () {
                            oRouter.navTo("SubCategory", { subId: subCategory });
                        }
                    });
                });

                let oMenu = new sap.m.Menu({ items: aSubCategoryItems });
                let oMenuButton = new sap.m.MenuButton({ text: category.name, menu: oMenu });
                oHboxMenu.addItem(oMenuButton);
            });
        },
    

      onOpenPanel: function (oEvent) {
            let oCartModel = this.getOwnerComponent().getModel("cart");
            let aCartItems = oCartModel.getProperty("/items");

            if (!aCartItems || aCartItems.length === 0) {
                MessageToast.show("El carrito está vacío.");
                return;
            }

            let oPopover = this.byId("cartPopover");
            oPopover.openBy(oEvent.getSource());
        },

        goHome: function(){
            let oRouter = this.getRouter()
            oRouter.navTo("RouteMain")
        },

        onCheckout: function () {
            MessageToast.show("Compra Finalizada");
        }
    });
});
