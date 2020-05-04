var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.OKR2.OKR2-2", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("okr2-2").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
      getNodos: function(oEvent){
        var thes = this;
        var parametros = {
          '_status': 1,
          '_prefijo': 'okr2-2'
        };

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodosByStatusLineaProduccionCalidad.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              let view = response.TileCollection[index].view;
              let splitView = view.split('-');
              let linea_produccion = splitView[splitView.length - 1];
              let valueLineaProduccion = thes.getDataSemaforo(linea_produccion);
              response.TileCollection[index].color = valueLineaProduccion;           
            }
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel);                              
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      onHomePress: function(oEvent){
        var thes = this;
        thes.getRouter().navTo('homeOKR2');
      },
      getDataSemaforo : function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        }, 
        tonelajeObs = 0,
        tonelajeProd = 0,
        value = 0;

        $.ajax({
          data: parametros,
          url: 'model/CALIDAD/GenerarChartN2.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            if(Array.isArray(response)){
              if(response.length == 0){
                value = 'Neutral';
              } else {
                for (let index = 0; index < response.length; index++) {
                  tonelajeObs += Number(response[index].bola_observada);
                  tonelajeProd += Number(response[index].produccion_neta);                  
                }
                value = tonelajeObs / (tonelajeObs + tonelajeProd);
                value = Math.round(value);
                value = (value <= 1.5) ? 'Good' : 'Error';
              }
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return value;
      }
   });
});
