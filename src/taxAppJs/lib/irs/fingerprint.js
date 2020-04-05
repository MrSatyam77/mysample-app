/*
* fingerprintJS 0.5.4 - Fast browser fingerprint library
* https://github.com/Valve/fingerprintjs
* Copyright (c) 2013 Valentin Vasilyev (valentin.vasilyev@outlook.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
*
* Script modified by Internal Revenue Service, rev. date December 11,2014
*/

;(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define(definition); }
  else { context[name] = definition(); }
})('Fingerprint', this, function () {
  'use strict';
  
  var Fingerprint = function (options) {
    var nativeForEach, nativeMap;
    nativeForEach = Array.prototype.forEach;
    nativeMap = Array.prototype.map;

    this.each = function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) return;
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) return;
          }
        }
      }
    };

    this.map = function(obj, iterator, context) {
      var results = [];
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };

    if (typeof options == 'object'){
      this.screen_resolution = options.screen_resolution;
      this.canvas = options.canvas;
      this.ie_activex = options.ie_activex;
    } else if(typeof options == 'function'){
      
    }
  };

  Fingerprint.prototype = {
    get: function(){
      var keys = [];
      keys.push(navigator.userAgent);
	  keys.push(navigator.vendor);
      keys.push(navigator.productSub);
	  keys.push(navigator.buildID);
      keys.push(navigator.platform);
	  keys.push(navigator.cpuClass);
      keys.push(navigator.language);
      keys.push(screen.colorDepth);
      if (this.screen_resolution) {
        var resolution = this.getScreenResolution();
        if (typeof resolution !== 'undefined'){ // headless browsers, such as phantomjs
          keys.push(this.getScreenResolution().join('x'));
        }
      }
      keys.push(new Date().getTimezoneOffset());
      keys.push(this.hasSessionStorage());
      keys.push(this.hasLocalStorage());
      keys.push(!!window.indexedDB);
      //body might not be defined at this point or removed programmatically
      if(document.body){
        keys.push(typeof(document.body.addBehavior));
      } else {
        keys.push(typeof undefined);
      }
      keys.push(typeof(window.openDatabase));
      keys.push(navigator.doNotTrack);
	  var touchHardware = "No Touch Hardware";
		if (window.navigator.maxTouchPoints) touchHardware = "Touch Hardware";
	  keys.push(touchHardware);
	  keys.push(navigator.cookieEnabled);
	  var javaEnabled = "Java Disabled";
		if (window.navigator.javaEnabled()) javaEnabled="Java Enabled";
	  keys.push(javaEnabled);	  
	  keys.push(this.getRegularPluginsString());
	  keys.push(this.getIEPluginsString());
      if(this.canvas && this.isCanvasSupported()){
        keys.push(this.getCanvasFingerprint());
      }
        var stringtohash
		stringtohash = (keys.join('###'));
		return stringtohash;
      
    },

	
    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    hasLocalStorage: function () {
      try{
        return !!window.localStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },
    
    hasSessionStorage: function () {
      try{
        return !!window.sessionStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },

    isCanvasSupported: function () {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    },

    isIE: function () {
      if(navigator.appName === 'Microsoft Internet Explorer') {
        return true;
      } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
        return true;
      }
      return false;
    },

    // This section commented out to collect all possible Plugins regardless of browser
	
	//getPluginsString: function () {
    //  if(this.isIE() && this.ie_activex){
    //    return this.getIEPluginsString();
    //  } else {
    //    return this.getRegularPluginsString();
    //  }
    //},

    getRegularPluginsString: function () {
      return this.map(navigator.plugins, function (p) {
        var mimeTypes = this.map(p, function(mt){
          return [mt.type, mt.suffixes].join('~');
        }).join(',');
        return [p.name, p.filename, p.version, p.description, mimeTypes].join('::');
      }, this).join(';');
    },

    getIEPluginsString: function () {
      if(window.ActiveXObject){
        var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
          'AcroPDF.PDF', // Adobe PDF reader 7+
          'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
          'QuickTime.QuickTime', // QuickTime
          // 5 versions of real players
          'rmocx.RealPlayer G2 Control',
          'rmocx.RealPlayer G2 Control.1',
          'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
          'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
          'RealPlayer',
          'SWCtl.SWCtl', // ShockWave player
          'WMPlayer.OCX', // Windows media player
          'AgControl.AgControl', // Silverlight
          'Skype.Detection'];
          
        // starting to detect plugins in IE
        var Plugin = '';
		return this.map(names, function(name){
          try{
            var Plugin = new ActiveXObject(name);
            return name;
          } catch(e){
            return null;
          }
        }).join(';');
      } else {
        return ""; // behavior prior version 0.5.0, not breaking backwards compat.
      }
    },
	
    getScreenResolution: function () {
      return [screen.height, screen.width];
    },

    getCanvasFingerprint: function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      // https://www.browserleaks.com/canvas#how-does-it-work
      var txt = 'http://valve.github.io';
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125,1,62,20);
      ctx.fillStyle = "#069";
      ctx.fillText(txt, 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText(txt, 4, 17);
      return canvas.toDataURL();
    }
  };

  return Fingerprint;
  
});
