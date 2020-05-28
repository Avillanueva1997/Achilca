jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast"
 ], function (BaseController, MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.SPRO.SPRO39", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("spro39").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.getYear();
      thes.getLinea();
      thes.getMonth();
      thes.byId("cbxYear").setSelectedKey('2020');
      thes.byId("cbxLinea").setSelectedKey('L2');
      thes.cargarData();
    },
    cargarData: function(){
        var thes = this,
        year = thes.byId("cbxYear").getSelectedKey(),
        year = Number(year),
        linea = thes.byId("cbxLinea").getSelectedKey(),
        parametros = {
          '_year': year,
          '_linea': linea
        };
  
        $.ajax({
            data: parametros,
            url:   'model/SPRO/ListarDatabaseProduccion.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
                response = JSON.parse(response);
                let total = 0;
                let tamañoR = response.length;
                let promedio = 0;
                for (let index = 0; index < tamañoR; index++) {
                  total += Number(response[index].numero_incidentes);
                }
                promedio = total / tamañoR;
                promedio = promedio.toFixed(2);
                response.promedio = promedio;
                response.year = year;
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.byId("TableSPRO39").setModel(oModel);
            },
            error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
            }
        });
    },
    onSave: function(oEvent){
      var thes = this,
      datosTabla = thes.byId("TableSPRO39").getModel().getData(),
      lengthData = datosTabla.length,
      firstcode = datosTabla[0].code,
      lastCode = datosTabla[lengthData - 1].code;

      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "database_produccion";
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
                thes.cargarData();
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
    getYear: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarYear.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          if(Array.isArray(response) && response.length > 0){
            for (let index = 0; index < response.length; index++) {
              var year = response[index].description;
              if(Number(year) > 2020){
                delete response[index];
              }             
            }

            var newTable = [];
        
            for (var i = 0; i < response.length; i++) {
              if(response[i] !== undefined){
                newTable.push(response[i]);
              }
            }
          }
          var oModel = new sap.ui.model.json.JSONModel(newTable);  
          thes.getView().setModel(oModel,"cbxYear");  
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }

      });

    },
    getLinea: function(){
        var thes = this;
  
        $.ajax({
            url:   'model/SPRO/ListarLineaProduccion.php', 
            type: 'GET',
            beforeSend: function(){
            },
            success: function(response){
                response = JSON.parse(response); 
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.getView().setModel(oModel,"cbxLineaProduccion");  
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
            }
        });
  
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.showBusyIndicator(3000, 0);
      thes.getRouter().navTo("homeSPRO");
    }
  });
 });