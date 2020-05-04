jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/ui/model/json/JSONModel',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format'
 ], function (BaseController, JSONModel, ChartFormatter, Format) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.COSTO.COSTO02M", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("costo02m").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.generateChartN1();
      thes.generateChartN2();
      thes.generateChartN3();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("costo02");
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
          thes.byId('cbxYear').setSelectedKey(year);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    generateChartN1: function(){
      var thes = this,
      objetivo;

      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');

      $.ajax({
        url: 'model/COSTO/GenerarChartN2.php',
        type: 'GET',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          if(response.length != 0){
            objetivo = response[0].objetivo;
          }
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
              name : 'Año',
              value : "{year}"}
            ],                           
            measures : [{
              name : 'Real',
              value : '{real}'
            }],                         
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
                referenceLine: {
                    line: {
                        valueAxis: [{
                            value: objetivo,
                            visible: true,
                            label: {
                                text: "Meta: " + objetivo,
                                visible: true
                            }
                        }]
                    }
                },
                colorPalette:['#215968']
              },
              title: {
                text: "Costos de Mantto YTD (US$/TM)"
              },
              valueAxis: {
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
                'values': ["Real"]
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
      });
    },
    generateChartN2: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear
      },
      objetivo;
      thes.removeFeeds('idChart2');
      var oVizFrame = thes.byId('idChart2');

      $.ajax({
        data: parametros,
        url: 'model/COSTO/GenerarChartN3.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          if(response.length != 0){
            objetivo = response[0].objetivo;
          }
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
              name : 'Mes',
              value : "{month}"}
            ],                           
            measures : [{
              name : 'Real',
              value : '{real}'
            }],                         
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
                referenceLine: {
                    line: {
                        valueAxis: [{
                            value: objetivo,
                            visible: true,
                            label: {
                                text: "Meta: " + objetivo,
                                visible: true
                            }
                        }]
                    }
                },
                colorPalette:['#215968']
              },
              title: {
                text: "Costos de Mantto MTD (US$/TM)"
              },
              valueAxis: {
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
                'values': ["Real"]
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
      });
    },
    generateChartN3: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear
      };
      thes.removeFeeds('idChart3');
      var oVizFrame = thes.byId('idChart3');

      $.ajax({
        data: parametros,
        url: 'model/COSTO/GenerarChartN4.php',
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
              value : "{month}"}
            ],                           
            measures : [{
              name : 'US$',
              value : '{dolar}'
            }],                         
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
              title: {
                text: "Costos de Mantto MTD (miles US$)"
              },
              valueAxis: {
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
                'values': ["US$"]
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
      });
    },
    onChangeYear: function(oEvent){
        var thes = this;
        thes.generateChartN2();
        thes.generateChartN3();
    }
  });
 });