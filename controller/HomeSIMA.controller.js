var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast"
], function (BaseController, JSONModel,MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeSIMA", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeSIMA").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
      getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMESIMA',
          '_role': role
        },
        okrN1 = thes.getStatus('num_accidentes'),
        okrN2 = thes.getStatus('indice_frecuencia'),
        okrN3 = thes.getStatus('indice_severidad');

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == "sima01"){
                response.TileCollection[index].color = okrN1;
              } else if(response.TileCollection[index].view == "sima02"){
                response.TileCollection[index].color = okrN2;             
              } else if(response.TileCollection[index].view == "sima03"){
                response.TileCollection[index].color = okrN3;
              } else {
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
        thes.getRouter().navTo('home');
      },
      getStatus: function(campo){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        parametros = {
          '_Campo': campo,
          '_Year': year
        },
        value = 'Neutral';

        $.ajax({
          data: parametros,
          url:   'model/SIMA/GenerateStatus.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            if(Array.isArray(response)){
              if(response.length == 0){
                value = 'Neutral';
              } else {
                let Value = Number(response[response.length - 1].Value);
                if(Value > 0){
                  value = 'Error';
                } else {
                  value = 'Good';
                }
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

        return value;
      }
   });
});
