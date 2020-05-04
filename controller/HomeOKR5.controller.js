var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeOKR5", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeOKR5").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
        thes.getNodosManage();
        thes.setSemaforoN1();
       },
      getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEOKR5',
          '_role': role
        },
        statusCostoTRF = thes.setSemaforoN1(),
        statusCostoMANTTO = thes.getSemaforoN2();

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == "okr5-1"){
                response.TileCollection[index].color = statusCostoTRF;
              } else if(response.TileCollection[index].view == "okr5-2"){
                response.TileCollection[index].color = statusCostoMANTTO;
              } else{
                response.TileCollection[index].color == 'Error';
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
          '_level': 'HOMEMANAGECOSTOS',
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
        thes.getRouter().navTo('home');
      },
      getSemaforoN1: function(diametro){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
            '_Year': year,
            '_Diametro': diametro,
            '_Month': month
        },
        status = 0;

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
                status = (real <= objetivo) ? 1 : 0;
              } else {
                status = 0;
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
            }
        });

        return status;
      },
      getDiametrosDistinct: function(oEvent){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month
        },
        data;

        $.ajax({
          data: parametros,
          url:   'model/COSTO/ListarDiametroDistinctCostoTRF.php', 
          type:  'post',
          async: false,
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
      setSemaforoN1: function(){
        var thes = this,
        diametros = thes.getDiametrosDistinct(),
        sum = 0,
        response = 'Neutral';

        if(diametros.length != 0){
          for (let index = 0; index < diametros.length; index++) {        
            let diametro = diametros[index].diametro;
            sum += thes.getSemaforoN1(diametro);
          }
          response = sum / diametros.length;
          response = (response >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }
        
        return response;
      },
      getSemaforoN2: function(){
          var thes = this,
          date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth(),
          parametros = {
            '_Year': year,
            '_Month': month
          },
          status = 'Neutral';
    
          $.ajax({
            data: parametros,
            url: 'model/COSTO/GenerarSemaforoN2.php',
            type: 'POST',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
              response = JSON.parse(response);
              if(Array.isArray(response) && response.length != 0){
                let real = Number(response[0].real);
                let objetivo = Number(response[0].objetivo);
                if(objetivo > 0){
                  status = (real <= objetivo) ? 'Good' : 'Error';
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
