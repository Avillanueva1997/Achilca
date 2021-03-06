jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format'
 ], function (BaseController, ChartFormatter, Format) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.SIMA.SIMA03", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sima03").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.setChartN6();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.showBusyIndicator(3000, 0);
thes.getRouter().navTo("homeSIMA");
      thes.removeFeeds('idChart6');
    },
    setChartN6: function(){
      var thes = this,
      parametros = {};
      thes.removeFeeds('idChart6');
      var oVizFrame = thes.byId('idChart6');

      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

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
              legendGroup:{
                layout: {
                  position: "bottom",
                  alignment: "center"
                },
              },
              title: {
                text: "Índice de Severidad",
                visible: false
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
    }
  });
 });