jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 "sap/ui/app01/assets/libs/moment",
 'jquery.sap.global',
 'sap/ui/model/json/JSONModel',
 "sap/m/MessageToast",
 'sap/m/Label',
 'sap/m/Popover',
 "sap/ui/core/format/DateFormat",
 'sap/ui/core/Fragment',
 'sap/base/Log'
 ], function (BaseController, momentjs, jQuery, JSONModel, MessageToast, Label, Popover, DateFormat, Fragment, Log) {
   "use strict";
   
   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-5", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr3-5").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.cargarPersonal(2);
      thes.cargarPersonal(3);
      thes.cargarPersonal(4);
      thes.cargarPersonal(5);
      thes.getRotacionGrupos();  
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeMANAGE");
      thes.onExit();
      thes.onExitSecond();
      thes.onExitThird();
      thes.onExitFour();
      thes.onExitFive();
    },
    cargarPersonal: function(type){
      var thes = this,
      parametros = {
        '_type': type
      };

      $.ajax({
        data: parametros,
        url:   'model/OTHERS/ListarPersonalSecond.php', 
        type:  'post',
        dataType: 'json',
        async: false,
        beforeSend: function () {
        },
        success:  function (response) {
          var oModel = new sap.ui.model.json.JSONModel(response);
          if(type == 2){
            thes.byId("TableGrupoA").setModel(oModel);
          } else if(type == 3){
            thes.byId("TableGrupoB").setModel(oModel);
          } else if(type == 4){
            thes.byId("TableGrupoC").setModel(oModel);
          } else if(type == 5){
            thes.byId("TableGrupoR").setModel(oModel);
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },

    onExit: function(){
      if (this._oNewAppointmentDialog){
        this._oNewAppointmentDialog.destroy();
        this._oNewAppointmentDialog = null;
      }
      if (this._oDetailsPopover){
        this._oDetailsPopover.destroy();
        this._oDetailsPopover = null;
      }
    },

    onExitSecond: function(){
      if (this._oNewAppointmentDialogSecond){
        this._oNewAppointmentDialogSecond.destroy();
        this._oNewAppointmentDialogSecond = null;
      }
      if (this._oDetailsPopover){
        this._oDetailsPopover.destroy();
        this._oDetailsPopover = null;
      }
    },

    onExitThird: function(){
      if (this._oNewAppointmentDialogThird){
        this._oNewAppointmentDialogThird.destroy();
        this._oNewAppointmentDialogThird = null;
      }
      if (this._oDetailsPopover){
        this._oDetailsPopover.destroy();
        this._oDetailsPopover = null;
      }
    },

    onExitFour: function(){
      if (this._oNewAppointmentDialogFour){
        this._oNewAppointmentDialogFour.destroy();
        this._oNewAppointmentDialogFour = null;
      }
      if (this._oDetailsPopover){
        this._oDetailsPopover.destroy();
        this._oDetailsPopover = null;
      }
    },

    onExitFive: function(){
      if (this._oNewAppointmentDialogFive){
        this._oNewAppointmentDialogFive.destroy();
        this._oNewAppointmentDialogFive = null;
      }
      if (this._oDetailsPopover){
        this._oDetailsPopover.destroy();
        this._oDetailsPopover = null;
      }
    },

    _aDialogTypes: [
      { title: "Crear Nota", type: "create_appointment" },
      { title: "Crear Backup", type: "create_backup" },
      { title: "Create Appointment", type: "create_appointment_with_context"},
      { title: "Edit Appointment", type: "edit_appointment" },
      { title: "Copiar Rotación de Grupos", type: "copy_appointment" }],

    handleAppointmentSelect: function (oEvent) {
      var oAppointment = oEvent.getParameter("appointment");

      if (oAppointment) {
        this._handleSingleAppointment(oAppointment);
      } else {
        this._handleGroupAppointments(oEvent);
      }
    },

    _addNewAppointment: function(oAppointment){
      var thes = this;
      var oModel = this.getView().getModel(),
        sPath = "/people/0",
        oPersonAppointments;

      /*if (Fragment.byId("dialogFrag","isIntervalAppointment").getSelected()){
        sPath += "/headers";
      } else {
        sPath += "/appointments";
      }*/

      sPath += "/appointments";

      oPersonAppointments = oModel.getProperty(sPath);

      oPersonAppointments.push(oAppointment);

      oModel.setProperty(sPath, oPersonAppointments);

      var newAppointment = { ...oAppointment };

      newAppointment['start'] = newAppointment['start'].toLocaleString();
      newAppointment['end'] = newAppointment['end'].toLocaleString();

      console.log(newAppointment);

      thes.saveTTProduccion(newAppointment);
    },
    _addNewAppointmentSecond: function(oAppointment){
      var thes = this;
      var oModel = this.getView().getModel(),
        sPath = "/peopleSecond/0",
        oPersonAppointments;

      sPath += "/appointments";

      oPersonAppointments = oModel.getProperty(sPath);

      oPersonAppointments.push(oAppointment);

      oModel.setProperty(sPath, oPersonAppointments);

      var newAppointment = { ...oAppointment };

      newAppointment['start'] = newAppointment['start'].toLocaleString();
      newAppointment['end'] = newAppointment['end'].toLocaleString();

      thes.saveTTMecatronico(newAppointment);
    },
    _addNewAppointmentThird: function(oAppointment){
      var thes = this;
      var oModel = this.getView().getModel(),
        sPath = "/peopleThird/0",
        oPersonAppointments;

      sPath += "/appointments";

      oPersonAppointments = oModel.getProperty(sPath);

      oPersonAppointments.push(oAppointment);

      oModel.setProperty(sPath, oPersonAppointments);

      var newAppointment = { ...oAppointment };

      newAppointment['start'] = newAppointment['start'].toLocaleString();
      newAppointment['end'] = newAppointment['end'].toLocaleString();

      thes.saveTTMecanico(newAppointment);
    },
    _addNewAppointmentFour: function(oAppointment){
      var thes = this;
      var oModel = this.getView().getModel(),
        sPath = "/peopleThird/0",
        oPersonAppointments;

      sPath += "/appointments";

      oPersonAppointments = oModel.getProperty(sPath);

      oPersonAppointments.push(oAppointment);

      oModel.setProperty(sPath, oPersonAppointments);

      var newAppointment = { ...oAppointment };

      newAppointment['start'] = newAppointment['start'].toLocaleString();
      newAppointment['end'] = newAppointment['end'].toLocaleString();

      thes.saveTTMecanicoBackup(newAppointment);
    },
    handleCancelButton: function () {
      this._oDetailsPopover.close();
    },

    handleAppointmentCreate: function () {
      this._arrangeDialogFragment(this._aDialogTypes[0].type);
    },

    handleAppointmentCreateSecond: function () {
      this._arrangeDialogFragmentSecond(this._aDialogTypes[0].type);
    },

    handleAppointmentCreateThird: function () {
      this._arrangeDialogFragmentThird(this._aDialogTypes[0].type);
    },

    handleAppointmentCreateBackup: function () {
      this._arrangeDialogFragmentFour(this._aDialogTypes[1].type);
    },

    handleAppointmentAddWithContext: function (oEvent) {
      this.oClickEventParameters = oEvent.getParameters();
      this._arrangeDialogFragment(this._aDialogTypes[1].type);
    },

    handleAppointmentCopy: function () {
      this._arrangeDialogFragmentFive(this._aDialogTypes[4].type);
    },

    _validateDateTimePicker: function (oDateTimePickerStart, oDateTimePickerEnd) {
      var oStartDate = oDateTimePickerStart.getDateValue(),
        oEndDate = oDateTimePickerEnd.getDateValue(),
        sValueStateText = "Start date should be before End date";

      if (oStartDate && oEndDate && oEndDate.getTime() <= oStartDate.getTime()) {
        oDateTimePickerStart.setValueState("Error");
        oDateTimePickerEnd.setValueState("Error");
        oDateTimePickerStart.setValueStateText(sValueStateText);
        oDateTimePickerEnd.setValueStateText(sValueStateText);
      } else {
        oDateTimePickerStart.setValueState("None");
        oDateTimePickerEnd.setValueState("None");
      }
    },

    updateButtonEnabledState: function () {
      var oFecha = Fragment.byId("dialogFrag", "datepickerFecha"),
        oTurno = Fragment.byId("dialogFrag", "selectTurno"),
        oGrupo = Fragment.byId("dialogFrag", "multiboxGrupo"),
        oValueFecha = oFecha.getDateValue(),
        oSelectedKeyTurno = oTurno.getSelectedKey(),
        oSelectedKeyGrupo = oGrupo.getSelectedKeys();

        if(oValueFecha == null || oSelectedKeyTurno == '' || oSelectedKeyGrupo.length == 0){
          this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
        }  else {
          this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
        }
    },
    updateButtonEnabledStateSecond: function () {
      var oFecha = Fragment.byId("dialogFragSecond", "datepickerFechaSecond"),
        oTurno = Fragment.byId("dialogFragSecond", "selectTurnoSecond"),
        oGrupo = Fragment.byId("dialogFragSecond", "multiboxGrupoSecond"),
        oValueFecha = oFecha.getDateValue(),
        oSelectedKeyTurno = oTurno.getSelectedKey(),
        oSelectedKeyGrupo = oGrupo.getSelectedKeys();

        if(oValueFecha == null || oSelectedKeyTurno == '' || oSelectedKeyGrupo.length == 0){
          this._oNewAppointmentDialogSecond.getBeginButton().setEnabled(false);
        }  else {
          this._oNewAppointmentDialogSecond.getBeginButton().setEnabled(true);
        }
    },
    updateButtonEnabledStateThird: function () {
      var oFecha = Fragment.byId("dialogFragThird", "datepickerFechaThird"),
        oTurno = Fragment.byId("dialogFragThird", "selectTurnoThird"),
        oGrupo = Fragment.byId("dialogFragThird", "multiboxGrupoThird"),
        oValueFecha = oFecha.getDateValue(),
        oSelectedKeyTurno = oTurno.getSelectedKey(),
        oSelectedKeyGrupo = oGrupo.getSelectedKeys();

        if(oValueFecha == null || oSelectedKeyTurno == '' || oSelectedKeyGrupo.length == 0){
          this._oNewAppointmentDialogThird.getBeginButton().setEnabled(false);
        }  else {
          this._oNewAppointmentDialogThird.getBeginButton().setEnabled(true);
        }
    },
    updateButtonEnabledStateFour: function () {
      var oFecha = Fragment.byId("dialogFragFour", "datepickerFechaFour"),
        oMecanico = Fragment.byId("dialogFragFour", "selectMecanicoFour"),
        oValueFecha = oFecha.getDateValue(),
        oSelectedKeyMecanico = oMecanico.getSelectedKey();

        if(oValueFecha == null || oSelectedKeyMecanico.length == ''){
          this._oNewAppointmentDialogFour.getBeginButton().setEnabled(false);
        }  else {
          this._oNewAppointmentDialogFour.getBeginButton().setEnabled(true);
        }
    },
    updateButtonEnabledStateFive: function () {
      var oFecha = Fragment.byId("dialogFragFive", "datepickerFechaFive"),
        oTurno = Fragment.byId("dialogFragFive", "multiboxTurnoFive"),
        oValueFecha = oFecha.getDateValue(),
        oKeysTurno = oTurno.getSelectedKeys();

        if(oValueFecha == null || oKeysTurno.length == 0){
          this._oNewAppointmentDialogFive.getBeginButton().setEnabled(false);
        }  else {
          this._oNewAppointmentDialogFive.getBeginButton().setEnabled(true);
        }
    },
    handleCreateChange: function (oEvent) {
      var oDateTimePickerStart = Fragment.byId("dialogFrag", "startDate"),
        oDateTimePickerEnd = Fragment.byId("dialogFrag", "endDate");

      if (oEvent.getParameter("valid")) {
        this._validateDateTimePicker(oDateTimePickerStart, oDateTimePickerEnd);
      } else {
        oEvent.getSource().setValueState("Error");
      }

      this.updateButtonEnabledState();
    },

    _removeAppointment: function(oAppointment, sPersonId){
      var oModel = this.getView().getModel(),
        sTempPath,
        aPersonAppointments,
        iIndexForRemoval;

      if (!sPersonId){
        sTempPath = this.sPath.slice(0,this.sPath.indexOf("appointments/") + "appointments/".length);
      } else {
        sTempPath = "/people/" + sPersonId + "/appointments";
      }

      aPersonAppointments = oModel.getProperty(sTempPath);
      iIndexForRemoval = aPersonAppointments.indexOf(oAppointment);

      if (iIndexForRemoval !== -1){
        aPersonAppointments.splice(iIndexForRemoval, 1);
      }

      oModel.setProperty(sTempPath, aPersonAppointments);
    },

    handleDeleteAppointment: function(){
      var oBindingContext = this._oDetailsPopover.getBindingContext(),
        oAppointment = oBindingContext.getObject(),
        iPersonIdStartIndex = oBindingContext.getPath().indexOf("/people/") + "/people/".length,
        iPersonId = oBindingContext.getPath()[iPersonIdStartIndex];

      this._removeAppointment(oAppointment, iPersonId);
      this._oDetailsPopover.close();
    },

    handleEditButton: function(){
      this._oDetailsPopover.close();
      this.sPath = this._oDetailsPopover.getBindingContext().getPath();

      this._arrangeDialogFragment(this._aDialogTypes[2].type);
    },

    _arrangeDialogFragment: function (iDialogType) {
      if (!this._oNewAppointmentDialog) {
        Fragment.load({
          id: "dialogFrag",
          name: "sap.ui.app01.view.Fragments.CreateTTP",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialog = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialog);
            this._arrangeDialog(iDialogType);
          }.bind(this));
      } else {
        this._arrangeDialog(iDialogType);
      }
    },

    _arrangeDialogFragmentSecond: function (iDialogType) {
      if (!this._oNewAppointmentDialogSecond) {
        Fragment.load({
          id: "dialogFragSecond",
          name: "sap.ui.app01.view.Fragments.CreateTTMecatronico",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialogSecond = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialogSecond);
            this._arrangeDialogSecond(iDialogType);
          }.bind(this));
      } else {
        this._arrangeDialogSecond(iDialogType);
      }
    },

    _arrangeDialogFragmentThird: function (iDialogType) {
      if (!this._oNewAppointmentDialogThird) {
        Fragment.load({
          id: "dialogFragThird",
          name: "sap.ui.app01.view.Fragments.CreateTTMecanico",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialogThird = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialogThird);
            this._arrangeDialogThird(iDialogType);
          }.bind(this));
      } else {
        this._arrangeDialogThird(iDialogType);
      }
    },

    _arrangeDialogFragmentFour: function (iDialogType) {
      if (!this._oNewAppointmentDialogFour) {
        Fragment.load({
          id: "dialogFragFour",
          name: "sap.ui.app01.view.Fragments.CreateBackupMecanico",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialogFour = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialogFour);
            this._arrangeDialogFour(iDialogType);
          }.bind(this));
      } else {
        this._arrangeDialogFour(iDialogType);
      }
    },

    _arrangeDialogFragmentFive: function (iDialogType) {
      if (!this._oNewAppointmentDialogFive) {
        Fragment.load({
          id: "dialogFragFive",
          name: "sap.ui.app01.view.Fragments.CopyTTProduccion",
          controller: this
        }).then(function(oDialog){
            this._oNewAppointmentDialogFive = oDialog;
            this.getView().addDependent(this._oNewAppointmentDialogFive);
            this._arrangeDialogFive(iDialogType);
          }.bind(this));
      } else {
        this._arrangeDialogFive(iDialogType);
      }
    },

    _arrangeDialog: function(sDialogType) {
      var sTempTitle = "";
      this._oNewAppointmentDialog._sDialogType = sDialogType;
      if (sDialogType === "edit_appointment"){
        this._setEditAppointmentDialogContent();
        sTempTitle = this._aDialogTypes[2].title;
      } else if (sDialogType === "create_appointment_with_context"){
        this._setCreateWithContextAppointmentDialogContent();
        sTempTitle = this._aDialogTypes[1].title;
      } else if (sDialogType === "create_appointment"){
        this._setCreateAppointmentDialogContent();
        sTempTitle = this._aDialogTypes[0].title;
      } else {
        Log.error("Wrong dialog type.");
      }

      this._oNewAppointmentDialog.setTitle(sTempTitle);
      this._oNewAppointmentDialog.open();
    },

    _arrangeDialogSecond: function(sDialogType) {
      var sTempTitle = "";
      this._oNewAppointmentDialogSecond._sDialogType = sDialogType;
      if (sDialogType === "edit_appointment"){
        this._setEditAppointmentDialogContent();
        sTempTitle = this._aDialogTypes[2].title;
      } else if (sDialogType === "create_appointment_with_context"){
        this._setCreateWithContextAppointmentDialogContent();
        sTempTitle = this._aDialogTypes[1].title;
      } else if (sDialogType === "create_appointment"){
        this._setCreateAppointmentDialogContentSecond();
        sTempTitle = this._aDialogTypes[0].title;
      } else {
        Log.error("Wrong dialog type.");
      }

      this._oNewAppointmentDialogSecond.setTitle(sTempTitle);
      this._oNewAppointmentDialogSecond.open();
    },

    _arrangeDialogThird: function(sDialogType) {
      var sTempTitle = "";
      this._oNewAppointmentDialogThird._sDialogType = sDialogType;
      if (sDialogType === "create_appointment"){
        this._setCreateAppointmentDialogContentThird();
        sTempTitle = this._aDialogTypes[0].title;
      } else {
        Log.error("Wrong dialog type.");
      }

      this._oNewAppointmentDialogThird.setTitle(sTempTitle);
      this._oNewAppointmentDialogThird.open();
    },

    _arrangeDialogFour: function(sDialogType) {
      var sTempTitle = "";
      this._oNewAppointmentDialogFour._sDialogType = sDialogType;
      if (sDialogType === "create_backup"){
        this._setCreateAppointmentDialogContentFour();
        sTempTitle = this._aDialogTypes[1].title;
      } else {
        Log.error("Wrong dialog type.");
      }

      this._oNewAppointmentDialogFour.setTitle(sTempTitle);
      this._oNewAppointmentDialogFour.open();
    },

    _arrangeDialogFive: function(sDialogType) {
      var sTempTitle = "";
      this._oNewAppointmentDialogFive._sDialogType = sDialogType;
      if (sDialogType === "copy_appointment"){
        this._setCreateAppointmentDialogContentFive();
        sTempTitle = this._aDialogTypes[4].title;
      } else {
        Log.error("Wrong dialog type.");
      }

      this._oNewAppointmentDialogFive.setTitle(sTempTitle);
      this._oNewAppointmentDialogFive.open();
    },

    handleAppointmentTypeChange: function(oEvent){
      var sFragName = "dialogFrag",
        oAppointmentType = Fragment.byId(sFragName,"isIntervalAppointment");

      oAppointmentType.setSelected(oEvent.getSource().getSelected());
    },

    handleDialogCancelButton: function(){
      this._oNewAppointmentDialog.close();
    },

    handleDialogCancelButtonSecond: function(){
      this._oNewAppointmentDialogSecond.close();
    },

    handleDialogCancelButtonThird: function(){
      this._oNewAppointmentDialogThird.close();
    },

    handleDialogCancelButtonFour: function(){
      this._oNewAppointmentDialogFour.close();
    },

    handleDialogCancelButtonFive: function(){
      this._oNewAppointmentDialogFive.close();
    },

    _editAppointment: function(oAppointment, bIsIntervalAppointment, iPersonId){
      var sAppointmentPath = this._appointmentOwnerChange(),
        oModel = this.getView().getModel();

      if (bIsIntervalAppointment) {
        this._convertToHeader(oAppointment, iPersonId);
      } else {
        if (this.sPath !== sAppointmentPath) {
          this._addNewAppointment(this._oNewAppointmentDialog.getModel().getProperty(this.sPath));
          this._removeAppointment(this._oNewAppointmentDialog.getModel().getProperty(this.sPath));
        }
        oModel.setProperty(sAppointmentPath + "/title", oAppointment.title);
        oModel.setProperty(sAppointmentPath + "/info", oAppointment.info);
        oModel.setProperty(sAppointmentPath + "/type", oAppointment.type);
        oModel.setProperty(sAppointmentPath + "/start", oAppointment.start);
        oModel.setProperty(sAppointmentPath + "/end", oAppointment.end);
      }
    },

    _convertToHeader: function(oAppointment){
      var sPersonId = Fragment.byId("dialogFrag", "selectLineaProduccion").getSelectedIndex().toString();

      this._removeAppointment(this._oNewAppointmentDialog.getModel().getProperty(this.sPath), sPersonId);
      this._addNewAppointment({start: oAppointment.start, end: oAppointment.end, title: oAppointment.title, type: oAppointment.type});
    },

    handleDialogSaveButton: function(){
      var oFecha = Fragment.byId('dialogFrag', 'datepickerFecha'),
        oTurno = Fragment.byId('dialogFrag', 'selectTurno'),
        oGrupo = Fragment.byId('dialogFrag', 'multiboxGrupo'),
        oModel = this.getView().getModel(),
        oNewAppointment;

        if (this.sPath && this._oNewAppointmentDialog._sDialogType === "edit_appointment") {
          this._editAppointment({
            title: sInputTitle,
            info: sInfoValue,
            type: this._oDetailsPopover.getBindingContext().getObject().type,
            start: oStartDate.getDateValue(),
            end: oEndDate.getDateValue()}, bIsIntervalAppointment, iPersonId);
        } else {
          var dataFecha = oFecha.getDateValue(),
          dataTurno = oTurno.getSelectedKey(),
          textTurno = oTurno._getSelectedItemText(), 
          dataGrupo = oGrupo.getSelectedKeys(),
          firstTitle = '',
          secondTitle = dataGrupo.join('/');

          if(dataTurno == 'A'){
            var fromFirstTurno = dataFecha.setHours(8,0,0),
            fromFirstTurno = new Date(fromFirstTurno),
            toFirstTurno = dataFecha.setHours(20,0,0),
            toFirstTurno = new Date(toFirstTurno),
            startDate = fromFirstTurno,
            endDate = toFirstTurno;
            firstTitle = 'Día';
          } else {
            var fromSecondTurno = dataFecha.setHours(20,0,0),
            fromSecondTurno = new Date(fromSecondTurno),
            toSecondTurno = dataFecha.setDate(dataFecha.getDate() + 1),
            toSecondTurno = new Date(toSecondTurno),
            toSecondTurno = toSecondTurno.setHours(8,0,0),
            toSecondTurno = new Date(toSecondTurno),
            startDate = fromSecondTurno,
            endDate = toSecondTurno;
            firstTitle = 'Noche';
          }

          oNewAppointment = {
            title: firstTitle,
            info: secondTitle,
            start: startDate,
            end: endDate,
            turno: dataTurno,
            grupo: secondTitle
          };

          this._addNewAppointment(oNewAppointment);
        }

        oModel.updateBindings();

        this._oNewAppointmentDialog.close();

        oFecha.setValue(null);
        oTurno.setSelectedKey('');
        oGrupo.setSelectedKeys([]);
    },
    handleDialogSaveButtonSecond: function(){
      var oFecha = Fragment.byId('dialogFragSecond', 'datepickerFechaSecond'),
        oTurno = Fragment.byId('dialogFragSecond', 'selectTurnoSecond'),
        oGrupo = Fragment.byId('dialogFragSecond', 'multiboxGrupoSecond'),
        oModel = this.getView().getModel(),
        oNewAppointment;

        if (this.sPath && this._oNewAppointmentDialogSecond._sDialogType === "edit_appointment") {
          this._editAppointment({
            title: sInputTitle,
            info: sInfoValue,
            type: this._oDetailsPopover.getBindingContext().getObject().type,
            start: oStartDate.getDateValue(),
            end: oEndDate.getDateValue()}, bIsIntervalAppointment, iPersonId);
        } else {
          var dataFecha = oFecha.getDateValue(),
          dataTurno = oTurno.getSelectedKey(),
          textTurno = oTurno._getSelectedItemText(), 
          dataGrupo = oGrupo.getSelectedKeys(),
          firstTitle = '',
          secondTitle = dataGrupo.join('/');

          if(dataTurno == 'A'){
            var fromFirstTurno = dataFecha.setHours(8,0,0),
            fromFirstTurno = new Date(fromFirstTurno),
            toFirstTurno = dataFecha.setHours(20,0,0),
            toFirstTurno = new Date(toFirstTurno),
            startDate = fromFirstTurno,
            endDate = toFirstTurno;
            firstTitle = 'Día';
          } else {
            var fromSecondTurno = dataFecha.setHours(20,0,0),
            fromSecondTurno = new Date(fromSecondTurno),
            toSecondTurno = dataFecha.setDate(dataFecha.getDate() + 1),
            toSecondTurno = new Date(toSecondTurno),
            toSecondTurno = toSecondTurno.setHours(8,0,0),
            toSecondTurno = new Date(toSecondTurno),
            startDate = fromSecondTurno,
            endDate = toSecondTurno;
            firstTitle = 'Noche';
          }

          oNewAppointment = {
            title: firstTitle,
            info: secondTitle,
            start: startDate,
            end: endDate,
            turno: dataTurno,
            mecatronico: secondTitle
          };

          this._addNewAppointmentSecond(oNewAppointment);
        }

        oModel.updateBindings();

        this._oNewAppointmentDialogSecond.close();

        oFecha.setValue(null);
        oTurno.setSelectedKey('');
        oGrupo.setSelectedKeys([]);
    },
    handleDialogSaveButtonThird: function(){
      var oFecha = Fragment.byId('dialogFragThird', 'datepickerFechaThird'),
        oTurno = Fragment.byId('dialogFragThird', 'selectTurnoThird'),
        oGrupo = Fragment.byId('dialogFragThird', 'multiboxGrupoThird'),
        oModel = this.getView().getModel(),
        oNewAppointment;

        if (this.sPath && this._oNewAppointmentDialogSecond._sDialogType === "edit_appointment") {
          this._editAppointment({
            title: sInputTitle,
            info: sInfoValue,
            type: this._oDetailsPopover.getBindingContext().getObject().type,
            start: oStartDate.getDateValue(),
            end: oEndDate.getDateValue()}, bIsIntervalAppointment, iPersonId);
        } else {
          var dataFecha = oFecha.getDateValue(),
          dataTurno = oTurno.getSelectedKey(),
          textTurno = oTurno._getSelectedItemText(), 
          dataGrupo = oGrupo.getSelectedKeys(),
          firstTitle = '',
          secondTitle = dataGrupo.join('/');

          if(dataTurno == 'A'){
            var fromFirstTurno = dataFecha.setHours(8,0,0),
            fromFirstTurno = new Date(fromFirstTurno),
            toFirstTurno = dataFecha.setHours(20,0,0),
            toFirstTurno = new Date(toFirstTurno),
            startDate = fromFirstTurno,
            endDate = toFirstTurno;
            firstTitle = 'Día';
          } else {
            var fromSecondTurno = dataFecha.setHours(20,0,0),
            fromSecondTurno = new Date(fromSecondTurno),
            toSecondTurno = dataFecha.setDate(dataFecha.getDate() + 1),
            toSecondTurno = new Date(toSecondTurno),
            toSecondTurno = toSecondTurno.setHours(8,0,0),
            toSecondTurno = new Date(toSecondTurno),
            startDate = fromSecondTurno,
            endDate = toSecondTurno;
            firstTitle = 'Noche';
          }

          oNewAppointment = {
            title: firstTitle,
            info: secondTitle,
            start: startDate,
            end: endDate,
            turno: dataTurno,
            mecanico: secondTitle
          };

          this._addNewAppointmentThird(oNewAppointment);
        }

        oModel.updateBindings();

        this._oNewAppointmentDialogThird.close();

        oFecha.setValue(null);
        oTurno.setSelectedKey('');
        oGrupo.setSelectedKeys([]);
    },
    handleDialogSaveButtonFour: function(){
      var oFecha = Fragment.byId('dialogFragFour', 'datepickerFechaFour'),
        oMecanico = Fragment.byId('dialogFragFour', 'selectMecanicoFour'),
        oModel = this.getView().getModel(),
        oNewAppointment;

        var dataFechaIni = oFecha.getFrom(),
            dataFechaFin = oFecha.getTo(),
          dataMecanico = oMecanico.getSelectedKey(),
          firstTitle = 'Backup',
          secondTitle = dataMecanico;

          dataFechaIni = dataFechaIni.setHours(8,0,0);
          dataFechaIni = new Date(dataFechaIni);

          dataFechaFin = dataFechaFin.setHours(17,15,0);
          dataFechaFin = new Date(dataFechaFin);

          oNewAppointment = {
            title: firstTitle,
            info: secondTitle,
            start: dataFechaIni,
            end: dataFechaFin,
            back_up: secondTitle
          };

        this._addNewAppointmentFour(oNewAppointment);

        oModel.updateBindings();

        this._oNewAppointmentDialogFour.close();

        oFecha.setValue(null);
        oMecanico.setSelectedKey('');
    },
    handleDialogSaveButtonFive: function(){
      var thes = this,
        oFecha = Fragment.byId('dialogFragFive', 'datepickerFechaFive'),
        oTurno = Fragment.byId('dialogFragFive', 'multiboxTurnoFive'),
        oModel = this.getView().getModel(),
        oValueFecha = oFecha.getDateValue(),
        oKeysTurno = oTurno.getSelectedKeys(),
        numberRows = 0;

        console.log(oKeysTurno);

        if(oKeysTurno.length == 1){
          numberRows = thes.evaluateCopyData(oValueFecha, oKeysTurno[0]);
          if(numberRows == 49){
            thes.replicateTTProduccion(oValueFecha, oKeysTurno[0]);
          } else {
            MessageToast.show('Datos Incompletos!');
          }
        } else {
          numberRows = thes.evaluateCopyData(oValueFecha, 'T');
          if(numberRows == 98){
            thes.replicateTTProduccion(oValueFecha, 'A');
            thes.replicateTTProduccion(oValueFecha, 'B');
          } else {
            MessageToast.show('Datos Incompletos!');            
          }
        }

        this._oNewAppointmentDialogFive.close();

        /*var dataFechaIni = oFecha.getFrom(),
            dataFechaFin = oFecha.getTo(),
          dataMecanico = oMecanico.getSelectedKey(),
          firstTitle = 'Backup',
          secondTitle = dataMecanico;

          dataFechaIni = dataFechaIni.setHours(8,0,0);
          dataFechaIni = new Date(dataFechaIni);

          dataFechaFin = dataFechaFin.setHours(17,15,0);
          dataFechaFin = new Date(dataFechaFin);

          oNewAppointment = {
            title: firstTitle,
            info: secondTitle,
            start: dataFechaIni,
            end: dataFechaFin,
            back_up: secondTitle
          };

        this._addNewAppointmentFour(oNewAppointment);

        oModel.updateBindings();

        this._oNewAppointmentDialogFour.close();

        oFecha.setValue(null);
        oMecanico.setSelectedKey('');*/

        thes.onRefresh();

        oFecha.setValue(null);
        oTurno.setSelectedKeys([]);
    },
    _appointmentOwnerChange: function(){
      var iSpathPersonId = this.sPath[this.sPath.indexOf("/people/") + "/people/".length],
        iSelectedPerson = Fragment.byId("dialogFrag", "selectLineaProduccion").getSelectedIndex(),
        sTempPath = this.sPath,
        iLastElementIndex = this._oNewAppointmentDialog.getModel().getProperty("/people/" + iSelectedPerson.toString() + "/appointments/").length.toString();

      if (iSpathPersonId !== iSelectedPerson.toString()){
        sTempPath = "".concat("/people/", iSelectedPerson.toString(), "/appointments/", iLastElementIndex.toString());
      }

      return sTempPath;
    },

    _setCreateAppointmentDialogContent: function(){
      this.updateButtonEnabledState();
    },
    _setCreateAppointmentDialogContentSecond: function(){
      this.updateButtonEnabledStateSecond();
    },
    _setCreateAppointmentDialogContentThird: function(){
      this.updateButtonEnabledStateThird();
    },
    _setCreateAppointmentDialogContentFour: function(){
      this.updateButtonEnabledStateFour();
    },
    _setCreateAppointmentDialogContentFive: function(){
      this.updateButtonEnabledStateFive();
    },
    _setCreateWithContextAppointmentDialogContent: function(){
      var aPeople = this.getView().getModel().getProperty('/people/'),
        oSelectedIntervalStart = this.oClickEventParameters.startDate,
        oStartDate = Fragment.byId("dialogFrag", "startDate"),
        oSelectedIntervalEnd = this.oClickEventParameters.endDate,
        oEndDate = Fragment.byId("dialogFrag", "endDate"),
        oDateTimePickerStart = Fragment.byId("dialogFrag", "startDate"),
        oDateTimePickerEnd =  Fragment.byId("dialogFrag", "endDate"),
        oAppointmentType = Fragment.byId("dialogFrag","isIntervalAppointment"),
        oTitleInput = Fragment.byId("dialogFrag","inputTitle"),
        oMoreInfoInput = Fragment.byId("dialogFrag","moreInfo"),
        sPersonName,
        oPersonSelected;

      if (this.oClickEventParameters.row){
        sPersonName = this.oClickEventParameters.row.getTitle();
        oPersonSelected = Fragment.byId("dialogFrag", "selectLineaProduccion");

        oPersonSelected.setSelectedIndex(aPeople.indexOf(aPeople.filter(function(oPerson){return  oPerson.name === sPersonName;})[0]));

      }

      oStartDate.setDateValue(oSelectedIntervalStart);

      oEndDate.setDateValue(oSelectedIntervalEnd);

      oTitleInput.setValue("");

      oMoreInfoInput.setValue("");

      oAppointmentType.setSelected(false);

      oDateTimePickerStart.setValueState("None");
      oDateTimePickerEnd.setValueState("None");

      this.updateButtonEnabledState();
      delete this.oClickEventParameters;
    },

    _setEditAppointmentDialogContent: function(){
      var oAppointment = this._oNewAppointmentDialog.getModel().getProperty(this.sPath),
        oSelectedIntervalStart = oAppointment.start,
        oSelectedIntervalEnd = oAppointment.end,
        oDateTimePickerStart = Fragment.byId("dialogFrag", "startDate"),
        oDateTimePickerEnd = Fragment.byId("dialogFrag", "endDate"),
        sSelectedInfo = oAppointment.info,
        sSelectedTitle = oAppointment.title,
        iSelectedPersonId = this.sPath[this.sPath.indexOf("/people/") + "/people/".length],
        oPersonSelected = Fragment.byId("dialogFrag", "selectLineaProduccion"),
        oStartDate = Fragment.byId("dialogFrag", "startDate"),
        oEndDate = Fragment.byId("dialogFrag", "endDate"),
        oMoreInfoInput = Fragment.byId("dialogFrag","moreInfo"),
        oTitleInput = Fragment.byId("dialogFrag","inputTitle"),
        oAppointmentType = Fragment.byId("dialogFrag","isIntervalAppointment");

      oPersonSelected.setSelectedIndex(iSelectedPersonId);

      oStartDate.setDateValue(oSelectedIntervalStart);

      oEndDate.setDateValue(oSelectedIntervalEnd);

      oMoreInfoInput.setValue(sSelectedInfo);

      oTitleInput.setValue(sSelectedTitle);

      oDateTimePickerStart.setValueState("None");
      oDateTimePickerEnd.setValueState("None");

      oAppointmentType.setSelected(false);
    },

    _handleSingleAppointment: function (oAppointment) {
      if (oAppointment === undefined) {
        return;
      }

      if (!oAppointment.getSelected()) {
        this._oDetailsPopover.close();
        return;
      }

      if (!this._oDetailsPopover) {


        this._oDetailsPopover = Fragment.load({
          id: "myPopoverFrag",
          name: "sap.ui.app01.view.Fragments.Details",
          controller: this
        }).then(function(oDialog){
          this._oDetailsPopover = oDialog;
          this._setDetailsDialogContent(oAppointment);

        }.bind(this));
      } else {
        this._setDetailsDialogContent(oAppointment);
      }

    },

    _setDetailsDialogContent: function(oAppointment){
      var oTextStart = Fragment.byId("myPopoverFrag", "startDate"),
        oTextEnd = Fragment.byId("myPopoverFrag", "endDate"),
        oAppBindingContext = oAppointment.getBindingContext(),
        oMoreInfo = Fragment.byId("myPopoverFrag", "moreInfo"),
        oDetailsPopover = Fragment.byId("myPopoverFrag","detailsPopover");

      this._oDetailsPopover.setBindingContext(oAppBindingContext);
      this._oDetailsPopover.openBy(oAppointment);

      oTextStart.setText(this.formatDate(oAppointment.getStartDate()));
      oTextEnd.setText(this.formatDate(oAppointment.getEndDate()));
      oMoreInfo.setText(oAppointment.getText());
      oDetailsPopover.setTitle(oAppointment.getTitle());
    },

    formatDate: function (oDate) {
      if (oDate) {
        var iHours = oDate.getHours(),
          iMinutes = oDate.getMinutes(),
          iSeconds = oDate.getSeconds();

        if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
          return DateFormat.getDateTimeInstance({ style: "medium" }).format(oDate);
        } else  {
          return DateFormat.getDateInstance({ style: "medium" }).format(oDate);
        }
      }
    },

    _handleGroupAppointments: function (oEvent) {
      var aAppointments,
        sGroupAppointmentType,
        sGroupPopoverValue,
        sGroupAppDomRefId,
        bTypeDiffer;

      aAppointments = oEvent.getParameter("appointments");
      sGroupAppointmentType = aAppointments[0].getType();
      sGroupAppDomRefId = oEvent.getParameter("domRefId");
      bTypeDiffer = aAppointments.some(function (oAppointment) {
        return sGroupAppointmentType !== oAppointment.getType();
      });

      if (bTypeDiffer) {
        sGroupPopoverValue = aAppointments.length + " Appointments of different types selected";
      } else {
        sGroupPopoverValue = aAppointments.length + " Appointments of the same " + sGroupAppointmentType + " selected";
      }

      if (!this._oGroupPopover) {
        this._oGroupPopover = new Popover({
          title: "Group Appointments",
          content: new Label({
            text: sGroupPopoverValue
          })
        });
      } else {
        this._oGroupPopover.getContent()[0].setText(sGroupPopoverValue);
      }
      this._oGroupPopover.addStyleClass("sapUiPopupWithPadding");
      this._oGroupPopover.openBy(document.getElementById(sGroupAppDomRefId));
    }/*,
    setData: function(){
      var thes = this;
      var dateToday = new Date();
      var oModel = new JSONModel();
        oModel.setData({
          startDate: dateToday,
          people: [{
              pic: "sap-icon://employee",
              name: "Max Mustermann",
              role: "team member",
              appointments: [
                {
                  start: new Date("2019", "0", "15", "08", "30"),
                  end: new Date("2019", "0", "15", "09", "30"),
                  title: "Meet John Miller",
                  type: "Type02",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "15", "10", "0"),
                  end: new Date("2019", "0", "15", "12", "0"),
                  title: "Team meeting",
                  info: "room 1",
                  type: "Type01",
                  pic: "sap-icon://sap-ui5",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "15", "13", "00"),
                  end: new Date("2019", "0", "15", "16", "00"),
                  title: "Discussion with clients",
                  info: "online",
                  type: "Type02",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "16", "0", "0"),
                  end: new Date("2019", "0", "16", "23", "59"),
                  title: "Vacation",
                  info: "out of office",
                  type: "Type08",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "17", "1", "0"),
                  end: new Date("2019", "0", "18", "22", "0"),
                  title: "Workshop",
                  info: "regular",
                  type: "Type08",
                  pic: "sap-icon://sap-ui5",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "19", "08", "30"),
                  end: new Date("2019", "0", "19", "18", "30"),
                  title: "Meet John Doe",
                  type: "Type08",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "19", "10", "0"),
                  end: new Date("2019", "0", "19", "16", "0"),
                  title: "Team meeting",
                  info: "room 1",
                  type: "Type08",
                  pic: "sap-icon://sap-ui5",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "19", "07", "00"),
                  end: new Date("2019", "0", "19", "17", "30"),
                  title: "Discussion with clients",
                  type: "Type08",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "20", "0", "0"),
                  end: new Date("2019", "0", "20", "23", "59"),
                  title: "Vacation",
                  info: "out of office",
                  type: "Type08",
                  tentative: false
                },
                {
                  start: new Date("2019", "0", "22", "07", "00"),
                  end: new Date("2019", "0", "27", "17", "30"),
                  title: "Discussion with clients",
                  info: "out of office",
                  type: "Type08",
                  tentative: false
                },
                {
                  start: new Date("2019", "2", "13", "9", "0"),
                  end: new Date("2019", "2", "17", "10", "0"),
                  title: "Payment week",
                  type: "Type08"
                },
                {
                  start: new Date("2019", "03", "10", "0", "0"),
                  end: new Date("2019", "05", "16", "23", "59"),
                  title: "Vacation",
                  info: "out of office",
                  type: "Type04",
                  tentative: false
                },
                {
                  start: new Date("2019", "07", "1", "0", "0"),
                  end: new Date("2019", "09", "31", "23", "59"),
                  title: "New quarter",
                  type: "Type10",
                  tentative: false
                }
              ]
            }
          ]
        });
        this.getView().setModel(oModel);

    }*/,
    getRotacionGrupos: function(){
      var thes = this;

      $.ajax({
        url: 'model/PRO/ListarTTProduccion.php',
        type: 'GET',
        dataType: 'JSON',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          for (var i = 0; i < response.length; i++) {
            let lengthAppointments = response[i]['appointments'].length;
            for (var x = 0; x < lengthAppointments; x++) {
              let dateAppointmentStart = response[i]['appointments'][x]['start'];
              let dateTimePartsStart = dateAppointmentStart.split(/[- :]/);
              dateTimePartsStart[1]--;
              response[i]['appointments'][x]['start'] = new Date(...dateTimePartsStart);

              let dateAppointmentEnd = response[i]['appointments'][x]['end'];
              let dateTimePartsEnd = dateAppointmentEnd.split(/[- :]/);
              dateTimePartsEnd[1]--;
              response[i]['appointments'][x]['end'] = new Date(...dateTimePartsEnd);
            }
          }
          var dataTurno = thes.getTurno();
          var dataGrupo = thes.getGrupo();
          var dateToday = new Date();
          var dataPeopleSecond = thes.getTTMecatronico();
          var dataPeopleThird = thes.getTTMecanico();
          var dataMecatronico = thes.getTurnoTrabajoByType('01');
          var dataMecanico = thes.getTurnoTrabajoByType('02');
          var newData = {};
          newData['startDate'] = dateToday;
          newData['people'] = response;
          newData['peopleSecond'] = dataPeopleSecond;
          newData['peopleThird'] = dataPeopleThird;
          newData['turno'] = dataTurno;
          newData['grupo'] = dataGrupo;
          newData['mecatronico'] = dataMecatronico;
          newData['mecanico'] = dataMecanico;
          var oModel = new sap.ui.model.json.JSONModel(newData);
          oModel.setSizeLimit(10000); 
          thes.getView().setModel(oModel);
          thes.byId('PC1').setBuiltInViews(["Hour", "Day", "Week", "One Month"]);
          thes.byId('PC2').setBuiltInViews(["Hour", "Day", "Week", "One Month"]);
          thes.byId('PC3').setBuiltInViews(["Hour", "Day", "Week", "One Month"]);
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    getTurno: function(){
      var thes = this;
      var data;
      
      $.ajax({
        url: 'model/SPRO/ListarTurno.php',
        type: 'GET',
        dataType: 'JSON',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          for (var i = 0; i < response.length; i++) {
            let startTime = response[i]['start_time'];
            response[i]['start_time'] = startTime.substring(0, startTime.length-3);
            let endTime = response[i]['end_time'];
            response[i]['end_time'] = endTime.substring(0, endTime.length-3);
          }
          data =  response;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });

      return data;
    },
    getGrupo: function(){
      var thes = this;
      var data;
      
      $.ajax({
        url: 'model/SPRO/ListarGrupo.php',
        type: 'GET',
        dataType: 'JSON',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          data =  response;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });

      return data;
    },
    saveTTProduccion: function(data){

      var thes = this;

      $.ajax({
        data: data,
        url: 'model/PRO/InsertarTTProduccion.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          
        },
        error(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    saveTTMecatronico: function(data){
      var thes = this;
      $.ajax({
        data: data,
        url: 'model/PRO/InsertarTTMecatronico.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          
        },
        error(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    saveTTMecanico: function(data){
      var thes = this;
      $.ajax({
        data: data,
        url: 'model/PRO/InsertarTTMecanico.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          
        },
        error(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    saveTTMecanicoBackup: function(data){
      var thes = this;
      $.ajax({
        data: data,
        url: 'model/PRO/InsertarTTMecanicoBackup.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          
        },
        error(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
    },
    getTTMecatronico: function(){
      var thes = this;
      var data;

      $.ajax({
        url: 'model/PRO/ListarTTMecatronico.php',
        type: 'GET',
        dataType: 'JSON',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          for (var i = 0; i < response.length; i++) {
            let lengthAppointments = response[i]['appointments'].length;
            for (var x = 0; x < lengthAppointments; x++) {
              let dateAppointmentStart = response[i]['appointments'][x]['start'];
              let dateTimePartsStart = dateAppointmentStart.split(/[- :]/);
              dateTimePartsStart[1]--;
              response[i]['appointments'][x]['start'] = new Date(...dateTimePartsStart);

              let dateAppointmentEnd = response[i]['appointments'][x]['end'];
              let dateTimePartsEnd = dateAppointmentEnd.split(/[- :]/);
              dateTimePartsEnd[1]--;
              response[i]['appointments'][x]['end'] = new Date(...dateTimePartsEnd);
            }
          }

          data = response;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });

      return data;
    },
    getTTMecanico: function(){
      var thes = this;
      var data;

      $.ajax({
        url: 'model/PRO/ListarTTMecanico.php',
        type: 'GET',
        dataType: 'JSON',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          for (var i = 0; i < response.length; i++) {
            let lengthAppointments = response[i]['appointments'].length;
            for (var x = 0; x < lengthAppointments; x++) {
              let dateAppointmentStart = response[i]['appointments'][x]['start'];
              let dateTimePartsStart = dateAppointmentStart.split(/[- :]/);
              dateTimePartsStart[1]--;
              response[i]['appointments'][x]['start'] = new Date(...dateTimePartsStart);

              let dateAppointmentEnd = response[i]['appointments'][x]['end'];
              let dateTimePartsEnd = dateAppointmentEnd.split(/[- :]/);
              dateTimePartsEnd[1]--;
              response[i]['appointments'][x]['end'] = new Date(...dateTimePartsEnd);
            }
          }

          data = response;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });

      return data;
    },
    getTurnoTrabajoByType: function(type){
      var parametros = {
        '_type': type
      };

      var data;

      $.ajax({
        data: parametros,
        url: 'model/PRO/ListarTurnoTrabajoByTipo.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          data = response;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }

      });

      return data;

    },
    onRefresh: function(oEvent){
      var thes = this;
      thes.getRotacionGrupos();
    },
    evaluateCopyData: function(date, turno){
      var thes = this;
      var sumDays = thes.addDays(date, 48),
      numberRows;
      date = date.getUTCFullYear() + '-' +
      thes.pad(date.getUTCMonth() + 1) + '-' +
      thes.pad(date.getUTCDate());
      sumDays = sumDays.getUTCFullYear() + '-' +
      thes.pad(sumDays.getUTCMonth() + 1) + '-' +
      thes.pad(sumDays.getUTCDate());
      var parametros = {
        '_FirstDate': date,
        '_SecondDate': sumDays,
        '_Turno': turno
      };

      $.ajax({
        data: parametros,
        url: 'model/PRO/EvaluarTTProduccionCopiar.php',
        type: 'post',
        async: false,
        beforeSend: function(){},
        success: function(response){
          numberRows = response;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(alert.status);
          alert(thrownError);
        }
      });

      return numberRows;
    },
    replicateTTProduccion: function(date, turno){
      var thes = this;
      var sumDays = thes.addDays(date, 48);
      date = date.getUTCFullYear() + '-' +
      thes.pad(date.getUTCMonth() + 1) + '-' +
      thes.pad(date.getUTCDate());
      sumDays = sumDays.getUTCFullYear() + '-' +
      thes.pad(sumDays.getUTCMonth() + 1) + '-' +
      thes.pad(sumDays.getUTCDate());
      var parametros = {
        '_FirstDate': date,
        '_SecondDate': sumDays,
        '_Turno': turno
      };

      $.ajax({
        data: parametros,
        url: 'model/PRO/InsertarReplicaTTProduccion.php',
        type: 'post',
        async: false,
        beforeSend: function(){},
        success: function(response){
          
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(alert.status);
          alert(thrownError);
        }
      });
    }
  });
 });