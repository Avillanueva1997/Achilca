jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/ui/model/json/JSONModel',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format'
 ], function (BaseController, JSONModel, ChartFormatter, Format) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.COSTO.COSTO01M", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("costo01m").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.getDiametroDistinct();
      thes.generateChart();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("costo01");
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
    getDiametroDistinct: function(){
        var thes = this,
        mixed = {
          length: "MIXED"
        };
        $.ajax({
            url:   'model/SPRO/ListarInfoBallDistinct.php', 
            type:  'post',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {    
                response = JSON.parse(response);
                response.push(mixed);
                var firstValue = response[0].length;
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.getView().setModel(oModel,"cbxDiametro");
                thes.byId('cbxDiametro').setSelectedKey(firstValue);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },
    generateChart: function(){
      var thes = this,
      oKeyYear = thes.byId('cbxYear').getSelectedKey(),
      oKeyDiametro = thes.byId('cbxDiametro').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Diametro': oKeyDiametro
      },
      objetivo;
      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');

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
                text: "Bolas Forjadas(US$/TM)"
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
      })
    }
  });
 });