var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast"
], function (BaseController, JSONModel,MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeSP02-1", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeSP02-1").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
       getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'SP02',
          '_role': role
        },
        statusKpiN1 = thes.getDataKPIN1();

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == "sp02-1-1"){
                response.TileCollection[index].color = statusKpiN1;
              } else {
                response.TileCollection[index].color = 'Neutral';
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
        thes.showBusyIndicator(3000, 0);
thes.getRouter().navTo('home');
      },
      getDataKPIN1: function(){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Month': month,
          '_Year': year
        }, value;

        $.ajax({
          data: parametros,
          url: 'model/SP/GetSemaforoKpiN1.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            response = response.root;
            value = response.Value;
            if(value == '' || value == null){
              value = 'Neutral';
            } else if(Number(value) > 90){
              value = 'Good';
            } else if(Number(value) < 80){
              value = 'Error';
            } else if(Number(value) >= 80 && Number(value) <= 90){
              value = 'Warning';
            } else {
              value = 'Neutral';
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
