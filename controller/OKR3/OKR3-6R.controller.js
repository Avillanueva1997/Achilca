jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast"
 ], function (BaseController, MessageToast) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-6R", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr3-6r").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("okr3-6r");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      linea_produccion = oEvent.getParameters().data.linea_produccion,
      moye = oEvent.getParameters().data.moye,
      turno = oEvent.getParameters().data.turno;

      thes.cargarReporteDetalle(linea_produccion, moye, turno);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarOP();
      thes.cargarMaquina();
      thes.cargarCausa();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("okr3-6");
      thes.byId("txtBC").setText("");
      thes.byId("txtBP").setText("");
      thes.byId("txtBR").setText("");
      thes.byId("txtPT").setText("");
      thes.byId("txtSCR").setText("");
      thes.byId("txtQ").setText("");
      thes.byId("txtLinea").setText("");
      thes.byId("txtDiametro").setText("");
      thes.byId("txtFecha").setText("");
      thes.byId("txtTurno").setText("");
      thes.byId("txtCoord").setText("");
      thes.byId("txtUptime").setText("");
    },
    onAdd: function(oEvent){
        var thes = this;
        $.ajax({
          url:   'model/ENTIDADES/reporte_pro.json', 
          type:  'GET',
          dataType: 'json',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) { 
            var data = thes.byId("TableReporte").getModel().getData();
            var lengthData = data.length;
            var lastNumber = 0;
            if(lengthData != 0){
              lastNumber = data[lengthData - 1].code;
            }
            lastNumber = Number(lastNumber) + 1;
            response.code = lastNumber.toString();
            data.push(response);
            thes.byId("TableReporte").getModel().refresh();
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      onSave: function(oEvent){
        var thes = this,
        datosTabla = thes.byId("TableReporte").getModel().getData(),
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        turno = pieces[pieces.length - 1],
        moye = pieces[pieces.length - 2],
        linea_produccion = pieces[pieces.length - 3];

        for (let index = 0; index < datosTabla.length; index++) {
          datosTabla[index].code_cabecera = moye;            
          datosTabla[index].linea_produccion = linea_produccion;            
          datosTabla[index].turno = turno;            
        }
  
        var datos = {
        "para":[],
        "data":[],
        "camp":[]
        };
  
        var data = {};
        data._Tabla = "reporte_pro_det",
        data._LineaProduccion = linea_produccion,
        data._Turno = turno,
        data._CodeCabecera = moye;
  
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
                  if (datosTabla[i].code == datosTabla[x].code &&
                      datosTabla[i].email == datosTabla[x].email) {
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
                url:   'model/PRO/EliminarDatosReportePro.php', 
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
                  thes.cargarReporteDetalle(linea_produccion, moye, turno);
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
      cargarOP: function(){
        var thes = this;
  
        $.ajax({
          url: 'model/SPRO/ListarOP.php',
          type: 'GET',
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel,"cbxOP");  
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
  
        });
  
      },
      cargarMaquina: function(){
        var thes = this;
  
        $.ajax({
          url: 'model/SPRO/ListarMaquina.php',
          type: 'GET',
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel,"cbxMaquina");  
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
  
        });
  
      },
      cargarCausa: function(){
        var thes = this;
  
        $.ajax({
          url: 'model/SPRO/ListarCausa.php',
          type: 'GET',
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel,"cbxCausa");  
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
  
        });
  
      },
      cargarReporteDetalle: function(linea_produccion, moye, turno){
        debugger;
        var thes = this,
        //code_fecha = thes.getOkrByParametros(linea_produccion, moye, turno),
        //splitCodeFecha = code_fecha.split("."),
        //code = splitCodeFecha[0],
        //fecha = splitCodeFecha[1],
        parametros = {
            '_CodeCab': moye,
            '_LineaProduccion': linea_produccion,
            '_Turno': turno
        };
        thes.setDataOkr(moye, linea_produccion, turno);

        $.ajax({
            data: parametros,
            url:   'model/PRO/ListarReporteDetalle.php', 
            type:  'POST',
            dataType: 'json',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.byId("TableReporte").setModel(oModel);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
      },
      returnReporteDetalle: function(linea_produccion, moye, turno){
        var thes = this,
        parametros = {
            '_Code': moye,
            '_LineaProduccion': linea_produccion,
            '_Turno': turno
        },
        data;

        $.ajax({
            data: parametros,
            url:   'model/PRO/ListarReporteDetalleSecond.php', 
            type:  'POST',
            dataType: 'json',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              data = response;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });

        return data;
      },
      getOkrByParametros: function(linea_produccion, moye, turno){
        var thes = this,
        parametros = {
          '_LineaProduccion': linea_produccion,
          '_Moye': moye,
          '_Turno': turno
        },
        fecha = '',
        code = '';

        $.ajax({
          data: parametros,
          url:   'model/PRO/ListarLastOkrByParametros.php', 
          type:  'POST',
          dataType: 'json',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            if(Array.isArray(response) && response.length == 1){
              code = codeGlobal = response[0].code;
              fecha = response[0].date;
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
      });

      return code + '.' + fecha;
      },
      setDataOkr: function(fecha, linea_produccion, turno){
        debugger;
        var thes = this,
        parametros = {
          '_Fecha': fecha,
          '_LineaProduccion': linea_produccion,
          '_Turno': turno
        };

        $.ajax({
          data: parametros,
          url:   'model/PRO/ListarOkrByParametros.php', 
          type:  'POST',
          dataType: 'json',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            if(Array.isArray(response) && response.length == 1){
              response = response[0];
              let fecha = response.fecha;
              fecha = fecha.split('-');
              fecha = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
              thes.byId("txtBC").setText(response.bar_charg + ' Und');
              thes.byId("txtBP").setText(response.bar_proces + ' Und');
              thes.byId("txtBR").setText(response.bar_reject + ' Und');
              thes.byId("txtPT").setText(response.produccion_neta + ' TM');
              thes.byId("txtSCR").setText(response.scrap + ' TM');
              thes.byId("txtQ").setText(response.bola_observada + ' TM');
              thes.byId("txtLinea").setText(response.linea_produccion);
              thes.byId("txtDiametro").setText(response.diametro);
              thes.byId("txtTurno").setText(response.turno);
              thes.byId("txtCoord").setText(response.coord);
              thes.byId("txtUptime").setText(response.uptime + ' %');
            } else {
              thes.byId("txtBC").setText('0 Und');
              thes.byId("txtBP").setText('0 Und');
              thes.byId("txtBR").setText('0 Und');
              thes.byId("txtPT").setText('0 TM');
              thes.byId("txtSCR").setText('0 TM');
              thes.byId("txtQ").setText('0 TM');
              thes.byId("txtUptime").setText('0 %');
              thes.byId("txtTurno").setText(turno);
              thes.byId("txtLinea").setText(linea_produccion);
            }
            thes.byId("txtFecha").setText(fecha);
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });
      },
      generatePDF: function(){
        debugger;
        var thes = this,
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        turno = pieces[pieces.length - 1],
        moye = pieces[pieces.length - 2],
        splitMoye = moye.split("."),
        month = Number(splitMoye[0]),
        month = thes.getMonthDescription(month),
        year = splitMoye[1],
        linea_produccion = pieces[pieces.length - 3],
        dateString = month + ' ' + year,
        stringDownload =  'Control de Producción ACH - ' + dateString + '.pdf',
        dataTable = thes.returnReporteDetalle(linea_produccion, moye, turno),
        cabeceraTable = [{text: 'Inicio', fillColor: '#215967', style: 'styleHeader', alignment: 'center'}, {text: 'Fin', fillColor: '#215967', style: 'styleHeader', alignment: 'center'}, {text: 'Máquina', fillColor: '#215967', style: 'styleHeader', alignment: 'center'}, {text: 'Causa', fillColor: '#215967', style: 'styleHeader', alignment: 'center'}, {text: 'Comentario', fillColor: '#215967', style: 'styleHeader', alignment: 'center'}, {text:'Horas', fillColor: '#215967', style: 'styleHeader', alignment: 'center'}],
        contentTable = [],
        dataCabecera = thes.getOkrByCode(moye, linea_produccion, turno),
        bar_charg = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.bar_charg: 0,
        bar_charg = bar_charg + ' TM',
        bar_proces = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.bar_proces: 0,
        bar_proces = bar_proces + ' TM',
        bar_reject = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.bar_reject: 0,
        bar_reject = bar_reject + ' TM',
        produccion_neta = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.produccion_neta: 0,
        produccion_neta = produccion_neta + ' TM',
        produccion_acumulado = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.produccion_acumulado: 0,
        produccion_acumulado = produccion_acumulado + ' TM',
        fecha = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.fecha: moye,
        turno_cabecera = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.turno: turno,
        //turno_cabecera = (turno_cabecera == 'A') ? 'Día' : 'Noche',
        coordinador = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.coord: '',
        diametro = (typeof dataCabecera === 'object' && dataCabecera !== null) ? dataCabecera.diametro: '',
        downtime = 0,
        logoMepsaAch = 'data:image/png;base64,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';

        for (let index = 0; index < dataTable.length; index++) {
            let inicio = dataTable[index].inicio;
            inicio = moment(inicio, "HH:mm");
            let fin = dataTable[index].fin;
            fin = moment(fin, "HH:mm");
            var duration = moment.duration(fin.diff(inicio));
            var hours = parseInt(duration.asHours());
            var minutes = parseInt(duration.asMinutes())-hours*60;
            var final = ((hours * 60) + minutes) / 60;
            dataTable[index].horas = final.toFixed(2);
            downtime += Number(dataTable[index].horas);
        }

        downtime = downtime.toFixed(1);
        downtime = downtime + ' h';
        
        if(fecha != ''){
          let split = fecha.split('-');
          fecha = split[2] + '/' + split[1] + '/' + split[0];
        }


        for (let index = 0; index < dataTable.length; index++) {
          let tempArray = [
                            {border: [false, false, false, false], text: dataTable[index].inicio, style: 'styleBody'}, 
                            {border: [false, false, false, false], text: dataTable[index].fin, style: 'styleBody'}, 
                            {border: [false, false, false, false], text: dataTable[index].maquina, style: 'styleBody'}, 
                            {border: [false, false, false, false], text: dataTable[index].causa, style: 'styleBody'}, 
                            {border: [false, false, false, false], text: dataTable[index].comentario, style: 'styleBody'}, 
                            {border: [false, false, false, false], text: dataTable[index].horas, style: 'styleBody'}
                          ];
          contentTable.push(tempArray);          
        }

        contentTable.unshift(cabeceraTable);

        var docDefinition = {
          content: [
            {
              style: 'tableExample',
              layout: {
                hLineWidth: function(i, node) {
                  return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                },
                vLineWidth: function(i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                }
              },
              table: {
                widths: ['*', '*', '*', '*', '*'],
                headerRows: 2,
                body: [
                  [{image: logoMepsaAch, fit:[30,100], colSpan: 2, border: [true, true, false, true]}, {}, { text: 'REPORTE DE PRODUCCIÓN ' + linea_produccion, style: 'tableHeader', colSpan: 3, border: [false, true, true, true] }, {}, {}],
                  [{border: [true, false, false, false], text: 'Barras cargadas:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, false], text: bar_charg, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, false, false], text:'Fecha:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, false], text: fecha, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, true, false], text:'', fillColor: '#eeece1'}],
                  [{border: [true, false, false, false], text: 'Barras Procesadas:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, false], text: bar_proces, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, false, false], text:'Turno:', fillColor: '#eeece1', style: "styleLabel"},{border: [false, false, false, false], text: turno_cabecera, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, true, false], text:'', fillColor: '#eeece1'}],
                  [{border: [true, false, false, false], text: 'Barras Rechazadas:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, false], text: bar_reject, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, false, false], text:'Coordinador:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, false], text: coordinador, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, true, false], text:'', fillColor: '#eeece1'}],
                  [{border: [true, false, false, false], text: '', fillColor: '#eeece1'}, {border: [false, false, false, false], text: '', fillColor: '#eeece1'}, {border: [false, false, false, false], text: '', fillColor: '#eeece1'}, {border: [false, false, false, false], text: '', fillColor: '#eeece1'}, {border: [false, false, true, false], text: '', fillColor: '#eeece1'}],
                  [{border: [true, false, false, false], text: 'Producción:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, false], text: produccion_neta, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, false, false], text: 'Medida:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, false], text: diametro, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, true, false], text: 'Downtime', fillColor: '#eeece1', style: 'styleLabel'}],
                  [{border: [true, false, false, true], text: 'Producción Acumulado:', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, true], text: produccion_acumulado, fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, false, true], text: '', fillColor: '#eeece1', style: "styleLabel"}, {border: [false, false, false, true], text: '', fillColor: '#eeece1', style: 'styleValue'}, {border: [false, false, true, true], text: downtime, fillColor: '#eeece1', style: 'styleLabel'}]
                ]
              }
            },
            { text: 'Detalle de Paradas', style: 'tableHeader', alignment: 'center'},
            {
              style: 'tableExample',
              layout: {
                hLineWidth: function(i, node) {
                  return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                },
                vLineWidth: function(i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                }
              },
              table: {
                widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],
                body: contentTable
              }
            }
          ],
          styles: {
            header: {
              fontSize: 12,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [0, 10, 0, 5]
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            },
            tableOpacityExample: {
              margin: [0, 5, 0, 15],
              fillColor: 'blue',
              fillOpacity: 0.3
            },
            tableHeader: {
              fontSize: 8,
              bold: true
            },
            styleHeader:{
              color: 'white',
              bold: true,
              fontSize: 8
            },
            styleBody:{
              color: 'black',
              fontSize: 8
            },
            styleLabel:{
              color: 'black',
              fontSize: 8,
              bold: true
            },
            styleValue:{
              color: 'black',
              fontSize: 8
            }
          },
          defaultStyle: {
            font: 'Times'
          }
        };

        return docDefinition;

      },
      getOkrByCode: function(fecha, linea, turno){
        var thes = this,
        parametros = {
          '_Fecha': fecha,
          '_LineaProduccion': linea,
          '_Turno': turno
        },
        data;

        $.ajax({
          data: parametros,
          url:   'model/PRO/ListarOkrByCode.php', 
          type:  'POST',
          dataType: 'json',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            if(Array.isArray(response) && response.length == 1){
              data = response[0];
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

        return data;

      },
      sendPDF: function(){
        sap.ui.core.BusyIndicator.show();
        var thes = this,
        fecha = thes.byId("txtFecha").getText(),
        fecha = fecha.split("/").join("."),
        stringDownload =  'Reporte de Producción ACH - ' + fecha + '.pdf',
        /*code = thes.makeRandomCode(10),
        code = code + '.pdf',*/
        docDefinition = thes.generatePDF();

        pdfMake.fonts = {
          Times: {
            normal: 'Times-New-Roman-Normal.ttf',
            bold: 'Times-New-Roman-Bold.ttf',
            italics: 'Times-New-Roman-Italic.ttf',
            bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
          }
        };

        let pdfDocGenerator = pdfMake.createPdf(docDefinition);
        let promiseObject = pdfDocGenerator.getBuffer((buffer) => {
        });
        promiseObject.then(function(buffer) {
          var blob = new Blob([buffer]);
          var reader = new FileReader();
          reader.onload = function(event) {
            var fd = new FormData();
            fd.append('fname', stringDownload);
            fd.append('data', event.target.result);
            $.ajax({
              type: 'POST',
              url: 'model/PRO/UploadReportePRO.php',
              data: fd,
              processData: false,
              contentType: false
            }).done(function(data) {
              if(data == 1){
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Se envió el PDF con éxito.");
              }
            });
          };
          reader.readAsDataURL(blob);
        });

      },
      downloadPDF: function(){
        var thes = this,
        fecha = thes.byId("txtFecha").getText(),
        fecha = fecha.split("/").join("."),
        stringDownload =  'Reporte de Producción ACH - ' + fecha + '.pdf',
        docDefinition = thes.generatePDF();

        pdfMake.fonts = {
          Times: {
            normal: 'Times-New-Roman-Normal.ttf',
            bold: 'Times-New-Roman-Bold.ttf',
            italics: 'Times-New-Roman-Italic.ttf',
            bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
          }
        };

        pdfMake.createPdf(docDefinition).download(stringDownload);
      }
  });
 });