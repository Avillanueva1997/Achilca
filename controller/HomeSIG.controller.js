var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/Dialog",
   "sap/m/Button",
   "sap/m/Label",
   "sap/m/Input",
], function (BaseController, JSONModel,MessageToast, Dialog, Button, Label, Input) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.HomeSIG", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("homeSIG").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
        thes.getNodosManage();
       },
      getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMESIG',
          '_role': role
        };

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel);                              
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      onHomePress: function(oEvent){
        var thes = this;
        thes.getRouter().navTo('homeSIG-G');
      },
      onPressSIG: function(oEvent){
        var thes = this,
        oSource = oEvent.getSource(),
        sPath = oSource.getBindingContext().sPath,
        splitSpath = sPath.split("/"),
        index = splitSpath[splitSpath.length - 1],
        dataModel = oSource.getModel().getData(),
        dataIndex = dataModel.TileCollection[index],
        viewIndex = dataIndex.view,
        splitViewIndex = viewIndex.split('-'),
        information = splitViewIndex[splitViewIndex.length - 1];

        if(information == 'sgc'){
          thes.getRouter().navTo('sig01', {
            info: information
          });
        } else {
          thes.getRouter().navTo(viewIndex);
        }

      },
      onAddModule:function(){
        var thes = this,
        title = '',
        siglas = '';

        var dialog = new Dialog({
          title: 'Información',
          type: 'Message',
          content: [
            new Label({ text: 'Título', labelFor: 'iptTitle'}),
            new Input('iptTitle', {
              liveChange: function(oEvent) {
                oEvent.getSource().addStyleClass('toUpperCase');
                title = oEvent.getParameter('value');
                var parent = oEvent.getSource().getParent();
                if(title != '' && siglas != ''){
                  parent.getBeginButton().setEnabled();
                }
              },
              width: '100%'
            }),
            new Label({ text: 'Siglas', labelFor: 'iptSigla'}),
            new Input('iptSigla', {
              liveChange: function(oEvent) {
                oEvent.getSource().addStyleClass('toUpperCase');
                siglas = oEvent.getParameter('value');
                var parent = oEvent.getSource().getParent();
                if(title != '' && siglas != ''){
                  parent.getBeginButton().setEnabled();
                }
              },
              width: '100%'
            })
          ],
          beginButton: new Button({
            text: 'Guardar',
            enabled: false,
            press: function () {
              thes.createTable(title, siglas)
              MessageToast.show('Guardado con éxito!');
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

      },
      createTable: function(title, siglas){
        var thes = this,
        parametros = {
          '_Title': title,
          '_Siglas': siglas
        };

        $.ajax({
          data: parametros,
          url:   'model/SIG/CrearTabla.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            thes.getNodos();
            thes.getNodosManage();                   
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

      },
      getNodosManage: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEMANAGESIG',
          '_role': role
        },
        lastValue = thes.getDataAcumulado(),
        valueColor = 'Error',
        indicator = 'Down';

        if(lastValue >= 85){
          valueColor = 'Good';
          indicator = 'Up'
        } else if(lastValue < 85 && lastValue >= 65){
          valueColor = 'Critical'; 
          indicator = 'Up'
        } else if(lastValue < 65){
          valueColor = 'Error';
          indicator = 'Down'
        }

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            response.TileCollection[0].value = lastValue;
            response.TileCollection[0].valueColor = valueColor;
            response.TileCollection[0].indicator = indicator;
            var oModel = thes.getView().getModel();
            oModel.setProperty("/TileCollectionManage", response.TileCollection);
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      getDataAcumulado: function(){
        var thes = this,
        lastValue = 0;
        $.ajax({
            url: 'model/SIG/ListarDataTableAcumuladoSecond.php',
            type: 'GET',
            dataType: 'JSON',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
              var value = new Date(Math.max.apply(null, response.map(function(e) {
                return thes.dateMysqlToJsDate(e.fecha);
              })));
              value = thes.dateToMysqlDate(value);
              for (let index = 0; index < response.length; index++) {

                if(response[index].fecha == value){
                  lastValue = response[index].nota;
                }
                
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
        });

        return Number(lastValue);
      }
   });
});
