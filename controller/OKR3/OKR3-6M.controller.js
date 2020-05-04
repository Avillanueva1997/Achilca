jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast",
 'sap/m/Label',
 'sap/m/Popover',
 "sap/ui/core/format/DateFormat",
 'sap/ui/core/Fragment',
 'sap/base/Log',
 "sap/ui/unified/library",
 './Formatter'
 ], function (BaseController, jQuery, JSONModel, MessageToast, Label, Popover, DateFormat, Fragment, Log, unifiedLibrary, Formatter) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-6M", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr3-6m").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("okr3-6m");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      linea_produccion = oEvent.getParameters().data.linea_produccion,
      moye = oEvent.getParameters().data.moye,
      parametros = {
          '_LineaProduccion': linea_produccion,
          '_Moye': moye
      };

      thes.getDataAcumulado(parametros);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("okr3-6");
    },
    getDataAcumulado: function(parametros){
      var thes = this,
      dataFinal = thes.getDataAcumuladoFinal(parametros);

      $.ajax({
          data: parametros,
          url: 'model/PRO/ListarAcumuladoMensualOkrs.php',
          type: 'POST',
          async: false,
          beforeSend: function(){},
          success: function(response){
            response = JSON.parse(response);
            response.AcumuladoFinal = dataFinal.AcumuladoFinal.length == 0 ? JSON.parse(JSON.stringify(response.AcumuladoReal)) : JSON.parse(JSON.stringify(dataFinal.AcumuladoFinal));
            if(dataFinal.AcumuladoFinal.length == 0){
              for (let index = 0; index < response.AcumuladoFinal.length; index++) {
                thes.renameKey(response.AcumuladoFinal[index], 'fecha_second', 'fecha');
                thes.renameKey(response.AcumuladoFinal[index], 'carga_fria_second', 'carga_fria');
                thes.renameKey(response.AcumuladoFinal[index], 'produccion_neta_second', 'produccion_neta');
                thes.renameKey(response.AcumuladoFinal[index], 'eficiencia_second', 'eficiencia');
                thes.renameKey(response.AcumuladoFinal[index], 'bola_observada_second', 'bola_observada');
                thes.renameKey(response.AcumuladoFinal[index], 'bola_observada_second_second', 'bola_observada_second');
              }
            }
            
            var oModel = new sap.ui.model.json.JSONModel(response);
            thes.getView().setModel(oModel);
          },
          error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
          }
      });
    },
    getDataAcumuladoFinal: function(parametros){
      var thes = this,
      data;
      $.ajax({
          data: parametros,
          url: 'model/PRO/ListarAcumuladoFinal.php',
          type: 'POST',
          async: false,
          beforeSend: function(){},
          success: function(response){
              response = JSON.parse(response);
              data = response;
          },
          error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
          }
      });

      return data;
    },
    onSave: function(){
      var thes = this,
      dataComplete = thes.getView().getModel().getData(),
      dataTable = dataComplete.AcumuladoFinal,
      datos = {
        "para":[],
        "data":[],
        "camp":[]
      },
      data = {},
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = pieces[6],
      moye = pieces[7],
      firstDate = dataTable[0].fecha,
      endDate = dataTable[dataTable.length - 1 ].fecha,
      parametros = {
        '_LineaProduccion': linea_produccion,
        '_Moye': moye
      };

      for (let index = 0; index < dataTable.length; index++) {
        dataTable[index].linea_produccion = linea_produccion;
      }

      data._Tabla = "cierre_okrs";
      data._FirstDate = firstDate;
      data._EndDate = endDate;
      data._LineaProduccion = linea_produccion;
        
        datos.para.push(data);
        datos.data.push(dataTable);
        if(dataTable.length != 0){
          datos.camp.push(Object.keys(dataTable[0]));
        }

        $.ajax({
        data:  data,
        url:   'model/PRO/EliminarDatosCierreOkrs.php', 
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
          url:   'model/PRO/InsertarAcumuladoOkrs.php', 
          type:  'post',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            thes.getDataAcumulado(parametros);
            MessageToast.show("Se grabó con éxito");
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });
    }
  });
 });