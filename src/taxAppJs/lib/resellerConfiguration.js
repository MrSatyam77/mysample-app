var resellerHostnames = {
    'taxvision': ['taxvision.advanced-taxsolutions.com', 'taxvisioncloud.com', 'www.taxvisioncloud.com', 'www.app-taxvisioncloud.com', 'app-taxvisioncloud.com'],
    'empiretax': ['empiretax.advanced-taxsolutions.com', 'app-empiretax.org', 'www.app-empiretax.org'],
    'tsg': ['tsg.advanced-taxsolutions.com', 'app-tsgtaxpros.com', 'www.app-tsgtaxpros.com'],
    'siglo': ['siglo.advanced-taxsolutions.com', 'app-siglosoftware.com', 'www.app-siglosoftware.com'],
    'co9': ['co9.advanced-taxsolutions.com', 'app-co9taxsoftware.com', 'www.app-co9taxsoftware.com'],
    'uplus': ['uplus.advanced-taxsolutions.com', 'app-uplustaxsoftware.com', 'www.app-uplustaxsoftware.com'],
    'trooblr': ['trooblr.advanced-taxsolutions.com', 'app-trooblrtaxoffice.com', 'www.app-trooblrtaxoffice.com'],
    'incomeusa': ['incomeusa.advanced-taxsolutions.com', 'app-incomeandinsurance.com', 'www.app-incomeandinsurance.com'],
    'sam': ['sam.advanced-taxsolutions.com', 'app-swestcloud.com', 'www.app-swestcloud.com'],
    'incometax': ['123incometax.mytaxprepofficedemo.com', '123incometax.mytaxprepofficedemo.com', '123incometax.mytaxprepofficedemo.com'],
    'nextworld': ['nextworld.advanced-taxsolutions.com', 'nextworldcommunications.mytaxprepoffice.com', 'nextworldcommunications.mytaxprepoffice.com'],
    "cloudsolution": ["cloudsotaxprep.mytaxprepoffice.com", "cloudsotaxprep.advanced-taxsolutions.com"]
}


// default mtpo reseller id.
var reseller_config_global = { appId: 'RE-4dc601df-dc0e-4a7a-857d-9493ba33a223', shortCode: 'mtpo' };

// update rseller global confioguration based on base href or host name and also change favicon ico and loading bar message.
var updateDataAccordingToReseller = function (resellerId, shortcode, favicon, title, Loadingmessage) {
    reseller_config_global.appId = resellerId;
    reseller_config_global.shortCode = shortcode;
    document.getElementById("favicon").href = favicon;
    document.title = title;
    document.getElementById("loadingMessage").innerHTML = Loadingmessage;
}

//For taxvision
if (resellerHostnames.empiretax.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-empiretax.html") {
    updateDataAccordingToReseller(
        "RE-9131fcf4-6906-4c97-bb13-d8dd94953acc",
        "empiretax", "assets/images/favicons/favicon_icon_empiretax.png",
        "Empire Tax Software – Tax Software for your Tax Office",
        "Loading Empire Tax Software");
} else if (resellerHostnames.tsg.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-tsg.html") {
    updateDataAccordingToReseller(
        "RE-f58b8289-f20a-443f-9c30-1dd4d732c6f9",
        "tsg",
        "assets/images/favicons/favicon_icon_empiretax.png",
        "TSG Tax Software – BY TAX PROS FOR TAX PROS",
        "Loading TSG Tax Software");
} else if (resellerHostnames.siglo.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-siglo.html") {
    updateDataAccordingToReseller(
        "RE-1a54ef88-3118-46d9-8c75-6c316bd89420",
        "siglo",
        "assets/images/favicons/favicon_icon_siglo.png",
        "Siglo Professional Tax Software",
        "Loading Siglo Professional Tax Software");
} else if (resellerHostnames.co9.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-co9.html") {
    updateDataAccordingToReseller(
        "RE-c7b54ab5-10a9-4127-9692-9778a2cfa5bd",
        "co9",
        "assets/images/favicons/favicon_icon_co9.png",
        "Circle of 9 Tax Software – Tax Software for your Tax Office",
        "Loading Circle of 9 Tax Software");
} else if (resellerHostnames.uplus.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-uplus.html") {
    updateDataAccordingToReseller(
        "RE-1c2d3f01-9c82-41b9-9f8c-e5ac6791552e",
        "uplus",
        "assets/images/favicons/favicon_icon_uplus.png",
        "UPLUS TAX PROFESSIONAL SOFTWARE – Tax Software for your Tax Office",
        "UPLUS TAX PROFESSIONAL SOFTWARE");
} else if (resellerHostnames.trooblr.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-trooblr.html") {
    updateDataAccordingToReseller(
        "RE-83f84f99-1633-4321-9a31-40e574efa33a",
        "trooblr",
        "assets/images/favicons/favicon_icon_trooblr.png",
        "trooblr tax office",
        "Loading trooblr tax office");
} else if (resellerHostnames.incomeusa.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-incomeusa.html") {
    updateDataAccordingToReseller(
        "RE-bcc6896f-dfb7-4e5e-83e5-b7b396fe521b",
        "incomeusa",
        "assets/images/favicons/favicon_icon_incomeusa.png",
        "Income Tax USA",
        "Loading Income Tax USA");
} else if (resellerHostnames.sam.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-sam.html") {
    updateDataAccordingToReseller(
        "RE-a80480dc-74b3-4b5f-be81-545a96a5ce12",
        "sam",
        "assets/images/favicons/favicon_icon_sam.png",
        "Sam West & Associates– Tax Software for your Tax Office",
        "Loading Sam West & Associates");
} else if (resellerHostnames.incometax.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-incometax.html") {
    updateDataAccordingToReseller(
        "RE-67761ce4-274a-46b1-bf08-82c7fdd9a833",
        "123incometax",
        "assets/images/favicons/favicon_icon_incomeusa.png",
        "123 Income Tax",
        "Loading 123 Income Tax");
} else if (resellerHostnames.nextworld.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-nextworld.html") {
    updateDataAccordingToReseller(
        "RE-0f923412-de9f-49bd-969b-c2b06fb763b3",
        "nextworld",
        "assets/images/favicons/favicon_icon_nextworld.png",
        "Next World Communications",
        "Loading Next World Communications");
} else if (resellerHostnames.cloudsolution.indexOf(window.location.hostname) >= 0 || window.location.pathname === "/index-cloudsolution.html") {
    updateDataAccordingToReseller(
        "RE-c2ed3e1a-ca97-4a8d-b0c6-02d26dfa2de5",
        "cloudsolution",
        "assets/images/favicons/favicon_icon_cloudsolution.png",
        "Cloud Solution Tax Prep",
        "Loading Cloud Solution Tax Prep");
} else {
    updateDataAccordingToReseller(
        "RE-4dc601df-dc0e-4a7a-857d-9493ba33a223",
        "mtpo",
        "assets/images/favicons/favicon_icon_mtpo.png?v=2",
        "MyTAXPrepOffice – Tax Software for your Tax Office",
        "Loading MyTAXPrepOffice");
}


