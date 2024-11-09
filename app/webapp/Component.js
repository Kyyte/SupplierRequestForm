sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/kyyte/procurement/supplierrequestform/model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("com.kyyte.procurement.supplierrequestform.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () { 
 
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
            this.setModel(models.createDeviceModel(), "device");
            this._initConversationalAI();
           
        },

        _initConversationalAI: function () {
            // window.sapdas = window.sapdas || {};
            // window.sapdas.webclientBridge = window.sapdas.webclientBridge || {};

            // window.sapdas.webclientBridge = {
            //     getBotPreferences: () => ({
            //         headerTitle: 'SAP Digital Assistant',
            //         userInputPlaceholder: 'How can I help you?',
            //     }),
            //     onMessage: (payload, botName) => {
            //         const { messages } = payload;
            //         window.com.kyyte.procurement.supplierrequestform.home.Overview.prototype.handleJouleResponse(messages[messages.length - 1]);
            //         sap.cai.webclient.hide();
            //     }
            // };

            var cai_props = {
                url: 'https://cdn.cai.tools.sap/webclient/bootstrap.js',
                channelId: '25b56f3e-66ea-44da-824e-1201b8f0db3c',
                token: '8cd310a8c87ad34f97cfbb8083966baa'
            };

            var wc_script = document.createElement('script');
            wc_script.setAttribute('src', cai_props.url);
            wc_script.setAttribute('data-channel-id', cai_props.channelId);
            wc_script.setAttribute('data-token', cai_props.token);
            wc_script.setAttribute('data-expander-type', 'CAI');
            wc_script.setAttribute('data-expander-preferences', 'JTdCJTIyZXhwYW5kZXJMb2dvJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZjZG4uY2FpLnRvb2xzLnNhcCUyRndlYmNoYXQlMkZ3ZWJjaGF0LWxvZ28uc3ZnJTIyJTJDJTIyZXhwYW5kZXJUaXRsZSUyMiUzQSUyMkNsaWNrJTIwb24lMjBtZSElMjIlMkMlMjJvbmJvYXJkaW5nTWVzc2FnZSUyMiUzQSUyMkNoYXQlMjB3aXRoJTIwbWUhJTIyJTJDJTIyb3BlbmluZ1R5cGUlMjIlM0ElMjJuZXZlciUyMiUyQyUyMnRoZW1lJTIyJTNBJTIyREVGQVVMVCUyMiU3RA==');

            // wc_script.onload = () => {
            //     console.log("Conversational AI Web Client script loaded.");
            //     if (window.sap && window.sap.cai) {
            //         sap.cai.webclient.setTheme('sap_horizon');
            //         console.log("Conversational AI Web Client initialized.");
            //     } else {
            //         console.error("Conversational AI Web Client not initialized.");
            //     }
            // };

            document.head.appendChild(wc_script);

            // wc_script.onload = function () {
            //     // Once loaded, initialize the chatbot with the custom logo
            //     window.SAPConversationalAI.init({
            //         selector: '#cai-webclient-builtin-button',  // Replace with your chatbot container's ID
            //         channelId: cai_props.channelId,
            //         token: cai_props.token,
            //         // Custom properties, including the path to your custom logo
            //         logoUrl: './img/logo.jpg',  // Ensure the path is accessible
            //     });
            // };

        }
    });
});
