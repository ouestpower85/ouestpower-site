/* OUESTPOWER — script.js
   Version complète corrigée de l'estimateur véhicules.
   Remplacer intégralement l'ancien fichier script.js par celui-ci.
   Les gains sont indicatifs et doivent être confirmés par une étude du véhicule.
*/
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Navigation mobile
  const menuToggle = $("#menu-toggle, .menu-toggle, [data-menu-toggle]");
  const nav = $("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      menuToggle.setAttribute(
        "aria-expanded",
        nav.classList.contains("open") ? "true" : "false"
      );
    });
  }
  $$("nav a").forEach(link => link.addEventListener("click", () => nav?.classList.remove("open")));
  $$("[data-service]").forEach(button => button.addEventListener("click", () => {
    const service = button.dataset.service;
    const target = service ? $(`[data-service-panel="${service}"]`) : null;
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  // Base indicative de véhicules : puissance d'origine et fourchette de gain Stage 1.
  // Cette liste n'est pas exhaustive. Vérifier chaque véhicule avant d'annoncer un gain.
  const vehicleDB = {
    "Audi": {
      "A1": [
        {label:"1.0 TFSI 95 ch essence turbo",hp:95,fuel:"essence",gain:[20,30]},
        {label:"1.0 TFSI 110 ch essence turbo",hp:110,fuel:"essence",gain:[20,30]},
        {label:"1.4 TFSI 125 ch essence turbo",hp:125,fuel:"essence",gain:[25,35]},
        {label:"1.6 TDI 90 ch diesel turbo",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.6 TDI 105 ch diesel turbo",hp:105,fuel:"diesel",gain:[25,30]}
      ],
      "A3": [
        {label:"1.6 TDI 110 ch",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 184 ch",hp:184,fuel:"diesel",gain:[30,45]},
        {label:"1.4 TFSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TFSI 190 ch",hp:190,fuel:"essence",gain:[35,50]},
        {label:"S3 2.0 TFSI 310 ch",hp:310,fuel:"essence",gain:[45,65]},
        {label:"RS3 2.5 TFSI 400 ch",hp:400,fuel:"essence",gain:[60,90]}
      ],
      "A4": [
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"2.0 TFSI 190 ch",hp:190,fuel:"essence",gain:[35,50]},
        {label:"3.0 TDI 218 ch",hp:218,fuel:"diesel",gain:[40,55]}
      ],
      "A5": [
        {label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"2.0 TFSI 252 ch",hp:252,fuel:"essence",gain:[40,60]},
        {label:"S5 3.0 TFSI 354 ch",hp:354,fuel:"essence",gain:[50,80]}
      ],
      "A6": [
        {label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"3.0 TDI 272 ch",hp:272,fuel:"diesel",gain:[40,60]},
        {label:"S6 4.0 TFSI 450 ch",hp:450,fuel:"essence",gain:[60,90]},
        {label:"RS6 4.0 TFSI 600 ch",hp:600,fuel:"essence",gain:[80,120]}
      ],
      "Q3": [
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TFSI 180 ch",hp:180,fuel:"essence",gain:[30,45]}
      ],
      "Q5": [
        {label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"3.0 TDI 286 ch",hp:286,fuel:"diesel",gain:[40,60]}
      ],
      "Q7": [{label:"3.0 TDI 286 ch",hp:286,fuel:"diesel",gain:[40,60]}],
      "S4": [{label:"3.0 TFSI 354 ch",hp:354,fuel:"essence",gain:[50,80]}],
      "S5": [{label:"3.0 TFSI 354 ch",hp:354,fuel:"essence",gain:[50,80]}],
      "RS4": [{label:"2.9 TFSI 450 ch",hp:450,fuel:"essence",gain:[60,90]}],
      "RS6": [{label:"4.0 TFSI 600 ch",hp:600,fuel:"essence",gain:[80,120]}]
    },
    "BMW": {
      "Série 1": [
        {label:"116d 116 ch",hp:116,fuel:"diesel",gain:[25,35]},
        {label:"118d 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"120d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"120i 184 ch",hp:184,fuel:"essence",gain:[30,45]},
        {label:"M135i 306 ch",hp:306,fuel:"essence",gain:[45,65]}
      ],
      "Série 2": [
        {label:"218d 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"220d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"M240i 340 ch",hp:340,fuel:"essence",gain:[50,80]}
      ],
      "Série 3": [
        {label:"318d 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"320d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"330d 265 ch",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"330i 258 ch",hp:258,fuel:"essence",gain:[40,60]},
        {label:"M340i 374 ch",hp:374,fuel:"essence",gain:[50,80]}
      ],
      "Série 4": [
        {label:"420d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"430d 286 ch",hp:286,fuel:"diesel",gain:[40,60]},
        {label:"M440i 374 ch",hp:374,fuel:"essence",gain:[50,80]}
      ],
      "Série 5": [
        {label:"520d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"530d 265 ch",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"530i 252 ch",hp:252,fuel:"essence",gain:[35,55]},
        {label:"540i 340 ch",hp:340,fuel:"essence",gain:[45,70]}
      ],
      "Série 7": [
        {label:"730d 265 ch",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"740d 320 ch",hp:320,fuel:"diesel",gain:[45,65]},
        {label:"750i 530 ch",hp:530,fuel:"essence",gain:[70,100]}
      ],
      "X1": [
        {label:"18d 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"20d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"20i 192 ch",hp:192,fuel:"essence",gain:[30,45]}
      ],
      "X3": [
        {label:"20d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"30d 265 ch",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"M40i 360 ch",hp:360,fuel:"essence",gain:[50,80]}
      ],
      "X5": [
        {label:"30d 265 ch",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"40d 340 ch",hp:340,fuel:"diesel",gain:[45,65]},
        {label:"M50i 530 ch",hp:530,fuel:"essence",gain:[70,100]}
      ],
      "M2": [
        {label:"M2 F87 370 ch",hp:370,fuel:"essence",gain:[50,80]},
        {label:"M2 Competition 410 ch",hp:410,fuel:"essence",gain:[50,80]},
        {label:"M2 G87 460 ch",hp:460,fuel:"essence",gain:[50,80]}
      ],
      "M3": [
        {label:"M3 F80 431 ch",hp:431,fuel:"essence",gain:[60,90]},
        {label:"M3 Competition 510 ch",hp:510,fuel:"essence",gain:[60,90]}
      ],
      "M4": [
        {label:"M4 F82 431 ch",hp:431,fuel:"essence",gain:[60,90]},
        {label:"M4 Competition 510 ch",hp:510,fuel:"essence",gain:[60,90]}
      ],
      "M5": [
        {label:"M5 F90 600 ch",hp:600,fuel:"essence",gain:[80,120]},
        {label:"M5 Competition 625 ch",hp:625,fuel:"essence",gain:[80,120]}
      ]
    },
    "Mercedes-Benz": {
      "Classe A": [
        {label:"A180d 116 ch",hp:116,fuel:"diesel",gain:[25,35]},
        {label:"A200 163 ch",hp:163,fuel:"essence",gain:[25,40]},
        {label:"A220d 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"A35 AMG 306 ch",hp:306,fuel:"essence",gain:[40,60]},
        {label:"A45 S AMG 421 ch",hp:421,fuel:"essence",gain:[50,80]}
      ],
      "Classe C": [
        {label:"C220d 194 ch",hp:194,fuel:"diesel",gain:[35,45]},
        {label:"C300 258 ch",hp:258,fuel:"essence",gain:[35,55]},
        {label:"C43 AMG 390 ch",hp:390,fuel:"essence",gain:[50,80]},
        {label:"C63 AMG 476 ch",hp:476,fuel:"essence",gain:[50,80]}
      ],
      "Classe E": [
        {label:"E220d 194 ch",hp:194,fuel:"diesel",gain:[35,45]},
        {label:"E300 258 ch",hp:258,fuel:"essence",gain:[35,55]},
        {label:"E400d 340 ch",hp:340,fuel:"diesel",gain:[45,65]}
      ],
      "GLC": [
        {label:"220d 194 ch",hp:194,fuel:"diesel",gain:[35,45]},
        {label:"300d 245 ch",hp:245,fuel:"diesel",gain:[35,50]},
        {label:"AMG 43 390 ch",hp:390,fuel:"essence",gain:[50,80]}
      ],
      "GLE": [
        {label:"300d 245 ch",hp:245,fuel:"diesel",gain:[35,50]},
        {label:"400d 330 ch",hp:330,fuel:"diesel",gain:[45,65]}
      ],
      "AMG GT": [{label:"4.0 V8 biturbo 476 ch",hp:476,fuel:"essence",gain:[60,90]}]
    },
    "Volkswagen": {
      "Polo": [
        {label:"1.0 TSI 95 ch",hp:95,fuel:"essence",gain:[20,30]},
        {label:"1.0 TSI 110 ch",hp:110,fuel:"essence",gain:[20,30]},
        {label:"2.0 TSI GTI 200 ch",hp:200,fuel:"essence",gain:[30,45]}
      ],
      "Golf": [
        {label:"1.6 TDI 115 ch",hp:115,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 184 ch",hp:184,fuel:"diesel",gain:[30,45]},
        {label:"1.5 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TSI GTI 245 ch",hp:245,fuel:"essence",gain:[35,55]},
        {label:"2.0 TSI R 320 ch",hp:320,fuel:"essence",gain:[45,70]}
      ],
      "Passat": [
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]}
      ],
      "Tiguan": [
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"2.0 TSI 180 ch",hp:180,fuel:"essence",gain:[30,45]}
      ],
      "Arteon": [{label:"2.0 TDI 200 ch",hp:200,fuel:"diesel",gain:[35,50]}],
      "T-Roc": [{label:"2.0 TSI R 300 ch",hp:300,fuel:"essence",gain:[40,65]}]
    },
    "Peugeot": {
      "208": [
        {label:"1.2 PureTech 100 ch",hp:100,fuel:"essence",gain:[15,25]},
        {label:"1.2 PureTech 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.6 THP GTi 208 ch",hp:208,fuel:"essence",gain:[25,40]},
        {label:"1.5 BlueHDi 100 ch",hp:100,fuel:"diesel",gain:[20,30]}
      ],
      "308": [
        {label:"1.2 PureTech 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.6 THP 205 ch",hp:205,fuel:"essence",gain:[25,40]},
        {label:"1.5 BlueHDi 130 ch",hp:130,fuel:"diesel",gain:[25,35]},
        {label:"2.0 BlueHDi 180 ch",hp:180,fuel:"diesel",gain:[30,45]}
      ],
      "3008": [
        {label:"1.2 PureTech 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 BlueHDi 130 ch",hp:130,fuel:"diesel",gain:[25,35]},
        {label:"2.0 BlueHDi 180 ch",hp:180,fuel:"diesel",gain:[30,45]}
      ],
      "508": [
        {label:"1.6 PureTech 180 ch",hp:180,fuel:"essence",gain:[25,40]},
        {label:"2.0 BlueHDi 180 ch",hp:180,fuel:"diesel",gain:[30,45]}
      ]
    },
    "Renault": {
      "Clio": [
        {label:"0.9 TCe 90 ch",hp:90,fuel:"essence",gain:[15,25]},
        {label:"1.3 TCe 130 ch",hp:130,fuel:"essence",gain:[20,35]},
        {label:"1.5 dCi 90 ch",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.5 Blue dCi 115 ch",hp:115,fuel:"diesel",gain:[25,35]}
      ],
      "Mégane": [
        {label:"1.3 TCe 140 ch",hp:140,fuel:"essence",gain:[20,35]},
        {label:"1.5 dCi 110 ch",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"1.8 TCe RS 280 ch",hp:280,fuel:"essence",gain:[35,55]}
      ],
      "Captur": [
        {label:"1.3 TCe 130 ch",hp:130,fuel:"essence",gain:[20,35]},
        {label:"1.5 dCi 115 ch",hp:115,fuel:"diesel",gain:[25,35]}
      ],
      "Kadjar": [{label:"1.5 dCi 115 ch",hp:115,fuel:"diesel",gain:[25,35]}]
    },
    "Citroën": {
      "C3": [
        {label:"1.2 PureTech 110 ch",hp:110,fuel:"essence",gain:[15,25]},
        {label:"1.5 BlueHDi 100 ch",hp:100,fuel:"diesel",gain:[20,30]}
      ],
      "C4": [
        {label:"1.2 PureTech 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 BlueHDi 130 ch",hp:130,fuel:"diesel",gain:[25,35]}
      ],
      "C5 Aircross": [
        {label:"1.2 PureTech 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 BlueHDi 130 ch",hp:130,fuel:"diesel",gain:[25,35]}
      ]
    },
    "Ford": {
      "Fiesta": [
        {label:"1.0 EcoBoost 100 ch",hp:100,fuel:"essence",gain:[20,30]},
        {label:"1.0 EcoBoost 125 ch",hp:125,fuel:"essence",gain:[20,35]},
        {label:"1.5 TDCi 95 ch",hp:95,fuel:"diesel",gain:[20,30]}
      ],
      "Focus": [
        {label:"1.0 EcoBoost 125 ch",hp:125,fuel:"essence",gain:[20,35]},
        {label:"1.5 EcoBlue 120 ch",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"2.0 EcoBlue 190 ch",hp:190,fuel:"diesel",gain:[30,45]},
        {label:"2.3 EcoBoost ST 280 ch",hp:280,fuel:"essence",gain:[35,55]}
      ],
      "Kuga": [{label:"2.0 EcoBlue 190 ch",hp:190,fuel:"diesel",gain:[30,45]}],
      "Mustang": [
        {label:"2.3 EcoBoost 290 ch",hp:290,fuel:"essence",gain:[30,50]},
        {label:"5.0 V8 450 ch atmosphérique",hp:450,fuel:"atmo",gain:[5,15]}
      ]
    },
    "SEAT": {
      "Ibiza": [
        {label:"1.0 TSI 110 ch",hp:110,fuel:"essence",gain:[20,30]},
        {label:"1.6 TDI 95 ch",hp:95,fuel:"diesel",gain:[20,30]}
      ],
      "Leon": [
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TSI Cupra 300 ch",hp:300,fuel:"essence",gain:[40,60]}
      ],
      "Ateca": [{label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]}]
    },
    "Škoda": {
      "Fabia": [{label:"1.0 TSI 110 ch",hp:110,fuel:"essence",gain:[20,30]}],
      "Octavia": [
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 184 ch",hp:184,fuel:"diesel",gain:[30,45]},
        {label:"2.0 TSI RS 245 ch",hp:245,fuel:"essence",gain:[35,55]}
      ],
      "Superb": [{label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]}],
      "Kodiaq": [{label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[35,45]}]
    },
    "Opel": {
      "Corsa": [
        {label:"1.2 Turbo 100 ch",hp:100,fuel:"essence",gain:[15,25]},
        {label:"1.5 Diesel 102 ch",hp:102,fuel:"diesel",gain:[20,30]}
      ],
      "Astra": [
        {label:"1.2 Turbo 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 Diesel 122 ch",hp:122,fuel:"diesel",gain:[25,35]}
      ],
      "Insignia": [{label:"2.0 Diesel 170 ch",hp:170,fuel:"diesel",gain:[30,40]}]
    },
    "Toyota": {
      "Yaris": [{label:"1.5 VVT-i 125 ch atmosphérique",hp:125,fuel:"atmo",gain:[3,8]}],
      "Corolla": [{label:"2.0 Hybrid 184 ch",hp:184,fuel:"hybride",gain:[0,0]}],
      "GR Yaris": [{label:"1.6 Turbo 261 ch",hp:261,fuel:"essence",gain:[30,50]}],
      "GR Supra": [{label:"3.0 Turbo 340 ch",hp:340,fuel:"essence",gain:[50,80]}]
    },
    "Porsche": {
      "911": [
        {label:"Carrera 3.0 turbo 385 ch",hp:385,fuel:"essence",gain:[35,60]},
        {label:"Carrera GTS 3.0 turbo 480 ch",hp:480,fuel:"essence",gain:[50,80]}
      ],
      "Cayenne": [{label:"3.0 V6 turbo 340 ch",hp:340,fuel:"essence",gain:[35,55]}],
      "Macan": [{label:"2.0 turbo 265 ch",hp:265,fuel:"essence",gain:[35,50]}]
    },
    "Volvo": {
      "V60": [{label:"D4 190 ch",hp:190,fuel:"diesel",gain:[30,45]}],
      "XC60": [{label:"B4 diesel 197 ch",hp:197,fuel:"diesel",gain:[25,40]}]
    }
  };


  // Extensions de motorisations courantes par modèle.
  // Les puissances et gains sont indicatifs : vérifier l'année, le code moteur et la version exacte.
  const extraEngines = {
    "Audi": {
      "A1": [
        {label:"1.0 TFSI 82 ch essence turbo",hp:82,fuel:"essence",gain:[15,25]},
        {label:"1.0 TFSI 116 ch essence turbo",hp:116,fuel:"essence",gain:[20,30]},
        {label:"1.4 TFSI 150 ch essence turbo",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TFSI 200 ch essence turbo",hp:200,fuel:"essence",gain:[30,45]}
      ],
      "A3": [
        {label:"1.2 TFSI 105 ch",hp:105,fuel:"essence",gain:[15,25]},
        {label:"1.4 TFSI 122 ch",hp:122,fuel:"essence",gain:[20,30]},
        {label:"1.4 TFSI 140 ch",hp:140,fuel:"essence",gain:[25,35]},
        {label:"1.5 TFSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.6 TDI 105 ch",hp:105,fuel:"diesel",gain:[20,30]},
        {label:"2.0 TDI 140 ch",hp:140,fuel:"diesel",gain:[25,35]}
      ],
      "A4": [
        {label:"1.8 TFSI 170 ch",hp:170,fuel:"essence",gain:[25,40]},
        {label:"2.0 TFSI 211 ch",hp:211,fuel:"essence",gain:[35,50]},
        {label:"2.0 TDI 120 ch",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 177 ch",hp:177,fuel:"diesel",gain:[30,40]},
        {label:"3.0 TDI 245 ch",hp:245,fuel:"diesel",gain:[40,55]}
      ],
      "A5": [
        {label:"1.8 TFSI 170 ch",hp:170,fuel:"essence",gain:[25,40]},
        {label:"2.0 TFSI 211 ch",hp:211,fuel:"essence",gain:[35,50]},
        {label:"3.0 TDI 245 ch",hp:245,fuel:"diesel",gain:[40,55]}
      ],
      "A6": [
        {label:"2.0 TDI 177 ch",hp:177,fuel:"diesel",gain:[30,40]},
        {label:"3.0 TDI 204 ch",hp:204,fuel:"diesel",gain:[35,50]},
        {label:"3.0 TDI 245 ch",hp:245,fuel:"diesel",gain:[40,55]},
        {label:"3.0 TFSI 300 ch",hp:300,fuel:"essence",gain:[45,70]}
      ],
      "Q3": [
        {label:"1.4 TFSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TDI 184 ch",hp:184,fuel:"diesel",gain:[30,45]}
      ],
      "Q5": [
        {label:"2.0 TDI 170 ch",hp:170,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TFSI 225 ch",hp:225,fuel:"essence",gain:[35,50]},
        {label:"3.0 TDI 245 ch",hp:245,fuel:"diesel",gain:[40,55]}
      ]
    },
    "BMW": {
      "Série 1": [
        {label:"116i 136 ch essence turbo",hp:136,fuel:"essence",gain:[20,35]},
        {label:"118i 170 ch essence turbo",hp:170,fuel:"essence",gain:[25,40]},
        {label:"120i 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"125i 218 ch essence turbo",hp:218,fuel:"essence",gain:[35,50]},
        {label:"116d 90 ch diesel turbo",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"118d 143 ch diesel turbo",hp:143,fuel:"diesel",gain:[25,35]},
        {label:"120d 177 ch diesel turbo",hp:177,fuel:"diesel",gain:[30,40]}
      ],
      "Série 2": [
        {label:"218i 136 ch essence turbo",hp:136,fuel:"essence",gain:[20,35]},
        {label:"220i 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"228i 245 ch essence turbo",hp:245,fuel:"essence",gain:[35,55]},
        {label:"216d 116 ch diesel turbo",hp:116,fuel:"diesel",gain:[25,35]},
        {label:"225d 224 ch diesel biturbo",hp:224,fuel:"diesel",gain:[35,50]}
      ],
      "Série 3": [
        {label:"316i 136 ch essence turbo",hp:136,fuel:"essence",gain:[20,35]},
        {label:"318i 156 ch essence turbo",hp:156,fuel:"essence",gain:[25,40]},
        {label:"320i 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"328i 245 ch essence turbo",hp:245,fuel:"essence",gain:[35,55]},
        {label:"335i 306 ch essence turbo",hp:306,fuel:"essence",gain:[45,70]},
        {label:"316d 116 ch diesel turbo",hp:116,fuel:"diesel",gain:[25,35]},
        {label:"320d 163 ch diesel turbo",hp:163,fuel:"diesel",gain:[30,40]},
        {label:"325d 218 ch diesel turbo",hp:218,fuel:"diesel",gain:[35,50]},
        {label:"335d 313 ch diesel biturbo",hp:313,fuel:"diesel",gain:[45,65]}
      ],
      "Série 4": [
        {label:"420i 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"428i 245 ch essence turbo",hp:245,fuel:"essence",gain:[35,55]},
        {label:"435i 306 ch essence turbo",hp:306,fuel:"essence",gain:[45,70]},
        {label:"418d 150 ch diesel turbo",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"430d 258 ch diesel turbo",hp:258,fuel:"diesel",gain:[40,55]}
      ],
      "Série 5": [
        {label:"520i 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"528i 245 ch essence turbo",hp:245,fuel:"essence",gain:[35,55]},
        {label:"535i 306 ch essence turbo",hp:306,fuel:"essence",gain:[45,70]},
        {label:"518d 150 ch diesel turbo",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"525d 218 ch diesel turbo",hp:218,fuel:"diesel",gain:[35,50]},
        {label:"535d 313 ch diesel biturbo",hp:313,fuel:"diesel",gain:[45,65]}
      ],
      "X1": [
        {label:"18i 140 ch essence turbo",hp:140,fuel:"essence",gain:[20,35]},
        {label:"20i 192 ch essence turbo",hp:192,fuel:"essence",gain:[30,45]},
        {label:"16d 116 ch diesel turbo",hp:116,fuel:"diesel",gain:[25,35]},
        {label:"18d 150 ch diesel turbo",hp:150,fuel:"diesel",gain:[30,40]}
      ],
      "X3": [
        {label:"20i 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"28i 245 ch essence turbo",hp:245,fuel:"essence",gain:[35,55]},
        {label:"20d 184 ch diesel turbo",hp:184,fuel:"diesel",gain:[30,40]},
        {label:"35d 313 ch diesel biturbo",hp:313,fuel:"diesel",gain:[45,65]}
      ],
      "X5": [
        {label:"35i 306 ch essence turbo",hp:306,fuel:"essence",gain:[45,70]},
        {label:"40i 340 ch essence turbo",hp:340,fuel:"essence",gain:[45,70]},
        {label:"25d 231 ch diesel biturbo",hp:231,fuel:"diesel",gain:[35,50]},
        {label:"30d 258 ch diesel turbo",hp:258,fuel:"diesel",gain:[40,55]},
        {label:"40d 313 ch diesel biturbo",hp:313,fuel:"diesel",gain:[45,65]}
      ],
      "M2": [
        {label:"M2 CS F87 450 ch essence biturbo",hp:450,fuel:"essence",gain:[50,80]},
        {label:"M2 G87 480 ch essence biturbo",hp:480,fuel:"essence",gain:[50,80]}
      ],
      "M3": [
        {label:"M3 E92 420 ch V8 atmosphérique",hp:420,fuel:"atmo",gain:[5,15]},
        {label:"M3 E90 420 ch V8 atmosphérique",hp:420,fuel:"atmo",gain:[5,15]},
        {label:"M3 G80 480 ch essence biturbo",hp:480,fuel:"essence",gain:[60,90]}
      ],
      "M4": [
        {label:"M4 Competition 450 ch essence biturbo",hp:450,fuel:"essence",gain:[60,90]},
        {label:"M4 CSL 550 ch essence biturbo",hp:550,fuel:"essence",gain:[60,90]}
      ],
      "M5": [
        {label:"M5 F10 560 ch essence biturbo",hp:560,fuel:"essence",gain:[70,100]},
        {label:"M5 CS F90 635 ch essence biturbo",hp:635,fuel:"essence",gain:[80,120]}
      ]
    },
    "Mercedes-Benz": {
      "Classe A": [
        {label:"A160 102 ch essence",hp:102,fuel:"essence",gain:[10,20]},
        {label:"A180 136 ch essence turbo",hp:136,fuel:"essence",gain:[20,35]},
        {label:"A200 163 ch essence turbo",hp:163,fuel:"essence",gain:[25,40]},
        {label:"A220 190 ch essence turbo",hp:190,fuel:"essence",gain:[30,45]},
        {label:"A180d 109 ch diesel",hp:109,fuel:"diesel",gain:[20,30]},
        {label:"A200d 150 ch diesel",hp:150,fuel:"diesel",gain:[25,35]}
      ],
      "Classe C": [
        {label:"C180 156 ch essence turbo",hp:156,fuel:"essence",gain:[20,35]},
        {label:"C200 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"C250 211 ch essence turbo",hp:211,fuel:"essence",gain:[35,50]},
        {label:"C220 CDI 170 ch diesel",hp:170,fuel:"diesel",gain:[30,40]},
        {label:"C250 CDI 204 ch diesel",hp:204,fuel:"diesel",gain:[35,45]},
        {label:"C300d 245 ch diesel",hp:245,fuel:"diesel",gain:[35,50]},
        {label:"C63 S AMG 510 ch V8 biturbo",hp:510,fuel:"essence",gain:[50,80]}
      ],
      "Classe E": [
        {label:"E200 184 ch essence turbo",hp:184,fuel:"essence",gain:[30,45]},
        {label:"E250 211 ch essence turbo",hp:211,fuel:"essence",gain:[35,50]},
        {label:"E350 306 ch essence turbo",hp:306,fuel:"essence",gain:[45,70]},
        {label:"E200d 150 ch diesel",hp:150,fuel:"diesel",gain:[25,35]},
        {label:"E300d 245 ch diesel",hp:245,fuel:"diesel",gain:[35,50]}
      ],
      "GLC": [
        {label:"GLC 200 197 ch essence turbo",hp:197,fuel:"essence",gain:[30,45]},
        {label:"GLC 300 258 ch essence turbo",hp:258,fuel:"essence",gain:[35,55]},
        {label:"GLC 220d 170 ch diesel",hp:170,fuel:"diesel",gain:[30,40]},
        {label:"GLC 300d 245 ch diesel",hp:245,fuel:"diesel",gain:[35,50]}
      ],
      "GLE": [
        {label:"GLE 350 258 ch diesel",hp:258,fuel:"diesel",gain:[35,50]},
        {label:"GLE 450 367 ch essence turbo",hp:367,fuel:"essence",gain:[45,70]},
        {label:"GLE 350de hybride rechargeable 320 ch",hp:320,fuel:"hybride",gain:[0,0]}
      ]
    },
    "Volkswagen": {
      "Polo": [
        {label:"1.2 TSI 90 ch",hp:90,fuel:"essence",gain:[15,25]},
        {label:"1.2 TSI 105 ch",hp:105,fuel:"essence",gain:[15,25]},
        {label:"1.4 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.6 TDI 90 ch",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.6 TDI 105 ch",hp:105,fuel:"diesel",gain:[20,30]}
      ],
      "Golf": [
        {label:"1.0 TSI 110 ch",hp:110,fuel:"essence",gain:[20,30]},
        {label:"1.2 TSI 105 ch",hp:105,fuel:"essence",gain:[15,25]},
        {label:"1.4 TSI 122 ch",hp:122,fuel:"essence",gain:[20,30]},
        {label:"1.4 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.5 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.6 TDI 105 ch",hp:105,fuel:"diesel",gain:[20,30]},
        {label:"1.6 TDI 110 ch",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 140 ch",hp:140,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 170 ch",hp:170,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TSI GTI 220 ch",hp:220,fuel:"essence",gain:[35,50]},
        {label:"2.0 TSI R 300 ch",hp:300,fuel:"essence",gain:[40,65]}
      ],
      "Passat": [
        {label:"1.4 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.8 TSI 180 ch",hp:180,fuel:"essence",gain:[30,45]},
        {label:"2.0 TDI 110 ch",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 140 ch",hp:140,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 240 ch biturbo",hp:240,fuel:"diesel",gain:[35,50]}
      ],
      "Tiguan": [
        {label:"1.4 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.5 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TSI 220 ch",hp:220,fuel:"essence",gain:[35,50]},
        {label:"2.0 TDI 115 ch",hp:115,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 200 ch",hp:200,fuel:"diesel",gain:[35,50]}
      ]
    },
    "Peugeot": {
      "208": [
        {label:"1.2 PureTech 75 ch",hp:75,fuel:"essence",gain:[0,10]},
        {label:"1.2 PureTech 82 ch",hp:82,fuel:"essence",gain:[0,10]},
        {label:"1.2 PureTech 110 ch",hp:110,fuel:"essence",gain:[15,25]},
        {label:"1.6 BlueHDi 75 ch",hp:75,fuel:"diesel",gain:[15,25]},
        {label:"1.6 BlueHDi 100 ch",hp:100,fuel:"diesel",gain:[20,30]},
        {label:"1.6 BlueHDi 120 ch",hp:120,fuel:"diesel",gain:[25,35]}
      ],
      "308": [
        {label:"1.2 PureTech 110 ch",hp:110,fuel:"essence",gain:[15,25]},
        {label:"1.6 THP 125 ch",hp:125,fuel:"essence",gain:[20,30]},
        {label:"1.6 THP 156 ch",hp:156,fuel:"essence",gain:[20,35]},
        {label:"1.6 THP 205 ch",hp:205,fuel:"essence",gain:[25,40]},
        {label:"1.6 HDi 92 ch",hp:92,fuel:"diesel",gain:[20,30]},
        {label:"1.6 BlueHDi 120 ch",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"2.0 HDi 150 ch",hp:150,fuel:"diesel",gain:[25,35]}
      ],
      "3008": [
        {label:"1.6 THP 165 ch",hp:165,fuel:"essence",gain:[25,40]},
        {label:"1.6 THP 180 ch",hp:180,fuel:"essence",gain:[25,40]},
        {label:"1.6 HDi 115 ch",hp:115,fuel:"diesel",gain:[25,35]},
        {label:"2.0 BlueHDi 150 ch",hp:150,fuel:"diesel",gain:[25,35]},
        {label:"2.0 BlueHDi 180 ch",hp:180,fuel:"diesel",gain:[30,45]}
      ],
      "508": [
        {label:"1.6 THP 156 ch",hp:156,fuel:"essence",gain:[20,35]},
        {label:"1.6 THP 165 ch",hp:165,fuel:"essence",gain:[25,40]},
        {label:"2.0 HDi 140 ch",hp:140,fuel:"diesel",gain:[25,35]},
        {label:"2.0 HDi 163 ch",hp:163,fuel:"diesel",gain:[25,40]},
        {label:"2.0 BlueHDi 150 ch",hp:150,fuel:"diesel",gain:[25,35]}
      ]
    },
    "Renault": {
      "Clio": [
        {label:"1.2 16V 75 ch atmosphérique",hp:75,fuel:"atmo",gain:[0,8]},
        {label:"1.2 TCe 100 ch",hp:100,fuel:"essence",gain:[15,25]},
        {label:"1.2 TCe 120 ch",hp:120,fuel:"essence",gain:[15,25]},
        {label:"1.3 TCe 140 ch",hp:140,fuel:"essence",gain:[20,35]},
        {label:"1.5 dCi 75 ch",hp:75,fuel:"diesel",gain:[15,25]},
        {label:"1.5 dCi 110 ch",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"1.5 Blue dCi 85 ch",hp:85,fuel:"diesel",gain:[20,30]}
      ],
      "Mégane": [
        {label:"1.2 TCe 115 ch",hp:115,fuel:"essence",gain:[15,25]},
        {label:"1.2 TCe 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.3 TCe 115 ch",hp:115,fuel:"essence",gain:[15,25]},
        {label:"1.3 TCe 160 ch",hp:160,fuel:"essence",gain:[25,40]},
        {label:"1.5 dCi 90 ch",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.5 dCi 130 ch",hp:130,fuel:"diesel",gain:[25,35]},
        {label:"1.6 dCi 130 ch",hp:130,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TCe RS 250 ch",hp:250,fuel:"essence",gain:[30,50]},
        {label:"2.0 TCe RS 265 ch",hp:265,fuel:"essence",gain:[35,55]}
      ],
      "Captur": [
        {label:"0.9 TCe 90 ch essence turbo",hp:90,fuel:"essence",gain:[15,25]},
        {label:"1.2 TCe 120 ch essence turbo",hp:120,fuel:"essence",gain:[15,25]},
        {label:"1.3 TCe 130 ch essence turbo",hp:130,fuel:"essence",gain:[20,35]},
        {label:"1.3 TCe 150 ch essence turbo",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.3 TCe 155 ch essence turbo",hp:155,fuel:"essence",gain:[25,40]},
        {label:"1.5 dCi 90 ch diesel turbo",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.5 dCi 110 ch diesel turbo",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"Blue dCi 95 ch diesel turbo",hp:95,fuel:"diesel",gain:[20,30]},
        {label:"Blue dCi 115 ch diesel turbo",hp:115,fuel:"diesel",gain:[25,35]},
        {label:"E-Tech hybride rechargeable 160 ch",hp:160,fuel:"hybride",gain:[0,0]},
        {label:"E-Tech full hybrid 145 ch",hp:145,fuel:"hybride",gain:[0,0]},
        {label:"E-Tech full hybrid 160 ch",hp:160,fuel:"hybride",gain:[0,0]},
        {label:"Eco-G 100 ch GPL",hp:100,fuel:"gpl",gain:[0,10]},
        {label:"Eco-G 120 ch GPL",hp:120,fuel:"gpl",gain:[0,10]}
      ],
      "Kadjar": [
        {label:"1.2 TCe 130 ch",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.3 TCe 140 ch",hp:140,fuel:"essence",gain:[20,35]},
        {label:"1.3 TCe 160 ch",hp:160,fuel:"essence",gain:[25,40]},
        {label:"1.5 dCi 110 ch",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"1.6 dCi 130 ch",hp:130,fuel:"diesel",gain:[25,35]},
        {label:"Blue dCi 115 ch",hp:115,fuel:"diesel",gain:[25,35]}
      ]
    },
    "Citroën": {
      "C3": [
        {label:"1.1i 60 ch atmosphérique",hp:60,fuel:"atmo",gain:[0,5]},
        {label:"1.4 VTi 95 ch atmosphérique",hp:95,fuel:"atmo",gain:[0,8]},
        {label:"1.2 PureTech 82 ch",hp:82,fuel:"essence",gain:[0,10]},
        {label:"1.2 PureTech 110 ch",hp:110,fuel:"essence",gain:[15,25]},
        {label:"1.4 HDi 70 ch",hp:70,fuel:"diesel",gain:[15,20]},
        {label:"1.6 HDi 90 ch",hp:90,fuel:"diesel",gain:[20,30]}
      ],
      "C4": [
        {label:"1.2 PureTech 110 ch",hp:110,fuel:"essence",gain:[15,25]},
        {label:"1.6 VTi 120 ch atmosphérique",hp:120,fuel:"atmo",gain:[0,8]},
        {label:"1.6 THP 155 ch",hp:155,fuel:"essence",gain:[20,35]},
        {label:"1.6 HDi 110 ch",hp:110,fuel:"diesel",gain:[20,30]},
        {label:"2.0 HDi 150 ch",hp:150,fuel:"diesel",gain:[25,35]}
      ],
      "C5 Aircross": [
        {label:"1.6 PureTech 180 ch",hp:180,fuel:"essence",gain:[25,40]},
        {label:"1.6 PureTech hybride rechargeable 225 ch",hp:225,fuel:"hybride",gain:[0,0]},
        {label:"2.0 BlueHDi 180 ch",hp:180,fuel:"diesel",gain:[30,45]}
      ]
    },
    "Ford": {
      "Fiesta": [
        {label:"1.0 EcoBoost 100 ch",hp:100,fuel:"essence",gain:[20,30]},
        {label:"1.0 EcoBoost 140 ch",hp:140,fuel:"essence",gain:[20,35]},
        {label:"1.5 TDCi 75 ch",hp:75,fuel:"diesel",gain:[15,25]},
        {label:"1.5 TDCi 120 ch",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"1.6 EcoBoost ST 182 ch",hp:182,fuel:"essence",gain:[25,40]}
      ],
      "Focus": [
        {label:"1.0 EcoBoost 100 ch",hp:100,fuel:"essence",gain:[20,30]},
        {label:"1.0 EcoBoost 155 ch",hp:155,fuel:"essence",gain:[20,35]},
        {label:"1.5 EcoBoost 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.5 TDCi 120 ch",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"1.5 EcoBlue 120 ch",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDCi 150 ch",hp:150,fuel:"diesel",gain:[25,35]},
        {label:"2.0 EcoBoost ST 250 ch",hp:250,fuel:"essence",gain:[30,50]}
      ],
      "Kuga": [
        {label:"1.5 EcoBoost 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.5 EcoBoost 182 ch",hp:182,fuel:"essence",gain:[25,40]},
        {label:"1.5 TDCi 120 ch",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDCi 150 ch",hp:150,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDCi 180 ch",hp:180,fuel:"diesel",gain:[30,45]}
      ]
    },
    "SEAT": {
      "Ibiza": [
        {label:"1.0 TSI 95 ch",hp:95,fuel:"essence",gain:[15,25]},
        {label:"1.0 TSI 115 ch",hp:115,fuel:"essence",gain:[20,30]},
        {label:"1.2 TSI 105 ch",hp:105,fuel:"essence",gain:[15,25]},
        {label:"1.4 TDI 90 ch",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.6 TDI 105 ch",hp:105,fuel:"diesel",gain:[20,30]}
      ],
      "Leon": [
        {label:"1.2 TSI 110 ch",hp:110,fuel:"essence",gain:[15,25]},
        {label:"1.4 TSI 125 ch",hp:125,fuel:"essence",gain:[20,30]},
        {label:"1.4 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.6 TDI 105 ch",hp:105,fuel:"diesel",gain:[20,30]},
        {label:"2.0 TDI 184 ch",hp:184,fuel:"diesel",gain:[30,45]},
        {label:"2.0 TSI Cupra 290 ch",hp:290,fuel:"essence",gain:[40,60]}
      ],
      "Ateca": [
        {label:"1.4 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.5 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TDI 190 ch",hp:190,fuel:"diesel",gain:[30,45]}
      ]
    },
    "Škoda": {
      "Fabia": [
        {label:"1.0 TSI 95 ch",hp:95,fuel:"essence",gain:[15,25]},
        {label:"1.0 TSI 110 ch",hp:110,fuel:"essence",gain:[20,30]},
        {label:"1.2 TSI 105 ch",hp:105,fuel:"essence",gain:[15,25]},
        {label:"1.4 TDI 90 ch",hp:90,fuel:"diesel",gain:[20,30]}
      ],
      "Octavia": [
        {label:"1.4 TSI 140 ch",hp:140,fuel:"essence",gain:[25,40]},
        {label:"1.5 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.8 TSI 180 ch",hp:180,fuel:"essence",gain:[30,45]},
        {label:"1.6 TDI 105 ch",hp:105,fuel:"diesel",gain:[20,30]},
        {label:"2.0 TDI 140 ch",hp:140,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 200 ch",hp:200,fuel:"diesel",gain:[35,50]}
      ],
      "Superb": [
        {label:"1.4 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TSI 220 ch",hp:220,fuel:"essence",gain:[35,50]},
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 200 ch",hp:200,fuel:"diesel",gain:[35,50]}
      ],
      "Kodiaq": [
        {label:"1.5 TSI 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TSI 190 ch",hp:190,fuel:"essence",gain:[30,45]},
        {label:"2.0 TDI 150 ch",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 200 ch",hp:200,fuel:"diesel",gain:[35,50]}
      ]
    },
    "Opel": {
      "Corsa": [
        {label:"1.0 Turbo 90 ch",hp:90,fuel:"essence",gain:[15,25]},
        {label:"1.4 Turbo 100 ch",hp:100,fuel:"essence",gain:[15,25]},
        {label:"1.3 CDTI 95 ch",hp:95,fuel:"diesel",gain:[20,30]},
        {label:"1.5 Diesel 122 ch",hp:122,fuel:"diesel",gain:[25,35]}
      ],
      "Astra": [
        {label:"1.4 Turbo 125 ch",hp:125,fuel:"essence",gain:[20,30]},
        {label:"1.4 Turbo 150 ch",hp:150,fuel:"essence",gain:[25,40]},
        {label:"1.6 Turbo 200 ch",hp:200,fuel:"essence",gain:[25,40]},
        {label:"1.6 CDTI 110 ch",hp:110,fuel:"diesel",gain:[20,30]},
        {label:"1.6 CDTI 136 ch",hp:136,fuel:"diesel",gain:[25,35]},
        {label:"2.0 CDTI 170 ch",hp:170,fuel:"diesel",gain:[30,40]}
      ],
      "Insignia": [
        {label:"1.5 Turbo 165 ch",hp:165,fuel:"essence",gain:[25,40]},
        {label:"2.0 Turbo 200 ch",hp:200,fuel:"essence",gain:[30,45]},
        {label:"1.6 CDTI 136 ch",hp:136,fuel:"diesel",gain:[25,35]},
        {label:"2.0 CDTI 210 ch",hp:210,fuel:"diesel",gain:[35,50]}
      ]
    },
    "Toyota": {
      "Yaris": [
        {label:"1.0 VVT-i 69 ch atmosphérique",hp:69,fuel:"atmo",gain:[0,5]},
        {label:"1.3 VVT-i 100 ch atmosphérique",hp:100,fuel:"atmo",gain:[0,8]},
        {label:"1.5 VVT-i 111 ch atmosphérique",hp:111,fuel:"atmo",gain:[0,8]},
        {label:"1.5 Hybrid 116 ch",hp:116,fuel:"hybride",gain:[0,0]}
      ],
      "Corolla": [
        {label:"1.2 Turbo 116 ch",hp:116,fuel:"essence",gain:[15,25]},
        {label:"1.8 Hybrid 122 ch",hp:122,fuel:"hybride",gain:[0,0]},
        {label:"1.8 Hybrid 140 ch",hp:140,fuel:"hybride",gain:[0,0]},
        {label:"2.0 Hybrid 196 ch",hp:196,fuel:"hybride",gain:[0,0]}
      ],
      "GR Yaris": [
        {label:"1.6 Turbo 261 ch",hp:261,fuel:"essence",gain:[30,50]},
        {label:"1.6 Turbo 280 ch",hp:280,fuel:"essence",gain:[30,50]}
      ]
    },
    "Porsche": {
      "911": [
        {label:"Carrera 3.4 350 ch atmosphérique",hp:350,fuel:"atmo",gain:[5,15]},
        {label:"Carrera S 3.8 400 ch atmosphérique",hp:400,fuel:"atmo",gain:[5,15]},
        {label:"Carrera 3.0 turbo 370 ch",hp:370,fuel:"essence",gain:[35,60]},
        {label:"Carrera S 3.0 turbo 450 ch",hp:450,fuel:"essence",gain:[45,70]},
        {label:"Turbo S 3.8 580 ch",hp:580,fuel:"essence",gain:[60,90]}
      ],
      "Cayenne": [
        {label:"3.0 V6 340 ch turbo",hp:340,fuel:"essence",gain:[35,55]},
        {label:"3.0 V6 E-Hybrid 462 ch",hp:462,fuel:"hybride",gain:[0,0]},
        {label:"4.0 V8 Turbo 550 ch",hp:550,fuel:"essence",gain:[60,90]},
        {label:"3.0 Diesel 262 ch",hp:262,fuel:"diesel",gain:[35,50]}
      ],
      "Macan": [
        {label:"2.0 turbo 245 ch",hp:245,fuel:"essence",gain:[35,50]},
        {label:"2.0 turbo 265 ch",hp:265,fuel:"essence",gain:[35,50]},
        {label:"3.0 V6 S 354 ch",hp:354,fuel:"essence",gain:[45,70]},
        {label:"2.9 V6 GTS 380 ch",hp:380,fuel:"essence",gain:[45,70]}
      ]
    },
    "Volvo": {
      "V60": [
        {label:"T4 essence 190 ch",hp:190,fuel:"essence",gain:[25,40]},
        {label:"T5 essence 250 ch",hp:250,fuel:"essence",gain:[35,50]},
        {label:"D3 diesel 150 ch",hp:150,fuel:"diesel",gain:[25,35]},
        {label:"D4 diesel 181 ch",hp:181,fuel:"diesel",gain:[30,45]},
        {label:"D5 diesel 235 ch",hp:235,fuel:"diesel",gain:[35,50]}
      ],
      "XC60": [
        {label:"T5 essence 250 ch",hp:250,fuel:"essence",gain:[35,50]},
        {label:"T6 essence 310 ch",hp:310,fuel:"essence",gain:[40,60]},
        {label:"D3 diesel 150 ch",hp:150,fuel:"diesel",gain:[25,35]},
        {label:"D4 diesel 190 ch",hp:190,fuel:"diesel",gain:[30,45]},
        {label:"D5 diesel 235 ch",hp:235,fuel:"diesel",gain:[35,50]}
      ]
    }
  };

  // Ajout sans doublons : on garde les motorisations déjà présentes dans la première version.
  Object.entries(extraEngines).forEach(([make, models]) => {
    if (!vehicleDB[make]) vehicleDB[make] = {};
    Object.entries(models).forEach(([model, engines]) => {
      if (!vehicleDB[make][model]) vehicleDB[make][model] = [];
      const existingLabels = new Set(vehicleDB[make][model].map(engine => engine.label));
      engines.forEach(engine => {
        if (!existingLabels.has(engine.label)) vehicleDB[make][model].push(engine);
      });
    });
  });

  const makeSelect = $("#make");
  const modelSelect = $("#model");
  const engineSelect = $("#engine-model");
  const stageSelect = $("#stage");
  const calculateButton = $("#calculate");
  const resultBox = $("#result");

  function fillSelect(select, placeholder, values) {
    if (!select) return;
    select.replaceChildren();
    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);

    values.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function refreshModels() {
    if (!makeSelect || !modelSelect || !engineSelect) return;
    const make = makeSelect.value;
    const models = vehicleDB[make] || {};
    fillSelect(modelSelect, "Choisir un modèle", Object.keys(models));
    fillSelect(engineSelect, "Choisir une motorisation", []);

    // CORRECTION : activer le menu modèle après le choix de la marque.
    modelSelect.disabled = Object.keys(models).length === 0;
    engineSelect.disabled = true;

    if (resultBox) {
      resultBox.textContent = Object.keys(models).length
        ? "Choisissez un modèle, puis une motorisation."
        : "Choisissez d'abord une marque de véhicule.";
    }
  }

  function refreshEngines() {
    if (!makeSelect || !modelSelect || !engineSelect) return;
    const make = makeSelect.value;
    const model = modelSelect.value;
    const engines = vehicleDB[make]?.[model] || [];

    fillSelect(engineSelect, "Choisir une motorisation", []);
    engines.forEach((engine, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = engine.label;
      engineSelect.appendChild(option);
    });

    // CORRECTION : activer le menu motorisation après le choix du modèle.
    engineSelect.disabled = engines.length === 0;

    if (resultBox) {
      resultBox.textContent = engines.length
        ? "Choisissez une motorisation puis cliquez sur « Estimer les gains »."
        : "Aucune motorisation référencée pour ce modèle. Contactez Ouestpower pour une étude.";
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  if (makeSelect && modelSelect && engineSelect) {
    // État initial cohérent, même si le HTML contient l'attribut disabled.
    fillSelect(makeSelect, "Choisir une marque", Object.keys(vehicleDB));
    fillSelect(modelSelect, "Choisir un modèle", []);
    fillSelect(engineSelect, "Choisir une motorisation", []);
    modelSelect.disabled = true;
    engineSelect.disabled = true;

    makeSelect.addEventListener("change", refreshModels);
    modelSelect.addEventListener("change", refreshEngines);
  } else {
    console.warn("Ouestpower : un ou plusieurs menus de l'estimateur sont introuvables. Vérifiez les IDs #make, #model et #engine-model dans index.html.");
  }

  if (calculateButton) calculateButton.addEventListener("click", () => {
    if (!makeSelect || !modelSelect || !engineSelect || !stageSelect || !resultBox) return;

    const make = makeSelect.value;
    const model = modelSelect.value;
    const engineIndex = engineSelect.value;
    const engine = engineIndex !== "" ? vehicleDB[make]?.[model]?.[Number(engineIndex)] : null;

    if (!make || !model || engineIndex === "" || !engine) {
      resultBox.innerHTML = "<strong>Sélection incomplète.</strong><p>Choisissez une marque, un modèle et une motorisation.</p>";
      return;
    }

    const stage = String(stageSelect.value || "").toLowerCase();
    if (["flex", "flexfuel", "e85"].includes(stage)) {
      resultBox.innerHTML =
        `<span class="result-label">ÉTUDE FLEXFUEL E85</span>
         <h3>${escapeHtml(make)} ${escapeHtml(model)} — ${escapeHtml(engine.label)}</h3>
         <p>La compatibilité E85 doit être vérifiée pour cette motorisation. Une étude spécifique est nécessaire avant toute conversion.</p>
         <p>La conversion FlexFuel ne correspond pas à une estimation Stage 1 de puissance.</p>`;
      return;
    }

    if (engine.fuel === "hybride") {
      resultBox.innerHTML =
        `<span class="result-label">ÉTUDE PERSONNALISÉE</span>
         <h3>${escapeHtml(make)} ${escapeHtml(model)} — ${escapeHtml(engine.label)}</h3>
         <p>Les systèmes hybrides nécessitent une étude spécifique. Aucun gain fiable ne peut être annoncé automatiquement.</p>`;
      return;
    }

    const min = engine.hp + engine.gain[0];
    const max = engine.hp + engine.gain[1];
    const gainText = engine.gain[0] === engine.gain[1]
      ? `+${engine.gain[0]} ch`
      : `+${engine.gain[0]} à +${engine.gain[1]} ch`;

    resultBox.innerHTML =
      `<span class="result-label">FOURCHETTE THÉORIQUE APRÈS STAGE 1</span>
       <h3>${min} à ${max} ch environ</h3>
       <p><strong>Véhicule :</strong> ${escapeHtml(make)} ${escapeHtml(model)} — ${escapeHtml(engine.label)}</p>
       <p><strong>Puissance d'origine :</strong> ${engine.hp} ch</p>
       <p><strong>Gain indicatif :</strong> ${gainText}</p>
       <p class="disclaimer">Estimation indicative uniquement. Le résultat dépend du véhicule exact, de son état mécanique, du carburant et de la calibration. Une étude préalable est nécessaire. Toute modification doit respecter les règles applicables, l'assurance et l'homologation.</p>`;
  });

  // Formulaire de demande : prépare un message que le client peut copier.
  const requestForm = $("#request-form");
  const requestText = $("#request-text");
  const generated = $("#generated");
  const copyRequest = $("#copy-request");

  if (requestForm) requestForm.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(requestForm);
    const get = key => String(form.get(key) || "").trim();
    const message = [
      "DEMANDE OUESTPOWER",
      `Nom : ${get("name") || "Non renseigné"}`,
      `Contact pour réponse : ${get("reply") || "Non renseigné"}`,
      `Prestation : ${get("service") || "Non renseignée"}`,
      `Véhicule : ${get("car") || "Non renseigné"}`,
      `Année : ${get("year") || "Non renseignée"}`,
      `Motorisation : ${get("engine") || "Non renseignée"}`,
      `Message : ${get("message") || "Aucun détail supplémentaire"}`
    ].join("\n");

    if (requestText) requestText.value = message;
    if (generated) {
      generated.hidden = false;
      generated.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  if (copyRequest && requestText) copyRequest.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(requestText.value);
      copyRequest.textContent = "Message copié";
    } catch (_) {
      requestText.focus();
      requestText.select();
      try { document.execCommand("copy"); } catch (_) {}
      copyRequest.textContent = "Sélectionnez et copiez le message";
    }
  });
})();
