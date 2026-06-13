/* DCHM / portfolio - telemetria tatica
   Reveals mecanicos (IntersectionObserver), nav ativa, menu mobile,
   efeito decode no texto do hero. Sem listeners de scroll. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Reveal ----- */
  var targets = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ----- Letras interativas no nome do hero -----
     Divide cada glifo em <span class="ch"> para reagir ao ponteiro. */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!reduced && finePointer) {
    var title = document.querySelector(".hero__title");
    if (title) {
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var frag = document.createDocumentFragment();
            /* agrupa por palavra (nowrap) para a quebra de linha
               acontecer apenas entre palavras, nunca no meio delas */
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (part.trim() === "") { frag.appendChild(document.createTextNode(part)); return; }
              var w = document.createElement("span");
              w.className = "word";
              part.split("").forEach(function (c) {
                var s = document.createElement("span");
                s.className = "ch";
                s.textContent = c;
                w.appendChild(s);
              });
              frag.appendChild(w);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1 && child.tagName !== "BR" && !child.classList.contains("ch")) {
            walk(child);
          }
        });
      };
      walk(title);
    }
  }

  /* ----- Link ativo na nav ----- */
  var navLinks = document.querySelectorAll(".nav__links a[href^='#']");
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ----- Menu mobile ----- */
  var burger = document.getElementById("nav-burger");
  var sheet = document.getElementById("nav-sheet");

  burger.addEventListener("click", function () {
    var open = sheet.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  sheet.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      sheet.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
})();
