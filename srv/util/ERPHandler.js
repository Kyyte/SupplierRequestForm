"use strict";

//libraries
const cds = require("@sap/cds");
const cloudSDK = require("@sap-cloud-sdk/core");
const { default: axios } = require("axios");

async function executeRequest(destination, httpRequest) {
  try {
    const response = await axios({
      method: httpRequest.method,
      url: httpRequest.url,
      headers: { ...httpRequest.headers},
      // Add any additional Axios configurations if needed
    });
    return response.data;
  } catch (error) {
    console.error('Error executing request:', error);
    throw error;
  }
}

async function buildODataRequest(destination, resourcePath, filter) {
  // Construct the URL for the OData service
  const url = `${destination.url}${resourcePath}?$filter=${encodeURIComponent(filter)}`;

  // Build the HTTP request
  return cloudSDK.buildHttpRequest({ method: 'GET', url });
}

async function fetchDestination(destinationName) {
  try {
    const destination = await cloudSDK.getDestination(destinationName);
    if (!destination) {
      throw new Error(`Destination ${destinationName} not found.`);
    }
    return destination;
  } catch (error) {
    console.error('Error fetching destination:', error);
    throw error;
  }
}


async function doSupplierNameCheck(req) {
  try {
    debugger;
    let oData = req.data;


    let sDestination = "TwoTierPOC-OData-HE4";
    let oDestination = await cloudSDK.getDestination(sDestination);
    let oRequestConfig = await cloudSDK.buildHttpRequest(oDestination);


    oRequestConfig.method = "GET";
    // oRequestConfig.url = `/sap/opu/odata/SAP/ZBPDUPLICATES_SRV_01/LFA1Set`;

    // oRequestConfig.headers["Content-Type"] = "application/json";
    let ODataName = 'ZBPDUPLICATES_SRV_01';
    let ODataResourcePath = 'LFA1Set';
    let ODtaQueryOptions = '$top=2';
    let destinationurl = `/sap/opu/odata/SAP/ZBPDUPLICATES_SRV_01/LFA1Set`;

    // const destinationName = 'TwoTierPOC-OData-HE4'; // Replace with your destination name
    const resourcePath = '/sap/opu/odata/SAP/ZBPDUPLICATES_SRV_01/LFA1Set'; // Replace with your resource path
    const filter = '$top=2'; // Replace with your filter query
    oRequestConfig.url = `${destinationurl}?$filter=${encodeURIComponent(filter)}`;
    // console.log("calling fetch destination");
    // const destination = await fetchDestination(destinationName);
    // console.log("calling build request");
    // const httpRequest = await buildODataRequest(destination, resourcePath, filter);
    // console.log("calling execute request");
    // const result = await executeRequest(destination, httpRequest);

    console.log(`GR Request URL:${oRequestConfig.url} `);
    let response = await axios
      .request(oRequestConfig)

      .catch(function (oError) {
        console.error(
          "There was an error when calling the API. Error was: " +
            oError.message
        );
       
        throw Error("There was an error when calling the API");
      });

    //console.log(response.data);

    // return response.data.value;

    return JSON.stringify(response.data.value);
  } catch (error) {
    console.error("Error:", error.message);
   
  }
}


module.exports = {
  doSupplierNameCheck
  
};
