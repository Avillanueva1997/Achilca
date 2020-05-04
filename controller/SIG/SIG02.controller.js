jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast"
 ], function (BaseController, MessageToast) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.SIG.SIG02", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sig02").attachPatternMatched(this._onObjectMatched, this);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.getDataAcumulado();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeSIG");
    },
    getDataAcumulado: function(){
        var thes = this;
        $.ajax({
            url: 'model/SIG/ListarDataTableAcumulado.php',
            type: 'GET',
            dataType: 'JSON',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
              var oModel = new sap.ui.model.json.JSONModel(response);  
              thes.byId("TableData").setModel(oModel);
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
        });
    },
    onListItemPress: function (oEvent) {
      var thes = this,
      oTable = oEvent.getSource(),
      oContext = oTable.getBindingContextPath(),
      splitContext = oContext.split('/'),
      index = splitContext[splitContext.length - 1],
      table = thes.byId("TableData").getModel().getData(),
      auditoria = table[index].code;

      thes.getRouter().navTo('sig02-1', {
        auditoria: auditoria
      });
    },
    onSave: function(oEvent){
      var thes = this,
      datosTabla = thes.byId("TableData").getModel().getData();

      for (let index = 0; index < datosTabla.length; index++) {
        delete datosTabla[index]['no_cfd_mayor'];
        delete datosTabla[index]['no_cfd_menor'];
        delete datosTabla[index]['obs']; 
      }

      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "nota_auditoria";

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
                thes.getDataAcumulado();
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
  });
 });