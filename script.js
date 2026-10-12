/* OUESTPOWER — estimateur véhicules
   Remplacement complet de script.js.
   Les gains sont des fourchettes indicatives, jamais une garantie.
*/
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Menu mobile et navigation
  const menuToggle = $("#menu-toggle, .menu-toggle, [data-menu-toggle]");
  const nav = $("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }
  $$('nav a').forEach(link => link.addEventListener("click", () => nav?.classList.remove("open")));
  $$("[data-service]").forEach(button => button.addEventListener("click", () => {
    const service = button.dataset.service;
    const target = service ? $(`[data-service-panel="${service}"]`) : null;
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  // Base de véhicules indicative : puissance d'origine et gain Stage 1 approximatif.
  // Les valeurs varient selon la version exacte, l'année, l'état et le carburant.
  const vehicleDB = {
    "Audi": {
      "A1": [
        {label:"1.0 TFSI 95 ch (essence turbo)",hp:95,fuel:"essence",gain:[20,30]},
        {label:"1.0 TFSI 110 ch (essence turbo)",hp:110,fuel:"essence",gain:[20,30]},
        {label:"1.4 TFSI 125 ch (essence turbo)",hp:125,fuel:"essence",gain:[25,35]},
        {label:"1.6 TDI 90 ch (diesel turbo)",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.6 TDI 105 ch (diesel turbo)",hp:105,fuel:"diesel",gain:[25,30]}
      ],
      "A3": [
        {label:"1.6 TDI 110 ch (diesel turbo)",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 184 ch (diesel turbo)",hp:184,fuel:"diesel",gain:[30,45]},
        {label:"1.4 TFSI 150 ch (essence turbo)",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TFSI 190 ch (essence turbo)",hp:190,fuel:"essence",gain:[35,50]},
        {label:"S3 2.0 TFSI 310 ch (essence turbo)",hp:310,fuel:"essence",gain:[45,65]},
        {label:"RS3 2.5 TFSI 400 ch (essence turbo)",hp:400,fuel:"essence",gain:[60,90]}
      ],
      "A4": [
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"2.0 TFSI 190 ch (essence turbo)",hp:190,fuel:"essence",gain:[35,50]},
        {label:"3.0 TDI 218 ch (diesel turbo)",hp:218,fuel:"diesel",gain:[40,55]}
      ],
      "A5": [
        {label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"2.0 TFSI 252 ch (essence turbo)",hp:252,fuel:"essence",gain:[40,60]},
        {label:"S5 3.0 TFSI 354 ch (essence turbo)",hp:354,fuel:"essence",gain:[50,80]}
      ],
      "A6": [
        {label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"3.0 TDI 272 ch (diesel turbo)",hp:272,fuel:"diesel",gain:[40,60]},
        {label:"S6 4.0 TFSI 450 ch (essence turbo)",hp:450,fuel:"essence",gain:[60,90]},
        {label:"RS6 4.0 TFSI 600 ch (essence turbo)",hp:600,fuel:"essence",gain:[80,120]}
      ],
      "Q3": [
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TFSI 180 ch (essence turbo)",hp:180,fuel:"essence",gain:[30,45]}
      ],
      "Q5": [
        {label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"3.0 TDI 286 ch (diesel turbo)",hp:286,fuel:"diesel",gain:[40,60]}
      ],
      "Q7": [
        {label:"3.0 TDI 272 ch (diesel turbo)",hp:272,fuel:"diesel",gain:[40,60]},
        {label:"3.0 TDI 286 ch (diesel turbo)",hp:286,fuel:"diesel",gain:[40,60]}
      ],
      "S4": [{label:"3.0 TFSI 354 ch (essence turbo)",hp:354,fuel:"essence",gain:[50,80]}],
      "S5": [{label:"3.0 TFSI 354 ch (essence turbo)",hp:354,fuel:"essence",gain:[50,80]}],
      "RS4": [{label:"2.9 TFSI 450 ch (essence turbo)",hp:450,fuel:"essence",gain:[60,90]}],
      "RS6": [{label:"4.0 TFSI 600 ch (essence turbo)",hp:600,fuel:"essence",gain:[80,120]}]
    },
    "BMW": {
      "Série 1": [
        {label:"118d 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"120d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"120i 184 ch (essence turbo)",hp:184,fuel:"essence",gain:[30,45]},
        {label:"M135i 306 ch (essence turbo)",hp:306,fuel:"essence",gain:[45,65]}
      ],
      "Série 2": [
        {label:"218d 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"220d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"M240i 340 ch (essence turbo)",hp:340,fuel:"essence",gain:[50,80]}
      ],
      "Série 3": [
        {label:"318d 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"320d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"330d 265 ch (diesel turbo)",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"330i 258 ch (essence turbo)",hp:258,fuel:"essence",gain:[40,60]},
        {label:"M340i 374 ch (essence turbo)",hp:374,fuel:"essence",gain:[50,80]}
      ],
      "Série 4": [
        {label:"420d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"430d 286 ch (diesel turbo)",hp:286,fuel:"diesel",gain:[40,60]},
        {label:"M440i 374 ch (essence turbo)",hp:374,fuel:"essence",gain:[50,80]}
      ],
      "Série 5": [
        {label:"520d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"530d 265 ch (diesel turbo)",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"530i 252 ch (essence turbo)",hp:252,fuel:"essence",gain:[35,55]},
        {label:"540i 340 ch (essence turbo)",hp:340,fuel:"essence",gain:[45,70]}
      ],
      "Série 7": [
        {label:"730d 265 ch (diesel turbo)",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"740d 320 ch (diesel turbo)",hp:320,fuel:"diesel",gain:[45,65]},
        {label:"750i 530 ch (essence turbo)",hp:530,fuel:"essence",gain:[70,100]}
      ],
      "X1": [
        {label:"18d 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"20d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"20i 192 ch (essence turbo)",hp:192,fuel:"essence",gain:[30,45]}
      ],
      "X3": [
        {label:"20d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"30d 265 ch (diesel turbo)",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"M40i 360 ch (essence turbo)",hp:360,fuel:"essence",gain:[50,80]}
      ],
      "X5": [
        {label:"30d 265 ch (diesel turbo)",hp:265,fuel:"diesel",gain:[40,60]},
        {label:"40d 340 ch (diesel turbo)",hp:340,fuel:"diesel",gain:[45,65]},
        {label:"M50i 530 ch (essence turbo)",hp:530,fuel:"essence",gain:[70,100]}
      ],
      "M2": [
        {label:"M2 F87 370 ch (essence turbo)",hp:370,fuel:"essence",gain:[50,80]},
        {label:"M2 Competition 410 ch (essence turbo)",hp:410,fuel:"essence",gain:[50,80]},
        {label:"M2 G87 460 ch (essence turbo)",hp:460,fuel:"essence",gain:[50,80]}
      ],
      "M3": [
        {label:"M3 F80 431 ch (essence turbo)",hp:431,fuel:"essence",gain:[60,90]},
        {label:"M3 Competition 510 ch (essence turbo)",hp:510,fuel:"essence",gain:[60,90]}
      ],
      "M4": [
        {label:"M4 F82 431 ch (essence turbo)",hp:431,fuel:"essence",gain:[60,90]},
        {label:"M4 Competition 510 ch (essence turbo)",hp:510,fuel:"essence",gain:[60,90]}
      ],
      "M5": [
        {label:"M5 F90 600 ch (essence turbo)",hp:600,fuel:"essence",gain:[80,120]},
        {label:"M5 Competition 625 ch (essence turbo)",hp:625,fuel:"essence",gain:[80,120]}
      ]
    },
    "Mercedes-Benz": {
      "Classe A": [
        {label:"A180d 116 ch (diesel turbo)",hp:116,fuel:"diesel",gain:[25,35]},
        {label:"A200 163 ch (essence turbo)",hp:163,fuel:"essence",gain:[25,40]},
        {label:"A220d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"A35 AMG 306 ch (essence turbo)",hp:306,fuel:"essence",gain:[40,60]},
        {label:"A45 S AMG 421 ch (essence turbo)",hp:421,fuel:"essence",gain:[50,80]}
      ],
      "Classe C": [
        {label:"C220d 194 ch (diesel turbo)",hp:194,fuel:"diesel",gain:[35,45]},
        {label:"C300 258 ch (essence turbo)",hp:258,fuel:"essence",gain:[35,55]},
        {label:"C43 AMG 390 ch (essence turbo)",hp:390,fuel:"essence",gain:[50,80]},
        {label:"C63 AMG 476 ch (essence turbo)",hp:476,fuel:"essence",gain:[50,80]}
      ],
      "Classe E": [
        {label:"E220d 194 ch (diesel turbo)",hp:194,fuel:"diesel",gain:[35,45]},
        {label:"E300 258 ch (essence turbo)",hp:258,fuel:"essence",gain:[35,55]},
        {label:"E400d 340 ch (diesel turbo)",hp:340,fuel:"diesel",gain:[45,65]}
      ],
      "GLC": [
        {label:"220d 194 ch (diesel turbo)",hp:194,fuel:"diesel",gain:[35,45]},
        {label:"300d 245 ch (diesel turbo)",hp:245,fuel:"diesel",gain:[35,50]},
        {label:"AMG 43 390 ch (essence turbo)",hp:390,fuel:"essence",gain:[50,80]}
      ],
      "GLE": [
        {label:"300d 245 ch (diesel turbo)",hp:245,fuel:"diesel",gain:[35,50]},
        {label:"400d 330 ch (diesel turbo)",hp:330,fuel:"diesel",gain:[45,65]}
      ],
      "AMG GT": [{label:"4.0 V8 biturbo 476 ch",hp:476,fuel:"essence",gain:[60,90]}]
    },
    "Volkswagen": {
      "Polo": [
        {label:"1.0 TSI 95 ch (essence turbo)",hp:95,fuel:"essence",gain:[20,30]},
        {label:"1.0 TSI 110 ch (essence turbo)",hp:110,fuel:"essence",gain:[20,30]},
        {label:"2.0 TSI GTI 200 ch (essence turbo)",hp:200,fuel:"essence",gain:[30,45]}
      ],
      "Golf": [
        {label:"1.6 TDI 115 ch (diesel turbo)",hp:115,fuel:"diesel",gain:[25,35]},
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 184 ch (diesel turbo)",hp:184,fuel:"diesel",gain:[30,45]},
        {label:"1.5 TSI 150 ch (essence turbo)",hp:150,fuel:"essence",gain:[25,40]},
        {label:"2.0 TSI GTI 245 ch (essence turbo)",hp:245,fuel:"essence",gain:[35,55]},
        {label:"2.0 TSI R 320 ch (essence turbo)",hp:320,fuel:"essence",gain:[45,70]}
      ],
      "Passat": [
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]}
      ],
      "Tiguan": [
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
        {label:"2.0 TSI 180 ch (essence turbo)",hp:180,fuel:"essence",gain:[30,45]}
      ],
      "Arteon": [{label:"2.0 TDI 200 ch (diesel turbo)",hp:200,fuel:"diesel",gain:[35,50]}],
      "T-Roc": [{label:"2.0 TSI 300 ch R (essence turbo)",hp:300,fuel:"essence",gain:[40,65]}]
    },
    "Peugeot": {
      "208": [
        {label:"1.2 PureTech 100 ch (essence turbo)",hp:100,fuel:"essence",gain:[15,25]},
        {label:"1.2 PureTech 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.6 THP GTi 208 ch (essence turbo)",hp:208,fuel:"essence",gain:[25,40]},
        {label:"1.5 BlueHDi 100 ch (diesel turbo)",hp:100,fuel:"diesel",gain:[20,30]}
      ],
      "308": [
        {label:"1.2 PureTech 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.6 THP 205 ch (essence turbo)",hp:205,fuel:"essence",gain:[25,40]},
        {label:"1.5 BlueHDi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]},
        {label:"2.0 BlueHDi 180 ch (diesel turbo)",hp:180,fuel:"diesel",gain:[30,45]}
      ],
      "3008": [
        {label:"1.2 PureTech 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 BlueHDi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]},
        {label:"2.0 BlueHDi 180 ch (diesel turbo)",hp:180,fuel:"diesel",gain:[30,45]}
      ],
      "508": [
        {label:"1.6 PureTech 180 ch (essence turbo)",hp:180,fuel:"essence",gain:[25,40]},
        {label:"2.0 BlueHDi 180 ch (diesel turbo)",hp:180,fuel:"diesel",gain:[30,45]}
      ]
    },
    "Renault": {
      "Clio": [
        {label:"0.9 TCe 90 ch (essence turbo)",hp:90,fuel:"essence",gain:[15,25]},
        {label:"1.3 TCe 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,35]},
        {label:"1.5 dCi 90 ch (diesel turbo)",hp:90,fuel:"diesel",gain:[20,30]},
        {label:"1.5 Blue dCi 115 ch (diesel turbo)",hp:115,fuel:"diesel",gain:[25,35]}
      ],
      "Mégane": [
        {label:"1.3 TCe 140 ch (essence turbo)",hp:140,fuel:"essence",gain:[20,35]},
        {label:"1.5 dCi 110 ch (diesel turbo)",hp:110,fuel:"diesel",gain:[25,35]},
        {label:"1.6 TCe RS 280 ch (essence turbo)",hp:280,fuel:"essence",gain:[35,55]}
      ],
      "Captur": [
        {label:"1.3 TCe 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,35]},
        {label:"1.5 dCi 115 ch (diesel turbo)",hp:115,fuel:"diesel",gain:[25,35]}
      ],
      "Kadjar": [{label:"1.5 dCi 115 ch (diesel turbo)",hp:115,fuel:"diesel",gain:[25,35]}]
    },
    "Citroën": {
      "C3": [
        {label:"1.2 PureTech 110 ch (essence turbo)",hp:110,fuel:"essence",gain:[15,25]},
        {label:"1.5 BlueHDi 100 ch (diesel turbo)",hp:100,fuel:"diesel",gain:[20,30]}
      ],
      "C4": [
        {label:"1.2 PureTech 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 BlueHDi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]}
      ],
      "C5 Aircross": [
        {label:"1.2 PureTech 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 BlueHDi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]}
      ]
    },
    "Ford": {
      "Fiesta": [
        {label:"1.0 EcoBoost 100 ch (essence turbo)",hp:100,fuel:"essence",gain:[20,30]},
        {label:"1.0 EcoBoost 125 ch (essence turbo)",hp:125,fuel:"essence",gain:[20,35]},
        {label:"1.5 TDCi 95 ch (diesel turbo)",hp:95,fuel:"diesel",gain:[20,30]}
      ],
      "Focus": [
        {label:"1.0 EcoBoost 125 ch (essence turbo)",hp:125,fuel:"essence",gain:[20,35]},
        {label:"1.5 EcoBlue 120 ch (diesel turbo)",hp:120,fuel:"diesel",gain:[25,35]},
        {label:"2.0 EcoBlue 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[30,45]},
        {label:"2.3 EcoBoost ST 280 ch (essence turbo)",hp:280,fuel:"essence",gain:[35,55]}
      ],
      "Kuga": [{label:"2.0 EcoBlue 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[30,45]}],
      "Mustang": [
        {label:"2.3 EcoBoost 290 ch (essence turbo)",hp:290,fuel:"essence",gain:[30,50]},
        {label:"5.0 V8 450 ch (atmosphérique)",hp:450,fuel:"atmo",gain:[5,15]}
      ]
    },
    "SEAT": {
      "Ibiza": [
        {label:"1.0 TSI 110 ch (essence turbo)",hp:110,fuel:"essence",gain:[20,30]},
        {label:"1.6 TDI 95 ch (diesel turbo)",hp:95,fuel:"diesel",gain:[20,30]}
      ],
      "Leon": [
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TSI Cupra 300 ch (essence turbo)",hp:300,fuel:"essence",gain:[40,60]}
      ],
      "Ateca": [{label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]}]
    },
    "Škoda": {
      "Fabia": [{label:"1.0 TSI 110 ch (essence turbo)",hp:110,fuel:"essence",gain:[20,30]}],
      "Octavia": [
        {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
        {label:"2.0 TDI 184 ch (diesel turbo)",hp:184,fuel:"diesel",gain:[30,45]},
        {label:"2.0 TSI RS 245 ch (essence turbo)",hp:245,fuel:"essence",gain:[35,55]}
      ],
      "Superb": [{label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]}],
      "Kodiaq": [{label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]}]
    },
    "Opel": {
      "Corsa": [
        {label:"1.2 Turbo 100 ch (essence turbo)",hp:100,fuel:"essence",gain:[15,25]},
        {label:"1.5 Diesel 102 ch (diesel turbo)",hp:102,fuel:"diesel",gain:[20,30]}
      ],
      "Astra": [
        {label:"1.2 Turbo 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]},
        {label:"1.5 Diesel 122 ch (diesel turbo)",hp:122,fuel:"diesel",gain:[25,35]}
      ],
      "Insignia": [{label:"2.0 Diesel 170 ch (diesel turbo)",hp:170,fuel:"diesel",gain:[30,40]}]
    },
    "Toyota": {
      "Yaris": [{label:"1.5 VVT-i 125 ch (atmosphérique)",hp:125,fuel:"atmo",gain:[3,8]}],
      "Corolla": [{label:"2.0 Hybrid 184 ch (hybride)",hp:184,fuel:"hybride",gain:[0,0]}],
      "GR Yaris": [{label:"1.6 Turbo 261 ch (essence turbo)",hp:261,fuel:"essence",gain:[30,50]}],
      "GR Supra": [{label:"3.0 Turbo 340 ch (essence turbo)",hp:340,fuel:"essence",gain:[50,80]}]
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
      "V60": [{label:"D4 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[30,45]}],
      "XC60": [{label:"B4 diesel 197 ch (diesel turbo)",hp:197,fuel:"diesel",gain:[25,40]}]
    }
  };

  const makeSelect = $("#make");
  const modelSelect = $("#model");
  const engineSelect = $("#engine-model");
  const stageSelect = $("#stage");
  const calculateButton = $("#calculate");
  const resultBox = $("#result");

  function fillSelect(select, placeholder, values) {
    if (!select) return;
    select.innerHTML = "";
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

  fillSelect(
    modelSelect,
    "Choisir un modèle",
    Object.keys(models)
  );

  fillSelect(
    engineSelect,
    "Choisir une motorisation",
    []
  );

  if (resultBox) {
    resultBox.textContent =
      "Sélectionnez un modèle et une motorisation pour afficher une estimation.";
  }
}

function refreshEngines() {
  if (!makeSelect || !modelSelect || !engineSelect) return;

  const make = makeSelect.value;
  const model = modelSelect.value;
  const engines = vehicleDB[make]?.[model] || [];

  engineSelect.innerHTML = "";

  const first = document.createElement("option");
  first.value = "";
  first.textContent = "Choisir une motorisation";
  engineSelect.appendChild(first);

  engines.forEach((engine, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = engine.label;
    engineSelect.appendChild(option);
  });

  if (resultBox) {
    resultBox.textContent =
      "Choisissez une motorisation puis cliquez sur « Estimer les gains ».";
  }
}

  if (makeSelect && modelSelect && engineSelect) {
    fillSelect(makeSelect, "Choisir une marque", Object.keys(vehicleDB));
    fillSelect(modelSelect, "Choisir un modèle", []);
    fillSelect(engineSelect, "Choisir une motorisation", []);
    makeSelect.addEventListener("change", refreshModels);
    modelSelect.addEventListener("change", refreshEngines);
  }

  if (calculateButton) calculateButton.addEventListener("click", () => {
    if (!makeSelect || !modelSelect || !engineSelect || !stageSelect || !resultBox) return;
    const make = makeSelect.value;
    const model = modelSelect.value;
    const index = Number(engineSelect.value);
    const engine = vehicleDB[make]?.[model]?.[index];
    if (!make || !model || engineSelect.value === "" || !engine) {
      resultBox.innerHTML = "<strong>Sélection incomplète.</strong><p>Choisissez une marque, un modèle et une motorisation.</p>";
      return;
    }
    const stage = stageSelect.value;
    if (stage === "flex" || stage === "flexfuel" || stage === "e85") {
      resultBox.innerHTML = `<span class="result-label">ÉTUDE FLEXFUEL E85</span><h3>${escapeHtml(make)} ${escapeHtml(model)} — ${escapeHtml(engine.label)}</h3><p>Compatibilité E85 à vérifier pour cette motorisation. Une étude spécifique est nécessaire avant toute conversion.</p><p>La conversion FlexFuel ne correspond pas à une estimation Stage 1 de puissance.</p>`;
      return;
    }
    if (engine.fuel === "hybride") {
      resultBox.innerHTML = `<span class="result-label">ÉTUDE PERSONNALISÉE</span><h3>${escapeHtml(make)} ${escapeHtml(model)} — ${escapeHtml(engine.label)}</h3><p>Les systèmes hybrides nécessitent une étude spécifique. Aucun gain fiable ne peut être annoncé automatiquement.</p>`;
      return;
    }
    const min = engine.hp + engine.gain[0];
    const max = engine.hp + engine.gain[1];
    const gainText = engine.gain[0] === engine.gain[1] ? `+${engine.gain[0]} ch` : `+${engine.gain[0]} à +${engine.gain[1]} ch`;
    resultBox.innerHTML = `<span class="result-label">FOURCHETTE THÉORIQUE APRÈS STAGE 1</span><h3>${min} à ${max} ch environ</h3><p><strong>Véhicule :</strong> ${escapeHtml(make)} ${escapeHtml(model)} — ${escapeHtml(engine.label)}</p><p><strong>Puissance d’origine :</strong> ${engine.hp} ch</p><p><strong>Gain indicatif :</strong> ${gainText}</p><p class="disclaimer">Estimation indicative uniquement. Le résultat dépend du véhicule exact, de son état mécanique, du carburant et de la calibration. Une mesure et une étude préalables sont nécessaires. Toute modification doit respecter les règles applicables, l’assurance et l’homologation.</p>`;
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[char]));
  }

  // Demande en ligne : prépare un message à envoyer au client via son application de messagerie.
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
    } catch {
      requestText.focus();
      requestText.select();
      try { document.execCommand("copy"); } catch (_) {}
      copyRequest.textContent = "Sélectionnez et copiez le message";
    }
  });
})();
