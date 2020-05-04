var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-3", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("okr3-3").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
      getNodos: function(oEvent){
        var thes = this;
        var parametros = {
          '_status': 1,
          '_prefijo': 'okr3-3'
        },
        statusOkrL2 = thes.setStatusOKR('L2', 70),
        statusOkrL3 = thes.setStatusOKR('L3', 70);

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodosByStatusLineaProduccionCalidad.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == 'okr3-3-L2'){
                response.TileCollection[index].color = statusOkrL2;
              } else if (response.TileCollection[index].view == 'okr3-3-L3'){
                response.TileCollection[index].color = statusOkrL3;
              }  else {
                response.TileCollection[index].color = 'Error';
              }         
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
        thes.getRouter().navTo('homeOKR3');
      },
      setStatusOKR: function(linea_produccion, meta){
          var thes = this,
          date = new Date(),
          oKeyYear = date.getFullYear(),
          oKeyMonth = date.getMonth(),
          parametros = {
            '_Year': oKeyYear,
            '_Month': oKeyMonth,
            '_Linea': linea_produccion
          },
          data = 'Error';
    
          $.ajax({
            data: parametros,
            url: 'model/OEE/GenerarChartN5.php',
            type: 'POST',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
              response = JSON.parse(response);
              if(Array.isArray(response) && response.length > 0){
                let lastOee = Number(response[response.length - 1].oee);
                if(lastOee >= meta){
                  data = 'Good';
                } else {
                  data = 'Error';
                }
              } else{
                data = 'Neutral';
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
          });

          return data;
      }
   });
});
