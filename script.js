const intro = document.getElementById("intro");
const countdownIds = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const weddingDate = new Date("2026-06-27T00:00:00+05:30");

function pad(value, size = 2) {
  return String(value).padStart(size, "0");
}

function updateCountdown() {
  const now = new Date();
  const distance = weddingDate.getTime() - now.getTime();

  if (distance <= 0) {
    countdownIds.days.textContent = "000";
    countdownIds.hours.textContent = "00";
    countdownIds.minutes.textContent = "00";
    countdownIds.seconds.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const remainingSeconds = totalSeconds % 60;

  countdownIds.days.textContent = pad(days, 3);
  countdownIds.hours.textContent = pad(hours);
  countdownIds.minutes.textContent = pad(minutes);
  countdownIds.seconds.textContent = pad(remainingSeconds);
}

/* ─── Envelope / intro sequence ─── */
function startIntroAnimation() {
  if (!intro) {
    document.body.classList.remove("is-locked");
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intro.classList.add("is-open");
    document.body.classList.remove("is-locked");
    return;
  }

  // Doors open almost immediately (300 ms)
  window.setTimeout(() => {
    intro.classList.add("is-opening");
  }, 300);

  // Doors stay fully open ~4.5 s (300 + 1800 transition + 4500 dwell)
  window.setTimeout(() => {
    intro.classList.add("is-open");
    document.body.classList.remove("is-locked");
  }, 6700);
}

/* ─── Scroll-reveal ─── */
function enableRevealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  revealItems.forEach(item => observer.observe(item));
}

/* ─── Countdown digit flip animation ─── */
function animateDigit(el, newVal) {
  if (el.textContent === newVal) return;
  el.classList.add("flip");
  setTimeout(() => {
    el.textContent = newVal;
    el.classList.remove("flip");
  }, 220);
}

function updateCountdownAnimated() {
  const now = new Date();
  const distance = weddingDate.getTime() - now.getTime();
  if (distance <= 0) return;
  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  animateDigit(countdownIds.days, pad(days, 3));
  animateDigit(countdownIds.hours, pad(hours));
  animateDigit(countdownIds.minutes, pad(minutes));
  animateDigit(countdownIds.seconds, pad(secs));
}

window.addEventListener("load", () => {
  startIntroAnimation();
  updateCountdown();
  enableRevealOnScroll();
}, { once: true });

window.setInterval(updateCountdownAnimated, 1000);
