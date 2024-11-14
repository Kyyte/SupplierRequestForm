"use strict";

//libraries
const cds = require("@sap/cds");
const { default: axios } = require("axios");
const { convertXMLtoJSON , generateUniqueRandomNumber, zeroPad } = require("../helpers/XML2JSON");
const logger = require("./logger");


async function ValidateTIN(TINData) {

  let Payload;

  let TINID = TINData.data.TINID;
  let TINName = TINData.data.TINName;
  let CheckType = TINData.data.CheckType;

  if ( CheckType == 'TIN')
  {

    Payload = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:pvs="http://www.TinCheck.com/WebServices/PVSService/">
  <soap:Header/>
  <soap:Body>
     <pvs:ValidateTinName>
        <pvs:TinName>
           <!--Optional:-->
           <pvs:TIN>${TINID}</pvs:TIN>
           <!--Optional:-->
           <pvs:LName>${TINName}</pvs:LName>
           <!--Optional:-->
           <pvs:FName></pvs:FName>
           <!--Optional:-->
           <pvs:Encryption></pvs:Encryption>
           <!--Optional:-->
           <pvs:Giin></pvs:Giin>
        </pvs:TinName>
        <!--Optional:-->
        <pvs:CurUser>
           <!--Optional:-->
           <pvs:UserID></pvs:UserID>
           <!--Optional:-->
           <pvs:UserLogin>sukumari.rameshbabu@kyyte.io</pvs:UserLogin>
           <!--Optional:-->
           <pvs:UserPassword>Onekyyte123$</pvs:UserPassword>
           <!--Optional:-->
           <pvs:UserEncryption></pvs:UserEncryption>
        </pvs:CurUser>
     </pvs:ValidateTinName>
  </soap:Body>
</soap:Envelope>`;
  }
  else if (CheckType == 'OFAC')
  {
    Payload = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pvs="http://www.TinCheck.com/WebServices/PVSService/">
    <soapenv:Header/>
    <soapenv:Body>
       <pvs:ValidateListMatch>
          <!--Optional:-->
          <pvs:TinName>
             <!--Optional:-->
             <pvs:TIN></pvs:TIN>
             <!--Optional:-->
             <pvs:LName>${TINName}</pvs:LName>
             <!--Optional:-->
             <pvs:FName></pvs:FName>
             <!--Optional:-->
             <pvs:Encryption></pvs:Encryption>
             <!--Optional:-->
             <pvs:Giin></pvs:Giin>
          </pvs:TinName>
          <!--Optional:-->
          <pvs:CurUser>
             <!--Optional:-->
             <pvs:UserID></pvs:UserID>
             <!--Optional:-->
             <pvs:UserLogin>sukumari.rameshbabu@kyyte.io</pvs:UserLogin>
             <!--Optional:-->
             <pvs:UserPassword>Onekyyte123$</pvs:UserPassword>
             <!--Optional:-->
             <pvs:UserEncryption></pvs:UserEncryption>
          </pvs:CurUser>
       </pvs:ValidateListMatch>
    </soapenv:Body>
 </soapenv:Envelope>`;

  }

  const sUrl = "https://www.tincheck.com/pvsws/pvsservice.asmx";

  const oResult = await axios.post(sUrl, Payload, {
    headers: {
      "Content-Type": "application/xml",
    },
    auth: {
      username: "sukumari.rameshbabu@kyyte.io",
      password: "Onekyyte123$",
    },
  });

  if (oResult.status == 200) {

    let response_text;
    let response_code;
    
    const responseJSON = convertXMLtoJSON(oResult.data);

    if ("soap:Envelope" in responseJSON) {
      const { "soap:Envelope": soapEnvelop } = responseJSON;
      const { "soap:Body": soapBody } = soapEnvelop;
      const { UserImportReply } = soapBody;

      if (CheckType == 'OFAC')
      {
        response_text = soapBody.ValidateListMatchResponse.ValidateListMatchResult.LISTSMATCH_DETAILS._text;
        response_code = soapBody.ValidateListMatchResponse.ValidateListMatchResult.LISTSMATCH_CODE._text;
  
      }
      else if ( CheckType == 'TIN')
      {

        response_text = soapBody.ValidateTinNameResponse.ValidateTinNameResult.TINNAME_DETAILS._text;
        response_code = soapBody.ValidateTinNameResponse.ValidateTinNameResult.TINNAME_CODE._text;
      }
      else if ( CheckType == 'EIN')
      {
        response_text = soapBody.ValidateTinNameResponse.ValidateTinNameResult.EIN_DETAILS._text;
        response_code = soapBody.ValidateTinNameResponse.ValidateTinNameResult.EIN_CODE._text;
      }

      return {
        success: true,
        responseStatus: response_code,
        message: response_text,
      };
    } else {
      const { "soapenv:Body": soapEnvBody } = responseJSON;
      const { "soapenv:Fault": soapEnvFault } = soapEnvBody;
      // const { Faultcode } = soapEnvFault;

      return {
        success: true,
        responseStatus: oResult.status,
        Faultcode: Faultcode._text,
      };
    }
  } else {
        return {
      success: false,
      responseStatus: oResult.status,
      message: oResult.error,
    };
  }
}

module.exports = {
  ValidateTIN
};
