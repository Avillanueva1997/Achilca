jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast"
 ], function (BaseController, jQuery, JSONModel, MessageToast) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.SP02-1.SP02-1-1-C", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sp02-1-1-c").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarMonth();
      thes.getAreas();
      thes.cargarData();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("sp02-1-1");
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
        month = thes.getMonthDescription(Number(month));
  
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
            thes.byId('cbxYear').setSelectedKey(year);
            thes.byId('cbxMonth').setSelectedKey(month);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      onAdd: function(oEvent){
        var thes = this,
        oMonth = thes.byId("cbxMonth").getSelectedKey(),
        oMonth = thes.getCodeMonth(oMonth),
        oMonth = Number(oMonth),
        oMonth = oMonth,
        oYear = thes.byId("cbxYear").getSelectedKey(),
        oYear = Number(oYear),
        firstDay = new Date(oYear, oMonth, 1),
        lastDay = new Date(oYear, oMonth + 1, 0);

        $.ajax({
          url:   'model/ENTIDADES/cumplimiento_entregas_apt.json', 
          type:  'GET',
          dataType: 'json',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) { 
            var data = thes.byId("TableKPI").getModel().getData();
            var lengthData = data.length;
            var lastNumber = 0;
            if(lengthData != 0){
              lastNumber = data[lengthData - 1].code;
            }
            lastNumber = Number(lastNumber) + 1;
            response.code = lastNumber.toString();
            response.month = oMonth + 1;
            response.year = oYear;
            response.minDate = firstDay;
            response.maxDate = lastDay;
            data.push(response);
            thes.byId("TableKPI").getModel().refresh(true);
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
        datosTabla = thes.byId("TableKPI").getModel().getData(),
        selectData = thes.byId("TableKPI").getSelectedContextPaths();
  
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
        thes.byId("TableKPI").getModel().setData(newTable);
        thes.byId('TableKPI').removeSelections();
        thes.byId("TableKPI").getModel().refresh();
      },
      onSave: function(oEvent){
        var thes = this,
        datosTabla = thes.byId("TableKPI").getModel().getData(),
        datos = {
        "para":[],
        "data":[],
        "camp":[]
        },
        data = {},
        oMonth = thes.byId('cbxMonth').getSelectedKey(),
        oMonth = thes.getCodeMonth(oMonth),
        oMonth = oMonth + 1,
        oYear = thes.byId('cbxYear').getSelectedKey();

        if(datosTabla.length != 0){
          data._Tabla = "cumplimiento_entregas_apt";
          data._Month = oMonth;
          data._Year = oYear;
    
          datos.para.push(data);
          datos.data.push(datosTabla);
    
          var ultimo = datos['data'][0].length - 1;
    
          var result = []; 
    
          for (var i = 0 ; i <= ultimo; i++) {
            if (datos['data'][0][i]['code'] == ""){
              result[i] = 0;  
              MessageToast.show("Complete el campo código");
            } else if(datos['data'][0][i]['date_event'] == ""){
              result[i] = 0;  
              MessageToast.show("Complete el campo fecha");
            } else if(datos['data'][0][i]['entrega_proy'] === ""){
              result[i] = 0;  
              MessageToast.show("Complete el campo entregas proy");
            } else if(datos['data'][0][i]['entrega_real'] === ""){
              result[i] = 0;  
              MessageToast.show("Complete el campo entregas reales");
            } else if(datos['data'][0][i]['comments'] === ""){
              result[i] = 0;  
              MessageToast.show("Complete el campo comentario");
            } else if(datos['data'][0][i]['area'] === ""){
              result[i] = 0;  
              MessageToast.show("Complete el campo área");
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
                    if (datosTabla[i].code == datosTabla[x].code &&
                        datosTabla[i].date_event == datosTabla[x].date_event) {
                      flag = "X";
                    } 
                  }
                }
              }
    
    
            if(flag == "X") { 
              MessageToast.show("Existen Duplicados"); 
            }else{

              for (let index = 0; index < datos.data[0].length; index++) {
                delete datos.data[0][index].minDate;
                delete datos.data[0][index].maxDate;
                delete datos.data[0][index].State;
              }

              if(datosTabla.length != 0){
                datos.camp.push(Object.keys(datosTabla[0]));
              }
    
              $.ajax({
                data:  data,
                url:   'model/SP/EliminarDatosKPI.php', 
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
        } else {
          MessageToast.show("Ingrese información a la tabla!"); 
        }
      },
      cargarData: function(){
        var thes = this,
        oMonth = thes.byId("cbxMonth").getSelectedKey(),
        oMonth = thes.getCodeMonth(oMonth),
        oYear = thes.byId("cbxYear").getSelectedKey(),
        firstDay = new Date(Number(oYear), Number(oMonth), 1),
        lastDay = new Date(Number(oYear), Number(oMonth) + 1, 0),
        parametros = {
          '_Month': oMonth,
          '_Year': oYear
        };

        $.ajax({
          data: parametros,
          url:   'model/SP/ListarKPICumplimientoEntregasAPT.php', 
          type:  'POST',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            response = JSON.parse(response);
            if(Array.isArray(response) && response.length > 0){
              for (let index = 0; index < response.length; index++) {
                response[index].minDate = firstDay;
                response[index].maxDate = lastDay;
                if(response[index].porcentaje_cumplimiento > 90){
                  response[index].State = 'Success';
                } else if(response[index].porcentaje_cumplimiento < 80){
                  response[index].State = 'Error';
                } else if(response[index].porcentaje_cumplimiento >= 80 && response[index].porcentaje_cumplimiento <= 90){
                  response[index].State = 'Warning';                  
                } else {
                  response[index].State = 'None';
                }
              }
            }
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.byId("TableKPI").setModel(oModel);
            thes.evaluateLabelInfo();
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      evaluateEntregaProy: function(oEvent){
        var thes = this,
        input = oEvent.getSource(),
        str = input.getValue(),
        last = str.slice(-1),
        sPath = input.getBindingContext().sPath;

        const pattern = /[0-9\+\-\ ]/;
  
        if (!pattern.test(last)) {
            input.setValue(str.slice(0, str.length - 1));
            MessageToast.show("Ingrese solo números");
        } else {
          let dataIndex = thes.byId("TableKPI").getModel().getProperty(sPath);
          let entregaProy = Number(str);
          dataIndex.porcentaje_cumplimiento = Number(dataIndex.entrega_real) / entregaProy;
          dataIndex.porcentaje_cumplimiento *= 100;
          dataIndex.porcentaje_cumplimiento = Math.round(dataIndex.porcentaje_cumplimiento);
        }
      },
      evaluateEntregaReal: function(oEvent){
        var thes = this,
        input = oEvent.getSource(),
        str = input.getValue(),
        last = str.slice(-1),
        sPath = input.getBindingContext().sPath;

        const pattern = /[0-9\+\-\ ]/;
  
        if (!pattern.test(last)) {
            input.setValue(str.slice(0, str.length - 1));
            MessageToast.show("Ingrese solo números");
        } else {
          let dataIndex = thes.byId("TableKPI").getModel().getProperty(sPath);
          let entregaReal = Number(str);
          dataIndex.porcentaje_cumplimiento =  entregaReal / Number(dataIndex.entrega_proy);
          dataIndex.porcentaje_cumplimiento *= 100;
          dataIndex.porcentaje_cumplimiento = Math.round(dataIndex.porcentaje_cumplimiento);
        }
      },
      evaluateLabelInfo: function(){
        var thes = this,
        dataTable = thes.byId("TableKPI").getModel().getData(),
        proy = 0,
        real = 0,
        avance = 0;
        for (let index = 0; index < dataTable.length; index++) {
          proy += Number(dataTable[index].entrega_proy);
          real += Number(dataTable[index].entrega_real);      
        }

        real = Number(real);
        proy = Number(proy);

        real = Math.round(real);
        proy = Math.round(proy);

        avance = (proy != 0) ? real / proy : 0;
        avance *= 100;
        avance = Math.round(avance);

        thes.byId("lblProy").setText("PROY (" + proy + ")");
        thes.byId("lblReal").setText("REAL (" + real + ")");
        thes.byId("lblAvance").setText("AVANCE (" + avance + "%)");
      },
      getAreas: function(){
        var thes = this;
  
        $.ajax({
          url: 'model/SPRO/ListarAreas.php',
          type: 'GET',
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response); 
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel,"cbxArea");  
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
  
        });
  
      },
  });
 });