const cds = require("@sap/cds");

const AdminHandler = require("./util/AdminHandler");
const UtilHandler = require("./util/AdminUtil");
const SmartStreet = require("./util/SmartStreetHandler")
const TINHandler = require("./util/TinHandler")
const ERPHandler = require("./util/ERPHandler")
const AribaHandler = require("./util/AribaHandler")
module.exports = cds.service.impl((srv) => {

  srv.on("DoPullSuppliersFromAriba", AdminHandler.DoPullSuppliersFromAriba);
  srv.on("DoPullSupplierUserFromAriba", AdminHandler.DoPullSupplierUserFromAriba );
  srv.on("DoLoadCategories", AdminHandler.DoLoadCategories);
  srv.on("DoLoadSuppliers", AdminHandler.DoLoadSuppliers);
  srv.on("DoLoadRegions", AdminHandler.DoLoadRegions);
  srv.on("doGetUserInformation", UtilHandler.doGetUserInformation);
  srv.on("doGetSessionTime", UtilHandler.doGetSessionTime);
  srv.on("doSupplierNameCheck",ERPHandler.doSupplierNameCheck)
  srv.on("doSupplierNameCheckAriba",AribaHandler.doSupplierNameCheckAriba)
  srv.on("doSupplierAddressCheck",SmartStreet.doSupplierAddressCheck)
  srv.on("ValidateTIN",TINHandler.ValidateTIN)

  
});
