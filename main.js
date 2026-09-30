/* ============================================================
   AkindaCo — main.js
   Progressive enhancement: nothing here is required for the
   page to work, it just makes it feel alive.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    function closeNav() {
      mobileNav.classList.remove("open");
      mobileNav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeNav();
      } else {
        mobileNav.hidden = false;
        // allow the element to un-hide before animating open
        requestAnimationFrame(function () { mobileNav.classList.add("open"); });
        toggle.setAttribute("aria-expanded", "true");
      }
    });
    // close when a link is tapped
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // small stagger for groups of siblings
          var delay = Math.min(i * 60, 240);
          setTimeout(function () { entry.target.classList.add("in"); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // no IO support — just show everything
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- FAQ: keep it tidy by closing others (optional accordion) ---- */
  var accItems = document.querySelectorAll(".accordion .acc-item");
  accItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        accItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---- Contact form ----
     No backend needed: this opens the visitor's email client with a
     ready-to-send message to hello@akindaco.com.
     To collect submissions on the server instead, swap this for a
     Formspree / Netlify Forms action (see README).
  --------------------------------------------------------------- */
  var form = document.getElementById("lead-form");
  var status = document.getElementById("form-status");
  var RECIPIENT = "hello@akindaco.com";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var age = form.age.value.trim();
      var message = form.message.value.trim();

      if (!name || !email) {
        status.textContent = "Please add your name and email so we can reply.";
        status.classList.add("err");
        (name ? form.email : form.name).focus();
        return;
      }
      // very light email sanity check
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.textContent = "That email doesn't look right. Could you check it?";
        status.classList.add("err");
        form.email.focus();
        return;
      }

      var subject = "Free 15-minute call enquiry from " + name;
      var bodyLines = [
        "Hi Paula,",
        "",
        "I'd like to book the free 15-minute phone call.",
        "",
        "Name:  " + name,
        "Email: " + email,
        "Phone: " + (phone || "-"),
        "Child's age: " + (age || "-"),
        "",
        "What's been happening:",
        (message || "-"),
        "",
        "Thanks!"
      ];
      var href =
        "mailto:" + RECIPIENT +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\r\n"));

      window.location.href = href;

      status.textContent = "Opening your email app… if nothing happens, email us directly at " + RECIPIENT + ".";
      status.classList.add("ok");
      form.reset();
    });
  }
})();
