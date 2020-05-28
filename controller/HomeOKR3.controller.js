var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
], function (BaseController, JSONModel,MessageToast, jQuery) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeOKR3", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeOKR3").attachPatternMatched(this._onObjectMatched, this);          
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
          '_level': 'HOMEOKR3',
          '_role': role
        },
        resultPRO = thes.resultPRO(),
        resultEFICIENCIA = thes.resultEficiencia(),
        resultOEE = thes.resultOEE();

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == 'okr3-1'){
                response.TileCollection[index].color = resultPRO;
              } else if (response.TileCollection[index].view == 'okr3-2'){
                response.TileCollection[index].color = resultEFICIENCIA;
              } else if (response.TileCollection[index].view == 'okr3-3'){
                response.TileCollection[index].color = resultOEE;
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
      getNodosManage: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEMANAGE',
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
      generateStatusOkrPRO: function(linea_produccion){
        var thes = this,
        date = new Date(),
        oKeyYear = date.getFullYear(),
        oKeyMonth = date.getMonth(),
        parametros = {
          '_Year': oKeyYear,
          '_Month': oKeyMonth,
          '_Linea': linea_produccion
        }, response = 0;
  
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
            if(Array.isArray(response)){
              value = Number(response[response.length - 1].quantity);
              if(value >= 0){
                response = 1;
              } else {
                response = 0;
              }
            }  
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return response;
      },
      getStatusOkrEficiencia: function(linea_produccion){
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
        data = 0;
  
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
              let lastPromedio = response[response.length - 1].promedio;
              if(lastPromedio >= Number(meta)){
                data = 1;
              } else {
                data = 0;
              }
            } else {
              data = 0;
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
  
      },
      generateStatusOkrOEE: function(linea_produccion, meta){
        var thes = this,
        date = new Date(),
        oKeyYear = date.getFullYear(),
        oKeyMonth = date.getMonth(),
        parametros = {
          '_Year': oKeyYear,
          '_Month': oKeyMonth,
          '_Linea': linea_produccion
        },
        data = 0;
  
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
              let lastOee = response[response.length - 1].oee;
              if(lastOee >= meta){
                data = 1;
              } else {
                data = 0;
              }
            } else {
              data = 0;
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      resultPRO: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        statusPRO = 0,
        result = 0,
        response = 'Neutral';

        if(lineas_produccion.length != 0){
          for (let index = 0; index < lineas_produccion.length; index++) {
            statusPRO += thes.generateStatusOkrPRO(lineas_produccion[index].linea_produccion);            
          }  
          result = statusPRO / lineas_produccion.length;
          response = (result >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }
        return response;
      },
      resultEficiencia: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        result = 0,
        response = 'Neutral';

        if(lineas_produccion.length != 0){
          for (let index = 0; index < lineas_produccion.length; index++) {
            result += thes.getStatusOkrEficiencia(lineas_produccion[index].linea_produccion);            
          }
          result = result / lineas_produccion.length;
          result = (result >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }
        return response;
      },
      resultOEE: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        result = 0,
        response = 'Neutral';

        if(lineas_produccion.length != 0){
          for (let index = 0; index < lineas_produccion.length; index++) {
            result += thes.generateStatusOkrOEE(lineas_produccion[index].linea_produccion, 70);            
          }
          result = result / lineas_produccion.length;
          result = (result >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }
        return response;
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
   });
});
