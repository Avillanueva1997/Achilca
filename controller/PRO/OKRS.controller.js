jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast",
 'sap/m/Label',
 'sap/m/Popover',
 "sap/ui/core/format/DateFormat",
 'sap/ui/core/Fragment',
 'sap/base/Log',
 "sap/ui/unified/library",
 './Formatter'
 ], function (BaseController, jQuery, JSONModel, MessageToast, Label, Popover, DateFormat, Fragment, Log, unifiedLibrary, Formatter) {
   "use strict";

   return BaseController.extend("sap.ui.app01.controller.PRO.OKRS", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okrs").attachPatternMatched(this._onObjectMatched, this);

      var target = oRouter.getTarget("okrs");
      target.attachDisplay(this.onDisplay, this);
    },
    onDisplay: function (oEvent) {
      /*var thes = this,
      dateToday = new Date(),
      dateToday = dateToday.toLocaleString(),
      linea_produccion = oEvent.getParameters().data.linea_produccion;
      thes.getScada(dateToday, linea_produccion);*/
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("pro03");
    }
  });
 });