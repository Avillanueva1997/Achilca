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

   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-6N", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr3-6n").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("okr3-6n");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      dateToday = new Date(),
      dateToday = dateToday.toLocaleString(),
      linea_produccion = oEvent.getParameters().data.linea_produccion;
      thes.getScada();
    },
    _onObjectMatched: function(oEvent) {
        var thes = this;
        thes.evaluateButtons();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("okr3-6");
    },
    getScada: function(){
        var thes = this,
        dateToday = new Date(),
        //monthToday = dateToday.getMonth(),
        //dateToday = dateToday.getFullYear() + '-' + ("0" + (dateToday.getMonth()+1)).slice(-2) + '-' + ("0" + dateToday.getDate()).slice(-2),
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        linea_produccion =  pieces[pieces.length - 2],
        moye =  pieces[pieces.length - 1],
        splitMoye = moye.split("."),
        month = splitMoye[0],
        month = Number(month),
        year = splitMoye[1],
        year = Number(year),
        dateFinal,
        area = sessionStorage.area,
        area = thes.getAreaByCode(area),
        role = sessionStorage.role,
        type = false;

        if(dateToday.getFullYear() == year && dateToday.getMonth() == month){
            type = false;
            dateFinal = year + '-' + ("0" + (month+1)).slice(-2) + '-' + ("0" + dateToday.getDate()).slice(-2);
        } else {
            type = true;
            let date = new Date(year, month + 1, 0);
            dateFinal = year + '-' + ("0" + (month +1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
        }

        var parametros = {
            '_fecha': dateFinal,
            '_month': month,
            '_year': year,
            '_lineaProduccion': linea_produccion,
            '_turno': 'B',
            '_Type': type
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
                    let allDate = response[index].fecha;
                    allDate = allDate.split(' ');
                    response[index].fecha = allDate[0];
                    response[index].hrs_pp = Number(response[index].hrs_pp);
                    response[index].factor = Number(response[index].factor); 
                    if(area == 'CALIDAD'){
                        response[index].statusBpm = false;
                        response[index].statusBolaObs = true;
                        response[index].statusScrap = false;
                    } else if(role == "PRODUCCIÓN"){
                        response[index].statusBpm = false;
                        response[index].statusBolaObs = false;
                        response[index].statusScrap = true;
                    } else {
                        response[index].statusBpm = true;
                        response[index].statusBolaObs = true;
                        response[index].statusScrap = true;
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
    onChangeBolaObservadaA: function(oEvent){
        var thes = this;
        var oInput = oEvent.getSource(),
        oValue = oInput.getValue(),
        oValue = Number(oValue),
        oBindingContext = oInput.getBindingContext(),
        sPath = oBindingContext.sPath,
        splitSpath = sPath.split('/'),
        oIndex = splitSpath[splitSpath.length - 1],
        dataModel = thes.getView().getModel().getData(),
        dataPosicion = dataModel[oIndex],
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
        oIndex = splitSpath[splitSpath.length - 1],
        dataModel = thes.getView().getModel().getData(),
        dataPosicion = dataModel[oIndex],
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
    onSave: function(oEvent){
        var thes = this,
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        linea_produccion =  pieces[pieces.length - 2],
        dataTable = thes.getView().getModel().getData(),
        lastCode = thes.getLastCode(),
        lastCode = Number(lastCode);

        for (let index = 0; index < dataTable.length; index++) {
            delete dataTable[index]['statusBpm'];
            delete dataTable[index]['statusBolaObs'];
            delete dataTable[index]['statusScrap'];
            //Object.assign({code: lastCode}, dataTable[index]);
            dataTable[index] = {'code':lastCode, ...dataTable[index]};
            //dataTable[index].unshift({ key: 'code', value: lastCode });
            dataTable[index].linea_produccion = linea_produccion;
            dataTable[index].turno = 'B';
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
        data._LineaProduccion = linea_produccion;
        data._Turno = 'B';

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
    onFreshDataScada: function(oEvent){
        var thes = this;
        thes.getScada();
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
    },
    onReporteProducción: function(oEvent){
        var thes = this ,
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        linea_produccion =  pieces[pieces.length - 2],
        moye =  pieces[pieces.length - 1],
        splitMoye = moye.split("."),
        month = splitMoye[0],
        month = Number(month),
        year = splitMoye[1],
        year = Number(year),
        turno = 'B',
        lastRecord = thes.getLastRecordByTurnoMonth(year, month, linea_produccion, turno),
        date = new Date();

        if(lastRecord.rango && !lastRecord.evaluation){
            date = thes.dateToMysqlDate(date);
        } else if(lastRecord.rango && lastRecord.evaluation) {
            date = date.setDate( date.getDate() - 1 );
            date = new Date(date);
            date = thes.dateToMysqlDate(date);
        }

        thes.getRouter().navTo("okr3-6r", {
            linea_produccion: linea_produccion,
            moye: date,
            turno : turno
        });
    },
    evaluateButtons: function(){
        var thes = this,
        area = sessionStorage.area,
        area = thes.getAreaByCode(area);

        if(area == 'CALIDAD'){
            thes.byId("btnReporte").setVisible(false);            
        } else {
            thes.byId("btnReporte").setVisible(true);   
        }
    },
    getLastRecordByTurnoMonth: function(oKeyYear, codeMonth, oKeyLineaProduccion, turno){
        var thes = this,
        parametros = {
            '_Year': oKeyYear,
            '_Month': codeMonth,
            '_LineaProduccion': oKeyLineaProduccion,
            '_Turno': turno
        },
        data;

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarLastRecordOkrs.php',
            type: 'POST',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                data = response.root;
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
            }
        });

        return data;
    }
  });
 });