jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/ui/app01/assets/libs/moment",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast",
 'sap/m/Label',
 'sap/m/Popover',
 "sap/ui/core/format/DateFormat",
 'sap/ui/core/Fragment',
 'sap/base/Log'
 ], function (BaseController, momentjs, jQuery, JSONModel, MessageToast, Label, Popover, DateFormat, Fragment, Log) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.OKR1.OKR1-3", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr1-3").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this,
      date = new Date(),
      year = date.getFullYear();
      thes.cargarIncidenteTipo(year);
      thes.getTipoIncidente();
      thes.getYear();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeMANAGESIMA");
    },
    cargarIncidenteTipo: function(year){
      var thes = this,
      parametros = {
        '_year': year
      };


      $.ajax({
        data: parametros,
        url:   'model/SIMA/ListarIncidenteTipo.php', 
        type:  'POST',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          let total = 0;
          let tamañoR = response.length;
          for (let index = 0; index < tamañoR; index++) {
            total += Number(response[index].numero_incidentes);
          }
          response.total = total;
          response.year = year;
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableSIMA03").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onSave: function(oEvent){
      var thes = this,
      datosTabla = thes.byId("TableSIMA03").getModel().getData(),
      lengthData = datosTabla.length,
      firstcode = datosTabla[0].code,
      lastCode = datosTabla[lengthData - 1].code;

      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "incidente_tipo";
      data._First = firstcode;
      data._Second = lastCode;

      datos.para.push(data);
      datos.data.push(datosTabla);
      if(datosTabla.length != 0){
        datos.camp.push(Object.keys(datosTabla[0]));
      }  

      var ultimo = datos['data'][0].length - 1;

      var result = []; 

      for (var i = 0 ; i <= ultimo; i++) {
        if (datos['data'][0][i]['code'] == ""){
          result[i] = 0;  
          MessageToast.show("Complete el campo código");
        } else {
          result[i] = 1;        
        }
      }

      function isBelowThreshold(currentValue) {
        return currentValue == 1;
      }

      if (result.every(isBelowThreshold)) {

        var flag = "";

          for (var i = 0; i <= datosTabla.length - 1; i++) {
            for (var x = 0; x <= datosTabla.length - 1; x++) {
              if (i != x) {
                if (datosTabla[i].code == datosTabla[x].code) {
                  flag = "X";
                } 
              }
            }
          }


        if(flag == "X") { 
              MessageToast.show("Existen Duplicados"); 
        }else{

            $.ajax({
              data:  data,
              url:   'model/SPRO/EliminarDatosTablaSIMA.php', 
              type:  'post',
              async: false,
              beforeSend: function () {
              },
              success:  function (response) {  
              },
              error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
              }
            });

            $.ajax({
              data:  datos,
              url:   'model/SPRO/InsertarDinamico.php', 
              type:  'post',
              async: false,
              beforeSend: function () {
              },
              success:  function (response) {
                let year = thes.byId('cbxYear').getSelectedKey();
                thes.cargarIncidenteTipo(year);
                MessageToast.show("Se grabó con éxito");
              },
              error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
              }
            });
          }
       }
    },
    getTipoIncidente: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarTipoIncidente.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxTipo");  
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    getYear: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarYear.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxYear");  
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }

      });

    },
    onChangeNumeroIncidentes: function(oEvent){
      var thes = this,
      oValue = oEvent.getParameter('value'),
      oValue = Number(oValue),
      oData = thes.byId('TableSIMA03').getModel().getData(),
      sPath = oEvent.getSource().getBindingContext().sPath,
      sPath = sPath.slice(1);
      var total = 0;
      var tamañoR = oData.length;
      for (let index = 0; index < tamañoR; index++) {
        if(index == sPath){
          total += oValue;
        } else {
          total += Number(oData[index].numero_incidentes);
        }
      }
      oData.total = total;
    },
    onYearChange: function(oEvent){
      var thes = this,
      oValue = oEvent.getParameter('value'),
      oValue = Number(oValue);
      thes.cargarIncidenteTipo(oValue);
    }
  });
 });