jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
 "sap/ui/app01/controller/BaseController",
 'sap/m/Label',
 'sap/m/Popover',
 "sap/ui/core/format/DateFormat",
 'sap/ui/core/Fragment',
 'sap/base/Log'
 ], function (BaseController, Label, Popover, DateFormat, Fragment, Log) {
   "use strict";

   var firstTurnoTM,
   secondTurnoTM;
   
   return BaseController.extend("sap.ui.app01.controller.OKR3.OKR3-4", {

    onInit: function(oEvent){
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("okr3-4").attachPatternMatched(this._onObjectMatched, this);      
    },
    _onObjectMatched: function(oEvent) {
      var thes = this;
      thes.getProgramaProduccion();  
    },
    onNavBack: function(oEvent) {
      var thes = this;
      thes.getRouter().navTo("homeMANAGE");
      thes.onExit();
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

    _aDialogTypes: [
      { title: "Crear Nota", type: "create_appointment" },
      { title: "Create Appointment", type: "create_appointment_with_context"},
      { title: "Edit Appointment", type: "edit_appointment" }],

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
        sPath = "/people/" + Fragment.byId("dialogFrag", "selectLineaProduccion").getSelectedIndex().toString(),
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

      thes.saveProgramaProduccion(newAppointment);
    },

    handleCancelButton: function () {
      this._oDetailsPopover.close();
    },

    handleAppointmentCreate: function () {
      this._arrangeDialogFragment(this._aDialogTypes[0].type);
    },

    /*handleAppointmentAddWithContext: function (oEvent) {
      this.oClickEventParameters = oEvent.getParameters();
      this._arrangeDialogFragment(this._aDialogTypes[1].type);
    },*/

    _validateDateTimePicker: function (oDateTimePickerStart, oDateTimePickerEnd) {
      var oStartDate = oDateTimePickerStart.getDateValue(),
        oEndDate = oDateTimePickerEnd.getDateValue(),
        sValueStateText = "La fecha de inicio debe ser menor a la fecha fin!";

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

    updateButtonEnabledState: function (oEvent) {
      var thes = this;
      var oLineaProduccion = Fragment.byId("dialogFrag", "selectLineaProduccion"),
        oFecha = Fragment.byId("dialogFrag", "datepickerFecha"),
        oTurno = Fragment.byId("dialogFrag", "selectTurno"),
        oOption = Fragment.byId("dialogFrag", "selectOption"),
        oMultiboxTurno = Fragment.byId("dialogFrag", "multiboxTurno"),
        oDiametroBola = Fragment.byId("dialogFrag", "selectBall"),
        oTM = Fragment.byId("dialogFrag", "inputTM"),
        oDatetimeStart = Fragment.byId("dialogFrag", "startDate"),
        oDatetimeEnd = Fragment.byId("dialogFrag", "endDate"),
        oTipo = Fragment.byId("dialogFrag", "selectTipo"),
        oSelectedKeyLP = oLineaProduccion.getSelectedKey(),
        oValueFecha = oFecha.getDateValue(),
        oSelectedKeyTurno = oTurno.getSelectedKey(),
        oSelectedKeyOption = oOption.getSelectedKey(),
        oSelectedMultiboxTurno = oMultiboxTurno.getSelectedItems(),
        oSelectedKeyDM = oDiametroBola.getSelectedKey(),
        oValueTM = oTM.getValue(),
        oValueDatetimeStart = oDatetimeStart.getDateValue(),
        oValueDatetimeEnd = oDatetimeEnd.getDateValue(),
        oSelectedKeyTipo = oTipo.getSelectedKey(),
        meta;

        if(oSelectedKeyLP != ''){
          thes.changeLineaProduccion();
          if(oSelectedKeyLP != '' && oSelectedKeyOption != ''){
            if(oSelectedKeyOption == 'Φ' && oValueFecha != null && oSelectedKeyDM != ''){
              meta = thes.getMetaByDiametro(oSelectedKeyDM, oSelectedKeyLP);
              meta = meta * 24;
              meta = parseFloat(meta).toFixed(2);
              oTM.setValue(meta);
              this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
            } /*else if(oSelectedKeyOption == 'PP' && oSelectedMultiboxTurno.length > 0){
              if(oSelectedMultiboxTurno.length == 1 && oValueFecha != null){
                sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(true);
                sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(true);
                if(oSelectedKeyDM != ''){
                  meta = thes.getMetaByDiametro(oSelectedKeyDM, oSelectedKeyLP);
                  meta = meta * 12;
                  meta = parseFloat(meta).toFixed(2);
                  oTM.setValue(meta);
                  this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
                } else {
                  this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                }
              } else if(oSelectedMultiboxTurno.length == 2 && oValueFecha != null) {
                sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(false);
                sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(false);
                this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
              }
            } */ else if(oSelectedKeyOption == 'PP'){
              if(oSelectedKeyOption == 'PP' && oSelectedKeyTipo == 1){
                  sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(true);
                  sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(true);
                  sap.ui.core.Fragment.byId('dialogFrag', 'lblTM').setVisible(true);
                  sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setVisible(true);
                  sap.ui.core.Fragment.byId('dialogFrag', 'lblStartDate').setVisible(true);
                  sap.ui.core.Fragment.byId('dialogFrag', 'startDate').setVisible(true);
                  sap.ui.core.Fragment.byId('dialogFrag', 'lblEndDate').setVisible(true);
                  sap.ui.core.Fragment.byId('dialogFrag', 'endDate').setVisible(true);
                if(oSelectedKeyOption == 'PP' && oSelectedKeyTipo == 1 && oSelectedKeyTurno != ''){
                  if(oValueDatetimeStart != null && oValueDatetimeEnd != null && oDatetimeStart.getValueState() != 'Error' && oDatetimeEnd.getValueState() != 'Error'){
  
                    oValueDatetimeStart.setSeconds(0,0);
                    oValueDatetimeEnd.setSeconds(0,0);
      
                    if(oSelectedKeyDM != ''){
                      var diffTurnoMinutes,
                      secondDiffTurnoMinutes,
                      hoursMinutes,
                      secondHoursMinutes,
                      dateBegin,
                      dateEnd,
                      dateBeginMoment,
                      dateEndMoment,
                      hoursStart,
                      minutesStart,
                      hoursEnd,
                      minutesEnd,
                      beginTurno,
                      endTurno;
      
                      hoursStart = oValueDatetimeStart.getHours();
                      minutesStart = oValueDatetimeStart.getMinutes();
                      hoursEnd = oValueDatetimeEnd.getHours();
                      minutesEnd = oValueDatetimeEnd.getMinutes();
      
                      dateEnd = new Date(oValueDatetimeEnd.getTime());  
                      dateEndMoment = moment(dateEnd);
                      dateBegin = new Date(oValueDatetimeStart.getTime());
                      dateBeginMoment = moment(dateBegin);
      
                      if(oSelectedKeyTurno == 'A'){  
                        endTurno = new Date(oValueDatetimeStart.getTime());
                        endTurno = endTurno.setHours(20,0,0);
                        endTurno = moment(endTurno);
                        beginTurno = new Date(oValueDatetimeStart.getTime());
                        beginTurno = beginTurno.setHours(8,0,0);
                        beginTurno = moment(beginTurno);
      
                        diffTurnoMinutes = endTurno.diff(dateEndMoment, 'minutes'); // Diff in hours
                        hoursMinutes = diffTurnoMinutes/60;
                        
                        if((hoursStart == 8 && minutesStart != 0) || (hoursStart >= 8 && minutesStart != 0)){
                          secondDiffTurnoMinutes = dateBeginMoment.diff(beginTurno, 'minutes');
                          secondHoursMinutes = secondDiffTurnoMinutes/60;
                          hoursMinutes = hoursMinutes + secondHoursMinutes;                    
                        }
      
                        firstTurnoTM = hoursMinutes;
                        secondTurnoTM = 12;
                        hoursMinutes = hoursMinutes + 12;
                      } else {
                        beginTurno = new Date(oValueDatetimeStart.getTime());
                        beginTurno = beginTurno.setHours(20,0,0);
                        beginTurno = moment(beginTurno);
                        let compareDates = thes.validateSameDay(oValueDatetimeStart, oValueDatetimeEnd);
                        if(compareDates){
                          let addingOneDay =  new Date(oValueDatetimeEnd);
                          addingOneDay = addingOneDay.setDate(addingOneDay.getDate() + 1);
                          addingOneDay = new Date(addingOneDay);
                          endTurno = addingOneDay.setHours(8,0,0);
                          endTurno = moment(endTurno);
                        } else {
                          endTurno = new Date(oValueDatetimeEnd);
                          endTurno = endTurno.setHours(8,0,0);
                          endTurno = moment(endTurno);
                        }
      
                        diffTurnoMinutes = endTurno.diff(dateEndMoment, 'minutes'); // Diff in hours
                        hoursMinutes = diffTurnoMinutes/60;
      
                        if((hoursStart == 20 && minutesStart != 0) || (hoursStart >= 20 && minutesStart != 0)){
                          secondDiffTurnoMinutes = dateBeginMoment.diff(beginTurno, 'minutes');
                          secondHoursMinutes = secondDiffTurnoMinutes/60;
                          hoursMinutes = hoursMinutes + secondHoursMinutes; 
                        }
      
                        firstTurnoTM = 12;
                        secondTurnoTM = hoursMinutes;
                        hoursMinutes = hoursMinutes + 12;
                      }
      
                        meta = thes.getMetaByDiametro(oSelectedKeyDM, oSelectedKeyLP);
                        firstTurnoTM = firstTurnoTM * meta;
                        firstTurnoTM = parseFloat(firstTurnoTM).toFixed(2);
                        secondTurnoTM = secondTurnoTM * meta;
                        secondTurnoTM = parseFloat(secondTurnoTM).toFixed(2);
                        meta = hoursMinutes * meta;
                        meta = parseFloat(meta).toFixed(2);
                        oTM.setValue(meta);

                        console.log(firstTurnoTM);
                        console.log(secondTurnoTM);
                        console.log(meta);
      
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
      
                    } else {
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                    }
                  } else {
                    this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                  }
                } else {
                  this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                }
              } else if(oSelectedKeyOption == 'PP' && oSelectedKeyTipo == 2){
                if(oSelectedKeyOption == 'PP' && oSelectedKeyTipo == 2 && oSelectedMultiboxTurno.length > 0){
                  if(oSelectedMultiboxTurno.length == 1 && oValueFecha != null){
                    sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(true);
                    sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(true);
                    if(oSelectedKeyDM != ''){
                      meta = thes.getMetaByDiametro(oSelectedKeyDM, oSelectedKeyLP);
                      meta = meta * 12;
                      meta = parseFloat(meta).toFixed(2);
                      oTM.setValue(meta);
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
                    } else {
                      this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                    }
                  } else if(oSelectedMultiboxTurno.length == 2 && oValueFecha != null) {
                    sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(false);
                    sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(false);
                    this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
                  }
                }
              } else {
                this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
              }
            } else if(oSelectedKeyOption == 'MA' && oSelectedKeyTurno != ''){
              if(oValueDatetimeStart != null && oValueDatetimeEnd != null && oDatetimeStart.getValueState() != 'Error' && oDatetimeEnd.getValueState() != 'Error'){
  
                oValueDatetimeStart.setSeconds(0,0);
                oValueDatetimeEnd.setSeconds(0,0);
  
                if(oSelectedKeyDM != ''){
                  var diffTurnoMinutes,
                  secondDiffTurnoMinutes,
                  hoursMinutes,
                  secondHoursMinutes,
                  dateBegin,
                  dateEnd,
                  dateBeginMoment,
                  dateEndMoment,
                  hoursStart,
                  minutesStart,
                  hoursEnd,
                  minutesEnd,
                  beginTurno,
                  endTurno;
  
                  hoursStart = oValueDatetimeStart.getHours();
                  minutesStart = oValueDatetimeStart.getMinutes();
                  hoursEnd = oValueDatetimeEnd.getHours();
                  minutesEnd = oValueDatetimeEnd.getMinutes();
  
                  dateEnd = new Date(oValueDatetimeEnd.getTime());  
                  dateEndMoment = moment(dateEnd);
                  dateBegin = new Date(oValueDatetimeStart.getTime());
                  dateBeginMoment = moment(dateBegin);
  
                  if(oSelectedKeyTurno == 'A'){  
                    endTurno = new Date(oValueDatetimeStart.getTime());
                    endTurno = endTurno.setHours(20,0,0);
                    endTurno = moment(endTurno);
                    beginTurno = new Date(oValueDatetimeStart.getTime());
                    beginTurno = beginTurno.setHours(8,0,0);
                    beginTurno = moment(beginTurno);
  
                    diffTurnoMinutes = endTurno.diff(dateEndMoment, 'minutes'); // Diff in hours
                    hoursMinutes = diffTurnoMinutes/60;
                    
                    if((hoursStart == 8 && minutesStart != 0) || (hoursStart >= 8 && minutesStart != 0)){
                      secondDiffTurnoMinutes = dateBeginMoment.diff(beginTurno, 'minutes');
                      secondHoursMinutes = secondDiffTurnoMinutes/60;
                      hoursMinutes = hoursMinutes + secondHoursMinutes;                    
                    }
  
                    firstTurnoTM = hoursMinutes;
                    secondTurnoTM = 12;
                    hoursMinutes = hoursMinutes + 12;
                  } else {
                    beginTurno = new Date(oValueDatetimeStart.getTime());
                    beginTurno = beginTurno.setHours(20,0,0);
                    beginTurno = moment(beginTurno);
                    let compareDates = thes.validateSameDay(oValueDatetimeStart, oValueDatetimeEnd);
                    if(compareDates){
                      let addingOneDay =  new Date(oValueDatetimeEnd);
                      addingOneDay = addingOneDay.setDate(addingOneDay.getDate() + 1);
                      addingOneDay = new Date(addingOneDay);
                      endTurno = addingOneDay.setHours(8,0,0);
                      endTurno = moment(endTurno);
                    } else {
                      endTurno = new Date(oValueDatetimeEnd);
                      endTurno = endTurno.setHours(8,0,0);
                      endTurno = moment(endTurno);
                    }
  
                    diffTurnoMinutes = endTurno.diff(dateEndMoment, 'minutes'); // Diff in hours
                    hoursMinutes = diffTurnoMinutes/60;
  
                    if((hoursStart == 20 && minutesStart != 0) || (hoursStart >= 20 && minutesStart != 0)){
                      secondDiffTurnoMinutes = dateBeginMoment.diff(beginTurno, 'minutes');
                      secondHoursMinutes = secondDiffTurnoMinutes/60;
                      hoursMinutes = hoursMinutes + secondHoursMinutes; 
                    }
  
                    firstTurnoTM = 12;
                    secondTurnoTM = hoursMinutes;
                    hoursMinutes = hoursMinutes + 12;
                  }
  
                    meta = thes.getMetaByDiametro(oSelectedKeyDM, oSelectedKeyLP);
                    firstTurnoTM = firstTurnoTM * meta;
                    firstTurnoTM = parseFloat(firstTurnoTM).toFixed(2);
                    secondTurnoTM = secondTurnoTM * meta;
                    secondTurnoTM = parseFloat(secondTurnoTM).toFixed(2);
                    meta = hoursMinutes * meta;
                    meta = parseFloat(meta).toFixed(2);
                    oTM.setValue(meta);
  
                  this._oNewAppointmentDialog.getBeginButton().setEnabled(true);
  
                } else {
                  this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
                }
              } else {
                this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
              }
            } else {
              this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
            }          
          } else {
            this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
          }
        } else {
          this._oNewAppointmentDialog.getBeginButton().setEnabled(false);
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
          name: "sap.ui.app01.view.Fragments.Create",
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

    handleAppointmentTypeChange: function(oEvent){
      var sFragName = "dialogFrag",
        oAppointmentType = Fragment.byId(sFragName,"isIntervalAppointment");

      oAppointmentType.setSelected(oEvent.getSource().getSelected());
    },

    handleDialogCancelButton: function(){
      this._oNewAppointmentDialog.close();
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
      var oLineaProduccion = Fragment.byId("dialogFrag", "selectLineaProduccion"),
        oFecha = Fragment.byId('dialogFrag', 'datepickerFecha'),
        oOption = Fragment.byId('dialogFrag', 'selectOption'),
        oMulticbxTurno = Fragment.byId('dialogFrag', 'multiboxTurno'),
        oTurno = Fragment.byId("dialogFrag", "selectTurno"),
        oSelectedKeyTurno = oTurno.getSelectedKey(),
        oDatetimeStart = Fragment.byId("dialogFrag", "startDate"),
        oDatetimeEnd = Fragment.byId("dialogFrag", "endDate"),
        oTipo = Fragment.byId("dialogFrag", "selectTipo"),
        oSelectedKeyTipo = oTipo.getSelectedKey(),
        oValueDatetimeStart = oDatetimeStart.getDateValue(),
        oValueDatetimeEnd = oDatetimeEnd.getDateValue(),
        oDiametroBola = Fragment.byId('dialogFrag', 'selectBall'),
        oTM = Fragment.byId('dialogFrag', 'inputTM' ),
        iPersonId = Fragment.byId("dialogFrag", "selectLineaProduccion").getSelectedIndex(),
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
            var dataLP = oLineaProduccion.getSelectedKey(),
            dataFecha = oFecha.getDateValue(),
            dataOption = oOption.getSelectedKey(),
            selectedKeysMulticbxTurno = oMulticbxTurno.getSelectedItems(),
            dataDiametroBola = oDiametroBola.getSelectedKey(),
            dataTM = oTM.getValue(),
            firstTitle = '',
            secondTitle = '',
            option,
            turno,
            newDataM,
            fromFirstTurno,
            toFirstTurno,
            fromSecondTurno,
            toSecondTurno,
            diametro,
            hrs_pp;

            if(dataOption == 'Φ' || (dataOption == 'PP' && oSelectedKeyTipo == 2)){
              fromFirstTurno = dataFecha.setHours(8,0,0),
              fromFirstTurno = new Date(fromFirstTurno),
              toFirstTurno = dataFecha.setHours(20,0,0),
              toFirstTurno = new Date(toFirstTurno),
              fromSecondTurno = dataFecha.setHours(20,0,0),
              fromSecondTurno = new Date(fromSecondTurno),
              toSecondTurno = dataFecha.setDate(dataFecha.getDate() + 1),
              toSecondTurno = new Date(toSecondTurno),
              toSecondTurno = toSecondTurno.setHours(8,0,0),
              toSecondTurno = new Date(toSecondTurno);
            }

            if(dataOption == 'Φ'){
              newDataM = dataTM / 2;
              newDataM = parseFloat(newDataM).toFixed(2);
              secondTitle = dataDiametroBola + ' | ' + newDataM + ' TM';
              option = dataOption;
              diametro = dataDiametroBola;
              hrs_pp = 0;              
            } else if(dataOption == 'PP' && oSelectedKeyTipo == 2 && selectedKeysMulticbxTurno.length == 2){
              secondTitle = option = dataOption;
              newDataM = dataTM;
              option = dataOption;
              diametro = '';
              hrs_pp = 12;
            }

            if(dataOption == 'Φ' || (dataOption == 'PP' && oSelectedKeyTipo == 2 && selectedKeysMulticbxTurno.length == 2)){
              if(dataOption == 'Φ'){
                for (var i = 0; i < 2; i++) {
                  let startDate,
                  endDate;
                  if(i == 0){
                    startDate = fromFirstTurno;
                    endDate = toFirstTurno;
                    firstTitle = dataLP + ' | ' + 'Día';
                    turno = 'A';
                  } else {
                    startDate = fromSecondTurno;
                    endDate = toSecondTurno;
                    firstTitle = dataLP + ' | ' + 'Noche';
                    turno = 'B';
                  }
  
                  oNewAppointment = {
                    title: firstTitle,
                    info: secondTitle,
                    start: startDate,
                    end: endDate,
                    linea_produccion: dataLP, 
                    turno: turno,
                    option: option,
                    diametro: diametro,
                    tm: newDataM,
                    hrs_pp: hrs_pp
                  };
  
                  this._addNewAppointment(oNewAppointment);
                }
              } else {
                for (var i = 0; i < 2; i++) {
                  let startDate,
                  endDate;
                  if(i == 0){
                    startDate = fromFirstTurno;
                    endDate = toFirstTurno;
                    firstTitle = dataLP + ' | ' + 'Día';
                    turno = 'A';
                  } else {
                    startDate = fromSecondTurno;
                    endDate = toSecondTurno;
                    firstTitle = dataLP + ' | ' + 'Noche';
                    turno = 'B';
                  }
  
                  oNewAppointment = {
                    title: firstTitle,
                    info: secondTitle,
                    start: startDate,
                    end: endDate,
                    linea_produccion: dataLP, 
                    turno: turno,
                    option: option,
                    diametro: diametro,
                    tm: newDataM,
                    hrs_pp: hrs_pp
                  };
  
                  this._addNewAppointment(oNewAppointment);
                }
              }
            } else if(dataOption == 'PP' && oSelectedKeyTipo == 2 && selectedKeysMulticbxTurno.length == 1){
              let keyMulticbxTurno = selectedKeysMulticbxTurno[0].getKey();
              if(keyMulticbxTurno == 'A'){
                for (var i = 0; i < 2; i++) {
                  let startDate,
                  endDate;
                  if(i == 0){
                    startDate = fromFirstTurno;
                    endDate = toFirstTurno;
                    firstTitle = dataLP + ' | ' + 'Día';
                    turno = 'A';
                    option = dataOption;
                    diametro = '';
                    hrs_pp = 12;
                    secondTitle = dataOption;
                    newDataM = 0;
                  } else {
                    startDate = fromSecondTurno;
                    endDate = toSecondTurno;
                    firstTitle = dataLP + ' | ' + 'Noche';
                    turno = 'B';
                    option = 'Φ';
                    diametro = dataDiametroBola;
                    hrs_pp = 0;
                    secondTitle = dataDiametroBola + ' | ' + dataTM;
                    newDataM = dataTM;
                  }

                  oNewAppointment = {
                    title: firstTitle,
                    info: secondTitle,
                    start: startDate,
                    end: endDate,
                    linea_produccion: dataLP, 
                    turno: turno,
                    option: option,
                    diametro: diametro,
                    tm: newDataM,
                    hrs_pp: hrs_pp
                  };

                  this._addNewAppointment(oNewAppointment);
                }

              } else if(keyMulticbxTurno == 'B'){
                for (var i = 0; i < 2; i++) {
                  let startDate,
                  endDate;
                  if(i == 0){
                    startDate = fromFirstTurno;
                    endDate = toFirstTurno;
                    firstTitle = dataLP + ' | ' + 'Día';
                    turno = 'A';
                    option = 'Φ';
                    diametro = dataDiametroBola;
                    hrs_pp = 0;
                    secondTitle = dataDiametroBola + ' | ' + dataTM;
                    newDataM = dataTM;
                  } else {
                    startDate = fromSecondTurno;
                    endDate = toSecondTurno;
                    firstTitle = dataLP + ' | ' + 'Noche';
                    turno = 'B';
                    option = dataOption;
                    diametro = '';
                    hrs_pp = 12;
                    secondTitle = dataOption;
                    newDataM = 0;                
                  }

                  oNewAppointment = {
                    title: firstTitle,
                    info: secondTitle,
                    start: startDate,
                    end: endDate,
                    linea_produccion: dataLP, 
                    turno: turno,
                    option: option,
                    diametro: diametro,
                    tm: newDataM,
                    hrs_pp: hrs_pp
                  };

                  this._addNewAppointment(oNewAppointment);
                }
              }
            } else if(dataOption == 'MA' || (dataOption == 'PP' && oSelectedKeyTipo == 1)){
              if(oSelectedKeyTurno == 'A'){
                for (var i = 0; i < 2; i++) {
                  let startDate,
                  endDate;
                  if(i == 0){
                    startDate = oValueDatetimeStart;
                    let newStartDate = oValueDatetimeStart;
                    newStartDate = moment(newStartDate);
                    endDate = oValueDatetimeEnd;
                    let newEndDate = oValueDatetimeEnd;
                    newEndDate = moment(newEndDate);
                    firstTitle = dataLP + ' | ' + 'Día';
                    turno = 'A';
                    option = dataOption;
                    diametro = dataDiametroBola;
                    hrs_pp = newEndDate.diff(newStartDate, 'minutes');
                    hrs_pp = hrs_pp/60;
                    secondTitle = dataOption + ' | ' + dataDiametroBola + ' | ' + firstTurnoTM;
                    newDataM = firstTurnoTM;                    
                  } else {
                    let secondTurnoBegin = new Date(oValueDatetimeStart);
                    secondTurnoBegin = secondTurnoBegin.setHours(20,0,0);
                    secondTurnoBegin = new Date(secondTurnoBegin);
                    let secondTurnoEnd = new Date(oValueDatetimeStart);
                    secondTurnoEnd = secondTurnoEnd.setDate(secondTurnoEnd.getDate() + 1);
                    secondTurnoEnd = new Date(secondTurnoEnd);
                    secondTurnoEnd = secondTurnoEnd.setHours(8,0,0);
                    secondTurnoEnd = new Date(secondTurnoEnd);
                    startDate = secondTurnoBegin;
                    endDate = secondTurnoEnd;
                    firstTitle = dataLP + ' | ' + 'Noche';
                    turno = 'B';
                    option = 'Φ';
                    diametro = dataDiametroBola;
                    hrs_pp = 0;
                    secondTitle = dataDiametroBola + ' | ' + secondTurnoTM;
                    newDataM = secondTurnoTM;
                  }

                  oNewAppointment = {
                    title: firstTitle,
                    info: secondTitle,
                    start: startDate,
                    end: endDate,
                    linea_produccion: dataLP, 
                    turno: turno,
                    option: option,
                    diametro: diametro,
                    tm: newDataM,
                    hrs_pp: hrs_pp
                  };

                  this._addNewAppointment(oNewAppointment);
                }
              } else {
                for (var i = 0; i < 2; i++) {
                  let startDate,
                  endDate;
                  if(i == 0){
                    let firstTurnoBegin = new Date(oValueDatetimeStart);
                    firstTurnoBegin = firstTurnoBegin.setHours(8,0,0);
                    firstTurnoBegin = new Date(firstTurnoBegin);
                    let firstTurnoEnd = new Date(oValueDatetimeStart);
                    firstTurnoEnd = firstTurnoEnd.setHours(20,0,0);
                    firstTurnoEnd = new Date(firstTurnoEnd);
                    startDate = firstTurnoBegin;
                    endDate = firstTurnoEnd;
                    firstTitle = dataLP + ' | ' + 'Día';
                    turno = 'A';
                    option = 'Φ';
                    diametro = dataDiametroBola;
                    hrs_pp = 0;
                    secondTitle = dataDiametroBola + ' | ' + firstTurnoTM;
                    newDataM = firstTurnoTM;
                  } else {
                    startDate = oValueDatetimeStart;
                    let newStartDate = oValueDatetimeStart;
                    newStartDate = moment(newStartDate);
                    endDate = oValueDatetimeEnd;
                    let newEndDate = oValueDatetimeEnd;
                    newEndDate = moment(newEndDate);
                    firstTitle = dataLP + ' | ' + 'Noche';
                    turno = 'B';
                    option = dataOption;
                    diametro = dataDiametroBola;
                    hrs_pp = newEndDate.diff(newStartDate, 'minutes');
                    hrs_pp = hrs_pp/60;
                    secondTitle = dataOption + ' | ' + dataDiametroBola + ' | ' + secondTurnoTM;
                    newDataM = secondTurnoTM;
                  }

                  oNewAppointment = {
                    title: firstTitle,
                    info: secondTitle,
                    start: startDate,
                    end: endDate,
                    linea_produccion: dataLP, 
                    turno: turno,
                    option: option,
                    diametro: diametro,
                    tm: newDataM,
                    hrs_pp: hrs_pp
                  };

                  this._addNewAppointment(oNewAppointment);
                }

              }

            }
          }

          oModel.updateBindings();

          this._oNewAppointmentDialog.close();
          
          oFecha.setValue(null);
          oOption.setSelectedKey('');
          oMulticbxTurno.setSelectedKeys([]);
          oTurno.setSelectedKey('');
          oDatetimeStart.setValue(null);
          oDatetimeEnd.setValue(null);
          oDiametroBola.setSelectedKey('');
          oTM.setValue(0);
          //oLineaProduccion.setSelectedKey('');

          sap.ui.core.Fragment.byId('dialogFrag', 'lblFecha').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'datepickerFecha').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'lblMultiboxTurno').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'multiboxTurno').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTurno').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'lblTM').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'lblStartDate').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'startDate').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'lblEndDate').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'endDate').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTipo').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setVisible(false);
          sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setSelectedKey(null);
          sap.ui.core.Fragment.byId('dialogFrag', 'selectLineaProduccion').setSelectedKey(null);

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
      //var oAppointmentType = Fragment.byId("dialogFrag","isIntervalAppointment"),
        /*var oDateTimePickerStart = Fragment.byId("dialogFrag", "startDate"),
        oDateTimePickerEnd =  Fragment.byId("dialogFrag", "endDate"),
        oTitleInput = Fragment.byId("dialogFrag","inputTitle"),
        oMoreInfoInput = Fragment.byId("dialogFrag","moreInfo"),
        oPersonSelected = Fragment.byId("dialogFrag", "selectLineaProduccion");*/

      //Set the person in the first row as selected.
      //oPersonSelected.setSelectedItem(Fragment.byId("dialogFrag", "selectLineaProduccion").getItems()[0]);
      /*oDateTimePickerStart.setValue("");
      oDateTimePickerEnd.setValue("");
      oDateTimePickerStart.setValueState("None");
      oDateTimePickerEnd.setValueState("None");
      oTitleInput.setValue("");
      oMoreInfoInput.setValue("");*/
      //oAppointmentType.setSelected(false);

      this.updateButtonEnabledState();
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
    },
    getProgramaProduccion: function(){
      var thes = this;
      var dataOption = [{
        code: 'Φ',
        description: 'Diámetro Bola'
      },
      {
        code: 'MA',
        description: 'Mantto. Prog.'
      },
      {
        code: 'PP',
        description: 'Parada Prog.'
      }];

      var dataTipo = [{
        code: 1,
        description: 'Por Horas'
      },
      {
        code: 2,
        description: 'Por Turno'
      }];

      $.ajax({
        url: 'model/PRO/ListarProgramaProduccion.php',
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
          var dataTurno =  thes.getTurno();
          var dataBall = thes.getDiametroBola();
          var dateToday = new Date();
          var newDataM = {};
          newDataM['startDate'] = dateToday;
          newDataM['people'] = response;
          newDataM['turno'] = dataTurno;
          newDataM['option'] = dataOption;
          newDataM['tipo'] = dataTipo;
          newDataM['ball'] = dataBall;
          var oModel = new sap.ui.model.json.JSONModel(newDataM);
          oModel.setSizeLimit(10000); 
          thes.getView().setModel(oModel);
          thes.byId('PC1').setBuiltInViews(["Hour", "Day", "Week", "One Month"]);
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
    getDiametroBola: function(){
      var data;
      $.ajax({
        url: 'model/SPRO/ListarInfoBallDistinct.php',
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
    onChangeOption: function(oEvent){
      var thes = this,
      oSource = oEvent.getSource(),
      key = oSource.getSelectedKey();

      if(key == 'Φ'){
        sap.ui.core.Fragment.byId('dialogFrag', 'lblFecha').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'datepickerFecha').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblTM').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setValue(0);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblMultiboxTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'multiboxTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblStartDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'startDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblEndDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'endDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTipo').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setSelectedKey(null);
      } else if(key == 'PP'){
        /*sap.ui.core.Fragment.byId('dialogFrag', 'lblFecha').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'datepickerFecha').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblMultiboxTurno').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'multiboxTurno').setVisible(true);*/
        sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setValue(0);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblTM').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblStartDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'startDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblEndDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'endDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTipo').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setSelectedKey(null);
      } else if(key == 'MA'){
        sap.ui.core.Fragment.byId('dialogFrag', 'lblFecha').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'datepickerFecha').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblMultiboxTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'multiboxTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTurno').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setValue(0);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblTM').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblStartDate').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'startDate').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblEndDate').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'endDate').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTipo').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setSelectedKey(null);
      }
      this.updateButtonEnabledState();
    },
    saveProgramaProduccion: function(data){

      var thes = this;

      $.ajax({
        data: data,
        url: 'model/PRO/InsertarProgramaProduccion.php',
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
    getMetaByDiametro: function(diametro, linea_produccion){
      var thes = this;
      var meta;
      var parametros = {
        '_diametro': diametro,
        '_lineaProduccion': linea_produccion
      };

      $.ajax({
        data: parametros,
        url: 'model/PRO/ListarMetaByDiametro.php',
        type: 'POST',
        async: false,
        beforeSend: function(){
        },
        success: function(response){
          response = JSON.parse(response);
          meta = response[0].meta;
        },
        error: function(xhr, ajaxOptions, thrownError){
          alert(xhr.status);
          alert(thrownError);
        }
      });
      return meta;
    },
    validateSameDay: function(d1, d2){
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    },
    onRefresh: function(oEvent){
      var thes = this;
      thes.getProgramaProduccion();        
    },
    changeLineaProduccion: function(){
      var thes = this,
      oLineaProduccion = Fragment.byId("dialogFrag", "selectLineaProduccion"),
      oSelectedKeyLP = oLineaProduccion.getSelectedKey(),
      parametros = {
        '_LineaProduccion': oSelectedKeyLP
      },
      data = thes.getView().getModel().getData();

      if(oSelectedKeyLP != ''){
        $.ajax({
          data: parametros,
          url: 'model/PRO/ListarDiametroByLineaProduccion.php',
          type: 'post',
          async: false,
          beforeSend: function(){},
          success: function(response){
            response = JSON.parse(response);
            data.ball = response;
            var oModel = new sap.ui.model.json.JSONModel(data);
            oModel.setSizeLimit(10000); 
            thes.getView().setModel(oModel);
          },
          error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
            alert(thrownError);
          }
        });
      }
    },
    onChangeTipo: function(oEvent){
      var thes = this,
      oSource = oEvent.getSource(),
      key = oSource.getSelectedKey();

      if(key == 1){
        sap.ui.core.Fragment.byId('dialogFrag', 'lblFecha').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'datepickerFecha').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblMultiboxTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'multiboxTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setValue(0);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblTM').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblStartDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'startDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblEndDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'endDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTurno').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTipo').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setVisible(true);
      } else {
        sap.ui.core.Fragment.byId('dialogFrag', 'lblFecha').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'datepickerFecha').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblMultiboxTurno').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'multiboxTurno').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblBall').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectBall').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setValue(0);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblTM').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'inputTM').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblStartDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'startDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblEndDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'endDate').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setVisible(false);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTurno').setSelectedKey(null);
        sap.ui.core.Fragment.byId('dialogFrag', 'lblSelectTipo').setVisible(true);
        sap.ui.core.Fragment.byId('dialogFrag', 'selectTipo').setVisible(true);
      }

    }
  });
 });