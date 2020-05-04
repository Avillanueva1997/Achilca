jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast"
 ], function (BaseController, MessageToast) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.SIG.SIG01", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sig01").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("sig01");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      info = oEvent.getParameters().data.info;
      //thes.setTitlePage(info);
      thes.getDataSIG(info);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeSIG");
    },
    setTitlePage: function(info){
        var thes = this,
        oPage = thes.byId('pagePrincipal'),
        info = info.toUpperCase();
        oPage.setTitle(info);
    },
    getDataSIG: function(info){
      var thes = this,
      parametros = {
        '_Table': info
      };

      $.ajax({
        data: parametros,
        url: 'model/SIG/ListarDataTable.php',
        type: 'POST',
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
    onAdd: function(oEvent){
      var thes = this;
      $.ajax({
        url:   'model/ENTIDADES/sig.json', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) { 
          var data = thes.byId("TableData").getModel().getData();
          var lengthData = data.length;
          var lastNumber = 0;
          if(lengthData != 0){
            let lastCode = data[lengthData - 1].code;
            let splitLastCode = lastCode.split("A");
            lastNumber = splitLastCode[splitLastCode.length - 1];
          }
          lastNumber = Number(lastNumber) + 1;
          lastNumber = 'A' + lastNumber;
          response.code = lastNumber.toString();
          data.push(response);
          thes.byId("TableData").getModel().refresh();
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
      datosTabla = thes.byId("TableData").getModel().getData(),
      selectData = thes.byId("TableData").getSelectedContextPaths();

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
      thes.byId("TableData").getModel().setData(newTable);
      thes.byId('TableData').removeSelections();
      thes.byId("TableData").getModel().refresh();
    },
    onSave: function(oEvent){
      var thes = this,
      datosTabla = thes.byId("TableData").getModel().getData(),
      datos = {
      "para":[],
      "data":[],
      "camp":[]
      },
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      table = pieces[pieces.length - 1];

      for (var i = 0; i < datosTabla.length; i++) {
        if(datosTabla[i].no_cfd_mayor == "") datosTabla[i].no_cfd_mayor = 0;
        if(datosTabla[i].no_cfd_menor == "") datosTabla[i].no_cfd_menor = 0;
        if(datosTabla[i].obs == "") datosTabla[i].obs = 0;
      }

      var data = {};
      data._Tabla = table;

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
                thes.getDataSIG(table);
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