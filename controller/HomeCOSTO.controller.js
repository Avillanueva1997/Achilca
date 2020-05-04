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
   "sap/ui/model/Filter"
], function (BaseController, JSONModel,MessageToast, MessageBox, Label, Link, Text, Formatter, Filter) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeCOSTO", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeCOSTO").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
       },
      getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMECOSTO',
          '_role': role
        },
        statusKpiN1 = thes.setSemaforoKPIN1(),
        statusKpiN2 = thes.setSemaforoKPIN2();

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == 'costo01'){
                response.TileCollection[index].color = statusKpiN1;
              } else if (response.TileCollection[index].view == 'costo02'){
                response.TileCollection[index].color = statusKpiN2;
              } else {
                response.TileCollection[index].color = 'Error';
              }         
            }
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.byId("HL_TC").setModel(oModel);                              
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });
      },
      onHomePress: function(oEvent){
        var thes = this;
        thes.getRouter().navTo('home');
      },
      setSemaforoKPIN1: function(){
        var thes = this,
        status;

        $.ajax({
          url:   'model/COSTO/SetSemaforoKpiN1.php', 
          type:  'GET',
          dataType: 'json',
          async: false,
          success:  function (response) {
            status = response.root.status;                     
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

        return status;
      },
      setSemaforoKPIN2: function(){
        var thes = this,
        status;
        $.ajax({
          url:   'model/COSTO/SetSemaforoKpiN2.php', 
          type:  'GET',
          dataType: 'json',
          async: false,
          success:  function (response) {
            status = response.root.status;                   
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

        return status;
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
                diametro = dataIndex.diametro,
                tipo_evento = dataIndex.tipo_evento;
        
                if(tipo_evento == 'COSTO TRF'){
                  thes.getRouter().navTo('okr5-1-D', {
                    diametro: diametro,
                    year: yearFechaEvento,
                    month: monthFechaEvento
                  });
                } else {
                  thes.getRouter().navTo('okr5-2', {
                    year: yearFechaEvento
                  });
                }
        
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
        table = 'pa_costos',
        parametros = {
          '_Table': table
        };
  
        $.ajax({
          data: parametros,
          url:   'model/PA/ListarPACOSTOS.php', 
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
        table = 'pa_costos',
        parametros = {
          '_Table': table,
          '_Month': month
        };
  
        $.ajax({
          data: parametros,
          url:   'model/PA/ListarPACOSTOSByMonth.php', 
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
        table = 'pa_costos',
        parametros = {
          '_Table': table,
          '_From': fromString,
          '_To': toString,
        };
  
        $.ajax({
          data: parametros,
          url:   'model/PA/ListarPACOSTOSByDates.php', 
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
