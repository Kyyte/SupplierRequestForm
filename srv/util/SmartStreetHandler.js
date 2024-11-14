// const SmartyStreetsSDK = require("smartystreets-javascript-sdk");
// const SmartyStreetsCore = SmartyStreetsSDK.core;
// const Lookup = SmartyStreetsSDK.usStreet.Lookup;

const SmartySDK = require("smartystreets-javascript-sdk");
const SmartyCore = SmartySDK.core;
const Lookup = SmartySDK.usStreet.Lookup;

async function getStatus(result) {
    debugger;
    console.log(result.lookups[0].result[0].analysis);
    let statustext = '' , fstatustext = 'S';
    let dpvMatchCode = result.lookups[0].result[0].analysis.dpvMatchCode;
    let fnote = result.lookups[0].result[0].analysis.dpvFootnotes;



    // switch(dpvMatchCode)
    // {
    //     case 'N':
    //         statustext = 'Not confirmed; address is not present in the USPS data.';

    //     case 'S':
    //         statustext = 'Confirmed by ignoring secondary info';

    //     case 'D':
    //         statustext = 'Confirmed but missing secondary info; the main address is present in the USPS data';

    //     default:
    //         statustext = 'Not confirmed; address is not present in the USPS data.';


    // }

    switch(fnote)
    {
        case 'AA':
            fstatustext = 'S:Street name, city, state, and ZIP are all valid.';
            break;

        case 'A1':
            fstatustext = 'E:Address not present in USPS database. Please Validate and input again.';
            break;
            
        case 'BB':
            fstatustext = 'S:Address Provided is valid and exist in USPS Database';
            break;

        case 'CC':
            fstatustext = 'E:The submitted secondary information (apartment, suite, etc.) was not recognized. ';
            break;

        case 'C1':
            fstatustext = 'E:The submitted secondary information (apartment, suite, etc.) was not recognized.';
            break;
        
        case 'A1M1':
            fstatustext = 'E:Address not present in USPS data and Primary number (e.g., house number) is missing. ';
            break;
    
        case 'A1M3':
            fstatustext = 'E:Address not present in USPS data and Primary number (e.g., house number) is invalid. ';
            break;

        case 'AAM3':
            fstatustext = 'E:Street name, city, state, and ZIP are all valid. Primary number (e.g., house number) is invalid. ';
            break;
                
        default:
            fstatustext = 'S:Address Provided is valid and exist in USPS Database';
            break;

    }

    if( fstatustext.substring(0,2) == 'S:')
    {
        const postaladdress = [
            {
            // PrimaryNumber: result.lookups[0].result[0].components.primaryNumber,
            StreetName:result.lookups[0].result[0].components.primaryNumber + " " + result.lookups[0].result[0].components.streetName,
            CityName:result.lookups[0].result[0].components.cityName,
            State:result.lookups[0].result[0].components.state,
            ZipCode:result.lookups[0].result[0].components.zipCode + "-"+ result.lookups[0].result[0].components.plus4Code,
            CountyName: result.lookups[0].result[0].metadata.countyName
            }
        ]

        fstatustext = JSON.stringify(postaladdress);
    
    }

   return fstatustext;

}

async function doSupplierAddressCheck(SupplierAddress) {

debugger;

// // Your SmartyStreets credentials
// let authId = '2dde3493-b929-633c-764c-191391640500';
// let authToken = 'ox34cToxkm07D7FDIbMo';

// // Configure the client
// let clientBuilder = new SmartyStreetsCore.ClientBuilder(new SmartyStreetsCore.StaticCredentials(authId, authToken));
// let client = clientBuilder.buildUsStreetApiClient();

// // Input your address
let lookup = new Lookup();
lookup.street = SupplierAddress.data.Street;
lookup.city = SupplierAddress.data.City;
lookup.state = SupplierAddress.data.State;
lookup.zipCode = SupplierAddress.data.zipCode;
lookup.maxCandidates = 3;
lookup.match = "invalid"; // "invalid" is the most permissive match,


// // Send the request and handle the response
// client.send(lookup)
//     .then(handleSuccess)
//     .catch(handleError);

// function handleSuccess(response) {
//     debugger;
//     response.lookups.forEach(lookup => {
//         console.log(lookup.result);
//     });
// }

// function handleError(error) {
//     console.log(error);
// }


// for Server-to-server requests, use this code:
let authId = '2dde3493-b929-633c-764c-191391640500';
let authToken = 'ox34cToxkm07D7FDIbMo';
const credentials = new SmartyCore.StaticCredentials(authId, authToken);

// for client-side requests (browser/mobile), use this code:
// let key = process.env.SMARTY_EMBEDDED_KEY;
// const credentials = new SmartyCore.SharedCredentials(key);

// The appropriate license values to be used for your subscriptions
// can be found on the Subscription page of the account dashboard.
// https://www.smarty.com/docs/cloud/licensing
let clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses(["us-core-cloud"]);
let client = clientBuilder.buildUsStreetApiClient();

// Documentation for input fields can be found at:
// https://www.smarty.com/docs/us-street-api#input-fields

// let lookup1 = new Lookup();
// // lookup1.inputId = "24601";  // Optional ID from your system
// // lookup1.addressee = "John Doe";
// lookup1.street = "3102 Briar Park Dr";
// // lookup1.street2 = "closet under the stairs";
// // lookup1.secondary = "APT 2";
// // lookup1.urbanization = "";  // Only applies to Puerto Rico addresses
// lookup1.city = "GeorgeTown";
// lookup1.state = "Texas";
// lookup1.zipCode = "78626";
// lookup1.maxCandidates = 3;
// lookup1.match = "invalid"; // "invalid" is the most permissive match,

// this will always return at least one result even if the address is invalid.
// Refer to the documentation for additional MatchStrategy options.

// let lookup2 = new Lookup();
// lookup2.street = "1600 Amphitheater Pkwy";
// lookup2.lastLine = "Mountainview, CA";
// lookup2.maxCandidates = 5;

// let lookup3 = new Lookup();
// lookup3.inputId = "8675309";
// lookup3.street = "1600 Amphitheatre Parkway Mountain View, CA 94043";
// lookup3.maxCandidates = 1;

// NOTE: batches are not supported when using SharedCredentials.
let batch = new SmartyCore.Batch();
batch.add(lookup);

let addrresponse = await handleResponse(batch);
return addrresponse;

async function handleSuccess(response) {
	// let resp = await response.lookups.map(lookup => getStatus(lookup.result));
    let addrstatus = await getStatus(response)
    debugger;
    console.log(addrstatus);
    return addrstatus;

}

function handleError(response) {
	console.log(response);
}

async function handleResponse(lookup) {
	try {
		const result = await client.send(lookup);
		let resp = await handleSuccess(result);
        return resp;
	} catch(err) {
		handleError(err);
	}
}



}

module.exports = {
    doSupplierAddressCheck
  };
  