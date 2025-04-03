sap.ui.define([
  "./BaseController",
  "sap/m/MessageToast",
  "sap/m/List",
  "sap/m/StandardListItem",
  "sap/m/ScrollContainer",
  "sap/m/Button",
  "sap/m/Popover",
  "sap/m/library",
  "sap/m/HBox",
  "sap/m/Image",
  "sap/m/Text"
], function (BaseController, MessageToast, List, StandardListItem, ScrollContainer, Button, Popover, mLibrary, HBox, Image, Text) {
  "use strict";

  return BaseController.extend("eshop.controller.App", {
    onInit() {
      let oHboxMenu = this.byId("HboxMenus");
      let oDataCategories = this.getOwnerComponent().getModel("categories").getData();
      let oDataSubCategories = this.getOwnerComponent().getModel("subCategories").getData();
      let oDataProducts = this.getOwnerComponent().getModel("products").getData();

      this._createMenu(oHboxMenu, oDataCategories, oDataSubCategories);
    },

    _createMenu: function (oHboxMenu, oDataCategories) {
      oDataCategories.categories.forEach(category => {
        let aSubCategoryItems = category.subCategories.map(subCategory => {
          return new sap.m.MenuItem({
            text: subCategory,
            press: function () {
              sap.m.MessageToast.show("Seleccionaste: " + subCategory);
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

      let oList = new List("cartList", {
        items: aCartItems.map(item => new StandardListItem({
          title: item.name,
          info: item.price + " USD",
          icon: item.image
        }))
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

      if (!this._oPopover) {
        this._oPopover = new Popover({
          placement: mLibrary.PlacementType.Left,
          showHeader: true,
          title: "Carrito de Compras",
          contentWidth: "300px",
          content: [oScrollContainer, oCheckoutButton]
        });
      } else {
        this._oPopover.removeAllContent();
        this._oPopover.addContent(oScrollContainer);
        this._oPopover.addContent(oCheckoutButton);
      }

      this._oPopover.openBy(oEvent.getSource());
    }
  });
});
