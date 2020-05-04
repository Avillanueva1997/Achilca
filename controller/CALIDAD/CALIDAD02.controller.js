jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/viz/ui5/controls/VizTooltip',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format',
 "sap/m/Dialog",
 "sap/m/Button",
 "sap/m/Label",
 "sap/m/ComboBox"
 ], function (BaseController, VizTooltip, ChartFormatter, Format, Dialog, Button, Label, ComboBox) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.CALIDAD.CALIDAD02", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("calidad02").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this,
      user = sessionStorage.user,
      role = sessionStorage.role,
      emailResponsable = thes.getResponsableByArea('2');
      thes.generateChart();
      if(user == emailResponsable || role == 'ADMIN') {
        thes.byId('btnFilter').setVisible(true);
      } else {
        thes.byId('btnFilter').setVisible(false);
      }
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeCALIDAD");
      thes.removeFeeds('idChart1');
    },
    generateChart: function(YearFilter){
      var thes = this,
      year, lastYear, month, metaMonth  = 0,
      metaMontGlobal = 0,
      linea_produccion,
      parametros,
      url = 'model/CALIDAD/GenerarKpiN1.php',
      actualDate = new Date(),
      actualYear = actualDate.getFullYear();

      if(YearFilter && YearFilter != '' && YearFilter != actualYear){
        year = YearFilter;
        month = 12;
        url = 'model/CALIDAD/GenerarKpiN1Second.php'
      } else {
        var dateToday = new Date();
        year = dateToday.getFullYear();
        month = dateToday.getMonth();
        month = month + 1;
      }

      linea_produccion = 'L3';

      parametros = {
        '_Year': year,
        '_Linea': linea_produccion
      };

      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: url,
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          lastYear = response[0].Month;
          for (let index = 0; index < response.length; index++) {
            if(response[index].CodeMonth == month){
              metaMonth = response[index].Meta;
            }            
          }
          metaMontGlobal = metaMonth * 100;
          thes.byId("idMeta").setContent('<div><table class="styleTablePDF table" align="center"><tr><td class="styleTablePDF widthFirstColumn" rowspan="2"><img src="assets/images/mepsa_ac_n2.png" class="imagePDF"></img></td><td class="styleTablePDF headerPDF">Indicador de Desempeño</td><td class="styleTablePDF textNormalPDF" rowspan="2">Unidad <br></br><span class="secondTextNormalPDF">%</span></td><td class="styleTablePDF textNormalPDF" rowspan="2">Meta <br></br><span class="secondTextNormalPDF">'+ metaMontGlobal +'%</span></td><td class="styleTablePDF textNormalPDF" rowspan="2">Categoría <br></br><span class="secondTextNormalPDF">Q</span></td></tr><tr><td class="styleTablePDF subheaderPDF">Bolas Forjadas Observadas L3</td></tr></table></div>');
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(response);
          var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [
              {
                name : 'Desempeño',
                value : "{desempenio}"
              },
              {
              name : 'Indicador',
              value : "{Month}"
              }
            ],                           
            measures : [{
              name : 'Real',
              value : '{Value}'
            },{
              name: 'Meta',
              value: '{Meta}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('combination');
          
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
                      "dataContext": {"Meta": {min: 0}},
                      "properties": {
                          "color":"#5b9ad5",
                          "lineColor": "#5b9ad5"
                      },
                      "displayName": 'Meta'
                    },
                    {
                      "dataContext": {Indicador: {in:["PROM.",lastYear]}},
                      "properties": {
                          "color":"#215968",
                      },
                      "displayName": 'Otros'
                    },
                    {
                      "dataContext": {"Desempeño": {min: metaMonth}},
                      "properties": {
                          "color":"#ff0000"
                      },
                      "displayName": 'Malo'
                    }
                  ],
                  "others":
                  {
                      "properties": {
                           "color": "#008f39"
                      },
                      "displayName": "Bueno"
                  }
                },
                window: {
                  start: "firstDataPoint",
                  end: "lastDataPoint"
                },
                colorPalette:['#215968'],
                dataLabel: {
                    formatString: formatPattern.STANDARDPERCENT_MFD2,
                    visible: true,
                    renderer: function(oLabel) {
                      debugger;
                      if(oLabel.ctx.measureNames == "Real"){
                        if(oLabel.val == 0 || Number.isNaN(oLabel.val) || !oLabel.val){
                          oLabel.text = "";
                          oLabel.val = 0;
                          oLabel.ctx.Real = 0;
                        }
                        if(oLabel.ctx.Indicador == lastYear || oLabel.ctx.Indicador == 'PROM.') {
                         delete oLabel.ctx.Desempeño; 
                        }
                        if(oLabel.ctx.Desempeño == 0 || Number.isNaN(oLabel.ctx.Desempeño)){
                          oLabel.ctx.Desempeño = 0;
                        } else {
                          if(oLabel.ctx.Desempeño){
                            let Desempeño = oLabel.ctx.Desempeño;
                            Desempeño = Desempeño * 100;
                            Desempeño = Desempeño.toFixed(1);
                            oLabel.ctx.Desempeño = Number(Desempeño);
                            oLabel.ctx.Desempeño = oLabel.ctx.Desempeño + "%";
                          }
                        }
                        let Real = oLabel.ctx.Real;
                        Real = Real * 100;
                        Real = Real.toFixed(1);
                        oLabel.ctx.Real = Number(Real);
                        oLabel.ctx.Real = oLabel.ctx.Real + "%";
                      } else if(oLabel.ctx.measureNames == "Meta"){
                        oLabel.text = "";
                        delete oLabel.ctx.Desempeño;
                        if(oLabel.val == 0 || Number.isNaN(oLabel.val) || !oLabel.val){
                          oLabel.val = 0;
                          oLabel.ctx.Meta = 0;
                        }
                        let Meta = oLabel.ctx.Meta;
                        Meta = Meta * 100;
                        Meta = Meta.toFixed(1);
                        oLabel.ctx.Meta = Number(Meta);
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
              }
            }
          );
          
          var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Real"]
              }),   
              feedValueAxisSecond = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Meta"]
              }),
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Indicador"]
              });
          oVizFrame.addFeed(feedValueAxis);
          oVizFrame.addFeed(feedValueAxisSecond);
          oVizFrame.addFeed(feedCategoryAxis);

          var oTooltip = new VizTooltip({});
            oTooltip.connect(oVizFrame.getVizUid());
            oTooltip.setFormatString(formatPattern.STANDARDPERCENT_MFD2);
            oVizFrame.getDataset().setContext("Desempeño");

        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      })
    },
    getMeta: function(year, linea_produccion){
      var thes = this,
      parametros = {
        '_Year' : year,
        '_LineaProduccion': linea_produccion
      },
      meta = 0;

      $.ajax({
        data: parametros,
        url: 'model/CALIDAD/ObtenerMetaByYearLinea.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          meta = response;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });

      return meta;
    },
    onFilter: function(){
      var thes = this,
      year = ''

      var dialog = new Dialog({
        title: 'Database',
        type: 'Message',
        content: [
          new Label({ text: 'Año', labelFor: 'cbxYear'}),
          new ComboBox('cbxYear',{
           items: {
              path: '/',
              factory: function(o, m) {
                var i = m.getObject();
                return new sap.ui.core.ListItem({
                  key: i.description,
                  text: i.description
                });
              }
            },
            selectedKey: {
              path: '/',
              formatter: function(data) {
                return (data) ? data[0] : null;
              }
            },
            change: function(oEvent){
              oEvent.getSource().addStyleClass('toUpperCase');
              year = oEvent.getSource().getSelectedKey();
              var parent = oEvent.getSource().getParent();
              if(year != ''){
                parent.getBeginButton().setEnabled();
              }
            }, width: '100%'
          })
        ],
        beginButton: new Button({
          text: 'Filtrar',
          enabled: false,
          press: function () {
            thes.generateChart(year);
            dialog.close();
          }
        }),
        endButton: new Button({
          text: 'Cancelar',
          press: function () {
            dialog.close();
          }
        }),
        afterClose: function() {
          dialog.destroy();
        }
        });
        dialog.open();
        thes.cargarYear();
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
            var cbx = sap.ui.getCore().byId('cbxYear');
            cbx.setModel(oModel);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
    },
  });
 });