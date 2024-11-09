sap.ui.define([
    "jquery.sap.global"
], function (jQuery) {
	"use strict";

    var oFormatter = {};

    oFormatter.formatIconType = function (sType) {
        switch (sType) {
            case "SAP Fieldglass Statement of Work Request":
                return "sap-icon://technical-object";
            case "SAP Ariba Purchase Requisition":
                return "sap-icon://cart";
            default:
                return "sap-icon://action";
        }
    }



    return oFormatter;
});
