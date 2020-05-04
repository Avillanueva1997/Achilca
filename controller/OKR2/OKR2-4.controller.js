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
   
   return BaseController.extend("sap.ui.app01.controller.OKR2.OKR2-4", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr2-4").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarMonth();
      thes.cargarLinea();
      thes.cargarDiametro();
      thes.cargarDefecto();
      thes.cargarDistBolaObs();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeOKR2");
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
    cargarMonth: function(){
      var thes = this,
      dateToday = new Date(),
      year = dateToday.getFullYear(),
      month = dateToday.getMonth(),
      descripMonth = thes.getMonthDescription(month);
      $.ajax({
        url:   'model/SPRO/ListarMonth.php', 
        type:  'get',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {    
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxMonth");
          thes.byId('btnFilterYear').setSelectedKey(year);
          thes.byId('btnFilterMonth').setSelectedKey(descripMonth);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    cargarDiametro: function(){
      var thes = this;
      $.ajax({
        url:   'model/SPRO/ListarInfoBallDistinct.php', 
        type:  'get',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {    
          response = JSON.parse(response);
          let lastLength = response[response.length - 1].length;
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxDiametro");
          thes.byId("btnFilterDiametro").setSelectedKey(lastLength);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    cargarDefecto: function(){
      var thes = this;
      $.ajax({
        url:   'model/SPRO/ListarDefecto.php', 
        type:  'get',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {    
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxDefecto");  
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    cargarLinea: function(){
      var thes = this,
      parametros = {
        '_status': 1
      };

      $.ajax({
        data: parametros,
        url:   'model/SPRO/ListarLineaProduccionByStatus.php', 
        type:  'post',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {    
          response = JSON.parse(response);
          var firstValue = response[0].code;
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxLinea");
          thes.byId('btnFilterLinea').setSelectedKey(firstValue);
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
        url:   'model/ENTIDADES/dist_bola_obs.json', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) { 
          var data = thes.byId("TableCALIDAD03").getModel().getData();
          data.push(response);
          thes.byId("TableCALIDAD03").getModel().refresh();
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
      datosTabla = thes.byId("TableCALIDAD03").getModel().getData(),
      selectData = thes.byId("TableCALIDAD03").getSelectedContextPaths();

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
      thes.byId("TableCALIDAD03").getModel().setData(newTable);
      thes.byId('TableCALIDAD03').removeSelections();
      thes.byId("TableCALIDAD03").getModel().refresh();
    },
    cargarDistBolaObs: function(){
      var thes = this,
      oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
      oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      oKeyLinea = thes.byId('btnFilterLinea').getSelectedKey(),
      oKeyDiametro = thes.byId('btnFilterDiametro').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_LineaProduccion': oKeyLinea,
        '_Diametro': oKeyDiametro
      };

      $.ajax({
        data: parametros,
        url:   'model/CALIDAD/ListarDistBolaObs.php', 
        type:  'POST',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableCALIDAD03").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onSave: function(oEvent){
      var thes = this,
      oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
      oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      oKeyLinea = thes.byId('btnFilterLinea').getSelectedKey(),
      oKeyDiametro = thes.byId('btnFilterDiametro').getSelectedKey(),
      datosTabla = thes.byId("TableCALIDAD03").getModel().getData(),
      datos = {
      "para":[],
      "data":[],
      "camp":[]
      };

      for (let index = 0; index < datosTabla.length; index++) {
        datosTabla[index].diametro = oKeyDiametro;
        if(datosTabla[index].quantity == '') datosTabla[index].quantity = 0;
      }

      var data = {};
      data._Tabla = "dist_bola_obs";
      data._Year = oKeyYear;
      data._Month = oKeyMonth;
      data._LineaProduccion = oKeyLinea,
      data._Diametro = oKeyDiametro;
      

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
        } else if (datos['data'][0][i]['defecto'] == ""){
          result[i] = 0;  
          MessageToast.show("Complete el campo defecto");
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
              if (datosTabla[i].diametro == datosTabla[x].diametro &&
                 datosTabla[i].defecto == datosTabla[x].defecto) {
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
              url:   'model/CALIDAD/EliminarDatosTablaCalidad03.php', 
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
              url:   'model/CALIDAD/InsertarDinamicoCalidad03.php', 
              type:  'post',
              async: false,
              beforeSend: function () {
              },
              success:  function (response) {
                thes.cargarDistBolaObs();
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