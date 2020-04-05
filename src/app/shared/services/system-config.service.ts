// External Imports
import { Injectable, Injector } from '@angular/core';
import { environment } from '@environments/environment';

// Internal Imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { APINAME } from '@app/shared/shared.constants';
import { UserService } from '@app/shared/services/user.service';

@Injectable({
    providedIn: 'root'
})

export class SystemConfigService {
    //hold current tax year
    //TODO: Changes to make new tax year live
    private _currentTaxYear: string = '2015';
    // hold config for tax year , pakages , available year , and return status
    private config = {
        packages: environment.packages,
        returnStatus: [{ id: "default_1", title: "In Process", isPredefined: true }, { id: "default_2", title: "Missing Info", isPredefined: true }, { id: "default_3", title: "Questions", isPredefined: true }, { id: "default_4", title: "Waiting", isPredefined: true }, { id: "default_5", title: "Incomplete", isPredefined: true }, { id: "default_6", title: "Complete", isPredefined: true }, { id: "default_7", title: "Proforma", isPredefined: true }, { id: "default_8", title: "Taxpayer Review", isPredefined: true }, { id: "default_9", title: "Remote Signature", isPredefined: true },{ id: "default_10", title: "E-Filed", isPredefined: true }],
        availableTaxYears: environment.availableTaxYears
    }

    //this var store all country details
    private _countryDetails: any = [{ "countryCode": "us", "dialCode": "(+1)", "countryName": "United States" },
    { "countryCode": "gb", "dialCode": "(+44)", "countryName": "United Kingdom" },
    { "countryCode": "af", "dialCode": "(+93)", "countryName": "Afghanistan" },
    { "countryCode": "al", "dialCode": "(+355)", "countryName": "Albania" },
    { "countryCode": "dz", "dialCode": "(+213)", "countryName": "Algeria" },
    { "countryCode": "as", "dialCode": "(+1684)", "countryName": "American Samoa" },
    { "countryCode": "ad", "dialCode": "(+376)", "countryName": "Andorra" },
    { "countryCode": "ao", "dialCode": "(+244)", "countryName": "Angola" },
    { "countryCode": "ai", "dialCode": "(+1264)", "countryName": "Anguilla" },
    { "countryCode": "ag", "dialCode": "(+1268)", "countryName": "Antigua and Barbuda" },
    { "countryCode": "ar", "dialCode": "(+54)", "countryName": "Argentina" },
    { "countryCode": "am", "dialCode": "(+374)", "countryName": "Armenia" },
    { "countryCode": "aw", "dialCode": "(+297)", "countryName": "Aruba" },
    { "countryCode": "au", "dialCode": "(+61)", "countryName": "Australia" },
    { "countryCode": "at", "dialCode": "(+43)", "countryName": "Austria (Österreich)" },
    { "countryCode": "az", "dialCode": "(+994)", "countryName": "Azerbaijan (Azərbaycan)" },
    { "countryCode": "bs", "dialCode": "(+1242)", "countryName": "Bahamas" },
    { "countryCode": "bh", "dialCode": "(+973)", "countryName": "Bahrain" },
    { "countryCode": "bd", "dialCode": "(+880)", "countryName": "Bangladesh" },
    { "countryCode": "bb", "dialCode": "(+1246)", "countryName": "Barbados" },
    { "countryCode": "by", "dialCode": "(+375)", "countryName": "Belarus" },
    { "countryCode": "be", "dialCode": "(+32)", "countryName": "Belgium" },
    { "countryCode": "bz", "dialCode": "(+501)", "countryName": "Belize" },
    { "countryCode": "bj", "dialCode": "(+229)", "countryName": "Benin" },
    { "countryCode": "bm", "dialCode": "(+1441)", "countryName": "Bermuda" },
    { "countryCode": "bt", "dialCode": "(+975)", "countryName": "Bhutan" },
    { "countryCode": "bo", "dialCode": "(+591)", "countryName": "Bolivia" },
    { "countryCode": "ba", "dialCode": "(+387)", "countryName": "Bosnia and Herzegovina" },
    { "countryCode": "bw", "dialCode": "(+267)", "countryName": "Botswana" },
    { "countryCode": "br", "dialCode": "(+55)", "countryName": "Brazil" },
    { "countryCode": "io", "dialCode": "(+246)", "countryName": "British Indian Ocean Territory" },
    { "countryCode": "vg", "dialCUSER_CHANGE_TAXYEAR()ode": "(+1284)", "countryName": "British Virgin Islands" },
    { "countryCode": "bn", "dialCUSER_CHANGE_TAXYEAR()ode": "(+673)", "countryName": "Brunei" },
    { "countryCode": "bg", "dialCUSER_CHANGE_TAXYEAR()ode": "(+359)", "countryName": "Bulgaria" },
    { "countryCode": "bf", "dialCUSER_CHANGE_TAXYEAR()ode": "(+226)", "countryName": "Burkina Faso" },
    { "countryCode": "bi", "dialCode": "(+257)", "countryName": "Burundi" },
    { "countryCode": "kh", "dialCode": "(+855)", "countryName": "Cambodia" },
    { "countryCode": "cm", "dialCode": "(+237)", "countryName": "Cameroon" },
    { "countryCode": "ca", "dialCode": "(+1)", "countryName": "Canada" },
    { "countryCode": "cv", "dialCode": "(+238)", "countryName": "Cape Verde" },
    { "countryCode": "bq", "dialCode": "(+599)", "countryName": "Caribbean Netherlands" },
    { "countryCode": "ky", "dialCode": "(+1345)", "countryName": "Cayman Islands" },
    { "countryCode": "cf", "dialCode": "(+236)", "countryName": "Central African Republic" },
    { "countryCode": "td", "dialCode": "(+235)", "countryName": "Chad" },
    { "countryCode": "cl", "dialCode": "(+56)", "countryName": "Chile" },
    { "countryCode": "cn", "dialCode": "(+86)", "countryName": "China" },
    { "countryCode": "co", "dialCode": "(+57)", "countryName": "Colombia" },
    { "countryCode": "km", "dialCode": "(+269)", "countryName": "Comoros" },
    { "countryCode": "cd", "dialCode": "(+243)", "countryName": "Congo (DRC)" },
    { "countryCode": "cg", "dialCode": "(+242)", "countryName": "Congo (Republic)" },
    { "countryCode": "ck", "dialCode": "(+682)", "countryName": "Cook Islands" },
    { "countryCode": "cr", "dialCode": "(+506)", "countryName": "Costa Rica" },
    { "countryCode": "ci", "dialCode": "(+225)", "countryName": "Côte d’Ivoire" },
    { "countryCode": "hr", "dialCode": "(+385)", "countryName": "Croatia (Hrvatska)" },
    { "countryCode": "cu", "dialCode": "(+53)", "countryName": "Cuba" },
    { "countryCode": "cw", "dialCode": "(+599)", "countryName": "Curaçao" },
    { "countryCode": "cy", "dialCode": "(+357)", "countryName": "Cyprus" },
    { "countryCode": "cz", "dialCode": "(+420)", "countryName": "Czech Republic" },
    { "countryCode": "dk", "dialCode": "(+45)", "countryName": "Denmark" },
    { "countryCode": "dj", "dialCode": "(+253)", "countryName": "Djibouti" },
    { "countryCode": "dm", "dialCode": "(+1767)", "countryName": "Dominica" },
    { "countryCode": "do", "dialCode": "(+1)", "countryName": "Dominican Republic" },
    { "countryCode": "ec", "dialCode": "(+593)", "countryName": "Ecuador" },
    { "countryCode": "eg", "dialCode": "(+20)", "countryName": "Egypt" },
    { "countryCode": "sv", "dialCode": "(+503)", "countryName": "El Salvador" },
    { "countryCode": "gq", "dialCode": "(+240)", "countryName": "Equatorial Guinea" },
    { "countryCode": "er", "dialCode": "(+291)", "countryName": "Eritrea" },
    { "countryCode": "ee", "dialCode": "(+372)", "countryName": "Estonia" },
    { "countryCode": "et", "dialCode": "(+251)", "countryName": "Ethiopia" },
    { "countryCode": "fk", "dialCode": "(+500)", "countryName": "Falkland Islands" },
    { "countryCode": "fo", "dialCode": "(+298)", "countryName": "Faroe Islands" },
    { "countryCode": "fj", "dialCode": "(+679)", "countryName": "Fiji" },
    { "countryCode": "fi", "dialCode": "(+358)", "countryName": "Finland" },
    { "countryCode": "fr", "dialCode": "(+33)", "countryName": "France" },
    { "countryCode": "gf", "dialCode": "(+594)", "countryName": "French Guiana" },
    { "countryCode": "pf", "dialCode": "(+689)", "countryName": "French Polynesia" },
    { "countryCode": "ga", "dialCode": "(+241)", "countryName": "Gabon" },
    { "countryCode": "gm", "dialCode": "(+220)", "countryName": "Gambia" },
    { "countryCode": "ge", "dialCode": "(+995)", "countryName": "Georgia" },
    { "countryCode": "de", "dialCode": "(+49)", "countryName": "Germany" },
    { "countryCode": "gh", "dialCode": "(+233)", "countryName": "Ghana" },
    { "countryCode": "gi", "dialCode": "(+350)", "countryName": "Gibraltar" },
    { "countryCode": "gr", "dialCode": "(+30)", "countryName": "Greece" },
    { "countryCode": "gl", "dialCode": "(+299)", "countryName": "Greenland" },
    { "countryCode": "gd", "dialCode": "(+1473)", "countryName": "Grenada" },
    { "countryCode": "gp", "dialCode": "(+590)", "countryName": "Guadeloupe" },
    { "countryCode": "gu", "dialCode": "(+1671)", "countryName": "Guam" },
    { "countryCode": "gt", "dialCode": "(+502)", "countryName": "Guatemala" },
    { "countryCode": "gn", "dialCode": "(+224)", "countryName": "Guinea" },
    { "countryCode": "gw", "dialCode": "(+245)", "countryName": "Guinea-Bissau" },
    { "countryCode": "gy", "dialCode": "(+592)", "countryName": "Guyana" },
    { "countryCode": "ht", "dialCode": "(+509)", "countryName": "Haiti" },
    { "countryCode": "hn", "dialCode": "(+504)", "countryName": "Honduras" },
    { "countryCode": "hk", "dialCode": "(+852)", "countryName": "Hong Kong" },
    { "countryCode": "hu", "dialCode": "(+36)", "countryName": "Hungary" },
    { "countryCode": "is", "dialCode": "(+354)", "countryName": "Iceland" },
    { "countryCode": "in", "dialCode": "(+91)", "countryName": "India" },
    { "countryCode": "id", "dialCode": "(+62)", "countryName": "Indonesia" },
    { "countryCode": "ir", "dialCode": "(+98)", "countryName": "Iran" },
    { "countryCode": "iq", "dialCode": "(+964)", "countryName": "Iraq" },
    { "countryCode": "ie", "dialCode": "(+353)", "countryName": "Ireland" },
    { "countryCode": "il", "dialCode": "(+972)", "countryName": "Israel" },
    { "countryCode": "it", "dialCode": "(+39)", "countryName": "Italy" },
    { "countryCode": "jm", "dialCode": "(+1876)", "countryName": "Jamaica" },
    { "countryCode": "jp", "dialCode": "(+81)", "countryName": "Japan" },
    { "countryCode": "jo", "dialCode": "(+962)", "countryName": "Jordan" },
    { "countryCode": "kz", "dialCode": "(+7)", "countryName": "Kazakhstan" },
    { "countryCode": "ke", "dialCode": "(+254)", "countryName": "Kenya" },
    { "countryCode": "ki", "dialCode": "(+686)", "countryName": "Kiribati" },
    { "countryCode": "kw", "dialCode": "(+965)", "countryName": "Kuwait" },
    { "countryCode": "kg", "dialCode": "(+996)", "countryName": "Kyrgyzstan" },
    { "countryCode": "la", "dialCode": "(+856)", "countryName": "Laos" },
    { "countryCode": "lv", "dialCode": "(+371)", "countryName": "Latvia" },
    { "countryCode": "lb", "dialCode": "(+961)", "countryName": "Lebanon" },
    { "countryCode": "ls", "dialCode": "(+266)", "countryName": "Lesotho" },
    { "countryCode": "lr", "dialCode": "(+231)", "countryName": "Liberia" },
    { "countryCode": "ly", "dialCode": "(+218)", "countryName": "Libya" },
    { "countryCode": "li", "dialCode": "(+423)", "countryName": "Liechtenstein" },
    { "countryCode": "lt", "dialCode": "(+370)", "countryName": "Lithuania" },
    { "countryCode": "lu", "dialCode": "(+352)", "countryName": "Luxembourg" },
    { "countryCode": "mo", "dialCode": "(+853)", "countryName": "Macau" },
    { "countryCode": "mk", "dialCode": "(+389)", "countryName": "Macedonia (FYROM)" },
    { "countryCode": "mg", "dialCode": "(+261)", "countryName": "Madagascar" },
    { "countryCode": "mw", "dialCode": "(+265)", "countryName": "Malawi" },
    { "countryCode": "my", "dialCode": "(+60)", "countryName": "Malaysia" },
    { "countryCode": "mv", "dialCode": "(+960)", "countryName": "Maldives" },
    { "countryCode": "ml", "dialCode": "(+223)", "countryName": "Mali" },
    { "countryCode": "mt", "dialCode": "(+356)", "countryName": "Malta" },
    { "countryCode": "mh", "dialCode": "(+692)", "countryName": "Marshall Islands" },
    { "countryCode": "mq", "dialCode": "(+596)", "countryName": "Martinique" },
    { "countryCode": "mr", "dialCode": "(+222)", "countryName": "Mauritania" },
    { "countryCode": "mu", "dialCode": "(+230)", "countryName": "Mauritius" },
    { "countryCode": "mx", "dialCode": "(+52)", "countryName": "Mexico" },
    { "countryCode": "fm", "dialCode": "(+691)", "countryName": "Micronesia" },
    { "countryCode": "md", "dialCode": "(+373)", "countryName": "Moldova" },
    { "countryCode": "mc", "dialCode": "(+377)", "countryName": "Monaco" },
    { "countryCode": "mn", "dialCode": "(+976)", "countryName": "Mongolia" },
    { "countryCode": "me", "dialCode": "(+382)", "countryName": "Montenegro" },
    { "countryCode": "ms", "dialCode": "(+1664)", "countryName": "Montserrat" },
    { "countryCode": "ma", "dialCode": "(+212)", "countryName": "Morocco" },
    { "countryCode": "mz", "dialCode": "(+258)", "countryName": "Mozambique" },
    { "countryCode": "mm", "dialCode": "(+95)", "countryName": "Myanmar" },
    { "countryCode": "na", "dialCode": "(+264)", "countryName": "Namibia" },
    { "countryCode": "nr", "dialCode": "(+674)", "countryName": "Nauru" },
    { "countryCode": "np", "dialCode": "(+977)", "countryName": "Nepal" },
    { "countryCode": "nl", "dialCode": "(+31)", "countryName": "Netherlands" },
    { "countryCode": "nc", "dialCode": "(+687)", "countryName": "New Caledonia" },
    { "countryCode": "nz", "dialCode": "(+64)", "countryName": "New Zealand" },
    { "countryCode": "ni", "dialCode": "(+505)", "countryName": "Nicaragua" },
    { "countryCode": "ne", "dialCode": "(+227)", "countryName": "Niger" },
    { "countryCode": "ng", "dialCode": "(+234)", "countryName": "Nigeria" },
    { "countryCode": "nu", "dialCode": "(+683)", "countryName": "Niue" },
    { "countryCode": "nf", "dialCode": "(+672)", "countryName": "Norfolk Island" },
    { "countryCode": "kp", "dialCode": "(+850)", "countryName": "North Korea" },
    { "countryCode": "mp", "dialCode": "(+1670)", "countryName": "Northern Mariana Islands" },
    { "countryCode": "no", "dialCode": "(+47)", "countryName": "Norway" },
    { "countryCode": "om", "dialCode": "(+968)", "countryName": "Oman" },
    { "countryCode": "pk", "dialCode": "(+92)", "countryName": "Pakistan" },
    { "countryCode": "pw", "dialCode": "(+680)", "countryName": "Palau" },
    { "countryCode": "ps", "dialCode": "(+970)", "countryName": "Palestine" },
    { "countryCode": "pa", "dialCode": "(+507)", "countryName": "Panama" },
    { "countryCode": "pg", "dialCode": "(+675)", "countryName": "Papua New Guinea" },
    { "countryCode": "py", "dialCode": "(+595)", "countryName": "Paraguay" },
    { "countryCode": "pe", "dialCode": "(+51)", "countryName": "Peru" },
    { "countryCode": "ph", "dialCode": "(+63)", "countryName": "Philippines" },
    { "countryCode": "pl", "dialCode": "(+48)", "countryName": "Poland" },
    { "countryCode": "pt", "dialCode": "(+351)", "countryName": "Portugal" },
    { "countryCode": "pr", "dialCode": "(+974)", "countryName": "Puerto Rico" },
    { "countryCode": "qa", "dialCode": "(+974)", "countryName": "Qatar" },
    { "countryCode": "re", "dialCode": "(+262)", "countryName": "Réunion" },
    { "countryCode": "ro", "dialCode": "(+40)", "countryName": "Romania" },
    { "countryCode": "ru", "dialCode": "(+7)", "countryName": "Russia" },
    { "countryCode": "rw", "dialCode": "(+250)", "countryName": "Rwanda" },
    { "countryCode": "bl", "dialCode": "(+590)", "countryName": "Saint Barthélemy" },
    { "countryCode": "sh", "dialCode": "(+290)", "countryName": "Saint Helena" },
    { "countryCode": "kn", "dialCode": "(+1869)", "countryName": "Saint Kitts and Nevis" },
    { "countryCode": "lc", "dialCode": "(+1758)", "countryName": "Saint Lucia" },
    { "countryCode": "mf", "dialCode": "(+590)", "countryName": "Saint Martin" },
    { "countryCode": "pm", "dialCode": "(+508)", "countryName": "Saint Pierre and Miquelon" },
    { "countryCode": "vc", "dialCode": "(+1784)", "countryName": "Saint Vincent and the Grenadines" },
    { "countryCode": "ws", "dialCode": "(+685)", "countryName": "Samoa" },
    { "countryCode": "sm", "dialCode": "(+378)", "countryName": "San Marino" },
    { "countryCode": "st", "dialCode": "(+239)", "countryName": "São Tomé and Príncipe" },
    { "countryCode": "sa", "dialCode": "(+966)", "countryName": "Saudi Arabia" },
    { "countryCode": "sn", "dialCode": "(+221)", "countryName": "Senegal" },
    { "countryCode": "rs", "dialCode": "(+381)", "countryName": "Serbia" },
    { "countryCode": "sc", "dialCode": "(+248)", "countryName": "Seychelles" },
    { "countryCode": "sl", "dialCode": "(+232)", "countryName": "Sierra Leone" },
    { "countryCode": "sg", "dialCode": "(+65)", "countryName": "Singapore" },
    { "countryCode": "sx", "dialCode": "(+1721)", "countryName": "Sint Maarten" },
    { "countryCode": "sk", "dialCode": "(+421)", "countryName": "Slovakia" },
    { "countryCode": "si", "dialCode": "(+386)", "countryName": "Slovenia" },
    { "countryCode": "sb", "dialCode": "(+677)", "countryName": "Solomon Islands" },
    { "countryCode": "so", "dialCode": "(+252)", "countryName": "Somalia" },
    { "countryCode": "za", "dialCode": "(+27)", "countryName": "South Africa" },
    { "countryCode": "kr", "dialCode": "(+82)", "countryName": "South Korea" },
    { "countryCode": "ss", "dialCode": "(+211)", "countryName": "South Sudan" },
    { "countryCode": "es", "dialCode": "(+34)", "countryName": "Spain" },
    { "countryCode": "lk", "dialCode": "(+94)", "countryName": "Sri Lanka" },
    { "countryCode": "sd", "dialCode": "(+249)", "countryName": "Sudan" },
    { "countryCode": "sr", "dialCode": "(+597)", "countryName": "Suriname" },
    { "countryCode": "sz", "dialCode": "(+268)", "countryName": "Swaziland" },
    { "countryCode": "se", "dialCode": "(+46)", "countryName": "Sweden" },
    { "countryCode": "ch", "dialCode": "(+41)", "countryName": "Switzerland" },
    { "countryCode": "sy", "dialCode": "(+963)", "countryName": "Syria" },
    { "countryCode": "tw", "dialCode": "(+886)", "countryName": "Taiwan" },
    { "countryCode": "tj", "dialCode": "(+992)", "countryName": "Tajikistan" },
    { "countryCode": "tz", "dialCode": "(+255)", "countryName": "Tanzania" },
    { "countryCode": "th", "dialCode": "(+66)", "countryName": "Thailand" },
    { "countryCode": "tl", "dialCode": "(+670)", "countryName": "Timor-Leste" },
    { "countryCode": "tg", "dialCode": "(+228)", "countryName": "Togo" },
    { "countryCode": "tk", "dialCode": "(+690)", "countryName": "Tokelau" },
    { "countryCode": "to", "dialCode": "(+676)", "countryName": "Tonga" },
    { "countryCode": "tt", "dialCode": "(+1868)", "countryName": "Trinidad and Tobago" },
    { "countryCode": "tn", "dialCode": "(+216)", "countryName": "Tunisia" },
    { "countryCode": "tr", "dialCode": "(+90)", "countryName": "Turkey" },
    { "countryCode": "tm", "dialCode": "(+993)", "countryName": "Turkmenistan" },
    { "countryCode": "tc", "dialCode": "(+1649)", "countryName": "Turks and Caicos Islands" },
    { "countryCode": "tv", "dialCode": "(+688)", "countryName": "Tuvalu" },
    { "countryCode": "vi", "dialCode": "(+1340)", "countryName": "U.S. Virgin Islands" },
    { "countryCode": "ug", "dialCode": "(+256)", "countryName": "Uganda" },
    { "countryCode": "ua", "dialCode": "(+380)", "countryName": "Ukraine" },
    { "countryCode": "ae", "dialCode": "(+971)", "countryName": "United Arab Emirates" },
    { "countryCode": "gb", "dialCode": "(+44)", "countryName": "United Kingdom" },
    { "countryCode": "us", "dialCode": "(+1)", "countryName": "United States" },
    { "countryCode": "uy", "dialCode": "(+598)", "countryName": "Uruguay" },
    { "countryCode": "uz", "dialCode": "(+998)", "countryName": "Uzbekistan" },
    { "countryCode": "vu", "dialCode": "(+678)", "countryName": "Vanuatu" },
    { "countryCode": "va", "dialCode": "(+39)", "countryName": "Vatican City" },
    { "countryCode": "ve", "dialCode": "(+58)", "countryName": "Venezuela" },
    { "countryCode": "vn", "dialCode": "(+84)", "countryName": "Vietnam" },
    { "countryCode": "wf", "dialCode": "(+681)", "countryName": "Wallis and Futuna" },
    { "countryCode": "ye", "dialCode": "(+967)", "countryName": "Yemen" },
    { "countryCode": "zm", "dialCode": "(+260)", "countryName": "Zambia" },
    { "countryCode": "zw", "dialCode": "(+263)", "countryName": "Zimbabwe" }];

    // hold defalult colour configuration
    private colorPreference: any = {
        //Default colors for Perform Review
        performReview: {
            reject: '#a94442',
            warning: '#8a6d3b',
            info: '#3c763d'
        },
        //Default colors for Form Fields               
        formFields: {
            normal: '#000000',
            required: '#ff0000',
            calculated: '#ffd800',
            overriden: '#c0c0c0 ',
            estimated: '#3c763d'
        }

    };

    // hold default add state preferences
    private autoAddStatePreferences: any = {
        'dMainInfo.struszip': { 'fieldName': 'dMainInfo.struszip', 'options': [1, 3], 'value': false, 'title': 'Client Information Screen (1040)' },
        'dW2.ZIPCode': { 'fieldName': 'dW2.ZIPCode', 'options': [2, 3], 'value': false, 'title': 'W2 Line 15 (1040)' },
        'd1120CCIS.Zipcode': { 'fieldName': 'd1120CCIS.Zipcode', 'options': [1, 3], 'value': false, 'title': 'Client Information Screen (1120C)' },
        'd1120SCIS.Zipcode': { 'fieldName': 'd1120SCIS.Zipcode', 'options': [1, 3], 'value': false, 'title': 'Client Information Screen (1120S)' },
        'd1065CIS.USZip': { 'fieldName': 'd1065CIS.USZip', 'options': [1, 3], 'value': false, 'title': 'Client Information Screen (1065)' }
    }

    //efin status lookup
    private efinStatusLookup: any = {
        0: { displayText: 'Not Verified', style: '#FF0000' },
        1: { displayText: 'In Process', style: '#FCC120' },
        2: { displayText: 'Verified', style: '#008000' },
        4: { displayText: 'Rejected', style: '#FF0000' },
        5: { displayText: 'Not Applicable', style: '#333' }
    }

    //signature Type Lookup
    private signatureTypeLookup: any = {
        1: { displayText: "ERO" },
        2: { displayText: "Preparer" },
        3: { displayText: "Taxpayer" },
        4: { displayText: "Spouse" },
    };

    //efile status lookup for showing value based on status
    private eFileStatusLookup: any = {
        0: { value: 'transmitted', displayText: 'Transmitted' },
        1: { value: 'transmitted', displayText: 'Transmitted' },
        2: { value: 'transmitted', displayText: 'Transmitted' },
        3: { value: 'transmitted', displayText: 'Transmitted' },
        4: { value: 'transmitted', displayText: 'Transmitted' },
        5: { value: 'transmitted', displayText: 'Transmitted' },
        6: { value: 'transmitted', displayText: 'Transmitted' },
        7: { value: 'transmitted', displayText: 'At IRS/State' },
        8: { value: 'rejected', displayText: 'Rejected' },
        9: { value: 'accepted', displayText: 'Accepted' },
        10: { value: 'transmitted', displayText: 'Transmitted' },
        11: { value: 'transmitted', displayText: 'Transmitted' },
        12: { value: 'transmitted', displayText: 'Transmitted' },
        13: { value: 'transmitted', displayText: 'Transmitted' },
        14: { value: 'rejected', displayText: 'Rejected' },
        15: { value: 'transmitted', displayText: 'Transmitted' },
        16: { value: 'transmitted', displayText: 'Transmitted' },
        17: { value: 'accepted', displayText: 'Accepted' },
        18: { value: 'transmitted', displayText: 'At Bank' },
        21: { value: 'canceled', displayText: 'Canceled' }
    }

    // k1 mapping data form import.
    private k1MappingData: any = {
        "1065": {
            'OrdinaryIncomeLoss': 'fieldlo',
            'NetIncomeLossRealEstateAmount': 'fieldln',
            'OtherNetRentalIncomeLoss': 'fieldlm',
            'GuaranteedPayments': 'fieldll',
            'InterestIncome': 'fieldlk',
            'OrdinaryDividends': 'fieldlj',
            'QualifiedDividends': 'fieldli',
            'Royalties': 'fieldlh',
            'NetSTCapitalGainLoss': 'fieldlg',
            'NetLTCapitalGainLoss': 'fieldlf',
            'CollectiblesGainLoss': 'fieldld',
            'UnrecapturedSection1250Gain': 'fieldlc',
            'NetSect1231GainLoss': 'fieldlb',
            'Section179ExpenseDeduction': 'fieldjx',
            'OtherDeduction': 'fieldiy',
            'fielddm': 'fieldlw',
            'fielddn': 'fieldlt',
            'OtherIncome': 'fieldlb'
        },
        "1041": {
            'InterestIncome': 'fieldmr',
            'OrdinaryDividendsAmt': 'fieldml',
            'QualifiedDividends': 'fieldmn',
            'NetSTCapitalGain': 'fieldls',
            'NetLTCapitalGain': 'fieldll',
            'Collectibles28PercentGainAmt': 'fieldli',
            'UnrecapturedSection1250Gain': 'fieldkg',
            'OtherPortfolioIncomeLossAmt': 'fieldkd',
            'OrdinaryBusinessIncomeAmt': 'fieldjn',
            'NetRentalIncomeRealEstateAmt': 'fieldis',
            'OtherRentalIncomeAmt': 'fieldhy',
            'EstateTaxDeductionAmt': 'fieldex',
            'EstatesName': 'fieldnk',
            'EstatesEIN': 'fieldnj'
        },
        "1120s": {
            'OrdinaryIncomeLoss': 'fieldlo',
            'NetIncomeLossRealEstateAmount': 'fieldln',
            'NetIncomeLossRentalAmount': 'fieldlm',
            'InterestIncome': 'fieldlk',
            'PortfolioIncmLossTotOrdnryDiv': 'fieldlj',
            'PortfolioIncomeLossRoyalties': 'fieldlh',
            'NetSTCapitalGainLoss': 'fieldlg',
            'NetLTCapitalGainLoss': 'fieldlf',
            'CollectiblesGainLoss': 'fieldld',
            'UnrecapturedSection1250Gain': 'fieldlc',
            'NetSect1231GainLoss': 'fieldlb',
            'Section179ExpenseDeduction': 'fieldjx',
            'BusinessNameLine1Corpo': 'fieldlw',
            'CorporationEIN': 'fieldlt'
        }
    }

    private k1StatementsMapping: any = {
        "1065": {
            "d1065ScheduleK1Line11": [
                { 'element': 'fieldkf', 'name': 'ItemCode', 'value': 'ItemAmount', 'property': 'A' },
                { 'element': 'fieldkd', 'name': 'ItemCode', 'value': 'ItemAmount', 'property': 'B' },
                { 'element': 'fieldkc', 'name': 'ItemCode', 'value': 'ItemAmount', 'property': 'C' },
                { 'element': 'fieldkb', 'name': 'ItemCode', 'value': 'ItemAmount', 'property': 'D' },
                { 'element': 'fieldka', 'name': 'ItemCode', 'value': 'ItemAmount', 'property': 'E' },
                { 'element': 'fieldke', 'name': 'ItemCode', 'value': 'ItemAmount', 'property': 'F' }
            ],

            "dSelfEmploymentEarningsLoss": [
                { 'element': 'fieldix', 'name': 'fieldaa', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldiw', 'name': 'fieldaa', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldiv', 'name': 'fieldaa', 'value': 'Amount', 'property': 'C' }
            ],

            "dOtherDeductions": [
                { 'element': 'fieldju', 'name': 'fieldaa', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldju', 'name': 'fieldaa', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldjt', 'name': 'fieldaa', 'value': 'Amount', 'property': 'C' },
                { 'element': 'fieldjs', 'name': 'fieldaa', 'value': 'Amount', 'property': 'D' },
                { 'element': 'fieldjr', 'name': 'fieldaa', 'value': 'Amount', 'property': 'E' },
                { 'element': 'fieldjq', 'name': 'fieldaa', 'value': 'Amount', 'property': 'F' },
                { 'element': 'fieldjp', 'name': 'fieldaa', 'value': 'Amount', 'property': 'G' },
                { 'element': 'fieldjo', 'name': 'fieldaa', 'value': 'Amount', 'property': 'H' },
                { 'element': 'fieldjn', 'name': 'fieldaa', 'value': 'Amount', 'property': 'I' },
                { 'element': 'fieldjm', 'name': 'fieldaa', 'value': 'Amount', 'property': 'J' },
                { 'element': 'fieldjl', 'name': 'fieldaa', 'value': 'Amount', 'property': 'K' },
                { 'element': 'fieldjk', 'name': 'fieldaa', 'value': 'Amount', 'property': 'L' },
                { 'element': 'fieldjj', 'name': 'fieldaa', 'value': 'Amount', 'property': 'M' },
                { 'element': 'fieldji', 'name': 'fieldaa', 'value': 'Amount', 'property': 'N' },
                { 'element': 'fieldjg', 'name': 'fieldaa', 'value': 'Amount', 'property': 'O' },
                { 'element': 'fieldjf', 'name': 'fieldaa', 'value': 'Amount', 'property': 'P' },
                { 'element': 'fieldje', 'name': 'fieldaa', 'value': 'Amount', 'property': 'Q' },
                { 'element': 'fieldjd', 'name': 'fieldaa', 'value': 'Amount', 'property': 'R' },
                { 'element': 'fieldjc', 'name': 'fieldaa', 'value': 'Amount', 'property': 'S' },
                { 'element': 'fieldjb', 'name': 'fieldaa', 'value': 'Amount', 'property': 'T' },
                { 'element': 'fieldja', 'name': 'fieldaa', 'value': 'Amount', 'property': 'T' },
                { 'element': 'fieldiz', 'name': 'fieldaa', 'value': 'Amount', 'property': 'T' },
                { 'element': 'fieldiy', 'name': 'fieldaa', 'value': 'Amount', 'property': 'W' }
            ],

            "dTaxExemptIncomeNondedExpenses": [
                { 'element': 'fieldgz', 'name': 'fieldaa', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldgy', 'name': 'fieldaa', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldgx', 'name': 'fieldaa', 'value': 'Amount', 'property': 'C' }
            ],

            "dDistributions": [
                { 'element': 'fieldgt', 'name': 'fieldaa', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldgs', 'name': 'fieldaa', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldgr', 'name': 'fieldaa', 'value': 'Amount', 'property': 'C' }
            ],

            "dCreditsAndCreditRecapture": [
                { 'element': 'fieldit', 'name': 'fieldaa', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldis', 'name': 'fieldaa', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldir', 'name': 'fieldaa', 'value': 'Amount', 'property': 'C' },
                { 'element': 'fieldiq', 'name': 'fieldaa', 'value': 'Amount', 'property': 'D' },
                { 'element': 'fieldip', 'name': 'fieldaa', 'value': 'Amount', 'property': 'E' },
                { 'element': 'fieldio', 'name': 'fieldaa', 'value': 'Amount', 'property': 'F' },
                { 'element': 'fieldin', 'name': 'fieldaa', 'value': 'Amount', 'property': 'G' },
                { 'element': 'fieldim', 'name': 'fieldaa', 'value': 'Amount', 'property': 'H' },
                { 'element': 'fieldil', 'name': 'fieldaa', 'value': 'Amount', 'property': 'I' },
                { 'element': 'fieldik', 'name': 'fieldaa', 'value': 'Amount', 'property': 'J' },
                { 'element': 'fieldij', 'name': 'fieldaa', 'value': 'Amount', 'property': 'K' },
                { 'element': 'fieldii', 'name': 'fieldaa', 'value': 'Amount', 'property': 'L' },
                { 'element': 'fieldih', 'name': 'fieldaa', 'value': 'Amount', 'property': 'M' },
                { 'element': 'fieldig', 'name': 'fieldaa', 'value': 'Amount', 'property': 'N' },
                { 'element': 'fieldif', 'name': 'fieldaa', 'value': 'Amount', 'property': 'O' }
            ],

            "d1065OtherInformation": [
                { 'element': 'fieldgp', 'name': 'fieldab', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldgo', 'name': 'fieldab', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldgn', 'name': 'fieldab', 'value': 'Amount', 'property': 'C' },
                { 'element': 'fieldgm', 'name': 'fieldab', 'value': 'Amount', 'property': 'D' },
                { 'element': 'fieldgl', 'name': 'fieldab', 'value': 'Amount', 'property': 'E' },
                { 'element': 'fieldgj', 'name': 'fieldab', 'value': 'Amount', 'property': 'F' },
                { 'element': 'fieldgi', 'name': 'fieldab', 'value': 'Amount', 'property': 'G' },
                { 'element': 'fieldgh', 'name': 'fieldab', 'value': 'Amount', 'property': 'H' },
                { 'element': 'fieldgg', 'name': 'fieldab', 'value': 'Amount', 'property': 'I' },
                { 'element': 'fieldgf', 'name': 'fieldab', 'value': 'Amount', 'property': 'J' },
                { 'element': 'fieldge', 'name': 'fieldab', 'value': 'Amount', 'property': 'K' },
                { 'element': 'fieldgd', 'name': 'fieldab', 'value': 'Amount', 'property': 'L' },
                { 'element': 'fieldgc', 'name': 'fieldab', 'value': 'Amount', 'property': 'M' },
                { 'element': 'fieldgb', 'name': 'fieldab', 'value': 'Amount', 'property': 'N' },
                { 'element': 'fieldfo', 'name': 'fieldab', 'value': 'Amount', 'property': 'AH' }
            ],

            "dAMTItems": [
                { 'element': 'fieldhh', 'name': 'fieldab', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldhg', 'name': 'fieldab', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldhf', 'name': 'fieldab', 'value': 'Amount', 'property': 'C' },
                { 'element': 'fieldhe', 'name': 'fieldab', 'value': 'Amount', 'property': 'D' },
                { 'element': 'fieldhd', 'name': 'fieldab', 'value': 'Amount', 'property': 'E' },
                { 'element': 'fieldhc', 'name': 'fieldab', 'value': 'Amount', 'property': 'F' }
            ]
        },
        "1120s": {
            "d1120SSchK1Line10": [
                { 'element': 'fieldkf', 'name': 'fieldaa', 'value': 'Amount', 'property': 'A' },
                { 'element': 'fieldkd', 'name': 'fieldaa', 'value': 'Amount', 'property': 'B' },
                { 'element': 'fieldkc', 'name': 'fieldaa', 'value': 'Amount', 'property': 'C' },
                { 'element': 'fieldkb', 'name': 'fieldaa', 'value': 'Amount', 'property': 'D' },
                { 'element': 'fieldka', 'name': 'fieldaa', 'value': 'Amount', 'property': 'E' },
                { 'element': 'fieldk1', 'name': 'fieldaa', 'value': 'Amount', 'property': 'F' }
            ],
            "dotherDeductions2Type1": [
                { 'element': 'fieldjv', 'name': 'Type1', 'value': 'Amount1', 'property': 'A' },
                { 'element': 'fieldju', 'name': 'Type1', 'value': 'Amount1', 'property': 'B' },
                { 'element': 'fieldjt', 'name': 'Type1', 'value': 'Amount1', 'property': 'C' },
                { 'element': 'fieldjs', 'name': 'Type1', 'value': 'Amount1', 'property': 'D' },
                { 'element': 'fieldjr', 'name': 'Type1', 'value': 'Amount1', 'property': 'E' },
                { 'element': 'fieldjq', 'name': 'Type1', 'value': 'Amount1', 'property': 'F' },
                { 'element': 'fieldjp', 'name': 'Type1', 'value': 'Amount1', 'property': 'G' },
                { 'element': 'fieldjo', 'name': 'Type1', 'value': 'Amount1', 'property': 'H' },
                { 'element': 'fieldjn', 'name': 'Type1', 'value': 'Amount1', 'property': 'I' },
                { 'element': 'fieldjm', 'name': 'Type1', 'value': 'Amount1', 'property': 'J' }
            ],
            "dItemsAffectingShareholderBasis": [
                { 'element': 'fieldgz', 'name': 'fieldaa', 'value': 'Amount6', 'property': 'A' },
                { 'element': 'fieldgy', 'name': 'fieldaa', 'value': 'Amount6', 'property': 'B' },
                { 'element': 'fieldgx', 'name': 'fieldaa', 'value': 'Amount6', 'property': 'C' },
                { 'element': 'fieldgw', 'name': 'fieldaa', 'value': 'Amount6', 'property': 'D' },
                { 'element': 'fieldgv', 'name': 'fieldaa', 'value': 'Amount6', 'property': 'E' }
            ],
            "dOtherInformation": [
                { 'element': 'fieldgp', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'A' },
                { 'element': 'fieldgo', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'B' },
                { 'element': 'fieldgm', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'D' },
                { 'element': 'fieldgl', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'E' },
                { 'element': 'fieldgj', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'F' },
                { 'element': 'fieldgi', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'G' },
                { 'element': 'fieldgh', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'H' },
                { 'element': 'fieldgg', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'I' },
                { 'element': 'fieldgf', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'J' },
                { 'element': 'fieldge', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'K' },
                { 'element': 'fieldgd', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'L' },
                { 'element': 'fieldgc', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'M' },
                { 'element': 'fieldfo', 'name': 'fieldaa', 'value': 'Amount7', 'property': 'Z' }
            ]
        },
        "1041": {
            "dBenefDirectlyApprtnDedGrp": [
                { 'element': 'fieldgz', 'name': 'DirectlyApprtnDeductionsCd', 'value': 'DirectlyApprtnDeductionsAmt', 'property': 'A' },
                { 'element': 'fieldfp', 'name': 'DirectlyApprtnDeductionsCd', 'value': 'DirectlyApprtnDeductionsAmt', 'property': 'B' },
                { 'element': 'fieldey', 'name': 'DirectlyApprtnDeductionsCd', 'value': 'DirectlyApprtnDeductionsAmt', 'property': 'C' }
            ],
            "dBenefFinalYearDeductionGrp": [
                { 'element': 'fieldem', 'name': 'FinalYearDeductionsCd', 'value': 'FinalYearDeductionsAmt', 'property': 'A' },
                { 'element': 'fieldel', 'name': 'FinalYearDeductionsCd', 'value': 'FinalYearDeductionsAmt', 'property': 'B' },
                { 'element': 'fieldek', 'name': 'FinalYearDeductionsCd', 'value': 'FinalYearDeductionsAmt', 'property': 'C' },
                { 'element': 'fieldej', 'name': 'FinalYearDeductionsCd', 'value': 'FinalYearDeductionsAmt', 'property': 'D' },
                { 'element': 'fieldei', 'name': 'FinalYearDeductionsCd', 'value': 'FinalYearDeductionsAmt', 'property': 'E' }
            ],
            "dAMTAdjustmentGrp": [
                { 'element': 'fieldef', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'A' },
                { 'element': 'fieldec', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'B' },
                { 'element': 'fieldea', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'C' },
                { 'element': 'fielddy', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'D' },
                { 'element': 'fielddx', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'E' },
                { 'element': 'fielddv', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'F' },
                { 'element': 'fieldew', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'G' },
                { 'element': 'fieldev', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'H' },
                { 'element': 'fieldeu', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'I' },
                { 'element': 'fielden', 'name': 'AMTAdjustmentCd', 'value': 'AMTItems', 'property': 'J' }
            ],
            "dBenefCrAndCreditRecaptureGrp": [
                { 'element': 'fieldbg', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'R' },
                { 'element': 'fieldbj', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'Q' },
                { 'element': 'fieldbo', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'P' },
                { 'element': 'fieldcp', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'O' },
                { 'element': 'fieldcu', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'N' },
                { 'element': 'fieldds', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'M' },
                { 'element': 'fielddh', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'L' },
                { 'element': 'fielddi', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'K' },
                { 'element': 'fielddj', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'J' },
                { 'element': 'fielddt', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'I' },
                { 'element': 'fielddu', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'H' },
                { 'element': 'fieldcw', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'G' },
                { 'element': 'fielddw', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'F' },
                { 'element': 'fieldcn', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'E' },
                { 'element': 'fieldcq', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'D' },
                { 'element': 'fieldcs', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'C' },
                { 'element': 'fieldct', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'B' },
                { 'element': 'fieldeg', 'name': 'CreditsAndRecaptureCd', 'value': 'CreditsAndRecaptureAmt', 'property': 'A' }
            ],
            "dBenefOtherInformationGrp": [
                { 'element': 'fieldee', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'A' },
                { 'element': 'fieldcc', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'B' },
                { 'element': 'fieldca', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'C' },
                { 'element': 'fieldby', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'D' },
                { 'element': 'fieldbw', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'E' },
                { 'element': 'fieldbr', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'F' },
                { 'element': 'fieldbp', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'G' },
                { 'element': 'fieldbn', 'name': 'F1041K1OtherCd', 'value': 'F1041K1OtherAmt', 'property': 'H' }
            ]
        }
    }

    private stateAndPackageWiseK1s = {
        "CA": {
            "1040": {
                "forms": [
                    { "docName": "dSchCA100SSchK1", "formName": "CA 100S Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dCA541SchK1", "formName": "CA 541 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dSchCA565K1", "formName": "CA 565 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dCA568SchK1", "formName": "CA 568 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchCA100SSchK1", "formName": "CA 100S Schedule K1", "prefixField": "Prefix" },
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dCA541SchK1", "formName": "CA 541 Schedule K1", "prefixField": "Prefix" },
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchCA565K1", "formName": "CA 565 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dCA568SchK1", "formName": "CA 568 Schedule K1", "prefixField": "Prefix" }
                ]
            }
        },
        "NY": {
            "1065": {
                "forms": [
                    { "docName": "dSchNYIT204IP", "formName": "NY IT 204IP", "prefixField": "" },
                    { "docName": "dNYIT204CP", "formName": "NY IT 204CP", "prefixField": "" }
                ]
            }
        },
        "IL": {
            "1040": {
                "forms": [
                    { "docName": "dSchILK1P", "formName": "IL Schedule K1P", "prefixField": "Prefix" },
                    { "docName": "dILSchK1P3", "formName": "IL Schedule K1P 3", "prefixField": "Prefix" },
                    { "docName": "dSchILK1T", "formName": "IL Schedule K1T", "prefixField": "PrefixBusisnessname" },
                    { "docName": "dILSchK1T3", "formName": "IL Schedule K1T 3", "prefixField": "Prefix" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dSchILK1P", "formName": "IL Schedule K1P", "prefixField": "Prefix" },
                    { "docName": "dILSchK1P3", "formName": "IL Schedule K1P 3", "prefixField": "Prefix" },
                    { "docName": "dSchILK1T", "formName": "IL Schedule K1T", "prefixField": "PrefixBusisnessname" },
                    { "docName": "dILSchK1T3", "formName": "IL Schedule K1T 3", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchILK1P", "formName": "IL Schedule K1P", "prefixField": "Prefix" },
                    { "docName": "dILSchK1P3", "formName": "IL Schedule K1P 3", "prefixField": "Prefix" },
                    { "docName": "dSchILK1T", "formName": "IL Schedule K1T", "prefixField": "PrefixBusisnessname" },
                    { "docName": "dILSchK1T3", "formName": "IL Schedule K1T 3", "prefixField": "Prefix" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dSchILK1P", "formName": "IL Schedule K1P", "prefixField": "Prefix" },
                    { "docName": "dILSchK1P3", "formName": "IL Schedule K1P 3", "prefixField": "Prefix" },
                    { "docName": "dSchILK1T", "formName": "IL Schedule K1T", "prefixField": "PrefixBusisnessname" },
                    { "docName": "dILSchK1T3", "formName": "IL Schedule K1T 3", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchILK1P", "formName": "IL Schedule K1P", "prefixField": "Prefix" },
                    { "docName": "dILSchK1P3", "formName": "IL Schedule K1P 3", "prefixField": "Prefix" },
                    { "docName": "dSchILK1T", "formName": "IL Schedule K1T", "prefixField": "PrefixBusisnessname" },
                    { "docName": "dILSchK1T3", "formName": "IL Schedule K1T 3", "prefixField": "Prefix" }
                ]
            },
            "990": {
                "forms": [
                    { "docName": "dSchILK1P", "formName": "IL Schedule K1P", "prefixField": "Prefix" },
                    { "docName": "dILSchK1P3", "formName": "IL Schedule K1P 3", "prefixField": "Prefix" },
                    { "docName": "dSchILK1T", "formName": "IL Schedule K1T", "prefixField": "PrefixBusisnessname" },
                    { "docName": "dILSchK1T3", "formName": "IL Schedule K1T 3", "prefixField": "Prefix" }
                ]
            }
        },
        "PA": {
            "1040": {
                "forms": [
                    { "docName": "dSchPANRK1", "formName": "PA Sch NRK1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchPARK1", "formName": "PA Sch RK1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dSchPANRK1", "formName": "PA Sch NRK1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchPARK1", "formName": "PA Sch RK1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchPANRK1", "formName": "PA Sch NRK1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchPARK1", "formName": "PA Sch RK1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dSchPANRK1", "formName": "PA Sch NRK1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchPARK1", "formName": "PA Sch RK1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchPANRK1", "formName": "PA Sch NRK1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchPARK1", "formName": "PA Sch RK1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "OH": {
            "1041": {
                "forms": [
                    { "docName": "dOHITK1", "formName": "OH IT K1", "prefixField": "" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dOHITK1", "formName": "OH IT K1", "prefixField": "" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dOHITK1", "formName": "OH IT K1", "prefixField": "" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dOHITK1", "formName": "OH IT K1", "prefixField": "" }
                ]
            }
        },
        "VA": {
            "1041": {
                "forms": [
                    { "docName": "dVA770PTESchVK1", "formName": "VA 770 schedule VK1", "prefixField": "" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchVAVK1", "formName": "VA Schedule VK1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1040": {
                "forms": [
                    { "docName": "dSchVAVK1", "formName": "VA Schedule VK1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchVAVK1", "formName": "VA Schedule VK1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "NJ": {
            "1041": {
                "forms": [
                    { "docName": "dNJ1041ScheduleK1", "formName": "NJ 1041 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dNJ1041SBSchK1", "formName": "NJ 1041SB Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchNJ1065SchNJK1", "formName": "NJ 1065 Schedule K1", "prefixField": "" },
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchNJCBT100SSchK1", "formName": "NJ CBT100S Schedule K-1", "prefixField": "" },
                ]
            }
        },
        "MD": {
            "1041": {
                "forms": [
                    { "docName": "dMD504SchK1", "formName": "MD 504 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchMDScheduleK1", "formName": "MD Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1040": {
                "forms": [
                    { "docName": "dSchMDScheduleK1", "formName": "MD Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchMDScheduleK1", "formName": "MD Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "AZ": {
            "1041": {
                "forms": [
                    { "docName": "dAZ141SchK1", "formName": "AZ 141 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dAZ141SchK1NR", "formName": "AZ 141 Schedule K1NR", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dAZ165SchK1", "formName": "AZ 165 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dAZ165SchK1NR", "formName": "AZ 165 Schedule K1 NR", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dAZ120SSchK1", "formName": "AZ 120S Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dAZ120SSchK1NR", "formName": "AZ 120S Schedule K1NR", "prefixField": "" }
                ]
            }
        },
        "SC": {
            "1041": {
                "forms": [
                    { "docName": "dSC1041SchK1", "formName": "SC 1041 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSC1065SchK1", "formName": "SC 1065 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSC1120SSchK1", "formName": "SC 1120S Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "AL": {
            "1041": {
                "forms": [
                    { "docName": "dAL41SchK1", "formName": "AL 41 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSch1065ALSchK1", "formName": "AL 65 Sch K1", "prefixField": "" },
                    { "docName": "dSchALPTECCK1", "formName": "AL Sch PTEC CK1", "prefixField": "" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchALSchK1", "formName": "AL 20S Sch K-1", "prefixField": "" },
                    { "docName": "dSchALPTECCK1", "formName": "AL Sch PTEC CK1", "prefixField": "" }
                ]
            }
        },
        "MA": {
            "1120S": {
                "forms": [
                    { "docName": "dMA355SSchK1", "formName": "MA 355S Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dMASch3K1", "formName": "MA Schedule 3K1", "prefixField": "Prefix" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dMASch2K1", "formName": "MA Schedule 2K1", "prefixField": "Prefix" },
                    { "docName": "dMASch3K1", "formName": "MA Schedule 3K1", "prefixField": "Prefix" }
                ]
            },
            "1040": {
                "forms": [
                    { "docName": "dMASch3K1", "formName": "MA Schedule 3K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dMASch3K1", "formName": "MA Schedule 3K1", "prefixField": "Prefix" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dMASch3K1", "formName": "MA Schedule 3K1", "prefixField": "Prefix" }
                ]
            },
            "990": {
                "forms": [
                    { "docName": "dMASch3K1", "formName": "MA Schedule 3K1", "prefixField": "Prefix" }
                ]
            }
        },
        "UT": {
            "1120S": {
                "forms": [
                    { "docName": "dSchUTTC20sSchK1", "formName": "UT TC20S Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dUTTC41SchK1", "formName": "UT TC 41 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchUTSchK1Partner", "formName": "UT TC65 Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dSchUTSchK1Partner", "formName": "UT TC65 Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "IN": {
            "1040": {
                "forms": [
                    { "docName": "dSchFK1", "formName": "IN Schedule FK1", "prefixField": "" },
                    { "docName": "dINSchK1", "formName": "IN Schedule K1", "prefixField": "" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dSchFK1", "formName": "IN Schedule FK1", "prefixField": "" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dINSchK1", "formName": "IN Schedule K1", "prefixField": "" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dINSchK1", "formName": "IN Schedule K1", "prefixField": "" }
                ]
            }
        },
        "WI": {
            "1040": {
                "forms": [
                    { "docName": "dSchWI3K1", "formName": "WI Schedule 3K1", "prefixField": "" },
                    { "docName": "dSchWI5K1", "formName": "WI Schedule 5K1", "prefixField": "" },
                    { "docName": "dSchWI2K1", "formName": "WI Schedule 2K1", "prefixField": "" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dSchWI3K1", "formName": "WI Schedule 3K1", "prefixField": "" },
                    { "docName": "dSchWI5K1", "formName": "WI Schedule 5K1", "prefixField": "" },
                    { "docName": "dSchWI2K1", "formName": "WI Schedule 2K1", "prefixField": "" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchWI3K1", "formName": "WI Schedule 3K1", "prefixField": "" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchWI5K1", "formName": "WI Schedule 5K1", "prefixField": "" }
                ]
            }
        },
        "MN": {
            "1040": {
                "forms": [
                    { "docName": "dKPINC", "formName": "MN Schedule KPINC", "prefixField": "KPINC" },
                    { "docName": "dKSNC", "formName": "MN Schedule KSNC", "prefixField": "" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dKPINC", "formName": "MN Schedule KPINC", "prefixField": "KPINC" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dKSNC", "formName": "MN Schedule KSNC", "prefixField": "" }
                ]
            }
        },
        "MS": {
            "1040": {
                "forms": [
                    { "docName": "dMS84132P", "formName": "MS 84132P", "prefixField": "" },
                    { "docName": "dMS84132S", "formName": "MS 84132S", "prefixField": "" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dMS84132P", "formName": "MS 84132P", "prefixField": "" },
                    { "docName": "dMS84132S", "formName": "MS 84132S", "prefixField": "" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dMS84132P", "formName": "MS 84132P", "prefixField": "" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dMS84132S", "formName": "MS 84132S", "prefixField": "" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dMS81132", "formName": "MS 81132", "prefixField": "BeneficiaryName" }
                ]
            }
        },
        "CT": {
            "1041": {
                "forms": [
                    { "docName": "dCT1041SchK1", "formName": "CT 1041 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dCTK1T", "formName": "CT Form K1T", "prefixField": "" },
                    { "docName": "dCTSchK1", "formName": "CT Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dCTK1T", "formName": "CT Form K1T", "prefixField": "" },
                    { "docName": "dCTSchK1", "formName": "CT Schedule K1", "prefixField": "Prefix" }
                ]
            }
        },
        "OK": {
            "1041": {
                "forms": [
                    { "docName": "dOK513SchK1", "formName": "OK 513 Schedule K1", "prefixField": "" },
                    { "docName": "dOK513NRSchK1", "formName": "OK 513NR Schedule K1", "prefixField": "Prefix" }
                ]
            }
        },
        "KY": {
            "1041": {
                "forms": [
                    { "docName": "dKY741SchK1", "formName": "KY 741 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dKY765GPSchK1", "formName": "KY 765GP Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dKYSch765K1", "formName": "KY Schedule 765 K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dKYSch720SK1", "formName": "KY Schedule 720SK1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dKYSchGPK1", "formName": "KY Schedule GPK1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "AR": {
            "1065": {
                "forms": [
                    { "docName": "dARSchK1", "formName": "AR Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dARSchK1", "formName": "AR Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dARSchK1", "formName": "AR Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dARSchK1FE", "formName": "AR Schedule K1FE", "prefixField": "" }
                ]
            }
        },
        "OR": {
            "1065": {
                "forms": [
                    { "docName": "dORK1", "formName": "OR Sch K1", "prefixField": "" }
                ]
            }
        },
        "ID": {
            "1040": {
                "forms": [
                    { "docName": "dIDK1", "formName": "ID K1", "prefixField": "Prefix" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dIDK1", "formName": "ID K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dIDK1", "formName": "ID K1", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dIDK1", "formName": "ID K1", "prefixField": "Prefix" }
                ]
            }
        },
        "NE": {
            "1040": {
                "forms": [
                    { "docName": "dSchNEK1N1041", "formName": "NE Schedule K1N1041", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchNEK1N1065", "formName": "NE Schedule K1N1065", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchNEK1N1120", "formName": "NE Schedule K1N1120SN", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dSchNEK1N1041", "formName": "NE Schedule K1N1041", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchNEK1N1065", "formName": "NE Schedule K1N1065", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchNEK1N1120", "formName": "NE Schedule K1N1120SN", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchNEK1N1065", "formName": "NE Schedule K1N1065", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchNEK1N1120", "formName": "NE Schedule K1N1120SN", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "AK": {
            "1065": {
                "forms": [
                    { "docName": "dAK6100SchB", "formName": "AK Schedule 6100 B", "prefixField": "" },
                    { "docName": "dAKSchK1", "formName": "AK Schedule  6900 K1", "prefixField": "Prefix" }
                ]
            }
        },
        "RI": {
            "1065": {
                "forms": [
                    { "docName": "dRISchK1", "formName": "RI Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dRISchK1", "formName": "RI Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "WV": {
            "1120C": {
                "forms": [
                    { "docName": "dWVSchK1Corp", "formName": "WV Sch K1Corp", "prefixField": "" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dWVSchK1", "formName": "WV Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dWVSchK1Dup", "formName": "WV Schedule K1Dup", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dWVSchK1", "formName": "WV Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dWVSchK1Dup", "formName": "WV Schedule K1Dup", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dWVSchK1", "formName": "WV Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dWVSchK1Dup", "formName": "WV Schedule K1Dup", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1040": {
                "forms": [
                    { "docName": "dWVSchK1", "formName": "WV Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "DE": {
            "1041": {
                "forms": [
                    { "docName": "dDE400SchK1", "formName": "DE 400 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dDE300SchK1", "formName": "DE 300 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dDE1100SSchA1", "formName": "DE1100S Schedule A1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "IA": {
            "1040": {
                "forms": [
                    { "docName": "dSchIA1065SchK1", "formName": "IA 1065 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dSchIA1120SSchK1", "formName": "IA 1120S Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchIA1065SchK1", "formName": "IA 1065 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchIA1120SSchK1", "formName": "IA 1120S Schedule K1", "prefixField": "Prefix" }
                ]
            }
        },
        "MT": {
            "1041": {
                "forms": [
                    { "docName": "dMTFIDSchK1", "formName": "MT FID Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dMTSchK1", "formName": "MT Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dMTSchK1", "formName": "MT Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "NC": {
            "1120S": {
                "forms": [
                    { "docName": "dNC401SSchK1", "formName": "NC 401S Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dNCD403SchK1", "formName": "NC D403 Sch K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dNCD403SchK1", "formName": "NC D403 Sch K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dNCD403SchK1", "formName": "NC D403 Sch K1", "prefixField": "PrefixPartnerName" }
                ]
            }
        },
        "VT": {
            "1120S": {
                "forms": [
                    { "docName": "dVTSchK1", "formName": "VT Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dVTSchK1", "formName": "VT Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dVTSchK1VTF", "formName": "VT Schedule K1VT F", "prefixField": "Prefix" }
                ]
            }
        },
        "HI": {
            "1040": {
                "forms": [
                    { "docName": "dHIN20SchK1", "formName": "HI N20 Schedule K1", "prefixField": "Prefix" },
                    { "docName": "dHIN35SchK1", "formName": "HI N35 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dHIN35SchK1", "formName": "HI N35 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dHIN20SchK1", "formName": "HI N20 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dHIN40SchK1", "formName": "HI N40 Schedule K1", "prefixField": "Prefix" }
                ]
            }
        },
        "ND": {
            "1040": {
                "forms": [
                    { "docName": "dND1041SchK1", "formName": "ND 38 Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchND1065SchK1", "formName": "ND 58 Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchND1120SSchK1", "formName": "ND 60 Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dSchND1120SSchK1", "formName": "ND 60 Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchNDK1Received", "formName": "ND Schedule K1 Recieved", "prefixField": "" }
                ]
            },
            "1065": {
                "forms": [
                    { "docName": "dSchND1065SchK1", "formName": "ND 58 Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchNDK1Received", "formName": "ND Schedule K1 Recieved", "prefixField": "" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dND1041SchK1", "formName": "ND 38 Schedule K1", "prefixField": "PrefixPartnerName" },
                    { "docName": "dSchNDK1Received", "formName": "ND Schedule K1 Recieved", "prefixField": "" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dSchNDK1Received", "formName": "ND Schedule K1 Recieved", "prefixField": "" }
                ]
            }
        },
        "FEDERAL": {
            "1065": {
                "forms": [
                    { "docName": "dSchK1", "formName": "1065 Schedule K1", "prefixField": "PrefixPartnerName" }
                ]
            },
            "1040": {
                "forms": [
                    { "docName": "dSchK1PS", "formName": "Sch K1PS", "prefixField": "fieldlw" }
                ]
            },
            "1120S": {
                "forms": [
                    { "docName": "dScheduleK1", "formName": "1120S Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1041": {
                "forms": [
                    { "docName": "dSchedule1041K1", "formName": "1041 Schedule K1", "prefixField": "Prefix" }
                ]
            },
            "1120C": {
                "forms": [
                    { "docName": "dSch8865SchK1", "formName": "Sch8865SchK1", "prefixField": "" }
                ]
            }
        }
    }

    private amendedFormConfig = {
        "federal": {
            "1040": [{ isField: false, docName: "d1040X" }],
            "1065": [
                { isField: false, docName: "d1065X" },
                { isField: true, fieldName: "d1065.AmendedReturn", docName: "d1065", value: "1" },
            ],
            "1120": [{ isField: false, docName: "d1120X" }],
            "1120s": [{ isField: false, docName: "d1120X" }],
        },
        "ak": {
            "1120s": [
                { isField: true, fieldName: "dAK6100.AmendedChk", docName: "dAK6100", value: true },
                { isField: true, fieldName: "dAK6020.AddressChangeIndicator", docName: "dAK6020", value: true }
            ],
            "1120": [{ isField: true, fieldName: "dAK6020.AddressChangeIndicator", docName: "dAK6020", value: true }],
            "1065": [{ isField: true, fieldName: "dAK6900.AmendedChk", docName: "dAK6900", value: true }]
        },
        "de": {
            "1120": [{ isField: false, docName: "dDE1100X" }],
            "1120s": [{ isField: true, fieldName: "dDE1100S.amendreturn", docName: "dDE1100S", value: true }],
            "1040": [
                { isField: false, docName: "dDE2001X" },
                { isField: false, docName: "dDE20002X" }
            ],
            "1065": [{ isField: true, fieldName: "dDE300.AMENDEDRETURN", docName: "dDE300", value: true }]
        },
        "fl": {
            "1120s": [{ isField: false, docName: "dF1120X" }],
            "1120": [{ isField: false, docName: "dF1120X" }],
        },
        "hi": {
            "1120s": [{ isField: true, fieldName: "dHIN35.AmendedReturn", docName: "dHIN35", value: true }],
            "1120": [{ isField: true, fieldName: "dHIN30.AmendedReturn", docName: "dHIN30", value: true }],
            "990": [{ isField: true, fieldName: "dHIN70NP.AMENDED", docName: "dHIN70NP", value: true }],
            "1040": [
                { isField: true, fieldName: "dHIN11.AmendedReturn", docName: "dHIN11", value: true },
                { isField: true, fieldName: "dHIN15.AMENDEDReturn", docName: "dHIN15", value: true }
            ],
            "1065": [{ isField: true, fieldName: "dHIN20.AmendedChk", docName: "dHIN20", value: true }]
        },
        "mo": {
            "1120": [{ isField: true, fieldName: "dMO1120.AmendedReturnChk", docName: "dMO1120", value: true }],
            "1120s": [{ isField: true, fieldName: "dMO1120S.AmendedReturn", docName: "dMO1120S", value: true }],
            "1040": [{ isField: true, fieldName: "dMO1040.AMENDEDRETURN", docName: "dMO1040", value: true }],
            "1065": [{ isField: true, fieldName: "dMO1065.AmendedReturn", docName: "dMO1065", value: "1" }],
        },
        "ne": {
            "1120": [{ isField: false, docName: "dNE1120XN" }],
            "1120s": [{ isField: true, fieldName: "dNE1120SN.AmendedReturn", docName: "dNE1120SN", value: true }],
            "1040": [{ isField: false, docName: "dNE1040XN" }],
            "1065": [{ isField: true, fieldName: "dNE1065N.AmendedChk", docName: "dNE1065N", value: true }],
        },
        "nh": {
            "1120": [{ isField: true, fieldName: "dNHBTSummary.AMENDEDRETURN", docName: "dNHBTSummary", value: true }],
            "1120s": [{ isField: true, fieldName: "dNHBTSummary.AMENDEDRETURN", docName: "dNHBTSummary" }],
            "1040": [
                { isField: true, fieldName: "dNHBTSummary.AMENDEDRETURN", docName: "dNHBTSummary", value: true },
                { isField: true, fieldName: "dNHDP10.amendedreturn", docName: "dNHDP10", value: true }
            ],
            "1065": [{ isField: true, fieldName: "dNHBTSummary.AMENDEDRETURN", docName: "dNHBTSummary", value: true }],
        },
        "ri": {
            "1120": [{ isField: true, fieldName: "dRI1120C.Amendedchk", docName: "dRI1120C", value: true }],
            "1120s": [
                { isField: true, fieldName: "dRI1120S.AmendedChk", docName: "dRI1120S", value: true },
                { isField: true, fieldName: "dRI1096PT.TypeOfReturn", docName: "dRI1096PT", value: "1" }
            ],
            "1040": [
                { isField: true, fieldName: "dRI1040L.Amended", docName: "dRI1040L", value: true },
                { isField: true, fieldName: "dRI1040NR.AmendedChk", docName: "dRI1040NR", value: true }
            ],
            "1065": [
                { isField: true, fieldName: "dRI1065.AmendedReturn", docName: "dRI1065", value: true },
                { isField: true, fieldName: "dRI1096PT.TypeOfReturn", docName: "dRI1096PT", value: "1" }
            ],
            "1041": [{ isField: true, fieldName: "dRI1096PT.TypeOfReturn", docName: "dRI1096PT", value: "1" }],
        },
        "tn": {
            "1120": [{ isField: true, fieldName: "dTNFAE170.TypeOfFiling", docName: "dTNFAE170", value: true }],
            "1120s": [{ isField: true, fieldName: "dTNFAE170.TypeOfFiling", docName: "dTNFAE170", value: true }],
            "1040": [
                { isField: true, fieldName: "dTNFAE170.TypeOfFiling", docName: "dTNFAE170", value: true },
                { isField: true, fieldName: "dTNINC250.AMENDEDRETURN", docName: "dTNINC250", value: true }
            ],
            "1065": [{ isField: true, fieldName: "dTNFAE170.TypeOfFiling", docName: "dTNFAE170", value: true }],
        },
        'il': {
            "1120": [
                { isField: false, docName: "dIL1120X" },
                { isField: false, docName: "dIL1120XV" }
            ],
            "1120s": [
                { isField: false, docName: "dIL1120STX" },
                { isField: false, docName: "dIL1120STXV" }
            ],
            "990": [
                { isField: false, docName: "dIL990TX" },
                { isField: false, docName: "dIL990TXV" }
            ],
            "1040": [{ isField: false, docName: "dIL1040X" }],
        },
        "al": {
            "1040": [
                { isField: false, docName: "dAL40" },
                { isField: true, fieldName: "dAL40.amended", docName: "dAL40", value: true },
                { isField: false, docName: "dAL40NR" },
                { isField: true, fieldName: "dAL40NR.AMENDEDRETURN", docName: "dAL40NR", value: true }
            ],
            "1065": [
                { isField: false, docName: "dAL65" },
                { isField: true, fieldName: "dAL65.AmendedReturn", docName: "dAL65", value: true },
            ],
            "1120": [
                { isField: false, docName: "dAL20C" },
                { isField: true, fieldName: "dAL20C.AmendedReturn", docName: "dAL20C", value: true },
            ],
            "1120s": [
                { isField: false, docName: "dAL20S" },
                { isField: true, fieldName: "dAL20S.AmendedReturnchk", docName: "dAL20S", value: true },
            ]
        },
        "ca": {
            "1040": [
                { isField: false, docName: "dCA540" },
                { isField: true, fieldName: "dCA540.AMENDEDReturn", docName: "dCA540", value: true },
                { isField: false, docName: "dCA540NR" },
                { isField: true, fieldName: "dCA540NR.Amended", docName: "dCA540NR", value: true }
            ],
            "1065": [
                { isField: false, docName: "dCA565" },
                { isField: true, fieldName: "dCA565.AmendedReturn2", docName: "dCA565", value: true },
                { isField: false, docName: "d1065CIS" },
                { isField: true, fieldName: "dCAForm568.AmendedReturn", docName: "dCAForm568", value: true }
            ],
            "1120": [
                { isField: false, docName: "dCA100X" }
            ],
            "1120s": [
                { isField: false, docName: "dCA100X" }
            ]
        },
        "co": {
            "1040": [
                { isField: false, docName: "dCO104X" }
            ],
            "1065": [
                { isField: false, docName: "dCO106" },
                { isField: true, fieldName: "dCO106.amendedreturn", docName: "dCO106", value: true },
            ],
            "1120": [
                { isField: false, docName: "dCO112X" }
            ],
            "1120s": [
                { isField: false, docName: "dCO106" },
                { isField: true, fieldName: "dCO106.amendedreturn", docName: "dCO106", value: true },
            ]
        },
        "in": {
            "1040": [
                { isField: false, docName: "dINIT40X" }
            ],
            "1065": [
                { isField: false, docName: "dINIT65" },
                { isField: true, fieldName: "dINIT65.AmendedChk", docName: "dINIT65", value: true },
            ],
            "1120": [
                { isField: false, docName: "dINIT20X" }
            ],
            "1120s": [
                { isField: false, docName: "dINIT20S" },
                { isField: true, fieldName: "dINIT20S.AmendedChk", docName: "dINIT20S", value: true },
            ]
        },
        "la": {
            "1040": [
                { isField: false, docName: "dLAIT540" },
                { isField: true, fieldName: "dLAIT540.AmendedReturnIndicator", docName: "dLAIT540", value: true },
                { isField: false, docName: "dLAIT540B" },
                { isField: true, fieldName: "dLAIT540B.AmendedReturnIndicator", docName: "dLAIT540B", value: true }
            ],
            "1065": [
                { isField: false, docName: "dLAIT565" },
                { isField: true, fieldName: "dLAIT565.AmendedReturnChk", docName: "dLAIT565", value: true },
            ],
            "1120": [
                { isField: false, docName: "dLACIFT620" },
                { isField: true, fieldName: "dLACIFT620.AmendedReturn", docName: "dLACIFT620", value: true },
            ],
            "1120s": [
                { isField: false, docName: "dLACIFT620" },
                { isField: true, fieldName: "dLACIFT620.AmendedReturn", docName: "dLACIFT620", value: true },
            ]
        },
        "nc": {
            "1040": [
                { isField: false, docName: "dNCD400" },
                { isField: true, fieldName: "dNCD400.AMENDEDCheck", docName: "dNCD400", value: true }
            ],
            "1065": [
                { isField: false, docName: "dNCD403" },
                { isField: true, fieldName: "dNCD403.AmendedChk", docName: "dNCD403", value: true },
            ],
            "1120": [
                { isField: false, docName: "dNCCD405" },
                { isField: true, fieldName: "dNCCD405.AmendedReturn", docName: "dNCCD405", value: true },
            ],
            "1120s": [
                { isField: false, docName: "dNCCD401S" },
                { isField: true, fieldName: "dNCCD401S.AmendedReturn", docName: "dNCCD401S", value: true },
            ]
        },
        "nm": {
            "1040": [
                { isField: false, docName: "dNMPITX" }
            ],
            "1065": [
                { isField: false, docName: "dNMPTE" },
                { isField: true, fieldName: "dNMPTE.OriginalReturnorAmendedorStateOnly", docName: "dNMPTE", value: "3" },
            ],
            "1120": [
                { isField: false, docName: "dNMCIT1" },
                { isField: true, fieldName: "dNMCIT1.Amended", docName: "dNMCIT1", value: "2" },
            ],
            "1120s": [
                { isField: false, docName: "dNMSCorp" },
                { isField: true, fieldName: "dNMSCorp.OriginalReturnorAmendedorStateonly", docName: "dNMSCorp", value: "2" },
            ]
        },
        "or": {
            "1040": [
                { isField: false, docName: "dOR40" },
                { isField: true, fieldName: "dOR40.AmendedReturn", docName: "dOR40", value: true },
                { isField: false, docName: "dOR40N" },
                { isField: true, fieldName: "dOR40N.AmendedReturn", docName: "dOR40N", value: true },
                { isField: false, docName: "dOR40P" },
                { isField: true, fieldName: "dOR40P.AmendedReturn", docName: "dOR40P", value: true }
            ],
            "1065": [
                { isField: false, docName: "dOR65" },
                { isField: true, fieldName: "dOR65.AmendedReturm", docName: "dOR65", value: true },
            ],
            "1120": [
                { isField: false, docName: "dFormOR20" },
                { isField: true, fieldName: "dFormOR20.OR20Amended", docName: "dFormOR20", value: true },
            ],
            "1120s": [
                { isField: false, docName: "dOR20S" },
                { isField: true, fieldName: "dOR20S.AmendedCheckbox", docName: "dOR20S", value: true },
            ]
        },
        "ct": {
            "1040": [
                { isField: false, docName: "dCT1040X" }
            ],
            "1065": [
                { isField: true, fieldName: "dCT10651120SI.AmendedReturnPassT", docName: "dCT10651120SI", value: true },
            ],
            "1120": [
                { isField: false, docName: "dCT1120X" }
            ],
            "1120s": [
                { isField: true, fieldName: "dCT10651120SI.AmendedReturnPassT", docName: "dCT10651120SI", value: true },
            ],
            "1041": [
                { isField: true, fieldName: "dCT1041.Amendedreturn", docName: "dCT1041", value: true }
            ]
        },
        "ks": {
            "1040": [
                { isField: true, fieldName: "dKSK40.AmendedReturn", docName: "dKSK40", value: "1" },
            ],
            "1065": [
                { isField: true, fieldName: "dKS120S.ShortPeriodReturnIndicator", docName: "dKS120S", value: true },
            ],
            "1120": [
                { isField: true, fieldName: "dKS120.AMENDEDRetuern", docName: "dKS120", value: true },
            ],
            "1120s": [
                { isField: true, fieldName: "dKS120S.ShortPeriodReturnIndicator", docName: "dKS120S", value: true },
            ],
            "1041": [
                { isField: true, fieldName: "dKSK41.AmendedReturn", docName: "dKSK41", value: true }
            ]
        },
        "ky": {
            "1040": [
                { isField: false, docName: "dKY740X" },
            ],
            "1065": [
                { isField: true, fieldName: "dKY765.AmendedReturnInd", docName: "dKY765", value: true },
            ],
            "1120": [
                { isField: true, fieldName: "dKY720.AmendedReturn", docName: "dKY720", value: true },
            ],
            "1120s": [
                { isField: true, fieldName: "dKY720S.AmendedReturnInd", docName: "dKY720S", value: true },
            ],
            "1041": [
                { isField: true, fieldName: "dKY741.AmendenInd", docName: "dKY741", value: true }
            ]
        },
        "nd": {
            "1040": [
                { isField: true, fieldName: "dND1.AmendedreturnGeneral", docName: "dND1", value: true },
            ],
            "1065": [
                { isField: true, fieldName: "dND58.Amendedreturn", docName: "dND58", value: true },
            ],
            "1120": [
                { isField: false, docName: "dND40X" },
            ],
            "1120s": [
                { isField: true, fieldName: "dND60.Amendedreturn", docName: "dND60", value: true },
            ],
            "1041": [
                { isField: true, fieldName: "dND38.Amendedreturn", docName: "dND38", value: true }
            ]
        },
        "nj": {
            "1040": [
                { isField: false, docName: "dNJ1040X" },
                { isField: true, fieldName: "dNJ1040NR.AmendReturnCheck", docName: "dNJ1040NR", value: true }
            ],
            "1065": [
                { isField: true, fieldName: "dNJForm1065.AmendedReturnChk", docName: "dNJForm1065", value: true },
            ]
        },
        "pa": {
            "1040": [
                { isField: false, docName: "dPA40X" },
                { isField: true, fieldName: "dPA40.Amended", docName: "dPA40", value: true }
            ],
            "1065": [
                { isField: true, fieldName: "dPA20S65.AmendedRtn", docName: "dPA20S65", value: true },
            ],
            "1120": [
                { isField: false, docName: "dPAREV1175SchAR" },
                { isField: true, fieldName: "dPARCT101.AmendedReport", docName: "dPARCT101", value: true }
            ],
            "1120s": [
                { isField: true, fieldName: "dPA20S65.AmendedRtn", docName: "dPA20S65", value: true },
            ],
            "1041": [
                { isField: false, docName: "dPA41X" },
                { isField: true, fieldName: "dPA41.FiscalYrFiler", docName: "dPA41", value: true },
            ]
        },
        "sc": {
            "1040": [
                { isField: false, docName: "dSC1040X" },
                { isField: true, fieldName: "dSC1040.AmendedReturnchk", docName: "dSC1040", value: true }
            ],
            "1065": [
                { isField: true, fieldName: "dSC1065.AmendedReturn", docName: "dSC1065", value: "1" },
            ],
            "1120": [
                { isField: true, fieldName: "dSC1120.AmendedReturnIndicator", docName: "dSC1120", value: true }
            ],
            "1120s": [
                { isField: true, fieldName: "dSC1120S.AmendedReturnIndicator", docName: "dSC1120S", value: true },
            ]
        },
        "va": {
            "1040": [
                { isField: true, fieldName: "dVA760.AmendedReturnChkbx", docName: "dVA760", value: true },
                { isField: true, fieldName: "dVA760PY.AmendedReturnChkbx", docName: "dVA760PY", value: true },
                { isField: true, fieldName: "dVA763.AmendedReturnChkbx", docName: "dVA763", value: true }
            ],
            "1065": [
                { isField: true, fieldName: "dVA502.AmendedReturnChkbx", docName: "dVA502", value: true },
            ],
            "1120": [
                { isField: true, fieldName: "dVA500.AmendedReturnChkbx", docName: "dVA500", value: true }
            ],
            "1120s": [
                { isField: true, fieldName: "dVA502.AmendedReturnChkbx", docName: "dVA502", value: true },
            ],
            "1041": [
                { isField: true, fieldName: "dVA770.Amended", docName: "dVA770", value: true },
            ]
        },
        "vt": {
            "1040": [
                { isField: true, fieldName: "dVTIN111.AMENDEDCheck", docName: "dVTIN111", value: true }
            ],
            "1065": [
                { isField: true, fieldName: "dVTBI471.AMENDEDChk", docName: "dVTBI471", value: true },
            ],
            "1120": [
                { isField: true, fieldName: "dVTCO411.AmendedReturn", docName: "dVTCO411", value: true }
            ],
            "1120s": [
                { isField: true, fieldName: "dVTBI471.AMENDEDChk", docName: "dVTBI471", value: true },
            ],
            "1041": [
                { isField: true, fieldName: "dVTFI161.AMENDED", docName: "dVTFI161", value: true },
            ]
        },
        "wv": {
            "1040": [
                { isField: true, fieldName: "dWVIT140.AmendedReturn", docName: "dWVIT140", value: true }
            ],
            "1065": [
                { isField: true, fieldName: "dWV100.AmendedReturn", docName: "dWV100", value: true },
            ],
            "1120": [
                { isField: true, fieldName: "dWV120.Amended", docName: "dWV120", value: true }
            ],
            "1120s": [
                { isField: true, fieldName: "dWV100.AmendedReturn", docName: "dWV100", value: true },
            ],
            "1041": [
                { isField: true, fieldName: "dWV141.Amended", docName: "dWV141", value: true },
            ]
        }
    }

    //licence value 
    private licenseName: any = {
        "FREE": { value: "FREE", displayText: "Free Trial" }
    }

    //This config helps to show key
    private _keyboardShortcutHelpEnableFor = ['home', 'return/edit', 'return/interview'];

    //collect state wise refund status links
    private _refundStatusLinksCollection = {};

    // vita customer location id
    private vitaCustomerLocation: string = 'L-bd2cbd37-6042-45a3-9ae1-19f938c855a5'

    constructor(
        private _injector: Injector,
        private _commonApiService: CommonAPIService) { }

    /**
     * @author Heena Bhesaniya
     * @description return the vita customer location  id
     */
    public getVitaCustomerLocation() {
        return this.vitaCustomerLocation;
    }

    /**
    * @author Heena Bhesaniya
    * @description This method returns the k1 mapping data while import the schedule K1.
    * @param packageName contains packageName for which it wants mapping data.
    */
    public getK1MappingData(packageName) {
        if (this.k1MappingData[packageName] !== undefined) {
            return this.k1MappingData[packageName];
        } else {
            return '';
        }
    }

    /**
    * @author Heena Bhesaniya
    * @description This method return the k1 mapping data of statements.
    * @param packageName
    * contains packageName for which it wants data.
    */
    public getK1StatementsMapping(packageName) {
        if (this.k1StatementsMapping[packageName] !== undefined) {
            return this.k1StatementsMapping[packageName];
        } else {
            return '';
        }
    }

    /**
     * @author Heena Bhesaniya
     * @description This method gives refund status link related to given state name
     */
    public loadRefundStatusLinks() {
        //Check if links already exist or not, if exist then do nothing
        if (Object.keys(this._refundStatusLinksCollection).length <= 0 || this._refundStatusLinksCollection == undefined) {
            const self = this;
            self._commonApiService.getPromiseResponse({ apiName: APINAME.GET_REFUNDSTATUS_LINKS, methodType: 'get' }).then((response: any) => {
                self._refundStatusLinksCollection = response.data;
            }, error => {
                console.error(error);
            });
        }
    };

    /**
   * @author Heena Bhesaniya
   * @description This function returns the link of given state name
   * @param stateName pass stateName 
   */
    public getRefundStatusLink(stateName) {
        if (this._refundStatusLinksCollection[stateName] != undefined) {
            return this._refundStatusLinksCollection[stateName];
        } else {
            return '';
        }
    };

    /**
     * @author Heena Bhesaniya
     * @description This function returns the link of given state name
     * @param currentPath pass current path
     */
    public isKeyboardShortcutsHelpAllowed(currentPath) {
        //check in configuration and decide to enable shortcut help on current path
        for (let index in this._keyboardShortcutHelpEnableFor) {
            if (currentPath.indexOf(this._keyboardShortcutHelpEnableFor[index]) > -1) {
                return true;

            }
        }
        //if current path does not exist in configuaration then return false

        return false;
    };

    /**
    * @author Heena Bhesaniya
    * @description this function retun all country details
    */
    public getCountryDetail() {
        return this._countryDetails;
    };

    /**
    * @author Heena Bhesaniya
    * @description Here packages are stored in local variable and return through service.
    */
    public getReleasedPackages() {
        let userService = this._injector.get(UserService);
        let taxYear = userService.getTaxYear();
        // const localUtilityService = this._injector.get(LocalStorageUtilityService);
        // let taxYear = localUtilityService.getFromLocalStorage('taxYear');
        return this.config.packages.filter(function (packageObj) {
            return packageObj.isReleased == true && packageObj.availableForTaxYear.indexOf(taxYear) >= 0;
        });
    };

    /**
     * @author Heena Bhesaniya
     * @description return return status value
     */
    public getReturnStatus() {
        return this.config.returnStatus;
    };

    /**
     * @author Heena Bhesaniya
     * @description This function returns available tax years
     */
    public getAvailableTaxYears() {
        return this.config.availableTaxYears.filter(function (obj) {
            return obj.isReleased == true;
        });
    };

    /**
     * @author Heena Bhesaniya
     * @description  this function return current tax year
     */
    public getCurrentTaxYear() {
        return this._currentTaxYear;
    };

    /**
     * @author Heena Bhesaniya
     * @description This function returns the colors of perform review and form fields
     * @param key 
     */
    public getColorPreferences(key) {
        if (key == undefined) {
            return this.colorPreference;
        } else {
            return this.colorPreference[key];
        }
    };

    /**
     * @author Heena Bhesaniya
     * @description This function returns the element name of fields of forms to perform autoAddState
     * @param key 
     */
    getAutoAddStatePreferences(key?: any) {
        if (key == undefined) {
            return this.autoAddStatePreferences;
        } else {
            return this.autoAddStatePreferences[key];
        }
    };

    /**
     * @author Heena Bhesaniya
     * @description This Function returns efin status lookup
     */
    getEfinStatusLookup() {
        return this.efinStatusLookup;
    };

    /**
     * @author Heena Bhesaniya
     * @description  return signature type lookup
     */
    getsignatureTypeLookup() {
        return this.signatureTypeLookup;
    };

    /**
     * @author Heena Bhesaniya
     * @description This function will return value and display text for eFilestatus
     */
    getEfileStatusLookup() {
        return this.eFileStatusLookup;
    }

    /**
     * @author Heena Bhesaniya
     * @description return value of licence display text
     * @param name 
     */
    getLicenseDisplayText(name) {
        if (this.licenseName && this.licenseName[name] && this.licenseName[name].value == name) {
            return this.licenseName[name].displayText;
        } else {
            return name;
        }
    }

    /**
     * @author Hannan Desai
     * @param stateName 
     *          Holds state name
     * @param packageName 
     *          Holds package name
     * @description
     *          This function is used to get available k1s doc list based on statename and packageName.
     */
    public getStateAndPackageWiseK1s(stateName: string, packageName: string): Array<any> {
        if (this.stateAndPackageWiseK1s[stateName] && this.stateAndPackageWiseK1s[stateName][packageName]) {
            return this.stateAndPackageWiseK1s[stateName][packageName].forms;
        } else {
            return [];
        }
    }

    /**
     * @author Hannan Desai
     * @param stateName
     *          Holds state name
     * @param packageName
     *          Holds package name
     * @description
     *          This function is used to get amended form config based on state and packagename.
     */
    public getStateAndPackageWiseAmendedConfig(stateName: string, packageName: string): Array<any> {
        if (this.amendedFormConfig[stateName] && this.amendedFormConfig[stateName][packageName]) {
            return this.amendedFormConfig[stateName][packageName]
        } else {
            return [];
        }
    }
}