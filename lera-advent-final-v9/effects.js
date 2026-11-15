
(() => {
  function initAnimations() {
    const game = document.getElementById("advent");

    if (!game || game.dataset.animationsReady) return;

    game.dataset.animationsReady = "true";

    const hero = game.querySelector("header .hero");
    const days = game.querySelector("#days");
    const content = game.querySelector("#content");
    const overlay = game.querySelector("#overlay");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // 1. Стили праздничных эффектов
    const styles = document.createElement("style");
    styles.textContent = `
      /* Движущийся снег */
      #advent header .hero {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      #advent header .hero::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
        opacity: .32;
        background-image:
          radial-gradient(circle, white 1.6px, transparent 2px),
          radial-gradient(circle, white 1px, transparent 1.6px);
        background-size: 92px 106px, 63px 77px;
        animation: leraSnow 20s linear infinite;
      }

      @keyframes leraSnow {
        from {
          background-position: 0 0, 30px 20px;
        }
        to {
          background-position: 0 320px, 30px 250px;
        }
      }

      /* Маленький красный самолёт */
      #advent .lera-flying-plane {
        position: absolute;
        top: 79%;
        left: -110px;
        width: clamp(62px, 9vw, 100px);
        z-index: 3;
        pointer-events: none;
        filter: drop-shadow(0 5px 4px #104b8760);
        animation: leraFlyAcross 12s ease-in-out infinite;
      }

      #advent .lera-flying-plane svg {
        display: block;
        width: 100%;
        height: auto;
      }

      @keyframes leraFlyAcross {
        0%, 4% {
          left: -110px;
          opacity: 0;
          transform: translateY(12px) rotate(-6deg);
        }
        7% {
          opacity: 1;
        }
        28% {
          left: calc(100% + 20px);
          opacity: 1;
          transform: translateY(-18px) rotate(-9deg);
        }
        32%, 100% {
          left: calc(100% + 20px);
          opacity: 0;
        }
      }

      /* Плавное появление карточек */
      #advent .day.lera-card-enter {
        animation: leraCardEnter .48s ease-out both;
        animation-delay: var(--lera-delay, 0ms);
      }

      @keyframes leraCardEnter {
        from {
          opacity: 0;
          transform: translateY(15px) scale(.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Наведение и нажатие */
      #advent .day {
        transition:
          transform .2s ease,
          box-shadow .2s ease;
      }

      @media (hover: hover) {
        #advent .day:hover {
          transform: translateY(-5px) scale(1.025);
          box-shadow: 0 8px 17px #376e9f35;
        }
      }

      #advent .day:active {
        transform: scale(.97);
      }

      /* Мерцающая звёздочка выполненного дня */
      #advent .day.done .mark {
        animation: leraTwinkle 3s ease-in-out infinite;
      }

      @keyframes leraTwinkle {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.22) rotate(10deg); }
      }

      /* Открытие всплывающего окна */
      #advent .overlay:not([hidden]) .modal {
        animation: leraModalIn .26s ease-out;
      }

      @keyframes leraModalIn {
        from {
          opacity: 0;
          transform: scale(.94);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Полёт на экране задания */
      #advent .lera-flight-icon {
        display: block;
        animation: leraMissionFly .8s ease-in-out both;
      }

      @keyframes leraMissionFly {
        from {
          opacity: 0;
          transform: translateX(-75px) rotate(-15deg);
        }
        to {
          opacity: 1;
          transform: translateX(0) rotate(0);
        }
      }

      /* Получение награды */
      #advent .lera-reward-icon {
        animation: leraRewardPop .55s ease-out both;
      }

      @keyframes leraRewardPop {
        0% {
          transform: scale(.3) rotate(-30deg);
          opacity: 0;
        }
        70% {
          transform: scale(1.2) rotate(10deg);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* Искры вокруг звезды */
      #advent .lera-spark {
        position: absolute;
        top: 40%;
        left: 50%;
        z-index: 5;
        pointer-events: none;
        font-size: 21px;
        animation: leraSparkFly .85s ease-out forwards;
      }

      @keyframes leraSparkFly {
        from {
          opacity: 1;
          transform: translate(-50%, -50%) scale(.5);
        }
        to {
          opacity: 0;
          transform:
            translate(
              calc(-50% + var(--dx)),
              calc(-50% + var(--dy))
            )
            scale(1.2) rotate(180deg);
        }
      }

      /* Учитываем настройки доступности */
      @media (prefers-reduced-motion: reduce) {
        #advent .lera-flying-plane,
        #advent .lera-spark {
          display: none;
        }

        #advent header .hero::after,
        #advent .day.lera-card-enter,
        #advent .day.done .mark,
        #advent .lera-flight-icon,
        #advent .lera-reward-icon,
        #advent .overlay:not([hidden]) .modal {
          animation: none !important;
        }

        #advent .day {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(styles);

    // 2. Создаём небольшой мультяшный самолёт
    if (hero) {
      const plane = document.createElement("div");

      plane.className = "lera-flying-plane";
      plane.setAttribute("aria-hidden", "true");

      plane.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 160 100"
        >
          <path
            d="M41 43 L10 13 L30 16 L75 42Z"
            fill="#d82736"
          />
          <path
            d="M41 56 L10 87 L30 83 L75 58Z"
            fill="#d82736"
          />
          <path
            d="M65 43 L49 3 L80 11 L96 43Z"
            fill="#f23b42"
          />
          <path
            d="M65 57 L49 97 L80 89 L96 57Z"
            fill="#f23b42"
          />
          <rect
            x="33" y="29" width="103" height="42"
            rx="21" fill="#ed303a"
          />
          <path
            d="M98 31 Q143 29 149 50
               Q143 72 98 69Z"
            fill="#f9fdff"
          />
          <path
            d="M104 32 Q133 29 142 44
               L104 44Z"
            fill="#89d4f6"
          />
          <ellipse
            cx="117" cy="48" rx="8" ry="10"
            fill="#ffffff"
          />
          <ellipse
            cx="137" cy="48" rx="8" ry="10"
            fill="#ffffff"
          />
          <circle cx="120" cy="48" r="4" fill="#203d6f"/>
          <circle cx="139" cy="48" r="4" fill="#203d6f"/>
          <path
            d="M120 60 Q130 67 140 59"
            stroke="#cd5258"
            stroke-width="3"
            fill="none"
            stroke-linecap="round"
          />
        </svg>
      `;

      hero.appendChild(plane);
    }

    // 3. Анимируем карточки, включая перерисовку
    function animateCards() {
      if (!days || reduceMotion.matches) return;

      days.querySelectorAll(".day").forEach((card, i) => {
        if (card.classList.contains("lera-card-enter")) {
          return;
        }

        card.style.setProperty(
          "--lera-delay",
          `${(i % 7) * 55}ms`
        );

        card.classList.add("lera-card-enter");
      });
    }

    if (days) {
      animateCards();

      const cardsObserver = new MutationObserver(
        animateCards
      );

      cardsObserver.observe(days, {
        childList: true
      });
    }

    // 4. Анимация полёта и звезды в модальных окнах
    function decoratePopup() {
      if (!content || reduceMotion.matches) return;

      const icon = content.querySelector(".emoji");
      const title = content.querySelector("h2");

      if (!icon || !title) return;

      if (title.textContent.includes("Летим в")) {
        icon.classList.add("lera-flight-icon");
      }

      if (title.textContent.includes("Ура, Лера")) {
        icon.classList.add("lera-reward-icon");
      }
    }

    if (content) {
      new MutationObserver(decoratePopup).observe(
        content,
        { childList: true }
      );
    }

    // 5. Искры после завершения задания
    function showSparks() {
      if (reduceMotion.matches || !overlay) return;

      const modal = overlay.querySelector(".modal");
      if (!modal) return;

      for (let i = 0; i < 12; i++) {
        const spark = document.createElement("span");

        spark.className = "lera-spark";
        spark.textContent = i % 3 === 0 ? "⭐" : "✦";
        spark.setAttribute("aria-hidden", "true");

        const angle = (Math.PI * 2 * i) / 12;
        const distance = 65 + (i % 3) * 22;

        spark.style.setProperty(
          "--dx",
          `${Math.cos(angle) * distance}px`
        );

        spark.style.setProperty(
          "--dy",
          `${Math.sin(angle) * distance}px`
        );

        spark.style.color =
          i % 2 === 0 ? "#f5bc38" : "#7bc5f3";

        modal.appendChild(spark);

        setTimeout(() => spark.remove(), 900);
      }
    }

    if (content) {
      content.addEventListener(
        "click",
        event => {
          const finish = event.target.closest(
            '[data-act="finish"]'
          );

          if (finish) {
            setTimeout(showSparks, 30);
          }
        },
        true
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initAnimations,
      { once: true }
    );
  } else {
    initAnimations();
  }
})();
