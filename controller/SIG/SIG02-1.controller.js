jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast"
 ], function (BaseController, MessageToast) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.SIG.SIG02-1", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sig02-1").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("sig02-1");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      auditoria = oEvent.getParameters().data.auditoria;
      thes.cargarDatosAuditoria(auditoria);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.getTermino();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("sig02");
    },
    cargarDatosAuditoria: function(auditoria){
      var thes = this,
      parametros = {
        '_Auditoria': auditoria
      };

      $.ajax({
        data: parametros,
        url:   'model/SIG/ListarTerminoAuditoria.php', 
        type:  'POST',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableSIG").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onSave: function(oEvent){
      var thes = this,
      datosTabla = thes.byId("TableSIG").getModel().getData(),
      lengthData = datosTabla.length,
      firstcode = datosTabla[0].code,
      lastCode = datosTabla[lengthData - 1].code,
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      auditoria = pieces[pieces.length - 1];

      for (var i = 0; i < datosTabla.length; i++) {
        if(datosTabla[i].no_cfd_mayor == "") datosTabla[i].no_cfd_mayor = 0;
        if(datosTabla[i].no_cfd_menor == "") datosTabla[i].no_cfd_menor = 0;
        if(datosTabla[i].obs == "") datosTabla[i].obs = 0;
      }

      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "info_auditoria";
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
                thes.cargarDatosAuditoria(auditoria);
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
    getTermino: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarTerminos.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxTermino");  
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }

      });
    },
    onGenerateChartN1: function(){
      var thes = this,
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      auditoria = pieces[pieces.length - 1];
      
      thes.getRouter().navTo('sig02-1-1', {
        auditoria: auditoria
      });
    },
    onGenerateChartN2: function(){
        var thes = this,
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        auditoria = pieces[pieces.length - 1];
        
        thes.getRouter().navTo("sig02-2", {
          auditoria: auditoria
        });
    }
  });
 });