using {
    managed,
    sap,
    cuid
} from '@sap/cds/common';

namespace com.kyyte.procurement.supplierrequestform;

entity Categories : managed {
    key CategoryID           : String;
        CategoryDesc         : String;
}

entity Suppliers : managed {
    key ACMID                   : String;
        SupplierID              : String;
        SLPID                   : String;
        SupplierName            : String;
        SupplierStreet          : String;
        SupplierCity            : String;
        SupplierRegion          : String;
        SupplierPostalCode      : String;
        SupplierCountry         : String;
        PrimaryContactFirstName : String;
        PrimaryContactLastName  : String;
        PrimaryContactEMail     : String;
        Active                  : String;
}


entity Regions : managed {
    key RegionID           : String;
        RegionName         : String;
        ParentRegion       : String;
}

entity SiteControlParams : cuid {
    DataLakeEnabled      : Boolean;
    NDASupplierRequest   : Boolean;
    AribaRealm           : String;
    BusinessSystem       : String;
    SourcingApplication  : String;
    DuplicateERP         : String;
    DuplicateSLP         : String;
    SupplierSyncedAt     : Integer64;
    SupplierUserSyncedAt : Integer64;
    Supervisor           : String;
    DueDiligence         : String;    
}

entity SupplierOrganization2Users : managed {
    key ExternalOrganizationID       : String;
    key LoginID                      : String;
        OrganizationName             : String;
        IsManaged                    : String;
        IsSupplier                   : String;
        OrganizationTaxID            : String;
        OrganizationStateTIN         : String;
        OrganizationRegionalTIN      : String;
        IsCustomer                   : String;
        OrganizationVatID            : String;
        ExternalParentOrganizationID : String;
        IsOrgApproved                : String;
        CorporatePhone               : String;
        CorporateFax                 : String;
        CorporateEmailAddress        : String;
        CompanyURL                   : String;
        Address                      : String;
        City                         : String;
        State                        : String;
        ZipCode                      : String;
        Country                      : String;
        OrganizationType             : String;
        AddressName                  : String;
        FullName                     : String;
        EmailAddress                 : String;
        Phone                        : String;
        IsUserApproved               : String;
        DefaultCurrency              : String;
        TimeZoneID                   : String;
        PreferredLocale              : String;
        IsEmailInviteNeeded          : String;
}
