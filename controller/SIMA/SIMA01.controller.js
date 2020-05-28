jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
  "sap/ui/app01/controller/BaseController",
  'sap/viz/ui5/format/ChartFormatter',
  'sap/viz/ui5/api/env/Format',
  'sap/m/Label',
  'sap/m/Link',
  'sap/m/Text',
  'sap/ui/model/json/JSONModel',
  '../OKR1/Formatter',
  "sap/ui/model/Filter"
 ], function (BaseController, ChartFormatter, Format, Label, Link, Text, JSONModel, Formatter, Filter) {
   "use strict";
   
   return BaseController.extend("sap.ui.app01.controller.SIMA.SIMA01", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("sima01").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.setChartN1();
      thes.openFragmentPASIMA();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.showBusyIndicator(3000, 0);
thes.getRouter().navTo("homeSIMA");
      thes.removeFeeds('idChart1');
    },
    setChartN1: function(){
      var thes = this,
      parametros = {};
      thes.removeFeeds('idChart1');
      var oVizFrame = thes.byId('idChart1');
      Format.numericFormatter(ChartFormatter.getInstance());
      var formatPattern = ChartFormatter.DefaultPattern;

      $.ajax({
        data: parametros,
        url: 'model/SIMA/GenerarChartN1.php',
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
              name : 'Año',
              value : "{year}"}],
                           
            measures : [{
              name : '# Accidentes',
              value : '{num_accidentes}'} ],
                         
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
                  mode: "NONE"
                }
              },
              plotArea: {
                dataLabel: {
                  visible: true
                },
                colorPalette:['#215968']
              },
              legendGroup:{
                layout: {
                  position: "bottom",
                  alignment: "center"
                },
              },
              title: {
                text: "Cantidad de Accidentes YTD",
                visible: false
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
                'values': ["# Accidentes"]
              }), 
              feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Año"]
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
    openFragmentPASIMA: function(){
      var thes = this,
      oView = thes.getView(),
      oDialog = oView.byId("DialogPASIMA");

      if (!oDialog) {
          oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.app01.view.Fragments.PASIMA", this);
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
      var thes = this;

      thes.getMonth();
      thes.cargarActivities();

      thes.getView().setModel(new JSONModel(this.mInitialOrderState), "Order");

			if (!this.oTemplate) {
				this.oTemplate = sap.ui.xmlfragment("sap.ui.app01.view.Fragments.Breadcrumb");
			}
			this._oTable = this.byId("TablePASIMA");

			var sPath = this._getInitialPath();
			this._setAggregation(sPath);
    },
    // Initial path is the first crumb appended to the collection root
		_getInitialPath: function () {
			return [this.sCollection, this.aCrumbs[0]].join("/");
    },
    _setAggregation: function (sPath) {
      var thes = this,
      sPathEnd = sPath.split("/").reverse()[0];

      thes.byId("filterRange").setFrom(null);
      thes.byId("filterRange").setTo(null);
      thes.byId("filterMonth").setSelectedKey("");
      thes.byId("filterSearch").setValue();

			if (sPathEnd === this.aCrumbs[this.aCrumbs.length - 1]) {
        thes.byId("filterMonth").setVisible(false);
        thes.byId("filterRange").setVisible(false);
        thes.byId("btnClearFilter").setVisible(false);
        this._oTable.setMode("None");
				this.byId("columnActividad").setVisible(true);
        this.byId("columnFechaEje").setVisible(true);
        this.byId("columnArea").setVisible(true);
        this.byId("columnResponsable").setVisible(true);
        this.byId("columnTipoEvento").setVisible(false);
        this.byId("columnEvento").setVisible(false);
        this.byId("columnFechaEvento").setVisible(false);
			} else {
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
    onExitSIMA: function() {
      var thes = this;
      thes.getView().byId("DialogPASIMA").close();
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
      var thes = this;

      $.ajax({
          //data: parametros,
          url:   'model/PA/ListarPASIMA.php', 
          type:  'GET',
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
      oList = thes.byId("TablePASIMA"),
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
      var oList = thes.byId("TablePASIMA"),
      oBinding = oList.getBinding("items");
      oBinding.filter([]);
      thes.cargarActivities();
    },
    onFilerByMonth: function(){
      var thes = this,
      oSelectedKey = thes.byId("filterMonth").getSelectedKey(),
      month = thes.getCodeMonth(oSelectedKey),
      month = month + 1,
      oList = thes.byId("TablePASIMA"),
      oBinding = oList.getBinding("items"),
      table = 'pa_sima',
      parametros = {
        '_Table': table,
        '_Month': month
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPASIMAByMonth.php', 
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
      oList = thes.byId("TablePASIMA"),
      oBinding = oList.getBinding("items"),
      table = 'pa_sima',
      parametros = {
        '_Table': table,
        '_From': fromString,
        '_To': toString
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPASIMAByDates.php', 
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
    }
  });
 });