jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast",
 'sap/viz/ui5/controls/VizTooltip',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format',
 ], function (BaseController, jQuery, JSONModel, MessageToast, VizTooltip, ChartFormatter, Format) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.SP02-1.SP02-1-1", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sp02-1-1").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarMonth();
      thes.generateChart();
      thes.cargarComments();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeSP02-1");
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
      month = thes.getMonthDescription(Number(month));

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
          thes.byId('cbxMonth').setSelectedKey(month);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    onCustomize: function(){
      var thes = this;
      thes.getRouter().navTo("sp02-1-1-c");
    },
    generateChart: function(YearFilter){
      var thes = this,
      oMonth = thes.byId("cbxMonth").getSelectedKey(),
      oMonth = thes.getCodeMonth(oMonth),
      oYear = thes.byId("cbxYear").getSelectedKey(),
      parametros = {
        '_Month': oMonth + 1,
        '_Year': oYear
      };

      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/SP/GenerarKpiN1.php',
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
                name : 'Fecha',
                value : "{date_event}"
              },
              {
                name : 'Semana',
                value : "{week}"
              }
            ],                           
            measures : [{
              name : 'Cumplimiento',
              value : '{porcentaje_cumplimiento}'
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
                      "dataContext": {"Cumplimiento": {min: 0, max: 0.79}},
                      "properties": {
                          "color":"#f00"
                      },
                      "displayName": '0%-79%'
                    },
                    {
                      "dataContext": {"Cumplimiento": {min: 0.8, max:0.89}},
                      "properties": {
                          "color":"#ff8000"
                      },
                      "displayName": '80%-89%'
                    },
                    {
                      "dataContext": {"Cumplimiento": {min: 0.9, max:1}},
                      "properties": {
                          "color":"#008000"
                      },
                      "displayName": '90%-100%'
                    }
                  ],
                  "others":
                  {
                      "properties": {
                           "lineColor": "#427CAC"
                      },
                      "displayName": "Cumplimiento"
                  }
                },
                referenceLine: {
                  line: {
                      valueAxis: [{
                          value: 0.79,
                          visible: true,
                          color: '#f00',
                          label: {
                              text: "Riesgo",
                              visible: true,
                              background: '#f00',
                              style: {
                                color: '#fff'
                              }
                          }
                      },{
                          value: 0.89,
                          visible: true,
                          color: '#ff8000',
                          label: {
                              text: "Aceptable",
                              visible: true,
                              background: '#ff8000',
                              style: {
                                color: '#fff'
                              }
                          }
                      },{
                          value: 1,
                          visible: true,
                          color: '#008000',
                          label: {
                              text: "Bueno",
                              visible: true,
                              background: '#008000',
                              style: {
                                color: '#fff'
                              }
                          }
                      }]
                  }
                },
                window: {
                  start: "firstDataPoint",
                  end: "lastDataPoint"
                },
                dataLabel: {
                  formatString: formatPattern.STANDARDPERCENT_MFD2,
                  visible: true,
                  /*renderer: function(oLabel) {
                    debugger;
                    if(oLabel.ctx.measureNames === "Cumplimiento %"){
                      oLabel.ctx["Cumplimiento %"] *= 100;
                    }
                  }*/
                }
              },
              legendGroup:{
                layout: {
                  position: "bottom",
                  alignment: "center"
                },
              },
              title: {
                visible: false
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
              },
              tooltip: {
                visible: false
              }
            }
          );
          
          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Cumplimiento"]
              }),   
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Semana"]
              }),   
              feedCategoryAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Fecha"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedCategoryAxis);
          oVizFrame.addFeed(feedCategoryAxisSecond);

        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    cargarComments: function(){
      var thes = this,
      oMonth = thes.byId("cbxMonth").getSelectedKey(),
      oMonth = thes.getCodeMonth(oMonth),
      oYear = thes.byId("cbxYear").getSelectedKey();

      $.ajax({
        url:   'model/SP/ListarComentarios.php?_Month='+ oMonth + '&_Year=' + oYear, 
        type:  'GET',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          response = JSON.parse(response);
          var oModel = new sap.ui.model.json.JSONModel(response);  
          thes.byId("TableComments").setModel(oModel);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    changeFilter: function(){
      var thes = this;
      thes.generateChart();
      thes.cargarComments();
    }
  });
 });