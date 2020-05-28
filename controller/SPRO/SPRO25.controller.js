jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast"
 ], function (BaseController, MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.SPRO.SPRO25", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("spro25").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarTrimestre();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.showBusyIndicator(3000, 0);
thes.getRouter().navTo("homeSPRO");
    },
    cargarMetaUptime: function(){
      var thes = this,
      year = thes.byId("cbxYear").getSelectedKey(),
      linea = thes.byId("cbxLinea").getSelectedKey(),      
      parametros = {
          '_Year': year,
          '_LineaProduccion': linea
      };

      $.ajax({
        data: parametros,
        url:   'model/SPRO/ListarMetaUptime.php', 
        type:  'POST',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableSPRO25").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onSave: function(oEvent){
        var thes = this,
        datosTabla = thes.byId("TableSPRO25").getModel().getData(),
        lengthData = datosTabla.length,
        firstcode = datosTabla[0].code,
        lastCode = datosTabla[lengthData - 1].code;

        for (let index = 0; index < datosTabla.length; index++) {
          datosTabla[index].meta = (datosTabla[index].meta == '') ? 0 : datosTabla[index].meta;
        }

        var datos = {
        "para":[],
        "data":[],
        "camp":[]
        };

        var data = {};
        data._Tabla = "meta_uptime";
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
                    thes.cargarMetaUptime();
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
    cargarLineaProduccion: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarLineaProduccion.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          let linea = response[0].code;
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxLinea");  
          thes.byId("cbxLinea").setSelectedKey(linea);
          thes.cargarMetaUptime();
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }

      });

    },
    cargarTrimestre: function(){
      var thes = this;

      $.ajax({
        url:   'model/ENTIDADES/trimestre.json', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxTrimestre");  
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    cargarYear: function(){
        var thes = this,
        date = new Date(),
        year = date.getFullYear();
  
        $.ajax({
          url: 'model/SPRO/ListarYear.php',
          type: 'GET',
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response); 
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel,"cbxYear");
            thes.byId("cbxYear").setSelectedKey(year);
            thes.cargarLineaProduccion();
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
  
        });
  
      }
  });
 });