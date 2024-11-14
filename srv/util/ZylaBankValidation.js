async function doBankValidation(bankRequest) {
    debugger;
    var axios = require('axios');
    var config = {
        method: 'GET',
        url: 'https://zylalabs.com/api/331/routing+number+bank+lookup+api/1353/get+bank+information?number=' + bankRequest.data.bankKey,
        headers: {
            'Authorization': 'Bearer 4435|OD2B3nkhnxzpKTcyn4nYSqfnP1I5YhjdbyUc1OCQ'
        },
    };
    let resp = await axios(config).then(function (response) {
        let returnResponse = {
            "success": response.data.success,
            "message": " Bank Key : " + response.data.message
        };
        return returnResponse;
    })
        .catch(function (error) {
            let returnResponse = {
                "success": fail,
                "message": " Bank Key : " + error
            };
            return returnResponse;
        });

    return resp;

}

module.exports = {
    doBankValidation
};
