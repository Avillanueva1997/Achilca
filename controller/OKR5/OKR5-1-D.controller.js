jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
  "sap/ui/app01/controller/BaseController",
  'sap/ui/core/Fragment',
  'sap/ui/model/json/JSONModel',
  'sap/viz/ui5/format/ChartFormatter',
  'sap/viz/ui5/api/env/Format',
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/Label",
  'sap/m/Link',
  'sap/m/Text',
  '../OKR1/Formatter',
  "sap/ui/model/Filter"
 ], function (BaseController, Fragment, JSONModel, ChartFormatter, Format, MessageToast, MessageBox, Label, Link, Text, Formatter, Filter) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.OKR5.OKR5-1-D", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr5-1-D").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarYear();
      //thes.getDiametroDistinct();
      thes.generateChart();
      thes.openFragmentPA();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("okr5-1");
    },
    cargarYear: function(){
      
      var thes = this,
      dateToday = new Date(),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      year = (pieces.length == 9 ) ? pieces[pieces.length - 2] : dateToday.getFullYear();

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
    /*getDiametroDistinct: function(){
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
    },*/
    generateChart: function(){
        
        var thes = this,
        year = thes.byId('cbxYear').getSelectedKey(),
        date = new Date(),
        complete_url = window.location.href,
        pieces = complete_url.split("/"),
        month = (pieces.length == 9 ) ? pieces[pieces.length - 1] : date.getMonth(),
        diametro = (pieces.length == 9 ) ? pieces[pieces.length - 3] : pieces[pieces.length - 1],
        diametro = diametro.slice(0, -3),
        diametro = (diametro == 'MI') ? "MIXED" : diametro + '"',
        parametros = {
            '_Year': year,
            '_Diametro': diametro,
            '_Month': month
        },
        objetivo;
        thes.removeFeeds('idChart1');
        var oVizFrame = thes.byId('idChart1');
        Format.numericFormatter(ChartFormatter.getInstance());
        var formatPattern = ChartFormatter.DefaultPattern;

        $.ajax({
            data: parametros,
            url: 'model/COSTO/GenerarChartN1.php',
            type: 'POST',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
            response = JSON.parse(response);
            var plotArea;
            if(response.length != 0){
                objetivo = response[response.length - 1].objetivo;
            }

            if(Number(objetivo) > 0){
              plotArea = {
                dataLabel: {
                visible: true
                },
                referenceLine: {
                    line: {
                        valueAxis: [{
                            value: objetivo,
                            visible: true,
                            size: 1,
                            type: "dotted",
                            label: {
                                text: "Meta: " + objetivo,
                                visible: true
                            }
                        }]
                    }
                },
                colorPalette:['#215968']
              };
            } else {
              plotArea = {
                dataLabel: {
                visible: true
                },
                colorPalette:['#215968']
              };
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
                plotArea: plotArea,
                legendGroup:{
                    layout: {
                      position: "bottom",
                      alignment: "center"
                    },
                },
                title: {
                    text: "Bolas Forjadas(US$/TM)"
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
        });
    },
    onPlanAccion: function(){
      var thes = this,
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      diametro = (pieces.length == 9 ) ? pieces[pieces.length - 3] : pieces[pieces.length - 1],
      diametro = diametro.slice(0, -3),
      diametro = (diametro == 'MI') ? "MIXED" : diametro + '"';

      thes.getDataType();

      this._arrangeDialogFragment("Agregar Objetivo: Costo TRF", "dialogPA", diametro);
    },
    _arrangeDialogFragment: function (iDialogTitle, idDialog, diametro) {
      if (!this._oNewAppointmentDialog) {
        Fragment.load({
          id: idDialog,
          name: "sap.ui.app01.view.Fragments.CreatePASIMA",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialog = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialog);
            this._arrangeDialog(iDialogTitle, diametro);
          }.bind(this));
      } else {
        this._arrangeDialog(iDialogTitle, diametro);
      }
    },
    _arrangeDialog: function(iDialogTitle, diametro) {
      this.updateButtonEnabledState();
      this._oNewAppointmentDialog.setTitle(iDialogTitle);
      this._oNewAppointmentDialog.Diametro = diametro;
      this._oNewAppointmentDialog.open();
    },
    updateButtonEnabledState: function (oEvent) {
      var thes = this,
      oDataType = Fragment.byId("dialogPA", "cbxDataType"),
      oKeyDataType = oDataType.getSelectedKey(),
      oEvento = Fragment.byId("dialogPA", "iptEvento"),
      oValueEvento = oEvento.getValue(),
      oFechaEvento = Fragment.byId("dialogPA", "datepickerFechaEvento"),
      oValueFechaEvento = oFechaEvento.getDateValue(),
      oCbxEvento = Fragment.byId("dialogPA", "cbxEvento"),
      oSelectedKeyCbxEvento = oCbxEvento.getSelectedKey(),
      oIptActividad = Fragment.byId("dialogPA", "iptActividad"),
      oValueIptActividad = oIptActividad.getValue(),
      oFechaEjec = Fragment.byId("dialogPA", "datepickerFechaEje"),
      oValueFechaEjec = oFechaEjec.getDateValue(),
      oCbxArea = Fragment.byId("dialogPA", "cbxArea"),
      oSelectedKeyCbxArea = oCbxArea.getSelectedKey(),
      oCbxResponsable = Fragment.byId("dialogPA", "cbxResponsable"),
      oSelectedKeyCbxResponsable = oCbxResponsable.getSelectedKey(),
      oCbxActividad = Fragment.byId("dialogPA", "cbxActividad"),
      oSelectedKeyCbxActividad = oCbxActividad.getSelectedKey(),

      oLabelEvento = Fragment.byId("dialogPA", "lblEvento"),
      oLabelFechaEvento = Fragment.byId("dialogPA", "lblFechaEvento"),
      oLabelSecondEvento = Fragment.byId("dialogPA", "lblSecondEvento"),
      oLabelActividad = Fragment.byId("dialogPA", "lblActividad"),
      oLabelFechaEje = Fragment.byId("dialogPA", "lblFechaEje"),
      oLabelArea = Fragment.byId("dialogPA", "lblArea"),
      oLabelResponsable = Fragment.byId("dialogPA", "lblResponsable"),
      oLabelSecondActividad = Fragment.byId("dialogPA", "lblActividadSecond"),
      //type = this._oNewAppointmentDialog.Type,
      diametro = this._oNewAppointmentDialog.Diametro;

      if(oKeyDataType != ''){
        if(oKeyDataType == '01'){
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
          if(oValueEvento != '' && oValueFechaEvento != null){
            this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
          } else {
            this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
          }
        } else {
          oEvento.setVisible(false);
          oFechaEvento.setVisible(false);
          oLabelEvento.setVisible(false);
          oLabelFechaEvento.setVisible(false);
          if(oKeyDataType == '02'){
            thes.cargarEventos(diametro);
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
            thes.cargarEventos(diametro);
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
                '_Table': 'pa_costos_det'
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
    cargarEventos: function(diametro){
      var thes = this,
      parametros = {
        '_Table': 'pa_costos_cab',
        '_TipoEvento': 'COSTO TRF',
        '_Diametro': diametro
      };

      $.ajax({
          data: parametros,
          url:   'model/PA/ListarEventosPACOSTOS.php', 
          type:  'POST',
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
    openFragmentPA: function(){
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
      title = 'Plan de Acción: Costos';

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
      emailResponsable = thes.getResponsableByArea(area),
      sPathEnd = sPath.split("/").reverse()[0];

      
      thes.byId("filterRange").setFrom(null);
      thes.byId("filterRange").setTo(null);
      thes.byId("filterMonth").setSelectedKey("");
      thes.byId("filterSearch").setValue();

			if (sPathEnd === this.aCrumbs[this.aCrumbs.length - 1]) {
        if(user == emailResponsable){
          thes.byId("btnStatus").setVisible(true);
          thes.byId("btnEdit").setVisible(true);
        } else {
          thes.byId("btnStatus").setVisible(false);
          thes.byId("btnEdit").setVisible(false);
        }
        this._oTable.setMode("SingleSelectMaster");
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
      var thes = this,
      sPath = oEvent.getParameter("listItem").getBindingContext().getPath(),
      aPath = sPath.split("/"),
      sCurrentCrumb = aPath[aPath.length - 2];

      if (sCurrentCrumb === this.aCrumbs[this.aCrumbs.length - 1]) {
				var oSelectionInfo = {};
				var bSelected = oEvent.getParameter("selected");
				oEvent.getParameter("listItems").forEach(function (oItem) {
					oSelectionInfo[oItem.getBindingContext().getPath()] = bSelected;
				});
				this._updateOrder(oSelectionInfo);
			} else {
        sap.m.MessageBox.confirm("¿A dónde se quiere dirigir?", {
          actions: ["Actividades", "OKR", MessageBox.Action.CLOSE],
          emphasizedAction: MessageBox.Action.CLOSE ,
          onClose: function(oAction) {
            if(oAction == "Actividades"){
              var sNewPath = [sPath, thes._nextCrumb(sCurrentCrumb)].join("/");
              thes._setAggregation(sNewPath);
            } else if(oAction == "OKR"){
              var selectedPath = thes._oTable.getSelectedContextPaths();
        
              if(selectedPath.length > 0){
                selectedPath = selectedPath[0];
                selectedPath = selectedPath.split("/");
                var index = selectedPath[selectedPath.length - 1],  
                oData = thes.getView().getModel().getData(),
                dataIndex = oData.EventHierarchy.Eventos[index],
                fechaEvento = dataIndex.fecha_evento,
                jsDateFechaEvento = thes.dateMysqlToJsDate(fechaEvento),
                yearFechaEvento = jsDateFechaEvento.getFullYear();
              
                thes.byId("cbxYear").setSelectedKey(yearFechaEvento)
                thes.getView().byId("DialogPA").close();
                thes.generateChart();
        
              } else {
                MessageToast.show('Seleccioné actividad!');
              }
            } else {
              thes._oTable.removeSelections();
            }
          }
        });
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
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      diametro = (pieces.length == 9 ) ? pieces[pieces.length - 3] : pieces[pieces.length - 1],
      diametro = diametro.slice(0, -3),
      diametro = (diametro == 'MI') ? "MIXED" : diametro + '"',
      table = 'pa_costos',
      parametros = {
        '_Table': table,
        '_Diametro': diametro,
        '_TipoEvento': 'COSTO TRF'
      };

      $.ajax({
          data: parametros,
          url:   'model/PA/ListarPACOSTOSByTipoEvento.php', 
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
      oDataType = Fragment.byId("dialogPA", "cbxDataType"),
      oKeyDataType = oDataType.getSelectedKey(),
      oEvento = Fragment.byId("dialogPA", "iptEvento"),
      oValueEvento = oEvento.getValue(),
      oFechaEvento = Fragment.byId("dialogPA", "datepickerFechaEvento"),
      oValueFechaEvento = oFechaEvento.getDateValue(),
      oCbxEvento = Fragment.byId("dialogPA", "cbxEvento"),
      oSelectedKeyCbxEvento = oCbxEvento.getSelectedKey(),
      oIptActividad = Fragment.byId("dialogPA", "iptActividad"),
      oValueIptActividad = oIptActividad.getValue(),
      oFechaEjec = Fragment.byId("dialogPA", "datepickerFechaEje"),
      oValueFechaEjec = oFechaEjec.getDateValue(),
      oCbxArea = Fragment.byId("dialogPA", "cbxArea"),
      oSelectedKeyCbxArea = oCbxArea.getSelectedKey(),
      oCbxResponsable = Fragment.byId("dialogPA", "cbxResponsable"),
      oSelectedKeyCbxResponsable = oCbxResponsable.getSelectedKey(),
      user = sessionStorage.user,
      oLabelEvento = Fragment.byId("dialogPA", "lblEvento"),
      oLabelFechaEvento = Fragment.byId("dialogPA", "lblFechaEvento"),
      oLabelSecondEvento = Fragment.byId("dialogPA", "lblSecondEvento"),
      oLabelActividad = Fragment.byId("dialogPA", "lblActividad"),
      oLabelFechaEje = Fragment.byId("dialogPA", "lblFechaEje"),
      oLabelArea = Fragment.byId("dialogPA", "lblArea"),
      oLabelResponsable = Fragment.byId("dialogPA", "lblResponsable"),
      oCbxActividad = Fragment.byId("dialogPA", "cbxActividad"),
      oSelectedKeyCbxActividad = oCbxActividad.getSelectedKey(),
      oLabelSecondActividad = Fragment.byId("dialogPA", "lblActividadSecond"),
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      diametro = (pieces.length == 9 ) ? pieces[pieces.length - 3] : pieces[pieces.length - 1],
      diametro = diametro.slice(0, -3),
      diametro = (diametro == 'MI') ? "MIXED" : diametro + '"';

      if(oKeyDataType == '01'){
        sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
          icon: MessageBox.Icon.INFORMATION,
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              let fechaEventoString = thes.dateToMysqlDate(oValueFechaEvento);
              let table = 'pa_costos_cab';
              let parametros = {
                '_Evento': oValueEvento,
                '_FechaEvento': fechaEventoString,
                '_Usuario': user,
                '_TipoEvento': 'COSTO TRF',
                '_Diametro': diametro,
                '_Table': table
              };
              thes.saveEvento(parametros);
              thes.handleDialogCancelButton();

              /*oDataType.setSelectedKey('');
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

              oCbxActividad.setSelectedKey('');
              oCbxActividad.setVisible(false);
              oLabelSecondActividad.setVisible(false);

              thes._oNewAppointmentDialog.close();*/
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
              let table = 'pa_costos_det';
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
              thes.handleDialogCancelButton();

              /*oDataType.setSelectedKey('');
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

              oCbxActividad.setSelectedKey('');
              oCbxActividad.setVisible(false);
              oLabelSecondActividad.setVisible(false);

              thes._oNewAppointmentDialog.close();*/
            }
          }
        });
      } else if(oKeyDataType == '03'){
        sap.m.MessageBox.show("¿Estás seguro de almacenar esta información?", {
          icon: MessageBox.Icon.INFORMATION,
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.YES) {
              let table = 'pa_costos_det';
              let parametros = {
                '_Code': oSelectedKeyCbxActividad,
                '_CodeCab': oSelectedKeyCbxEvento,
                '_Responsable': oSelectedKeyCbxResponsable,
                '_Usuario': user,
                '_Table': table
              };
              thes.saveReasignacion(parametros);
              thes.handleDialogCancelButton();

              /*oDataType.setSelectedKey('');
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

              oCbxActividad.setSelectedKey('');
              oCbxActividad.setVisible(false);
              oLabelSecondActividad.setVisible(false);

              thes._oNewAppointmentDialog.close();*/
            }
          }
        });
      }

    },
    saveEvento: function(parametros){
      var thes = this;
      $.ajax({
        data: parametros,
        url: 'model/PA/InsertarEventoPACOSTOS.php',
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
                  let table = 'pa_costos_det';
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
              let table = 'pa_costos_det';
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
            thes.CloseDialogEdit();
            thes.sendEmailUpdateActividad(parametros._Code);
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
      table = 'pa_costos',
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      diametro = (pieces.length == 9 ) ? pieces[pieces.length - 3] : pieces[pieces.length - 1],
      diametro = diametro.slice(0, -3),
      diametro = (diametro == 'MI') ? "MIXED" : diametro + '"',
      parametros = {
        '_Table': table,
        '_Month': month,
        '_Diametro': diametro,
        '_TipoEvento': 'COSTO TRF'
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPACOSTOSByMonthTipoEventoDiametro.php', 
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
      table = 'pa_costos',
      complete_url = window.location.href,
      pieces = complete_url.split("/"),
      diametro = (pieces.length == 9 ) ? pieces[pieces.length - 3] : pieces[pieces.length - 1],
      diametro = diametro.slice(0, -3),
      diametro = (diametro == 'MI') ? "MIXED" : diametro + '"',
      parametros = {
        '_Table': table,
        '_From': fromString,
        '_To': toString,
        '_Diametro': diametro,
        '_TipoEvento': 'COSTO TRF'
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPACOSTOSByDatesTipoEventoDiametro.php', 
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
    sendEmailEvento: function(code){
      var thes = this,
      table = 'pa_costos_cab',
      title = 'COSTOS',
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
      table = 'pa_costos_det',
      title = 'COSTOS',
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
      table = 'pa_costos_det',
      title = 'COSTOS',
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
      table = 'pa_costos_det',
      title = 'COSTOS',
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
      table = 'pa_costos_det',
      title = 'COSTOS',
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