jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/viz/ui5/controls/VizTooltip',
 'sap/viz/ui5/format/ChartFormatter',
 'sap/viz/ui5/api/env/Format',
 "sap/m/MessageToast",
 "sap/m/MessageBox",
 'sap/m/Label',
 'sap/m/Link',
 'sap/m/Text',
 'sap/ui/model/json/JSONModel',
 '../OKR1/Formatter',
 "sap/ui/model/Filter",
 "sap/m/Dialog",
 "sap/m/Button",
 "sap/m/ComboBox"
 ], function (BaseController, VizTooltip, ChartFormatter, Format, MessageToast, MessageBox, Label, Link, Text, JSONModel, Formatter, Filter, Dialog, Button, ComboBox) {
   "use strict";
   
   return BaseController.extend("sap.ui.app01.controller.CALIDAD.CALIDAD04", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("calidad04").attachPatternMatched(this._onObjectMatched, this);      
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
      thes.openFragmentPA();
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeCALIDAD");
      thes.removeFeeds('idChart1');
    },
    generateChart: function(YearFilter){
      var thes = this,
      year, lastYear, month, metaMonth  = 0,
      metaMonthGlobal = 0,
      linea_produccion,
      parametros,
      url = 'model/CALIDAD/GenerarKpiN2.php',
      actualDate = new Date(),
      actualYear = actualDate.getFullYear();

      if(YearFilter && YearFilter != '' && YearFilter != actualYear){
        year = YearFilter;
        month = 12;
        url = 'model/CALIDAD/GenerarKpiN2Second.php'
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
          metaMonthGlobal = metaMonth * 100;
          thes.byId("idMeta").setContent('<div><table class="styleTablePDF table" align="center"><tr><td class="styleTablePDF widthFirstColumn" rowspan="2"><img src="assets/images/mepsa_ac_n2.png" class="imagePDF"></img></td><td class="styleTablePDF headerPDF">Indicador de Desempeño</td><td class="styleTablePDF textNormalPDF" rowspan="2">Unidad <br></br><span class="secondTextNormalPDF">%</span></td><td class="styleTablePDF textNormalPDF" rowspan="2">Meta <br></br><span class="secondTextNormalPDF">'+ metaMonthGlobal +'%</span></td><td class="styleTablePDF textNormalPDF" rowspan="2">Categoría <br></br><span class="secondTextNormalPDF">Q</span></td></tr><tr><td class="styleTablePDF subheaderPDF">Eficiencia Bolas Forjadas L3</td></tr></table></div>');
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
                      "dataContext": {"Desempeño": {min: 0}},
                      "properties": {
                          "color":"#008f39"
                      },
                      "displayName": 'Bueno'
                    }
                  ],
                  "others":
                  {
                      "properties": {
                           "color": "#ff0000"
                      },
                      "displayName": "Malo"
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
        url: 'model/CALIDAD/ObtenerMetaEficienciaByYearLinea.php',
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
      title = 'Plan de Acción: Calidad';
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
    onExitPA: function() {
      var thes = this;
      thes.getView().byId("DialogPA").close();
    },
    handleSelectionChange: function (oEvent) {
      var thes = this,
      sPath = oEvent.getParameter("listItem").getBindingContext().getPath();

      sap.m.MessageBox.confirm("¿A dónde se quiere dirigir?", {
        actions: ["Actividades", "OKR", MessageBox.Action.CLOSE],
        emphasizedAction: MessageBox.Action.CLOSE ,
        onClose: function(oAction) {
          if(oAction == "Actividades"){
            var aPath = sPath.split("/"),
            sCurrentCrumb = aPath[aPath.length - 2],
            sNewPath = [sPath, thes._nextCrumb(sCurrentCrumb)].join("/");

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
              monthFechaEvento = jsDateFechaEvento.getMonth(),
              yearFechaEvento = jsDateFechaEvento.getFullYear(),
              linea_produccion = dataIndex.linea_produccion;
      
              thes.getRouter().navTo('okr3-2-LP', {
                linea_produccion: linea_produccion,
                moye: monthFechaEvento + '.' + yearFechaEvento
              });
      
            } else {
              MessageToast.show('Seleccioné actividad!');
            }
          } else {
            thes._oTable.removeSelections();
          }
        }
      });
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
      linea_produccion = 'L3',
      table = 'pa_calidad',
      parametros = {
        '_Table': table,
        '_LineaProduccion': linea_produccion,
        '_TipoEvento': 'EFICIENCIA'
      };

      $.ajax({
          data: parametros,
          url:   'model/PA/ListarPaByTipoEvento.php', 
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
    onRedirectEvent: function(){
      var thes = this,
      selectedPath = this._oTable.getSelectedContextPaths();

      if(selectedPath.length > 0){
        selectedPath = selectedPath[0];
        selectedPath = selectedPath.split("/");
        var indexNivelOne = selectedPath[selectedPath.length - 3],
        indexNivelTwo = selectedPath[selectedPath.length - 1],  
        oData = thes.getView().getModel().getData(),
        dataIndex = oData.EventHierarchy.Eventos[indexNivelOne].Actividades[indexNivelTwo],
        fechaEje = dataIndex.fecha_eje,
        jsDateFechaEje = thes.dateMysqlToJsDate(fechaEje),
        monthFechaEje = jsDateFechaEje.getMonth(),
        yearFechaEje = jsDateFechaEje.getFullYear();

        thes.getRouter().navTo('okr3-2-LP', {
          linea_produccion: 'L3',
          moye: monthFechaEje + '.' + yearFechaEje
        });

      } else {
        MessageToast.show('Seleccioné actividad!');
      }
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
      table = 'pa_calidad',
      linea_produccion = 'L3',
      parametros = {
        '_Table': table,
        '_Month': month,
        '_LineaProduccion': linea_produccion,
        '_TipoEvento': 'EFICIENCIA'
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPaByMonthTipoEventoLP.php', 
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
      table = 'pa_calidad',
      linea_produccion = 'L3',
      parametros = {
        '_Table': table,
        '_From': fromString,
        '_To': toString,
        '_LineaProduccion': linea_produccion,
        '_TipoEvento': 'EFICIENCIA'
      };

      $.ajax({
        data: parametros,
        url:   'model/PA/ListarPaByDatesTipoEventoLP.php', 
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
    }
  });
 });