sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("eshop.controller.Main", {
        onInit: function () {
            this._loadProducts();
        },

        _loadProducts: function () {
            const oPage = this.byId("page");
            const oCategories = this.getOwnerComponent().getModel("categories").getData().categories;
            const oProducts = this.getOwnerComponent().getModel("products").getData().products;

            oCategories.forEach(category => {
                this._createCategorySection(oPage, category, oProducts);
            });
        },

        _createCategorySection: function (oPage, category, products) {
            const oCategoryTitle = new sap.m.Title({
                text: category.name,
                level: "H2"
            }).addStyleClass("categoryTitle");

            const oFilteredProducts = products.filter(product => category.subCategories.includes(product.subcategoryId));
            const oPages = this._splitIntoPages(oFilteredProducts, 5);

            const oCarousel = new sap.m.Carousel({
                height: "450px",
                pages: oPages
            }).addStyleClass("categoryCarousel");

            oPage.addContent(oCategoryTitle);
            oPage.addContent(oCarousel);
        },

        _splitIntoPages: function (products, pageSize) {
            return products.reduce((pages, _, i) => {
                if (i % pageSize === 0) {
                    pages.push(new sap.m.HBox({
                        wrap: "Wrap",
                        items: products.slice(i, i + pageSize).map(this._createProductCard.bind(this))
                    }));
                }
                return pages;
            }, []);
        },

        _createProductCard: function (product) {
            return new sap.m.VBox({
                width: "250px",
                items: [
                    new sap.m.Image({
                        src: product.image,
                        width: "100%",
                        height: "150px",
                        decorative: false
                    }),
                    new sap.m.Text({
                        text: product.name,
                        wrapping: true
                    }).addStyleClass("productName"),
                    new sap.m.ObjectNumber({
                        number: product.price.toFixed(2),
                        unit: product.currency,
                        state: "Success"
                    }),
                    new sap.m.Text({
                        text: product.description,
                        wrapping: true
                    }).addStyleClass("productDescription"),
                    new sap.m.ObjectStatus({
                        text: product.stock > 0 ? `Stock: ${product.stock}` : "Agotado",
                        state: product.stock > 0 ? "Success" : "Error"
                    }),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                text: "Añadir al carrito",
                                press: () => this._addToCart(product)
                            }),
                            new sap.m.Button({
                                text: "Comprar ahora",
                                press: () => this._buyNow(product)
                            })
                        ]
                    })
                ]
            }).addStyleClass("productCard").addStyleClass("productCard").addEventDelegate({
                onclick: () => {
                    this.getOwnerComponent().getRouter().navTo("Detail", { productId: product.id });
                }
            });;
        },

        _addToCart: function (product) {
            sap.m.MessageToast.show(`${product.name} añadido al carrito`);
        },

        _buyNow: function (product) {
            sap.m.MessageToast.show(`Comprando ${product.name}`);
        }
    });
});
