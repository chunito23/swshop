sap.ui.define([
  "./BaseController",
  "sap/m/MessageToast",
  "sap/m/List",
  "sap/m/StandardListItem",
  "sap/m/ScrollContainer",
  "sap/m/Button",
  "sap/m/Popover",
  "sap/m/library"
], function (BaseController, MessageToast, List, StandardListItem, ScrollContainer, Button, Popover, mLibrary) {
  "use strict";

  return BaseController.extend("eshop.controller.App", {
    onInit() {
      let oHboxMenu = this.byId("HboxMenus")
      let oDataCategories = this.getOwnerComponent().getModel("categories").getData();
      let oDataSubCategories = this.getOwnerComponent().getModel("subCategories").getData();
      let oDataProducts = this.getOwnerComponent().getModel("products").getData();

      this._createMenu(oHboxMenu,oDataCategories,oDataSubCategories)
    },

    _createMenu: function (oHboxMenu, oDataCategories) {
      oDataCategories.categories.forEach(category => {
        // Crear los items de subcategorías
        let aSubCategoryItems = category.subCategories.map(subCategory => {
          return new sap.m.MenuItem({
            text: subCategory,
            press: function () {
              sap.m.MessageToast.show("Seleccionaste: " + subCategory);
            }
          });
        });
    
        // Crear el menú y agregar los items de subcategoría
        let oMenu = new sap.m.Menu({
          items: aSubCategoryItems
        });
    
        // Crear el botón con menú desplegable
        let oMenuButton = new sap.m.MenuButton({
          text: category.name,
          menu: oMenu
        });
    
        // Agregar botón al HBox
        oHboxMenu.addItem(oMenuButton);
      });
    },

    onOpenPanel: function (oEvent) {
      if (!this._oPopover) {
        let oList = new List("cartList", {
          items: [
            new StandardListItem({ title: "Producto 1", info: "20 USD" }),
            new StandardListItem({ title: "Producto 2", info: "15 USD" }),
            new StandardListItem({ title: "Producto 3", info: "30 USD" })
          ]
        });

        let oScrollContainer = new ScrollContainer("scrollCart", {
          width: "100%",
          height: "300px",
          vertical: true,
          content: [oList]
        });

        let oCheckoutButton = new Button({
          text: "Finalizar Compra",
          type: "Emphasized",
          press: function () {
            MessageToast.show("Compra Finalizada");
          }
        });

        this._oPopover = new Popover({
          placement: mLibrary.PlacementType.Left,
          showHeader: true,
          title: "Carrito de Compras",
          contentWidth: "300px",
          content: [oScrollContainer, oCheckoutButton]
        });
      }

      this._oPopover.openBy(oEvent.getSource());
    }
  });
});
