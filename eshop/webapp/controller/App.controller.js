sap.ui.define([
  "./BaseController",
  "sap/m/MessageToast"
], function (BaseController, MessageToast) {
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
      let aCartItems = oCartModel.getProperty("/items"); // 🔹 Obtiene los productos del carrito
      let total = oCartModel.getProperty("/total");
  
      // Verifica si el carrito está vacío
      if (!aCartItems || aCartItems.length === 0) {
          MessageToast.show("El carrito está vacío.");
          return;
      }
  
      // 🔹 Crea una lista de productos
      let oList = new sap.m.List({
          items: {
              path: "/items",
              template: new sap.m.StandardListItem({
                  title: "{name}",
                  description: "{price} {currency}",
                  icon: "{image}",
                  info: "{= ${quantity} + 'x'}",
                  type: "Inactive"
              })
          }
      });
  
      // 🔹 Asigna el modelo al List
      oList.setModel(oCartModel);
  
      // 🔹 Crea el ScrollContainer con la lista dentro
      let oScrollContainer = new sap.m.ScrollContainer({
          width: "100%",
          height: "300px",
          vertical: true,
          content: [oList]
      });
  
      // 🔹 Botón de Checkout
      let oCheckoutButton = new sap.m.Button({
          text: "Finalizar Compra",
          type: "Emphasized",
          press: function () {
              MessageToast.show("Compra Finalizada");
          }
      });

      let totalText = new sap.m.Text({
        text: "total" + total
      })

  
      // 🔹 Verifica si ya existe el Popover
      if (!this._oPopover) {
          this._oPopover = new sap.m.Popover({
              placement: sap.m.PlacementType.Left,
              showHeader: true,
              title: "Carrito de Compras",
              contentWidth: "300px",
              content: [oScrollContainer, totalText, oCheckoutButton]
          });
      } else {
          this._oPopover.removeAllContent();
          this._oPopover.addContent(oScrollContainer);
          this._oPopover.addContent(totalText);
          this._oPopover.addContent(oCheckoutButton); 
      }
  
      // 🔹 Abre el Popover en el botón presionado
      this._oPopover.openBy(oEvent.getSource());
  }
  
  });
});
