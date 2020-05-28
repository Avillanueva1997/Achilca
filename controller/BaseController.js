sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/core/routing/History",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v2/ODataModel",
  'sap/m/Popover',
  'sap/m/Button',
  "sap/m/Label",
  'sap/m/library',
  'sap/ui/core/BusyIndicator'
], function (Controller, MessageToast, History, JSONModel, ODataModel, Popover, Button, Label, mobileLibrary, BusyIndicator) {
  "use strict";

  var ButtonType = mobileLibrary.ButtonType,
  PlacementType = mobileLibrary.PlacementType;

  return Controller.extend("sap.ui.app01.controller.BaseController", {

    getRouter : function () {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },
    onUserNamePress: function (event) {
      var thes = this;
      var popover = new Popover({
        showHeader: false,
        placement: PlacementType.Bottom,
        content:[
          new Button({
            text: 'Mis datos',
            type: ButtonType.Transparent
          }),
          new Button({
            text: 'Salir',
            type: ButtonType.Transparent,
            press: function () {
              thes.getRouter().navTo("login");
              if (thes.getRouter().navTo("login")) {
                sessionStorage.clear();
              }
            }
          })
        ]
      }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

      popover.openBy(event.getSource());
    },
    onPress: function(oEvent){
      var thes = this;
      var oSource = oEvent.getSource(),
      bindingContext = oSource.getBindingContext(),
      sPath = bindingContext.sPath,
      splitSpath = sPath.split('/'),
      index = splitSpath[2],
      model = splitSpath[1],
      dataModel = oSource.getParent().getModel().getData(),
      dataIndex = dataModel[model][index],
      view = dataIndex.view;
      thes.showBusyIndicator(3000, 0);
      thes.getRouter().navTo(view);
    },
    onPressDinamic: function(oEvent){
      var thes = this;
      var oSource = oEvent.getSource(),
      bindingContext = oSource.getBindingContext(),
      sPath = bindingContext.sPath,
      splitSpath = sPath.split('/'),
      index = splitSpath[2],
      model = splitSpath[1],
      dataModel = thes.getView().getModel().getData(),
      dataIndex = dataModel[model][index],
      view = dataIndex.view,
      splitView = view.split('-'),
      linea_produccion = splitView[splitView.length - 1],
      newView = splitView[0]+'-'+splitView[1]+'-LP';
      thes.showBusyIndicator(3000, 0);
      
      thes.getRouter().navTo(newView, {
          linea_produccion: linea_produccion
      });
    },
    onPressJustDiametro: function(oEvent){
      var thes = this;
      var oSource = oEvent.getSource(),
      bindingContext = oSource.getBindingContext(),
      sPath = bindingContext.sPath,
      splitSpath = sPath.split('/'),
      index = splitSpath[2],
      model = splitSpath[1],
      dataModel = thes.getView().getModel().getData(),
      dataIndex = dataModel[model][index],
      view = dataIndex.view,
      splitView = view.split('-'),
      diametro = splitView[splitView.length - 1],
      newView = splitView[0]+'-'+splitView[1]+'-D';
      thes.showBusyIndicator(3000, 0);
      
      thes.getRouter().navTo(newView, {
          diametro: diametro
      });
    },
    onPressDinamicDiametro: function(oEvent){
      var thes = this;
      var oSource = oEvent.getSource(),
      bindingContext = oSource.getBindingContext(),
      sPath = bindingContext.sPath,
      splitSpath = sPath.split('/'),
      index = splitSpath[2],
      model = splitSpath[1],
      dataModel = thes.getView().getModel().getData(),
      dataIndex = dataModel[model][index],
      view = dataIndex.view,
      splitView = view.split('-'),
      linea_produccion = splitView[splitView.length - 2],
      diametro = splitView[splitView.length - 1],
      newView = splitView[0]+'-'+splitView[1]+'-LP-D';
      thes.showBusyIndicator(3000, 0);
      
      thes.getRouter().navTo(newView, {
          linea_produccion: linea_produccion,
          diametro: diametro
      });
    },
    onTeam: function(oEvent){
      var thes = this;
      thes.showBusyIndicator(3000, 0);
      thes.getRouter().navTo('team');
    },
    onKpi: function(oEvent){
      var thes = this;
      thes.showBusyIndicator(3000, 0);
      thes.getRouter().navTo('kpi');
    },
    validateNumber: function(oEvent){
      const pattern = /[0-9\+\-\ ]/;
      var input = oEvent.getSource();
      var str = input.getValue();

      var last = str.slice(-1);

      if (!pattern.test(last)) {
          input.setValue(str.slice(0, str.length - 1));
          MessageToast.show("Ingrese solo números");
      }
    },
    getCodeMonth: function(month){
        var code;
        switch (month) {
            case 'ENERO':
                code = 0;
                break;
            case 'FEBRERO':
                code = 1;
                break;
            case 'MARZO':
                code = 2;
                break;
            case 'ABRIL':
                code = 3;
                break;
            case 'MAYO':
                code = 4;
                break;
            case 'JUNIO':
                code = 5;
                break;
            case 'JULIO':
                code = 6;
                break;
            case 'AGOSTO':
                code = 7;
                break;
            case 'SETIEMBRE':
                code = 8;
                break;
            case 'OCTUBRE':
                code = 9;
                break;
            case 'NOVIEMBRE':
                code = 10;
                break;
            case 'DICIEMBRE':
                code = 11;
                break;        
            default:
                break;
        }

        return code;
    },
    getMonthDescription: function(month){
        var description;
        switch (month) {
            case 0:
                description = 'ENERO';
                break;
            case 1:
                description = 'FEBRERO';
                break;
            case 2:
                description = 'MARZO';
                break;
            case 3:
                description = 'ABRIL';
                break;
            case 4:
                description = 'MAYO';
                break;
            case 5:
                description = 'JUNIO';
                break;
            case 6:
                description = 'JULIO';
                break;
            case 7:
                description = 'AGOSTO';
                break;
            case 8:
                description = 'SETIEMBRE';
                break;
            case 9:
                description = 'OCTUBRE';
                break;
            case 10:
                description = 'NOVIEMBRE';
                break;
            case 11:
                description = 'DICIEMBRE';
                break;        
            default:
                break;
        }

        return description;
    },
    removeFeeds: function(id){
      var thes = this;
      var oVizFrame = thes.byId(id);
      oVizFrame.destroyDataset();
      oVizFrame.destroyFeeds();
    },
    pad: function(number) {
      if (number < 10) {
          return '0' + number;
      }
      return number;
    },
    addDays: function(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    onLogout: function(){
      var thes = this;
      thes.getRouter().navTo("login");
      if (thes.getRouter().navTo("login")) {
        sessionStorage.clear();
      }
    },
    onGeneratePDF: function(){
      var thes = this;
      thes.getRouter().navTo('pdf');
    },
    renameKey: function(obj, old_key, new_key) {    
      if (old_key !== new_key) {                   
        Object.defineProperty(obj, new_key,
        Object.getOwnPropertyDescriptor(obj, old_key)); 
        delete obj[old_key];
      } 
    },
    twoDigits: function(d) {
      if(0 <= d && d < 10) return "0" + d.toString();
      if(-10 < d && d < 0) return "-0" + (-1*d).toString();
      return d.toString();
    },
    dateToMysqlDatetime: function(date){
      var thes = this;
        return date.getFullYear() + "-" + thes.twoDigits(1 + date.getMonth()) + "-" + thes.twoDigits(date.getDate()) + " " + thes.twoDigits(date.getHours()) + ":" + thes.twoDigits(date.getMinutes()) + ":" + thes.twoDigits(date.getSeconds());
    },
    dateToMysqlDate: function(date){
      var thes = this;
        return date.getFullYear() + "-" + thes.twoDigits(1 + date.getMonth()) + "-" + thes.twoDigits(date.getDate());
    },
    dateMysqlToJsDate: function(dateString){
      var splitDateString = dateString.split("-"),
      year = splitDateString[0],
      month = splitDateString[1],
      day = splitDateString[2],
      date = new Date(year, month-1, day);

      return date;
    },
    makeRandomCode: function(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   },
    getAreaByCode: function(code){
    var thes = this,
    parametros = {
      '_Code': code,
    },
    data;

    $.ajax({
      data: parametros,
      url: 'model/SPRO/ListarAreaByCode.php',
      type: 'post',
      async: false,
      beforeSend: function(){},
      success: function(response){
        response = JSON.parse(response);
        data = (Array.isArray(response) && response.length == 1) ? response[0]['area'] : '';
      },
      error:  function(xhr, thrownError, ajaxOptions){
          alert(xhr.status);
          alert(thrownError);
      }
    });

    return data;
    },
    getUserByCode: function(code){
      var thes = this,
      parametros = {
        '_Code': code,
      },
      data;
  
      $.ajax({
        data: parametros,
        url: 'model/SPRO/ListarUserByCode.php',
        type: 'post',
        async: false,
        beforeSend: function(){},
        success: function(response){
          response = JSON.parse(response);
          data = (Array.isArray(response) && response.length == 1) ? response[0]['nameComplete'] : '';
        },
        error:  function(xhr, thrownError, ajaxOptions){
            alert(xhr.status);
            alert(thrownError);
        }
      });
  
      return data;
      },
    OnPressIcon: function(event){
      var thes = this;
      var popover = new Popover({
        showHeader: false,
        placement: PlacementType.Bottom,
        content:[
          new Label({ text: '2.4'}),
        ]
      }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

      popover.openBy(event.getSource());
    },
        getDataType: function(){
      var thes = this;
      var dataType = [
        {
          code: '01',
          description: 'Evento'
        },
        {
          code: '02',
          description: 'Actividad'
        },
        {
          code: '03',
          description: 'Reasignación'
        }
      ];

      var oModel = thes.getView().getModel();
      oModel.setProperty("/dataType", dataType);
    },
    cargarAreas: function(){
      var thes = this;
      $.ajax({
        url:   'model/SPRO/ListarAreas.php', 
        type:  'GET',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          var oModel = thes.getView().getModel();
          oModel.setProperty("/dataArea", response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    cargarUsuarios: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarUsuarioComplete.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          var oModel = thes.getView().getModel();
          oModel.setProperty("/dataResponsable", response);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    cargarActividadesByEvento: function(parametros){
      var thes = this;
      $.ajax({
          data: parametros,
          url:   'model/PA/ListarActividadesPA.php', 
          type:  'POST',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            response = JSON.parse(response);
            var oModel = thes.getView().getModel();
            oModel.setProperty("/dataActividades", response);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
    },
    getResponsableByArea: function(code){
      var thes = this,
      parametros = {
        '_Code': code
      },
      data = '';

      $.ajax({
        data: parametros,
        url:   'model/SPRO/ListarResponsableByArea.php', 
        type:  'post',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          if(Array.isArray(response) && response.length == 1) data = response[response.length - 1].email;
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

      return data;
    },
    operateDate: function(fecha, dias){
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    },
    hideBusyIndicator : function() {
      BusyIndicator.hide();
		},
		showBusyIndicator : function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function() {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
    },
  });
});
