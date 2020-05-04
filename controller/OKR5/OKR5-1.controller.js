var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.OKR5.OKR5-1", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("okr5-1").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
      getNodos: function(oEvent){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        parametros = {
          '_Year': year,
          '_Prefijo': 'okr5-1'
        };

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodosByDiametroDistinctCostoTRF.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              let view = response.TileCollection[index].view;
              let splitView = view.split("-");
              let diametro = splitView[splitView.length - 1];
              let status = thes.setSemaforo(diametro);
              response.TileCollection[index].color = status;        
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
        thes.getRouter().navTo('homeOKR5');
      },
      setSemaforo: function(diametro){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
            '_Year': year,
            '_Diametro': diametro,
            '_Month': month
        },
        status = 'Neutral';

        $.ajax({
            data: parametros,
            url: 'model/COSTO/GenerarSemaforoN1.php',
            type: 'POST',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
            response = JSON.parse(response);
              if(Array.isArray(response) && response.length == 1){
                let real = Number(response[0].real);
                let objetivo = Number(response[0].objetivo);
                if(objetivo > 0){
                  status = (real <= objetivo) ? 'Good' : 'Error'
                } else {
                  status = 'Neutral';
                }
              } else {
                status = 'Neutral';
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
            }
        });

        return status;
      }
   });
});
