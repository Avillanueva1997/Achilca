jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController"
 ], function (BaseController) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.OKR2.OKR2-3-LP-D", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr2-3-LP-D").attachPatternMatched(this._onObjectMatched, this);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.generateChart();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("okr2-3");
    },
    generateChart: function(){
        var thes = this,
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        moye = month + '.' + year,
        linea_produccion = pieces[pieces.length - 2],
        diametro = pieces[pieces.length - 1],
        diametro = diametro.slice(0, -3),
        parametros = {
            '_LineaProduccion': linea_produccion,
            '_Moye': moye,
            '_Diametro': diametro + '"'
        };

        thes.removeFeeds('idChart1');
        var oVizFrame = thes.byId('idChart1');

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
                        visible: true,
                        renderer: function(oLabel) {
                            if(oLabel.ctx.Cantidad){
                                oLabel.ctx.Cantidad = oLabel.ctx.Cantidad + " TM";
                            }
                        }
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
                    text: "Distribución Bola Obs"
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
    }
  });
 });