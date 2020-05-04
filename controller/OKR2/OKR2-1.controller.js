jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/ui/model/json/JSONModel',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format'
 ], function (BaseController, JSONModel, ChartFormatter, Format) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.OKR2.OKR2-1", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr2-1").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarMonth();
      thes.setChartN1();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeOKR2");
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
          thes.byId('btnFilterYear').setSelectedKey(year);
          thes.byId('btnFilterMonth').setSelectedKey(descripMonth);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    setChartN1: function(){
      var thes = this,
      oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
      oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth
      };
      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

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
    }
  });
 });