// LHCChatOptions = {
//     opt: {
//         popup_height: 1020, //on right bottom click new browser window opens.this is its height OPTIONAL
//         popup_width: 500, //on right bottom click new browser window opens.this is its Width OPTIONAL
//     },
//     apiOrigin: Chat_API,// "http://192.168.0.110:3008", //nodeAPI baseURL
//     websocket_url: Chat_Socket_URL,// 'http://192.168.0.110:3009',
//     source: "SalesSite", //from where plugin called e.g Mytaxprep /CRM
//     urlopen: Chat_App_Url,//"http://localhost:3008/#/", //base Url to open on Plugin Click
//     windowname: "startchatwindow", //new opened popup Title
//     horizontalAlign: "right", //widget position initial --------------OPTIONAL
//     verticalAlign: "bottom", //widget position initial ||||OPTIONAL
// };

var chat_internal = {};
var isWidgetDrag = false;
var statusData = {};
//create session
function createSession() {
    console.log("createSession");
    $.ajax({
        type: 'GET',
        url: LHCChatOptions.apiOrigin + "/auth/session", //chat.apiOrigin + "/auth/session",
        dataType: 'json',
        async: false,
        cache: false,
        data: {
            "c_session": sessionStorage.getItem("c_session")
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data, textStatus, jqXHR) {
            console.log("createSession SUCCESS");
            chat_internal.c_session = 'c_' + jqXHR.getResponseHeader("c_session");
            chat_internal.c_user = jqXHR.getResponseHeader("c_user");
            //Set session and user informtion in localstorage
            setInLocalStorage();
            init();
        },
        error: function (request, status, error) {
            console.log('session Creation Failed');
            //       createOfflineWidget();
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
}


/*Comman function*/
function setInLocalStorage() {
    localStorage.setItem("c_session", chat_internal.c_session);
    localStorage.setItem("c_user", chat_internal.c_user);
    sessionStorage.setItem("c_session", chat_internal.c_session);
}

var init = function () {
    console.log('!!!!!!!!!!!!!!!!!!! init');
    //Add chat container
    $(document).ready(function () {
        //Start socket
        $.getScript("taxAppJs/lib/socket.io.js", function () {
            console.log('getScript DONEEEEEEEEEE');
            connectSocket();
            //Join room
            emitevent("Join", {
                "c_session": localStorage.getItem("c_session"),
                "c_user": localStorage.getItem("c_user"),
                "page_title":document.title,
                //"useragent": navigator.userAgent,
                // "IP": chat_internal.clientData.ip,
                "country": chat_internal.clientData.country,
                "timezone": getTimeZone().timezone,
                "source": LHCChatOptions.source,
                "referrerurl"  : document.referrer,
                "locationId": LHCChatOptions.userInfo.masterLocationId,
                "customerNumber": LHCChatOptions.userInfo.customerNumber,
                "contactpersonId": LHCChatOptions.userInfo.contactpersonId,
                "contactPersonName": LHCChatOptions.userInfo.contactPersonName,
            });
            //get online status
            listenevent("agentstatus", addChatContainer);
            listenevent("closeWindow", closeWindow);

        }, function (err) {
            console.log('getScript FAILLLLLLLLLLLL');
            console.log(err);
        });
    });
};
//Connect with socket
function connectSocket() {
    chat_internal.socket = io.connect(LHCChatOptions.websocket_url, { //chat.websocket_url, {
        'reconnection': true,
        'reconnectionDelay': 20000,
        'reconnectionDelayMax': 30000,
        'reconnectionAttempts': 10
    });
}

//Send to socket
function emitevent(eventname, data) {
    console.log("emitevent");
    console.log("eventname" + eventname);
    console.log("data" + JSON.stringify(data));

    chat_internal.socket.emit(eventname, data);
}

//Listen from socket
function listenevent(eventname, callback) {
    //get online status
    chat_internal.socket.on(eventname, function (data) {
        console.log(data);
        if (data.chatId) {
            if (callback) {
                callback(data);
            }
        } else if (data.data.status && statusData && statusData.data && statusData.data.status) {
            if (data.data.status !== statusData.data.status) {
                if (callback) {
                    callback(data);
                }
            }
        } else {
            if (callback) {
                callback(data);
            }
        }
    });
}

//Add chat container
function addChatContainer(data) {
    //console.log(data);
    console.log('***************************' + JSON.stringify(data));
    statusData = data;
    $("body").find("#lhc_status_container_chatbox").remove();
    $("body").find("#lhc_need_help_container").remove();
    if (data.code == 2000 && data.data != undefined && data.data.status != undefined) {
        var status_container = "";
        if (data.data.status == 'online') {
            status_container += '<div id="lhc_status_container_chatbox" class=' + LHCChatOptions.horizontalAlign + "_" + LHCChatOptions.verticalAlign + "_bar" + '>';
            status_container += '<div id="lhc_need_help_container" style="margin-left:-80px;">';
            // status_container += '<span id="lhc_need_help_triangle" style="right:15px;"></span>';
            status_container += '<a id="lhc_need_help_close" title="Close" onclick="return onPopupCloseClick();"><img src="taxAppJs/images/Close button.png"></a>';
            status_container += '<div onclick="return onClickOfWidget();" id="lhc_need_help_image">';
            status_container += '<img width="60" height="60" src="https://chat.mytaxprepoffice.com/lhc_web/design/customtheme/images/general/operator.png">';
            status_container += '</div>';
            status_container += '<div onclick="return onClickOfWidget();" id="lhc_need_help_main_title">Need help?';
            status_container += '</div>';
            status_container += '<span onclick="return onClickOfWidget();" id="lhc_need_help_sub_title">Our staff is always ready to help';
            status_container += '</span>';
            status_container += '</div>';
            status_container += '<a id="online-icon" class="chat-status-icon"  onclick="return onClickOfWidget();" ><img src="taxAppJs/images/Online-pop-up.png">';
            status_container += '</a>';
            status_container += '</div>';
            $('body').prepend(status_container);
            console.log('ONLINE');
        } else {
            console.log('OFFLINE');
            createOfflineWidget();
        }
        //set url parameter
        chat_internal.urlopen = LHCChatOptions.urlopen + "?sid=" + 'w_' + sessionStorage.getItem("c_session").split('c_')[1] + "&status=" + data.data.status+"&FromTaxApp=true" + '&email=' + LHCChatOptions.userInfo.email + '&phoneNo='+ LHCChatOptions.userInfo.phoneNo
        //chat.urlopen + "?sid=" + 'w_' + sessionStorage.getItem("c_session").split('c_')[1] + "&status=" + data.Status;
        registerEvents();
    } else {
        console.log('ERROR');
        //error in Room Join,show Offline mode 
        createOfflineWidget();
    }
}

//regestre events 
function registerEvents() {
    $("#lhc_status_container_chatbox").draggable({
        // scroll: true,
        containment: "window",
        start: function (event, ui) {
            console.log('drag Start');
            isWidgetDrag = true;
            $("body").find("#lhc_need_help_container").hide();
        },
        stop: function (event, ui) {
            console.log("drag stop:");
            //   isWidgetDrag = false;
            //  onClickOfWidget();
            $("body").find("#lhc_need_help_container").show();
        }
    });
}

function getTimeZone() {
    var d = new Date();
    var usertime = d.toLocaleString();
    var offset;
    // Some browsers / OSs provide the timezone name in their local string:
    var tzsregex = /\b(ACDT|ACST|ACT|ADT|AEDT|AEST|AFT|AKDT|AKST|AMST|AMT|ART|AST|AWDT|AWST|AZOST|AZT|BDT|BIOT|BIT|BOT|BRT|BST|BTT|CAT|CCT|CDT|CEDT|CEST|CET|CHADT|CHAST|CIST|CKT|CLST|CLT|COST|COT|CST|CT|CVT|CXT|CHST|DFT|EAST|EAT|ECT|EDT|EEDT|EEST|EET|EST|FJT|FKST|FKT|GALT|GET|GFT|GILT|GIT|GMT|GST|GYT|HADT|HAEC|HAST|HKT|HMT|HST|ICT|IDT|IRKT|IRST|IST|JST|KRAT|KST|LHST|LINT|MART|MAGT|MDT|MET|MEST|MIT|MSD|MSK|MST|MUT|MYT|NDT|NFT|NPT|NST|NT|NZDT|NZST|OMST|PDT|PETT|PHOT|PKT|PST|RET|SAMT|SAST|SBT|SCT|SGT|SLT|SST|TAHT|THA|UYST|UYT|VET|VLAT|WAT|WEDT|WEST|WET|WST|YAKT|YEKT)\b/gi;

    // In other browsers the timezone needs to be estimated based on the offset:
    var timezonenames = {
        "UTC+0": "GMT",
        "UTC+1": "CET",
        "UTC+2": "EET",
        "UTC+3": "EEDT",
        "UTC+3.5": "IRST",
        "UTC+4": "MSD",
        "UTC+4.5": "AFT",
        "UTC+5": "PKT",
        "UTC+5.5": "IST",
        "UTC+6": "BST",
        "UTC+6.5": "MST",
        "UTC+7": "THA",
        "UTC+8": "AWST",
        "UTC+9": "AWDT",
        "UTC+9.5": "ACST",
        "UTC+10": "AEST",
        "UTC+10.5": "ACDT",
        "UTC+11": "AEDT",
        "UTC+11.5": "NFT",
        "UTC+12": "NZST",
        "UTC-1": "AZOST",
        "UTC-2": "GST",
        "UTC-3": "BRT",
        "UTC-3.5": "NST",
        "UTC-4": "CLT",
        "UTC-4.5": "VET",
        "UTC-5": "EST",
        "UTC-6": "CST",
        "UTC-7": "MST",
        "UTC-8": "PST",
        "UTC-9": "AKST",
        "UTC-9.5": "MIT",
        "UTC-10": "HST",
        "UTC-11": "SST",
        "UTC-12": "BIT"
    };

    var timezone = usertime.match(tzsregex);
    if (timezone) {
        timezone = timezone[timezone.length - 1];
    } else {
        offset = -1 * d.getTimezoneOffset() / 60;
        offset = "UTC" + (offset >= 0 ? "+" + offset : offset);
        timezone = timezonenames[offset];
    }
    return {
        "usertime": usertime,
        "offset": offset,
        "timezone": timezone
    };
}
// (function () {
//     //  'use strict';
//     console.log("IN MY JS" + JSON.stringify(LHCChatOptions));
//     if (typeof LHCChatOptions == "undefined") {
//         throw ('LHCChatOptions Object Not defined');
//     } else {
//         if (LHCChatOptions.apiOrigin == undefined) {
//             throw ('LHCChatOptions.apiOrigin Not defined');
//         }
//         if (LHCChatOptions.websocket_url == undefined) {
//             throw ('LHCChatOptions.websocket_url Not defined');
//         }
//         if (LHCChatOptions.source == undefined) {
//             throw ('LHCChatOptions.source Not defined');
//         }
//         if (LHCChatOptions.urlopen == undefined) {
//             throw ('LHCChatOptions.urlopen Not defined');
//         }
//         if (LHCChatOptions.windowname == undefined) {
//             throw ('LHCChatOptions.windowname Not defined');
//         }

//         if (LHCChatOptions.horizontalAlign == undefined) {
//             LHCChatOptions.horizontalAlign = "right";
//         }

//         if (LHCChatOptions.verticalAlign == undefined) {
//             LHCChatOptions.horizontalAlign = "bottom";
//         }
//     }

//     $.ajax({
//         dataType: "json",
//         url: 'https://ipinfo.io',
//         async: false,
//         success: function (data) {
//             chat_internal.clientData = data;
//         }
//     });



//     //Starting point
//     createSession();
// })();

var initChat = function () {
    console.log('asdasdasdas')
    //  'use strict';
    console.log("IN MY JS.................." + JSON.stringify(LHCChatOptions));
    if (typeof LHCChatOptions == "undefined") {
        throw ('LHCChatOptions Object Not defined');
    } else {
        if (LHCChatOptions.apiOrigin == undefined) {
            throw ('LHCChatOptions.apiOrigin Not defined');
        }
        if (LHCChatOptions.websocket_url == undefined) {
            throw ('LHCChatOptions.websocket_url Not defined');
        }
        if (LHCChatOptions.source == undefined) {
            throw ('LHCChatOptions.source Not defined');
        }
        if (LHCChatOptions.urlopen == undefined) {
            throw ('LHCChatOptions.urlopen Not defined');
        }
        if (LHCChatOptions.windowname == undefined) {
            throw ('LHCChatOptions.windowname Not defined');
        }

        if (LHCChatOptions.horizontalAlign == undefined) {
            LHCChatOptions.horizontalAlign = "right";
        }

        if (LHCChatOptions.verticalAlign == undefined) {
            LHCChatOptions.horizontalAlign = "bottom";
        }
        if (LHCChatOptions.userInfo == undefined || LHCChatOptions.userInfo == '') {
            LHCChatOptions.userInfo = {};
        }
    }

    $.ajax({
        dataType: "json",
        url: 'https://ipinfo.io',
        async: false,
        success: function (data) {
            chat_internal.clientData = data;
        }
    });



    //Starting point
    createSession();
};

function onPopupCloseClick() {
    $("body").find("#lhc_need_help_container").remove();
}

function onClickOfWidget() {
    console.log("onClickOfWidget")
    var popupHeight = 0;
    var popupWidth = 0;
    console.log("isWidgetDrag" + isWidgetDrag);
    // setTimeout(() => {
    if (isWidgetDrag == false) {
        if (typeof LHCChatOptions != "undefined" && LHCChatOptions.opt != undefined && LHCChatOptions.opt.popup_height != undefined) {
            popupHeight = LHCChatOptions.opt.popup_height;
        } else {
            popupHeight = 520;
        }

        if (typeof LHCChatOptions != "undefined" && LHCChatOptions.opt != undefined && LHCChatOptions.opt.popup_width != undefined) {
            popupWidth = LHCChatOptions.opt.popup_width;
        } else {
            popupWidth = 520;
        }
        if(statusData.data !== undefined && statusData.data.status !== undefined && statusData.data.status.toLowerCase() == 'offline') {
            window.location.href = '/manage/support/email'
        } else {
            $("body").find("#lhc_need_help_container").remove();
            $("body").find("#lhc_status_container_chatbox").remove();
            window.open(chat_internal.urlopen, LHCChatOptions.windowname, "scrollbars=yes,menubar=1,resizable=1,width=" + popupWidth + ",height=" + popupHeight);
        }        
    } else {
        console.log('setting false isWidgetDrag');
        isWidgetDrag = false;
    }
    // }, 100);


}

function closeWindow() {
    console.log("close window")
    addChatContainer(statusData);
}

function createOfflineWidget() {
    var status_container = '<div id="lhc_status_container_chatbox" class=' + LHCChatOptions.horizontalAlign + "_" + LHCChatOptions.verticalAlign + "_bar" + '  onclick="return onClickOfWidget();"><a id="offline-icon" class="status-icon"></a></div>';
    //  $(document).ready(function () {//append div when document is ready
    $('body').append(status_container);
    // });

}