jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format'
 ], function (BaseController, ChartFormatter, Format) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.OKR1.OKR1-7", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr1-7").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.setChartN2();
      thes.setChartN3();
      thes.setChartN4();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeMANAGESIMA");
      thes.removeFeeds('idChart2');
      thes.removeFeeds('idChart3');
      thes.removeFeeds('idChart4');
    },
    setChartN2: function(){
      var thes = this,
      parametros = {};
      thes.removeFeeds('idChart2');
      var oVizFrame = thes.byId('idChart2');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/SIMA/GenerarChartN2.php',
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
              name : 'Año',
              value : "{year}"}],
                           
            measures : [{
              name : '# Incidentes',
              value : '{num_incidentes}'} ],
                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('column');
          
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
                colorPalette:['#215968']
              },
              legendGroup:{
                layout: {
                  position: "bottom",
                  alignment: "center"
                },
              },
              title: {
                text: "Cantidad de Incidentes YTD"
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
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["# Incidentes"]
              }), 
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Año"]
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
    setChartN3: function(){
      var thes = this,
      year = thes.byId('btnFilterYear').getSelectedKey(),
      parametros = {
        '_year': year
      };

      thes.removeFeeds('idChart3');
      var  oVizFrame = thes.byId('idChart3');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/SIMA/GenerarChartN3.php',
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
              name : 'Mes',
              value : "{month}"}],
                           
            measures : [{
              name : 'Cantidad de Incidentes',
              value : '{numero_incidentes}'} ],
                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('column');
          
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
                colorPalette:['#215968']
              },
              legend: {
                visible: false
              },
              title: {
                text: "Cantidad de Incidentes MTD"
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
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Cantidad de Incidentes"]
              }), 
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Mes"]
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
    setChartN4: function(){
      var thes = this,
      year = thes.byId('btnFilterYear').getSelectedKey(),
      parametros = {
        '_year': year
      };
      thes.removeFeeds('idChart4');
      var oVizFrame = thes.byId('idChart4');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/SIMA/GenerarChartN4.php',
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
              name : 'Tipo',
              value : "{tipo}"}],
                           
            measures : [{
              name : 'Cantidad de Incidentes',
              value : '{numero_incidentes}'} ],
                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('column');
          
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
                colorPalette:['#215968']
              },
              legend: {
                visible: false
              },
              title: {
                text: "Reporte de Incidentes YTD"
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
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Cantidad de Incidentes"]
              }), 
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Tipo"]
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
    removeFeeds: function(id){
      var thes = this;
      var oVizFrame = thes.byId(id);
      oVizFrame.removeAllFeeds();
    },
    cargarYear: function(){
      var thes = this,
      dateToday = new Date(),
      year = dateToday.getFullYear();

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
    onChangeData: function(oEvent){
      var thes = this;
      thes.removeFeeds('idChart3');
      thes.removeFeeds('idChart4');
      thes.setChartN3();
      thes.setChartN4();
    }
  });
 });