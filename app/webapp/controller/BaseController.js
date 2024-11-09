"use strict";

/* global history */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kyyte/procurement/supplierrequestform/util/Formatter",
    "com/kyyte/procurement/supplierrequestform/util/Confetti"
], function (Controller, Formatter, Confetti) {
    return Controller.extend("com.kyyte.procurement.supplierrequestform.controller.BaseController", {


        formatter: Formatter,
        confetti: Confetti,


        /**
         * Convenience method for accessing the router in every controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the view model responsible for view parameters for every controller of the application.
         * @public
         * @returns {sap.ui.model.Model} the model instance
         */
        getViewModel: function () {
            return this.getModel(this.viewModelName);
        },

        /**
         * Convenience method for setting the view model responsible for view parameters in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @returns {sap.ui.mvc.View} the view instance
         */
        setViewModel: function (oModel) {
            return this.setModel(oModel, this.viewModelName);
        },

        /**
         * Convenience method for getting the main view model for every controller of the application.
         * @public
         * @returns {sap.ui.model.Model} the model instance
         */
        getMainModel: function () {
            return this.getModel(this.mainModelName);
        },

        /**
         * Convenience method for setting the main view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @returns {sap.ui.mvc.View} the view instance
         */
        setMainModel: function (oModel) {
            return this.setModel(oModel, this.mainModelName);
        },

        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        navBack: function () {
            window.history.back();
        },

        onHomeIconPressed : function (){
            this.getRouter().navTo("Home");
        },

        triggerConfetti: function () {
            var config = {
                particleCount: 250,
                spread: 60,
                angle: 135,
                origin: {
                    y: 1
                }
            };

            var config2 = Object.assign({}, config, {angle: 45});
            var config3 = Object.assign({}, config, {angle: 90});
            setTimeout(this.confetti.confetti, 0, config);
            setTimeout(this.confetti.confetti, 200, config2);
            setTimeout(this.confetti.confetti, 400, config3);
        }

    });
});