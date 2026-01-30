/* BODY FAT PERCENTAGE CALCULATOR - JAVASCRIPT */

// Body fat categories
const BF_CATEGORIES = {
  male: [
    { max: 5, name: 'Essential', class: 'category-essential', desc: 'Minimum fat required for basic health' },
    { max: 13, name: 'Athlete', class: 'category-athlete', desc: 'Competitive athletes and very fit individuals' },
    { max: 17, name: 'Fitness', class: 'category-fitness', desc: 'Fit and active, visible muscle definition' },
    { max: 24, name: 'Average', class: 'category-average', desc: 'Typical healthy range for adult men' },
    { max: 100, name: 'Obese', class: 'category-obese', desc: 'Elevated health risks, consider lifestyle changes' }
  ],
  female: [
    { max: 13, name: 'Essential', class: 'category-essential', desc: 'Minimum fat required for basic health' },
    { max: 20, name: 'Athlete', class: 'category-athlete', desc: 'Competitive athletes and very fit individuals' },
    { max: 24, name: 'Fitness', class: 'category-fitness', desc: 'Fit and active, visible muscle definition' },
    { max: 31, name: 'Average', class: 'category-average', desc: 'Typical healthy range for adult women' },
    { max: 100, name: 'Obese', class: 'category-obese', desc: 'Elevated health risks, consider lifestyle changes' }
  ]
};

// Army body fat limits
const ARMY_LIMITS = {
  male: { '17-20': 20, '21-27': 22, '28-39': 24, '40+': 26 },
  female: { '17-20': 30, '21-27': 32, '28-39': 34, '40+': 36 }
};

// FFMI categories
const FFMI_CATEGORIES = [
  { max: 18, name: 'Below Average', desc: 'Limited muscle development' },
  { max: 20, name: 'Average', desc: 'Typical for occasional exercisers' },
  { max: 22, name: 'Above Average', desc: 'Good muscle from regular training' },
  { max: 25, name: 'Excellent', desc: 'Near natural genetic limit' },
  { max: 100, name: 'Suspicious', desc: 'May indicate PED use or exceptional genetics' }
];

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupTabs();
  setupCalculateButtons();
  setupFAQ();
  setupMobileNav();
  setupPrintButtons();
}

function setupTabs() {
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + tabId).classList.add('active');
    });
  });
}

function setupCalculateButtons() {
  document.getElementById('calc-navy-btn')?.addEventListener('click', calculateNavy);
  document.getElementById('calc-army-btn')?.addEventListener('click', calculateArmy);
  document.getElementById('calc-ffmi-btn')?.addEventListener('click', calculateFFMI);
  document.getElementById('calc-chart-btn')?.addEventListener('click', showChart);
}

function setupPrintButtons() {
  document.querySelectorAll('.print-btn').forEach(btn => {
    btn.addEventListener('click', () => window.print());
  });
}

function getCategory(bf, gender) {
  const cats = BF_CATEGORIES[gender];
  for (const cat of cats) {
    if (bf <= cat.max) return cat;
  }
  return cats[cats.length - 1];
}

function getFFMICategory(ffmi) {
  for (const cat of FFMI_CATEGORIES) {
    if (ffmi <= cat.max) return cat;
  }
  return FFMI_CATEGORIES[FFMI_CATEGORIES.length - 1];
}

// TAB 1: NAVY METHOD
function calculateNavy() {
  const gender = document.querySelector('input[name="navy-gender"]:checked')?.value || 'male';
  const heightFt = parseInt(document.getElementById('navy-height-ft')?.value) || 5;
  const heightIn = parseInt(document.getElementById('navy-height-in')?.value) || 10;
  const weight = parseFloat(document.getElementById('navy-weight')?.value) || 180;
  const neck = parseFloat(document.getElementById('navy-neck')?.value) || 15;
  const waist = parseFloat(document.getElementById('navy-waist')?.value) || 34;
  const hip = parseFloat(document.getElementById('navy-hip')?.value) || 38;

  const height = (heightFt * 12) + heightIn;
  let bodyFat;

  if (gender === 'male') {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
  }

  bodyFat = Math.max(3, Math.min(60, bodyFat));
  const fatMass = weight * (bodyFat / 100);
  const leanMass = weight - fatMass;
  const category = getCategory(bodyFat, gender);

  // Calculate additional metrics
  const bmi = (weight / (height * height)) * 703;
  const idealBFLow = gender === 'male' ? 10 : 18;
  const idealBFHigh = gender === 'male' ? 20 : 28;
  const targetFatLoss = bodyFat > idealBFHigh ? (bodyFat - idealBFHigh) * weight / 100 : 0;

  displayNavyResults({
    bodyFat, fatMass, leanMass, weight, category, gender,
    heightFt, heightIn, neck, waist, hip, bmi, idealBFLow, idealBFHigh, targetFatLoss
  });
}

function displayNavyResults(r) {
  const section = document.getElementById('navy-results');
  if (!section) return;

  // Primary result
  document.getElementById('navy-bf').textContent = r.bodyFat.toFixed(1);
  document.getElementById('navy-category').textContent = r.category.name;
  document.getElementById('navy-category').className = 'result-category ' + r.category.class;

  // Basic metrics
  document.getElementById('navy-fat-mass').textContent = r.fatMass.toFixed(1) + ' lbs';
  document.getElementById('navy-lean-mass').textContent = r.leanMass.toFixed(1) + ' lbs';
  document.getElementById('navy-total').textContent = r.weight.toFixed(1) + ' lbs';

  // Update chart marker
  const markerPos = Math.min(95, Math.max(5, (r.bodyFat / (r.gender === 'male' ? 35 : 45)) * 100));
  document.getElementById('navy-marker').style.left = markerPos + '%';
  document.getElementById('navy-marker-label').textContent = r.bodyFat.toFixed(1) + '%';

  // Enhanced results
  const inputSummary = document.getElementById('navy-input-summary');
  if (inputSummary) {
    let html = `<span class="input-summary-item"><strong>Gender:</strong> ${r.gender === 'male' ? 'Male' : 'Female'}</span>`;
    html += `<span class="input-summary-item"><strong>Height:</strong> ${r.heightFt}'${r.heightIn}"</span>`;
    html += `<span class="input-summary-item"><strong>Weight:</strong> ${r.weight} lbs</span>`;
    html += `<span class="input-summary-item"><strong>Neck:</strong> ${r.neck}"</span>`;
    html += `<span class="input-summary-item"><strong>Waist:</strong> ${r.waist}"</span>`;
    if (r.gender === 'female') html += `<span class="input-summary-item"><strong>Hip:</strong> ${r.hip}"</span>`;
    inputSummary.innerHTML = html;
  }

  const keyResults = document.getElementById('navy-key-results');
  if (keyResults) {
    const healthyRange = r.gender === 'male' ? '10-20%' : '18-28%';
    keyResults.innerHTML = `
      <tr><td>Body Fat Percentage</td><td>${r.bodyFat.toFixed(1)}%</td><td>Healthy: ${healthyRange}</td></tr>
      <tr><td>Fat Mass</td><td>${r.fatMass.toFixed(1)} lbs</td><td>—</td></tr>
      <tr><td>Lean Mass</td><td>${r.leanMass.toFixed(1)} lbs</td><td>—</td></tr>
      <tr><td>Category</td><td>${r.category.name}</td><td>${r.category.desc}</td></tr>
      <tr><td>BMI (for reference)</td><td>${r.bmi.toFixed(1)}</td><td>Normal: 18.5-24.9</td></tr>
    `;
  }

  const interpretation = document.getElementById('navy-interpretation');
  if (interpretation) {
    let html = `<p>Your body fat percentage of <strong>${r.bodyFat.toFixed(1)}%</strong> places you in the <strong>${r.category.name}</strong> category for ${r.gender === 'male' ? 'men' : 'women'}. ${r.category.desc}.</p>`;

    if (r.bodyFat > r.idealBFHigh) {
      html += `<p>To reach the upper end of the healthy range (${r.idealBFHigh}%), you would need to lose approximately <strong>${r.targetFatLoss.toFixed(1)} lbs of fat</strong> while maintaining your current lean mass.</p>`;
    } else if (r.bodyFat < r.idealBFLow) {
      html += `<p>Your body fat is below the typical healthy range. Ensure you're getting adequate nutrition, especially if you're experiencing fatigue, illness, or hormonal issues.</p>`;
    } else {
      html += `<p>You're within the healthy body fat range. Focus on maintaining your current habits and consider your specific goals—whether that's performance, aesthetics, or general health.</p>`;
    }
    interpretation.innerHTML = html;
  }

  section.classList.add('visible');
}

// TAB 2: ARMY METHOD
function calculateArmy() {
  const gender = document.querySelector('input[name="army-gender"]:checked')?.value || 'male';
  const age = parseInt(document.getElementById('army-age')?.value) || 25;
  const heightFt = parseInt(document.getElementById('army-height-ft')?.value) || 5;
  const heightIn = parseInt(document.getElementById('army-height-in')?.value) || 10;
  const neck = parseFloat(document.getElementById('army-neck')?.value) || 15;
  const waist = parseFloat(document.getElementById('army-waist')?.value) || 34;
  const hip = parseFloat(document.getElementById('army-hip')?.value) || 38;

  const height = (heightFt * 12) + heightIn;
  let bodyFat;

  if (gender === 'male') {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
  }

  bodyFat = Math.max(3, Math.min(60, bodyFat));

  // Get Army limit
  let ageGroup;
  if (age <= 20) ageGroup = '17-20';
  else if (age <= 27) ageGroup = '21-27';
  else if (age <= 39) ageGroup = '28-39';
  else ageGroup = '40+';

  const limit = ARMY_LIMITS[gender][ageGroup];
  const passes = bodyFat <= limit;
  const difference = bodyFat - limit;
  const margin = limit - bodyFat;

  displayArmyResults({
    bodyFat, limit, passes, difference, ageGroup, gender, age,
    heightFt, heightIn, neck, waist, hip, margin
  });
}

function displayArmyResults(r) {
  const section = document.getElementById('army-results');
  if (!section) return;

  document.getElementById('army-bf').textContent = r.bodyFat.toFixed(1);
  document.getElementById('army-limit').textContent = r.limit + '%';
  document.getElementById('army-age-group').textContent = r.ageGroup;
  document.getElementById('army-difference').textContent = (r.difference > 0 ? '+' : '') + r.difference.toFixed(1) + '%';

  const statusBox = document.getElementById('army-status');
  if (r.passes) {
    statusBox.className = 'army-status army-pass';
    statusBox.innerHTML = '<div class="army-status-text">PASS - Within Army Standards</div>';
  } else {
    statusBox.className = 'army-status army-fail';
    statusBox.innerHTML = '<div class="army-status-text">EXCEEDS LIMIT by ' + r.difference.toFixed(1) + '%</div>';
  }

  // Enhanced results
  const inputSummary = document.getElementById('army-input-summary');
  if (inputSummary) {
    let html = `<span class="input-summary-item"><strong>Gender:</strong> ${r.gender === 'male' ? 'Male' : 'Female'}</span>`;
    html += `<span class="input-summary-item"><strong>Age:</strong> ${r.age}</span>`;
    html += `<span class="input-summary-item"><strong>Height:</strong> ${r.heightFt}'${r.heightIn}"</span>`;
    html += `<span class="input-summary-item"><strong>Neck:</strong> ${r.neck}"</span>`;
    html += `<span class="input-summary-item"><strong>Waist:</strong> ${r.waist}"</span>`;
    if (r.gender === 'female') html += `<span class="input-summary-item"><strong>Hip:</strong> ${r.hip}"</span>`;
    inputSummary.innerHTML = html;
  }

  const keyResults = document.getElementById('army-key-results');
  if (keyResults) {
    const allLimits = ARMY_LIMITS[r.gender];
    keyResults.innerHTML = `
      <tr><td>Your Body Fat</td><td>${r.bodyFat.toFixed(1)}%</td><td>—</td></tr>
      <tr><td>Your Age Group</td><td>${r.ageGroup}</td><td>—</td></tr>
      <tr><td>Army Limit (Your Group)</td><td>${r.limit}%</td><td>Maximum allowed</td></tr>
      <tr><td>${r.passes ? 'Margin' : 'Over Limit By'}</td><td>${Math.abs(r.difference).toFixed(1)}%</td><td>${r.passes ? 'Room before limit' : 'Must reduce'}</td></tr>
      <tr><td>Status</td><td><strong>${r.passes ? 'PASS' : 'FAIL'}</strong></td><td>—</td></tr>
    `;
  }

  const interpretation = document.getElementById('army-interpretation');
  if (interpretation) {
    let html;
    if (r.passes) {
      html = `<p>You <strong>pass</strong> the Army body composition standard with a margin of <strong>${r.margin.toFixed(1)} percentage points</strong>. Your body fat of ${r.bodyFat.toFixed(1)}% is within the ${r.limit}% limit for ${r.gender === 'male' ? 'men' : 'women'} ages ${r.ageGroup}.</p>`;
      if (r.margin < 3) {
        html += `<p>However, your margin is small. Consider maintaining or slightly improving your body composition to ensure you pass comfortably on test day, when measurements may vary slightly.</p>`;
      }
    } else {
      html = `<p>You <strong>exceed</strong> the Army body composition standard by <strong>${r.difference.toFixed(1)} percentage points</strong>. The maximum allowed for ${r.gender === 'male' ? 'men' : 'women'} ages ${r.ageGroup} is ${r.limit}%.</p>`;
      html += `<p>To meet the standard, you would need to reduce your body fat by approximately ${r.difference.toFixed(1)}%. This can be achieved through a combination of diet modification and increased physical activity.</p>`;
    }
    interpretation.innerHTML = html;
  }

  section.classList.add('visible');
}

// TAB 3: FFMI CALCULATOR
function calculateFFMI() {
  const weight = parseFloat(document.getElementById('ffmi-weight')?.value) || 180;
  const heightFt = parseInt(document.getElementById('ffmi-height-ft')?.value) || 5;
  const heightIn = parseInt(document.getElementById('ffmi-height-in')?.value) || 10;
  const bodyFat = parseFloat(document.getElementById('ffmi-bf')?.value) || 15;

  const weightKg = weight * 0.453592;
  const heightM = ((heightFt * 12) + heightIn) * 0.0254;
  const height = (heightFt * 12) + heightIn;

  const lbmKg = weightKg * (1 - bodyFat / 100);
  const lbmLbs = weight * (1 - bodyFat / 100);
  const ffmi = lbmKg / (heightM * heightM);
  const normalizedFFMI = ffmi + 6.1 * (1.8 - heightM);
  const fatMass = weight * (bodyFat / 100);

  const category = getFFMICategory(normalizedFFMI);

  // Calculate potential
  const naturalLimit = 25;
  const potentialRemaining = Math.max(0, naturalLimit - normalizedFFMI);
  const percentOfLimit = (normalizedFFMI / naturalLimit) * 100;

  displayFFMIResults({
    ffmi, normalizedFFMI, lbmLbs, lbmKg, weight, heightFt, heightIn, bodyFat,
    category, potentialRemaining, percentOfLimit, fatMass, naturalLimit
  });
}

function displayFFMIResults(r) {
  const section = document.getElementById('ffmi-results');
  if (!section) return;

  document.getElementById('ffmi-value').textContent = r.ffmi.toFixed(1);
  document.getElementById('ffmi-interpretation').textContent = r.category.name;
  document.getElementById('ffmi-normalized').textContent = r.normalizedFFMI.toFixed(1);
  document.getElementById('ffmi-lbm').textContent = r.lbmLbs.toFixed(1) + ' lbs';
  document.getElementById('ffmi-natural-limit').textContent = '25';

  // Enhanced results
  const inputSummary = document.getElementById('ffmi-input-summary');
  if (inputSummary) {
    inputSummary.innerHTML = `
      <span class="input-summary-item"><strong>Weight:</strong> ${r.weight} lbs</span>
      <span class="input-summary-item"><strong>Height:</strong> ${r.heightFt}'${r.heightIn}"</span>
      <span class="input-summary-item"><strong>Body Fat:</strong> ${r.bodyFat}%</span>
    `;
  }

  const keyResults = document.getElementById('ffmi-key-results');
  if (keyResults) {
    keyResults.innerHTML = `
      <tr><td>FFMI</td><td>${r.ffmi.toFixed(1)}</td><td>Raw index value</td></tr>
      <tr><td>Normalized FFMI</td><td>${r.normalizedFFMI.toFixed(1)}</td><td>Height-adjusted (primary metric)</td></tr>
      <tr><td>Lean Body Mass</td><td>${r.lbmLbs.toFixed(1)} lbs</td><td>${r.lbmKg.toFixed(1)} kg</td></tr>
      <tr><td>Fat Mass</td><td>${r.fatMass.toFixed(1)} lbs</td><td>At ${r.bodyFat}% body fat</td></tr>
      <tr><td>Natural Limit</td><td>~25</td><td>Typical maximum without PEDs</td></tr>
      <tr><td>% of Natural Limit</td><td>${Math.min(100, r.percentOfLimit).toFixed(0)}%</td><td>${r.category.desc}</td></tr>
    `;
  }

  const interpretation = document.getElementById('ffmi-interpretation-box');
  if (interpretation) {
    let html = `<p>Your normalized FFMI of <strong>${r.normalizedFFMI.toFixed(1)}</strong> is classified as <strong>${r.category.name}</strong>. ${r.category.desc}.</p>`;

    if (r.normalizedFFMI < 25) {
      html += `<p>You have approximately <strong>${r.potentialRemaining.toFixed(1)} FFMI points</strong> of potential natural muscle gain remaining before reaching the typical genetic limit of 25.</p>`;
    } else {
      html += `<p>Your FFMI exceeds the typical natural limit of 25. This level of muscularity is rare and may indicate exceptional genetics, long training history, or use of performance-enhancing substances.</p>`;
    }
    interpretation.innerHTML = html;
  }

  // Progress bar
  const progressFill = document.getElementById('ffmi-progress-fill');
  if (progressFill) {
    const pct = Math.min(100, r.percentOfLimit);
    progressFill.style.width = pct + '%';
    progressFill.className = 'progress-bar-fill ' + (pct >= 100 ? 'warning' : 'good');
  }

  section.classList.add('visible');
}

// TAB 4: CHART LOOKUP
function showChart() {
  const gender = document.querySelector('input[name="chart-gender"]:checked')?.value || 'male';
  const currentBF = parseFloat(document.getElementById('chart-bf')?.value) || 20;

  const category = getCategory(currentBF, gender);

  const section = document.getElementById('chart-results');
  if (!section) return;

  document.getElementById('chart-current').textContent = currentBF.toFixed(1) + '%';
  document.getElementById('chart-category-result').textContent = category.name;
  document.getElementById('chart-category-result').className = 'result-category ' + category.class;

  // Update chart marker
  const maxBF = gender === 'male' ? 35 : 45;
  const markerPos = Math.min(95, Math.max(5, (currentBF / maxBF) * 100));
  document.getElementById('chart-marker').style.left = markerPos + '%';

  // Show appropriate ranges
  const rangesTable = document.getElementById('chart-ranges');
  if (gender === 'male') {
    rangesTable.innerHTML = `
      <tr><td>Essential Fat</td><td>2-5%</td><td>Minimum for survival</td></tr>
      <tr><td>Athletes</td><td>6-13%</td><td>Competition-level fitness</td></tr>
      <tr><td>Fitness</td><td>14-17%</td><td>Visibly fit, defined</td></tr>
      <tr><td>Average</td><td>18-24%</td><td>Typical healthy male</td></tr>
      <tr><td>Obese</td><td>25%+</td><td>Elevated health risks</td></tr>
    `;
  } else {
    rangesTable.innerHTML = `
      <tr><td>Essential Fat</td><td>10-13%</td><td>Minimum for survival</td></tr>
      <tr><td>Athletes</td><td>14-20%</td><td>Competition-level fitness</td></tr>
      <tr><td>Fitness</td><td>21-24%</td><td>Visibly fit, toned</td></tr>
      <tr><td>Average</td><td>25-31%</td><td>Typical healthy female</td></tr>
      <tr><td>Obese</td><td>32%+</td><td>Elevated health risks</td></tr>
    `;
  }

  // Interpretation
  const interpretation = document.getElementById('chart-interpretation');
  if (interpretation) {
    const healthyLow = gender === 'male' ? 10 : 18;
    const healthyHigh = gender === 'male' ? 20 : 28;

    let html = `<p>At <strong>${currentBF.toFixed(1)}%</strong> body fat, you fall into the <strong>${category.name}</strong> category for ${gender === 'male' ? 'men' : 'women'}. ${category.desc}.</p>`;

    if (currentBF < healthyLow) {
      html += `<p>This is below the typical healthy range (${healthyLow}-${healthyHigh}%). Very low body fat can affect hormone levels and energy. Monitor your health and ensure adequate nutrition.</p>`;
    } else if (currentBF > healthyHigh) {
      html += `<p>This is above the typical healthy range (${healthyLow}-${healthyHigh}%). Consider gradual improvements through diet and exercise to reduce health risks associated with higher body fat.</p>`;
    } else {
      html += `<p>You're within the healthy range (${healthyLow}-${healthyHigh}%). Maintain your current lifestyle and adjust based on your personal fitness or aesthetic goals.</p>`;
    }
    interpretation.innerHTML = html;
  }

  section.classList.add('visible');
}

function setupFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => mobileNav.classList.toggle('active'));
  }
}
