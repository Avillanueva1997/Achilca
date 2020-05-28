jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast",
 "sap/m/MessageBox"
 ], function (BaseController, MessageToast, MessageBox) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.SPRO.SPRO08", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("spro08").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarInfoBarra();
      thes.cargarProducts();
    },
    cargarInfoBarra: function(){
      var thes = this;
      $.ajax({
        url:   'model/SPRO/ListarInfoBarra.php', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableSPRO08").setModel(oModel);
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
        url:   'model/ENTIDADES/roundBar.json', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) { 
          var data = thes.byId("TableSPRO08").getModel().getData();
          var lengthData = data.length;
          var lastNumber = 0;
          if(lengthData != 0){
            lastNumber = data[lengthData - 1].code;
          }
          lastNumber = Number(lastNumber) + 1;
          response.code = lastNumber.toString();
          data.push(response);
          thes.byId("TableSPRO08").getModel().refresh();
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
      datosTabla = thes.byId("TableSPRO08").getModel().getData(),
      selectData = thes.byId("TableSPRO08").getSelectedContextPaths();

      if(selectData.length > 0){
        sap.m.MessageBox.warning("¿Estás seguro de eliminar esta información?", {
          actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
          emphasizedAction: MessageBox.Action.YES ,
          onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
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
              thes.byId("TableSPRO08").getModel().setData(newTable);
              thes.byId('TableSPRO08').removeSelections();
              thes.byId("TableSPRO08").getModel().refresh();
            }
          }
        });
      } else {
        MessageToast.show("Seleccione fila");
      }
    },
    onSave: function(oEvent){
      var thes = this;       

      var datosTabla = thes.byId("TableSPRO08").getModel().getData();

      var datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      var data = {};
      data._Tabla = "info_barra";

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
                thes.cargarInfoBarra();
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
    onNavBack: function(oEvent) {
      var thes = this;
      thes.showBusyIndicator(3000, 0);
thes.getRouter().navTo("homeSPRO");
    },
    cargarProducts:function(){
      var thes = this;

      $.ajax({
        url:   'model/SPRO/ListarProducts.php', 
        type:  'get',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {    
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxProduct");  
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    }
  });
 });