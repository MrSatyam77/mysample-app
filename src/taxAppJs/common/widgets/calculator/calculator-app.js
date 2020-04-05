"use strict";
var calculatorWidget = angular.module('calculatorWidget', []);

/*Directives from here*/
calculatorWidget.directive('calculatorWidget',['$timeout','returnService',function ($timeout,returnService) {
    return {
        restrict : 'AE',
        templateUrl : 'taxAppJs/common/widgets/calculator/partials/calculator-tamplate.html',
        scope:{},
        link: function (scope, element, attrs) {

            scope.activeItem = {}; //This will help us to do animation on button
            scope.memory=0; //This will help us to store memory
            scope.history=[{}]; //This will help us to store history
            scope.focusedFieldObject;//store Object of field;

            //This will help us to set focus to input box
            var _setFocusOnInputField= function(){
              document.getElementById("resultForCalculator").focus();
            }

            /*Initialize focusable field Object if it not undefined
            * if it is undefined then set copy-paste button disable
            */
            var  _init = function(){
                scope.focusedFieldObject=returnService.getObjectOfFocusedField();
                //get focus into input box
                $timeout(function(){
                   _setFocusOnInputField();          
                   
                   // draggable and resizable
                   $('#calculator_tool').resizable({minHeight: 327,minWidth: 271});
                   $('#calculator_tool').draggable({ containment: "window" });
                },1000);     
            }

            //call init function
             _init();

             // close dialog
             scope.closeCalc = function() {
                postal.publish({
                   channel: 'MTPO-Return',
                   topic: 'closeCalculator',
                   data: {}
               });
            }

            //This Function is used to do all operation from ui of calculator
            scope.doAllOperation = function(action,value){
                switch(action){
                    case 'add':
                        _addCharacter(value);
                        break;
                    case 'memoryClear':
                        _memoryClear();
                        break;
                    case 'memoryRecall':
                        _memoryRecall();
                        break;
                    case 'memorySave':
                        _memorySave();
                        break;
                    case 'memoryAdd':
                        _memoryAdd();
                        break;
                    case 'memorySubstract':
                        _memorySubstract();
                        break;
                    case 'backspace':
                        _deleteChar();
                        break;
                    case 'clear':
                        _clear();
                        break;
                    case 'clearAll':
                        _clearAll();
                        break;
                    case 'copy':
                        _copy();
                        break;
                    case 'paste':
                        _paste();
                        break;
                    case 'togglepsitiveNegative':
                        _togglePositiveNegative();
                        break;
                    case 'evaluate':
                        _evalExpression();
                        break;
                }
            }

            //This function add object to history
            var _addTohistory = function(historyObject){
                //push object to history array
                scope.history.push({"expression":historyObject.expression,"result":historyObject.result});
            }

            //This will help us to set value to input box
            var _setInputValue = function(value,isAppend){
                if(isAppend){
                    //append value to input box
                    document.getElementById("resultForCalculator").value+=value;
                }else{
                    //set value of input box
                    document.getElementById("resultForCalculator").value=value;
                }
            } 

            //This will help us to get value from input box 
            var _getUserInput = function(){
                //get value of input box and return it
                var value=document.getElementById("resultForCalculator").value;
                return value;
            }

            //This function is used to add number or any operation character to input box
            var _addCharacter = function (character) {
                if(_getUserInput().length<=100){
                    //add character to input box
                    _setInputValue(character,true)
                }
                _setFocusOnInputField();
            }; 

            //keydown event binding on element
            element.bind('keydown',function(event){
                //To have animation effect on buttons thorugh keyboard same like user click on it
                //START: Animation on Keyboard
                var _keyForActiveItem = 'is'+event.keyCode;
                if(event.ctrlKey == true){
                    _keyForActiveItem = _keyForActiveItem + "Ctrl";
                }else if(event.shiftKey == true){
                    _keyForActiveItem = _keyForActiveItem + "Shift"; 
                }
                //Appped value to activeItem
                scope.$evalAsync(function(){
                   scope.activeItem[_keyForActiveItem] = true;                    
                });

                //blank activeItem after 2 miliseconds
                $timeout(function(){
                    scope.activeItem = {};                        
                },300);                
                //END: Animation on keyboard   

                //Whitelist keys which are allowed for caculator (input)
                if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 
                    && event.keyCode <= 107) || event.keyCode == 109 || event.keyCode == 111
                    || event.keyCode == 8 || event.keyCode == 110 || (event.shiftKey == true
                    && event.keyCode == 187)||(event.shiftKey == true && event.keyCode == 110) 
                    || event.keyCode == 189 || event.keyCode == 190 || event.keyCode == 123 
                    || event.keyCode == 116 || event.keyCode == 27){
                    return;
                } 
                //case for keys that executes shortcut of calculator
                switch(event.keyCode){
                    case 122 ://F11-for copy from textfield
                        if(scope.focusedFieldObject!=undefined)
                            _copy();
                        break;
                    case 45 ://Insert-for insert value to textfield
                        if(scope.focusedFieldObject!=undefined)
                            _paste();
                        break;
                    case 76 ://Ctrl+L-for clear memory
                        if(event.ctrlKey == true)
                            _memoryClear();
                        break;
                    case 82 ://Ctrl+R-for recall memory 
                        if(event.ctrlKey == true)
                            _memoryRecall();
                        break;
                    case 77 ://Ctrl+M-for store in memory 
                        if(event.ctrlKey == true)
                            _memorySave();
                        break;
                    case 65 ://Ctrl+A-for add to memory
                        if(event.ctrlKey == true)
                            _memoryAdd();
                        break;
                    case 83 ://Ctrl+S-for substract from memory
                        if(event.ctrlKey == true)
                            _memorySubstract();
                        break;
                    case 46 :
                        if(event.ctrlKey == true)//Ctrl+Delete-for Clear All
                           _clearAll();
                        else //Delete-for clear memory
                           _clear();
                        break;
                    case 187 ://Equal(=)-for evaluate expression
                    case 13 ://Enter-for Evaluate expression
                        _evalExpression();
                        break;
                }
                event.stopPropagation();
                event.preventDefault();
            });

            //This function is used to evaluate expression and give result to input box
            var _evalExpression = function(){
                try{
                    var _userInput=_getUserInput();
                    if(_userInput !="" &&  _userInput!=undefined && _userInput!="ERROR"){
                        if(_userInput.indexOf('%')>-1){//if percentage is found
                            _percentage(_userInput.substring(0,_userInput.length - 1));
                            return;
                        }
                        //Evaluate expression 
                        var resultOfEval=scope.$eval(_userInput);
                        //add object to history
                        _addTohistory({"expression":_userInput+"=","result":resultOfEval});
                        _setInputValue(resultOfEval);     
                    }
                }catch(err){
                     //add object to history
                     _addTohistory({"expression":_userInput+"=","result":"ERROR"});
                     _setInputValue("ERROR");
                }
                _setFocusOnInputField();
            } 

            //This function will help us to find percentage
            var _percentage = function(_userInput){
                try{
                     //Evaluate expression
                     var resultOfEval =scope.$eval(_userInput)/100;
                     //add object to history
                     _addTohistory({"expression":_userInput+"%=","result":resultOfEval});
                     _setInputValue(resultOfEval);
                 }catch(err){
                    //add object to history
                   _addTohistory({"expression":_userInput+"%=","result":"ERROR"});
                    _setInputValue("ERROR");
                 }
                 _setFocusOnInputField();
            }

            //set value positive/negative in input box
            var _togglePositiveNegative = function(){
                 var _userInput = _getUserInput();
                 if(!isNaN(_userInput[0]))
                    _setInputValue("-"+_userInput);
                 else if(_userInput[0]=="-")
                    _setInputValue(_userInput.slice(1));
                 _setFocusOnInputField();
            }

            //This function function will clear input box
            var _clear = function (){
                 _setInputValue("");
                 _setFocusOnInputField();
            } 

            //This Function will help us to clear input box and history both
            var _clearAll = function(){
                 _setInputValue("");
                 scope.history=[];
                 _setFocusOnInputField();
            }

            //This Function is help us to recall memory
            var _memoryRecall = function () {
                if(!isNaN(scope.memory))
                _setInputValue(scope.memory);
                _setFocusOnInputField();
            }

            //This function will help us to clear memory
            var _memoryClear = function () {
                scope.memory = 0;
                _setFocusOnInputField();
            }

            //This function will set scope.memory stored value to input box
            var _memorySave = function() {
              scope.memory = _getUserInput();
              _setFocusOnInputField();
            }

            //This function will add value to scope.memory
            var _memoryAdd = function () {
                scope.memory = parseFloat (_getUserInput()) + parseFloat (scope.memory);
                _setFocusOnInputField();
            }

            //This  function will substract value form scope.memory
            var _memorySubstract = function () {
                scope.memory =  parseFloat (scope.memory) - parseFloat (_getUserInput()) ;
                _setFocusOnInputField();
            }

            //This function will help us to delete last character of input box
            var _deleteChar = function (){
                var _userInput = _getUserInput();
                //delete one character from inputbox
                _setInputValue(_userInput.substring(0,_userInput.length - 1));
                _setFocusOnInputField();
            }

            //This function will help us copy focusable field value to calculator input box
            var _copy = function(){
                 //get value of taxfield
                 var fieldValue = returnService.captureFieldValue();
                 //check value if it valid then copy to input box of calculator otherwise set to 0
                 if(fieldValue != undefined && fieldValue != "" && fieldValue != 'NaN'){
                    _setInputValue(fieldValue);
                 }else{
                    _setInputValue(0);
                 }
                 _setFocusOnInputField();
            }

            //This Function will help us to paste calculated value of input box to focusable field value
            var _paste = function(){

             var result = _getUserInput();
             //if value if blank or undefined then set it to 0
             if(result == undefined || result==""){
                result=0;
             }
             //check value for inserting into taxfield
             if(result != "ERROR"){
                    //object for element to change
                    var _changeInElement = {};

                    //Get Field object to if it is calculated
                    var focusedFieldObjectInReturn = returnService.captureFieldValue(true);
                    if(focusedFieldObjectInReturn.isCalculated == true){
                        if(focusedFieldObjectInReturn.isOverridden != true){
                            _changeInElement.calValue = focusedFieldObjectInReturn.value;
                            _changeInElement.isOverridden = true;
                        }                                                                                                
                    }
                    //
                    _changeInElement.value = result;
                    //set value to taxfield
                    returnService.postTaxFieldChange({fieldName:scope.focusedFieldObject.elementId,index:scope.focusedFieldObject.docIndex,newVal:_changeInElement});
              }
              _setFocusOnInputField();
            }

            //destroy event
            element.on('$destroy', function (event) {
                element.unbind('keydown');
            });
        }
    };
}]);