jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'sap/viz/ui5/controls/VizTooltip',
   'sap/viz/ui5/format/ChartFormatter',
   'sap/viz/ui5/api/env/Format',
], function (BaseController, JSONModel,MessageToast, VizTooltip, ChartFormatter, Format) {
   "use strict";

   var g,
   h;

    Format.numericFormatter(ChartFormatter.getInstance());
    var formatPattern = ChartFormatter.DefaultPattern;
   
   return BaseController.extend("sap.ui.app01.controller.Pdf", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("pdf").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.setChartN1();
        thes.setChartN2();
        thes.setChartN3();
        thes.setChartN4();
        thes.setChartN5('L2', 'idChart5');
        thes.setChartN5('L3', 'idChart6');
        thes.setChartN6('L2');
        thes.setChartN6('L3');
        thes.setChartProduccion();
        thes.setChartEficiencia();
        thes.generateChartCostoTRF();
        thes.generateChartCostoMtto1();
        thes.generateChartCostoMtto2();
        thes.generateChartCostoMtto3();
        thes.generateChartOEE1('L2', 'idChartOEE1');
        thes.generateChartOEE2('L2', 'idChartOEE2');
        thes.generateChartOEE3('L2', 'idChartOEE3');
        thes.generateChartOEE4('L2', 'idChartOEE4');
        thes.generateChartOEE5('L2', 'idChartOEE5');
        thes.generateChartOEE1('L3', 'idChartOEE6');
        thes.generateChartOEE2('L3', 'idChartOEE7');
        thes.generateChartOEE3('L3', 'idChartOEE8');
        thes.generateChartOEE4('L3', 'idChartOEE9');
        thes.generateChartOEE5('L3', 'idChartOEE10');
        thes.createGaugeN1();
        thes.createGaugeN2();
       },
       onAfterRendering: function() {
        var thes = this;
      
        if(typeof(g) == "object" && !g.hasOwnProperty("config")){
          thes.createGaugeN1();
        }

        if(typeof(h) == "object" && !h.hasOwnProperty("config")){
          thes.createGaugeN2();
        }
      },
       onNavBack: function(oEvent) {
         var thes = this;
         thes.getRouter().navTo("home");
         thes.removeFeeds('idChart1');
         thes.removeFeeds('idChart2');
         thes.removeFeeds('idChart3');
         thes.removeFeeds('idChart4');
         thes.removeFeeds('idChart5');
         thes.removeFeeds('idChart6');
         thes.removeFeeds('idChartCostoMtto1');
         thes.removeFeeds('idChartCostoMtto2');
         thes.removeFeeds('idChartCostoMtto3');
         thes.removeFeeds('idChartOEE1');
         thes.removeFeeds('idChartOEE2');
         thes.removeFeeds('idChartOEE3');
         thes.removeFeeds('idChartOEE4');
         thes.removeFeeds('idChartOEE5');
         thes.removeFeeds('idChartOEE6');
         thes.removeFeeds('idChartOEE7');
         thes.removeFeeds('idChartOEE8');
         thes.removeFeeds('idChartOEE9');
         thes.removeFeeds('idChartOEE10');
         g.destroy();
         h.destroy();
      },
      setTextDay(){
         var thes = this,
         dateToday = new Date(),
         year = dateToday.getFullYear(),
         month = dateToday.getMonth(),
         month = month + 1, 
         day = dateToday.getDate(),
         date = day + "/" + month + "/" + year,
         textDate = thes.createId("textDate"),
         th = document.getElementById(textDate);
         th.textContent = "Reporte al día " + date;
      },
      setChartN1: function(){
        var thes = this,
        parametros = {};

        thes.removeFeeds('idChart1');
        var oVizFrame = thes.byId('idChart1');

      
        $.ajax({
          data: parametros,
          url: 'model/SIMA/GenerarChartN1.php',
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
                name : '# Accidentes',
                value : '{num_accidentes}'} ],
                          
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
                  text: "Cantidad de Accidentes YTD"
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
                },
                legendGroup:{
                  layout: {
                    position: "bottom",
                    alignment: "center"
                  },
                }
              }
            );
            
            var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "valueAxis",
                  'type': "Measure",
                  'values': ["# Accidentes"]
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
      setChartN2: function(){
        var thes = this,
        parametros = {};

        thes.removeFeeds('idChart2')
        var oVizFrame = thes.byId('idChart2');

        $.ajax({
          data: parametros,
          url: 'model/SIMA/GenerarChartN5.php',
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
                name : 'Índice de Frecuencia',
                value : '{indice_frecuencia}'} ],
                           
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
                  text: "Índice de Frecuencia"
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
                  'values': ["Índice de Frecuencia"]
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
        parametros = {};

        thes.removeFeeds('idChart3');
        var oVizFrame = thes.byId('idChart3');

        $.ajax({
          data: parametros,
          url: 'model/SIMA/GenerarChartN6.php',
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
                name : 'Índice de Severidad',
                value : '{indice_severidad}'} ],
                           
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
                  text: "Índice de Severidad"
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
                  'values': ["Índice de Severidad"]
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
      setChartN4: function(){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month
        };

        thes.removeFeeds('idChart4');
        var oVizFrame = thes.byId('idChart4');

        $.ajax({
          data: parametros,
          url: 'model/CALIDAD/GenerarChartN1.php', 
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
                name : 'LP',
                value : "{linea_produccion}"}
              ],                           
              measures : [{
                name : 'Prod',
                value : '{produccion_neta}'
              },
              {
                name : 'Obs',
                value : '{bola_observada}'
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
                    visible: true,
                    renderer: function(oLabel) {
                      oLabel.text = oLabel.text + " TM";
                      if(oLabel.ctx.measureNames == "Prod"){
                        oLabel.ctx.Prod = oLabel.ctx.Prod + " TM";
                      } else if(oLabel.ctx.measureNames == "Obs"){
                        oLabel.ctx.Obs = oLabel.ctx.Obs + " TM";
                      }
                    }
                  },
                  colorPalette:['#215968', '#bfbfbf']
                },
                legendGroup:{
                  layout: {
                    position: "bottom",
                    alignment: "center"
                  },
                },
                title: {
                  text: "Producción Total vs Observado"
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
                  'values': ["Prod"]
                }),
                feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "valueAxis",
                  'type': "Measure",
                  'values': ["Obs"]
                }),    
                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "categoryAxis",
                  'type': "Dimension",
                  'values': ["LP"]
                });
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedValueAxisSecond);
            oVizFrame.addFeed(feedCategoryAxis);
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      setChartN5: function(linea_produccion, idChart){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        };

        thes.removeFeeds(idChart);
        var oVizFrame = thes.byId(idChart);
  
        $.ajax({
          data: parametros,
          url: 'model/CALIDAD/GenerarChartN2.php',
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
                name : 'Coord',
                value : "{coord}"}
              ],                           
              measures : [{
                name : 'Prod',
                value : '{produccion_neta}'
              },
              {
                name : 'Obs',
                value : '{bola_observada}'
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
                    visible: true,
                    renderer: function(oLabel) {
                      oLabel.text = oLabel.text + " TM";
                      if(oLabel.ctx.measureNames == "Prod"){
                        oLabel.ctx.Prod = oLabel.ctx.Prod + " TM";
                      } else if(oLabel.ctx.measureNames == "Obs"){
                        oLabel.ctx.Obs = oLabel.ctx.Obs + " TM";
                      }
                    }
                  },
                  colorPalette:['#215968', '#bfbfbf']
                },
                legendGroup:{
                  layout: {
                    position: "bottom",
                    alignment: "center"
                  },
                },
                title: {
                  text: "Producción " + linea_produccion + " MTD x Coordinador"
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
                  'values': ["Prod"]
                }),
                feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "valueAxis",
                  'type': "Measure",
                  'values': ["Obs"]
                }),    
                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "categoryAxis",
                  'type': "Dimension",
                  'values': ["Coord"]
                });
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedValueAxisSecond);
            oVizFrame.addFeed(feedCategoryAxis);
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      setChartN6: function(linea_produccion){
        var thes = this,
        diametros = thes.getDiametroDistinctByLineaProduccion(linea_produccion),
        begin = (linea_produccion == 'L2') ? 7 : 9;
        for (let index = 0; index < diametros.length; index++) {
          let idChart = 'idChart' + begin;
          thes.generateCharN6(linea_produccion, diametros[index], idChart);
          thes.byId(idChart).setVisible(true);
          begin++;  
        }
      },
      generateChartCostoTRF: function(){
        var thes = this,
        diametros = thes.getDiametrofDistinctCostoTRF(),
        begin = 1;
        for (let index = 0; index < diametros.length; index++) {
          let idChart = 'idChartCostoTrf' + begin;
          thes.generateChartCostoTrfDynamic(diametros[index], idChart);
          thes.byId(idChart).setVisible(true);
          begin++;  
        }
      },
      generateChartCostoMtto1: function(){
        var thes = this,
        objetivo;

        thes.removeFeeds('idChartCostoMtto1');
  
        var oVizFrame = thes.byId('idChartCostoMtto1');

        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;
  
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
                                  text: objetivo,
                                  visible: true
                              }
                          }]
                      }
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
                  text: "Costos de Mantto YTD (US$/TM)"
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
      generateChartCostoMtto2: function(){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        parametros = {
          '_Year': year
        },
        objetivo;
        thes.removeFeeds('idChartCostoMtto2');
        var oVizFrame = thes.byId('idChartCostoMtto2');
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;
  
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
                                  text: objetivo,
                                  visible: true
                              }
                          }]
                      }
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
                  text: "Costos de Mantto MTD (US$/TM)"
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
      generateChartCostoMtto3: function(){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        parametros = {
          '_Year': year
        };
        thes.removeFeeds('idChartCostoMtto3');
        var oVizFrame = thes.byId('idChartCostoMtto3');

        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;
  
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
                legendGroup:{
                  layout: {
                    position: "bottom",
                    alignment: "center"
                  },
                },
                title: {
                  text: "Costos de Mantto MTD (miles US$)"
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
      removeFeeds: function(id){
        var thes = this;
        var oVizFrame = thes.byId(id);
        oVizFrame.removeAllFeeds();
      },
      dynamicLoad: function(){
        var thes = this;
        var imageURLs = thes.getAllSrc();
        var Calidad = thes.getAllSrcCalidad();
        var Produccion = thes.getAllSrcProduccion();
        var ProduccionDetalle = thes.getAllSrcProduccionDetalle();
        var ProduccionSecond = thes.getAllSrcProduccionSecond();
        var ProduccionDetalleSecond = thes.getAllSrcProduccionDetalleSecond();
        var Eficiencia = thes.getAllSrcEficiencia();
        var EficienciaSecond = thes.getAllSrcEficienciaSecond();
        var Trf = thes.getAllSrcTrf();
        var Mantto = thes.getAllSrcMantto();
        var Oee = thes.getAllSrcOee();
        var OeeDetalle = thes.getAllSrcOeeDetalle();
        var OeeSecond = thes.getAllSrcOeeSecond();
        var OeeDetalleSecond = thes.getAllSrcOeeDetalleSecond();

        if(Calidad.length != 0){
          imageURLs = [...imageURLs, ...Calidad];
        }
        if(Mantto.length != 0){
          imageURLs = [...imageURLs, ...Mantto];
        }
        if(Produccion.length != 0){
          imageURLs = [...imageURLs, ...Produccion];
        }
        if(ProduccionDetalle.length != 0){
          imageURLs = [...imageURLs, ...ProduccionDetalle];
        }
        if(ProduccionSecond.length != 0){
          imageURLs = [...imageURLs, ...ProduccionSecond];
        }
        if(ProduccionDetalleSecond.length != 0){
          imageURLs = [...imageURLs, ...ProduccionDetalleSecond];
        }
        if(Eficiencia.length != 0){
          imageURLs = [...imageURLs, ...Eficiencia];
        }
        if(EficienciaSecond.length != 0){
          imageURLs = [...imageURLs, ...EficienciaSecond];
        }
        if(Trf.length != 0){
          imageURLs = [...imageURLs, ...Trf];
        }
        if(Oee.length != 0){
          imageURLs = [...imageURLs, ...Oee];
        }
        if(OeeDetalle.length != 0){
          imageURLs = [...imageURLs, ...OeeDetalle];
        }
        if(OeeSecond.length != 0){
          imageURLs = [...imageURLs, ...OeeSecond];
        }
        if(OeeDetalleSecond.length != 0){
          imageURLs = [...imageURLs, ...OeeDetalleSecond];
        }

        var imageObjs = [];
        var imagesLoaded = 0;
        for (var i = 0; i < imageURLs.length; i++) {
          var url;
          if(imageURLs[i].area == "PRODUCCIONDETALLEGAUGE" || imageURLs[i].area == "PRODUCCIONDETALLEGAUGESECOND" || imageURLs[i].area == "EFICIENCIA" || imageURLs[i].area == "EFICIENCIASECOND" || imageURLs[i].area == "OEEDETALLE" || imageURLs[i].area == "OEEDETALLESECOND"){
            var DOMURL = window.URL || window.webkitURL || window;
            var image64 = new XMLSerializer().serializeToString(imageURLs[i]);
            var svgBlob = new Blob([image64], {type: "image/svg+xml;charset=utf-8"});
            url = DOMURL.createObjectURL(svgBlob);
          }
          var canvas = document.createElement("canvas");
          canvas.setAttribute("width", imageURLs[i].clientWidth);
          canvas.setAttribute("height", imageURLs[i].clientHeight);
          var context = canvas.getContext("2d");
          var image = new Image();
            image.addEventListener( "load", function() {
                context.drawImage(image, 0, 0);
                imagesLoaded++;
                if (imagesLoaded == imageURLs.length) thes.allImagesLoaded(imageObjs);
            } );
            image.width = imageURLs[i].clientWidth;
            image.height = imageURLs[i].clientHeight;
            image.area = imageURLs[i].area;
            image.src = (imageURLs[i].area == "PRODUCCIONDETALLEGAUGE" || imageURLs[i].area == "PRODUCCIONDETALLEGAUGESECOND" || imageURLs[i].area == "EFICIENCIA" || imageURLs[i].area == "EFICIENCIASECOND" || imageURLs[i].area == "OEEDETALLE" || imageURLs[i].area == "OEEDETALLESECOND") ? url : "data:image/svg+xml," + jQuery.sap.encodeURL(
              imageURLs[i].outerHTML.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'));
            imageObjs.push(image);
        }
      },
      allImagesLoaded: function (imageObjs) {
        var thes = this,
        dateToday = new Date(),
        dateToday = thes.operateDate(dateToday, -1),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        month = month + 1,
        day = dateToday.getDate(),
        dateStringSecond = day + '/' +  month + '/' + year,
        charts_sima = [],
        charts_calidad = [],
        charts_produccion = [],
        charts_produccion_detalle = [],
        charts_produccion_second = [],
        charts_produccion_detalle_second = [],
        charts_eficiencia = [],
        charts_eficiencia_second = [],
        charts_trf = [],
        charts_mantto = [],
        charts_oee = [],
        charts_oee_detalle = [],
        charts_oee_second = [],
        charts_oee_detalle_second = [],
        content = [],
        title,
        headerTable,
        secondHeader,
        commentsProL2 = thes.returnComments('L2'),
        commentsProL3 = thes.returnComments('L3'),
        commentsEfiL2 = thes.returnCommentsEficiencia('L2'),
        commentsEfiL3 = thes.returnCommentsEficiencia('L3'),
        logoMepsaAch = 'data:image/png;base64,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';

        for (let index = 0; index < imageObjs.length; index++) {
          var canvas = document.createElement("canvas");
          canvas.setAttribute("width", imageObjs[index].width);
          canvas.setAttribute("height", imageObjs[index].height);
          var context = canvas.getContext('2d');
          context.drawImage(imageObjs[index], 0, 0);
          var pngUrl = canvas.toDataURL('image/png');
          if(imageObjs[index].area == 'SIMA'){
            charts_sima.push(pngUrl);
          } else if(imageObjs[index].area == 'CALIDAD'){
            charts_calidad.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCION'){
            charts_produccion.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCIONDETALLE' || imageObjs[index].area == 'PRODUCCIONDETALLEGAUGE'){
            charts_produccion_detalle.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCIONSECOND'){
            charts_produccion_second.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCIONDETALLESECOND' || imageObjs[index].area == 'PRODUCCIONDETALLEGAUGESECOND'){
            charts_produccion_detalle_second.push(pngUrl);
          } else if(imageObjs[index].area == 'EFICIENCIA'){
            charts_eficiencia.push(pngUrl);
          } else if(imageObjs[index].area == 'EFICIENCIASECOND'){
            charts_eficiencia.push(pngUrl);
          } else if(imageObjs[index].area == 'TRF'){
            charts_trf.push(pngUrl);
          } else if(imageObjs[index].area == 'MANTTO'){
            charts_mantto.push(pngUrl);
          } else if(imageObjs[index].area == 'OEE'){
            charts_oee.push(pngUrl);
          } else if(imageObjs[index].area == 'OEEDETALLE'){
            charts_oee_detalle.push(pngUrl);
          } else if(imageObjs[index].area == 'OEESECOND'){
            charts_oee_second.push(pngUrl);
          } else if(imageObjs[index].area == 'OEEDETALLESECOND'){
            charts_oee_detalle.push(pngUrl);
          }
        }

        //Header SIMA
        title = 'INDICADORES SIMA';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 20]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0, 20]}],
              ]
          }
        };
        secondHeader = {
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
            widths: ['*'],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //Content SIMA

        if(charts_sima.length != 0){
    
          var contSima = 0;
          var arrayTempSima = [];

          for (let index = 0; index < charts_sima.length; index++) {

            let objectTemp = {image: charts_sima[index], width: 255, height: 300};
            arrayTempSima.push(objectTemp);
            contSima++;

            if(contSima % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempSima);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempSima = [];
            } else if((charts_sima.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempSima);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempSima = [];
            }   
          }
        }

        //HEADER CALIDAD

        title = 'CALIDAD BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 20]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT CALIDAD

        if(charts_calidad.length != 0){

          var contCalidad = 0;
          var arrayTempCalidad = [];

          for (let index = 0; index < charts_calidad.length; index++) {

            let objectTemp = {image: charts_calidad[index], width: 255, height: 300};
            arrayTempCalidad.push(objectTemp);
            contCalidad++;

            if(contCalidad % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempCalidad);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempCalidad = [];
            } else if((charts_calidad.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempCalidad);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempCalidad = [];
            }
          }
        }

        //HEADER PRODUCCIÓN

        title = 'PRODUCCIÓN BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 10]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT PRODUCCIÓN

        if(charts_produccion.length != 0){
          var arrayTempProduccion = [];

          for (let index = 0; index < charts_produccion.length; index++) {
            let objectTemp = {image: charts_produccion[index], width: 510, height: 250};
            arrayTempProduccion.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempProduccion);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempProduccion = [];
          }

          if(commentsProL2.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Tipo', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsProL2.length; index++) {
              let tempArray = [{text: commentsProL2[index].fecha, style: 'styleTableComments'},{text: commentsProL2[index].comment, style: 'styleTableComments'}, {image: commentsProL2[index].icon, fit:[20,20], margin: [ 3, 2, 0, 0]}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*', 30],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }

          var arrayTempProduccionDetalle = [],
          otherTemp = [],
          prueba = {};
          
          for (let index = 0; index < charts_produccion_detalle.length; index++) {

            let objectTemp = {image: charts_produccion_detalle[index], width: 180};
            arrayTempProduccionDetalle.push(objectTemp);
          }

          otherTemp.push(arrayTempProduccionDetalle);
          var contentDetalle = thes.returnDataProDet('L2');
          otherTemp.push(contentDetalle);

          prueba = {  style: 'tableExampleSecond',
                          table: {widths: ['*', '*', '*'],
                                  body: otherTemp
                                },
                          layout: 'noBorders'
                      };
          
          content.push(prueba); 
          
        }

        if(charts_produccion_second.length != 0){
          var arrayTempProduccion = [];

          for (let index = 0; index < charts_produccion_second.length; index++) {
            let objectTemp = {image: charts_produccion_second[index], width: 510, height: 250};
            arrayTempProduccion.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempProduccion);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempProduccion = [];
          }

          if(commentsProL3.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Tipo', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsProL3.length; index++) {
              let tempArray = [{text: commentsProL3[index].fecha, style: 'styleTableComments'},{text: commentsProL3[index].comment, style: 'styleTableComments'}, {image: commentsProL3[index].icon, fit:[20,20], margin: [ 3, 2, 0, 0]}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*', 30],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }

          var arrayTempProduccionDetalle = [],
          otherTemp = [],
          prueba = {};
          
          for (let index = 0; index < charts_produccion_detalle_second.length; index++) {

            let objectTemp = {image: charts_produccion_detalle_second[index], width: 180};
            arrayTempProduccionDetalle.push(objectTemp);
          }

          otherTemp.push(arrayTempProduccionDetalle);
          var contentDetalle = thes.returnDataProDet('L3');
          otherTemp.push(contentDetalle);

          prueba = {  style: 'tableExampleSecond',
                          table: {widths: ['*', '*', '*'],
                                  body: otherTemp
                                },
                          layout: 'noBorders'
                      };
          
          content.push(prueba); 
          
        }

        //HEADER EFICIENCIA

        title = 'EFICIENCIA BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 10]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT EFICIENCIA

        if(charts_eficiencia.length != 0){
          var arrayTempEficiencia = [];

          for (let index = 0; index < charts_eficiencia.length; index++) {
            let objectTemp = {image: charts_eficiencia[index], width: 510, height: 250};
            arrayTempEficiencia.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempEficiencia);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempEficiencia = [];
          }

          if(commentsEfiL2.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsEfiL2.length; index++) {
              let tempArray = [{text: commentsEfiL2[index].fecha, style: 'styleTableComments'},{text: commentsEfiL2[index].comment, style: 'styleTableComments'}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*'],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }
        }

        if(charts_eficiencia_second.length != 0){
          var arrayTempEficiencia = [];

          for (let index = 0; index < charts_eficiencia_second.length; index++) {
            let objectTemp = {image: charts_eficiencia_second[index], width: 510, height: 250};
            arrayTempEficiencia.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempEficiencia);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempEficiencia = [];
          }

          if(commentsEfiL3.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsEfiL3.length; index++) {
              let tempArray = [{text: commentsEfiL3[index].fecha, style: 'styleTableComments'},{text: commentsEfiL3[index].comment, style: 'styleTableComments'}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*'],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }
        }

        //HEADER COSTO TRF

        title = 'COSTOS DE TRANSFORMACIÓN BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center'}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ['*'],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //Content TRF

        if(charts_trf.length != 0){
    
          var contTrf = 0;
          var arrayTempTrf = [];

          for (let index = 0; index < charts_trf.length; index++) {

            let objectTemp = {image: charts_trf[index], width: 255, height: 300};
            arrayTempTrf.push(objectTemp);
            contTrf++;

            if(contTrf % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempTrf);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempTrf = [];
            } else if((charts_trf.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempTrf);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempTrf = [];
            }   
          }
        }

        //HEADER MANTTO

        title = 'COSTOS DE MANTENIMIENTO BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center'}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        if(charts_mantto.length != 0){
          var contMantto = 0;
          var arrayTempMantto = [];

          for (let index = 0; index < charts_mantto.length; index++) {

            let objectTemp = {image: charts_mantto[index], width: 255};
            arrayTempMantto.push(objectTemp);
            contMantto++;

            if(contMantto % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempMantto);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempMantto = [];
            } else if((charts_mantto.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempMantto);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempMantto = [];
            }
          }
        }

        //HEADER OEE

        title = 'OVERALL EQUIPMENT EFFECTIVENESS (OEE) BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center'}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT OEE
        
        if(charts_oee.length > 0){
          var contOee = 0;
          var arrayTempOee = [];

          for (let index = 0; index < charts_oee.length; index++) {

            let objectTemp = {image: charts_oee[index], width: 255, height: 190};
            arrayTempOee.push(objectTemp);
            contOee++;

            if(contOee % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            } else if((charts_oee.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            }   
          }
        }

        if(charts_oee_detalle.length != 0){
          var arrayTempOeeDetalle = [];

          for (let index = 0; index < charts_oee_detalle.length; index++) {
            let objectTemp = {image: charts_oee_detalle[index], width: 510, height: 250};
            arrayTempOeeDetalle.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempOeeDetalle);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempOeeDetalle = [];
          }
        }

        if(charts_oee_second.length > 0){
          var contOee = 0;
          var arrayTempOee = [];

          for (let index = 0; index < charts_oee_second.length; index++) {

            let objectTemp = {image: charts_oee_second[index], width: 255, height: 190};
            arrayTempOee.push(objectTemp);
            contOee++;

            if(contOee % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            } else if((charts_oee_second.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            }   
          }
        }

        if(charts_oee_detalle_second.length != 0){
          var arrayTempOeeDetalle = [];

          for (let index = 0; index < charts_oee_detalle_second.length; index++) {
            let objectTemp = {image: charts_oee_detalle_second[index], width: 510, height: 250};
            arrayTempOeeDetalle.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempOeeDetalle);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempOeeDetalle = [];
          }
        }

        thes.downloadPDF(content);
      },
      getAllSrc: function(){
        var thes = this;
        var ids =  ['idChart1', 'idChart2', 'idChart3'];
        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'SIMA';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcCalidad: function(){
        var thes = this,
        ids =  ['idChart4'],
        diametrosL2 = thes.getDiametroDistinctByLineaProduccion('L2'),
        diametrosL3 = thes.getDiametroDistinctByLineaProduccion('L3');
        if(thes.byId("idChart5").getModel().getData().length > 0){
          ids.push("idChart5");
        }
        if(thes.byId("idChart6").getModel().getData().length > 0){
          ids.push("idChart6");
        }
        if(diametrosL2.length > 0){
          let begin = 7;
          for (let index = 0; index < diametrosL2.length; index++) {
              ids.push("idChart" + begin);
              begin++;       
          }
        }
        if(diametrosL3.length > 0){
          let begin = 9;
          for (let index = 0; index < diametrosL3.length; index++) {
              ids.push("idChart" + begin);
              begin++;       
          }
        }
        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'CALIDAD';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcProduccion: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartProduccion1").getModel().getData().length > 0){
          ids.push("idChartProduccion1");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'PRODUCCION';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcProduccionDetalle: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartProduccion1").getModel().getData().length > 0){
          ids.push("idProduccionSecond1", "idProduccionThird1");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'PRODUCCIONDETALLE';
          svgs.push(svg);
        }

        var lastElement = thes.byId("idProduccionFour1"),
        sId = lastElement.sId,
        lastElement = document.getElementById(sId),
        svgLastElement = lastElement.getElementsByTagName("svg")[0];
        svgLastElement.area = 'PRODUCCIONDETALLEGAUGE';
        svgs.push(svgLastElement);

        return svgs;
      },
      getAllSrcProduccionSecond: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartProduccion2").getModel().getData().length > 0){
          ids.push("idChartProduccion2");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'PRODUCCIONSECOND';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcProduccionDetalleSecond: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartProduccion2").getModel().getData().length > 0){
          ids.push("idProduccionSecond2", "idProduccionThird2");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'PRODUCCIONDETALLESECOND';
          svgs.push(svg);
        }

        var lastElement = thes.byId("idProduccionFour2"),
        sId = lastElement.sId,
        lastElement = document.getElementById(sId),
        svgLastElement = lastElement.getElementsByTagName("svg")[0];
        svgLastElement.area = 'PRODUCCIONDETALLEGAUGESECOND';
        svgs.push(svgLastElement);

        return svgs;
      },
      getAllSrcEficiencia: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartEficiencia1").getModel().getData().length > 0){
          ids.push("idChartEficiencia1");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'EFICIENCIA';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcEficienciaSecond: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartEficiencia2").getModel().getData().length > 0){
          ids.push("idChartEficiencia2");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'EFICIENCIASECOND';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcTrf: function(){
        var thes = this,
        ids =  [],
        diametros = thes.getDiametrofDistinctCostoTRF();

        if(diametros.length > 0){
          let begin = 1;
          for (let index = 0; index < diametros.length; index++) {
              ids.push("idChartCostoTrf" + begin);
              begin++;       
          }
        }
        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'TRF';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcMantto: function(){
        var thes = this;
        var ids =  ['idChartCostoMtto1', 'idChartCostoMtto2', 'idChartCostoMtto3'];
        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'MANTTO';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcOee: function(){
        var thes = this,
        ids = [];
        if(thes.byId("idChartOEE5").getModel().getData().length > 0){
          ids = ['idChartOEE1', 'idChartOEE2', 'idChartOEE3', 'idChartOEE4'];
        }
        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'OEE';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcOeeDetalle: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartOEE5").getModel().getData().length > 0){
          ids.push("idChartOEE5");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'OEEDETALLE';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcOeeSecond: function(){
        var thes = this,
        ids = [];
        if(thes.byId("idChartOEE10").getModel().getData().length > 0){
          ids =  ['idChartOEE6', 'idChartOEE7', 'idChartOEE8', 'idChartOEE9'];
        }
        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'OEESECOND';
          svgs.push(svg);
        }

        return svgs;
      },
      getAllSrcOeeDetalleSecond: function(){
        var thes = this,
        ids = [];

        if(thes.byId("idChartOEE10").getModel().getData().length > 0){
          ids.push("idChartOEE10");
        }

        var svgs = [];
        for (let index = 0; index < ids.length; index++) {
          var vizFrame = thes.byId(ids[index]);
          var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];
          svg.area = 'OEEDETALLESECOND';
          svgs.push(svg);
        }

        return svgs;
      },
      downloadPDF: function(content){
        var thes = this,
        dateToday = new Date(),
        dateToday = thes.operateDate(dateToday, -1),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        month = month + 1,
        day = dateToday.getDate(),
        dateString = day + '.' +  month + '.' + year,
        stringDownload =  'Reporte OKR ACh al ' + dateString + '.pdf';

        pdfMake.fonts = {
          Times: {
            normal: 'Times-New-Roman-Normal.ttf',
            bold: 'Times-New-Roman-Bold.ttf',
            italics: 'Times-New-Roman-Italic.ttf',
            bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
          }
        };

        var docDefinition = {
          content: content,
          styles: {
            tableExample: {
              margin: [0, 1, 0, 10]
            },
            tableExampleSecond: {
              margin: [0, 5, 0, 10]
            },
            tableHeaderN1: {
              fontSize: 14,
              bold: true
            },
            tableHeaderN2: {
              fontSize: 10
            },
            tableHeaderN3: {
              fontSize: 10,
              bold: true
            },
            styleTableComments: {
              fontSize: 10,
              bold: false
            }
          },
          defaultStyle: {
            font: 'Times'
          }
        };

        pdfMake.createPdf(docDefinition).download(stringDownload);

      },
      generateChartOEE1: function(linea_produccion, id){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        };
        thes.removeFeeds(id);
        var oVizFrame = thes.byId(id);
  
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
      generateChartOEE2: function(linea_produccion, id){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        };
        thes.removeFeeds(id);
        var oVizFrame = thes.byId(id);
  
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
      generateChartOEE3: function(linea_produccion, id){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        };
        thes.removeFeeds(id);
        var oVizFrame = thes.byId(id);
  
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
      generateChartOEE4: function(linea_produccion, id){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        };
        thes.removeFeeds(id);
        var oVizFrame = thes.byId(id);
  
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
      generateChartOEE5: function(linea_produccion, id){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        };
        thes.removeFeeds(id);
        var oVizFrame = thes.byId(id);
  
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
                      //oLabel.ctx.Uptime = (!oLabel.ctx.Uptime || oLabel.ctx.Uptime == "0.0") ?  oLabel.ctx.Uptime : oLabel.ctx.Uptime + "%";
                    } else if(oLabel.ctx.measureNames == "Rendimiento"){
                      let rendimiento = oLabel.ctx.Rendimiento * 100;
                      rendimiento = rendimiento.toFixed(1);
                      oLabel.ctx.Rendimiento = rendimiento;
                      //oLabel.ctx.Rendimiento = (!oLabel.ctx.Rendimiento || oLabel.ctx.Rendimiento == "0.0") ?  oLabel.ctx.Rendimiento : oLabel.ctx.Rendimiento + "%";
                    } else if(oLabel.ctx.measureNames == "Eficiencia"){
                      let eficiencia = oLabel.ctx.Eficiencia * 100;
                      eficiencia = eficiencia.toFixed(1);
                      oLabel.ctx.Eficiencia = eficiencia;
                      //oLabel.ctx.Eficiencia = (!oLabel.ctx.Eficiencia || oLabel.ctx.Eficiencia == "0.0") ?  oLabel.ctx.Eficiencia : oLabel.ctx.Eficiencia + "%";
                    } else if(oLabel.ctx.measureNames == "OEE"){
                      let oee = oLabel.ctx.OEE * 100;
                      oee = oee.toFixed(1);
                      oLabel.ctx.OEE = oee;
                      //oLabel.ctx.OEE = (!oLabel.ctx.OEE || oLabel.ctx.OEE == "0.0") ?  oLabel.ctx.OEE : oLabel.ctx.OEE + "%";
                    } else if(oLabel.ctx.measureNames == "Meta"){
                      let meta = oLabel.ctx.Meta * 100;
                      meta = meta.toFixed(1);
                      oLabel.ctx.Meta = meta;
                      //oLabel.ctx.Meta = (!oLabel.ctx.Meta || oLabel.ctx.Meta == "0.0") ?  oLabel.ctx.Meta : oLabel.ctx.Meta + "%";
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
      getDiametroDistinctByLineaProduccion(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_LineaProduccion': linea_produccion
        }, 
        data;

        $.ajax({
          data: parametros,
          url: 'model/PDF/GetDiametroByLineaProduccion.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            data = response.Data;
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      generateCharN6: function(linea_produccion, diametro, idChart){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        moye = month + '.' + year,
        parametros = {
            '_LineaProduccion': linea_produccion,
            '_Moye': moye,
            '_Diametro': diametro
        };

        thes.removeFeeds(idChart);
        var oVizFrame = thes.byId(idChart);

        $.ajax({
            data: parametros,
            url: 'model/CALIDAD/GenerarChartN3.php',
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
                name : 'Defecto',
                value : "{defecto}"
                }],                           
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
            oVizFrame.setVizType('pie');
            
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
                    drawingEffect: 'glossy'
                },
                legendGroup:{
                    layout: {
                      position: "bottom",
                      alignment: "center"
                    },
                },
                title: {
                    text: "Distribución Bola Obs " + linea_produccion + " MTD - Ø" + diametro
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
                    'values': ["Defecto"]
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
      getDiametrofDistinctCostoTRF(){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        parametros = {
          '_Year': year
        }, 
        data;

        $.ajax({
          data: parametros,
          url: 'model/PDF/GetDiametroDistinctCostoTRF.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            data = response.Data;
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      generateChartCostoTrfDynamic: function(diametro, idChart){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Diametro': diametro,
          '_Month': month
        },
        title = (diametro == 'MIXED') ? 'Mix de Bolas Forjadas (US$/TM)' : 'Bolas Forjadas Ø' + diametro + ' (US$/TM)',
        objetivo;
        thes.removeFeeds(idChart);
        var oVizFrame = thes.byId(idChart);

        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;

        $.ajax({
            data: parametros,
            url: 'model/COSTO/GenerarChartN1.php',
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
                                size: 1,
                                type: "dotted",
                                label: {
                                    text: objetivo,
                                    visible: true
                                }
                            }]
                        }
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
                    text: title
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
      getLineaProduccionByStatus: function(){
        var thes = this,
        parametros = {
          '_status': 1
        }, data;

        $.ajax({
          data: parametros,
          url: 'model/SPRO/ListarLineaProduccionByStatus.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
          response = JSON.parse(response);
          data = response;
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      setChartProduccion: function(){
        var thes = this,
        lineas = thes.getLineaProduccionByStatus(),
        begin = 1;
        for (let index = 0; index < lineas.length; index++) {
          let idComments = 'comments';
          let idChart = 'idChartProduccion' + begin;
          let idChartSecond = 'idProduccionSecond' + begin;
          let idContentSecond = 'TileContentSecond' + begin;
          let idChartThird = 'idProduccionThird' + begin;
          let idContentThird = 'TileContentThird' + begin;
          thes.generateChartProduccion(lineas[index].code, idChart);
          thes.getComments(lineas[index].code);
          thes.byId(idChart).setVisible(true);
          idComments = idComments + lineas[index].code;
          thes.byId(idComments).setVisible(true);
          thes.generateChartProduccionSecond(lineas[index].code, idChartSecond, idContentSecond);
          thes.generateChartProduccionThird(lineas[index].code, idChartThird, idContentThird);
          let id_VL = "VL_" + begin;
          thes.byId(id_VL).setVisible(true);
          begin++;  
        }
      },
      generateChartProduccion: function(linea_produccion, idChart){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        };
        thes.removeFeeds(idChart);
        var oVizFrame = thes.byId(idChart);
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN1.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(response);
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
              dimensions : [
              {
                name : 'Diámetro',
                value : "{diametro}"
              },
              {
                name : 'Fecha',
                value : "{fechaFinal}"/*,
                dataType:'date'*/
              }],                           
              measures : [{
                name : 'Producción',
                value : '{produccion_neta}'
              },
              {
                name : 'Promedio',
                value : '{promedio}'
              },
              {
                name : 'TM/Día',
                value : '{TM_Day}'
              }],                         
              data : {
                path : "/"
              }
            });		
            oVizFrame.setDataset(oDataset);
            oVizFrame.setModel(oModel);	
            oVizFrame.setVizType('combination');
  
            var rules = '';
  
            if(linea_produccion == 'L2'){
              rules = {
                "rules":
                [
                  {
                    "dataContext": {"Diámetro": '2.0"'},
                    "properties": {
                        "color":"#bfbfbf"
                    },
                    "displayName": '2.0"'
                  },
                  {
                    "dataContext": {"Diámetro": '2.5"'},
                    "properties": {
                        "color":"#215968"
                    },
                    "displayName": '2.5"'
                  },
                  {
                    "dataContext": {"Promedio": {min: 0}},
                    "properties": {
                        "color":"#5b9ad5",
                        "lineColor": "#5b9ad5"
                    },
                    "displayName": 'Promedio'
                  },
                  {
                    "dataContext": {"TM/Día": {min: 0}},
                    "properties": {
                        "color":"#e84118",
                        "lineColor": "#e84118"
                    },
                    "displayName": 'TM/Dia'
                  }
                ],
                "others":
                {
                    "properties": {
                         "color": "#0e5c67"
                    },
                    "displayName": "Otros"
                }
              };
            } else if(linea_produccion == 'L3'){
              rules = {
                "rules":
                [
                  {
                    "dataContext": {"Diámetro": '2.0"'},
                    "properties": {
                        "color":"#bfbfbf"
                    },
                    "displayName": '2.0"'
                  },
                  {
                    "dataContext": {"Diámetro": '2.5"'},
                    "properties": {
                        "color":"#215968"
                    },
                    "displayName": '2.5"'
                  },
                  {
                    "dataContext": {"Diámetro": '3.0"'},
                    "properties": {
                        "color":"#004080"
                    },
                    "displayName": '3.0"'
                  },
                  {
                    "dataContext": {"Diámetro": '3.5"'},
                    "properties": {
                        "color":"#008040"
                    },
                    "displayName": '3.5"'
                  },
                  {
                    "dataContext": {"Promedio": {min: 0}},
                    "properties": {
                        "color":"#5b9ad5",
                        "lineColor": "#5b9ad5"
                    },
                    "displayName": 'Promedio'
                  },
                  {
                    "dataContext": {"TM/Día": {min: 0}},
                    "properties": {
                        "color":"#e84118",
                        "lineColor": "#e84118"
                    },
                    "displayName": 'TM/Dia'
                  }
                ],
                "others":
                {
                    "properties": {
                         "color": "#0e5c67"
                    },
                    "displayName": "Otros"
                }
              };
            }
            
            oVizFrame.setVizProperties({
                interaction: {
                  selectability: {
                    mode: "NONE"
                  }
                },
                plotArea: {
                  dataPointStyle: rules,
                  dataLabel: {
                    visible: true,
                    renderer: function(oLabel) {
                      // if you want to remove the label text for Target Value
                      if (oLabel.ctx.measureNames === "Promedio" || oLabel.ctx.measureNames === "TM/Día") {
                        oLabel.text = "";
                      }
                    }
                  },
                  window: {
                      start: "firstDataPoint",
                      end: "lastDataPoint"
                  }
                },
                legendGroup:{
                  layout: {
                    position: "bottom",
                    alignment: "center"
                  },
                },
                title: {
                  text: "Producción " + linea_produccion
                },
                valueAxis: {
                  label: {
                    formatString: formatPattern.SHORTFLOAT_MFD2
                  },
                  title: {
                      visible: true,
                      text: "TM/Dia"
                  }
                }
              }
            );
            
            var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "valueAxis",
                  'type': "Measure",
                  'values': ["Producción"]
                }),
                feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "valueAxis",
                  'type': "Measure",
                  'values': ["Promedio"]
                }),
                feedValueAxisThird = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "valueAxis",
                  'type': "Measure",
                  'values': ["TM/Día"]
                }), 
                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  //'uid': "timeAxis",
                  'uid': "categoryAxis",
                  'type': "Dimension",
                  'values': ["Fecha"]
                });
  
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedValueAxisSecond);
            oVizFrame.addFeed(feedValueAxisThird);
            oVizFrame.addFeed(feedCategoryAxis);
  
            var oTooltip = new VizTooltip({});
              oTooltip.connect(oVizFrame.getVizUid());
              oTooltip.setFormatString(formatPattern.SHORTFLOAT_MFD2);
              oVizFrame.getDataset().setContext("Diámetro");
  
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      getComments: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        nameModel = "comments" + linea_produccion;

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarComentarios.php',
            type: 'post',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                for (let index = 0; index < response.length; index++) {
                  switch (response[index].mtto) {
                    case '01':
                      response[index].icon = 'assets/images/Mtto1.png';                   
                      break;
                    case '02':
                      response[index].icon = 'assets/images/Mtto2.png';                      
                      break;
                    default:
                      response[index].icon = '';  
                      break;            
                  }
                }
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.getView().setModel(oModel, nameModel);
            },
            error:  function(xhr, thrownError, ajaxOptions){
                alert(xhr.status);
                alert(thrownError);
            }
        });

      },
      returnComments: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        data;

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarComentarios.php',
            type: 'post',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                for (let index = 0; index < response.length; index++) {
                  switch (response[index].mtto) {
                    case '01':
                      response[index].icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWkAAAFoCAYAAACVJwrrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4RkRDMzA2ODc0RDUxMUU2OTVGNDhENkEzMEVBNDY3MSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4RkRDMzA2OTc0RDUxMUU2OTVGNDhENkEzMEVBNDY3MSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFGRDU2RjhGNzRDRDExRTY5NUY0OEQ2QTMwRUE0NjcxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFGRDU2RjkwNzRDRDExRTY5NUY0OEQ2QTMwRUE0NjcxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+d6E2cgAAQA5JREFUeNrsnQd4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";                   
                      break;
                    case '02':
                      response[index].icon = 'data:image/png;base64,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';                      
                      break;
                    default:
                      response[index].icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAsAAAAGMAQMAAADuk4YmAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAADlJREFUeF7twDEBAAAAwiD7p7bGDlgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAGJrAABgPqdWQAAAABJRU5ErkJggg==';  
                      break;            
                  }
                }
                data = response;
            },
            error:  function(xhr, thrownError, ajaxOptions){
                alert(xhr.status);
                alert(thrownError);
            }
        });

        return data;

      },
      setChartEficiencia: function(){
        var thes = this,
        lineas = thes.getLineaProduccionByStatus(),
        begin = 1;
        for (let index = 0; index < lineas.length; index++) {
          let idComments = 'commentsEficiencia';
          let idChart = 'idChartEficiencia' + begin;
          thes.generateChartEficiencia(lineas[index].code, idChart);
          thes.getCommentsEficiencia(lineas[index].code);
          thes.byId(idChart).setVisible(true);
          idComments = idComments + lineas[index].code;
          thes.byId(idComments).setVisible(true);
          begin++;  
        }
      },
      generateChartEficiencia: function(linea_produccion, idChart){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        meta = thes.getMetaEficiencia(year, linea_produccion),
        secondMeta = Number(meta) / 100;
        thes.removeFeeds(idChart);
        var oVizFrame = thes.byId(idChart);
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN2.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            for (let index = 0; index < response.length; index++) {
              response[index]['meta'] = secondMeta;            
            }
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(response);
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
              dimensions : [
                {
                  name : 'Diámetro',
                  value : "{diametro}"
                },
                {
                name : 'Fecha',
                value : "{fechaFinal}"
                }
              ],                           
              measures : [{
                name : 'Eficiencia',
                value : '{eficiencia}'
              },{
                name : 'Promedio',
                value : '{promedio}'
              },{
                name : 'Meta',
                value : '{meta}'
              }],                         
              data : {
                path : "/"
              }
            });		
            oVizFrame.setDataset(oDataset);
            oVizFrame.setModel(oModel);	
            oVizFrame.setVizType('combination');
  
            var rules = '';
  
            if(linea_produccion == 'L2'){
              rules = {
                "rules":
                [
                  {
                    "dataContext": {"Diámetro": '2.0"'},
                    "properties": {
                        "color":"#bfbfbf"
                    },
                    "displayName": '2.0"'
                  },
                  {
                    "dataContext": {"Diámetro": '2.5"'},
                    "properties": {
                        "color":"#215968"
                    },
                    "displayName": '2.5"'
                  },
                  {
                    "dataContext": {"Promedio": {min: 0}},
                    "properties": {
                        "color":"#5b9ad5",
                        "lineColor": "#5b9ad5"
                    },
                    "displayName": 'Promedio'
                  },
                  {
                    "dataContext": {"Meta": {min: 0}},
                    "properties": {
                        "color":"#1b1e23",
                        "lineColor": "#1b1e23"
                    },
                    "displayName": 'Meta: ' + meta + '%'
                  }
                ],
                "others":
                {
                    "properties": {
                         "color": "#0e5c67"
                    },
                    "displayName": "Otros"
                }
              };
            } else if(linea_produccion == 'L3'){
              rules = {
                "rules":
                [
                  {
                    "dataContext": {"Diámetro": '2.0"'},
                    "properties": {
                        "color":"#bfbfbf"
                    },
                    "displayName": '2.0"'
                  },
                  {
                    "dataContext": {"Diámetro": '2.5"'},
                    "properties": {
                        "color":"#215968"
                    },
                    "displayName": '2.5"'
                  },
                  {
                    "dataContext": {"Diámetro": '3.0"'},
                    "properties": {
                        "color":"#004080"
                    },
                    "displayName": '3.0"'
                  },
                  {
                    "dataContext": {"Diámetro": '3.5"'},
                    "properties": {
                        "color":"#008040"
                    },
                    "displayName": '3.5"'
                  },
                  {
                    "dataContext": {"Promedio": {min: 0}},
                    "properties": {
                        "color":"#5b9ad5",
                        "lineColor": "#5b9ad5"
                    },
                    "displayName": 'Promedio'
                  },
                  {
                    "dataContext": {"Meta": {min: 0}},
                    "properties": {
                        "color":"#1b1e23",
                        "lineColor": "#1b1e23"
                    },
                    "displayName": 'Meta: ' + meta + '%'
                  }
                ],
                "others":
                {
                    "properties": {
                         "color": "#0e5c67"
                    },
                    "displayName": "Otros"
                }
              };
            }
            
            oVizFrame.setVizProperties({
                interaction: {
                  selectability: {
                    mode: "NONE"        //only one data point can be selected at a time
                  }
                },
                plotArea: {
                  dataPointStyle: rules,
                  window: {
                    start: "firstDataPoint",
                    end: "lastDataPoint"
                  },
                  dataLabel: {
                    formatString: formatPattern.STANDARDPERCENT_MFD2,
                    visible: true,
                    renderer: function(oLabel) {
                      if (oLabel.ctx.measureNames == "Promedio") {
                        oLabel.text = "";
                        let promedio = oLabel.ctx.Promedio * 100;
                        promedio = promedio.toFixed(1);
                        oLabel.ctx.Promedio = promedio;
                        //oLabel.ctx.Promedio = (!oLabel.ctx.Promedio || oLabel.ctx.Promedio == "0.0") ?  oLabel.ctx.Promedio : oLabel.ctx.Promedio + "%";
                      } else if(oLabel.ctx.measureNames == "Meta"){
                        oLabel.text = "";
                        let meta = oLabel.ctx.Meta * 100;
                        meta = meta.toFixed(1);
                        oLabel.ctx.Meta = meta;
                        //oLabel.ctx.Meta = (!oLabel.ctx.Meta || oLabel.ctx.Meta == "0.0") ?  oLabel.ctx.Meta : oLabel.ctx.Meta + "%";
                      } else if(oLabel.ctx.measureNames == "Eficiencia"){
                        let eficiencia = oLabel.ctx.Eficiencia * 100;
                        eficiencia = eficiencia.toFixed(1);
                        oLabel.ctx.Eficiencia = eficiencia;
                        oLabel.ctx.Eficiencia = (!oLabel.ctx.Eficiencia || oLabel.ctx.Eficiencia == "0.0") ?  oLabel.ctx.Eficiencia : oLabel.ctx.Eficiencia + "%";
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
                  text: "Eficiencia " + linea_produccion
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
                  'values': ["Eficiencia"]
                }),
                feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "valueAxis",
                  'type': "Measure",
                  'values': ["Promedio"]
                }),
                feedValueAxisThird = new sap.viz.ui5.controls.common.feeds.FeedItem({
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
            oVizFrame.addFeed(feedCategoryAxis);
  
            var oTooltip = new VizTooltip({});
              oTooltip.connect(oVizFrame.getVizUid());
              oTooltip.setFormatString(formatPattern.STANDARDPERCENT_MFD2);
              oVizFrame.getDataset().setContext("Diámetro");
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      getCommentsEficiencia: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        nameModel = "commentsEficiencia" + linea_produccion;

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarComentariosEficiencia.php',
            type: 'post',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                for (let index = 0; index < response.length; index++) {
                  switch (response[index].mtto) {
                    case '01':
                      response[index].icon = 'assets/images/Mtto1.png';                   
                      break;
                    case '02':
                      response[index].icon = 'assets/images/Mtto2.png';                      
                      break;
                    default:
                      response[index].icon = '';  
                      break;            
                  }
                }
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.getView().setModel(oModel, nameModel);
            },
            error:  function(xhr, thrownError, ajaxOptions){
                alert(xhr.status);
                alert(thrownError);
            }
        });
      },
      returnCommentsEficiencia: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        data;

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarComentariosEficiencia.php',
            type: 'post',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response);
                data = response;
            },
            error:  function(xhr, thrownError, ajaxOptions){
                alert(xhr.status);
                alert(thrownError);
            }
        });

        return data;
      },
      getMetaEficiencia: function(year, linea_produccion){
        var thes = this,
        parametros = {
          '_Year': year,
          '_LineaProduccion': linea_produccion
        },
        data = 0;
  
        $.ajax({
          data: parametros,
          url: 'model/EFICIENCIA/ListarMeta.php',
          type: 'post',
          async: false,
          beforeSend: function(){},
          success: function(response){
            data = response;
          },
          error:  function(xhr, thrownError, ajaxOptions){
              alert(xhr.status);
              alert(thrownError);
          }
        });
  
        return data;
      },
      generateChartProduccionSecond: function(linea_produccion, idChart, idContent){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        real = 0,
        oContent = thes.byId(idContent);
        thes.removeFeeds(idChart);
        var oVizFrame = thes.byId(idChart);
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN3.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            real = (response.length > 0 ) ? response[0].secondQuantity : 0;
            var value, valueColor, indicator = '';
            value = response[response.length - 1].quantity;
            if(value >= 0){
              valueColor = 'Good';
              indicator = 'Up';
            } else {
              valueColor = 'Error';
              indicator = 'Down';
            }
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(response);
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
              dimensions : [{
                name : 'Descripción',
                value : "{descrip}"}
              ],                           
              measures : [{
                name : 'Cantidad',
                value : '{secondQuantity}'
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
                    visible: false
                  },
                  colorPalette:['#31859c', '#dae3f3']
                },
                legend: {
                  visible: false
                },
                title: {
                  text: "REAL: " + real + " TM"
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
                  'values': ["Descripción"]
                });
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedCategoryAxis);
            oContent.setValue(value);
            oContent.setValueColor(valueColor);
            oContent.setIndicator(indicator);
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      generateChartProduccionThird: function(linea_produccion, idChart, idContent){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        proy = 0,
        oContent = thes.byId(idContent);
        thes.removeFeeds(idChart);
        var oVizFrame = thes.byId(idChart);
        
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN4.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            proy = (response.length > 0) ? response[0].quantity : 0;
            var meta = response[response.length - 1].meta;
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(response);
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
              dimensions : [{
                name : 'Descripción',
                value : "{descrip}"}
              ],                           
              measures : [{
                name : 'TM',
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
                    visible: false
                  },
                  colorPalette:['#7f7f7f', '#bfbfbf']
                },
                legend: {
                  visible: false
                },
                title: {
                  text: "PROY: " + proy + " TM"
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
                  'values': ["TM"]
                }),    
                feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                  'uid': "color",
                  'type': "Dimension",
                  'values': ["Descripción"]
                });
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedCategoryAxis);
            oContent.setValue(meta);
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      },
      /*createGauge: function(linea_produccion, idGauge, idContent){
        var thes = this,
        AvReal = thes.getDataGauge(linea_produccion, idContent);
        g = new JustGage({
          id: thes.byId(idGauge).sId,
          value: AvReal,
          min: 0,
          max: 100,
          symbol: '%',
          title: "AVANCE",
          label: "",
          pointer: true,
          pointerOptions: {
            toplength: -15,
            bottomlength: 10,
            bottomwidth: 12,
            color: '#8e8e93',
            stroke: '#ffffff',
            stroke_width: 3,
            stroke_linecap: 'round'
          },
          levelColors: [
            "#ff0000",
            "#ffff00",
            "#00b04f"
          ]
        });
      },*/
      getDataGauge: function(linea_produccion, idContent){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
          parametros = {
            '_Year': year,
            '_Month': month,
            '_Linea': linea_produccion
          },
          avance = 0,
          oContent = thes.byId(idContent);
  
          $.ajax({
              data: parametros,
              url: 'model/PRO/ListarAvance.php',
              type: 'post',
              async: false,
              beforeSend: function(){},
              success: function(response){
                  response = JSON.parse(response);
                  var value, valueColor, indicator = '';
                  let AvReal = response.root.AvReal;
                  value = response.root.Diferencia;
                  if(value >= 0){
                    valueColor = 'Good';
                    indicator = 'Up';
                  } else {
                    valueColor = 'Error';
                    indicator = 'Down';
                  }
                  avance = AvReal;
                  oContent.setValue(value);
                  oContent.setValueColor(valueColor);
                  oContent.setIndicator(indicator);                
              },
              error:  function(xhr, thrownError, ajaxOptions){
                  alert(xhr.status);
                  alert(thrownError);
              }
          });
  
          return avance;
      },
      /*setGauges: function(){
        var thes = this,
        lineas = thes.getLineaProduccionByStatus(),
        begin = 1;
        for (let index = 0; index < lineas.length; index++) {
          let idGauge = 'idProduccionFour' + begin;
          let idContentFour = 'TileContentFour' + begin;
          thes.createGauge(lineas[index].code, idGauge, idContentFour);
          begin++;  
        }
      },*/
      createGaugeN1: function(){
      
        var thes = this,
        AvReal = thes.getDataGauge('L2', 'TileContentFour1');
        if(thes.byId("idProduccionFour1")){
          g = new JustGage({
            id: thes.byId("idProduccionFour1").sId,
            value: AvReal,
            min: 0,
            max: 100,
            symbol: '%',
            title: "AVANCE L2",
            label: "",
            pointer: true,
            pointerOptions: {
              toplength: -15,
              bottomlength: 10,
              bottomwidth: 12,
              color: '#8e8e93',
              stroke: '#ffffff',
              stroke_width: 3,
              stroke_linecap: 'round'
            },
            levelColors: [
              "#ff0000",
              "#ffff00",
              "#00b04f"
            ]
          });
        }
      },
      createGaugeN2: function(){
      
        var thes = this,
        AvReal = thes.getDataGauge('L3', 'TileContentFour2');
        if(thes.byId("idProduccionFour2")){
          h = new JustGage({
            id: thes.byId("idProduccionFour2").sId,
            value: AvReal,
            min: 0,
            max: 100,
            symbol: '%',
            title: "AVANCE L3",
            label: "",
            pointer: true,
            pointerOptions: {
              toplength: -15,
              bottomlength: 10,
              bottomwidth: 12,
              color: '#8e8e93',
              stroke: '#ffffff',
              stroke_width: 3,
              stroke_linecap: 'round'
            },
            levelColors: [
              "#ff0000",
              "#ffff00",
              "#00b04f"
            ]
          });
        }
      },
      returnDataProDet: function(linea_produccion){
        var thes = this,
        firstData = thes.returnDataChartProduccionSecond(linea_produccion),
        firstData = firstData[firstData.length - 1].quantity,
        firstData = Number(firstData),
        secondData = thes.returnDataChartProduccionThird(linea_produccion),
        secondData = secondData[secondData.length - 1].meta,
        secondData = Number(secondData),
        thirdData = thes.returnDataGauge(linea_produccion),
        thirdData = Number(thirdData),
        colorOne = (firstData >= 0) ? 'green' : 'red',
        colorTwo = (thirdData >= 0) ? 'green' : 'red',
        firstDataString = "Dif. " + firstData + " TM",
        secondDataString = "Meta Mes " + secondData + " TM",
        thirdDataString = "Dif. " + thirdData + "%";
        var row = [{text: firstDataString, color: colorOne, alignment: 'center', bold: true}, {text: secondDataString, alignment: 'center', bold: true},{text: thirdDataString, color: colorTwo, alignment: 'center', bold: true}];

        return row;
      },
      returnDataChartProduccionSecond: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },data = 0;
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN3.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            data = response;
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      returnDataChartProduccionThird: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },data = 0;
        
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN4.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            data = response;           
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      returnDataGauge: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
          parametros = {
            '_Year': year,
            '_Month': month,
            '_Linea': linea_produccion
          },
          value = 0;
  
          $.ajax({
              data: parametros,
              url: 'model/PRO/ListarAvance.php',
              type: 'post',
              async: false,
              beforeSend: function(){},
              success: function(response){
                response = JSON.parse(response);
                value = response.root.Diferencia;      
              },
              error:  function(xhr, thrownError, ajaxOptions){
                  alert(xhr.status);
                  alert(thrownError);
              }
          });
  
          return value;
      },
      dynamicLoadSecond: function(){
        sap.ui.core.BusyIndicator.show();
        var thes = this;
        var imageURLs = thes.getAllSrc();
        var Calidad = thes.getAllSrcCalidad();
        var Produccion = thes.getAllSrcProduccion();
        var ProduccionDetalle = thes.getAllSrcProduccionDetalle();
        var ProduccionSecond = thes.getAllSrcProduccionSecond();
        var ProduccionDetalleSecond = thes.getAllSrcProduccionDetalleSecond();
        var Eficiencia = thes.getAllSrcEficiencia();
        var EficienciaSecond = thes.getAllSrcEficienciaSecond();
        var Trf = thes.getAllSrcTrf();
        var Mantto = thes.getAllSrcMantto();
        var Oee = thes.getAllSrcOee();
        var OeeDetalle = thes.getAllSrcOeeDetalle();
        var OeeSecond = thes.getAllSrcOeeSecond();
        var OeeDetalleSecond = thes.getAllSrcOeeDetalleSecond();

        if(Calidad.length != 0){
          imageURLs = [...imageURLs, ...Calidad];
        }
        if(Mantto.length != 0){
          imageURLs = [...imageURLs, ...Mantto];
        }
        if(Produccion.length != 0){
          imageURLs = [...imageURLs, ...Produccion];
        }
        if(ProduccionDetalle.length != 0){
          imageURLs = [...imageURLs, ...ProduccionDetalle];
        }
        if(ProduccionSecond.length != 0){
          imageURLs = [...imageURLs, ...ProduccionSecond];
        }
        if(ProduccionDetalleSecond.length != 0){
          imageURLs = [...imageURLs, ...ProduccionDetalleSecond];
        }
        if(Eficiencia.length != 0){
          imageURLs = [...imageURLs, ...Eficiencia];
        }
        if(EficienciaSecond.length != 0){
          imageURLs = [...imageURLs, ...EficienciaSecond];
        }
        if(Trf.length != 0){
          imageURLs = [...imageURLs, ...Trf];
        }
        if(Oee.length != 0){
          imageURLs = [...imageURLs, ...Oee];
        }
        if(OeeDetalle.length != 0){
          imageURLs = [...imageURLs, ...OeeDetalle];
        }
        if(OeeSecond.length != 0){
          imageURLs = [...imageURLs, ...OeeSecond];
        }
        if(OeeDetalleSecond.length != 0){
          imageURLs = [...imageURLs, ...OeeDetalleSecond];
        }

        var imageObjs = [];
        var imagesLoaded = 0;
        for (var i = 0; i < imageURLs.length; i++) {
          var url;
          if(imageURLs[i].area == "PRODUCCIONDETALLEGAUGE" || imageURLs[i].area == "PRODUCCIONDETALLEGAUGESECOND" || imageURLs[i].area == "EFICIENCIA" || imageURLs[i].area == "EFICIENCIASECOND" || imageURLs[i].area == "OEEDETALLE" || imageURLs[i].area == "OEEDETALLESECOND"){
            var DOMURL = window.URL || window.webkitURL || window;
            var image64 = new XMLSerializer().serializeToString(imageURLs[i]);
            var svgBlob = new Blob([image64], {type: "image/svg+xml;charset=utf-8"});
            url = DOMURL.createObjectURL(svgBlob);
          }
          var canvas = document.createElement("canvas");
          canvas.setAttribute("width", imageURLs[i].clientWidth);
          canvas.setAttribute("height", imageURLs[i].clientHeight);
          var context = canvas.getContext("2d");
          var image = new Image();
            image.addEventListener( "load", function() {
                context.drawImage(image, 0, 0);
                imagesLoaded++;
                if (imagesLoaded == imageURLs.length) thes.allImagesLoadedSecond(imageObjs);
            } );
            image.width = imageURLs[i].clientWidth;
            image.height = imageURLs[i].clientHeight;
            image.area = imageURLs[i].area;
            image.src = (imageURLs[i].area == "PRODUCCIONDETALLEGAUGE" || imageURLs[i].area == "PRODUCCIONDETALLEGAUGESECOND" || imageURLs[i].area == "EFICIENCIA" || imageURLs[i].area == "EFICIENCIASECOND" || imageURLs[i].area == "OEEDETALLE" || imageURLs[i].area == "OEEDETALLESECOND") ? url : "data:image/svg+xml," + jQuery.sap.encodeURL(
              imageURLs[i].outerHTML.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'));
            imageObjs.push(image);
        }
      },
      allImagesLoadedSecond: function (imageObjs) {
        var thes = this,
        dateToday = new Date(),
        dateToday = thes.operateDate(dateToday, -1),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        month = month + 1,
        day = dateToday.getDate(),
        dateStringSecond = day + '/' +  month + '/' + year,
        charts_sima = [],
        charts_calidad = [],
        charts_produccion = [],
        charts_produccion_detalle = [],
        charts_produccion_second = [],
        charts_produccion_detalle_second = [],
        charts_eficiencia = [],
        charts_eficiencia_second = [],
        charts_trf = [],
        charts_mantto = [],
        charts_oee = [],
        charts_oee_detalle = [],
        charts_oee_second = [],
        charts_oee_detalle_second = [],
        content = [],
        title,
        headerTable,
        secondHeader,
        commentsProL2 = thes.returnComments('L2'),
        commentsProL3 = thes.returnComments('L3'),
        commentsEfiL2 = thes.returnCommentsEficiencia('L2'),
        commentsEfiL3 = thes.returnCommentsEficiencia('L3'),
        logoMepsaAch = 'data:image/png;base64,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';

        for (let index = 0; index < imageObjs.length; index++) {
          var canvas = document.createElement("canvas");
          canvas.setAttribute("width", imageObjs[index].width);
          canvas.setAttribute("height", imageObjs[index].height);
          var context = canvas.getContext('2d');
          context.drawImage(imageObjs[index], 0, 0);
          var pngUrl = canvas.toDataURL('image/png');
          if(imageObjs[index].area == 'SIMA'){
            charts_sima.push(pngUrl);
          } else if(imageObjs[index].area == 'CALIDAD'){
            charts_calidad.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCION'){
            charts_produccion.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCIONDETALLE' || imageObjs[index].area == 'PRODUCCIONDETALLEGAUGE'){
            charts_produccion_detalle.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCIONSECOND'){
            charts_produccion_second.push(pngUrl);
          } else if(imageObjs[index].area == 'PRODUCCIONDETALLESECOND' || imageObjs[index].area == 'PRODUCCIONDETALLEGAUGESECOND'){
            charts_produccion_detalle_second.push(pngUrl);
          } else if(imageObjs[index].area == 'EFICIENCIA'){
            charts_eficiencia.push(pngUrl);
          } else if(imageObjs[index].area == 'EFICIENCIASECOND'){
            charts_eficiencia.push(pngUrl);
          } else if(imageObjs[index].area == 'TRF'){
            charts_trf.push(pngUrl);
          } else if(imageObjs[index].area == 'MANTTO'){
            charts_mantto.push(pngUrl);
          } else if(imageObjs[index].area == 'OEE'){
            charts_oee.push(pngUrl);
          } else if(imageObjs[index].area == 'OEEDETALLE'){
            charts_oee_detalle.push(pngUrl);
          } else if(imageObjs[index].area == 'OEESECOND'){
            charts_oee_second.push(pngUrl);
          } else if(imageObjs[index].area == 'OEEDETALLESECOND'){
            charts_oee_detalle.push(pngUrl);
          }
        }

        //Header SIMA
        title = 'INDICADORES SIMA';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 20]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0, 20]}],
              ]
          }
        };
        secondHeader = {
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
            widths: ['*'],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //Content SIMA

        if(charts_sima.length != 0){
    
          var contSima = 0;
          var arrayTempSima = [];

          for (let index = 0; index < charts_sima.length; index++) {

            let objectTemp = {image: charts_sima[index], width: 255, height: 300};
            arrayTempSima.push(objectTemp);
            contSima++;

            if(contSima % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempSima);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempSima = [];
            } else if((charts_sima.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempSima);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempSima = [];
            }   
          }
        }

        //HEADER CALIDAD

        title = 'CALIDAD BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 20]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT CALIDAD

        if(charts_calidad.length != 0){

          var contCalidad = 0;
          var arrayTempCalidad = [];

          for (let index = 0; index < charts_calidad.length; index++) {

            let objectTemp = {image: charts_calidad[index], width: 255, height: 300};
            arrayTempCalidad.push(objectTemp);
            contCalidad++;

            if(contCalidad % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempCalidad);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempCalidad = [];
            } else if((charts_calidad.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempCalidad);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempCalidad = [];
            }
          }
        }

        //HEADER PRODUCCIÓN

        title = 'PRODUCCIÓN BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 10]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT PRODUCCIÓN

        if(charts_produccion.length != 0){
          var arrayTempProduccion = [];

          for (let index = 0; index < charts_produccion.length; index++) {
            let objectTemp = {image: charts_produccion[index], width: 510, height: 250};
            arrayTempProduccion.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempProduccion);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempProduccion = [];
          }

          if(commentsProL2.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Tipo', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsProL2.length; index++) {
              let tempArray = [{text: commentsProL2[index].fecha, style: 'styleTableComments'},{text: commentsProL2[index].comment, style: 'styleTableComments'}, {image: commentsProL2[index].icon, fit:[20,20], margin: [ 3, 2, 0, 0]}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*', 30],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }

          var arrayTempProduccionDetalle = [],
          otherTemp = [],
          prueba = {};
          
          for (let index = 0; index < charts_produccion_detalle.length; index++) {

            let objectTemp = {image: charts_produccion_detalle[index], width: 180};
            arrayTempProduccionDetalle.push(objectTemp);
          }

          otherTemp.push(arrayTempProduccionDetalle);
          var contentDetalle = thes.returnDataProDet('L2');
          otherTemp.push(contentDetalle);

          prueba = {  style: 'tableExampleSecond',
                          table: {widths: ['*', '*', '*'],
                                  body: otherTemp
                                },
                          layout: 'noBorders'
                      };
          
          content.push(prueba); 
          
        }

        if(charts_produccion_second.length != 0){
          var arrayTempProduccion = [];

          for (let index = 0; index < charts_produccion_second.length; index++) {
            let objectTemp = {image: charts_produccion_second[index], width: 510, height: 250};
            arrayTempProduccion.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempProduccion);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempProduccion = [];
          }

          if(commentsProL3.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Tipo', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsProL3.length; index++) {
              let tempArray = [{text: commentsProL3[index].fecha, style: 'styleTableComments'},{text: commentsProL3[index].comment, style: 'styleTableComments'}, {image: commentsProL3[index].icon, fit:[20,20], margin: [ 3, 2, 0, 0]}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*', 30],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }

          var arrayTempProduccionDetalle = [],
          otherTemp = [],
          prueba = {};
          
          for (let index = 0; index < charts_produccion_detalle_second.length; index++) {

            let objectTemp = {image: charts_produccion_detalle_second[index], width: 180};
            arrayTempProduccionDetalle.push(objectTemp);
          }

          otherTemp.push(arrayTempProduccionDetalle);
          var contentDetalle = thes.returnDataProDet('L3');
          otherTemp.push(contentDetalle);

          prueba = {  style: 'tableExampleSecond',
                          table: {widths: ['*', '*', '*'],
                                  body: otherTemp
                                },
                          layout: 'noBorders'
                      };
          
          content.push(prueba); 
          
        }

        //HEADER EFICIENCIA

        title = 'EFICIENCIA BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center', margin: [0, 10]}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT EFICIENCIA

        if(charts_eficiencia.length != 0){
          var arrayTempEficiencia = [];

          for (let index = 0; index < charts_eficiencia.length; index++) {
            let objectTemp = {image: charts_eficiencia[index], width: 510, height: 250};
            arrayTempEficiencia.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempEficiencia);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempEficiencia = [];
          }

          if(commentsEfiL2.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsEfiL2.length; index++) {
              let tempArray = [{text: commentsEfiL2[index].fecha, style: 'styleTableComments'},{text: commentsEfiL2[index].comment, style: 'styleTableComments'}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*'],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }
        }

        if(charts_eficiencia_second.length != 0){
          var arrayTempEficiencia = [];

          for (let index = 0; index < charts_eficiencia_second.length; index++) {
            let objectTemp = {image: charts_eficiencia_second[index], width: 510, height: 250};
            arrayTempEficiencia.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempEficiencia);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempEficiencia = [];
          }

          if(commentsEfiL3.length > 0){
            var cabecera = [{text: 'Fecha', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}, {text: 'Comentarios', fillColor: '#d9d9d9', alignment: 'center', style: 'styleTableComments'}];
            var arrayGlobal = [];
            var prueba = {};
            for (let index = 0; index < commentsEfiL3.length; index++) {
              let tempArray = [{text: commentsEfiL3[index].fecha, style: 'styleTableComments'},{text: commentsEfiL3[index].comment, style: 'styleTableComments'}];
              arrayGlobal.push(tempArray);              
            }
            arrayGlobal.unshift(cabecera);
            prueba = {  style: 'tableExample',
                        layout: {
                          hLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.body.length) ? 0.1 : 0.1;
                          },
                          vLineWidth: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0.1 : 0.1;
                          }
                        },
                        table: {widths: [30, '*'],
                                body: arrayGlobal
                              }
                      };
            content.push(prueba);
          }
        }

        //HEADER COSTO TRF

        title = 'COSTOS DE TRANSFORMACIÓN BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center'}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ['*'],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //Content TRF

        if(charts_trf.length != 0){
    
          var contTrf = 0;
          var arrayTempTrf = [];

          for (let index = 0; index < charts_trf.length; index++) {

            let objectTemp = {image: charts_trf[index], width: 255, height: 300};
            arrayTempTrf.push(objectTemp);
            contTrf++;

            if(contTrf % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempTrf);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempTrf = [];
            } else if((charts_trf.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempTrf);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempTrf = [];
            }   
          }
        }

        //HEADER MANTTO

        title = 'COSTOS DE MANTENIMIENTO BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center'}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        if(charts_mantto.length != 0){
          var contMantto = 0;
          var arrayTempMantto = [];

          for (let index = 0; index < charts_mantto.length; index++) {

            let objectTemp = {image: charts_mantto[index], width: 255};
            arrayTempMantto.push(objectTemp);
            contMantto++;

            if(contMantto % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempMantto);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempMantto = [];
            } else if((charts_mantto.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempMantto);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempMantto = [];
            }
          }
        }

        //HEADER OEE

        title = 'OVERALL EQUIPMENT EFFECTIVENESS (OEE) BOLAS FORJADAS';
        headerTable = {
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
            widths: [100,200, '*'],
              body: [
                [{image: logoMepsaAch, fit:[100,100], margin: [0, 12]}, {text: title, style: 'tableHeaderN1', alignment: 'center'}, {text: 'SISTEMA INTEGRADO DE GESTIÓN', style: 'tableHeaderN2', alignment: 'center', margin: [0,20]}],
              ]
          },
          pageBreak: 'before'
        };
        secondHeader = {
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
            widths: ["*"],
            headerRows: 1,
              body: [
                [{text: 'Reporte al día ' + dateStringSecond, style: 'tableHeaderN3', alignment: 'center'}],
              ]
          }
        };
        content.push(headerTable);
        content.push(secondHeader);

        //CONTENT OEE
        
        if(charts_oee.length > 0){
          var contOee = 0;
          var arrayTempOee = [];

          for (let index = 0; index < charts_oee.length; index++) {

            let objectTemp = {image: charts_oee[index], width: 255, height: 190};
            arrayTempOee.push(objectTemp);
            contOee++;

            if(contOee % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            } else if((charts_oee.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            }   
          }
        }

        if(charts_oee_detalle.length != 0){
          var arrayTempOeeDetalle = [];

          for (let index = 0; index < charts_oee_detalle.length; index++) {
            let objectTemp = {image: charts_oee_detalle[index], width: 510, height: 250};
            arrayTempOeeDetalle.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempOeeDetalle);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempOeeDetalle = [];
          }
        }

        if(charts_oee_second.length > 0){
          var contOee = 0;
          var arrayTempOee = [];

          for (let index = 0; index < charts_oee_second.length; index++) {

            let objectTemp = {image: charts_oee_second[index], width: 255, height: 190};
            arrayTempOee.push(objectTemp);
            contOee++;

            if(contOee % 2 == 0){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*', '*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            } else if((charts_oee_second.length - 1) == index){
              let otherTemp = [];
              otherTemp.push(arrayTempOee);
              let prueba = {  style: 'tableExample',
                              table: {widths: ['*'],
                                      body: otherTemp
                                    },
                              layout: 'noBorders'
                          };
              
              content.push(prueba);
              arrayTempOee = [];
            }   
          }
        }

        if(charts_oee_detalle_second.length != 0){
          var arrayTempOeeDetalle = [];

          for (let index = 0; index < charts_oee_detalle_second.length; index++) {
            let objectTemp = {image: charts_oee_detalle_second[index], width: 510, height: 250};
            arrayTempOeeDetalle.push(objectTemp);

            let otherTemp = [];
            otherTemp.push(arrayTempOeeDetalle);
            let prueba = {  style: 'tableExample',
                            table: {widths: ['*'],
                                    body: otherTemp
                                  },
                            layout: 'noBorders'
                        };
            
            content.push(prueba);
            arrayTempOeeDetalle = [];
          }
        }

        thes.sendPDF(content);
      },
      sendPDF: function(content){
        var thes = this,
        dateToday = new Date(),
        dateToday = thes.operateDate(dateToday, -1),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        month = month + 1,
        day = dateToday.getDate(),
        dateString = day + '.' +  month + '.' + year,
        stringDownload =  'Reporte OKR ACh al ' + dateString + '.pdf';

        pdfMake.fonts = {
          Times: {
            normal: 'Times-New-Roman-Normal.ttf',
            bold: 'Times-New-Roman-Bold.ttf',
            italics: 'Times-New-Roman-Italic.ttf',
            bolditalics: 'Times-New-Roman-Bold-Italic.ttf'
          }
        };

        var docDefinition = {
          content: content,
          styles: {
            tableExample: {
              margin: [0, 1, 0, 10]
            },
            tableExampleSecond: {
              margin: [0, 5, 0, 10]
            },
            tableHeaderN1: {
              fontSize: 14,
              bold: true
            },
            tableHeaderN2: {
              fontSize: 10
            },
            tableHeaderN3: {
              fontSize: 10,
              bold: true
            },
            styleTableComments: {
              fontSize: 10,
              bold: false
            }
          },
          defaultStyle: {
            font: 'Times'
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
              url: 'model/PRO/UploadReporteOKRS.php',
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
   });
});
