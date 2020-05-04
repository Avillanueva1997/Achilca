jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast"
], function (BaseController, JSONModel,MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.Team", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("team").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.cargarPersonal(1);
        thes.cargarPersonal(2);
        thes.cargarPersonal(3);
        thes.cargarPersonal(4);
        thes.cargarPersonal(5);
        thes.cargarPersonal(6);
       },
      cargarPersonal: function(type){
        var thes = this,
        parametros = {
          '_type': type
        };

        $.ajax({
          data: parametros,
          url:   'model/OTHERS/ListarPersonal.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            var oModel = new sap.ui.model.json.JSONModel(response);
            if(type == 1){
              thes.byId("TableAdministrativo").setModel(oModel);
            } else if(type == 2){
              thes.byId("TableGrupoA").setModel(oModel);
            } else if(type == 3){
              thes.byId("TableGrupoB").setModel(oModel);
            } else if(type == 4){
              thes.byId("TableGrupoC").setModel(oModel);
            } else if(type == 5){
              thes.byId("TableGrupoR").setModel(oModel);
            } else if(type == 6){
              thes.byId("TableMantenimiento").setModel(oModel);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      onNavBack: function(oEvent) {
        var thes = this;
        thes.getRouter().navTo("home");
      }
   });
});
