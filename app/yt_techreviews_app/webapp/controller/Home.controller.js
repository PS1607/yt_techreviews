sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, ColumnListItem, Input) {
        "use strict";

        return Controller.extend("com.sap.yttechreviewsapp.controller.Home", {
            onInit: function () {

            },

            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
            },

            onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },

            onCreate: function () {
                var oSo = this.getView().byId("link").getValue();
                if (oSo !== "") {
                    const oList = this._oTable;
                        const oBinding = oList.getBinding("items");
                        const oContext = oBinding.create({
                            "link": this.byId("link").getValue(),
                            "videoTitle": this.byId("title").getValue(),
                            "channel": this.byId("channel").getValue(),
                            "publishedOn": this.byId("date").getValue(),
                            "totalViews": this.byId("views").getValue()      
                        });
                        oContext.created()
                        .then(()=>{
                                // that._focusItem(oList, oContext);
                                this.getView().byId("OpenDialog").close();
                        });
  
                }else {
                    MessageToast.show("So cannot be blank");
                }
    
            },

            onEditMode: function(){
                this.byId("editModeButton").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("deleteButton").setVisible(true);

                var UIStateModel = this.getView().getModel("UIState");
                UIStateModel.setProperty("/editable", true); 
           },

            onDelete: function(){

                var oSelected = this.byId("table0").getSelectedItem();
                if(oSelected){
                    var oTitle = oSelected.getBindingContext("mainModel").getObject().title;
                
                    oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                        MessageToast.show(oTitle + " SuccessFully Deleted");
                    }.bind(this), function (oError) {
                        MessageToast.show("Deletion Error: ",oError);
                    });
                } else {
                    MessageToast.show("Please Select a Row to Delete");
                }
            
            },

            rebindTable: function(oTemplate, sKeyboardMode) {
                this._oTable.bindItems({
                    path: "mainModel>/ReviewVideos",
                    template: oTemplate,
                    templateShareable: true
                }).setKeyboardMode(sKeyboardMode);
            },

            onInputChange: function(){
                this.refreshModel("mainModel");

            },
            
            refreshModel: function (sModelName, sGroup){
                return new Promise((resolve,reject)=>{
                    this.makeChangesAndSubmit.call(this,resolve,reject,
                    sModelName,sGroup);
                });
                
            },

            makeChangesAndSubmit: function (resolve, reject, sModelName,sGroup){
                const that = this;
                sModelName = "mainModel";
                sGroup = "$auto";
                if (that.getView().getModel(sModelName).hasPendingChanges(sGroup)) {
                    that.getView().getModel(sModelName).submitBatch(sGroup).then(oSuccess =>{
                        that.makeChangesAndSubmit(resolve,reject, sModelName,sGroup);
                        MessageToast.show("Record updated Successfully");
                    },reject)
                    .catch(function errorHandler(err) {
                        MessageToast.show("Something Went Wrong ",err.message); // 'Oops!'
                      });
                } else {
                    that.getView().getModel(sModelName).refresh(sGroup);
                    resolve();
                }
            },

            onSave: function(){
                this.getView().byId("editModeButton").setVisible(true);
                this.getView().byId("saveButton").setVisible(false);

                var UIStateModel = this.getView().getModel("UIState");
                UIStateModel.setProperty("/editable", false); 
                
            },
    });
});
