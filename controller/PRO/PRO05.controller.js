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
    return BaseController.extend("sap.ui.app01.controller.PRO.PRO05", {
    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("pro05").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarMonth();
      thes.cargarLinea();
      thes.generateChartN1();
      thes.generateChartN2();
      thes.generateChartN3();
      thes.generateChartN4();
      thes.generateChartN5();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homePRO");
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
          thes.byId('cbxYear').setSelectedKey(year);
          thes.byId('cbxMonth').setSelectedKey(descripMonth);
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
      oKeyLinea = thes.byId('cbxLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');

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
                text: "Uptime"
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
      oKeyLinea = thes.byId('cbxLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart2');
      var oVizFrame = thes.byId('idChart2');

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
                text: "Rendimiento"
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
      oKeyLinea = thes.byId('cbxLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart3');
      var oVizFrame = thes.byId('idChart3');

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
                text: "Eficiencia"
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
      oKeyLinea = thes.byId('cbxLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart4');
      var oVizFrame = thes.byId('idChart4');

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
                text: "OEE"
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
      oKeyLinea = thes.byId('cbxLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart5');
      var oVizFrame = thes.byId('idChart5');

      $.ajax({
        data: parametros,
        url: 'model/OEE/GenerarChartN5.php',
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
                dataLabel: {
                  visible: true
                },
                referenceLine: {
                    line: {
                        valueAxis: [{
                            value: 70,
                            visible: true,
                            label: {
                                text: "Meta: 70%",
                                visible: true
                            }
                        }]
                    }
                },
                colorPalette:['#7f7f7f', '#948a54', '#70ad47', '#215968']
              },
              legend: {
                visible: true
              },
              title: {
                text: "OEE"
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
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Fecha"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedValueAxisSecond);
          oVizFrame.addFeed(feedValueAxisThird);
          oVizFrame.addFeed(feedValueAxisFour);
          oVizFrame.addFeed(feedCategoryAxis);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      })
    },
    cargarLinea: function(){
      var thes = this,
      parametros = {
        '_status': '1'
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
          var firstKey = response[0].code;
          var oModel = new sap.ui.model.json.JSONModel(response);
          thes.getView().setModel(oModel,"cbxLinea");
          thes.byId('cbxLinea').setSelectedKey(firstKey);
        },
        error: function (xhr, ajaxOptions, thrownError) {
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
    }
  });
 });