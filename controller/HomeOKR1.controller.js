var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeOKR1", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeOKR1").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
        thes.getNodosManage();
       },
      getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEOKR1',
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
              if(response.TileCollection[index].view == "okr1-4"){
                response.TileCollection[index].color = okrN1;
              } else if(response.TileCollection[index].view == "okr1-5"){
                response.TileCollection[index].color = okrN2;             
              } else if(response.TileCollection[index].view == "okr1-6"){
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
        });
      },
      getNodosManage: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEMANAGESIMA',
          '_role': role
        };

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            var oModel = thes.getView().getModel();
            oModel.setProperty("/TileCollectionManage", response.TileCollection);
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      onHomePress: function(oEvent){
        var thes = this;
        thes.showBusyIndicator(3000, 0);
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
