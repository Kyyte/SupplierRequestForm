sap.ui.define([
    "com/kyyte/procurement/supplierrequestform/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/suite/ui/commons/MicroProcessFlow",
    "sap/suite/ui/commons/MicroProcessFlowItem",
     "sap/ui/core/library"
], function (Controller, JSONModel, MessageBox, MessageToast, Fragment, syncStyleClass, Filter, FilterOperator,MicroProcessFlow, MicroProcessFlowItem,coreLibrary) {
    "use strict";

    return Controller.extend("com.kyyte.procurement.supplierrequestform.home.Overview", {
        onInit: function () {
         
            var oMainModel = new JSONModel({
                SelectedCategory: "" ,// Keeps it unselected initially
            });
            this.getView().setModel(oMainModel);
        
            this._wizard = this.byId("createTicketWizard");
            this._oNavContainer = this.byId("navContainer");
            this._oDynamicPage = this.getPage();
            
            // Load categories model
            var oCategoryModel = new JSONModel();
            oCategoryModel.loadData("mock/category.json", null, false);
            this.getView().setModel(oCategoryModel, "categories");


            var oContractTypeModel = new JSONModel();
            oContractTypeModel.loadData("mock/contracttype.json");
            this.getView().setModel(oContractTypeModel, "contractTypes");

            var oStateModel = new JSONModel();
            oStateModel.loadData("mock/state.json");
            this.getView().setModel(oStateModel, "states");

            var oImpactModel = new JSONModel();
            oImpactModel.loadData("mock/impact.json");
            this.getView().setModel(oImpactModel, "impactLevels");

            var oUrgencyModel = new JSONModel();
            oUrgencyModel.loadData("mock/urgency.json");
            this.getView().setModel(oUrgencyModel, "urgencyLevels");

            var oUserModel = new JSONModel();
            oUserModel.loadData("mock/User.json");
            this.getView().setModel(oUserModel, "users");

            var oServiceModel = new JSONModel();
            oServiceModel.loadData("mock/service.json");
            this.getView().setModel(oServiceModel, "services");
        },

        handleWizardCancel: function () {
            this._handleMessageBoxOpen("Are you sure you want to cancel your Incident Request?", "warning","cancel");
          },

          _handleMessageBoxOpen: function (sMessage, sMessageBoxType,type) {
            debugger;
            MessageBox[sMessageBoxType](sMessage, {
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              onClose: function (oAction) {
                if (oAction === MessageBox.Action.YES) {
                  var oModel = this.getView().getModel();
                  if (type == 'Submit')
                  {
                    //Take care of Submission of Ticket
                    this.OnPressSave();
                    oModel.setData({}); // Reset to an empty object
                    oModel.refresh(true); // Force refresh to update bindings
                    // this._wizard.discardProgress(this._wizard.getSteps()[0]);
                    this.handleNavBackToGeneral();
                  }
                  else
                  {
                    // Take care of Cancellation. 
                   
                    oModel.setData({}); // Reset to an empty object
                    oModel.refresh(true); // Force refresh to update bindings
                    this._wizard.discardProgress(this._wizard.getSteps()[0]);
                    this.handleNavBackToGeneral();
                  }
               
    
                }
              }.bind(this)
            });
          },

          handleWizardSubmit: function () {
            this._handleMessageBoxOpen("Ready to Submit your Incident Request?", "confirm","Submit");
          },

        getPage: function () {
            return this.byId("dynamicPage");
          },

          OnPressSave: function () {
          },

        _navBackToStep: function (step) {
            var fnAfterNavigate = function () {
              this._wizard.goToStep(step);
              this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
            }.bind(this);
    
            this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
            this._oNavContainer.to(this._oDynamicPage);
          },

        handleNavBackToGeneral: function () {
            this._navBackToStep(this.byId("Step1"));
          },
    
          handleNavBackStep2: function () {
            this._navBackToStep(this.byId("Step2"));
          },
    
          handleNavBackStep3: function () {
            this._navBackToStep(this.byId("Step3"));
          },

        goToNextStep: function (oEvent) {
            debugger;
            var currBtnID = oEvent.getSource().getId();
           
            // this.getView().byId("createTicketWizard").nextStep();
            var array = currBtnID.split("--");
            var nextBtnID = array[1].replace(/(\d+)+/g, function (match, number) {
              return parseInt(number) + 1;
            });

            if (nextBtnID === "step2NextBtn") {
                this.getView().byId(currBtnID).setVisible(false);
                this.getView().byId("step2NextBtn").setEnabled(true);
                //do some validations and determine... enablement of next steps..
                this.getView().byId("createTicketWizard").nextStep();

              } 

            if (nextBtnID === "step3NextBtn") {
              this.getView().byId(currBtnID).setVisible(false);
              this.getView().byId("step3NextBtn").setEnabled(true);
            //do some validations and determine... enablement of next steps..
            this.getView().byId("createTicketWizard").nextStep();
            } 

            // else {
            // //   this.getView().byId(array[0] + "--" + array[1] + "--" + nextBtnID).setVisible(true);
            
            //   // if (nextBtnID === "step2NextBtn") {
            //   //   this.triggerBackendCheckAddr();
            //   // };
            // }    
          },

          completedHandler: function (oEvent) {
            this.goToFinalStep();
            this._oNavContainer.to(this.byId("wizardBranchingReviewPage"));
             
          },

          goToFinalStep: function () {
          },

        onToggleEditStep1: function () {
            var oViewModel = this.getView().getModel();
            var bEditable = oViewModel.getProperty("/isEditableStep1");
            oViewModel.setProperty("/isEditableStep1", !bEditable);
        },

        onToggleEditStep2: function () {
            var oViewModel = this.getView().getModel();
            var bEditable = oViewModel.getProperty("/isEditableStep2");
            oViewModel.setProperty("/isEditableStep2", !bEditable);
        },

        onToggleEditStep3: function () {
            var oViewModel = this.getView().getModel();
            var bEditable = oViewModel.getProperty("/isEditableStep3");
            oViewModel.setProperty("/isEditableStep3", !bEditable);
        },

        onSubmitTicket: function () {
            // Handle ticket submission logic
        },

        onValueHelpRequest: function (oEvent) {
            debugger;
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "com.kyyte.procurement.supplierrequestform.fragment.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("ServiceDescription", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("ServiceDescription", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("serviceInput").setValue(oSelectedItem.getTitle());
		}

       

    });
});
