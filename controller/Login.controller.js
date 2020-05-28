jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
sap.ui.define([
   "sap/ui/app01/controller/BaseController"
], function (BaseController) {
   "use strict";
   return BaseController.extend("sap.ui.app01.controller.Login", {

       onInit: function(oEvent) {
        var thes = this;
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("login").attachPatternMatched(this._onObjectMatched, this);                           
       },
       _onObjectMatched: function (oEvent) {
        var thes = this;
        $.ajax({
                url:   'model/ENTIDADES/login.json', 
                type:  'post',
                dataType: 'json',
                async: false,
                success:  function (response) {
                    var oModel = new sap.ui.model.json.JSONModel(response); 
                    thes.byId("pageLogin").setModel(oModel);                               
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);
                }
            });
       },
       onLogin: function(oEvent){
        var thes = this;
        var data = thes.byId('pageLogin').getModel().getData();
        var flg = 0;

        if(data.user == ''){
          sap.m.MessageToast.show("Complete el campo usuario!");
        } else if(data.password == ''){
          sap.m.MessageToast.show("Complete el campo contraseña!");
        } else {

          var parametros = {
            "_Usuario" : data.user,
            "_Password": data.password
          };

          $.ajax({
            data: parametros,
            url: 'model/LOGIN/Login.php',
            type: 'post',
            async: false,
            success:  function (response) {
              response = JSON.parse(response);
              flg = response;
              if(flg.length == 0 ){
                sap.m.MessageToast.show("Datos incorrectos!");
              } else {
                thes.showBusyIndicator(3000, 0);
                let user = flg[0].email;
                let name = flg[0].name;
                let lastName = flg[0].lastname;
                let area = flg[0].area;
                let role = flg[0].role;
                let nameComplete = (lastName != '') ? lastName + ', ' + name : name;
                sessionStorage.user = user.toUpperCase();
                sessionStorage.name = nameComplete.toUpperCase();
                sessionStorage.area = area;
                sessionStorage.role = role.toUpperCase();
                data.usuario = "";
                data.contrasenia = "";

                thes.byId("pageLogin").getModel().refresh();
                thes.getRouter().navTo("home");
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
          });

        }

      
       }/*,
       onPressAcceder: function(oEvent){
        var data = this.byId("sfLogin").getModel().getData();
        var flg = 0;


        console.log(data);

        if(data.usuario == ''){
          sap.m.MessageToast.show("Complete el campo usuario!");
        } else if(data.contrasenia == ''){
          sap.m.MessageToast.show("Complete el campo contraseña!");
        } else {
          var parametros = {
                 "_User" : data.usuario,
                 "_Password" : data.contrasenia
             };


                $.ajax({
                  data:  parametros,
                  url:   'model/LOGIN/Login.php', 
                  type:  'post',
                  async: false,
                  success:  function (response) {
                    flg = response;
                  },
                  error: function (xhr, ajaxOptions, thrownError) {
                      alert(xhr.status);
                      alert(thrownError);
                  }
                });

          if (flg == 0) {            
            sap.m.MessageToast.show("Login incorrecto");
          }else{
            sessionStorage.usuario = data.usuario;
            sessionStorage.nombre = flg;
            sessionStorage.log = 'yes';

            data.usuario = "";
            data.contrasenia = "";

            this.byId("sfLogin").getModel().refresh();
            this.getRouter().navTo("home");
          }

        }
       },
       onPressLimpiar: function(oEvent) {
          var data = this.byId("sfLogin").getModel().getData();
                     
          data.usuario = "";
          data.contrasenia = "";

          this.byId("sfLogin").getModel().refresh();

          sap.m.MessageToast.show("Se limpió");
           
       }*/
   });
});
