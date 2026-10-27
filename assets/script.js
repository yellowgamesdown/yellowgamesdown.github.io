"use strict";

const butterChoices = {
  baking: {
    title: "无盐黄油",
    description: "配方自由度更高，甜咸都由你掌握。优先选择配料简洁、乳脂来源明确的产品。",
    tip: "需要打发时，软化到手指能按出凹痕、但没有融化出油的状态。"
  },
  toast: {
    title: "有盐或发酵黄油",
    description: "直接涂抹时，风味比配方适应性更重要。有盐款鲜明方便，发酵款则多一层清新乳酸香。",
    tip: "提前取出一小份软化即可；剩下的继续密封冷藏，避免整盒反复回温。"
  },
  cooking: {
    title: "有盐或无盐黄油",
    description: "两者都可以。有盐款方便直接调味，无盐款便于控制酱汁咸度，选择后相应调整额外用盐。",
    tip: "普通黄油含水分和乳固体，宜中低温烹调；需要更高锅温时，不要久烧到冒烟。"
  },
  pastry: {
    title: "按配方选开酥黄油",
    description: "开酥看重可塑性、乳脂与温度，不是越软越好。家庭制作优先遵循配方指定类型，不随意替换。",
    tip: "黄油与面团应尽量保持相近软硬度；操作中若开始出油或黏手，及时冷藏降温。"
  }
};

const choiceButtons = document.querySelectorAll(".usage-btn");
const choiceTitle = document.getElementById("choiceTitle");
const choiceDescription = document.getElementById("choiceDescription");
const choiceTip = document.getElementById("choiceTip");

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = butterChoices[button.dataset.use];
    if (!choice) return;

    choiceButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    choiceTitle.textContent = choice.title;
    choiceDescription.textContent = choice.description;
    choiceTip.textContent = choice.tip;
  });
});

const gramRange = document.getElementById("gramRange");
const gramOutput = document.getElementById("gramOutput");
const calorieValue = document.getElementById("calorieValue");
const fatValue = document.getElementById("fatValue");
const satFatValue = document.getElementById("satFatValue");

function updateNutrition() {
  const grams = Number(gramRange.value);
  gramOutput.innerHTML = `${grams} <small>g</small>`;
  calorieValue.textContent = Math.round(717 * grams / 100);
  fatValue.textContent = (81.1 * grams / 100).toFixed(1);
  satFatValue.textContent = (51.4 * grams / 100).toFixed(1);
  gramRange.setAttribute("aria-valuetext", `${grams} 克`);
}

if (gramRange) {
  gramRange.addEventListener("input", updateNutrition);
  updateNutrition();
}

const progressBar = document.getElementById("readingProgress");
const backToTop = document.getElementById("backToTop");
let scrollTicking = false;

function updateScrollUI() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0;
  progressBar.style.width = `${progress}%`;
  backToTop.classList.toggle("visible", scrollTop > 650);
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking = true;
  }
}, { passive: true });

backToTop.addEventListener("click", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
});
updateScrollUI();

const navCollapse = document.getElementById("mainNav");
const navLinks = navCollapse.querySelectorAll("a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 992 && navCollapse.classList.contains("show") && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    }
  });
});

const observedSections = document.querySelectorAll("main section[id]");
const inPageNavLinks = document.querySelectorAll(".navbar-nav .nav-link");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      inPageNavLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });

  observedSections.forEach((section) => sectionObserver.observe(section));
}
