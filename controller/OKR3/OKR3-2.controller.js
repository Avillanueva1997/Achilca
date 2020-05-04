var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-2", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("okr3-2").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
      getNodos: function(oEvent){
        var thes = this;
        var parametros = {
          '_status': 1,
          '_prefijo': 'okr3-2'
        },
        statusEficienciaL2 = thes.getStatusOKR('L2'),
        statusEficienciaL3 = thes.getStatusOKR('L3');

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodosByStatusLineaProduccionCalidad.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == 'okr3-2-L2'){
                response.TileCollection[index].color = statusEficienciaL2;
              } else if (response.TileCollection[index].view == 'okr3-2-L3'){
                response.TileCollection[index].color = statusEficienciaL3;
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
      getStatusOKR: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        meta = thes.getMetaEficiencia(year, linea_produccion),
        data = 'Error';
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN2.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            if(Array.isArray(response) && response.length > 0){
              let lastPromedio = Number(response[response.length - 1].promedio);
              if(lastPromedio >= Number(meta)){
                data = 'Good';
              } else {
                data = 'Error';
              }
            } else {
              data = 'Neutral';
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      getMetaEficiencia: function(year, linea_produccion){
        var thes = this,
        parametros = {
          '_Year': year,
          '_LineaProduccion': linea_produccion
        },
        data = 0;
  
        $.ajax({
          data: parametros,
          url: 'model/EFICIENCIA/ListarMeta.php',
          type: 'post',
          async: false,
          beforeSend: function(){},
          success: function(response){
            data = response;
          },
          error:  function(xhr, thrownError, ajaxOptions){
              alert(xhr.status);
              alert(thrownError);
          }
        });
  
        return data;
  
      }
   });
});
