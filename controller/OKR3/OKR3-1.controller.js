var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-1", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("okr3-1").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
      getNodos: function(oEvent){
        var thes = this;
        var parametros = {
          '_status': 1,
          '_prefijo': 'okr3-1'
        },
        statusOKRL2 = thes.generateStatusOKR('L2'),
        statusOKRL3 = thes.generateStatusOKR('L3');

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodosByStatusLineaProduccionCalidad.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == 'okr3-1-L2'){
                response.TileCollection[index].color = statusOKRL2;
              } else if (response.TileCollection[index].view == 'okr3-1-L3'){
                response.TileCollection[index].color = statusOKRL3;
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
      generateStatusOKR: function(linea_produccion){
        var thes = this,
        date = new Date(),
        oKeyYear = date.getFullYear(),
        oKeyMonth = date.getMonth(),
        parametros = {
          '_Year': oKeyYear,
          '_Month': oKeyMonth,
          '_Linea': linea_produccion
        }, responseSemaforo = 'Neutral',
        lineas_produccion = thes.getLineaProduccionDistinct();
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN3.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            var value = '';
            if(lineas_produccion.length != 0){
              for (let index = 0; index < lineas_produccion.length; index++) {
                if(lineas_produccion[index].linea_produccion == linea_produccion){
                  if(Array.isArray(response)){
                    value = Number(response[response.length - 1].quantity);
                    if(value >= 0){
                      responseSemaforo = 'Good';
                    } else {
                      responseSemaforo = 'Error';
                    }    
                  }
                } else {
                  responseSemaforo = 'Neutral';
                }                
              }
            } else {
              responseSemaforo = 'Neutral';
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return responseSemaforo;
      },
      getLineaProduccionDistinct: function(){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month
        }, 
        data;

        $.ajax({
          data: parametros,
          url:   'model/CALIDAD/ListarLineaProduccionDistinct.php', 
          type:  'post',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            response = JSON.parse(response);
            data = response;
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      }
   });
});
