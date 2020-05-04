jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
    "sap/ui/app01/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/DatePicker",
    'sap/m/TextArea',
    "sap/m/Button",
    "sap/ui/app01/assets/libs/justgage",
    "sap/ui/app01/assets/libs/raphael"
 ], function (BaseController, MessageToast, Dialog, Label, DatePicker,  TextArea, Button, Gauge, Raphael) {
   "use strict";
    return BaseController.extend("sap.ui.app01.controller.PRO.PRO04", {
    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("pro04").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarMonth();
      thes.cargarLinea();
      thes.generateChart();
      thes.generateChartN2();      
      thes.generateChartN3();
    },
    onAfterRendering: function() {
      var thes = this;
      //thes.generateGauge();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homePRO");
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
    cargarLinea: function(){
      var thes = this,
      parametros = {
        '_status': '1'
      };

      $.ajax({
        data: parametros,
        url:   'model/SPRO/ListarLineaProduccionByStatus.php', 
        type:  'post',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {    
          response = JSON.parse(response);
          var firstKey = response[0].code;
          var oModel = new sap.ui.model.json.JSONModel(response);
          thes.getView().setModel(oModel,"cbxLinea");
          thes.byId('btnFilterLinea').setSelectedKey(firstKey);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });

    },
    generateChart: function(){
      var thes = this,
      oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
      oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      oKeyLinea = thes.byId('btnFilterLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');

      $.ajax({
        data: parametros,
        url: 'model/PRO/GenerarChartN1.php',
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
              name : 'Fecha',
              value : "{fecha}",
              dataType:'date'}
            ],                           
            measures : [{
              name : 'Producción',
              value : '{produccion_neta}'
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
                    visible: false
                },
                referenceLine: {
                    line: {
                      valueAxis: [
                        {
                          value: 40,
                          visible: true,
                          label: {
                              text: "40 TM/Día",
                              visible: true
                          }
                        },
                        {
                          value: 70,
                          visible: true,
                          label: {
                              text: "70 TM/Día",
                              visible: true
                          }
                        }
                      ]
                    }
                },
                window: {
                    start: "firstDataPoint",
                    end: "lastDataPoint"
                },
                colorPalette:['#215968']
              },
              title: {
                text: "Producción por Línea"
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
                'values': ["Producción"]
              }),   
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Fecha"]
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
    onAddComments: function(oEvent){
        var thes = this,
        date,
        comment;

        var dialog = new Dialog({
            title: 'Comentario',
            contentWidth: "550px",
            contentHeight: "200px",
            type: 'Message',
            content: [
                new Label({ text: 'Fecha:', labelFor: 'datepickerFecha'}),
                new DatePicker('datepickerFecha', {
                    change: function(oEvent){
                        date = oEvent.getSource().getDateValue();
                    }
                }),
                new Label({ text: 'Comentario:', labelFor: 'txtAreaComentario'}),
                new TextArea('txtAreaComentario', {
                    liveChange: function(oEvent) {
                    oEvent.getSource().addStyleClass('toUpperCase');
                    comment = oEvent.getParameter('value');
                    var parent = oEvent.getSource().getParent();
                    parent.getBeginButton().setEnabled(comment.length >= 30 && date != undefined);
                    },
                    width: '100%',
                    placeholder: 'Ingresar comentario...'
                })
            ],
            beginButton: new Button({
              text: 'Guardar',
              enabled: false,
              press: function () {
                dialog.close();
                thes.saveComment(comment, date);
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
    },
    saveComment: function(comment, date){
        var thes = this,
        oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
        oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
        oKeyMonth = thes.getCodeMonth(oKeyMonth),
        oKeyLinea = thes.byId('btnFilterLinea').getSelectedKey();

        //yyyy-mm-dd
        date = date.getUTCFullYear() + '-' +
        thes.pad(date.getUTCMonth() + 1) + '-' +
        thes.pad(date.getUTCDate());

        var parametros = {
            '_Comment': comment,
            '_Date': date,
            '_Year': oKeyYear,
            '_Month': oKeyMonth,
            '_Linea': oKeyLinea
        };

        $.ajax({
            data: parametros,
            url: 'model/PRO/InsertarComentario.php',
            type: 'post',
            async: false,
            beforeSend: function(){},
            success: function(response){
                if(response){
                    MessageToast.show('Se guardó con éxito!');
                }
            },
            error:  function(xhr, thrownError, ajaxOptions){
                alert(xhr.status);
                alert(thrownError);
            }
        });
    },
    onShowComments: function() {
        var thes = this;
        thes.getComments();
        var oView = thes.getView();
        var oDialog = oView.byId("commentsDialog");
        // create dialog lazily
        if (!oDialog) {
            // create dialog via fragment factory
            oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.app01.view.Fragments.DialogComments", this);
            oView.addDependent(oDialog);
        }
        oDialog.open();
    },
    onCloseComments: function() {
        var thes = this;
        thes.getView().byId("commentsDialog").close();
    },
    getComments: function(){
        var thes = this,
        oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
        oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
        oKeyMonth = thes.getCodeMonth(oKeyMonth),
        oKeyLinea = thes.byId('btnFilterLinea').getSelectedKey(),
        parametros = {
          '_Year': oKeyYear,
          '_Month': oKeyMonth,
          '_Linea': oKeyLinea
        };

        $.ajax({
            data: parametros,
            url: 'model/PRO/ListarComentarios.php',
            type: 'post',
            async: false,
            beforeSend: function(){},
            success: function(response){
                response = JSON.parse(response); 
                var oModel = new sap.ui.model.json.JSONModel(response);  
                thes.getView().setModel(oModel,"comments");  
                
            },
            error:  function(xhr, thrownError, ajaxOptions){
                alert(xhr.status);
                alert(thrownError);
            }
        });

    },
    onChangeFilter: function(oEvent){
      var thes = this;
      thes.generateChart();
      thes.generateChartN2();
      thes.generateChartN3();
    },
    generateGauge: function(){
      var thes = this;

      new JustGage({
        id: thes.byId("id_Gauge1").sId,
        value: 67,
        min: 0,
        max: 100,
        title: "AVANCE"
        });

    },
    generateChartN2: function(){
      var thes = this,
      oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
      oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      oKeyLinea = thes.byId('btnFilterLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart2');
      var oVizFrame = thes.byId('idChart2');

      $.ajax({
        data: parametros,
        url: 'model/PRO/GenerarChartN3.php',
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
              name : 'Descripción',
              value : "{descrip}"}
            ],                           
            measures : [{
              name : 'TM',
              value : '{quantity}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('donut');
          
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
                colorPalette:['#dae3f3', '#31859c']
              },
              legend: {
                visible: false
              },
              title: {
                text: "REAL"
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
                'values': ["TM"]
              }),    
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["Descripción"]
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
    generateChartN3: function(){
      var thes = this,
      oKeyYear = thes.byId('btnFilterYear').getSelectedKey(),
      oKeyMonth = thes.byId('btnFilterMonth').getSelectedKey(),
      oKeyMonth = thes.getCodeMonth(oKeyMonth),
      oKeyLinea = thes.byId('btnFilterLinea').getSelectedKey(),
      parametros = {
        '_Year': oKeyYear,
        '_Month': oKeyMonth,
        '_Linea': oKeyLinea
      };
      thes.removeFeeds('idChart3');
      var oVizFrame = thes.byId('idChart3');

      $.ajax({
        data: parametros,
        url: 'model/PRO/GenerarChartN4.php',
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
              name : 'Descripción',
              value : "{descrip}"}
            ],                           
            measures : [{
              name : 'TM',
              value : '{quantity}'
            }],                         
            data : {
              path : "/"
            }
          });		
          oVizFrame.setDataset(oDataset);
          oVizFrame.setModel(oModel);	
          oVizFrame.setVizType('donut');
          
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
                colorPalette:['#7f7f7f', '#bfbfbf']
              },
              legend: {
                visible: false
              },
              title: {
                text: "PROY"
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
                'values': ["TM"]
              }),    
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["Descripción"]
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