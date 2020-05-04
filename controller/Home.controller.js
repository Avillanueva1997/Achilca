var ConexionGlobal = sessionStorage.ConexionGlobal;

jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
   "sap/ui/app01/controller/BaseController",
   'sap/ui/core/Fragment',
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   'jquery.sap.global',
   'sap/m/MessageView',
   'sap/m/MessagePopoverItem',
   'sap/m/Link',
   'sap/m/Dialog',
   'sap/m/Button',
   'sap/m/Bar',
   'sap/m/Text',
   "sap/ui/model/Filter"
], function (BaseController, Fragment, JSONModel, MessageToast, jQuery, MessageView, MessagePopoverItem, Link, Dialog, Button, Bar, Text, Filter) {
   "use strict";

   var oLink = new Link({
		text: "Show more information",
		href: "http://sap.com",
		target: "_blank"
    });

    var oMessageTemplate = new MessagePopoverItem({
      type: '{Notifications>type}',
      title: '{Notifications>title}',
      description: '{Notifications>description}',
      subtitle: '{Notifications>subtitle}',
      counter: '{Notifications>counter}',
      groupName: '{Notifications>group}',
      link: oLink
    });
    
   return BaseController.extend("sap.ui.app01.controller.Home", {

       onInit: function(oEvent) {
           var thes = this;
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.getRoute("home").attachPatternMatched(this._onObjectMatched, this);          
       },      
       _onObjectMatched: function (oEvent) {
        var thes = this;
        thes.getNodos();
        thes.getNodosConfig();
        thes.getNodosOkrs();
        thes.getNodosSP();
        thes.setTiles();
        thes.setInformationNotifications();
        thes.setMsg();
       },
       //Gestión de Operaciones
      getNodos: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOME',
          '_role': role
        },
        statusCosto = thes.setSemaforoCOSTO(),
        statusCalidad = thes.setSemaforoCALIDAD(),
        statusPro = thes.setSemaforoPRO(),
        statusSIMA = thes.getSemaforoSIMA(),
        statusSIG = thes.getSemaforoSIG();

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == 'homeSIMA'){
                response.TileCollection[index].color = statusSIMA;
              } else if(response.TileCollection[index].view == 'homeCOSTO'){
                response.TileCollection[index].color = statusCosto;
              } else if(response.TileCollection[index].view == 'homeCALIDAD'){
                response.TileCollection[index].color = statusCalidad;
              } else if(response.TileCollection[index].view == 'homePRO'){
                response.TileCollection[index].color = statusPro;
              } else if(response.TileCollection[index].view == "homeSIG-G"){
                response.TileCollection[index].color = statusSIG;
              } else {
                response.TileCollection[index].color = 'Neutral';
              }
            }
            
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel);                              
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      getNodosConfig: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMECONFIG',
          '_role': role
        };

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            var oModel = thes.getView().getModel();
            oModel.setProperty("/TileCollectionConfig", response.TileCollection);
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      getNodosOkrs: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMEOKRS',
          '_role': role
        },
        statusOKRSIMA = thes.getSemaforoSIMA(),
        statusOKRCALIDAD = thes.setSemaforoCalidad(),
        statusOKRPRO = thes.resultOKRPRO(),
        statusOKRCOSTOS = thes.resultCosto();

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            for (let index = 0; index < response.TileCollection.length; index++) {
              if(response.TileCollection[index].view == 'homeOKR1'){
                response.TileCollection[index].color = statusOKRSIMA;
              } else if(response.TileCollection[index].view == 'homeOKR2'){
                response.TileCollection[index].color = statusOKRCALIDAD;
              } else if(response.TileCollection[index].view == 'homeOKR3'){
                response.TileCollection[index].color = statusOKRPRO;
              } else if(response.TileCollection[index].view == 'homeOKR5'){
                response.TileCollection[index].color = statusOKRCOSTOS;
              } else {
                response.TileCollection[index].color = 'Neutral';
              }         
            }
            
            var oModel = thes.getView().getModel();
            oModel.setProperty("/TileCollectionOkrs", response.TileCollection);
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      getNodosSP: function(oEvent){
        var thes = this,
        role = sessionStorage.role,
        parametros = {
          '_level': 'HOMESP',
          '_role': role
        };

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodos.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            var oModel = thes.getView().getModel();
            oModel.setProperty("/TileCollectionSP", response.TileCollection);
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        })
      },
      setTiles: function(){
        var thes = this,
        iconTabHeader = thes.byId('iconTabHeaderPrincipal'),
        oKey = iconTabHeader.getSelectedKey(),
        area = sessionStorage.area,
        area = thes.getAreaByCode(area),
        role = sessionStorage.role;

        if(oKey == 'homeConfig'){
          thes.byId('HL_CONFIG').setVisible(true);
          thes.byId('HL_GO').setVisible(false);
          thes.byId('HL_OKRS').setVisible(false);
          thes.byId('HB_PDF').setVisible(false);
          thes.byId('HL_SP').setVisible(false);
            } else if(oKey == 'homeGO'){
          thes.byId('HL_CONFIG').setVisible(false);
          thes.byId('HL_GO').setVisible(true);
          thes.byId('HL_OKRS').setVisible(false);
          thes.byId('HB_PDF').setVisible(false);
          thes.byId('HL_SP').setVisible(false);
            } else if(oKey == 'homeOKRS'){
          thes.byId('HL_CONFIG').setVisible(false);
          thes.byId('HL_GO').setVisible(false);
          thes.byId('HL_OKRS').setVisible(true);
          if(area == 'PRODUCCIÓN' || role == 'ADMIN'){
            thes.byId('HB_PDF').setVisible(true);
          } else {
            thes.byId('HB_PDF').setVisible(false);
          }
          thes.byId('HL_SP').setVisible(false);
        } else if(oKey == 'homeSP'){
          thes.byId('HL_CONFIG').setVisible(false);
          thes.byId('HL_GO').setVisible(false);
          thes.byId('HL_OKRS').setVisible(false);
          thes.byId('HB_PDF').setVisible(false);
          thes.byId('HL_SP').setVisible(true);
        }
      },
      handleMessageViewPress: function (oEvent) {
        this.oMessageView.navigateBack();
        this.oDialog.open();
      },
      setInformationNotifications: function(){
        var that = this;
			// create any data and a model and set it to the view

			var sErrorDescription = 'First Error message description. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod' +
				'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,' +
				'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
				'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse' +
				'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non' +
				'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

			var aMockMessages = [/*{
				type: 'Error',
				title: 'Account 801 requires an assignment',
				description: sErrorDescription,
				subtitle: 'Role is invalid',
				group: "Purchase Order 450001"
			}, {
				type: 'Warning',
				title: 'Account 821 requires a check',
				description: sErrorDescription,
				subtitle: 'Undefined task',
				group: "Purchase Order 450001"
			}, {
				type: 'Warning',
				title: 'Enter a text with maximum 6 characters length',
				description: sErrorDescription,
				group: "Purchase Order 450002"
			}, {
				type: 'Warning',
				title: 'Enter a text with maximum 8 characters length',
				description: sErrorDescription,
				group: "Purchase Order 450002"
			}, {
				type: 'Error',
				title: 'Account 802 requires an assignment',
				description: sErrorDescription,
				subtitle: 'Role is invalid',
				group: "Purchase Order 450002"
			}*/ {
				type: 'Error',
				title: 'Technical message without object relation',
				description: sErrorDescription,
				group: "General"
			}, {
				type: 'Warning',
				title: 'Global System will be down on Sunday',
				description: sErrorDescription,
				group: "General"
			}, {
				type: 'Error',
				title: 'Global System will be down on Sunday',
				description: sErrorDescription,
				group: "General"
			}, {
				type: 'Error',
				title: 'An Error',
				subtitle: "Ungrouped message",
				description: sErrorDescription
			}, {
				type: 'Warning',
				title: 'A Warning',
				subtitle: "Ungrouped message",
				description: sErrorDescription
			}];

			var oModel = new JSONModel();
			oModel.setData(aMockMessages);

			var viewModel = new JSONModel();
			viewModel.setData({
				messagesLength: aMockMessages.length + ''
			});

			this.getView().setModel(viewModel, "Notifications");

			this.oMessageView = new MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: 'Notifications>/',
						template: oMessageTemplate
					},
					groupItems: true
				});
			var oBackButton = new Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});

			this.oMessageView.setModel(oModel, "Notifications");

			this.oDialog = new Dialog({
				content: this.oMessageView,
				contentHeight: "440px",
				contentWidth: "640px",
				endButton: new Button({
					text: "Cerrar",
					press: function() {
						this.getParent().close();
					}
				}),
				customHeader: new Bar({
					contentMiddle: [
						new Text({ text: "Notificaciones"})
					],
					contentLeft: [oBackButton]
				}),
				verticalScrolling: false
			});
      },
      setSemaforoCOSTO: function(){
        var thes = this,
        status = 'Neutral';

        $.ajax({
          url:   'model/COSTO/SetSemaforoCosto.php', 
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
      setSemaforoCALIDAD: function(){
        var thes = this,
        status = 'Neutral',
        statusKpiN1 = thes.setSemaforoCalidadKPIN1('L2'),
        statusKpiN2 = thes.setSemaforoCalidadKPIN1('L3'),
        statusKpiN3 = thes.setSemaforoCalidadKPIN2('L2'),
        statusKpiN4 = thes.setSemaforoCalidadKPIN2('L3'),
        contador = 0;

        if(statusKpiN1 != 'Neutral'){
          contador++;
          statusKpiN1 = (statusKpiN1 == 'Good') ? 1 : 0;
        } else {
          statusKpiN1 = 0;
        }

        if(statusKpiN2 != 'Neutral'){
          contador++;
          statusKpiN2 = (statusKpiN2 == 'Good') ? 1 : 0;
        } else {
          statusKpiN2 = 0;
        }

        if(statusKpiN3 != 'Neutral'){
          contador++;
          statusKpiN3 = (statusKpiN3 == 'Good') ? 1 : 0;
        } else {
          statusKpiN3 = 0;
        }

        if(statusKpiN4 != 'Neutral'){
          contador++;
          statusKpiN4 = (statusKpiN4 == 'Good') ? 1 : 0;
        } else {
          statusKpiN4 = 0;
        }

        if(contador != 0){
          status = (statusKpiN1 + statusKpiN2 + statusKpiN3 + statusKpiN4) / contador;
          status = (status >= 0.5) ? 'Good' : 'Error';
        } else {
          status = 'Neutral';
        }

        return status;
      },
      setSemaforoPRO: function(){
        var thes = this,
        status = 'Neutral',
        statusKpiN1 = thes.setSemaforoProduccionKPIN1('L2'),
        statusKpiN2 = thes.setSemaforoProduccionKPIN1('L3'),
        statusKpiN3 = thes.setSemaforoProduccionKPIN2('L2'),
        statusKpiN4 = thes.setSemaforoProduccionKPIN2('L3'),
        contador = 0;

        if(statusKpiN1 != 'Neutral'){
          contador++;
          statusKpiN1 = (statusKpiN1 == 'Good') ? 1 : 0;
        } else {
          statusKpiN1 = 0;
        }

        if(statusKpiN2 != 'Neutral'){
          contador++;
          statusKpiN2 = (statusKpiN2 == 'Good') ? 1 : 0;
        } else {
          statusKpiN2 = 0;
        }

        if(statusKpiN3 != 'Neutral'){
          contador++;
          statusKpiN3 = (statusKpiN3 == 'Good') ? 1 : 0;
        } else {
          statusKpiN3 = 0;
        }

        if(statusKpiN4 != 'Neutral'){
          contador++;
          statusKpiN4 = (statusKpiN4 == 'Good') ? 1 : 0;
        } else {
          statusKpiN4 = 0;
        }

        if(contador != 0){
          status = (statusKpiN1 + statusKpiN2 + statusKpiN3 + statusKpiN4) / contador;
          status = (status >= 0.5) ? 'Good' : 'Error';
        } else {
          status = 'Neutral';
        }

        return status;
      },
      generateStatusOkrPRO: function(linea_produccion){
        var thes = this,
        date = new Date(),
        oKeyYear = date.getFullYear(),
        oKeyMonth = date.getMonth(),
        parametros = {
          '_Year': oKeyYear,
          '_Month': oKeyMonth,
          '_Linea': linea_produccion
        }, responseStatus = 0;
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN3.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            var value = '';
            if(Array.isArray(response)){
              value = Number(response[response.length - 1].quantity);
              responseStatus = (value >= 0) ? 1 : 0;
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return responseStatus;
      },
      getStatusOkrEficiencia: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        },
        meta = thes.getMetaEficiencia(year, linea_produccion),
        data = 0;
  
        $.ajax({
          data: parametros,
          url: 'model/PRO/GenerarChartN2.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            if(Array.isArray(response) && response.length > 0){
              let lastPromedio = response[response.length - 1].promedio;
              if(lastPromedio >= Number(meta)){
                data = 1;
              } else {
                data = 0;
              }
            } else {
              data = 0;
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      getMetaEficiencia: function(year, linea_produccion){
        var thes = this,
        parametros = {
          '_Year': year,
          '_LineaProduccion': linea_produccion
        },
        data = 0;
  
        $.ajax({
          data: parametros,
          url: 'model/EFICIENCIA/ListarMeta.php',
          type: 'post',
          async: false,
          beforeSend: function(){},
          success: function(response){
            data = response;
          },
          error:  function(xhr, thrownError, ajaxOptions){
              alert(xhr.status);
              alert(thrownError);
          }
        });
  
        return data;
  
      },
      generateStatusOkrOEE: function(linea_produccion, meta){
        var thes = this,
        date = new Date(),
        oKeyYear = date.getFullYear(),
        oKeyMonth = date.getMonth(),
        parametros = {
          '_Year': oKeyYear,
          '_Month': oKeyMonth,
          '_Linea': linea_produccion
        },
        data = 0;
  
        $.ajax({
          data: parametros,
          url: 'model/OEE/GenerarChartN5.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            if(Array.isArray(response) && response.length > 0){
              let lastOee = response[response.length - 1].oee;
              if(lastOee >= meta){
                data = 1;
              } else {
                data = 0;
              }
            } else {
              data = 0;
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      resultPRO: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        result = 0,
        response = 'Neutral';

        if(lineas_produccion.length != 0){
          for (let index = 0; index < lineas_produccion.length; index++) {
            result += thes.generateStatusOkrPRO(lineas_produccion[index].linea_produccion);            
          } 
          result = result / lineas_produccion.length;
          response = (result >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }
        return response;
      },
      resultEficiencia: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        result = 0,
        response = 'Neutral';

        if(lineas_produccion.length != 0){
          for (let index = 0; index < lineas_produccion.length; index++) {
            result += thes.getStatusOkrEficiencia(lineas_produccion[index].linea_produccion);            
          }
          result = result / lineas_produccion.length;
          response = (result >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }
        return response;
      },
      resultOEE: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        result = 0,
        response = 'Neutral';

        if(lineas_produccion.length != 0){
          for (let index = 0; index < lineas_produccion.length; index++) {
            result += thes.generateStatusOkrOEE(lineas_produccion[index].linea_produccion, 70);            
          }
          result = result / lineas_produccion.length;
          response = (result >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }

        return response;
      },
      resultOKRPRO: function(){
        var thes = this,
        resultPRO = thes.resultPRO(),
        resultEFICIENCIA = thes.resultEficiencia(),
        resultOEE = thes.resultOEE(),
        response = 'Neutral',
        contador = 0;

        if(resultPRO != 'Neutral'){
          contador++
        } else {
          resultPRO = 0;
        }

        if(resultEFICIENCIA != 'Neutral'){
          contador++
        } else {
          resultEFICIENCIA = 0;
        }

        if(resultOEE != 'Neutral'){
          contador++
        } else {
          resultOEE = 0;
        }

        if(contador != 0){
          response = (resultPRO + resultEFICIENCIA + resultOEE) / contador,
          response = (response >= 0.5) ? 'Good' : 'Error';           
        } else {
          response = 'Neutral';
        }

        return response;
      },
      onPressGO: function(oEvent){ 
        debugger;
        var thes = this,
        dataModel = thes.getView().getModel().getData(),
        dataGO = dataModel.TileCollection,
        oSource = oEvent.getSource(),
        bindingContext = oSource.getBindingContext(),
        sPath = bindingContext.sPath,
        splitSpath = sPath.split('/'),
        index = splitSpath[2],
        dataIndex = dataGO[index],
        dataStatus = dataIndex.color;

        thes.cargarResponsable();

        var oModel = new sap.ui.model.json.JSONModel(dataIndex);  
        thes.getView().setModel(oModel, "view");

        thes.onPress(oEvent);

        //if(dataStatus == 'Error'){
          /*if(dataIndex.view == "homeSIMA"){
            thes.cargarActivitiesSIMA('pa_sima');
            thes.openFragmentSIMAN();
          } else if(dataIndex.view == "homeCALIDAD"){
            thes.cargarActivitiesCalidad('pa_cal');
            thes.openFragment();
          } else if(dataIndex.view == "homePRO"){
            thes.cargarActivities('pa_pro');
            thes.openFragment();
          } else if(dataIndex.view == "homeCOSTO"){
            thes.cargarActivitiesCosto('pa_cost');
            thes.openFragment();
          }else if(dataIndex.view == "homeSIG-G"){
                      
          }*/
        /*} else {
          thes.onPress(oEvent);
        }*/
      },
      openFragment: function(){
        var thes = this,
        oView = thes.getView(),
        oDialog = oView.byId("DialogPA");
        if (!oDialog) {
            oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.app01.view.Fragments.TablePA", this);
            oView.addDependent(oDialog);
        }

        oDialog.open();
      },
      openFragmentSIMA: function(){
        var thes = this,
        oView = thes.getView(),
        oDialog = oView.byId("DialogPASIMA");
        if (!oDialog) {
            oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.app01.view.Fragments.TablePASIMA", this);
            oView.addDependent(oDialog);
        }

        oDialog.open();
      },
      openFragmentSIMAN: function(){
        var thes = this,
        oView = thes.getView(),
        oDialog = oView.byId("DialogPASIMAN");
        if (!oDialog) {
            oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.app01.view.Fragments.TablePASIMAN", this);
            oView.addDependent(oDialog);
        }

        oDialog.open();
      },
      getStatusSIMA: function(campo){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        parametros = {
          '_Campo': campo,
          '_Year': year
        },
        value = 'Neutral';

        $.ajax({
          data: parametros,
          url:   'model/SIMA/GenerateStatus.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            if(Array.isArray(response)){
              if(response.length == 0){
                value = 'Neutral';
              } else {
                let Value = Number(response[response.length - 1].Value);
                if(Value > 0){
                  value = 'Error';
                } else {
                  value = 'Good';
                }
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

        return value;
      },
      getSemaforoSIMA: function(){
        var thes = this,
        countIndicadores = 0,
        okrN1 = thes.getStatusSIMA('num_accidentes'),
        okrN2 = thes.getStatusSIMA('indice_frecuencia'),
        okrN3 = thes.getStatusSIMA('indice_severidad'),
        response = 0;

        if(okrN1 == 'Good'){
          okrN1 = 1;
          countIndicadores++;
        } else if(okrN1 == 'Error'){
          okrN1 = 0;
          countIndicadores++;
        } else {
          okrN1 = 0;
        }

        if(okrN2 == 'Good'){
          okrN2 = 1;
          countIndicadores++;
        } else if(okrN2 == 'Error'){
          okrN2 = 0;
          countIndicadores++;
        } else {
          okrN2 = 0;
        }

        if(okrN3 == 'Good'){
          okrN3 = 1;
          countIndicadores++;
        } else if(okrN3 == 'Error'){
          okrN3 = 0;
          countIndicadores++;
        } else {
          okrN3 = 0;
        }

        response = (countIndicadores != 0) ? (okrN1+okrN2+okrN3) / countIndicadores : 'Neutral';

        if(response != 'Neutral'){
          response = (response >= 0.5) ? 'Good' : 'Error';
        }        

        return response;
      },
      getDataSemaforoCalidadN1: function(){
        var thes = this,
        date =  new Date(),
        year = date.getFullYear(),
        month = date.getMonth(), 
        parametros = {
          '_Year': year,
          '_Month': month
        }, 
        tonelajeObs = 0,
        tonelajeProd = 0,
        value = 0;
  
        $.ajax({
              data: parametros,
              url:   'model/CALIDAD/GenerarChartN1.php', 
              type:  'post',
              async: false,
              beforeSend: function () {
              },
              success:  function (response) {
                response = JSON.parse(response);
                if(Array.isArray(response) && response.length == 0){
                  value = -1;
                } else {
                  for (let index = 0; index < response.length; index++) {
                    tonelajeObs += Number(response[index].bola_observada);
                    tonelajeProd += Number(response[index].produccion_neta);                  
                  }
                  value = tonelajeObs / (tonelajeObs + tonelajeProd);
                  value = Math.round(value);
                  value = (value <= 1.5) ? 1 : 0;
                }
              },
              error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
              }
        });

        return value;
      },
      getDataSemaforoCalidadN2: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        }, 
        tonelajeObs = 0,
        tonelajeProd = 0,
        value = 0;

        $.ajax({
          data: parametros,
          url: 'model/CALIDAD/GenerarChartN2.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            for (let index = 0; index < response.length; index++) {
              tonelajeObs += Number(response[index].bola_observada);
              tonelajeProd += Number(response[index].produccion_neta);                  
            }
            value = tonelajeObs / (tonelajeObs + tonelajeProd);
            value = Math.round(value);
            value = (value <= 1.5) ? 1 : 0;
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return value;
      },
      getLineaProduccionDistinct: function(){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month
        }, 
        data;

        $.ajax({
          data: parametros,
          url:   'model/CALIDAD/ListarLineaProduccionDistinct.php', 
          type:  'post',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) {
            response = JSON.parse(response);
            data = response;
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return data;
      },
      setStatusSemaforoCalidadN2: function(){
        var thes = this,
        lineas_produccion = thes.getLineaProduccionDistinct(),
        value = 0;
        if(lineas_produccion.length == 0){
          value = -1;
        } else {
          for (let index = 0; index < lineas_produccion.length; index++) {
            let response = thes.getDataSemaforoN2(lineas_produccion[index].linea_produccion);
            value += response;
          }
          value = value / lineas_produccion.length;
          value = (value >= 0.5) ? 1: 0;
        }
        return value;
      },
      setSemaforoCalidad: function(){
        var thes = this,
        valueN1 = thes.getDataSemaforoCalidadN1(),
        valueN2 = thes.setStatusSemaforoCalidadN2(),
        response = 0;

        if(valueN1 != -1 && valueN2 != -1){
          response = (valueN1 + valueN2) / 2;
          response = (response >= 0.5) ? 'Good' : 'Error';
        } else {
          if(valueN1 == -1 && valueN2 != -1){
            response = valueN2 / 1;
            response = (response >= 0.5) ? 'Good' : 'Error';
          } else if(valueN1 != -1 && valueN2 == -1){
            response = valueN1 / 1;
            response = (response >= 0.5) ? 'Good' : 'Error';
          } else {
            response = 'Neutral';
          }
        }
        return response;
      },
      getSemaforoN1Costo: function(diametro){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
            '_Year': year,
            '_Diametro': diametro,
            '_Month': month
        },
        status = 0;

        $.ajax({
            data: parametros,
            url: 'model/COSTO/GenerarSemaforoN1.php',
            type: 'POST',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
            response = JSON.parse(response);
              if(response.length == 1){
                let real = Number(response[0].real);
                let objetivo = Number(response[0].objetivo);
                status = (real <= objetivo) ? 1 : 0;
              } else {
                status = 0;
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
            }
        });

        return status;
      },
      getDiametrosCosto: function(oEvent){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        parametros = {
          '_Year': year,
          '_Prefijo': 'okr5-1'
        },
        data;

        $.ajax({
          data: parametros,
          url:   'model/NODOS/GenerarNodosByDiametroDistinctCostoTRF.php', 
          type:  'post',
          dataType: 'json',
          async: false,
          success:  function (response) {
            data = response.TileCollection;                       
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

        return data;
      },
      getDiametrosDistinct: function(oEvent){
        var thes = this,
        dateToday = new Date(),
        year = dateToday.getFullYear(),
        month = dateToday.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month
        },
        data;

        $.ajax({
          data: parametros,
          url:   'model/COSTO/ListarDiametroDistinctCostoTRF.php', 
          type:  'post',
          async: false,
          success:  function (response) {
            response = JSON.parse(response);
            data = response;                       
          },
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }
        });

        return data;
      },
      setSemaforoN1Costo: function(){
        var thes = this,
        diametros = thes.getDiametrosDistinct(),
        sum = 0,
        response = 'Neutral';

        if(diametros.length != 0){
          for (let index = 0; index < diametros.length; index++) {        
            let diametro = diametros[index].diametro;
            sum += thes.getSemaforoN1Costo(diametro);
          }
          response = sum / diametros.length;
          response = (response >= 0.5) ? 'Good' : 'Error';
        } else {
          response = 'Neutral';
        }
        return response;
      },
      getSemaforoN2Costo: function(){
          var thes = this,
          date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth(),
          parametros = {
            '_Year': year,
            '_Month': month
          },
          status = 0;
    
          $.ajax({
            data: parametros,
            url: 'model/COSTO/GenerarSemaforoN2.php',
            type: 'POST',
            async: false,
            beforeSend: function(){
            },
            success: function(response){
              response = JSON.parse(response);
              if(Array.isArray(response) && response.length == 1){
                let real = Number(response[0].real);
                let objetivo = Number(response[0].objetivo);
                if(objetivo > 0){
                  status = (real <= objetivo) ? 'Good' : 'Error';
                } else {
                  status = 'Neutral';
                } 
              } else {
                status = 'Neutral';
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
          });

          return status;
      },
      resultCosto: function(){
        var thes = this,
        resultSemaforoN1 = thes.setSemaforoN1Costo(),
        resultSemaforoN2 = thes.getSemaforoN2Costo(),
        contador = 0,
        response = 'Neutral';

        if(resultSemaforoN1 != 'Neutral'){
          contador++;
        } else {
          resultSemaforoN1 = 0;
        }

        if(resultSemaforoN2 != 'Neutral'){
          contador++;
        } else {
          resultSemaforoN2 = 0;
        }

        if(contador == 0){
          response = 'Neutral'
        } else {
          response = (resultSemaforoN1 + resultSemaforoN2) / contador,
          response = (response >= 0.5) ? 'Good':'Error';
        }

        return response;
      },
      cargarActivities: function(table){
        var thes = this,
        parametros = {
          '_Table': table
        };
  
        $.ajax({
            data: parametros,
            url:   'model/PA/ListarPaproComplete.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              response = JSON.parse(response);
              for (let index = 0; index < response.length; index++) {
                if(response[index]['status'] == 1){
                  response[index]['status'] = '#ff0000';
                } else if(response[index]['status'] == 2){
                  response[index]['status'] = '#008f39';
                } else if(response[index]['status'] == 3){
                  response[index]['status'] = '#ff8000';
                } else {
                  response[index]['status'] = '#008f39';
                }
              }
              var oModel = new sap.ui.model.json.JSONModel(response);  
              thes.getView().setModel(oModel, "planAccion");
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
      },/*
      cargarActivitiesSIMA: function(table){
        var thes = this,
        parametros = {
          '_Table': table
        };
  
        $.ajax({
            data: parametros,
            url:   'model/PA/ListarPASIMAComplete.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              response = JSON.parse(response);
              for (let index = 0; index < response.length; index++) {
                if(response[index]['status'] == 1){
                  response[index]['status'] = '#ff0000';
                } else if(response[index]['status'] == 2){
                  response[index]['status'] = '#008f39';
                } else if(response[index]['status'] == 3){
                  response[index]['status'] = '#ff8000';
                } else {
                  response[index]['status'] = '#008f39';
                }

                if(response[index]['type'] == "ACC"){
                  response[index]['type'] = 'ACCIDENTE';
                } else {
                  response[index]['type'] = 'INCIDENTE';
                }
              }
              var oModel = new sap.ui.model.json.JSONModel(response);  
              thes.getView().setModel(oModel, "planAccion");
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
      },*/
      cargarActivitiesSIMA: function(table){
        var thes = this,
        parametros = {
          '_Table': table
        };
  
        $.ajax({
            //data: parametros,
            url:   'model/PA/data.json', 
            type:  'GET',
            //async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              //response = JSON.parse(response);
              /*for (let index = 0; index < response.length; index++) {
                if(response[index]['status'] == 1){
                  response[index]['status'] = '#ff0000';
                } else if(response[index]['status'] == 2){
                  response[index]['status'] = '#008f39';
                } else if(response[index]['status'] == 3){
                  response[index]['status'] = '#ff8000';
                } else {
                  response[index]['status'] = '#008f39';
                }

                if(response[index]['type'] == "ACC"){
                  response[index]['type'] = 'ACCIDENTE';
                } else {
                  response[index]['type'] = 'INCIDENTE';
                }
              }*/
              var oModel = new sap.ui.model.json.JSONModel(response);  
              thes.getView().setModel(oModel, "planAccion");
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
      },
      cargarActivitiesCalidad: function(table){
        var thes = this,
        parametros = {
          '_Table': table
        };
  
        $.ajax({
            data: parametros,
            url:   'model/PA/ListarPacalComplete.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              response = JSON.parse(response);
              for (let index = 0; index < response.length; index++) {
                if(response[index]['status'] == 1){
                  response[index]['status'] = '#ff0000';
                } else if(response[index]['status'] == 2){
                  response[index]['status'] = '#008f39';
                } else if(response[index]['status'] == 3){
                  response[index]['status'] = '#ff8000';
                } else {
                  response[index]['status'] = '#008f39';
                }
              }
              var oModel = new sap.ui.model.json.JSONModel(response);  
              thes.getView().setModel(oModel, "planAccion");
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
      },
      cargarActivitiesCosto: function(table){
        var thes = this,
        parametros = {
          '_Table': table
        };
  
        $.ajax({
            data: parametros,
            url:   'model/PA/ListarPacostComplete.php', 
            type:  'POST',
            async: false,
            beforeSend: function () {
            },
            success:  function (response) {
              response = JSON.parse(response);
              for (let index = 0; index < response.length; index++) {
                if(response[index]['status'] == 1){
                  response[index]['status'] = '#ff0000';
                } else if(response[index]['status'] == 2){
                  response[index]['status'] = '#008f39';
                } else if(response[index]['status'] == 3){
                  response[index]['status'] = '#ff8000';
                } else {
                  response[index]['status'] = '#008f39';
                }
              }
              var oModel = new sap.ui.model.json.JSONModel(response);  
              thes.getView().setModel(oModel, "planAccion");
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }
          });
      },
      onExit: function() {
        var thes = this,
        modelView = thes.getView().getModel("view").getData(),
        view = modelView.view;
        thes.byId("searchFieldPA").setValue("");
        thes.getView().byId("DialogPA").close();
        thes.getRouter().navTo(view);
      },
      onExitSIMA: function() {
        var thes = this,
        modelView = thes.getView().getModel("view").getData(),
        view = modelView.view;
        //thes.byId("searchFieldSIMA").setValue("");
        thes.getView().byId("DialogPASIMAN").close();
        thes.getRouter().navTo(view);
      },
      cargarResponsable: function(){
        var thes = this;
        $.ajax({
          url:   'model/SPRO/ListarResponsable.php', 
          type:  'get',
          async: false,
          beforeSend: function () {
          },
          success:  function (response) { 
            response = JSON.parse(response);
            var oModel = new sap.ui.model.json.JSONModel(response);  
            thes.getView().setModel(oModel,"McbxResponsable");  
          },
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }
        });
  
      },
      onListItemPress: function (oEvent) {
        var thes = this,
        dataModelView = thes.getView().getModel("view").getData(),
        viewGlobal = dataModelView.view,
        oTable = oEvent.getSource(),
        oContext = oTable.getBindingContextPath(),
        splitContext = oContext.split('/'),
        index = splitContext[splitContext.length - 1],
        dataModel = thes.getView().getModel("planAccion").getData(),
        dataIndex = dataModel[index],
        date_create = dataIndex.date_create,
        date_create = date_create.split(" "),
        date_create = date_create[0],
        date_create = thes.dateMysqlToJsDate(date_create),
        year_create = date_create.getFullYear(),
        month_create = date_create.getMonth(),
        linea_produccion = (viewGlobal != "homeCOSTO") ? dataIndex.linea_produccion : '',
        fecha_evento = (viewGlobal != "homeCOSTO") ? dataIndex.fecha_evento : '',
        month = (viewGlobal != "homeCOSTO") ? thes.dateMysqlToJsDate(fecha_evento) : '',
        month = (viewGlobal != "homeCOSTO") ? month.getMonth() : '',
        view,
        diametro;

        if(viewGlobal == "homePRO"){
          if(dataIndex.type == "PRO"){
            view = 'okr3-1-LP';
          } else {
            view = 'okr3-2-LP';
          }
        } else if(viewGlobal == "homeCALIDAD"){
          view = 'okr3-2-LP';
        } else if (viewGlobal == "homeCOSTO"){
          if(dataIndex.type == "TRF"){
            view = 'okr5-1-D';
            diametro = dataIndex.diametro;
          } else {
            view = 'okr5-2';
          }
          
        }

        if(viewGlobal == "homeCOSTO"){
          if(dataIndex.type == "TRF"){
            thes.getRouter().navTo(view, {
              diametro: diametro,
              year: year_create,
              month: month_create
            });
          } else {
            thes.getRouter().navTo(view, {
              year: year_create
            });
          }
        } else {
          thes.getRouter().navTo(view, {
            linea_produccion: linea_produccion,
            month: month
          });
        }
      },
      onSearchPA: function(oEvent){
        var thes = this;

        var aFilters = [];
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
          var filter = new Filter("activity", sap.ui.model.FilterOperator.Contains, sQuery);
          aFilters.push(filter);
        }

        var oList = thes.byId("TablePA");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },
      onSearchPASIMA: function(oEvent){
        var thes = this;

        var aFilters = [];
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
          var filter = new Filter("activity", sap.ui.model.FilterOperator.Contains, sQuery);
          aFilters.push(filter);
        }

        var oList = thes.byId("TablePASIMA");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },
      setMsg: function(){
        var thes = this; 
        var msg = thes.byId('msgStrip');
        if(sessionStorage.user && sessionStorage.name && sessionStorage.role){
          var name = sessionStorage.name;
          var text = 'Bienvenid@ ' + name + ' has ingresado con éxito!' 
          msg.setVisible(true);
          msg.setText(text);
          setTimeout(
            function() {
              msg.setVisible(false);
            }, 5000);
        } else {
          msg.setVisible(false);
        }
      },
      getSemaforoSIG: function(){
        var thes = this,
        lastValue,
        valueColor = 'Neutral';

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
              
              if(lastValue >= 85){
                valueColor = 'Good';
              } else if(lastValue < 85 && lastValue >= 65){
                valueColor = 'Critical'; 
              } else if(lastValue < 65){
                valueColor = 'Error';
              } else {
                valueColor = 'Neutral';
              }
            },
            error: function(xhr, ajaxOptions, thrownError){
              alert(xhr.status);
              alert(thrownError);
            }
        });

        return valueColor;
      },
      setSemaforoCalidadKPIN1: function(linea_produccion){
        var thes = this,
        parametros = {
          '_LineaProduccion': linea_produccion
        },
        status;

        $.ajax({
          data: parametros,
          url:   'model/CALIDAD/SetSemaforoKpiN1.php', 
          type:  'POST',
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
      setSemaforoCalidadKPIN2: function(linea_produccion){
        var thes = this,
        parametros = {
          '_LineaProduccion': linea_produccion
        },
        status;

        $.ajax({
          data: parametros,
          url:   'model/CALIDAD/SetSemaforoKpiN2.php', 
          type:  'POST',
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
      setSemaforoProduccionKPIN1: function(linea_produccion){
        var thes = this,
        parametros = {
          '_LineaProduccion': linea_produccion
        },
        status;

        $.ajax({
          data: parametros,
          url:   'model/PRO/SetSemaforoKpiN1.php', 
          type:  'post',
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
      setSemaforoProduccionKPIN2: function(linea_produccion){
        var thes = this,
        parametros = {
          '_LineaProduccion': linea_produccion
        },
        status;

        $.ajax({
          data: parametros,
          url:   'model/PRO/SetSemaforoKpiN2.php', 
          type:  'post',
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
      getDataSemaforoN2: function(linea_produccion){
        var thes = this,
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        parametros = {
          '_Year': year,
          '_Month': month,
          '_Linea': linea_produccion
        }, 
        tonelajeObs = 0,
        tonelajeProd = 0,
        value = 0;

        $.ajax({
          data: parametros,
          url: 'model/CALIDAD/GenerarChartN2.php',
          type: 'POST',
          async: false,
          beforeSend: function(){
          },
          success: function(response){
            response = JSON.parse(response);
            if(Array.isArray(response)){
              if(response.length != 0){
                for (let index = 0; index < response.length; index++) {
                  tonelajeObs += Number(response[index].bola_observada);
                  tonelajeProd += Number(response[index].produccion_neta);                  
                }
                value = tonelajeObs / (tonelajeObs + tonelajeProd);
                value = Math.round(value);
                value = (value <= 1.5) ? 1 : 0;
              }
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });

        return value;
      }
   });
});
