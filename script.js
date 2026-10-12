const $=s=>document.querySelector(s);
$("#year").textContent=new Date().getFullYear();
const menu=$(".menu-toggle");menu.addEventListener("click",()=>{const n=$("#nav");n.classList.toggle("open");menu.setAttribute("aria-expanded",n.classList.contains("open")?"true":"false")});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>$("#nav").classList.remove("open")));
document.querySelectorAll("[data-service]").forEach(a=>a.addEventListener("click",()=>{const s=$("#service");if(s)s.value=a.dataset.service;}));
$("#calculate").addEventListener("click",()=>{
 const p=Math.max(30,Math.min(1000,Number($("#power").value)||0)),fuel=$("#fuel").value,engine=$("#engine").value,stage=$("#stage").value;
 const out=$("#result");
 if(stage==="flex"){out.innerHTML="<span>ESTIMATION INDICATIVE</span><b>Aucun gain de puissance garanti</b><p>Le résultat dépend du moteur, de la solution retenue et de la compatibilité E85. Une étude préalable est indispensable.</p>";return;}
 let low,high;
 if(engine==="atmo"||fuel==="atmo"){low=.02;high=.05}
 else if(fuel==="diesel"){low=.15;high=.30}
 else{low=.15;high=.25}
 const min=Math.round(p*(1+low)/5)*5,max=Math.round(p*(1+high)/5)*5;
 out.innerHTML=`<span>FOURCHETTE THÉORIQUE APRÈS STAGE 1</span><b>${min} à ${max} ch environ</b><p>Soit un ordre de grandeur de +${Math.round(p*low)} à +${Math.round(p*high)} ch à partir de ${p} ch d'origine. À confirmer pour le modèle exact.</p>`;
});
$("#request-form").addEventListener("submit",e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);
 const msg=`DEMANDE OUESTPOWER\nNom : ${f.get("name")}\nContact pour réponse : ${f.get("reply")}\nPrestation : ${f.get("service")}\nVéhicule : ${f.get("car")}\nAnnée : ${f.get("year")||"Non précisée"}\nMotorisation / puissance : ${f.get("engine")||"Non précisée"}\nMessage : ${f.get("message")||"Aucun message complémentaire"}`;
 $("#request-text").value=msg;$("#generated").hidden=false;$("#generated").scrollIntoView({behavior:"smooth",block:"center"});
});
$("#copy-request").addEventListener("click",async()=>{const t=$("#request-text");try{await navigator.clipboard.writeText(t.value);$("#copy-request").textContent="Demande copiée ✓";}catch(e){t.select();document.execCommand("copy");$("#copy-request").textContent="Copier à nouveau";}});
