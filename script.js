
// ========================================================
// HEALTH & HYGIENE HUB — INTERACTIVE JAVASCRIPT
// ========================================================


// MOBILE NAVIGATION

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function closeMobileMenu() {
    if (!menuBtn || !navLinks) return;

    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    menuBtn.textContent = "☰";
}

if (menuBtn && navLinks) {
    menuBtn.setAttribute("aria-expanded", "false");

    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );
        menuBtn.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMobileMenu();
        }
    });
}


// DARK MODE / LIGHT MODE

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle("dark-mode", dark);

    if (themeToggle) {
        themeToggle.textContent = dark ? "☀️" : "🌙";
        themeToggle.setAttribute(
            "aria-label",
            dark ? "Switch to light mode" : "Switch to dark mode"
        );
        themeToggle.setAttribute("aria-pressed", String(dark));
        themeToggle.title = dark
            ? "Switch to light mode"
            : "Switch to dark mode";
    }
}

let savedTheme = "light";

try {
    savedTheme = localStorage.getItem("healthHygieneTheme") || "light";
} catch (error) {
    // The site works even if browser storage is disabled.
}

applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("dark-mode")
            ? "light"
            : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("healthHygieneTheme", nextTheme);
        } catch (error) {
            // Theme remains active for this page view.
        }
    });
}


// AUTOMATIC FOOTER YEAR

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}


// HYGIENE INFORMATION POP-UPS

const modalTriggers = document.querySelectorAll("[data-modal]");
const modals = document.querySelectorAll(".modal");

let lastFocusedElement = null;

function openModal(modal) {
    if (!modal) return;

    lastFocusedElement = document.activeElement;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeButton = modal.querySelector(".modal-close");

    if (closeButton) {
        closeButton.focus();
    }
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    const anotherModalOpen = [...modals].some((item) =>
        item.classList.contains("open")
    );

    if (!anotherModalOpen) {
        document.body.style.overflow = "";
    }

    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {
        lastFocusedElement.focus();
    }
}

modals.forEach((modal) => {
    modal.setAttribute("aria-hidden", "true");
});

modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const modalId = trigger.getAttribute("data-modal");
        openModal(document.getElementById(modalId));
    });
});

modals.forEach((modal) => {
    const closeButton = modal.querySelector(".modal-close");

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            closeModal(modal);
        });
    }

    // Close by clicking the dark area outside the pop-up.
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modals.forEach((modal) => {
            if (modal.classList.contains("open")) {
                closeModal(modal);
            }
        });

        closeMobileMenu();
    }
});


// 20-SECOND HANDWASHING TIMER

const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");
const timerCircle = document.getElementById("timerCircle");
const startTimerBtn = document.getElementById("startTimer");
const resetTimerBtn = document.getElementById("resetTimer");

const TIMER_START_SECONDS = 20;

let timerRemaining = TIMER_START_SECONDS;
let timerInterval = null;
let timerRunning = false;

function renderTimer() {
    if (timerDisplay) {
        timerDisplay.textContent = String(timerRemaining);
    }

    if (timerCircle) {
        const progress =
            ((TIMER_START_SECONDS - timerRemaining) /
                TIMER_START_SECONDS) * 360;

        timerCircle.style.borderTopColor = "var(--primary)";

        timerCircle.style.background =
            `conic-gradient(
                var(--primary-soft) ${progress}deg,
                var(--surface) ${progress}deg
            )`;
    }
}

function stopTimerInterval() {
    if (timerInterval !== null) {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }

    timerRunning = false;

    if (timerCircle) {
        timerCircle.classList.remove("running");
    }

    if (startTimerBtn) {
        startTimerBtn.textContent =
            timerRemaining === 0 ? "↻ Start again" : "▶ Resume";
    }
}

function finishTimer() {
    stopTimerInterval();

    timerRemaining = 0;
    renderTimer();

    if (timerStatus) {
        timerStatus.textContent =
            "Great work! You completed 20 seconds. Rinse and dry your hands.";
    }

    if (startTimerBtn) {
        startTimerBtn.textContent = "↻ Start again";
    }

    if (timerCircle) {
        timerCircle.classList.remove("running");
    }
}

function startTimer() {
    // If already running, pause the countdown.
    if (timerRunning) {
        stopTimerInterval();

        if (timerStatus) {
            timerStatus.textContent =
                "Timer paused. Resume when you are ready.";
        }

        return;
    }

    if (timerRemaining <= 0) {
        timerRemaining = TIMER_START_SECONDS;
    }

    timerRunning = true;

    if (timerCircle) {
        timerCircle.classList.add("running");
    }

    if (timerStatus) {
        timerStatus.textContent =
            "Scrub your hands, including between your fingers and under your nails.";
    }

    if (startTimerBtn) {
        startTimerBtn.textContent = "Ⅱ Pause";
    }

    renderTimer();

    timerInterval = window.setInterval(() => {
        timerRemaining -= 1;
        renderTimer();

        if (timerRemaining <= 0) {
            finishTimer();
        }
    }, 1000);
}

if (startTimerBtn) {
    startTimerBtn.addEventListener("click", startTimer);
}

if (resetTimerBtn) {
    resetTimerBtn.addEventListener("click", () => {
        stopTimerInterval();

        timerRemaining = TIMER_START_SECONDS;
        renderTimer();

        if (timerStatus) {
            timerStatus.textContent =
                "Ready to wash? Press Start when you begin.";
        }

        if (startTimerBtn) {
            startTimerBtn.textContent = "▶ Start";
        }

        if (timerCircle) {
            timerCircle.classList.remove("running");
        }
    });
}

renderTimer();


// DAILY HYGIENE CHECKLIST AND SCORE

const checklistInputs = document.querySelectorAll(
    ".check-item input[type='checkbox']"
);

const scoreNumber = document.getElementById("scoreNumber");
const scoreProgress = document.getElementById("scoreProgress");
const scoreMessage = document.getElementById("scoreMessage");

function updateChecklistScore() {
    const total = checklistInputs.length;

    if (!total) return;

    const completed = [...checklistInputs].filter(
        (checkbox) => checkbox.checked
    ).length;

    const percent = Math.round((completed / total) * 100);

    if (scoreNumber) {
        scoreNumber.textContent = `${percent}%`;
    }

    if (scoreProgress) {
        scoreProgress.style.width = `${percent}%`;
    }

    if (scoreMessage) {
        if (percent === 100) {
            scoreMessage.textContent =
                "Excellent! You checked every habit. Keep building healthy routines.";
        } else if (percent >= 67) {
            scoreMessage.textContent =
                "Nice work! You are building a strong daily routine.";
        } else if (percent >= 34) {
            scoreMessage.textContent =
                "Good start. Keep going and check the habits you complete.";
        } else if (percent > 0) {
            scoreMessage.textContent =
                "Every small step counts. Continue with the habits that fit your day.";
        } else {
            scoreMessage.textContent =
                "Start checking your habits. Your score is a reminder, not a medical assessment.";
        }
    }
}

checklistInputs.forEach((checkbox) => {
    checkbox.addEventListener("change", updateChecklistScore);
});

updateChecklistScore();


// SEARCH HEALTHCARE RESOURCES

const resourceSearch = document.getElementById("resourceSearch");
const resourcesGrid = document.getElementById("resourcesGrid");

if (resourceSearch && resourcesGrid) {
    const resourceCards = [
        ...resourcesGrid.querySelectorAll(".resource-card")
    ];

    const noResults = document.createElement("p");

    noResults.className = "no-results";
    noResults.textContent =
        "No matching resources found. Try another hospital or service name.";
    noResults.hidden = true;

    resourcesGrid.appendChild(noResults);

    resourceSearch.addEventListener("input", () => {
        const query = resourceSearch.value.trim().toLocaleLowerCase();

        let visibleCount = 0;

        resourceCards.forEach((card) => {
            const matches = card.textContent
                .toLocaleLowerCase()
                .includes(query);

            card.hidden = !matches;

            if (matches) {
                visibleCount += 1;
            }
        });

        noResults.hidden = visibleCount !== 0;
    });
}


// SKINCARE ROUTINE TABS

const skinTabs = document.querySelectorAll("[data-skin-routine]");
const skinRoutinePanel = document.getElementById("skinRoutinePanel");

const skinRoutines = {
    morning: {
        tabId: "skinMorningTab",
        steps: [
            [
                "Cleanse gently",
                "Use a mild cleanser and lukewarm water. Avoid rough scrubbing."
            ],
            [
                "Moisturise",
                "Choose a moisturiser that fits your skin and helps prevent dryness."
            ],
            [
                "Protect from the sun",
                "Consider broad-spectrum SPF 30+ sunscreen and follow the label instructions."
            ]
        ]
    },

    evening: {
        tabId: "skinEveningTab",
        steps: [
            [
                "Cleanse your skin",
                "Gently remove dirt, sweat, sunscreen and makeup before bed."
            ],
            [
                "Moisturise",
                "Apply a suitable moisturiser to help support the skin's protective barrier."
            ],
            [
                "Keep the routine simple",
                "Introduce products gradually and stop products that cause irritation."
            ]
        ]
    },

    sensitive: {
        tabId: "skinSensitiveTab",
        steps: [
            [
                "Choose gentle products",
                "Consider fragrance-free products designed for sensitive skin."
            ],
            [
                "Test new products carefully",
                "Follow label directions and test a small area before regular use."
            ],
            [
                "Avoid irritation",
                "Skip abrasive scrubs. Ask a healthcare professional about persistent discomfort or rashes."
            ]
        ]
    }
};

function renderSkinRoutine(name) {
    const routine = skinRoutines[name];

    if (!routine || !skinRoutinePanel) return;

    skinTabs.forEach((tab) => {
        const selected = tab.dataset.skinRoutine === name;

        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.setAttribute("tabindex", selected ? "0" : "-1");
    });

    skinRoutinePanel.setAttribute("aria-labelledby", routine.tabId);
    skinRoutinePanel.replaceChildren();

    routine.steps.forEach(([heading, description], index) => {
        const step = document.createElement("div");
        step.className = "skin-step";

        const number = document.createElement("span");
        number.textContent = String(index + 1);

        const content = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = heading;

        const paragraph = document.createElement("p");
        paragraph.textContent = description;

        content.append(title, paragraph);
        step.append(number, content);
        skinRoutinePanel.appendChild(step);
    });
}

skinTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        renderSkinRoutine(tab.dataset.skinRoutine);
    });

    // Keyboard navigation for the skincare tabs.
    tab.addEventListener("keydown", (event) => {
        let nextIndex = index;

        if (event.key === "ArrowRight") {
            nextIndex = (index + 1) % skinTabs.length;
        } else if (event.key === "ArrowLeft") {
            nextIndex = (index - 1 + skinTabs.length) % skinTabs.length;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = skinTabs.length - 1;
        } else {
            return;
        }

        event.preventDefault();

        skinTabs[nextIndex].focus();
        renderSkinRoutine(skinTabs[nextIndex].dataset.skinRoutine);
    });
});


// FAQ ACCORDION

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.setAttribute("aria-expanded", "false");
    answer.setAttribute("hidden", "");

    question.addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");

        // Close all other questions first.
        faqItems.forEach((otherItem) => {
            otherItem.classList.remove("open");

            const otherQuestion =
                otherItem.querySelector(".faq-question");
            const otherAnswer =
                otherItem.querySelector(".faq-answer");

            if (otherQuestion) {
                otherQuestion.setAttribute("aria-expanded", "false");
            }

            if (otherAnswer) {
                otherAnswer.hidden = true;
            }
        });

        // Open the selected question if it was previously closed.
        if (!wasOpen) {
            item.classList.add("open");
            question.setAttribute("aria-expanded", "true");
            answer.hidden = false;
        }
    });
});


// BACK-TO-TOP BUTTON

const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
    if (backToTop) {
        backToTop.classList.toggle("visible", window.scrollY > 500);
    }
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    });
}


// BACKGROUND VIDEO FALLBACK

const heroVideo = document.querySelector(".hero-video");

if (heroVideo) {
    heroVideo.muted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        heroVideo.pause();
    } else {
        const playAttempt = heroVideo.play();

        if (playAttempt && typeof playAttempt.catch === "function") {
            playAttempt.catch(() => {
                // Poster image and CSS background remain as fallbacks.
            });
        }
    }
}
