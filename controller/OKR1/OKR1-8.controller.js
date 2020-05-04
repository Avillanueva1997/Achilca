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

   return BaseController.extend("sap.ui.app01.controller.OKR1.OKR1-8", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr1-8").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarDiasSinAccidente();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeMANAGESIMA");
    },
    onAdd: function(oEvent){
      var thes = this,
      date = new Date();
      $.ajax({
        url:   'model/ENTIDADES/dias_sin_accidente.json', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) { 
          var data = thes.byId("TableSIMA09").getModel().getData();
          var lengthData = data.length;
          var lastNumber = 0;
          if(lengthData != 0){
            lastNumber = data[lengthData - 1].code;
          }
          lastNumber = Number(lastNumber) + 1;
          response.code = lastNumber.toString();
          response.fecha = date;
          data.push(response);
          thes.byId("TableSIMA09").getModel().refresh();
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onSave: function(oEvent){
      var thes = this;       

      var datosTabla = thes.byId("TableSIMA09").getModel().getData();

      var copyDatosTabla = [...datosTabla];

      for (let index = 0; index < copyDatosTabla.length; index++) {
        let date = copyDatosTabla[index].fecha;
        //yyyy-mm-dd
        copyDatosTabla[index].fecha =  date.getUTCFullYear() + '-' +
                                      thes.pad(date.getUTCMonth() + 1) + '-' +
                                      thes.pad(date.getUTCDate()) + ' ' + 
                                      date.getHours() + ':' + date.getMinutes() + ':00';
      }     
      
      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "dias_sin_accidentes";

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
                thes.cargarDiasSinAccidente();
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
    cargarDiasSinAccidente: function(){
      var thes = this;
      $.ajax({
        url:   'model/SIMA/ListarDiasSinAccidentes.php', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          for (let index = 0; index < response.length; index++) {
            let dateTime = response[index]['fecha'];
            let dateTimeParts= dateTime.split(/[- :]/);
            dateTimeParts[1]--;
            response[index]['fecha'] = new Date(...dateTimeParts);         
          }
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableSIMA09").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onChangeFecha: function(oEvent){
      var thes = this,
      oDatePicker = oEvent.getSource(),
      oDateValue = oDatePicker.getDateValue(),
      sPath = oDatePicker.getBindingContext().sPath,
      splitSpath = sPath.split('/'),
      index = splitSpath[1],
      dataTable = thes.byId("TableSIMA09").getModel().getData(),
      dateToday = new Date();

      if(dataTable.length != 1){
        if(oDateValue < dataTable[index - 1].fecha){
          dataTable[index].fecha = dateToday;
          MessageToast.show("Ingrese fecha válida!");
        }
      }
    }
  });
 });