jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
    "sap/ui/app01/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/DatePicker",
    'sap/m/TextArea',
    "sap/m/Button"
 ], function (BaseController, MessageToast, Dialog, Label, DatePicker,  TextArea, Button ) {
   "use strict";
    return BaseController.extend("sap.ui.app01.controller.PRO.PRO06", {
    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("pro06").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      thes.cargarMonth();
      thes.cargarLinea();
      thes.generateChart();
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
        url: 'model/PRO/GenerarChartN2.php',
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
              name : 'Eficiencia',
              value : '{eficiencia}'
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
                          value: 93,
                          visible: true,
                          label: {
                              text: "93%",
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
                text: "Eficiencia por Línea"
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
                'values': ["Eficiencia"]
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
            url: 'model/PRO/InsertarComentarioEficiencia.php',
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
            url: 'model/PRO/ListarComentariosEficiencia.php',
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
    }
  });
 });