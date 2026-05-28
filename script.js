(function initCountdown() {
  var weddingDate = new Date("2026-06-27T00:00:00+05:30");

  function pad(n, len) {
    return String(n).padStart(len || 2, "0");
  }

  function tick() {
    var diff = weddingDate - Date.now();
    if (diff < 0) diff = 0;

    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;

    var dEl = document.getElementById("days");
    var hEl = document.getElementById("hours");
    var mEl = document.getElementById("minutes");
    var sEl = document.getElementById("seconds");

    if (dEl) dEl.textContent = String(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(sec);
  }

  tick();
  setInterval(tick, 1000);
})();

(function initBackgroundMusic() {
  var audio = document.getElementById("bgMusic");
  if (!audio) return;

  audio.autoplay = true;
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 1;

  function tryPlay() {
    var playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        /* Browser blocked autoplay; retry after first interaction. */
      });
    }
  }

  function unlockAndPlay() {
    if (audio.paused) {
      tryPlay();
    }
  }

  document.addEventListener("click", unlockAndPlay, { once: true });
  document.addEventListener("touchstart", unlockAndPlay, { once: true });
  document.addEventListener("keydown", unlockAndPlay, { once: true });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && audio.paused) {
      tryPlay();
    }
  });

  audio.addEventListener("ended", function () {
    audio.currentTime = 0;
    tryPlay();
  });

  if (document.readyState === "complete") {
    tryPlay();
  } else {
    window.addEventListener("load", tryPlay, { once: true });
  }
})();

(function initCurtain() {
  var intro = document.getElementById("intro");
  var sealBtn = document.getElementById("sealBtn");
  var introInner = intro ? intro.querySelector(".intro__inner") : null;
  if (!intro) return;

  var risen = false;

  function rise() {
    if (risen) return;
    risen = true;

    if (sealBtn) {
      sealBtn.style.animation = "none";
      sealBtn.style.transition = "transform .25s cubic-bezier(0.34,1.56,0.64,1), opacity .3s ease .2s, filter .3s ease .2s";
      sealBtn.style.transform = "scale(1.2) rotate(-8deg)";

      setTimeout(function () {
        sealBtn.style.transition = "transform .4s ease, opacity .35s ease, filter .3s ease";
        sealBtn.style.transform = "scale(0) rotate(25deg)";
        sealBtn.style.opacity = "0";
        sealBtn.style.filter = "blur(6px) drop-shadow(0 0 20px rgba(240,198,85,.8))";
      }, 260);
    }

    setTimeout(function () {
      if (introInner) {
        introInner.style.transition = "opacity .55s ease, transform .55s ease";
        introInner.style.opacity = "0";
        introInner.style.transform = "translateY(-12px) scale(0.96)";
      }
    }, 350);

    setTimeout(function () {
      intro.style.transition = "transform 1.8s cubic-bezier(0.76, 0, 0.24, 1)";

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          intro.style.transform = "translateY(-100%)";
          document.body.style.overflow = "";
          document.body.classList.remove("is-locked");

          setTimeout(function () {
            intro.style.display = "none";
            var heroBg = document.getElementById("heroBg");
            if (heroBg && heroBg.closest(".hero")) {
              heroBg.closest(".hero").classList.add("loaded");
            }
          }, 1900);
        });
      });
    }, 750);
  }

  var autoRise = setTimeout(rise, 1500);

  if (sealBtn) {
    sealBtn.addEventListener("click", function () {
      clearTimeout(autoRise);
      rise();
    });
  }
})();

(function initPetals() {
  var canvas = document.getElementById("petalsCanvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var petals = [];
  var petalCount = 22;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makePetal() {
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      size: 5 + Math.random() * 9,
      color: Math.random() > 0.5
        ? "rgba(232,160,184," + (0.18 + Math.random() * 0.18) + ")"
        : "rgba(240,198,85," + (0.1 + Math.random() * 0.12) + ")",
      vx: -0.4 + Math.random() * 0.8,
      vy: 0.5 + Math.random() * 1.2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.025,
      sway: Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
      t: 0
    };
  }

  function drawPetal(petal) {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, petal.size * 0.55, petal.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = petal.color;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    petals.forEach(function (petal) {
      petal.t += 1;
      petal.x += petal.vx + Math.sin(petal.t * petal.sway + petal.phase) * 0.5;
      petal.y += petal.vy;
      petal.angle += petal.spin;

      if (petal.y > canvas.height + 20) {
        var nextPetal = makePetal();
        petal.x = nextPetal.x;
        petal.y = nextPetal.y;
        petal.size = nextPetal.size;
        petal.color = nextPetal.color;
        petal.vx = nextPetal.vx;
        petal.vy = nextPetal.vy;
        petal.spin = nextPetal.spin;
        petal.sway = nextPetal.sway;
        petal.phase = nextPetal.phase;
        petal.t = 0;
      }

      drawPetal(petal);
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();

  for (var i = 0; i < petalCount; i += 1) {
    var petal = makePetal();
    petal.y = Math.random() * canvas.height;
    petals.push(petal);
  }

  animate();
})();

(function initReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (item) {
    observer.observe(item);
  });
})();

(function initNav() {
  var nav = document.getElementById("siteNav");
  var sections = document.querySelectorAll("section[id]");
  if (!nav) return;

  var lastY = 0;
  var ticking = false;

  function update() {
    var y = window.scrollY;

    if (y > 80) {
      if (y < lastY) {
        nav.classList.remove("hidden");
      } else {
        nav.classList.add("hidden");
      }
    } else {
      nav.classList.remove("hidden");
    }
    lastY = y;

    var current = "";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });

    nav.querySelectorAll(".site-nav__link").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

(function initParallax() {
  var heroBg = document.getElementById("heroBg");
  if (!heroBg) return;

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        var offset = window.scrollY;
        heroBg.style.transform = "scale(1) translateY(" + (offset * 0.28) + "px)";
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
