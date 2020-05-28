var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeOKR2", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeOKR2").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
        thes.getNodosManage();
       },
      getNodos: function(){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEOKR2',
          '_role': role
        },
        prodTotalVsObs = thes.getDataSemaforoN1(),
        prodByCoord = thes.setStatusSemaforoN2();

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == "okr2-1"){
                response.TileCollection[index].color = prodTotalVsObs;
              } else if(response.TileCollection[index].view == "okr2-2"){
                response.TileCollection[index].color = prodByCoord;
              } else if(response.TileCollection[index].view == "okr2-3"){
                response.TileCollection[index].color = 'Neutral';
              } else{
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
      getNodosManage: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEMANAGECALIDAD',
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
      getDataSemaforoN1: function(){
        var thes = this,
        date =  new Date(),
        year = date.getFullYear(),
        month = date.getMonth(), 
        parametros = {
          '_Year': year,
          '_Month': month
        }, 
        tonelajeObs = 0,
        tonelajeProd = 0,
        value = 0;
  
        $.ajax({
              data: parametros,
              url:   'model/CALIDAD/GenerarChartN1.php', 
              type:  'post',
              async: false,
              beforeSend: function () {
              },
              success:  function (response) {
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
              error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
              }
        });

        return value;
      },
      getDataSemaforoN2: function(linea_produccion){
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
              if(response.length != 0){
                for (let index = 0; index < response.length; index++) {
                  tonelajeObs += Number(response[index].bola_observada);
                  tonelajeProd += Number(response[index].produccion_neta);                  
                }
                value = tonelajeObs / (tonelajeObs + tonelajeProd);
                value = Math.round(value);
                value = (value <= 1.5) ? 1 : 0;
              }
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return value;
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
      },
      setStatusSemaforoN2: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        value = 0;
        if(lineas_produccion.length == 0){
          value = 'Neutral';
        } else {
          for (let index = 0; index < lineas_produccion.length; index++) {
            let response = thes.getDataSemaforoN2(lineas_produccion[index].linea_produccion);
            value += response;
          }
          value = value / lineas_produccion.length;
          value = (value >= 0.5) ? 'Good': 'Error';
        }
        return value;
      }
   });
});
