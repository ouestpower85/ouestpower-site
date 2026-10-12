const $=s=>document.querySelector(s);
$("#year").textContent=new Date().getFullYear();
const menu=$(".menu-toggle");menu.addEventListener("click",()=>{const n=$("#nav");n.classList.toggle("open");menu.setAttribute("aria-expanded",n.classList.contains("open")?"true":"false")});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>$("#nav").classList.remove("open")));
document.querySelectorAll("[data-service]").forEach(a=>a.addEventListener("click",()=>{const s=$("#service");if(s)s.value=a.dataset.service;}));
// Base indicative de véhicules : puissance d'origine et fourchette Stage 1 approximative.
const vehicleDB = {
  "Audi": {
    "A1": [
      {label:"1.4 TFSI 122 ch (essence turbo)", hp:122, fuel:"essence", gain:[20,35]},
      {label:"1.6 TDI 90 ch (diesel turbo)", hp:90, fuel:"diesel", gain:[20,30]},
      {label:"2.0 TFSI S1 231 ch (essence turbo)", hp:231, fuel:"essence", gain:[35,50]}
    ],
    "A3": [
      {label:"2.0 TDI 150 ch (diesel turbo)", hp:150, fuel:"diesel", gain:[30,40]},
      {label:"2.0 TFSI 190 ch (essence turbo)", hp:190, fuel:"essence", gain:[35,50]},
      {label:"S3 2.0 TFSI 310 ch (essence turbo)", hp:310, fuel:"essence", gain:[45,65]}
    ],
    "A4": [
      {label:"2.0 TDI 150 ch (diesel turbo)", hp:150, fuel:"diesel", gain:[30,40]},
      {label:"2.0 TFSI 190 ch (essence turbo)", hp:190, fuel:"essence", gain:[35,50]}
    ],
    "S3": [{label:"2.0 TFSI 310 ch (essence turbo)",hp:310,fuel:"essence",gain:[45,65]}],
    "RS3": [{label:"2.5 TFSI 400 ch (essence turbo)",hp:400,fuel:"essence",gain:[60,90]}],
    "S4": [{label:"3.0 TFSI 354 ch (essence turbo)",hp:354,fuel:"essence",gain:[50,80]}],
    "SQ5": [{label:"3.0 TDI 286 ch (diesel turbo)",hp:286,fuel:"diesel",gain:[40,60]}]
  },
  "BMW": {
    "Série 1": [
      {label:"118d 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
      {label:"120i 184 ch (essence turbo)",hp:184,fuel:"essence",gain:[30,45]},
      {label:"M135i 306 ch (essence turbo)",hp:306,fuel:"essence",gain:[45,65]}
    ],
    "Série 3": [
      {label:"320d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
      {label:"330d 265 ch (diesel turbo)",hp:265,fuel:"diesel",gain:[40,60]},
      {label:"330i 258 ch (essence turbo)",hp:258,fuel:"essence",gain:[40,60]},
      {label:"M340i 374 ch (essence turbo)",hp:374,fuel:"essence",gain:[50,80]}
    ],
    "Série 5": [
      {label:"520d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]},
      {label:"530d 265 ch (diesel turbo)",hp:265,fuel:"diesel",gain:[40,60]},
      {label:"530i 231 ch (essence atmosphérique)",hp:231,fuel:"atmo",gain:[5,12]}
    ],
    "M2": [
      {label:"M2 F87 370 ch (essence turbo)",hp:370,fuel:"essence",gain:[50,80]},
      {label:"M2 Competition 410 ch (essence turbo)",hp:410,fuel:"essence",gain:[50,80]},
      {label:"M2 G87 460 ch (essence turbo)",hp:460,fuel:"essence",gain:[50,80]}
    ],
    "M3": [
      {label:"M3 F80 431 ch (essence turbo)",hp:431,fuel:"essence",gain:[60,90]},
      {label:"M3 Competition G80 510 ch (essence turbo)",hp:510,fuel:"essence",gain:[60,90]}
    ],
    "M4": [
      {label:"M4 F82 431 ch (essence turbo)",hp:431,fuel:"essence",gain:[60,90]},
      {label:"M4 Competition G82 510 ch (essence turbo)",hp:510,fuel:"essence",gain:[60,90]}
    ],
    "X3": [{label:"xDrive30d 286 ch (diesel turbo)",hp:286,fuel:"diesel",gain:[40,60]}]
  },
  "Mercedes-Benz": {
    "Classe A": [
      {label:"A200 163 ch (essence turbo)",hp:163,fuel:"essence",gain:[25,40]},
      {label:"A220d 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[30,45]},
      {label:"AMG A45 S 421 ch (essence turbo)",hp:421,fuel:"essence",gain:[40,70]}
    ],
    "Classe C": [
      {label:"C220d 194 ch (diesel turbo)",hp:194,fuel:"diesel",gain:[35,45]},
      {label:"C300 258 ch (essence turbo)",hp:258,fuel:"essence",gain:[35,55]},
      {label:"AMG C63 S W205 510 ch (essence biturbo)",hp:510,fuel:"essence",gain:[40,70]}
    ],
    "Classe E": [{label:"E220d 194 ch (diesel turbo)",hp:194,fuel:"diesel",gain:[35,45]}],
    "A35 AMG": [{label:"2.0 turbo 306 ch",hp:306,fuel:"essence",gain:[40,60]}],
    "A45 AMG": [{label:"2.0 turbo 421 ch",hp:421,fuel:"essence",gain:[40,70]}],
    "AMG GT": [{label:"4.0 V8 biturbo 585 ch",hp:585,fuel:"essence",gain:[50,80]}]
  },
  "Volkswagen": {
    "Golf": [
      {label:"1.5 TSI 150 ch (essence turbo)",hp:150,fuel:"essence",gain:[25,35]},
      {label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},
      {label:"GTI 2.0 TSI 245 ch (essence turbo)",hp:245,fuel:"essence",gain:[40,60]},
      {label:"R 2.0 TSI 320 ch (essence turbo)",hp:320,fuel:"essence",gain:[45,70]}
    ],
    "Polo": [{label:"1.0 TSI 110 ch (essence turbo)",hp:110,fuel:"essence",gain:[20,30]}],
    "Passat": [{label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]}],
    "Tiguan": [{label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]}],
    "T-Roc": [{label:"2.0 TSI 190 ch (essence turbo)",hp:190,fuel:"essence",gain:[30,45]}]
  },
  "Renault": {
    "Clio": [
      {label:"1.5 dCi 90 ch (diesel turbo)",hp:90,fuel:"diesel",gain:[20,30]},
      {label:"1.3 TCe 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,35]},
      {label:"Clio RS 1.6 turbo 200 ch",hp:200,fuel:"essence",gain:[25,40]}
    ],
    "Mégane": [
      {label:"1.5 dCi 110 ch (diesel turbo)",hp:110,fuel:"diesel",gain:[20,30]},
      {label:"1.6 dCi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]},
      {label:"Mégane RS 1.8 TCe 280 ch",hp:280,fuel:"essence",gain:[35,55]}
    ],
    "Captur": [{label:"1.3 TCe 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,35]}],
    "Trafic": [{label:"2.0 dCi 145 ch (diesel turbo)",hp:145,fuel:"diesel",gain:[25,40]}]
  },
  "Peugeot": {
    "208": [
      {label:"1.2 PureTech 100 ch (essence turbo)",hp:100,fuel:"essence",gain:[15,25]},
      {label:"1.5 BlueHDi 100 ch (diesel turbo)",hp:100,fuel:"diesel",gain:[20,30]}
    ],
    "308": [
      {label:"1.2 PureTech 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]},
      {label:"1.5 BlueHDi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]}
    ],
    "3008": [{label:"1.5 BlueHDi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]}],
    "508": [{label:"2.0 BlueHDi 180 ch (diesel turbo)",hp:180,fuel:"diesel",gain:[30,45]}]
  },
  "Citroën": {
    "C1": [{label:"1.0 VTi 68 ch (essence atmosphérique)",hp:68,fuel:"atmo",gain:[1,4]}],
    "C3": [{label:"1.2 PureTech 110 ch (essence turbo)",hp:110,fuel:"essence",gain:[15,25]},{label:"1.5 BlueHDi 100 ch (diesel turbo)",hp:100,fuel:"diesel",gain:[20,30]}],
    "C4": [{label:"1.2 PureTech 130 ch (essence turbo)",hp:130,fuel:"essence",gain:[20,30]}],
    "Berlingo": [{label:"1.5 BlueHDi 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]}]
  },
  "Ford": {
    "Fiesta": [{label:"1.0 EcoBoost 125 ch (essence turbo)",hp:125,fuel:"essence",gain:[20,30]}],
    "Focus": [{label:"1.5 EcoBoost 150 ch (essence turbo)",hp:150,fuel:"essence",gain:[25,40]},{label:"2.0 TDCi 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]}],
    "Mustang": [{label:"5.0 V8 450 ch (essence atmosphérique)",hp:450,fuel:"atmo",gain:[10,25]}],
    "Transit": [{label:"2.0 EcoBlue 130 ch (diesel turbo)",hp:130,fuel:"diesel",gain:[25,35]}]
  },
  "Toyota": {
    "Yaris": [{label:"1.5 hybride 116 ch (hybride)",hp:116,fuel:"hybride",gain:[0,0]}],
    "GR Yaris": [{label:"1.6 turbo 261 ch",hp:261,fuel:"essence",gain:[30,50]}],
    "Supra": [{label:"3.0 turbo 340 ch",hp:340,fuel:"essence",gain:[40,65]}]
  },
  "Škoda": {
    "Octavia": [{label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},{label:"2.0 TSI RS 245 ch (essence turbo)",hp:245,fuel:"essence",gain:[40,60]}],
    "Superb": [{label:"2.0 TDI 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[35,45]}]
  },
  "SEAT / CUPRA": {
    "Leon": [{label:"2.0 TDI 150 ch (diesel turbo)",hp:150,fuel:"diesel",gain:[30,40]},{label:"Leon Cupra 300 ch (essence turbo)",hp:300,fuel:"essence",gain:[40,65]}],
    "Formentor": [{label:"2.0 TSI 310 ch (essence turbo)",hp:310,fuel:"essence",gain:[40,65]}]
  },
  "Opel": {
    "Corsa": [{label:"1.2 Turbo 100 ch (essence turbo)",hp:100,fuel:"essence",gain:[15,25]}],
    "Astra": [{label:"1.5 Diesel 122 ch (diesel turbo)",hp:122,fuel:"diesel",gain:[20,30]}],
    "Insignia": [{label:"2.0 Diesel 170 ch (diesel turbo)",hp:170,fuel:"diesel",gain:[30,40]}]
  },
  "Fiat": {
    "500": [{label:"1.0 Hybrid 70 ch (hybride)",hp:70,fuel:"hybride",gain:[0,0]}],
    "Ducato": [{label:"2.3 Multijet 140 ch (diesel turbo)",hp:140,fuel:"diesel",gain:[25,40]}]
  },
  "Mini": {
    "Cooper S": [{label:"2.0 turbo 192 ch (essence turbo)",hp:192,fuel:"essence",gain:[30,45]}],
    "John Cooper Works": [{label:"2.0 turbo 231 ch (essence turbo)",hp:231,fuel:"essence",gain:[35,55]}]
  },
  "Porsche": {
    "911": [{label:"Carrera 3.0 turbo 385 ch",hp:385,fuel:"essence",gain:[35,60]},{label:"Carrera GTS 480 ch",hp:480,fuel:"essence",gain:[40,70]}],
    "Cayenne": [{label:"3.0 V6 turbo 340 ch",hp:340,fuel:"essence",gain:[35,55]}],
    "Macan": [{label:"2.0 turbo 265 ch",hp:265,fuel:"essence",gain:[35,50]}]
  },
  "Volvo": {
    "V60": [{label:"D4 190 ch (diesel turbo)",hp:190,fuel:"diesel",gain:[30,45]}],
    "XC60": [{label:"B4 diesel 197 ch (diesel turbo)",hp:197,fuel:"diesel",gain:[25,40]}]
  }
};

const makeSelect = document.querySelector("#make");
const modelSelect = document.querySelector("#model");
const engineSelect = document.querySelector("#engine-model");
const stageSelect = document.querySelector("#stage");
const calculateButton = document.querySelector("#calculate");
const resultBox = document.querySelector("#result");

function fillSelect(select, placeholder, values) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}
fillSelect(makeSelect, "Choisir une marque", Object.keys(vehicleDB));

makeSelect.addEventListener("change", () => {
  fillSelect(modelSelect, "Choisir un modèle", makeSelect.value ? Object.keys(vehicleDB[makeSelect.value]) : []);
  modelSelect.disabled = !makeSelect.value;
  fillSelect(engineSelect, "Choisir une motorisation", []);
  engineSelect.disabled = true;
  resultBox.innerHTML = "<span>ESTIMATION INDICATIVE</span><b>Choisissez votre véhicule</b><p>Sélectionnez ensuite le modèle et la motorisation exacte.</p>";
});
modelSelect.addEventListener("change", () => {
  const versions = (vehicleDB[makeSelect.value] || {})[modelSelect.value] || [];
  fillSelect(engineSelect, "Choisir une motorisation", versions.map((v, i) => `${v.label}||${i}`));
  Array.from(engineSelect.options).forEach((option, i) => {
    if (i > 0) option.value = String(i - 1);
  });
  engineSelect.disabled = !modelSelect.value;
  resultBox.innerHTML = "<span>ESTIMATION INDICATIVE</span><b>Choisissez la motorisation</b><p>Les gains dépendent de la version exacte et de l'état du véhicule.</p>";
});
engineSelect.addEventListener("change", () => {
  resultBox.innerHTML = "<span>VÉHICULE SÉLECTIONNÉ</span><b>Prêt à estimer</b><p>Cliquez sur « Estimer les gains » pour afficher une fourchette indicative.</p>";
});
calculateButton.addEventListener("click", () => {
  const make = makeSelect.value, model = modelSelect.value, versionIndex = Number(engineSelect.value);
  if (!make || !model || engineSelect.value === "" || !Number.isFinite(versionIndex)) {
    resultBox.innerHTML = "<span>SÉLECTION INCOMPLÈTE</span><b>Choisissez marque, modèle et motorisation</b><p>Si votre version n'apparaît pas, contactez Ouestpower pour une étude personnalisée.</p>";
    return;
  }
  const vehicle = vehicleDB[make][model][versionIndex];
  if (!vehicle) return;
  if (stageSelect.value === "flex") {
    resultBox.innerHTML = `<span>PROJET FLEXFUEL E85</span><b>Compatibilité à vérifier</b><p>Véhicule sélectionné : ${make} ${model} — ${vehicle.label}.</p><p>Aucun gain de puissance n'est promis pour une conversion E85. La compatibilité mécanique et réglementaire doit être vérifiée avant toute intervention.</p>`;
    return;
  }
  if (vehicle.fuel === "hybride") {
    resultBox.innerHTML = `<span>ÉTUDE PERSONNALISÉE</span><b>Estimation non disponible</b><p>${make} ${model} — ${vehicle.label}. Les systèmes hybrides nécessitent une étude spécifique ; aucun gain générique n'est affiché.</p>`;
    return;
  }
  const min = vehicle.hp + vehicle.gain[0];
  const max = vehicle.hp + vehicle.gain[1];
  resultBox.innerHTML = `<span>FOURCHETTE THÉORIQUE APRÈS STAGE 1</span><b>${min} à ${max} ch environ</b><p><strong>Véhicule :</strong> ${make} ${model} — ${vehicle.label}</p><p><strong>Puissance d'origine :</strong> ${vehicle.hp} ch</p><p><strong>Gain indicatif :</strong> +${vehicle.gain[0]} à +${vehicle.gain[1]} ch</p><p>Ces valeurs sont des ordres de grandeur indicatifs, à confirmer sur la version exacte après étude technique. Elles ne constituent pas une promesse de résultat.</p>`;
});

$("#request-form").addEventListener("submit",e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);
 const msg=`DEMANDE OUESTPOWER\nNom : ${f.get("name")}\nContact pour réponse : ${f.get("reply")}\nPrestation : ${f.get("service")}\nVéhicule : ${f.get("car")}\nAnnée : ${f.get("year")||"Non précisée"}\nMotorisation / puissance : ${f.get("engine")||"Non précisée"}\nMessage : ${f.get("message")||"Aucun message complémentaire"}`;
 $("#request-text").value=msg;$("#generated").hidden=false;$("#generated").scrollIntoView({behavior:"smooth",block:"center"});
});
$("#copy-request").addEventListener("click",async()=>{const t=$("#request-text");try{await navigator.clipboard.writeText(t.value);$("#copy-request").textContent="Demande copiée ✓";}catch(e){t.select();document.execCommand("copy");$("#copy-request").textContent="Copier à nouveau";}});
