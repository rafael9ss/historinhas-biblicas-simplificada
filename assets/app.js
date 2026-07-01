(function () {
  function bindCarousels() {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector(".carousel-track");
      const slides = Array.from(carousel.querySelectorAll(".story-slide, .testimonial-slide"));
      const dots = carousel.querySelector(".carousel-dots");
      const prev = carousel.querySelector("[data-prev]");
      const next = carousel.querySelector("[data-next]");
      const intervalMs = Number(carousel.dataset.interval) || 3800;
      let index = 0;
      let timer = 0;
      let startX = 0;

      if (!track || !slides.length) return;

      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        if (dots) {
          dots.querySelectorAll("button").forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
          });
        }
      }

      function start() {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(index + 1), intervalMs);
      }

      function restart() {
        show(index);
        start();
      }

      if (dots) {
        dots.innerHTML = "";
        slides.forEach((_, dotIndex) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", `Ir para parte ${dotIndex + 1}`);
          dot.addEventListener("click", () => {
            show(dotIndex);
            start();
          });
          dots.appendChild(dot);
        });
      }

      prev?.addEventListener("click", () => {
        show(index - 1);
        start();
      });

      next?.addEventListener("click", () => {
        show(index + 1);
        start();
      });

      track.addEventListener(
        "touchstart",
        (event) => {
          startX = event.touches[0].clientX;
        },
        { passive: true }
      );

      track.addEventListener(
        "touchend",
        (event) => {
          const delta = event.changedTouches[0].clientX - startX;
          if (Math.abs(delta) > 42) show(delta < 0 ? index + 1 : index - 1);
          start();
        },
        { passive: true }
      );

      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) restart();
      });

      show(0);
      start();
    });
  }

  function bindCountdown() {
    const countdown = document.querySelector("[data-countdown]");
    if (!countdown) return;

    const time = countdown.querySelector("[data-time]");
    const minutes = Number(countdown.dataset.minutes) || 30;
    const duration = minutes * 60 * 1000;
    const key = "historinhas.simpleOfferDeadline";
    let deadline = 0;

    try {
      deadline = Number(window.localStorage.getItem(key));
      if (!deadline || deadline <= Date.now()) {
        deadline = Date.now() + duration;
        window.localStorage.setItem(key, String(deadline));
      }
    } catch (error) {
      deadline = Date.now() + duration;
    }

    function render() {
      const remaining = Math.max(0, deadline - Date.now());
      const seconds = Math.ceil(remaining / 1000);
      const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
      const ss = String(seconds % 60).padStart(2, "0");
      if (time) time.textContent = `${mm}:${ss}`;
    }

    render();
    window.setInterval(render, 1000);
  }

  function bindBuyPulse() {
    const buttons = Array.from(document.querySelectorAll(".buy-pulse"));
    if (!buttons.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    function pulse() {
      buttons.forEach((button) => button.classList.add("is-buy-pulsing"));
      window.setTimeout(() => {
        buttons.forEach((button) => button.classList.remove("is-buy-pulsing"));
      }, 540);
    }

    window.setTimeout(pulse, 700);
    window.setInterval(pulse, 2300);
  }

  bindCarousels();
  bindCountdown();
  bindBuyPulse();
})();
