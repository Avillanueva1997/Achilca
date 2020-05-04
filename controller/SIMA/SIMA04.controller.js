jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/ui/app01/assets/libs/moment",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast",
 'sap/m/Label',
 'sap/m/Popover',
 "sap/ui/core/format/DateFormat",
 'sap/ui/core/Fragment',
 'sap/base/Log'
 ], function (BaseController, momentjs, jQuery, JSONModel, MessageToast, Label, Popover, DateFormat, Fragment, Log) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.SIMA.SIMA04", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sima04").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.setChartN1();
      thes.setChartN2();
      thes.setChartN3();
      thes.setChartN4();
      thes.setChartN5();
      thes.setChartN6();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeSIMA");
      thes.removeFeeds('idChart1');
      thes.removeFeeds('idChart2');
      thes.removeFeeds('idChart3');
      thes.removeFeeds('idChart4');
      thes.removeFeeds('idChart5');
      thes.removeFeeds('idChart6');
    },
    setChartN1: function(){
      var thes = this,
      parametros = {},
      oVizFrame = thes.byId('idChart1');
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
      parametros = {},
      oVizFrame = thes.byId('idChart2');
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
              title: {
                text: "Cantidad de Incidentes YTD"
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
      year = thes.byId('btnFilterYear').getSelectedKey();

      var parametros = {
        '_year': year
      },

      oVizFrame = thes.byId('idChart3');
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
      },
      oVizFrame = thes.byId('idChart4');
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
    setChartN5: function(){
      var thes = this,
      parametros = {},
      oVizFrame = thes.byId('idChart5');
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
    setChartN6: function(){
      var thes = this,
      parametros = {},
      oVizFrame = thes.byId('idChart6');
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
    removeFeeds: function(id){
      var thes = this;
      var oVizFrame = thes.byId(id);
      oVizFrame.removeAllFeeds();
    },
    onExportPDF: function(oEvent){
      var date = new Date(),
      msDate = date.getTime(),
      namePDF = 'AChilca'+msDate; 
      //Step 1: Export chart content to svg
      var oVizFrame = this.getView().byId("idChart1");
      var sSVG = oVizFrame.exportToSVGString({
        width: 800,
        height: 600
      });

      // UI5 library bug fix:
      //    Legend SVG created by UI5 library has transform attribute with extra space
      //    eg:   transform="translate (-5,0)" but it should be without spaces in string quotes
      //    tobe: transform="translate(-5,0)
      sSVG = sSVG.replace(/translate /gm, "translate");

      //Step 2: Create Canvas html Element to add SVG content
      var oCanvasHTML = document.createElement("canvas");
      canvg(oCanvasHTML, sSVG); // add SVG content to Canvas

      // STEP 3: Get dataURL for content in Canvas as PNG/JPEG
      var sImageData = oCanvasHTML.toDataURL("image/png");

      /*var oVizFrameSecond = this.getView().byId("idChart2");
      var sSVGSecond = oVizFrameSecond.exportToSVGString({
        width: 800,
        height: 600
      });
      sSVGSecond = sSVGSecond.replace(/translate /gm, "translate");
      var oCanvasHTMLSecond = document.createElement("canvas");
      canvg(oCanvasHTMLSecond, sSVGSecond);
      var sImageDataSecond = oCanvasHTMLSecond.toDataURL("image/png");

      var oVizFrameThird = this.getView().byId("idChart3");
      var sSVGThird = oVizFrameThird.exportToSVGString({
        width: 800,
        height: 600
      });
      sSVGThird = sSVGThird.replace(/translate /gm, "translate");
      var oCanvasHTMLThird = document.createElement("canvas");
      canvg(oCanvasHTMLThird, sSVGThird);
      var sImageDataThird = oCanvasHTMLThird.toDataURL("image/png");

      var oVizFrameFour = this.getView().byId("idChart4");
      var sSVGFour = oVizFrameFour.exportToSVGString({
        width: 800,
        height: 600
      });
      sSVGFour = sSVGFour.replace(/translate /gm, "translate");
      var oCanvasHTMLFour = document.createElement("canvas");
      canvg(oCanvasHTMLFour, sSVGFour);
      var sImageDataFour = oCanvasHTMLFour.toDataURL("image/png");

      var oVizFrameFive = this.getView().byId("idChart5");
      var sSVGFive = oVizFrameFive.exportToSVGString({
        width: 800,
        height: 600
      });
      sSVGFive = sSVGFive.replace(/translate /gm, "translate");
      var oCanvasHTMLFive = document.createElement("canvas");
      canvg(oCanvasHTMLFive, sSVGFive);
      var sImageDataFive = oCanvasHTMLFive.toDataURL("image/png");

      var oVizFrameSix = this.getView().byId("idChart6");
      var sSVGSix = oVizFrameSix.exportToSVGString({
        width: 800,
        height: 600
      });
      sSVGSix = sSVGSix.replace(/translate /gm, "translate");
      var oCanvasHTMLSix = document.createElement("canvas");
      canvg(oCanvasHTMLSix, sSVGSix);
      var sImageDataSix = oCanvasHTMLSix.toDataURL("image/png");*/

      // STEP 4: Create PDF using library jsPDF
      var oPDF = new jsPDF();
      // oPDF.addImage(sImageData, "PNG", Espacio en la izquierda, Espacio arriba, width, height);
      oPDF.addImage(sImageData, "PNG", 10, 40, 160, 80);
      /*oPDF.addImage(sImageDataSecond, "PNG", 50, 40, 160, 80);
      oPDF.addImage(sImageDataThird, "PNG", 10, 80, 160, 80);
      oPDF.addImage(sImageDataFour, "PNG", 50, 80, 160, 80);
      oPDF.addImage(sImageDataFive, "PNG", 10, 40, 160, 80);
      oPDF.addImage(sImageDataSix, "PNG", 50, 40, 160, 80);*/
      oPDF.save(namePDF + ".pdf");
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