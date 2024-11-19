sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (Controller, History,JSONModel) {
    "use strict";

    return Controller.extend("com.kyyte.procurement.supplierrequestform.home.Details", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Details").attachPatternMatched(this._onRouteMatched, this);
        },

        onAfterRendering: function() {
            var oProcessFlow = this.byId("processFlow"); 
            oProcessFlow.setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.Two); // Set zoom level
        },

        _onRouteMatched: function (oEvent) {
            var sId = oEvent.getParameter("arguments").sId;
            this._loadUserData(sId);
        },

        _loadUserData: function (SuppRequestID) {
            fetch("/SupplierRequest/getSupplierRequestFormDetails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    SuppRequestID
                })
            }).then(async (res) => {
                const value = await res.json();
                const structData = this.transformApiResponse(value)
                var oProcessFlowModel = new JSONModel(structData);
                this.getView().setModel(oProcessFlowModel, "processFlow");
              })
        },

        onNavBack: function () {
            // Navigate back to the previous page in the browser history
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Home", {}, true);
            }
        },

        transformApiResponse(apiResponse) {
            const responseData = apiResponse.value;
        
            const lanes = responseData.Process.stages
                .sort((a, b) => a.stage_order - b.stage_order)
                .map((stage, index) => ({
                    id: (index + 1).toString(),
                    iconSrc: this.getIconForStageStatus(stage.status),
                    label: stage.stage_name || `Stage ${index + 1}`,
                    position: index + 1
                }));
        
            lanes.unshift({
                id: "start-lane",
                iconSrc: this.getIconForStageStatus("Completed"),
                label: "Supplier Request Started",
                position: 0
            });
        
            lanes.push({
                id: "end-lane",
                iconSrc: this.getIconForStageStatus(responseData.Process.status),
                label: "Supplier Request Closed",
                position: lanes.length
            });
        
            const nodes = responseData.Process.stages.map((stage, index, stages) => ({
                id: stage.stage_id || `node-${index + 1}`,
                laneId: (index + 1).toString(),
                title: stage.stage_name || `Stage ${index + 1}`,
                children: index < stages.length - 1 ? [stages[index + 1].stage_id || `node-${index + 2}`] : ["node-end"],
                state: this.getStateForStageStatus(stage.status),
                stateText: stage.status || "Unknown",
                documentId: stage.document_number ? `Document No: ${stage.document_number}` : "",
                type: "Single",
                focused: index === 0
            }));
        
            nodes.unshift({
                id: "node-start",
                laneId: "start-lane",
                title: "Start",
                children: [nodes[0]?.id || "node-1"],
                state: this.getStateForStageStatus("Completed"),
                stateText: "Started",
                type: "Single"
            });
        
            nodes.push({
                id: "node-end",
                laneId: "end-lane",
                title: "Closed",
                children: [],
                state: this.getStateForStageStatus(responseData.Process.status),
                stateText: responseData.Process.status || "Unknown",
                type: "Single"
            });
        
            const formattedData = {
                ...responseData,
                process_id: responseData.Process.process_id,
                userid: { "userid": responseData.User },
                process_name: responseData.Process.process_name,
                status: responseData.State,
                lanes: lanes,
                stages: nodes
            };
        
            return formattedData;
        },
        
        getIconForStageStatus(status) {
            switch (status) {
                case "Completed":
                    return "sap-icon://complete";
                case "In Progress":
                    return "sap-icon://task";
                case "Not Started":
                    return "sap-icon://future";
                case "Pending":
                    return "sap-icon://pending";
                case "Rejected":
                    return "sap-icon://error";
                default:
                    return "sap-icon://question-mark";
            }
        },
        
        getStateForStageStatus(status) {
            switch (status) {
                case "Completed":
                    return "Positive";
                case "In Progress":
                    return "Neutral";
                case "Pending":
                    return "Neutral";
                case "Reject":
                    return "Critical";
                default:
                    return "Neutral";
            }
        }
        
    });
});
