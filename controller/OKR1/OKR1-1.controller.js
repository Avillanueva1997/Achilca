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
   
   return BaseController.extend("sap.ui.app01.controller.OKR1.OKR1-1", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr1-1").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarDatosYTD();
      thes.cargarYear();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeMANAGESIMA");
    },
    cargarYear: function(){
      var thes = this;
      $.ajax({
        url:   'model/SPRO/ListarYear.php', 
        type:  'get',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {    
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxYear");  
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    cargarDatosYTD: function(){
      var thes = this;
      $.ajax({
        url:   'model/SIMA/ListarSimaYtd.php', 
        type:  'GET',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableSIMA01").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onAdd: function(oEvent){
      var thes = this;
      $.ajax({
        url:   'model/ENTIDADES/sima_ytd.json', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) { 
          var data = thes.byId("TableSIMA01").getModel().getData();
          var lengthData = data.length;
          var lastNumber = 0;
          if(lengthData != 0){
            lastNumber = data[lengthData - 1].code;
          }
          lastNumber = Number(lastNumber) + 1;
          response.code = lastNumber.toString();
          data.push(response);
          thes.byId("TableSIMA01").getModel().refresh();
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onDelete:function(oEvent){
      var thes = this,
      index,
      datosTabla = thes.byId("TableSIMA01").getModel().getData(),
      selectData = thes.byId("TableSIMA01").getSelectedContextPaths();

      for (var i = 0; i < selectData.length; i++) {
        selectData[i] = selectData[i].replace('/','');
      }

      for (var i = 0; i < selectData.length; i++) {
        index = selectData[i];
        delete datosTabla[index];
      }

      var newTable = [];

      for (var i = 0; i < datosTabla.length; i++) {
        if(datosTabla[i] !== undefined){
          newTable.push(datosTabla[i]);
        }
      }
      thes.byId("TableSIMA01").getModel().setData(newTable);
      thes.byId('TableSIMA01').removeSelections();
      thes.byId("TableSIMA01").getModel().refresh();
    },
    onSave: function(oEvent){
      var thes = this;       

      var datosTabla = thes.byId("TableSIMA01").getModel().getData();

      for (var i = 0; i < datosTabla.length; i++) {
        if(datosTabla[i].num_accidentes == '') datosTabla[i].num_accidentes = 0;
        if(datosTabla[i].num_incidentes == '') datosTabla[i].num_incidentes = 0;
        if(datosTabla[i].indice_frecuencia == '') datosTabla[i].indice_frecuencia = 0;
        if(datosTabla[i].indice_severidad == '') datosTabla[i].indice_severidad = 0;
      }

      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "sima_ytd";

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
        } else if (datos['data'][0][i]['year'] == ""){
          result[i] = 0;  
          MessageToast.show("Complete el campo año");
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
              url:   'model/SPRO/EliminarDatosTabla.php', 
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
                thes.cargarDatosYTD();
                MessageToast.show("Se grabó con éxito");
              },
              error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
              }
            });
          }
       }
    }
  });
 });