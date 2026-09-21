const $ = id => document.getElementById(id);
const fields = ["name","role","location","email","photo","about","skills","degree","college","year","score","projectName","projectDesc","experience","linkedin","github"];

const defaultData = {
  name:"", role:"", location:"", email:"", photo:"", about:"", skills:"",
  degree:"", college:"", year:"", score:"", projectName:"", projectDesc:"",
  experience:"", linkedin:"", github:""
};

let data = JSON.parse(localStorage.getItem("profolioDraft") || "null") || {...defaultData};

fields.forEach(id => {
  $(id).value = data[id] || "";
  $(id).addEventListener("input", e => {
    data[id] = e.target.value;
    localStorage.setItem("profolioDraft", JSON.stringify(data));
    render();
  });
});

function render(){
  $("previewName").textContent = data.name || "Your Name";
  $("previewRole").textContent = (data.role || "YOUR PROFESSION").toUpperCase();
  $("previewAbout").textContent = data.about || "Your introduction will appear here as you fill in the form.";
  $("previewPhoto").src = data.photo || "https://placehold.co/160x160?text=You";
  $("previewLinkedin").href = data.linkedin || "#";
  $("previewGithub").href = data.github || "#";

  const skillList = (data.skills || "").split(",").map(x=>x.trim()).filter(Boolean);
  $("previewSkills").innerHTML = skillList.length ? skillList.map(s=>`<span>${escapeHtml(s)}</span>`).join("") : "<i>Skills appear here</i>";
  $("previewDegree").textContent = data.degree || "Your degree";
  $("previewCollege").textContent = data.college || "Your college";
  $("previewYear").textContent = [data.year,data.score].filter(Boolean).join(" · ");
  $("previewProject").textContent = data.projectName || "Your project";
  $("previewProjectDesc").textContent = data.projectDesc || "Project description";
  $("previewExperience").textContent = data.experience || "Your experience will appear here.";

  $("resumeName").textContent = data.name || "Your Name";
  $("resumeRole").textContent = data.role || "Your Profession";
  $("resumeContact").textContent = [data.location,data.email].filter(Boolean).join(" · ") || "Location · Email";
  $("resumeAbout").textContent = data.about || "Your summary";
  $("resumeSkills").textContent = data.skills || "Your skills";
  $("resumeExperience").textContent = data.experience || "Your experience";
  $("resumeProject").textContent = data.projectName || "Your project";
  $("resumeProjectDesc").textContent = data.projectDesc || "Project description";
  $("resumeEducation").textContent = [data.degree,data.college,data.year,data.score].filter(Boolean).join(" · ") || "Your education";

  const filled = fields.filter(f => (data[f]||"").trim()).length;
  $("progressBar").style.width = Math.max(8, Math.round(filled/fields.length*100))+"%";
  updateATS();
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

document.querySelectorAll(".template").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".template").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    $("portfolioCard").className = "portfolio-card "+btn.dataset.template;
  });
});

document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    showView(btn.dataset.view);
  });
});

function showView(view){
  $("portfolioView").classList.toggle("hidden", view!=="portfolio");
  $("resumeView").classList.toggle("hidden", view!=="resume");
  $("atsView").classList.toggle("hidden", view!=="ats");
  $("previewTitle").textContent = view==="portfolio" ? "Your Portfolio" : view==="resume" ? "Your Resume" : "ATS Checker";
}
$("resumeBtn").onclick=()=>{document.querySelector('[data-view="resume"]').click()};
$("printBtn").onclick=()=>window.print();
$("resumePrint").onclick=()=>window.print();

$("clearBtn").onclick=()=>{
  if(confirm("Clear this workspace? Your local draft will be deleted from this browser.")){
    localStorage.removeItem("profolioDraft");
    data={...defaultData};
    fields.forEach(id=>$(id).value="");
    render();
  }
};

$("improveBtn").onclick=()=>{
  const current=data.about.trim();
  if(!current){
    alert("Write an About section first, then click Improve About.");
    return;
  }
  // Demo enhancement. Connect this action to your AI backend later.
  const improved = current.replace(/\s+/g," ").trim();
  data.about = improved.charAt(0).toUpperCase()+improved.slice(1);
  $("about").value=data.about;
  localStorage.setItem("profolioDraft",JSON.stringify(data));
  render();
  alert("Demo improvement applied. Connect your AI API to enable real AI rewriting.");
};

function updateATS(){
  let score=45;
  ["name","role","email","about","skills","degree","college","projectName","projectDesc","experience"].forEach(k=>{if(data[k].trim())score+=5});
  score=Math.min(100,score);
  $("atsScore").textContent=score;
  $("atsLabel").textContent=score>=85?"Strong foundation":score>=65?"Good foundation":"Needs more information";
  const tips=[];
  if(!data.about) tips.push("Add a concise professional summary.");
  if(!data.experience) tips.push("Add measurable experience, internships, or relevant work.");
  if(!data.projectDesc) tips.push("Describe project impact, tools, and your contribution.");
  if(!data.skills) tips.push("Add job-relevant skills and technologies.");
  if(data.skills && !/python|java|javascript|sql|machine|ai|data|react/i.test(data.skills)) tips.push("Consider adding specific technical keywords relevant to your target role.");
  $("atsTips").innerHTML=tips.length?tips.map(t=>`<div class="tip">💡 ${escapeHtml(t)}</div>`).join(""):'<div class="tip">✓ Your current information covers the main resume sections.</div>';
}
render();
