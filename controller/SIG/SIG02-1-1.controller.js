jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/m/MessageToast"
 ], function (BaseController, MessageToast) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.SIG.SIG02-1-1", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sig02-1-1").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("sig02-1-1");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      auditoria = oEvent.getParameters().data.auditoria;
      thes.setChartN1(auditoria);
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.removeFeeds('idChart1');
      thes.getRouter().navTo("sig02");
    },
    setChartN1: function(auditoria){
      var thes = this,
      parametros = {
        '_Auditoria': auditoria
      },
      oVizFrame = thes.byId('idChart1');
      $.ajax({
        data: parametros,
        url: 'model/SIG/GenerarChartN1.php',
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
              name : 'Término',
              value : "{description}"}
            ],                           
            measures : [{
              name : 'NcMa',
              value : '{no_cfd_mayor}'},
              {
              name : 'NcMe',
              value : '{no_cfd_menor}'},
              {
              name : 'Obs',
              value : '{obs}'}
            ],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('radar');
          
          oVizFrame.setVizProperties({
              interaction: {
                selectability: {
                  mode: "NONE"
                }
              },
              plotArea: {
                dataLabel: {
                  visible: false
                }
              },
              legendGroup:{
                layout: {
                  position: "bottom",
                  alignment: "center"
                },
              },
              title: {
                text: auditoria,
                visible: true
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
                'values': ["NcMa"]
              }),
              feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["NcMe"]
              }),
              feedValueAxisThird = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Obs"]
              }),
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Término"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedValueAxisSecond);
          oVizFrame.addFeed(feedValueAxisThird);
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