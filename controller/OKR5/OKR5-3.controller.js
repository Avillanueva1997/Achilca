jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/ui/model/json/JSONModel',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format',
 "sap/m/MessageToast"
 ], function (BaseController, JSONModel, ChartFormatter, Format, MessageToast) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.OKR5.OKR5-3", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr5-3").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.getDiametroDistinct();
      thes.cargarYear();
      thes.getMonth();
      thes.cargarCostoTRF();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeMANAGECOSTOS");
    },
    cargarYear: function(){
      var thes = this,
      dateToday = new Date(),
      year = dateToday.getFullYear();

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
          thes.byId('cbxYear').setSelectedKey(year);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    getDiametroDistinct: function(){
        var thes = this,
        mixed = {
          length: "MIXED"
        };
        $.ajax({
            url:   'model/SPRO/ListarInfoBallDistinct.php', 
            type:  'post',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {    
                response = JSON.parse(response);
                response.push(mixed);
                var firstValue = response[0].length;
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.getView().setModel(oModel,"cbxDiametro");
                thes.byId('cbxDiametro').setSelectedKey(firstValue);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },
    cargarCostoTRF: function(){
      var thes = this,
      year = thes.byId('cbxYear').getSelectedKey(),
      diametro = thes.byId('cbxDiametro').getSelectedKey(),
      parametros = {
        '_Year': year,
        '_Diametro': diametro
      };

      $.ajax({
        data: parametros,
        url:   'model/COSTO/ListarCostoTRF.php', 
        type:  'POST',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableCOSTO01").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    getMonth: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarMonth.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxMonth");  
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }

      });

    },
    onSave: function(oEvent){
      var thes = this,
      datosTabla = thes.byId("TableCOSTO01").getModel().getData(),
      lengthData = datosTabla.length,
      firstcode = datosTabla[0].code,
      lastCode = datosTabla[lengthData - 1].code,
      diametro = thes.byId('cbxDiametro').getSelectedKey();

      for (let index = 0; index < datosTabla.length; index++) {
        datosTabla[index].diametro  = diametro;
        if(datosTabla[index].real == ''){
          datosTabla[index].real = 0;
        }
        if(datosTabla[index].objetivo == ''){
          datosTabla[index].objetivo = 0;
        }
      }

      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "costo_trf";
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
                thes.cargarCostoTRF();
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