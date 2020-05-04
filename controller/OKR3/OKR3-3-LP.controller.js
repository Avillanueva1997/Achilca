jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format',
 "sap/m/MessageToast",
 "sap/m/MessageBox",
 "sap/m/Label",
 'sap/m/Link',
 'sap/m/Text',
 'sap/ui/model/json/JSONModel',
 '../OKR1/Formatter',
 'sap/ui/core/Fragment',
 "sap/ui/model/Filter"
 ], function (BaseController, ChartFormatter, Format, MessageToast, MessageBox, Label, Link, Text, JSONModel, Formatter, Fragment, Filter) {
   "use strict";
   
   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-3-LP", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr3-3-LP").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.evaluateButtons();
      thes.cargarYear();
      thes.cargarMonth();
      thes.generateChartN1();
      thes.generateChartN2();
      thes.generateChartN3();
      thes.generateChartN4();
      thes.generateChartN5();
      thes.openFragmentPA();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("okr3-3");
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
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      dateToday = new Date(),
      year,
      month;

      if(pieces.length == 8){
        let Moye = pieces[pieces.length - 1];
        Moye = Moye.split('.');
        year = Moye[1];
        month = Moye[0];
      } else {
        year = dateToday.getFullYear();
        month = dateToday.getMonth();
      }

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
    generateChartN1: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      oKeyMonth = thes.byId('cbxMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': linea_produccion
      };
      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/OEE/GenerarChartN1.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
              name : 'Uptime',
              value : "{uptime}"}
            ],                           
            measures : [{
              name : 'Cantidad',
              value : '{quantity}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('donut');
          
          oVizFrame.setVizProperties({
              interaction: {
                selectability: {
                  mode: "NONE"        //only one data point can be selected at a time
                }
              },
              plotArea: {
                dataLabel: {
                  visible: true
                },
                colorPalette:['#31859c', '#dae3f3']
              },
              legend: {
                visible: false
              },
              title: {
                text: "Uptime " + linea_produccion
              },
              valueAxis: {
                label: {
                  formatString: formatPattern.SHORTFLOAT_MFD2
                },
                title: {
                    visible: false
                }
              },
              categoryAxis: {
                  title: {
                      visible: false
                  }
              }
            }
          );
          
          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "size",
                'type': "Measure",
                'values': ["Cantidad"]
              }),    
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["Uptime"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedCategoryAxis);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      })
    },
    generateChartN2: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      oKeyMonth = thes.byId('cbxMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': linea_produccion
      };
      thes.removeFeeds('idChart2');
      var oVizFrame = thes.byId('idChart2');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/OEE/GenerarChartN2.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
              name : 'Rendimiento',
              value : "{rendimiento}"}
            ],                           
            measures : [{
              name : 'Cantidad',
              value : '{quantity}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('donut');
          
          oVizFrame.setVizProperties({
              interaction: {
                selectability: {
                  mode: "NONE"        //only one data point can be selected at a time
                }
              },
              plotArea: {
                dataLabel: {
                  visible: true
                },
                colorPalette:['#31859c', '#dae3f3']
              },
              legend: {
                visible: false
              },
              title: {
                text: "Rendimiento " + linea_produccion
              },
              valueAxis: {
                label: {
                  formatString: formatPattern.SHORTFLOAT_MFD2
                },
                title: {
                    visible: false
                }
              },
              categoryAxis: {
                  title: {
                      visible: false
                  }
              }
            }
          );
          
          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "size",
                'type': "Measure",
                'values': ["Cantidad"]
              }),    
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["Rendimiento"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedCategoryAxis);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      })
    },
    generateChartN3: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      oKeyMonth = thes.byId('cbxMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': linea_produccion
      };
      thes.removeFeeds('idChart3');
      var oVizFrame = thes.byId('idChart3');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/OEE/GenerarChartN3.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
              name : 'Eficiencia',
              value : "{eficiencia}"}
            ],                           
            measures : [{
              name : 'Cantidad',
              value : '{quantity}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('donut');
          
          oVizFrame.setVizProperties({
              interaction: {
                selectability: {
                  mode: "NONE"        //only one data point can be selected at a time
                }
              },
              plotArea: {
                dataLabel: {
                  visible: true
                },
                colorPalette:['#31859c', '#dae3f3']
              },
              legend: {
                visible: false
              },
              title: {
                text: "Eficiencia " + linea_produccion
              },
              valueAxis: {
                label: {
                  formatString: formatPattern.SHORTFLOAT_MFD2
                },
                title: {
                    visible: false
                }
              },
              categoryAxis: {
                  title: {
                      visible: false
                  }
              }
            }
          );
          
          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "size",
                'type': "Measure",
                'values': ["Cantidad"]
              }),    
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["Eficiencia"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedCategoryAxis);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      })
    },
    generateChartN4: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      oKeyMonth = thes.byId('cbxMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': linea_produccion
      };
      thes.removeFeeds('idChart4');
      var oVizFrame = thes.byId('idChart4');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/OEE/GenerarChartN4.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
              name : 'OEE',
              value : "{oee}"}
            ],                           
            measures : [{
              name : 'Cantidad',
              value : '{quantity}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('donut');
          
          oVizFrame.setVizProperties({
              interaction: {
                selectability: {
                  mode: "NONE"        //only one data point can be selected at a time
                }
              },
              plotArea: {
                dataLabel: {
                  visible: true
                },
                colorPalette:['#31859c', '#dae3f3']
              },
              legend: {
                visible: false
              },
              title: {
                text: "OEE " + linea_produccion
              },
              valueAxis: {
                label: {
                  formatString: formatPattern.SHORTFLOAT_MFD2
                },
                title: {
                    visible: false
                }
              },
              categoryAxis: {
                  title: {
                      visible: false
                  }
              }
            }
          );
          
          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "size",
                'type': "Measure",
                'values': ["Cantidad"]
              }),    
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["OEE"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedCategoryAxis);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      })
    },
    generateChartN5: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      oKeyMonth = thes.byId('cbxMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': linea_produccion
      };
      thes.removeFeeds('idChart5');
      var oVizFrame = thes.byId('idChart5');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/OEE/GenerarChartN5.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          for (let index = 0; index < response.length; index++) {
            response[index]['meta'] = 0.7;            
          }
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
              name : 'Fecha',
              value : "{fecha}"}
            ],                           
            measures : [{
              name : 'Uptime',
              value : '{uptime}'
            },
            {
              name : 'Rendimiento',
              value : '{rendimiento}'
            },
            {
              name : 'Eficiencia',
              value : '{eficiencia}'
            },
            {
              name : 'OEE',
              value : '{oee}'
            },
            {
              name : 'Meta',
              value : '{meta}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('line');
          
          oVizFrame.setVizProperties({
              interaction: {
                selectability: {
                  mode: "NONE"        //only one data point can be selected at a time
                }
              },
              plotArea: {
                dataPointStyle: {
                  "rules":
                  [
                    {
                      "dataContext": {"Uptime": {min: 0}},
                      "properties": {
                          "color":"#7f7f7f",
                          "lineColor": "#7f7f7f",
                          "lineType": "dash"
                      },
                      "displayName": 'Uptime'
                    },
                    {
                      "dataContext": {"Rendimiento": {min: 0}},
                      "properties": {
                          "color":"#948a54",
                          "lineColor": "#948a54",
                          "lineType": "dash"
                      },
                      "displayName": 'Rendimiento'
                    },
                    {
                      "dataContext": {"Eficiencia": {min: 0}},
                      "properties": {
                          "color":"#70ad47",
                          "lineColor": "#70ad47",
                          "lineType": "dash"
                      },
                      "displayName": 'Eficiencia'
                    },
                    {
                      "dataContext": {"OEE": {min: 0}},
                      "properties": {
                          "color":"#215968",
                          "lineColor": "#215968"
                      },
                      "displayName": 'OEE'
                    },
                    {
                      "dataContext": {"Meta": {min: 0}},
                      "properties": {
                          "color":"#1b1e23",
                          "lineColor": "#1b1e23"
                      },
                      "displayName": 'Meta: ' + 70 + '%'
                    }
                  ]
                },
                window: {
                  start: "firstDataPoint",
                  end: "lastDataPoint"
                },
                dataLabel: {
                  formatString: formatPattern.STANDARDPERCENT_MFD2,
                  visible: true,
                  renderer: function(oLabel) {
                    oLabel.text = "";
                    if(oLabel.ctx.measureNames == "Uptime"){
                      let uptime = oLabel.ctx.Uptime * 100;
                      uptime = uptime.toFixed(1);
                      oLabel.ctx.Uptime = uptime;
                    } else if(oLabel.ctx.measureNames == "Rendimiento"){
                      let rendimiento = oLabel.ctx.Rendimiento * 100;
                      rendimiento = rendimiento.toFixed(1);
                      oLabel.ctx.Rendimiento = rendimiento;
                    } else if(oLabel.ctx.measureNames == "Eficiencia"){
                      let eficiencia = oLabel.ctx.Eficiencia * 100;
                      eficiencia = eficiencia.toFixed(1);
                      oLabel.ctx.Eficiencia = eficiencia;
                    } else if(oLabel.ctx.measureNames == "OEE"){
                      let oee = oLabel.ctx.OEE * 100;
                      oee = oee.toFixed(1);
                      oLabel.ctx.OEE = oee;
                    } else if(oLabel.ctx.measureNames == "Meta"){
                      let meta = oLabel.ctx.Meta * 100;
                      meta = meta.toFixed(1);
                      oLabel.ctx.Meta = meta;
                    }
                  }
                }
              },
              legendGroup:{
                layout: {
                  position: "bottom",
                  alignment: "center"
                },
              },
              title: {
                text: "OEE " + linea_produccion
              },
              valueAxis: {
                label: {
                  formatString: formatPattern.STANDARDPERCENT_MFD2
                },
                title: {
                    visible: false
                }
              },
              categoryAxis: {
                  title: {
                      visible: false
                  }
              }
            }
          );
          
          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Uptime"]
              }),
              feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Rendimiento"]
              }),
              feedValueAxisThird = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Eficiencia"]
              }),
              feedValueAxisFour = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["OEE"]
              }),
              feedValueAxisFive = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Meta"]
              }),
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Fecha"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedValueAxisSecond);
          oVizFrame.addFeed(feedValueAxisThird);
          oVizFrame.addFeed(feedValueAxisFour);
          oVizFrame.addFeed(feedValueAxisFive);
          oVizFrame.addFeed(feedCategoryAxis);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onChangeData: function(oEvent){
      var thes = this;
      thes.generateChartN1();
      thes.generateChartN2();
      thes.generateChartN3();
      thes.generateChartN4();
      thes.generateChartN5();
    },
    onPlanAccion: function(){
      var thes = this,
      area = sessionStorage.area,
      area = thes.getAreaByCode(area),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1];

      thes.getDataType();

      this._arrangeDialogFragment("Agregar Objetivo: OEE", "dialogPA", linea_produccion);

    },
    onSearchPA: function(oEvent){
      var thes = this;
      /*var thes = this,
      value = oEvent.getSource().getValue();
      console.log(value);*/

      			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("activity", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = thes.byId("TablePA");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
    },
    _arrangeDialogFragment: function (iDialogTitle, idDialog, LineaProduccion) {
      if (!this._oNewAppointmentDialog) {
        Fragment.load({
          id: idDialog,
          name: "sap.ui.app01.view.Fragments.CreatePASIMA",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialog = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialog);
            this._arrangeDialog(iDialogTitle, LineaProduccion);
          }.bind(this));
      } else {
        this._arrangeDialog(iDialogTitle, LineaProduccion);
      }
    },
    _arrangeDialog: function(iDialogTitle, LineaProduccion) {
      this.updateButtonEnabledState();
      this._oNewAppointmentDialog.setTitle(iDialogTitle);
      this._oNewAppointmentDialog.LineaProduccion = LineaProduccion;
      this._oNewAppointmentDialog.open();
    },
    updateButtonEnabledState: function (oEvent) {
      var thes = this,
      oDataType = Fragment.byId("dialogPA", "cbxDataType"),
      oKeyDataType = oDataType.getSelectedKey(),
      oEvento = Fragment.byId("dialogPA", "iptEvento"),
      oValueEvento = oEvento.getValue(),
      oFechaEvento = Fragment.byId("dialogPA", "datepickerFechaEvento"),
      oValueFechaEvento = oFechaEvento.getDateValue(),
      oCbxEvento = Fragment.byId("dialogPA", "cbxEvento"),
      oSelectedKeyCbxEvento = oCbxEvento.getSelectedKey(),
      oIptActividad = Fragment.byId("dialogPA", "iptActividad"),
      oValueIptActividad = oIptActividad.getValue(),
      oFechaEjec = Fragment.byId("dialogPA", "datepickerFechaEje"),
      oValueFechaEjec = oFechaEjec.getDateValue(),
      oCbxArea = Fragment.byId("dialogPA", "cbxArea"),
      oSelectedKeyCbxArea = oCbxArea.getSelectedKey(),
      oCbxResponsable = Fragment.byId("dialogPA", "cbxResponsable"),
      oSelectedKeyCbxResponsable = oCbxResponsable.getSelectedKey(),
      oCbxActividad = Fragment.byId("dialogPA", "cbxActividad"),
      oSelectedKeyCbxActividad = oCbxActividad.getSelectedKey(),

      oLabelEvento = Fragment.byId("dialogPA", "lblEvento"),
      oLabelFechaEvento = Fragment.byId("dialogPA", "lblFechaEvento"),
      oLabelSecondEvento = Fragment.byId("dialogPA", "lblSecondEvento"),
      oLabelActividad = Fragment.byId("dialogPA", "lblActividad"),
      oLabelFechaEje = Fragment.byId("dialogPA", "lblFechaEje"),
      oLabelArea = Fragment.byId("dialogPA", "lblArea"),
      oLabelResponsable = Fragment.byId("dialogPA", "lblResponsable"),
      oLabelSecondActividad = Fragment.byId("dialogPA", "lblActividadSecond"),
      //type = this._oNewAppointmentDialog.Type,
      linea_produccion = this._oNewAppointmentDialog.LineaProduccion;

      if(oKeyDataType != ''){
        if(oKeyDataType == '01'){
          oLabelSecondEvento.setVisible(false);
          oLabelActividad.setVisible(false);
          oLabelFechaEje.setVisible(false);
          oLabelArea.setVisible(false);
          oLabelResponsable.setVisible(false);
          oLabelSecondActividad.setVisible(false);
          oCbxEvento.setVisible(false);
          oIptActividad.setVisible(false);
          oFechaEjec.setVisible(false);
          oCbxArea.setVisible(false);
          oCbxResponsable.setVisible(false);
          oCbxActividad.setVisible(false);

          oEvento.setVisible(true);
          oFechaEvento.setVisible(true);
          oLabelEvento.setVisible(true);
          oLabelFechaEvento.setVisible(true);
          if(oValueEvento != '' && oValueFechaEvento != null){
            this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
          } else {
            this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
          }
        } else {
          oEvento.setVisible(false);
          oFechaEvento.setVisible(false);
          oLabelEvento.setVisible(false);
          oLabelFechaEvento.setVisible(false);
          if(oKeyDataType == '02'){
            thes.cargarEventos(linea_produccion);
            thes.cargarAreas();
            thes.cargarUsuarios();
            oLabelSecondEvento.setVisible(true);
            oLabelActividad.setVisible(true);
            oLabelFechaEje.setVisible(true);
            oLabelArea.setVisible(true);
            oLabelResponsable.setVisible(true);
            oCbxEvento.setVisible(true);
            oIptActividad.setVisible(true);
            oFechaEjec.setVisible(true);
            oCbxArea.setVisible(true);
            oCbxResponsable.setVisible(true);
            oLabelSecondActividad.setVisible(false);
            oCbxActividad.setVisible(false);
            if(oSelectedKeyCbxEvento != '' && oValueIptActividad != '' && oValueFechaEjec != null && oSelectedKeyCbxArea != '' && oSelectedKeyCbxResponsable != ''){
              this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
            } else {
              this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
            }
          } else {
            thes.cargarEventos(linea_produccion);
            thes.cargarUsuarios();
            oLabelSecondActividad.setVisible(true);
            oCbxActividad.setVisible(true);
            oLabelSecondEvento.setVisible(true);
            oLabelActividad.setVisible(false);
            oLabelFechaEje.setVisible(false);
            oLabelArea.setVisible(false);
            oLabelResponsable.setVisible(true);
            oCbxEvento.setVisible(true);
            oIptActividad.setVisible(false);
            oFechaEjec.setVisible(false);
            oCbxArea.setVisible(false);
            oCbxResponsable.setVisible(true);
            if(oSelectedKeyCbxEvento != ''){
              let parametros = {
                '_CodeCab': oSelectedKeyCbxEvento,
                '_Table': 'pa_produccion_det'
              };
              thes.cargarActividadesByEvento(parametros);
              if(oSelectedKeyCbxActividad != '' && oSelectedKeyCbxResponsable != ''){
                this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
              } else {
                this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
              }
            }
          }
        }
      } else {
        this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
      }
    },
    cargarEventos: function(linea_produccion){
      var thes = this,
      parametros = {
        '_Table': 'pa_produccion_cab',
        '_TipoEvento': 'OEE',
        '_LineaProduccion': linea_produccion
      };

      $.ajax({
          data: parametros,
          url:   'model/PA/ListarEventosPA.php', 
          type:  'POST',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            response = JSON.parse(response);
            var oModel = thes.getView().getModel();
            oModel.setProperty("/dataEvento", response);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
    },
    openFragmentPA: function(){
      var thes = this,
      oView = thes.getView(),
      oDialog = oView.byId("DialogPA"),
      areaUser = sessionStorage.area,
      areaUser = thes.getAreaByCode(areaUser);

      if(areaUser == 'PRODUCCIÓN'){
        if (!oDialog) {
          oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.app01.view.Fragments.PA", this);
          oView.addDependent(oDialog);
        }

        oDialog.open();
        thes.setInit();

      }
    },
    sCollection: "/EventHierarchy",
		aCrumbs: ["Eventos", "Actividades"],
		mInitialOrderState: {
			products: {},
			count: 0,
			hasCounts: false
		},
    setInit: function(){
      var thes = this,
      title = 'Plan de Acción: Producción';

      thes.getMonth();
      thes.cargarActivities();

      thes.byId("lblTitlePA").setText(title);
      thes.getView().setModel(new JSONModel(this.mInitialOrderState), "Order");

			if (!this.oTemplate) {
				this.oTemplate = sap.ui.xmlfragment("sap.ui.app01.view.Fragments.Breadcrumb");
			}
			this._oTable = this.byId("TablePA");

			var sPath = this._getInitialPath();
			this._setAggregation(sPath);
    },
    // Initial path is the first crumb appended to the collection root
		_getInitialPath: function () {
			return [this.sCollection, this.aCrumbs[0]].join("/");
    },
    _setAggregation: function (sPath) {
      var thes = this,
      user = sessionStorage.user,
      area = sessionStorage.area,
      emailResponsable = thes.getResponsableByArea(area),
      sPathEnd = sPath.split("/").reverse()[0];

      thes.byId("filterRange").setFrom(null);
      thes.byId("filterRange").setTo(null);
      thes.byId("filterMonth").setSelectedKey("");
      thes.byId("filterSearch").setValue();

			if (sPathEnd === this.aCrumbs[this.aCrumbs.length - 1]) {
        if(user == emailResponsable){
          thes.byId("btnStatus").setVisible(true);
          thes.byId("btnEdit").setVisible(true);
        } else {
          thes.byId("btnStatus").setVisible(false);
          thes.byId("btnEdit").setVisible(false);
        }
        this._oTable.setMode("SingleSelectMaster");
        thes.byId("filterMonth").setVisible(false);
        thes.byId("filterRange").setVisible(false);
        thes.byId("btnClearFilter").setVisible(false);
				this.byId("columnActividad").setVisible(true);
        this.byId("columnFechaEje").setVisible(true);
        this.byId("columnArea").setVisible(true);
        this.byId("columnResponsable").setVisible(true);
        this.byId("columnTipoEvento").setVisible(false);
        this.byId("columnEvento").setVisible(false);
        this.byId("columnFechaEvento").setVisible(false);
			} else {
        if(user == emailResponsable || user != emailResponsable){
          thes.byId("btnStatus").setVisible(false);
          thes.byId("btnEdit").setVisible(false);
        }
        thes.byId("filterMonth").setVisible(true);
        thes.byId("filterRange").setVisible(true);
        thes.byId("btnClearFilter").setVisible(true);
				this._oTable.setMode("SingleSelectMaster");
        this.byId("columnActividad").setVisible(false);
        this.byId("columnFechaEje").setVisible(false);
        this.byId("columnArea").setVisible(false);
        this.byId("columnResponsable").setVisible(false);
        this.byId("columnTipoEvento").setVisible(true);
        this.byId("columnEvento").setVisible(true);
        this.byId("columnFechaEvento").setVisible(true);
			}

			// Set the new aggregation
			this._oTable.bindAggregation("items", sPath, this.oTemplate);

			this._maintainCrumbLinks(sPath);
    },
    _maintainCrumbLinks: function (sPath) {
			// Determine trail parts
			var aPaths = [];
			var aParts = sPath.split("/");
			while (aParts.length > 1) {
				aPaths.unshift(aParts.join("/"));
				aParts = aParts.slice(0, aParts.length - 2);
			}

			// Re-build crumb toolbar based on trail parts
			var oCrumbToolbar = this.byId("idCrumbToolbar");
			oCrumbToolbar.destroyContent();

			aPaths.forEach(jQuery.proxy(function (sPath, iPathIndex) {

				var bIsFirst = iPathIndex === 0;
				var bIsLast = iPathIndex === aPaths.length - 1;

				// Special case for 1st crumb: fixed text
				var sText = bIsFirst ? this.aCrumbs[0] : "{code}";

				// Context is one level up in path
				var sContext = this._stripItemBinding(sPath);

				var oCrumb = bIsLast
					? new Text({
						text: sText
					}).addStyleClass("crumbLast")
					: new Link({
						text: sText,
						target: sPath,
						press: [this.handleLinkPress, this]
					});
				oCrumb.bindElement(sContext);

				oCrumbToolbar.addContent(oCrumb);
				if (!bIsLast) {
					var oArrow = new Label({
						textAlign: "Center",
						text: ">"
					}).addStyleClass("crumbArrow");
					oCrumbToolbar.addContent(oArrow);
				}

			}, this));
    },
    		// Remove the numeric item binding from a path
		_stripItemBinding: function (sPath) {
			var aParts = sPath.split("/");
			return aParts.slice(0, aParts.length - 1).join("/");
    },
    onExitPA: function() {
      var thes = this;
      thes.getView().byId("DialogPA").close();
    },
    handleSelectionChange: function (oEvent) {
      var thes = this,
      sPath = oEvent.getParameter("listItem").getBindingContext().getPath(),
      aPath = sPath.split("/"),
      sCurrentCrumb = aPath[aPath.length - 2];

      if (sCurrentCrumb === this.aCrumbs[this.aCrumbs.length - 1]) {
				var oSelectionInfo = {};
				var bSelected = oEvent.getParameter("selected");
				oEvent.getParameter("listItems").forEach(function (oItem) {
					oSelectionInfo[oItem.getBindingContext().getPath()] = bSelected;
				});
				this._updateOrder(oSelectionInfo);
			} else {
        sap.m.MessageBox.confirm("¿A dónde se quiere dirigir?", {
          actions: ["Actividades", "OKR", MessageBox.Action.CLOSE],
          emphasizedAction: MessageBox.Action.CLOSE ,
          onClose: function(oAction) {
            if(oAction == "Actividades"){
              var sNewPath = [sPath, thes._nextCrumb(sCurrentCrumb)].join("/");
              thes._setAggregation(sNewPath);
            } else if(oAction == "OKR"){
              var selectedPath = thes._oTable.getSelectedContextPaths();
        
              if(selectedPath.length > 0){
                selectedPath = selectedPath[0];
                selectedPath = selectedPath.split("/");
                var index = selectedPath[selectedPath.length - 1],  
                oData = thes.getView().getModel().getData(),
                dataIndex = oData.EventHierarchy.Eventos[index],
                fechaEvento = dataIndex.fecha_evento,
                jsDateFechaEvento = thes.dateMysqlToJsDate(fechaEvento),
                monthFechaEvento = jsDateFechaEvento.getMonth(),
                monthDescription = thes.getMonthDescription(monthFechaEvento),
                yearFechaEvento = jsDateFechaEvento.getFullYear();
              
                thes.byId("cbxYear").setSelectedKey(yearFechaEvento);
                thes.byId("cbxMonth").setSelectedKey(monthDescription);
                
                thes.getView().byId("DialogPA").close();
        
                thes.onChangeData();
        
              } else {
                MessageToast.show('Seleccioné actividad!');
              }
            } else {
              thes._oTable.removeSelections();
            }
          }
        });
      }
    },
    		// Add to the order based on the selection
		_updateOrder: function (oSelectionInfo) {
			var oOrderModel = this.getView().getModel("Order");
			oOrderModel.setData({products: oSelectionInfo}, true);
			var aProductsSelected = Formatter.listProductsSelected(this.getView());
			oOrderModel.setData({
				count: aProductsSelected.length,
				hasCounts: aProductsSelected.length > 0
			}, true);
    },
    _nextCrumb: function (sCrumb) {
			for (var i = 0, ii = this.aCrumbs.length; i < ii; i++) {
				if (this.aCrumbs[i] === sCrumb) {
					return this.aCrumbs[i + 1];
				}
			}
    },
    handleLinkPress: function (oEvent) {
      var thes = this;
      thes.cargarActivities();
			this._setAggregation(oEvent.getSource().getTarget());
    },
    cargarActivities: function(){
      var thes = this,
      areaUser = sessionStorage.area,
      areaUser = thes.getAreaByCode(areaUser),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      table = 'pa_produccion',
      parametros = {
        '_Table': table,
        '_LineaProduccion': linea_produccion,
        '_TipoEvento': 'OEE'
      };

      $.ajax({
          data: parametros,
          url:   'model/PA/ListarPaByTipoEvento.php', 
          type:  'POST',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            response = JSON.parse(response);
            for (let index = 0; index < response.EventHierarchy.Eventos.length; index++) {
              if(response.EventHierarchy.Eventos[index]['status'] == 1){
                response.EventHierarchy.Eventos[index]['status'] = '#ff0000';
              } else if(response.EventHierarchy.Eventos[index]['status'] == 2){
                response.EventHierarchy.Eventos[index]['status'] = '#008f39';
              } else if(response.EventHierarchy.Eventos[index]['status'] == 3){
                response.EventHierarchy.Eventos[index]['status'] = '#f8f32b';
              } else {
                response.EventHierarchy.Eventos[index]['status'] = '#fff';
              }
              if(response.EventHierarchy.Eventos[index].Actividades){
                for (let y = 0; y < response.EventHierarchy.Eventos[index].Actividades.length; y++) { 
                  if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 1){
                    response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#ff0000';
                  } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 2){
                    response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#008f39';
                  } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 3){
                    response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#f8f32b';
                  } else {
                    response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#fff';
                  }               
                }
              }
            }
            var oModel = new sap.ui.model.json.JSONModel(response);
            thes.getView().setModel(oModel);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
    },
    handleDialogSaveButton:function(){
      var thes = this,
      oDataType = Fragment.byId("dialogPA", "cbxDataType"),
      oKeyDataType = oDataType.getSelectedKey(),
      oEvento = Fragment.byId("dialogPA", "iptEvento"),
      oValueEvento = oEvento.getValue(),
      oFechaEvento = Fragment.byId("dialogPA", "datepickerFechaEvento"),
      oValueFechaEvento = oFechaEvento.getDateValue(),
      oCbxEvento = Fragment.byId("dialogPA", "cbxEvento"),
      oSelectedKeyCbxEvento = oCbxEvento.getSelectedKey(),
      oIptActividad = Fragment.byId("dialogPA", "iptActividad"),
      oValueIptActividad = oIptActividad.getValue(),
      oFechaEjec = Fragment.byId("dialogPA", "datepickerFechaEje"),
      oValueFechaEjec = oFechaEjec.getDateValue(),
      oCbxArea = Fragment.byId("dialogPA", "cbxArea"),
      oSelectedKeyCbxArea = oCbxArea.getSelectedKey(),
      oCbxResponsable = Fragment.byId("dialogPA", "cbxResponsable"),
      oSelectedKeyCbxResponsable = oCbxResponsable.getSelectedKey(),
      user = sessionStorage.user,
      oLabelEvento = Fragment.byId("dialogPA", "lblEvento"),
      oLabelFechaEvento = Fragment.byId("dialogPA", "lblFechaEvento"),
      oLabelSecondEvento = Fragment.byId("dialogPA", "lblSecondEvento"),
      oLabelActividad = Fragment.byId("dialogPA", "lblActividad"),
      oLabelFechaEje = Fragment.byId("dialogPA", "lblFechaEje"),
      oLabelArea = Fragment.byId("dialogPA", "lblArea"),
      oLabelResponsable = Fragment.byId("dialogPA", "lblResponsable"),
      oCbxActividad = Fragment.byId("dialogPA", "cbxActividad"),
      oSelectedKeyCbxActividad = oCbxActividad.getSelectedKey(),
      oLabelSecondActividad = Fragment.byId("dialogPA", "lblActividadSecond"),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1];

      if(oKeyDataType == '01'){
        sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
          icon: MessageBox.Icon.INFORMATION,
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              let fechaEventoString = thes.dateToMysqlDate(oValueFechaEvento);
              let table = 'pa_produccion_cab';
              let parametros = {
                '_Evento': oValueEvento,
                '_FechaEvento': fechaEventoString,
                '_Usuario': user,
                '_TipoEvento': 'OEE',
                '_LineaProduccion': linea_produccion,
                '_Table': table
              };
              thes.saveEvento(parametros);
              thes.handleDialogCancelButton();
            }
          }
        });
      } else if(oKeyDataType == '02'){
        sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
          icon: MessageBox.Icon.INFORMATION,
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              let fechaEjeString = thes.dateToMysqlDate(oValueFechaEjec);
              let table = 'pa_produccion_det';
              let parametros = {
                '_Evento': oSelectedKeyCbxEvento,
                '_Actividad': oValueIptActividad,
                '_FechaEje': fechaEjeString,
                '_Area':oSelectedKeyCbxArea,
                '_Responsable':oSelectedKeyCbxResponsable,
                '_Usuario': user,
                '_Table': table
              };
              thes.saveActividad(parametros);
              thes.handleDialogCancelButton();
            }
          }
        });
      } else if(oKeyDataType == '03'){
        sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
          icon: MessageBox.Icon.INFORMATION,
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              let table = 'pa_produccion_det';
              let parametros = {
                '_Code': oSelectedKeyCbxActividad,
                '_CodeCab': oSelectedKeyCbxEvento,
                '_Responsable': oSelectedKeyCbxResponsable,
                '_Usuario': user,
                '_Table': table
              };
              thes.saveReasignacion(parametros);
              thes.handleDialogCancelButton();
            }
          }
        });
      }

    },
    saveEvento: function(parametros){
      var thes = this;
      $.ajax({
        data: parametros,
        url: 'model/PA/InsertarEventoPA.php',
        type: 'POST',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          response = response.root;
          var code = '';
          if(response.status == "ok"){
            code = response.code;
            MessageToast.show('Se guardó con éxito!');
            thes.sendEmailEvento(code);
          } else {
            MessageToast.show('Error al guardar la información!');
          }
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    saveActividad: function(parametros){
      var thes = this;
      $.ajax({
        data: parametros,
        url: 'model/PA/InsertarActividadPA.php',
        type: 'POST',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          response = response.root;
          var code = '';
          if(response.status == "ok"){
            code = response.code;
            MessageToast.show('Se guardó con éxito!');
            thes.sendEmailActividad(code);
          } else {
            MessageToast.show('Error al guardar la información!');
          }
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    saveReasignacion: function(parametros){
      var thes = this;
      $.ajax({
        data: parametros,
        url: 'model/PA/InsertarReasignacionPA.php',
        type: 'POST',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          response = response.root;
          var code = '', oldCode = '';
          if(response.status == "ok"){
            code = response.code;
            oldCode = response.oldCode;
            MessageToast.show('Se guardó con éxito!');
            thes.sendEmailReasignacion(code, oldCode);
          } else {
            MessageToast.show('Error al guardar la información!');
          }
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    handleDialogCancelButton: function(){
      var thes = this;

      if (thes._oNewAppointmentDialog){
        thes._oNewAppointmentDialog.destroy();
        thes._oNewAppointmentDialog = null;
      }
    },
    onChangeStatus: function(){
      var thes = this,
      selectedPath = this._oTable.getSelectedContextPaths();
      if(selectedPath.length > 0){
        var selectedPath = selectedPath[0],
        selectedPath = selectedPath.split("/"),
        indexNivelOne = selectedPath[selectedPath.length - 3],
        indexNivelTwo = selectedPath[selectedPath.length - 1],      
        oData = thes.getView().getModel().getData(),
        dataIndex = oData.EventHierarchy.Eventos[indexNivelOne].Actividades[indexNivelTwo],
        areaUser = sessionStorage.area,
        areaUser = thes.getAreaByCode(areaUser);

        if(dataIndex.status == '#ff0000'){
          sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
            icon: MessageBox.Icon.INFORMATION,
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function(oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  dataIndex.status = '#008f39';
                  let table = 'pa_produccion_det';
                  let parametros = {
                    '_Code': dataIndex.code,
                    '_CodeCab': dataIndex.code_cab,
                    '_Table': table
                  }
                  thes.onSaveStatus(parametros);
                  thes.sendEmailUpdateStatus(parametros._Code);
                }
            }
          });
        } else {
          MessageToast.show('No es posible cambiar su status!');
        }
      } else {
        MessageToast.show('Seleccioné actividad!');
      }
    },
    onEditInformation: function(){
      var thes = this,
      selectedPath = this._oTable.getSelectedContextPaths();
      if(selectedPath.length > 0){
        var selectedPath = selectedPath[0],
        selectedPath = selectedPath.split("/"),
        indexNivelOne = selectedPath[selectedPath.length - 3],
        indexNivelTwo = selectedPath[selectedPath.length - 1],      
        oData = thes.getView().getModel().getData(),
        dataIndex = oData.EventHierarchy.Eventos[indexNivelOne].Actividades[indexNivelTwo];
        if(dataIndex.status == '#ff0000'){
          this._arrangeDialogFragmentSecond("Editar Actividad", "dialogEditPASIMA");
          thes.cargarAreas();
          thes.cargarUsuarios();
          var oActividad = Fragment.byId("dialogEditPASIMA", "iptActividad"),
          oFechaEjec = Fragment.byId("dialogEditPASIMA", "datepickerFechaEje"),
          oArea = Fragment.byId("dialogEditPASIMA", "cbxArea"),
          oResponsble = Fragment.byId("dialogEditPASIMA", "cbxResponsable");

          oActividad.setValue(dataIndex.actividad);
          var fechaEjec = thes.dateMysqlToJsDate(dataIndex.fecha_eje);
          oFechaEjec.setDateValue(fechaEjec);
          oArea.setSelectedKey(dataIndex.area_res);
          oResponsble.setSelectedKey(dataIndex.persona_res);
        } else {
          MessageToast.show('No es posible editar la actividad!');
        }
      } else {
        MessageToast.show('Seleccioné actividad!');
      }
    },
    onSaveStatus: function(parametros){
      var thes = this;
      $.ajax({
        data: parametros,
        url:   'model/PA/ActualizarStatusPA.php', 
        type:  'post',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          if(response){
            MessageToast.show('Se guardó con éxito!');
            thes.getView().getModel().refresh();
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    _arrangeDialogFragmentSecond: function (iDialogTitle, idDialog) {
      if (!this._oNewAppointmentDialogSecond) {
        Fragment.load({
          id: idDialog,
          name: "sap.ui.app01.view.Fragments.EditPASIMA",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialogSecond = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialogSecond);
            this._arrangeDialogSecond(iDialogTitle);
          }.bind(this));
      } else {
        this._arrangeDialogSecond(iDialogTitle);
      }
    },
    _arrangeDialogSecond: function(iDialogTitle) {
      this.updateButtonEnabledStateSecond();
      this._oNewAppointmentDialogSecond.setTitle(iDialogTitle);
      this._oNewAppointmentDialogSecond.open();
    },
    updateButtonEnabledStateSecond: function (oEvent) {
      var thes = this,
      oActividad = Fragment.byId("dialogEditPASIMA", "iptActividad"),
      oValueActividad = oActividad.getValue(),
      oFechaEjec = Fragment.byId("dialogEditPASIMA", "datepickerFechaEje"),
      oValueFechaEjec = oFechaEjec.getDateValue(),
      oArea = Fragment.byId("dialogEditPASIMA", "cbxArea"),
      oSelectedKeyArea = oArea.getSelectedKey(),
      oResponsable = Fragment.byId("dialogEditPASIMA", "cbxResponsable"),
      oSelectedKeyResponsable = oResponsable.getSelectedKey();

      if(oValueActividad != '' && oValueFechaEjec != null && oSelectedKeyArea != '' && oSelectedKeyResponsable != ''){
        this._oNewAppointmentDialogSecond.getBeginButton().setEnabled(true);
      } else {
        this._oNewAppointmentDialogSecond.getBeginButton().setEnabled(false);
      }
    },
    UpdateActividad: function(){
      var thes = this,
      selectedPath = this._oTable.getSelectedContextPaths(),
      selectedPath = selectedPath[0],
      selectedPath = selectedPath.split("/"),
      indexNivelOne = selectedPath[selectedPath.length - 3],
      indexNivelTwo = selectedPath[selectedPath.length - 1],  
      oData = thes.getView().getModel().getData(),
      dataIndex = oData.EventHierarchy.Eventos[indexNivelOne].Actividades[indexNivelTwo],
      oActividad = Fragment.byId("dialogEditPASIMA", "iptActividad"),
      oValueActividad = oActividad.getValue(),
      oFechaEjec = Fragment.byId("dialogEditPASIMA", "datepickerFechaEje"),
      oValueFechaEjec = oFechaEjec.getDateValue(),
      oArea = Fragment.byId("dialogEditPASIMA", "cbxArea"),
      oSelectedKeyArea = oArea.getSelectedKey(),
      oResponsable = Fragment.byId("dialogEditPASIMA", "cbxResponsable"),
      oSelectedKeyResponsable = oResponsable.getSelectedKey(),
      decriptionArea = thes.getAreaByCode(oSelectedKeyArea),
      nameComplete = thes.getUserByCode(oSelectedKeyResponsable),
      fechaEjec = thes.dateToMysqlDate(oValueFechaEjec),
      areaUser = sessionStorage.area,
      areaUser = thes.getAreaByCode(areaUser);

      sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
        icon: MessageBox.Icon.INFORMATION,
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              dataIndex.actividad = oValueActividad.toUpperCase();
              dataIndex.fecha_eje = fechaEjec;
              dataIndex.area_res = oSelectedKeyArea;
              dataIndex.area = decriptionArea;
              dataIndex.persona_res = oSelectedKeyResponsable;
              dataIndex.responsable = nameComplete;
              let table = 'pa_produccion_det';
              let parametros = {
                '_Code': dataIndex.code,
                '_CodeCab': dataIndex.code_cab,
                '_Actividad': oValueActividad.toUpperCase(),
                '_FechaEje': fechaEjec,
                '_Area': oSelectedKeyArea,
                '_Responsable': oSelectedKeyResponsable,
                '_Table': table
              }
              thes.onUpdateActividad(parametros);
              thes.sendEmailUpdateActividad(parametros._Code);
            }
        }
      });
    },
    CloseDialogEdit: function(){
      var thes = this;
      if (thes._oNewAppointmentDialogSecond){
        thes._oNewAppointmentDialogSecond.destroy();
        thes._oNewAppointmentDialogSecond = null;
      }
    },
    onUpdateActividad: function(parametros){
      var thes = this;
      $.ajax({
        data: parametros,
        url:   'model/PA/ActualizarActividadPA.php', 
        type:  'post',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          if(response){
            MessageToast.show('Se guardó con éxito!');
            thes.getView().getModel().refresh();
            thes.CloseDialogEdit();
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    getMonth: function(){
      var thes = this;

      $.ajax({
        url: 'model/SPRO/ListarMonth.php',
        type: 'GET',
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response); 
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.getView().setModel(oModel,"cbxMonth");  
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }

      });

    },
    onSearch: function(oEvent){
      var thes = this,
      oList = thes.byId("TablePA"),
      oBinding = oList.getBinding("items"),
      sPath = oBinding.sPath,
      sPath = sPath.split("/"),
      last = sPath[sPath.length - 1],
      term = (last == 'Eventos') ? 'evento': 'actividad' ,
      aFilters = [],
      sQuery = oEvent.getSource().getValue();
      if (sQuery && sQuery.length > 0) {
        var filter = new Filter(term, sap.ui.model.FilterOperator.Contains, sQuery);
        aFilters.push(filter);
      }
      oBinding.filter(aFilters, "Application");
      thes.byId("filterRange").setFrom(null);
      thes.byId("filterRange").setTo(null);
      thes.byId("filterMonth").setSelectedKey("");
    },
    onClearFilter: function(){
      var thes = this;
      thes.byId("filterRange").setFrom(null);
      thes.byId("filterRange").setTo(null);
      thes.byId("filterMonth").setSelectedKey("");
      thes.byId("filterSearch").setValue("");
      var oList = thes.byId("TablePA"),
      oBinding = oList.getBinding("items");
      oBinding.filter([]);
      thes.cargarActivities();
    },
    onFilerByMonth: function(){
      var thes = this,
      oSelectedKey = thes.byId("filterMonth").getSelectedKey(),
      month = thes.getCodeMonth(oSelectedKey),
      month = month + 1,
      oList = thes.byId("TablePA"),
      oBinding = oList.getBinding("items"),
      areaUser = sessionStorage.area,
      areaUser = thes.getAreaByCode(areaUser),
      table = (areaUser == 'PRODUCCIÓN') ? 'pa_produccion' : 'pa_calidad',
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      parametros = {
        '_Table': table,
        '_Month': month,
        '_LineaProduccion': linea_produccion,
        '_TipoEvento': 'OEE'
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPaByMonthTipoEventoLP.php', 
        type:  'POST',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          for (let index = 0; index < response.EventHierarchy.Eventos.length; index++) {
            if(response.EventHierarchy.Eventos[index]['status'] == 1){
              response.EventHierarchy.Eventos[index]['status'] = '#ff0000';
            } else if(response.EventHierarchy.Eventos[index]['status'] == 2){
              response.EventHierarchy.Eventos[index]['status'] = '#008f39';
            } else if(response.EventHierarchy.Eventos[index]['status'] == 3){
              response.EventHierarchy.Eventos[index]['status'] = '#f8f32b';
            } else {
              response.EventHierarchy.Eventos[index]['status'] = '#fff';
            }
            if(response.EventHierarchy.Eventos[index].Actividades){
              for (let y = 0; y < response.EventHierarchy.Eventos[index].Actividades.length; y++) { 
                if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 1){
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#ff0000';
                } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 2){
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#008f39';
                } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 3){
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#f8f32b';
                } else {
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#fff';
                }               
              }
            }
          }

          var oModel = new sap.ui.model.json.JSONModel(response);
          thes.getView().setModel(oModel);

          thes.byId("filterRange").setFrom(null);
          thes.byId("filterRange").setTo(null);
          thes.byId("filterSearch").setValue("");
          oBinding.filter([]);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });       

    },
    onFilterByDates: function(){
      var thes = this,
      from = thes.byId("filterRange").getFrom(),
      fromString = thes.dateToMysqlDate(from),
      to = thes.byId("filterRange").getTo(),
      toString = thes.dateToMysqlDate(to),
      oList = thes.byId("TablePA"),
      oBinding = oList.getBinding("items"),
      areaUser = sessionStorage.area,
      areaUser = thes.getAreaByCode(areaUser),
      table = (areaUser == 'PRODUCCIÓN') ? 'pa_produccion' : 'pa_calidad',
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      linea_produccion = (pieces.length == 8) ? pieces[pieces.length - 2] : pieces[pieces.length - 1],
      parametros = {
        '_Table': table,
        '_From': fromString,
        '_To': toString,
        '_LineaProduccion': linea_produccion,
        '_TipoEvento': 'OEE'
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPaByDatesTipoEventoLP.php', 
        type:  'POST',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          for (let index = 0; index < response.EventHierarchy.Eventos.length; index++) {
            if(response.EventHierarchy.Eventos[index]['status'] == 1){
              response.EventHierarchy.Eventos[index]['status'] = '#ff0000';
            } else if(response.EventHierarchy.Eventos[index]['status'] == 2){
              response.EventHierarchy.Eventos[index]['status'] = '#008f39';
            } else if(response.EventHierarchy.Eventos[index]['status'] == 3){
              response.EventHierarchy.Eventos[index]['status'] = '#f8f32b';
            } else {
              response.EventHierarchy.Eventos[index]['status'] = '#fff';
            }
            if(response.EventHierarchy.Eventos[index].Actividades){
              for (let y = 0; y < response.EventHierarchy.Eventos[index].Actividades.length; y++) { 
                if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 1){
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#ff0000';
                } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 2){
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#008f39';
                } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 3){
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#f8f32b';
                } else {
                  response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#fff';
                }               
              }
            }
          }

          var oModel = new sap.ui.model.json.JSONModel(response);
          thes.getView().setModel(oModel);

          thes.byId("filterMonth").setSelectedKey("");
          thes.byId("filterSearch").setValue("");
          oBinding.filter([]);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      }); 
    },
    sendEmailEvento: function(code){
      var thes = this,
      table = 'pa_produccion_cab',
      title = 'PRODUCCIÓN',
      parametros = {
        '_Code': code,
        '_Title': title,
        '_Table': table
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/EnviarEmailEvento.php', 
        type:  'POST',
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
    },
    sendEmailActividad: function(code){
      var thes = this,
      table = 'pa_produccion_det',
      title = 'PRODUCCIÓN',
      parametros = {
        '_Code': code,
        '_Title': title,
        '_Table': table
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/EnviarEmailActividad.php', 
        type:  'POST',
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
    },
    sendEmailReasignacion: function(code, oldCode){
      var thes = this,
      table = 'pa_produccion_det',
      title = 'PRODUCCIÓN',
      parametros = {
        '_Code': code,
        '_OldCode': oldCode,
        '_Title': title,
        '_Table': table
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/EnviarEmailReasignacion.php', 
        type:  'POST',
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
    },
    sendEmailUpdateActividad: function(code){
      var thes = this,
      table = 'pa_produccion_det',
      title = 'PRODUCCIÓN',
      parametros = {
        '_Code': code,
        '_Title': title,
        '_Table': table,
        '_User': sessionStorage.user
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/EnviarEmailUpdateActividad.php', 
        type:  'POST',
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
    },
    sendEmailUpdateStatus: function(code){
      var thes = this,
      table = 'pa_produccion_det',
      title = 'PRODUCCIÓN',
      parametros = {
        '_Code': code,
        '_Title': title,
        '_Table': table
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/EnviarEmailUpdateStatus.php', 
        type:  'POST',
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
    },
     evaluateButtons: function(){
      var thes = this,
      areaUser = sessionStorage.area,
      areaUser = thes.getAreaByCode(areaUser);

      if(areaUser == 'PRODUCCIÓN'){
        thes.byId("btnPlanAccion").setVisible(true);
        thes.byId("HB_Avatar").setVisible(true);
      } else {
        thes.byId("btnPlanAccion").setVisible(false);
        thes.byId("HB_Avatar").setVisible(false);
      }
    }
  });
 });