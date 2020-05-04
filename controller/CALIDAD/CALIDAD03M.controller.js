jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController"
 ], function (BaseController) {
   "use strict";

   var LineaProduccion = '',
   Moye = '';

   return BaseController.extend("sap.ui.app01.controller.CALIDAD.CALIDAD03M", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("calidad03m").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("calidad03m");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      var thes = this,
      linea_produccion = oEvent.getParameters().data.linea_produccion,
      moye = oEvent.getParameters().data.moye,
      parametros = {
          '_LineaProduccion': linea_produccion,
          '_Moye': moye
      };

      LineaProduccion = linea_produccion;
      Moye = moye;

      thes.getDiametroDistinct(parametros);
      thes.generateChart();
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("calidad03");
    },
    getDiametroDistinct: function(parametros){
        var thes = this;
        $.ajax({
            data: parametros,
            url:   'model/CALIDAD/ListarDiametroDistinct.php', 
            type:  'post',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {    
                response = JSON.parse(response);
                var firstValue = response[0].diametro;
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.getView().setModel(oModel,"cbxDiametro");
                thes.byId('btnFilterDiametro').setSelectedKey(firstValue);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },
    generateChart: function(){
      var thes = this,
      oKeyDiametro = thes.byId('btnFilterDiametro').getSelectedKey(),
      parametros = {
        '_LineaProduccion': LineaProduccion,
        '_Moye': Moye,
        '_Diametro': oKeyDiametro
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
                  visible: true
                }
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
      })
    }
  });
 });