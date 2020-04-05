"use strict";

//Directive
angular.module("lineHelpWidget", []).directive('lineHelpWidget', ['$sce', 'contentService', 'environment', function ($sce, contentService, environment) {
  return {
    restrict: 'AE',
    templateUrl: 'taxAppJs/common/widgets/lineHelp/partials/lineHelp-template.html',
    link: function (scope, element, attrs) {

      //Temporary function to differentiate features as per environment (beta/live)
      var betaOnly = function () {
        if (environment.mode == 'beta' || environment.mode == 'local')
          return true;
        else
          return false;
      };
  
      var lineHelpData = {
        'preparerId': 'In order to complete the verification of your identity. please click verify button.',
        'recoveryEmail': 'Enter your Recovery Email Address\n' + '\n' + 'In case you forget your password or are locked out of your account and you cannot access your primary email account, we will send your account activation link to the recovery email.'
      }

      //listining broadcast request on every field focus
      var fieldFocusListener = scope.$on('fieldFocus', function ($event, elementId) {
        //help content wrapped in <p> tag
        var helpContent = "<p align='justify'>" + contentService.getLineHelpValue(elementId) + "</p>";
        //Give content to lineHelp accordian to display
        angular.element(element.children()[0]).html($sce.getTrustedHtml(helpContent));
      });

      //here we are listining brodcast event in new form load 
      var formLoadedWithForm = scope.$on('formLoadedWithForm', function ($event, form) {
        //remove content from lineHelp accordian when new form is loaded
        angular.element(element.children()[0]).html('');
      });

      if (betaOnly() == true) {
        //listining broadcast request on every field focus
        var lineHelpListner = scope.$on('showLineHelp', function ($event, elementId) {
          //help content wrapped in <p> tag
          var helpContent = "<p align='justify'>" + lineHelpData[elementId] + "</p>";
          //Give content to lineHelp accordian to display
          angular.element(element.children()[0]).html($sce.getTrustedHtml(helpContent));
        });


        //listining broadcast request on every field focus
        var hideLineHelpListner = scope.$on('hideLineHelp', function ($event, elementId) {
          //remove content from lineHelp accordian when new form is loaded
          angular.element(element.children()[0]).html('');
        });
      }

      //Cleanup on destroy
      scope.$on('$destroy', function () {
        if (betaOnly() == true) { 
          if(lineHelpListner !== undefined) {
            lineHelpListner()
          }
          if(hideLineHelpListner !== undefined) {
            hideLineHelpListner()
          }
        }

        if (fieldFocusListener != undefined)
          fieldFocusListener();

        if (formLoadedWithForm != undefined)
          formLoadedWithForm();

          
      });
    }

  };
}]);