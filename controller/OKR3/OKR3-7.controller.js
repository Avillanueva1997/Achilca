jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
    "sap/ui/app01/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/DatePicker",
    'sap/m/TextArea',
    "sap/m/Button"
 ], function (BaseController, MessageToast, Dialog, Label, DatePicker,  TextArea, Button ) {
   "use strict";
   
   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-7", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr3-7").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarActividad();
      thes.getLineaProduccion();
      thes.cargarMonth();
      thes.getData();  
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeOKR3");
    },
    cargarYear: function(){
      var thes = this,
      date = new Date(),
      year = date.getFullYear();

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
          thes.byId('btnFilterYear').setSelectedKey(year);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    cargarActividad: function(){
      var thes = this,
      actividad = '';
      $.ajax({
        url:   'model/ENTIDADES/actividades.json', 
        type:  'GET',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          actividad = response[0].description;
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxActividad");  
          thes.byId('btnFilterActividad').setSelectedKey(actividad);
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
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },

    getLineaProduccion: function(){
        var thes = this;
        var parametros = {
            '_status': 1
        };

        $.ajax({
            data: parametros,
            url: 'model/SPRO/ListarLineaProduccionByStatus.php',
            type: 'POST',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                var oModel = new sap.ui.model.json.JSONModel(response);
                thes.getView().setModel(oModel);
                let firstKey = response[0].code;
                thes.byId('idIconTabBarNoIcons').setSelectedKey(firstKey);
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },

    getData: function(){
      var thes = this,
        oTab = thes.byId('idIconTabBarNoIcons'),
        oLineaProduccion = oTab.getSelectedKey(),
        oYear = thes.byId('btnFilterYear').getSelectedKey(),
        oActividad = thes.byId('btnFilterActividad').getSelectedKey(),
        parametros = {
            '_Year': oYear,
            '_LineaProduccion': oLineaProduccion,
            '_Actividad': oActividad
        };

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarDataDatabase.php',
            type: 'POST',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                /*for (let index = 0; index < response.length; index++) {
                    let allDate = response[index].fecha.date;
                    let splitAllDate = allDate.split(' ');
                    let splitJustDate = splitAllDate[0].split('-');
                    response[index].fecha = splitJustDate[0] + '-' + splitJustDate[1] + '-' + splitJustDate[2];
                    response[index].hrs_pp = Number(response[index].hrs_pp);
                    response[index].factor = Number(response[index].factor); 
                }*/
                thes.getView().getModel().setProperty('/dataLinea', response);
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
            }
        });
    }
  });
 });