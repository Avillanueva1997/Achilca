jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast",
 'sap/viz/ui5/controls/VizTooltip',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format'
 ], function (BaseController, MessageToast, VizTooltip, ChartFormatter, Format) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.SIG.SIG02-2", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sig02-2").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("sig02-2");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      auditoria = oEvent.getParameters().data.auditoria;
      thes.generateChart(auditoria);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("sig02");
    },
    onChangeData: function(){
        var thes = this;

    },
    generateChart: function(auditoria){
      var thes = this,
      parametros = {
        '_Auditoria': auditoria
      };

      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/SIG/GenerarChartN2.php',
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
                name : 'Tipo',
                value : "{Type}"
              }
            ],                           
            measures : [{
              name : 'NcMa',
              value : '{no_cfd_mayor}'
            },{
              name : 'NcMe',
              value : '{no_cfd_menor}'
            },{
              name : 'Obs',
              value : '{obs}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('stacked_column');
          
          oVizFrame.setVizProperties({
              interaction: {
                selectability: {
                  mode: "NONE"        //only one data point can be selected at a time
                }
              },
              plotArea: {
                //dataPointStyle: rules,
                dataLabel: {
                    visible: true
                }/*,
                referenceLine: {
                    line: {
                      valueAxis: [
                        {
                          value: 93,
                          visible: true,
                          label: {
                              text: "93%",
                              visible: true
                          }
                        }
                      ]
                    }
                }*/,
                window: {
                  start: "firstDataPoint",
                  end: "lastDataPoint"
                }
              },
              title: {
                text: auditoria
              },
              valueAxis: {
                label: {
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
                'values': ["NcMa"]
              }),
              feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["NcMe"]
              }),
              feedValueAxisThree = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Obs"]
              }),
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Tipo"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedValueAxisSecond);
          oVizFrame.addFeed(feedValueAxisThree);
          oVizFrame.addFeed(feedCategoryAxis);

          /*var oTooltip = new VizTooltip({});
            oTooltip.connect(oVizFrame.getVizUid());
            oTooltip.setFormatString(formatPattern.STANDARDFLOAT);
            oVizFrame.getDataset().setContext("Diámetro");*/
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    }
  });
 });