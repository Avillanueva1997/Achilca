var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast"
], function (BaseController, JSONModel,MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeMANAGESIMA", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeMANAGESIMA").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
        thes.evaluarDiasSinAccidente();
       },
      getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'MANAGESIMA',
          '_role': role
        };

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].state == "Loaded"){
                response.TileCollection[index].state = false;
              } else {
                response.TileCollection[index].state = true;
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
      evaluarDiasSinAccidente: function(){
        var thes = this,
        dateToday = new Date(),
        number = 0,
        data = thes.getView().getModel().getData(),
        dateLastAccident = 0,
        Difference_In_Time = 0;

        $.ajax({
          url: 'model/SIMA/EvaluarDiasSinAccidentes.php',
          type: 'get',
          dataType: 'json',
          async: false,
          success: function(response){
            for (let index = 0; index < response.length; index++) {
              let date =  response[index]['fecha'];
              let t = date.split(/[- :]/);
              response[index].fecha =  new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));            
            }

            if(response.length != 0){
              dateLastAccident = response[0].fecha;
              Difference_In_Time = dateToday.getTime() - dateLastAccident.getTime(); 
              number = Difference_In_Time / (1000 * 3600 * 24);
              number = parseInt(number); 
            }            

            for (let index = 0; index < data['TileCollection'].length; index++) {
              if(data['TileCollection'][index].view == 'okr1-8'){
                data['TileCollection'][index].number = number;
                data['TileCollection'][index].numberUnit = "Días";  
              }              
            }
            
            thes.getView().getModel().refresh(true);
          },
          error: function(xhr,  ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      onHomePress: function(oEvent){
        var thes = this;
        thes.getRouter().navTo('homeOKR1');
      }
   });
});
