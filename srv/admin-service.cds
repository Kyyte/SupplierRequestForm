using {com.kyyte.procurement.supplierrequestform as my} from '../db/masterdata';
using {
    managed,
    sap,
} from '@sap/cds/common';

service AdminService @(path: '/supplier') {
    entity Categories                 as projection on my.Categories;
    entity Suppliers                  as projection on my.Suppliers;
    entity Regions                    as projection on my.Regions;
    entity SupplierOrganization2Users as projection on my.SupplierOrganization2Users;
    action DoLoadCategories(entities : array of Categories)                           returns String;
    action DoLoadSuppliers(entities : array of Suppliers)                             returns String;
    action DoLoadRegions(entities : array of Regions)                                 returns String;    
    action DoPullSupplierUserFromAriba(realm : String)                                returns String;
    action DoPullSuppliersFromAriba(realm : String)                                   returns String;
    action   doGetUserInformation(type : String)                                                        returns String;
    action   doSupplierNameCheck(SupplierName : String)                                                 returns String;
    action   doSupplierNameCheckAriba(SupplierName:String)                                              returns String;
    action   doSupplierAddressCheck(Street:String,City:String, State: String, zipCode:String)           returns String;
    action   ValidateTIN(TINID:String,TINName:String,CheckType:String)                                  returns String;
    function doGetSessionTime()                                                                         returns String;

}
