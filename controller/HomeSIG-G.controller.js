var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
   'sap/m/Label',
   'sap/m/Link',
   'sap/m/Text',
   './OKR1/Formatter',
   "sap/ui/model/Filter",
   'sap/ui/core/Fragment'
], function (BaseController, JSONModel,MessageToast, MessageBox, Label, Link, Text, Formatter, Filter, Fragment) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeSIG-G", {

        onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeSIG-G").attachPatternMatched(this._onObjectMatched, this);          
        },      
        _onObjectMatched: function (oEvent) {
            var thes = this;
            thes.getAuditorias();
            thes.generateChartN1();
            thes.generateChartN2();
            thes.openFragmentPASIG();
        },
        onHomePress: function(oEvent){
            var thes = this;
            thes.showBusyIndicator(3000, 0);
thes.getRouter().navTo('home');
            thes.removeFeeds('idChart1');
            thes.removeFeeds('idChart2');
        },
        getAuditorias: function(){
            var thes = this;
            $.ajax({
                url: 'model/SIG/ListarAuditoriasDistinct.php',
                type: 'GET',
                async: false,
                beforeSend: function(){
                },
                success: function(response){
                    response = JSON.parse(response);
                    let last = (response.length > 0) ? response[response.length - 1].auditoria : '';
                    var oModel = new sap.ui.model.json.JSONModel(response);  
                    thes.getView().setModel(oModel,"cbxAuditoriaN1");
                    thes.byId('btnAuditoriaN1').setSelectedKey(last);
                },
                error: function(xhr, ajaxOptions, thrownError){
                  alert(xhr.status);
                  alert(thrownError);
                }
            });
        },
        generateChartN1: function(){
          var thes = this,
          auditoria = thes.byId('btnAuditoriaN1').getSelectedKey(),
          parametros = {
            '_Auditoria': auditoria
          };

          thes.removeFeeds('idChart1');
          var oVizFrame = thes.byId('idChart1');

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
          });
        },
        generateChartN2: function(){
          var thes = this,
          auditoria = thes.byId('btnAuditoriaN1').getSelectedKey(),
          parametros = {
            '_Auditoria': auditoria
          };
    
          thes.removeFeeds('idChart2');
          var oVizFrame = thes.byId('idChart2');
    
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
                    dataLabel: {
                        visible: true
                    },
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
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        onHomeSIG: function(){
            var thes = this;
            thes.getRouter().navTo('homeSIG');
        },
        refreshCharts: function(){
          var thes = this;
          thes.generateChartN1();
          thes.generateChartN2();
        },
        openFragmentPASIG: function(){
          var thes = this,
          oView = thes.getView(),
          oDialog = oView.byId("DialogPA");
    
          if (!oDialog) {
            oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.app01.view.Fragments.PA", this);
            oView.addDependent(oDialog);
          }
  
          oDialog.open();
          thes.setInit();
    
        },
        sCollection: "/EventHierarchy",
        aCrumbs: ["Eventos", "Actividades"],
        mInitialOrderState: {
          products: {},
          count: 0,
          hasCounts: false
        },
        setInit: function(){
          var thes = this,
          title = 'Plan de Acción: SIG';
    
          thes.getMonth();
          thes.cargarActivities();
    
          thes.byId("lblTitlePA").setText(title);
          thes.getView().setModel(new JSONModel(this.mInitialOrderState), "Order");
    
          if (!this.oTemplate) {
            this.oTemplate = sap.ui.xmlfragment("sap.ui.app01.view.Fragments.Breadcrumb");
          }
          this._oTable = this.byId("TablePA");
    
          var sPath = this._getInitialPath();
          this._setAggregation(sPath);
        },
        // Initial path is the first crumb appended to the collection root
        _getInitialPath: function () {
          return [this.sCollection, this.aCrumbs[0]].join("/");
        },
        _setAggregation: function (sPath) {
          var thes = this,
          user = sessionStorage.user,
          area = sessionStorage.area,
          emailResponsable = thes.getResponsableByArea('8'),
          sPathEnd = sPath.split("/").reverse()[0];
    
          
          thes.byId("filterRange").setFrom(null);
          thes.byId("filterRange").setTo(null);
          thes.byId("filterMonth").setSelectedKey("");
          thes.byId("filterSearch").setValue();
    
          if (sPathEnd === this.aCrumbs[this.aCrumbs.length - 1]) {
            if(user == emailResponsable){
              this._oTable.setMode("SingleSelectMaster");
              thes.byId("btnStatus").setVisible(true);
              thes.byId("btnEdit").setVisible(true);
            } else {
              thes.byId("btnStatus").setVisible(false);
              thes.byId("btnEdit").setVisible(false);
              this._oTable.setMode("None");
            }
            thes.byId("filterMonth").setVisible(false);
            thes.byId("filterRange").setVisible(false);
            thes.byId("btnClearFilter").setVisible(false);
            this.byId("columnActividad").setVisible(true);
            this.byId("columnFechaEje").setVisible(true);
            this.byId("columnArea").setVisible(true);
            this.byId("columnResponsable").setVisible(true);
            this.byId("columnTipoEvento").setVisible(false);
            this.byId("columnEvento").setVisible(false);
            this.byId("columnFechaEvento").setVisible(false);
          } else {
            if(user == emailResponsable || user != emailResponsable){
              thes.byId("btnStatus").setVisible(false);
              thes.byId("btnEdit").setVisible(false);
            }
            thes.byId("filterMonth").setVisible(true);
            thes.byId("filterRange").setVisible(true);
            thes.byId("btnClearFilter").setVisible(true);
            this._oTable.setMode("SingleSelectMaster");
            this.byId("columnActividad").setVisible(false);
            this.byId("columnFechaEje").setVisible(false);
            this.byId("columnArea").setVisible(false);
            this.byId("columnResponsable").setVisible(false);
            this.byId("columnTipoEvento").setVisible(true);
            this.byId("columnEvento").setVisible(true);
            this.byId("columnFechaEvento").setVisible(true);
          }
    
          // Set the new aggregation
          this._oTable.bindAggregation("items", sPath, this.oTemplate);
    
          this._maintainCrumbLinks(sPath);
        },
        _maintainCrumbLinks: function (sPath) {
          // Determine trail parts
          var aPaths = [];
          var aParts = sPath.split("/");
          while (aParts.length > 1) {
            aPaths.unshift(aParts.join("/"));
            aParts = aParts.slice(0, aParts.length - 2);
          }
    
          // Re-build crumb toolbar based on trail parts
          var oCrumbToolbar = this.byId("idCrumbToolbar");
          oCrumbToolbar.destroyContent();
    
          aPaths.forEach(jQuery.proxy(function (sPath, iPathIndex) {
    
            var bIsFirst = iPathIndex === 0;
            var bIsLast = iPathIndex === aPaths.length - 1;
    
            // Special case for 1st crumb: fixed text
            var sText = bIsFirst ? this.aCrumbs[0] : "{code}";
    
            // Context is one level up in path
            var sContext = this._stripItemBinding(sPath);
    
            var oCrumb = bIsLast
              ? new Text({
                text: sText
              }).addStyleClass("crumbLast")
              : new Link({
                text: sText,
                target: sPath,
                press: [this.handleLinkPress, this]
              });
            oCrumb.bindElement(sContext);
    
            oCrumbToolbar.addContent(oCrumb);
            if (!bIsLast) {
              var oArrow = new Label({
                textAlign: "Center",
                text: ">"
              }).addStyleClass("crumbArrow");
              oCrumbToolbar.addContent(oArrow);
            }
    
          }, this));
        },
            // Remove the numeric item binding from a path
        _stripItemBinding: function (sPath) {
          var aParts = sPath.split("/");
          return aParts.slice(0, aParts.length - 1).join("/");
        },
        onExitPA: function() {
          var thes = this;
          thes.getView().byId("DialogPA").close();
        },
        handleSelectionChange: function (oEvent) {
          // Determine where we are right now
          var sPath = oEvent.getParameter("listItem").getBindingContext().getPath();
          var aPath = sPath.split("/");
          var sCurrentCrumb = aPath[aPath.length - 2];
    
          // If we're on a leaf, remember the selections;
          // otherwise navigate
          if (sCurrentCrumb === this.aCrumbs[this.aCrumbs.length - 1]) {
            var oSelectionInfo = {};
            var bSelected = oEvent.getParameter("selected");
            oEvent.getParameter("listItems").forEach(function (oItem) {
              oSelectionInfo[oItem.getBindingContext().getPath()] = bSelected;
            });
            this._updateOrder(oSelectionInfo);
          } else {
            var sNewPath = [sPath, this._nextCrumb(sCurrentCrumb)].join("/");
            this._setAggregation(sNewPath);
          }
        },
            // Add to the order based on the selection
        _updateOrder: function (oSelectionInfo) {
          var oOrderModel = this.getView().getModel("Order");
          oOrderModel.setData({products: oSelectionInfo}, true);
          var aProductsSelected = Formatter.listProductsSelected(this.getView());
          oOrderModel.setData({
            count: aProductsSelected.length,
            hasCounts: aProductsSelected.length > 0
          }, true);
        },
        _nextCrumb: function (sCrumb) {
          for (var i = 0, ii = this.aCrumbs.length; i < ii; i++) {
            if (this.aCrumbs[i] === sCrumb) {
              return this.aCrumbs[i + 1];
            }
          }
        },
        handleLinkPress: function (oEvent) {
          var thes = this;
          thes.cargarActivities();
          this._setAggregation(oEvent.getSource().getTarget());
        },
        cargarActivities: function(){
          var thes = this,
          areaUser = sessionStorage.area,
          areaUser = thes.getAreaByCode(areaUser),
          table = 'pa_sig',
          parametros = {
            '_Table': table
          };
    
          $.ajax({
              data: parametros,
              url:   'model/PA/ListarPASIG.php', 
              type:  'POST',
              async: false,
              beforeSend: function () {
              },
              success:  function (response) {
                response = JSON.parse(response);
                for (let index = 0; index < response.EventHierarchy.Eventos.length; index++) {
                  if(response.EventHierarchy.Eventos[index]['status'] == 1){
                    response.EventHierarchy.Eventos[index]['status'] = '#ff0000';
                  } else if(response.EventHierarchy.Eventos[index]['status'] == 2){
                    response.EventHierarchy.Eventos[index]['status'] = '#008f39';
                  } else if(response.EventHierarchy.Eventos[index]['status'] == 3){
                    response.EventHierarchy.Eventos[index]['status'] = '#f8f32b';
                  } else {
                    response.EventHierarchy.Eventos[index]['status'] = '#fff';
                  }
                  if(response.EventHierarchy.Eventos[index].Actividades){
                    for (let y = 0; y < response.EventHierarchy.Eventos[index].Actividades.length; y++) { 
                      if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 1){
                        response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#ff0000';
                      } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 2){
                        response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#008f39';
                      } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 3){
                        response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#f8f32b';
                      } else {
                        response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#fff';
                      }               
                    }
                  }
                }
                var oModel = new sap.ui.model.json.JSONModel(response);
                thes.getView().setModel(oModel);
              },
              error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
              }
            });
        },
        handleDialogSaveButton:function(){
          var thes = this,
          oDataType = Fragment.byId("dialogPASIG", "cbxDataType"),
          oKeyDataType = oDataType.getSelectedKey(),
          oEvento = Fragment.byId("dialogPASIG", "iptEvento"),
          oValueEvento = oEvento.getValue(),
          oFechaEvento = Fragment.byId("dialogPASIG", "datepickerFechaEvento"),
          oValueFechaEvento = oFechaEvento.getDateValue(),
          oCbxEvento = Fragment.byId("dialogPASIG", "cbxEvento"),
          oSelectedKeyCbxEvento = oCbxEvento.getSelectedKey(),
          oIptActividad = Fragment.byId("dialogPASIG", "iptActividad"),
          oValueIptActividad = oIptActividad.getValue(),
          oFechaEjec = Fragment.byId("dialogPASIG", "datepickerFechaEje"),
          oValueFechaEjec = oFechaEjec.getDateValue(),
          oCbxArea = Fragment.byId("dialogPASIG", "cbxArea"),
          oSelectedKeyCbxArea = oCbxArea.getSelectedKey(),
          oCbxResponsable = Fragment.byId("dialogPASIG", "cbxResponsable"),
          oSelectedKeyCbxResponsable = oCbxResponsable.getSelectedKey(),
          user = sessionStorage.user,
          oLabelEvento = Fragment.byId("dialogPASIG", "lblEvento"),
          oLabelFechaEvento = Fragment.byId("dialogPASIG", "lblFechaEvento"),
          oLabelSecondEvento = Fragment.byId("dialogPASIG", "lblSecondEvento"),
          oLabelActividad = Fragment.byId("dialogPASIG", "lblActividad"),
          oLabelFechaEje = Fragment.byId("dialogPASIG", "lblFechaEje"),
          oLabelArea = Fragment.byId("dialogPASIG", "lblArea"),
          oLabelResponsable = Fragment.byId("dialogPASIG", "lblResponsable"),
          oCbxActividad = Fragment.byId("dialogPASIG", "cbxActividad"),
          oSelectedKeyCbxActividad = oCbxActividad.getSelectedKey(),
          oLabelSecondActividad = Fragment.byId("dialogPASIG", "lblActividadSecond"),
          oTypeEvento = Fragment.byId("dialogPASIG", "cbxTypeEvento"),
          oSelectedKeyTypeEvento = oTypeEvento.getSelectedKey(),
          oDescripTipoEvento = Fragment.byId("dialogPASIG", "descripTipoEvento"),
          oValueDescriptTipoEvento = oDescripTipoEvento.getValue(),
          oLabelTypeEvento = Fragment.byId("dialogPASIG", "labelTypeEvento"),
          oLabelDescripTipoEvento = Fragment.byId("dialogPASIG", "lbldescripTipoEvento");
    
          if(oKeyDataType == '01'){
            sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
              icon: MessageBox.Icon.INFORMATION,
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              onClose: function(oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  let tipoEvento = '';
                  if(oSelectedKeyTypeEvento == 'AUDITORÍA EXTERNA' || oSelectedKeyTypeEvento == 'COMITÉ'){
                    tipoEvento = oValueDescriptTipoEvento;
                  } else {
                    tipoEvento = oSelectedKeyTypeEvento;
                  }

                  let fechaEventoString = thes.dateToMysqlDate(oValueFechaEvento);
                  let table = 'pa_sig_cab';
                  let parametros = {
                    '_Evento': oValueEvento,
                    '_FechaEvento': fechaEventoString,
                    '_Usuario': user,
                    '_TipoEvento': tipoEvento,
                    '_Table': table
                  };
                  thes.saveEvento(parametros);
    
                  oDataType.setSelectedKey('');
                  oEvento.setValue('');
                  oFechaEvento.setValue(null);
                  oCbxEvento.setSelectedKey('');
                  oIptActividad.setValue('');
                  oFechaEjec.setValue(null);
                  oCbxArea.setSelectedKey('');
                  oCbxResponsable.setSelectedKey('');
                  oTypeEvento.setSelectedKey('');
                  oDescripTipoEvento.setValue('');
    
                  oEvento.setVisible(false);
                  oFechaEvento.setVisible(false);
                  oCbxEvento.setVisible(false);
                  oIptActividad.setVisible(false);
                  oFechaEjec.setVisible(false);
                  oCbxArea.setVisible(false);
                  oCbxResponsable.setVisible(false);
                  oLabelEvento.setVisible(false);
                  oLabelFechaEvento.setVisible(false);
                  oLabelSecondEvento.setVisible(false);
                  oLabelActividad.setVisible(false);
                  oLabelFechaEje.setVisible(false);
                  oLabelArea.setVisible(false);
                  oLabelResponsable.setVisible(false);
                  oTypeEvento.setVisible(false);
                  oDescripTipoEvento.setVisible(false);
                  oLabelTypeEvento.setVisible(false);
                  oLabelDescripTipoEvento.setVisible(false);

                  oCbxActividad.setSelectedKey('');
              oCbxActividad.setVisible(false);
              oLabelSecondActividad.setVisible(false);
    
                  thes._oNewAppointmentDialog.close();
                }
              }
            });
          } else if(oKeyDataType == '02'){
            sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
              icon: MessageBox.Icon.INFORMATION,
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              onClose: function(oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  let fechaEjeString = thes.dateToMysqlDate(oValueFechaEjec);
                  let table = 'pa_sig_det';
                  let parametros = {
                    '_Evento': oSelectedKeyCbxEvento,
                    '_Actividad': oValueIptActividad,
                    '_FechaEje': fechaEjeString,
                    '_Area':oSelectedKeyCbxArea,
                    '_Responsable':oSelectedKeyCbxResponsable,
                    '_Usuario': user,
                    '_Table': table
                  };
                  thes.saveActividad(parametros);
    
                  oDataType.setSelectedKey('');
                  oEvento.setValue('');
                  oFechaEvento.setValue(null);
                  oCbxEvento.setSelectedKey('');
                  oIptActividad.setValue('');
                  oFechaEjec.setValue(null);
                  oCbxArea.setSelectedKey('');
                  oCbxResponsable.setSelectedKey('');
    
                  oEvento.setVisible(false);
                  oFechaEvento.setVisible(false);
                  oCbxEvento.setVisible(false);
                  oIptActividad.setVisible(false);
                  oFechaEjec.setVisible(false);
                  oCbxArea.setVisible(false);
                  oCbxResponsable.setVisible(false);
                  oLabelEvento.setVisible(false);
                  oLabelFechaEvento.setVisible(false);
                  oLabelSecondEvento.setVisible(false);
                  oLabelActividad.setVisible(false);
                  oLabelFechaEje.setVisible(false);
                  oLabelArea.setVisible(false);
                  oLabelResponsable.setVisible(false);
                  oTypeEvento.setSelectedKey('');
                  oDescripTipoEvento.setValue('');
                  oTypeEvento.setVisible(false);
                  oDescripTipoEvento.setVisible(false);
                  oLabelTypeEvento.setVisible(false);
                  oLabelDescripTipoEvento.setVisible(false);

                  oCbxActividad.setSelectedKey('');
              oCbxActividad.setVisible(false);
              oLabelSecondActividad.setVisible(false);
    
                  thes._oNewAppointmentDialog.close();
                }
              }
            });
          } else if(oKeyDataType == '03'){
            sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
              icon: MessageBox.Icon.INFORMATION,
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              onClose: function(oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  let table = 'pa_sig_det';
                  let parametros = {
                    '_Code': oSelectedKeyCbxActividad,
                    '_CodeCab': oSelectedKeyCbxEvento,
                    '_Responsable': oSelectedKeyCbxResponsable,
                    '_Usuario': user,
                    '_Table': table
                  };
                  thes.saveReasignacion(parametros);
    
                  oDataType.setSelectedKey('');
                  oEvento.setValue('');
                  oFechaEvento.setValue(null);
                  oCbxEvento.setSelectedKey('');
                  oIptActividad.setValue('');
                  oFechaEjec.setValue(null);
                  oCbxArea.setSelectedKey('');
                  oCbxResponsable.setSelectedKey('');
    
                  oEvento.setVisible(false);
                  oFechaEvento.setVisible(false);
                  oCbxEvento.setVisible(false);
                  oIptActividad.setVisible(false);
                  oFechaEjec.setVisible(false);
                  oCbxArea.setVisible(false);
                  oCbxResponsable.setVisible(false);
                  oLabelEvento.setVisible(false);
                  oLabelFechaEvento.setVisible(false);
                  oLabelSecondEvento.setVisible(false);
                  oLabelActividad.setVisible(false);
                  oLabelFechaEje.setVisible(false);
                  oLabelArea.setVisible(false);
                  oLabelResponsable.setVisible(false);
                  oTypeEvento.setSelectedKey('');
                  oDescripTipoEvento.setValue('');
                  oTypeEvento.setVisible(false);
                  oDescripTipoEvento.setVisible(false);
                  oLabelTypeEvento.setVisible(false);
                  oLabelDescripTipoEvento.setVisible(false);

                  oCbxActividad.setSelectedKey('');
              oCbxActividad.setVisible(false);
              oLabelSecondActividad.setVisible(false);
    
                  thes._oNewAppointmentDialog.close();
                }
              }
            });
          }
    
        },
        saveEvento: function(parametros){
          var thes = this;
          $.ajax({
            data: parametros,
            url: 'model/PA/InsertarEventoPASIG.php',
            type: 'POST',
            beforeSend: function(){
            },
            success: function(response){
              response = JSON.parse(response);
              response = response.root;
              var code = '';
              if(response.status == "ok"){
                code = response.code;
                MessageToast.show('Se guardó con éxito!');
                thes.sendEmailEvento(code);
              } else {
                MessageToast.show('Error al guardar la información!');
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        saveActividad: function(parametros){
          var thes = this;
          $.ajax({
            data: parametros,
            url: 'model/PA/InsertarActividadPA.php',
            type: 'POST',
            beforeSend: function(){
            },
            success: function(response){
              response = JSON.parse(response);
              response = response.root;
              var code = '';
              if(response.status == "ok"){
                code = response.code;
                MessageToast.show('Se guardó con éxito!');
                thes.sendEmailActividad(code);
              } else {
                MessageToast.show('Error al guardar la información!');
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        saveReasignacion: function(parametros){
          var thes = this;
          $.ajax({
            data: parametros,
            url: 'model/PA/InsertarReasignacionPA.php',
            type: 'POST',
            beforeSend: function(){
            },
            success: function(response){
              response = JSON.parse(response);
              response = response.root;
              var code = '', oldCode = '';
              if(response.status == "ok"){
                code = response.code;
                oldCode = response.oldCode;
                MessageToast.show('Se guardó con éxito!');
                thes.sendEmailReasignacion(code, oldCode);
              } else {
                MessageToast.show('Error al guardar la información!');
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        handleDialogCancelButton: function(){
          var thes = this;
          
          if (thes._oNewAppointmentDialog){
            thes._oNewAppointmentDialog.destroy();
            thes._oNewAppointmentDialog = null;
          }
          /*var thes = this,
          oDataType = Fragment.byId("dialogPASIG", "cbxDataType"),
          oEvento = Fragment.byId("dialogPASIG", "iptEvento"),
          oFechaEvento = Fragment.byId("dialogPASIG", "datepickerFechaEvento"),
          oCbxEvento = Fragment.byId("dialogPASIG", "cbxEvento"),
          oIptActividad = Fragment.byId("dialogPASIG", "iptActividad"),
          oFechaEjec = Fragment.byId("dialogPASIG", "datepickerFechaEje"),
          oCbxArea = Fragment.byId("dialogPASIG", "cbxArea"),
          oCbxResponsable = Fragment.byId("dialogPASIG", "cbxResponsable"),
          oLabelEvento = Fragment.byId("dialogPASIG", "lblEvento"),
          oLabelFechaEvento = Fragment.byId("dialogPASIG", "lblFechaEvento"),
          oLabelSecondEvento = Fragment.byId("dialogPASIG", "lblSecondEvento"),
          oLabelActividad = Fragment.byId("dialogPASIG", "lblActividad"),
          oLabelFechaEje = Fragment.byId("dialogPASIG", "lblFechaEje"),
          oLabelArea = Fragment.byId("dialogPASIG", "lblArea"),
          oLabelResponsable = Fragment.byId("dialogPASIG", "lblResponsable"),
          oCbxActividad = Fragment.byId("dialogPASIG", "cbxActividad"),
          oLabelSecondActividad = Fragment.byId("dialogPASIG", "lblActividadSecond"),
          oTypeEvento = Fragment.byId("dialogPASIG", "cbxTypeEvento"),
          oDescripTipoEvento = Fragment.byId("dialogPASIG", "descripTipoEvento"),
          oLabelTypeEvento = Fragment.byId("dialogPASIG", "labelTypeEvento"),
          oLabelDescripTipoEvento = Fragment.byId("dialogPASIG", "lbldescripTipoEvento");
    
          this._oNewAppointmentDialog.close();
    
          oDataType.setSelectedKey('');
          oEvento.setValue('');
          oFechaEvento.setValue(null);
          oCbxEvento.setSelectedKey('');
          oIptActividad.setValue('');
          oFechaEjec.setValue(null);
          oCbxArea.setSelectedKey('');
          oCbxResponsable.setSelectedKey('');
          oCbxActividad.setSelectedKey('');
          oTypeEvento.setSelectedKey('');
          oDescripTipoEvento.setValue('');
    
          oEvento.setVisible(false);
          oFechaEvento.setVisible(false);
          oCbxEvento.setVisible(false);
          oIptActividad.setVisible(false);
          oFechaEjec.setVisible(false);
          oCbxArea.setVisible(false);
          oCbxResponsable.setVisible(false);
          oLabelEvento.setVisible(false);
          oLabelFechaEvento.setVisible(false);
          oLabelSecondEvento.setVisible(false);
          oLabelActividad.setVisible(false);
          oLabelFechaEje.setVisible(false);
          oLabelArea.setVisible(false);
          oLabelResponsable.setVisible(false);    
          oCbxActividad.setVisible(false);
          oLabelSecondActividad.setVisible(false);
          oTypeEvento.setVisible(false);
          oDescripTipoEvento.setVisible(false);
          oLabelTypeEvento.setVisible(false);
          oLabelDescripTipoEvento.setVisible(false);*/
    
        },
        onChangeStatus: function(){
          var thes = this,
          selectedPath = this._oTable.getSelectedContextPaths();
          if(selectedPath.length > 0){
            var selectedPath = selectedPath[0],
            selectedPath = selectedPath.split("/"),
            indexNivelOne = selectedPath[selectedPath.length - 3],
            indexNivelTwo = selectedPath[selectedPath.length - 1],      
            oData = thes.getView().getModel().getData(),
            dataIndex = oData.EventHierarchy.Eventos[indexNivelOne].Actividades[indexNivelTwo],
            areaUser = sessionStorage.area,
            areaUser = thes.getAreaByCode(areaUser);
    
            if(dataIndex.status == '#ff0000'){
              sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
                icon: MessageBox.Icon.INFORMATION,
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function(oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                      dataIndex.status = '#008f39';
                      let table = 'pa_sig_det';
                      let parametros = {
                        '_Code': dataIndex.code,
                        '_CodeCab': dataIndex.code_cab,
                        '_Table': table
                      }
                      thes.onSaveStatus(parametros);
                      thes.sendEmailUpdateStatus(parametros._Code);
                    }
                }
              });
            } else {
              MessageToast.show('No es posible cambiar su status!');
            }
          } else {
            MessageToast.show('Seleccioné actividad!');
          }
        },
        onEditInformation: function(){
          var thes = this,
          selectedPath = this._oTable.getSelectedContextPaths();
          if(selectedPath.length > 0){
            var selectedPath = selectedPath[0],
            selectedPath = selectedPath.split("/"),
            indexNivelOne = selectedPath[selectedPath.length - 3],
            indexNivelTwo = selectedPath[selectedPath.length - 1],      
            oData = thes.getView().getModel().getData(),
            dataIndex = oData.EventHierarchy.Eventos[indexNivelOne].Actividades[indexNivelTwo];
            if(dataIndex.status == '#ff0000'){
              this._arrangeDialogFragmentSecond("Editar Actividad", "dialogEditPASIMA");
              thes.cargarAreas();
              thes.cargarUsuarios();
              var oActividad = Fragment.byId("dialogEditPASIMA", "iptActividad"),
              oFechaEjec = Fragment.byId("dialogEditPASIMA", "datepickerFechaEje"),
              oArea = Fragment.byId("dialogEditPASIMA", "cbxArea"),
              oResponsble = Fragment.byId("dialogEditPASIMA", "cbxResponsable");
    
              oActividad.setValue(dataIndex.actividad);
              var fechaEjec = thes.dateMysqlToJsDate(dataIndex.fecha_eje);
              oFechaEjec.setDateValue(fechaEjec);
              oArea.setSelectedKey(dataIndex.area_res);
              oResponsble.setSelectedKey(dataIndex.persona_res);
            } else {
              MessageToast.show('No es posible editar la actividad!');
            }
          } else {
            MessageToast.show('Seleccioné actividad!');
          }
        },
        onSaveStatus: function(parametros){
          var thes = this;
          $.ajax({
            data: parametros,
            url:   'model/PA/ActualizarStatusPA.php', 
            type:  'post',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              if(response){
                MessageToast.show('Se guardó con éxito!');
                thes.getView().getModel().refresh();
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        _arrangeDialogFragmentSecond: function (iDialogTitle, idDialog) {
          if (!this._oNewAppointmentDialogSecond) {
            Fragment.load({
              id: idDialog,
              name: "sap.ui.app01.view.Fragments.EditPASIMA",
              controller: this
            }).then(function(oDialog){
                this._oNewAppointmentDialogSecond = oDialog;
                this.getView().addDependent(this._oNewAppointmentDialogSecond);
                this._arrangeDialogSecond(iDialogTitle);
              }.bind(this));
          } else {
            this._arrangeDialogSecond(iDialogTitle);
          }
        },
        _arrangeDialogSecond: function(iDialogTitle) {
          this.updateButtonEnabledStateSecond();
          this._oNewAppointmentDialogSecond.setTitle(iDialogTitle);
          this._oNewAppointmentDialogSecond.open();
        },
        updateButtonEnabledStateSecond: function (oEvent) {
          var thes = this,
          oActividad = Fragment.byId("dialogEditPASIMA", "iptActividad"),
          oValueActividad = oActividad.getValue(),
          oFechaEjec = Fragment.byId("dialogEditPASIMA", "datepickerFechaEje"),
          oValueFechaEjec = oFechaEjec.getDateValue(),
          oArea = Fragment.byId("dialogEditPASIMA", "cbxArea"),
          oSelectedKeyArea = oArea.getSelectedKey(),
          oResponsable = Fragment.byId("dialogEditPASIMA", "cbxResponsable"),
          oSelectedKeyResponsable = oResponsable.getSelectedKey();
    
          if(oValueActividad != '' && oValueFechaEjec != null && oSelectedKeyArea != '' && oSelectedKeyResponsable != ''){
            this._oNewAppointmentDialogSecond.getBeginButton().setEnabled(true);
          } else {
            this._oNewAppointmentDialogSecond.getBeginButton().setEnabled(false);
          }
        },
        UpdateActividad: function(){
          var thes = this,
          selectedPath = this._oTable.getSelectedContextPaths(),
          selectedPath = selectedPath[0],
          selectedPath = selectedPath.split("/"),
          indexNivelOne = selectedPath[selectedPath.length - 3],
          indexNivelTwo = selectedPath[selectedPath.length - 1],  
          oData = thes.getView().getModel().getData(),
          dataIndex = oData.EventHierarchy.Eventos[indexNivelOne].Actividades[indexNivelTwo],
          oActividad = Fragment.byId("dialogEditPASIMA", "iptActividad"),
          oValueActividad = oActividad.getValue(),
          oFechaEjec = Fragment.byId("dialogEditPASIMA", "datepickerFechaEje"),
          oValueFechaEjec = oFechaEjec.getDateValue(),
          oArea = Fragment.byId("dialogEditPASIMA", "cbxArea"),
          oSelectedKeyArea = oArea.getSelectedKey(),
          oResponsable = Fragment.byId("dialogEditPASIMA", "cbxResponsable"),
          oSelectedKeyResponsable = oResponsable.getSelectedKey(),
          decriptionArea = thes.getAreaByCode(oSelectedKeyArea),
          nameComplete = thes.getUserByCode(oSelectedKeyResponsable),
          fechaEjec = thes.dateToMysqlDate(oValueFechaEjec),
          areaUser = sessionStorage.area,
          areaUser = thes.getAreaByCode(areaUser);
    
          sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
            icon: MessageBox.Icon.INFORMATION,
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function(oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  dataIndex.actividad = oValueActividad.toUpperCase();
                  dataIndex.fecha_eje = fechaEjec;
                  dataIndex.area_res = oSelectedKeyArea;
                  dataIndex.area = decriptionArea;
                  dataIndex.persona_res = oSelectedKeyResponsable;
                  dataIndex.responsable = nameComplete;
                  let table = 'pa_sig_det';
                  let parametros = {
                    '_Code': dataIndex.code,
                    '_CodeCab': dataIndex.code_cab,
                    '_Actividad': oValueActividad.toUpperCase(),
                    '_FechaEje': fechaEjec,
                    '_Area': oSelectedKeyArea,
                    '_Responsable': oSelectedKeyResponsable,
                    '_Table': table
                  }
                  thes.onUpdateActividad(parametros);
                  thes.sendEmailUpdateActividad(parametros._Code);
                }
            }
          });
        },
        CloseDialogEdit: function(){
          var thes = this;
          if (thes._oNewAppointmentDialogSecond){
            thes._oNewAppointmentDialogSecond.destroy();
            thes._oNewAppointmentDialogSecond = null;
          }
        },
        onUpdateActividad: function(parametros){
          var thes = this;
          $.ajax({
            data: parametros,
            url:   'model/PA/ActualizarActividadPA.php', 
            type:  'post',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              if(response){
                MessageToast.show('Se guardó con éxito!');
                thes.getView().getModel().refresh();
                thes._oNewAppointmentDialogSecond.close();
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        getMonth: function(){
          var thes = this;
    
          $.ajax({
            url: 'model/SPRO/ListarMonth.php',
            type: 'GET',
            beforeSend: function(){
            },
            success: function(response){
              response = JSON.parse(response); 
              var oModel = new sap.ui.model.json.JSONModel(response);  
              thes.getView().setModel(oModel,"cbxMonth");  
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
    
          });
    
        },
        onSearch: function(oEvent){
          var thes = this,
          oList = thes.byId("TablePA"),
          oBinding = oList.getBinding("items"),
          sPath = oBinding.sPath,
          sPath = sPath.split("/"),
          last = sPath[sPath.length - 1],
          term = (last == 'Eventos') ? 'evento': 'actividad' ,
          aFilters = [],
          sQuery = oEvent.getSource().getValue();
          if (sQuery && sQuery.length > 0) {
            var filter = new Filter(term, sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);
          }
          oBinding.filter(aFilters, "Application");
          thes.byId("filterRange").setFrom(null);
          thes.byId("filterRange").setTo(null);
          thes.byId("filterMonth").setSelectedKey("");
        },
        onClearFilter: function(){
          var thes = this;
          thes.byId("filterRange").setFrom(null);
          thes.byId("filterRange").setTo(null);
          thes.byId("filterMonth").setSelectedKey("");
          thes.byId("filterSearch").setValue("");
          var oList = thes.byId("TablePA"),
          oBinding = oList.getBinding("items");
          oBinding.filter([]);
          thes.cargarActivities();
        },
        onFilerByMonth: function(){
          var thes = this,
          oSelectedKey = thes.byId("filterMonth").getSelectedKey(),
          month = thes.getCodeMonth(oSelectedKey),
          month = month + 1,
          oList = thes.byId("TablePA"),
          oBinding = oList.getBinding("items"),
          areaUser = sessionStorage.area,
          areaUser = thes.getAreaByCode(areaUser),
          table = 'pa_sig',
          parametros = {
            '_Table': table,
            '_Month': month
          };
    
          $.ajax({
            data: parametros,
            url:   'model/PA/ListarPASIGByMonth.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              response = JSON.parse(response);
              for (let index = 0; index < response.EventHierarchy.Eventos.length; index++) {
                if(response.EventHierarchy.Eventos[index]['status'] == 1){
                  response.EventHierarchy.Eventos[index]['status'] = '#ff0000';
                } else if(response.EventHierarchy.Eventos[index]['status'] == 2){
                  response.EventHierarchy.Eventos[index]['status'] = '#008f39';
                } else if(response.EventHierarchy.Eventos[index]['status'] == 3){
                  response.EventHierarchy.Eventos[index]['status'] = '#f8f32b';
                } else {
                  response.EventHierarchy.Eventos[index]['status'] = '#fff';
                }
                if(response.EventHierarchy.Eventos[index].Actividades){
                  for (let y = 0; y < response.EventHierarchy.Eventos[index].Actividades.length; y++) { 
                    if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 1){
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#ff0000';
                    } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 2){
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#008f39';
                    } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 3){
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#f8f32b';
                    } else {
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#fff';
                    }               
                  }
                }
              }
    
              var oModel = new sap.ui.model.json.JSONModel(response);
              thes.getView().setModel(oModel);
    
              thes.byId("filterRange").setFrom(null);
              thes.byId("filterRange").setTo(null);
              thes.byId("filterSearch").setValue("");
              oBinding.filter([]);
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });       
    
        },
        onFilterByDates: function(){
          var thes = this,
          from = thes.byId("filterRange").getFrom(),
          fromString = thes.dateToMysqlDate(from),
          to = thes.byId("filterRange").getTo(),
          toString = thes.dateToMysqlDate(to),
          oList = thes.byId("TablePA"),
          oBinding = oList.getBinding("items"),
          areaUser = sessionStorage.area,
          areaUser = thes.getAreaByCode(areaUser),
          table = 'pa_sig',
          parametros = {
            '_Table': table,
            '_From': fromString,
            '_To': toString
          };
    
          $.ajax({
            data: parametros,
            url:   'model/PA/ListarPASIGByDates.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              response = JSON.parse(response);
              for (let index = 0; index < response.EventHierarchy.Eventos.length; index++) {
                if(response.EventHierarchy.Eventos[index]['status'] == 1){
                  response.EventHierarchy.Eventos[index]['status'] = '#ff0000';
                } else if(response.EventHierarchy.Eventos[index]['status'] == 2){
                  response.EventHierarchy.Eventos[index]['status'] = '#008f39';
                } else if(response.EventHierarchy.Eventos[index]['status'] == 3){
                  response.EventHierarchy.Eventos[index]['status'] = '#f8f32b';
                } else {
                  response.EventHierarchy.Eventos[index]['status'] = '#fff';
                }
                if(response.EventHierarchy.Eventos[index].Actividades){
                  for (let y = 0; y < response.EventHierarchy.Eventos[index].Actividades.length; y++) { 
                    if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 1){
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#ff0000';
                    } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 2){
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#008f39';
                    } else if(response.EventHierarchy.Eventos[index].Actividades[y]['status'] == 3){
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#f8f32b';
                    } else {
                      response.EventHierarchy.Eventos[index].Actividades[y]['status'] = '#fff';
                    }               
                  }
                }
              }
    
              var oModel = new sap.ui.model.json.JSONModel(response);
              thes.getView().setModel(oModel);
    
              thes.byId("filterMonth").setSelectedKey("");
              thes.byId("filterSearch").setValue("");
              oBinding.filter([]);
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          }); 
        },
        onAddObjetivo: function(){
          var thes = this;
          var thes = this;
          thes.getDataType();
          this._arrangeDialogFragment("Agregar Objetivo", "dialogPASIG");
        },
        _arrangeDialogFragment: function (iDialogTitle, idDialog) {
          if (!this._oNewAppointmentDialog) {
            Fragment.load({
              id: idDialog,
              name: "sap.ui.app01.view.Fragments.CreatePASIG",
              controller: this
            }).then(function(oDialog){
                this._oNewAppointmentDialog = oDialog;
                this.getView().addDependent(this._oNewAppointmentDialog);
                this._arrangeDialog(iDialogTitle);
              }.bind(this));
          } else {
            this._arrangeDialog(iDialogTitle);
          }
        },
        _arrangeDialog: function(iDialogTitle) {
          this.updateButtonEnabledState();
          this._oNewAppointmentDialog.setTitle(iDialogTitle);
          this._oNewAppointmentDialog.open();
        },
        updateButtonEnabledState: function (oEvent) {
          var thes = this,
          oDataType = Fragment.byId("dialogPASIG", "cbxDataType"),
          oKeyDataType = oDataType.getSelectedKey(),
          oEvento = Fragment.byId("dialogPASIG", "iptEvento"),
          oValueEvento = oEvento.getValue(),
          oTypeEvento = Fragment.byId("dialogPASIG", "cbxTypeEvento"),
          oSelectedKeyTipoEvento = oTypeEvento.getValue(),
          oDescripTipoEvento = Fragment.byId("dialogPASIG", "descripTipoEvento"),
          oValueDescripTipoEvento = oDescripTipoEvento.getValue(),
          oFechaEvento = Fragment.byId("dialogPASIG", "datepickerFechaEvento"),
          oValueFechaEvento = oFechaEvento.getDateValue(),
          oCbxEvento = Fragment.byId("dialogPASIG", "cbxEvento"),
          oSelectedKeyCbxEvento = oCbxEvento.getSelectedKey(),
          oIptActividad = Fragment.byId("dialogPASIG", "iptActividad"),
          oValueIptActividad = oIptActividad.getValue(),
          oFechaEjec = Fragment.byId("dialogPASIG", "datepickerFechaEje"),
          oValueFechaEjec = oFechaEjec.getDateValue(),
          oCbxArea = Fragment.byId("dialogPASIG", "cbxArea"),
          oSelectedKeyCbxArea = oCbxArea.getSelectedKey(),
          oCbxResponsable = Fragment.byId("dialogPASIG", "cbxResponsable"),
          oSelectedKeyCbxResponsable = oCbxResponsable.getSelectedKey(),
          oCbxActividad = Fragment.byId("dialogPASIG", "cbxActividad"),
          oSelectedKeyCbxActividad = oCbxActividad.getSelectedKey(),
    
          oLabelEvento = Fragment.byId("dialogPASIG", "lblEvento"),
          oLabelTypeEvento = Fragment.byId("dialogPASIG", "labelTypeEvento"),
          oLabelDescripTipoEvento = Fragment.byId("dialogPASIG", "lbldescripTipoEvento"),
          oLabelFechaEvento = Fragment.byId("dialogPASIG", "lblFechaEvento"),
          oLabelSecondEvento = Fragment.byId("dialogPASIG", "lblSecondEvento"),
          oLabelActividad = Fragment.byId("dialogPASIG", "lblActividad"),
          oLabelFechaEje = Fragment.byId("dialogPASIG", "lblFechaEje"),
          oLabelArea = Fragment.byId("dialogPASIG", "lblArea"),
          oLabelResponsable = Fragment.byId("dialogPASIG", "lblResponsable"),
          oLabelSecondActividad = Fragment.byId("dialogPASIG", "lblActividadSecond");
    
          if(oKeyDataType != ''){
            if(oKeyDataType == '01'){
              thes.cargarTipoEvento();
              oLabelSecondEvento.setVisible(false);
              oLabelActividad.setVisible(false);
              oLabelFechaEje.setVisible(false);
              oLabelArea.setVisible(false);
              oLabelResponsable.setVisible(false);
              oLabelSecondActividad.setVisible(false);
              oCbxEvento.setVisible(false);
              oIptActividad.setVisible(false);
              oFechaEjec.setVisible(false);
              oCbxArea.setVisible(false);
              oCbxResponsable.setVisible(false);
              oCbxActividad.setVisible(false);
    
              oEvento.setVisible(true);
              oFechaEvento.setVisible(true);
              oLabelEvento.setVisible(true);
              oLabelFechaEvento.setVisible(true);
              oTypeEvento.setVisible(true);
              oLabelTypeEvento.setVisible(true);

              if(oValueEvento != ''){
                if(oSelectedKeyTipoEvento != ''){
                  if(oSelectedKeyTipoEvento == 'AUDITORÍA EXTERNA' || oSelectedKeyTipoEvento == 'COMITÉ' ){
                    oDescripTipoEvento.setVisible(true);
                    oLabelDescripTipoEvento.setVisible(true);
                    if(oValueDescripTipoEvento != '' && oValueFechaEvento != null){
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
                    } else {
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                    }
                  } else {
                    oDescripTipoEvento.setVisible(false);
                    oLabelDescripTipoEvento.setVisible(false);
                    if(oValueFechaEvento != null){
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
                    } else {
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                    }
                  }
                }
              } else {
                this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
              }
              /*if(oValueEvento != '' && oValueFechaEvento != null){
                this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
              } else {
                this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
              }*/
            } else {
              oEvento.setVisible(false);
              oFechaEvento.setVisible(false);
              oLabelEvento.setVisible(false);
              oLabelFechaEvento.setVisible(false);
              oTypeEvento.setVisible(false);
              oLabelTypeEvento.setVisible(false);
              oDescripTipoEvento.setVisible(false);
              oLabelDescripTipoEvento.setVisible(false);
              if(oKeyDataType == '02'){
                thes.cargarEventos();
                thes.cargarAreas();
                thes.cargarUsuarios();
                oLabelSecondEvento.setVisible(true);
                oLabelActividad.setVisible(true);
                oLabelFechaEje.setVisible(true);
                oLabelArea.setVisible(true);
                oLabelResponsable.setVisible(true);
                oCbxEvento.setVisible(true);
                oIptActividad.setVisible(true);
                oFechaEjec.setVisible(true);
                oCbxArea.setVisible(true);
                oCbxResponsable.setVisible(true);
                oLabelSecondActividad.setVisible(false);
                oCbxActividad.setVisible(false);
                if(oSelectedKeyCbxEvento != '' && oValueIptActividad != '' && oValueFechaEjec != null && oSelectedKeyCbxArea != '' && oSelectedKeyCbxResponsable != ''){
                  this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
                } else {
                  this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                }
              } else {
                thes.cargarEventos();
                thes.cargarUsuarios();
                oLabelSecondActividad.setVisible(true);
                oCbxActividad.setVisible(true);
                oLabelSecondEvento.setVisible(true);
                oLabelActividad.setVisible(false);
                oLabelFechaEje.setVisible(false);
                oLabelArea.setVisible(false);
                oLabelResponsable.setVisible(true);
                oCbxEvento.setVisible(true);
                oIptActividad.setVisible(false);
                oFechaEjec.setVisible(false);
                oCbxArea.setVisible(false);
                oCbxResponsable.setVisible(true);
                if(oSelectedKeyCbxEvento != ''){
                  let parametros = {
                    '_CodeCab': oSelectedKeyCbxEvento,
                    '_Table': 'pa_sig_det'
                  };
                  thes.cargarActividadesByEvento(parametros);
                  if(oSelectedKeyCbxActividad != '' && oSelectedKeyCbxResponsable != ''){
                    this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
                  } else {
                    this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                  }
                }
              }
            }
          } else {
            this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
          }
        },
        cargarTipoEvento: function(){
          var thes = this;
          $.ajax({
            url:   'model/SPRO/ListarTipoEvento.php', 
            type:  'GET',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              response = JSON.parse(response);
              var oModel = thes.getView().getModel();
              oModel.setProperty("/dataTypeEvento", response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        cargarEventos: function(){
          var thes = this;
    
          $.ajax({
              //data: parametros,
              url:   'model/PA/ListarEventosPASIG.php', 
              type:  'GET',
              async: false,
              beforeSend: function () {
              },
              success:  function (response) {
                response = JSON.parse(response);
                var oModel = thes.getView().getModel();
                oModel.setProperty("/dataEvento", response);
              },
              error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
              }
            });
        },
        sendEmailEvento: function(code){
          var thes = this,
          table = 'pa_sig_cab',
          title = 'SIG',
          parametros = {
            '_Code': code,
            '_Title': title,
            '_Table': table
          };
    
          $.ajax({
            data: parametros,
            url:   'model/PA/EnviarEmailEvento.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        sendEmailActividad: function(code){
          var thes = this,
          table = 'pa_sig_det',
          title = 'SIG',
          parametros = {
            '_Code': code,
            '_Title': title,
            '_Table': table
          };
    
          $.ajax({
            data: parametros,
            url:   'model/PA/EnviarEmailActividad.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
    
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        sendEmailReasignacion: function(code, oldCode){
          var thes = this,
          table = 'pa_sig_det',
          title = 'SIG',
          parametros = {
            '_Code': code,
            '_OldCode': oldCode,
            '_Title': title,
            '_Table': table
          };
    
          $.ajax({
            data: parametros,
            url:   'model/PA/EnviarEmailReasignacion.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
    
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        sendEmailUpdateActividad: function(code){
          var thes = this,
          table = 'pa_sig_det',
          title = 'SIG',
          parametros = {
            '_Code': code,
            '_Title': title,
            '_Table': table,
            '_User': sessionStorage.user
          };
    
          $.ajax({
            data: parametros,
            url:   'model/PA/EnviarEmailUpdateActividad.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
    
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        },
        sendEmailUpdateStatus: function(code){
          var thes = this,
          table = 'pa_sig_det',
          title = 'SIG',
          parametros = {
            '_Code': code,
            '_Title': title,
            '_Table': table
          };
    
          $.ajax({
            data: parametros,
            url:   'model/PA/EnviarEmailUpdateStatus.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
    
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
        }
   });
});
