"use strict";

//libraries
const cds = require("@sap/cds");
const cloudSDK = require("@sap-cloud-sdk/core");
const { default: axios } = require("axios");
const { convertXMLtoJSON, generateUniqueRandomNumber, generateUniqueRandomEmail, zeroPad } = require("../helpers/XML2JSON");
const { ValidateTIN } = require("../util/TinHandler");
const { doSupplierAddressCheck } = require("../util/SmartStreetHandler");
const { doBankValidation } = require("../util/ZylaBankValidation");
const logger = require("./logger");
const fuzzball = require('fuzzball');
const Fuse = require('fuse.js');

const options = {
  // Properties that will be searched
  keys: ['SupplierName'],
  // Configuration to include the score and matches in the result
  includeScore: true,
  // Setting the threshold for fuzzy matching; lower means more strict
  threshold: 0.1,
  // Set distance to a low value to reduce the fuzziness range
  distance: 100,
  // Ignore location-based scoring
  ignoreLocation: true,
  // Using a custom function to handle special characters and normalization
  isCaseSensitive: false,
  findAllMatches: true
};

// Function to remove common business suffixes
function cleanSupplierName(name) {
  // Normalize diacritics
  let normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Remove common business suffixes
  return normalized.replace(/\b(Inc|Corp|Corporation|LLC)\b/gi, '').trim();
}
async function doSupplierNameCheckAriba(SupplierName) {
  debugger;


  let SupplierMatch = [];
  let Suppliers = await SELECT.from("com.kyyte.procurement.supplierrequestform.Suppliers");

    // Preprocess suppliers to clean up names
  const processedSuppliers = Suppliers.map(supplier => ({
    ...supplier,
    SupplierName: cleanSupplierName(supplier.SupplierName)
  }));


  const fuse = new Fuse(processedSuppliers, options);
  let SuppliertoCheck = cleanSupplierName(SupplierName.data.SupplierName);

  const results = fuse.search(SuppliertoCheck);

  // if (results.length > 0) {
  //     debugger;
  //     console.log('Match found:', results.map(result => result.item));
  // } else 
  //     debugger;{
  //     console.log('No matches found');
  // }



  if (results.length > 0) {
    results.forEach(result => {
       const matchPercentage = (1 - result.score) * 100;
        SupplierMatch.push({
          SupplierID: result.item.ACMID,
          SupplierName: result.item.SupplierName,
          SupplierStr: result.item.SupplierStreet,
          SupplierCountry: result.item.SupplierCountry,
          MatchScore: matchPercentage // Adding the search score
        });
    });
    console.log('Matches found:', SupplierMatch);
} else {
    console.log('No matches found');
}

  return JSON.stringify(SupplierMatch);

}

async function fuzzyCheck(targetName, Sname) {

  let score = fuzzball.ratio(targetName, Sname);

  // You can set a threshold for matching, e.g., names with a score above 70
  if (score > 50) {
    return { name: Sname, score: score };
  }
  else {
    return { name: Sname, score: score, message: "Not a close match" };
  }

}

async function CreateSupplierUserInAriba(userData) {
  // var {
  //   DefaultCurrency,
  //   EmailAddress,
  //   ExternalOrganizationID,
  //   FullName,
  //   IsEmailInviteNeeded,
  //   LoginID,
  //   Phone,
  //   PreferredLocale,
  // } = userData;

  const generatedSupplierID = generateUniqueRandomEmail(9);

  const payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:Ariba:Sourcing:vrealm_1458">
    <soapenv:Header>
       <urn:Headers>
          <!--You may enter the following 2 items in any order-->
          <!--Optional:-->
          <urn:variant></urn:variant>
          <!--Optional:-->
          <urn:partition></urn:partition>
       </urn:Headers>
    </soapenv:Header>
    <soapenv:Body>
       <urn:UserImportRequest partition="prealm_1458" variant="vrealm_1458">
          <!--Optional:-->
          <urn:User_WSUserImport_Item>
             <!--Zero or more repetitions:-->
             <urn:item>
                <!--You may enter the following 14 items in any order-->
                <urn:BillingAddresses>
                   <!--Zero or more repetitions:-->
                   <urn:item>
                      <!--You may enter the following 4 items in any order-->
                      <!--Optional:-->
                      <urn:Name></urn:Name>
                      <!--Optional:-->
                      <urn:Phone></urn:Phone>
                      <!--Optional:-->
                      <urn:PostalAddress>
                         <!--You may enter the following 5 items in any order-->
                         <!--Optional:-->
                         <urn:City></urn:City>
                         <!--Optional:-->
                         <urn:Country>
                            <!--Optional:-->
                            <urn:UniqueName></urn:UniqueName>
                         </urn:Country>
                         <!--Optional:-->
                         <urn:Lines></urn:Lines>
                         <!--Optional:-->
                         <urn:PostalCode></urn:PostalCode>
                         <!--Optional:-->
                         <urn:State></urn:State>
                      </urn:PostalAddress>
                      <!--Optional:-->
                      <urn:UniqueName></urn:UniqueName>
                   </urn:item>
                </urn:BillingAddresses>
                <!--Optional:-->
                <urn:DefaultCurrency>
                   <!--Optional:-->
                   <urn:UniqueName>USD</urn:UniqueName>
                </urn:DefaultCurrency>
                <urn:EmailAddress>${userData.data.EmailAddress}</urn:EmailAddress>
                <!--Optional:-->
                <urn:Fax></urn:Fax>
                <!--Optional:-->
                <urn:IsEmailInviteNeeded>1</urn:IsEmailInviteNeeded>
                <urn:IsTerminated>0</urn:IsTerminated>
                <!--Optional:-->
                <urn:LocaleID>
                   <!--Optional:-->
                   <urn:UniqueName>en_US</urn:UniqueName>
                </urn:LocaleID>
                <urn:Name>${userData.data.ContactName}</urn:Name>
                <urn:Organization>
                   <!--You may enter the following 2 items in any order-->
                   <urn:SystemID>${userData.data.ACMID}</urn:SystemID>
                   <!--Optional:-->
                </urn:Organization>
                <urn:PasswordAdapter>SourcingSupplierUser</urn:PasswordAdapter>
                <!--Optional:-->
                <urn:Phone>${userData.data.Phone}</urn:Phone>
                <urn:ShipTos>
                   <!--Zero or more repetitions:-->
                   <urn:item>
                      <!--You may enter the following 4 items in any order-->
                      <!--Optional:-->
                      <urn:Name></urn:Name>
                      <!--Optional:-->
                      <urn:Phone></urn:Phone>
                      <!--Optional:-->
                      <urn:PostalAddress>
                         <!--You may enter the following 5 items in any order-->
                         <!--Optional:-->
                         <urn:City></urn:City>
                         <!--Optional:-->
                         <urn:Country>
                            <!--Optional:-->
                            <urn:UniqueName></urn:UniqueName>
                         </urn:Country>
                         <!--Optional:-->
                         <urn:Lines></urn:Lines>
                         <!--Optional:-->
                         <urn:PostalCode></urn:PostalCode>
                         <!--Optional:-->
                         <urn:State></urn:State>
                      </urn:PostalAddress>
                      <!--Optional:-->
                      <urn:UniqueName></urn:UniqueName>
                   </urn:item>
                </urn:ShipTos>
                <!--Optional:-->
                <urn:Supervisor>
                   <!--You may enter the following 2 items in any order-->
                   <!--Optional:-->
                   <urn:PasswordAdapter>SourcingSupplierUser</urn:PasswordAdapter>
                   <urn:UniqueName></urn:UniqueName>
                </urn:Supervisor>
                <urn:UniqueName>${generatedSupplierID}</urn:UniqueName>
             </urn:item>
          </urn:User_WSUserImport_Item>
       </urn:UserImportRequest>
    </soapenv:Body>
 </soapenv:Envelope>`;
  console.log(payload);

  const sUrl = "https://s1.ariba.com/Sourcing/soap/KYYTEDSAPP-T/UserImport";

  const oResult = await axios.post(sUrl, payload, {
    headers: {
      "Content-Type": "application/xml",
    },
    auth: {
      username: "SLPUser",
      password: "KyyteTest123*",
    },
  });

  if (oResult.status == 200) {
    console.log("Supplier User Contact status 200");
    const responseJSON = convertXMLtoJSON(oResult.data);

    if ("soap:Envelope" in responseJSON) {

      const { "soap:Envelope": soapEnvelop } = responseJSON;
      const { "soap:Body": soapBody } = soapEnvelop;
      const { UserImportReply } = soapBody;
      console.log(`Supplier User Contact Body ${responseJSON}`);
      return {
        success: true,
        responseStatus: oResult.status,
        message: UserImportReply?.status._text,
      };
    } else {
      const { "soapenv:Body": soapEnvBody } = responseJSON;
      const { "soapenv:Fault": soapEnvFault } = soapEnvBody;
      const { Faultcode } = soapEnvFault;
      console.log(`Supplier User Contact Body 1 ${responseJSON}`);

      return {
        success: false,
        responseStatus: oResult.status,
        Faultcode: Faultcode._text,
      };
    }
  } else {

    console.log(`Supplier User Contact Body 2 ${responseJSON}`);
    return {
      success: false,
      responseStatus: oResult.status,
      message: oResult.error,
    };
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = {

  CreateSupplierUserInAriba,
  doSupplierNameCheckAriba,
};
