jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast",
 "sap/m/MessageBox",
 'sap/m/Label',
 'sap/m/Popover',
 "sap/ui/core/format/DateFormat",
 'sap/ui/core/Fragment',
 'sap/base/Log',
 "sap/ui/unified/library",
 './Formatter'
 ], function (BaseController, jQuery, JSONModel, MessageToast, MessageBox, Label, Popover, DateFormat, Fragment, Log, unifiedLibrary, Formatter) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.PRO.PRO03", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("pro03").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.getLineaProduccion();
      thes.cargarYear();
      thes.cargarMonth();
      thes.getScada();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homePRO");
    },

    rebindTable: function(oTemplate, sKeyboardMode) {
        this.oTable.bindItems({
            path: "/ProductCollection",
            template: oTemplate,
            key: "ProductId"
        }).setKeyboardMode(sKeyboardMode);
    },

    onEdit: function() {
        this.aProductCollection = jQuery.extend(true, [], this.oModel.getProperty("/ProductCollection"));
        this.byId("editButton").setVisible(false);
        this.byId("saveButton").setVisible(true);
        this.byId("cancelButton").setVisible(true);
        this.rebindTable(this.oEditableTemplate, "Edit");
    },

    onSave: function() {
        this.byId("saveButton").setVisible(false);
        this.byId("cancelButton").setVisible(false);
        this.byId("editButton").setVisible(true);
        this.rebindTable(this.oReadOnlyTemplate, "Navigation");
    },

    onCancel: function() {
        this.byId("cancelButton").setVisible(false);
        this.byId("saveButton").setVisible(false);
        this.byId("editButton").setVisible(true);
        this.oModel.setProperty("/ProductCollection", this.aProductCollection);
        this.rebindTable(this.oReadOnlyTemplate, "Navigation");
    },

    onOrder: function() {
        MessageToast.show("Order button pressed");
    },

    onExit: function() {
        this.aProductCollection = [];
        this.oEditableTemplate.destroy();
        this.oModel.destroy();
    },

    onPaste: function(oEvent) {
        var aData = oEvent.getParameter("data");
        sap.m.MessageToast.show("Pasted Data: " + aData);
    },

    getOkrs: function(){
        var thes = this;

        $.ajax({
            url: 'model/PRO/ListarOkrs.php',
            type: 'GET',
            async: false,
            beforeSend: function(){},
            success: function(response){
                
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },

    getScada: function(){
        var thes = this,
        dateToday = new Date(),
        monthToday = dateToday.getMonth(),
        dateToday = dateToday.toLocaleString(),
        oTab = thes.byId('idIconTabBarNoIcons'),
        oKey = oTab.getSelectedKey(),
        parametros = {
            '_fecha': dateToday,
            '_lineaProduccion': oKey,
            '_turno': 'A'
        };

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarDataScada.php',
            type: 'POST',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                for (let index = 0; index < response.length; index++) {
                    let allDate = response[index].fecha.date;
                    let splitAllDate = allDate.split(' ');
                    let splitJustDate = splitAllDate[0].split('-');
                    response[index].fecha = splitJustDate[0] + '-' + splitJustDate[1] + '-' + splitJustDate[2];
                    response[index].hrs_pp = Number(response[index].hrs_pp);
                    response[index].factor = Number(response[index].factor); 
                }
                thes.getView().getModel().setProperty('/dataLinea', response);
            },
            error: function(xhr, ajaxOptions, thrownError){
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

    onChangeBolaObservadaA: function(oEvent){
        var thes = this;
        var oInput = oEvent.getSource(),
        oValue = oInput.getValue(),
        oValue = Number(oValue),
        oBindingContext = oInput.getBindingContext(),
        sPath = oBindingContext.sPath,
        splitSpath = sPath.split('/'),
        oModel = splitSpath[1],
        oIndex = splitSpath[2],
        dataModel = thes.getView().getModel().getData(),
        dataPosicion = dataModel[oModel][oIndex],
        produccionNeta = 0,
        valueEficiencia = 0,
        uptime = 0,
        calidad = 0,
        oee = 0,
        por_cumplimiento = 0;

        produccionNeta = Number(dataPosicion.carga_fria) - (oValue + Number(dataPosicion.barra_rechazada) + Number(dataPosicion.scrap) + Number(dataPosicion.cascarilla));
        produccionNeta = produccionNeta % 1 != 0 ?  produccionNeta.toFixed(2):  produccionNeta;
        dataPosicion.produccion_neta = Number(produccionNeta);
        if(Number(dataPosicion.carga_fria) != 0){
            valueEficiencia = Number(dataPosicion.produccion_neta) / Number(dataPosicion.carga_fria);
            valueEficiencia = valueEficiencia * 100;
            valueEficiencia = valueEficiencia % 1 != 0 ? valueEficiencia.toFixed(2): valueEficiencia; 
        }
        dataPosicion.eficiencia = Number(valueEficiencia);
        uptime = ((Number(dataPosicion.produccion_neta) + Number(oValue) + Number(dataPosicion.scrap)) / (((Number(dataPosicion.sobre_peso) / 100) + 1) * Number(dataPosicion.weight) * Number(dataPosicion.bpm) * 60 / 1000)) /(12 - Number(dataPosicion.hrs_pp));
        uptime = uptime * 100;
        uptime = uptime % 1 != 0 ? uptime.toFixed(2): uptime;
        dataPosicion.uptime = Number(uptime);
        if(Number(dataPosicion.produccion_neta) > 0){
            calidad = (Number(dataPosicion.produccion_neta) / (Number(dataPosicion.produccion_neta) + Number(oValue)));
            calidad = calidad * 100;
            calidad = calidad % 1 != 0 ? calidad.toFixed(2): calidad;
        }
        dataPosicion.calidad = Number(calidad);
        oee = (Number(dataPosicion.uptime) / 100) * (Number(dataPosicion.rendimiento) / 100) * (Number(dataPosicion.eficiencia) / 100);
        oee = oee * 100;
        oee = oee % 1 != 0 ? oee.toFixed(2) : oee;
        dataPosicion.oee = Number(oee);
        por_cumplimiento = Number(dataPosicion.produccion_neta) / Number(dataPosicion.cuota);
        por_cumplimiento = por_cumplimiento * 100;
        por_cumplimiento = por_cumplimiento % 1 != 0 ? por_cumplimiento.toFixed(2): por_cumplimiento;
        dataPosicion.por_cumplimiento = Number(por_cumplimiento); 
    },

    onChangeScrapA: function(oEvent){
        var thes = this;
        var oInput = oEvent.getSource(),
        oValue = oInput.getValue(),
        oValue = Number(oValue),
        oBindingContext = oInput.getBindingContext(),
        sPath = oBindingContext.sPath,
        splitSpath = sPath.split('/'),
        oModel = splitSpath[1],
        oIndex = splitSpath[2],
        dataModel = thes.getView().getModel().getData(),
        dataPosicion = dataModel[oModel][oIndex],
        produccionNeta = 0,
        valueEficiencia = 0,
        uptime = 0,
        calidad = 0,
        oee = 0,
        por_cumplimiento = 0;

        produccionNeta = Number(dataPosicion.carga_fria) - (Number(dataPosicion.bola_observada) + Number(dataPosicion.barra_rechazada) + oValue + Number(dataPosicion.cascarilla));
        produccionNeta = produccionNeta % 1 != 0?produccionNeta.toFixed(2):produccionNeta;
        dataPosicion.produccion_neta = Number(produccionNeta);
        if(Number(dataPosicion.carga_fria) != 0){
            valueEficiencia = Number(dataPosicion.produccion_neta) / Number(dataPosicion.carga_fria);
            valueEficiencia = valueEficiencia * 100;
            valueEficiencia = valueEficiencia % 1 != 0?valueEficiencia.toFixed(2):valueEficiencia;
        }
        dataPosicion.eficiencia = Number(valueEficiencia);
        uptime = ((Number(dataPosicion.produccion_neta) + Number(dataPosicion.bola_observada) + Number(oValue)) / (((Number(dataPosicion.sobre_peso) / 100) + 1) * Number(dataPosicion.weight) * Number(dataPosicion.bpm) * 60 / 1000)) /(12 - Number(dataPosicion.hrs_pp));
        uptime = uptime * 100;
        uptime = uptime % 1 != 0? uptime.toFixed(2):uptime;
        dataPosicion.uptime = Number(uptime);
        if(Number(dataPosicion.produccion_neta) > 0){
            calidad = (Number(dataPosicion.produccion_neta) / (Number(dataPosicion.produccion_neta) + Number(dataPosicion.bola_observada)));
            calidad = calidad * 100;
            calidad = calidad % 1 != 0 ? calidad.toFixed(2):calidad;
        }
        dataPosicion.calidad = Number(calidad);
        oee = (Number(dataPosicion.uptime) / 100) * (Number(dataPosicion.rendimiento) / 100) * (Number(dataPosicion.eficiencia) / 100);
        oee = oee * 100;
        oee = oee % 1 != 0?oee.toFixed(2):oee;
        dataPosicion.oee = Number(oee);
        por_cumplimiento = Number(dataPosicion.produccion_neta) / Number(dataPosicion.cuota);
        por_cumplimiento = por_cumplimiento * 100;
        por_cumplimiento = por_cumplimiento % 1 != 0?por_cumplimiento.toFixed(2):por_cumplimiento;
        dataPosicion.por_cumplimiento = Number(por_cumplimiento); 

    },
    onNextPage:function(oEvent){
        var thes = this,
        oTab = thes.byId('idIconTabBarNoIcons'),
        oKey = oTab.getSelectedKey();
        thes.getRouter().navTo("pro03n", {
            linea_produccion: oKey
        });

    },
    onChangeBPM: function(oEvent){
        var thes = this;
        var oInput = oEvent.getSource(),
        oValue = oInput.getValue(),
        oValue = Number(oValue),
        oBindingContext = oInput.getBindingContext(),
        sPath = oBindingContext.sPath,
        splitSpath = sPath.split('/'),
        oModel = splitSpath[1],
        oIndex = splitSpath[2],
        dataModel = thes.getView().getModel().getData(),
        dataPosicion = dataModel[oModel][oIndex],
        uptime = 0,
        rendimiento = 0,
        oee = 0,
        produccionNeta = Number(dataPosicion.produccion_neta),
        bolaObservada = Number(dataPosicion.bola_observada),
        scrap = Number(dataPosicion.scrap),
        sobrePeso = Number(dataPosicion.sobre_peso),
        weight = Number(dataPosicion.weight),
        hrsPP = Number(dataPosicion.hrs_pp),
        bpmReal = Number(dataPosicion.bpmReal),
        eficiencia = Number(dataPosicion.eficiencia);

        uptime = ((produccionNeta + bolaObservada + scrap) / (((sobrePeso / 100) + 1) * weight * oValue * 60 / 1000)) / (12 - hrsPP);
        uptime = uptime * 100;
        uptime = uptime % 1 != 0?uptime.toFixed(2):uptime;
        dataPosicion.uptime = Number(uptime);
        rendimiento =  Number(oValue) / Number(bpmReal);
        rendimiento = rendimiento * 100;
        rendimiento = rendimiento % 1 != 0 ? rendimiento.toFixed(2):rendimiento;
        dataPosicion.rendimiento = Number(rendimiento);
        oee = (uptime / 100) * (rendimiento / 100) * (Number(eficiencia) / 100);
        oee = oee * 100;
        oee = oee % 1 != 0 ? oee.toFixed(2):oee;
        dataPosicion.oee = Number(oee);
    },
    onSave: function(){
        var thes = this,
        oTab = thes.byId('idIconTabBarNoIcons'),
        oKey = oTab.getSelectedKey(),
        dataTable = thes.getView().getModel().getData().dataLinea,
        lastCode = thes.getLastCode(),
        lastCode = Number(lastCode);

        for (let index = 0; index < dataTable.length; index++) {
            dataTable[index] = {'code':lastCode, ...dataTable[index]};
            dataTable[index].linea_produccion = oKey;
            dataTable[index].turno = 'A';
            lastCode++;
        }

        var datos = {
        "para":[],
        "data":[],
        "camp":[]
        };

        var firstDate = dataTable[0].fecha,
        endDate = dataTable[dataTable.length - 1 ].fecha,
        data = {};

        data._Tabla = "okrs";
        data._FirstDate = firstDate;
        data._EndDate = endDate;
        data._LineaProduccion = oKey;
        data._Turno = 'A';

        datos.para.push(data);
        datos.data.push(dataTable);
        if(dataTable.length != 0){
            datos.camp.push(Object.keys(dataTable[0]));
        }

            $.ajax({
            data:  data,
            url:   'model/PRO/EliminarDatosOkrs.php', 
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
            url:   'model/PRO/InsertarOkrs.php', 
            type:  'post',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
                thes.getScada();
                MessageToast.show("Se grabó con éxito");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
            });
    },
    getLastCode: function(){
        var data;
        $.ajax({
            url: 'model/PRO/ObtenerLastCodeOkrs.php',
            type: 'GET',
            async: false,
            beforeSend:  function(){},
            success: function(response){
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
            }
        });

        return data;
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
    onFilter: function(oEvent){
        var thes = this,
        oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
        oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey();
        
        console.log(oKeyYear);
        console.log(oKeyMonth);
    },
    onFreshDataScada: function(oEvent){
        var thes = this;
        thes.getScada();
    },
    onShowSecondTable: function(oEvent){
        var thes = this,
        oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
        oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
        codeMonth = thes.getCodeMonth(oKeyMonth),

        oKeyLineaProduccion = thes.byId('idIconTabBarNoIcons').getSelectedKey();

        thes.getRouter().navTo("pro03m", {
            linea_produccion: oKeyLineaProduccion,
            moye: codeMonth + '.' + oKeyYear
        });
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
    confirmSave: function(){
        var thes = this;
        sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
            icon: MessageBox.Icon.INFORMATION,
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function(oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                    thes.onSave();
                }
            }
        });
    }
  });
 });