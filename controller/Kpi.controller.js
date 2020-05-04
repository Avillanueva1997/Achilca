jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast"
], function (BaseController, JSONModel,MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.Kpi", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("kpi").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.cargarKPI('1');
        thes.cargarKPI('2');
        thes.cargarKPI('3');
        thes.cargarKPI('4');
        thes.cargarKPI('5');
        thes.cargarKPI('6');
       },
      cargarKPI: function(area){
        var thes = this,
        parametros = {
          '_area': area
        };

        $.ajax({
          data: parametros,
          url:   'model/OTHERS/ListarKpis.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            var oModel = new sap.ui.model.json.JSONModel(response);
            if(area == 1){
              thes.byId("TableSIMA").setModel(oModel);
            } else if(area == 2){
              thes.byId("TableCALIDAD").setModel(oModel);
            } else if(area == 3){
              thes.byId("TablePRODUCCION").setModel(oModel);
            } else if(area == 4){
              thes.byId("TableMANTENIMIENTO").setModel(oModel);
            } else if(area == 5){
              thes.byId("TableCOSTOS").setModel(oModel);
            } else if(area == 6){
              thes.byId("TableLOGISTICA").setModel(oModel);
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
