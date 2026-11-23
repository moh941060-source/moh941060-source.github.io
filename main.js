const menuDialog = document.querySelector(".menu-dialog");
const menuButton = document.querySelector(".menu-button");
const menuCloseButton = document.querySelector(".menu-close");
const headerDropdowns = Array.from(document.querySelectorAll(".header-dropdown"));

if (menuDialog && menuButton && menuCloseButton) {
  menuButton.addEventListener("click", () => {
    menuDialog.showModal();
  });

  menuCloseButton.addEventListener("click", () => {
    menuDialog.close();
  });

  menuDialog.addEventListener("click", (event) => {
    if (event.target === menuDialog) {
      menuDialog.close();
    }
  });

  menuDialog.querySelectorAll(".menu-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuDialog.close();
    });
  });
}

const setHeaderDropdownOpen = (dropdown, isOpen) => {
  const trigger = dropdown.querySelector(".header-selector");
  const panel = dropdown.querySelector(".header-dropdown-menu");

  dropdown.classList.toggle("is-open", isOpen);
  trigger.setAttribute("aria-expanded", String(isOpen));
  panel.hidden = !isOpen;
};

headerDropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector(".header-selector");
  const panel = dropdown.querySelector(".header-dropdown-menu");

  trigger.addEventListener("click", () => {
    const shouldOpen = trigger.getAttribute("aria-expanded") !== "true";
    headerDropdowns.forEach((item) => setHeaderDropdownOpen(item, false));
    setHeaderDropdownOpen(dropdown, shouldOpen);
  });

  panel.querySelectorAll(".header-dropdown-option").forEach((option) => {
    option.addEventListener("click", () => setHeaderDropdownOpen(dropdown, false));
  });
});

document.addEventListener("click", (event) => {
  headerDropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      setHeaderDropdownOpen(dropdown, false);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openDropdown = headerDropdowns.find(
      (dropdown) => dropdown.querySelector(".header-selector").getAttribute("aria-expanded") === "true"
    );

    if (openDropdown) {
      const trigger = openDropdown.querySelector(".header-selector");
      setHeaderDropdownOpen(openDropdown, false);
      trigger.focus();
    }
  }
});

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const toggleButton = carousel.querySelector("[data-carousel-toggle]");
  const pagination = carousel.querySelector("[data-carousel-pagination]");
  let currentIndex = 0;
  let autoplayTimer = null;
  let scrollFrame = null;
  let userPaused = false;
  let hoverPaused = false;
  let focusPaused = false;
  let isInViewport = false;

  const visibleSlideCount = () => {
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const slideWidth = slides[0].getBoundingClientRect().width;
    return Math.max(1, Math.floor((track.clientWidth + gap) / (slideWidth + gap)));
  };

  const lastStartIndex = () => Math.max(0, slides.length - visibleSlideCount());

  const updatePagination = () => {
    const pageCount = lastStartIndex() + 1;
    pagination.replaceChildren();

    for (let index = 0; index < pageCount; index += 1) {
      const button = document.createElement("button");
      button.className = "carousel-dot";
      button.type = "button";
      button.setAttribute(
        "aria-label",
        document.documentElement.lang === "ar"
          ? `انتقل إلى المجموعة ${index + 1}`
          : `Go to slide ${index + 1}`
      );
      button.addEventListener("click", () => goTo(index));
      pagination.append(button);
    }

    updateActiveDot();
  };

  const updateActiveDot = () => {
    pagination.querySelectorAll(".carousel-dot").forEach((button, index) => {
      if (index === currentIndex) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  };

  const refreshAutoplay = () => {
    const canRotate = !reducedMotionQuery.matches && slides.length > visibleSlideCount();
    const shouldRotate = canRotate && isInViewport;
    toggleButton.hidden = !canRotate;

    if (userPaused || hoverPaused || focusPaused || document.hidden || !shouldRotate) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    } else if (autoplayTimer === null) {
      autoplayTimer = window.setInterval(advance, 5000);
    }

    toggleButton.textContent = userPaused
      ? toggleButton.dataset.playLabel
      : toggleButton.dataset.pauseLabel;
    toggleButton.setAttribute(
      "aria-label",
      userPaused
        ? toggleButton.dataset.playAriaLabel
        : toggleButton.dataset.pauseAriaLabel
    );
    toggleButton.setAttribute("aria-pressed", String(userPaused));
  };

  function goTo(index) {
    currentIndex = Math.min(Math.max(index, 0), lastStartIndex());
    const trackBounds = track.getBoundingClientRect();
    const slideBounds = slides[currentIndex].getBoundingClientRect();
    const isRtl = window.getComputedStyle(track).direction === "rtl";
    const distance = isRtl
      ? slideBounds.right - trackBounds.right
      : slideBounds.left - trackBounds.left;

    track.scrollBy({
      left: distance,
      behavior: reducedMotionQuery.matches ? "auto" : "smooth"
    });
    updateActiveDot();
  }

  function advance() {
    goTo(currentIndex >= lastStartIndex() ? 0 : currentIndex + 1);
  }

  const showTargetFromHash = () => {
    const targetId = window.location.hash.slice(1);
    const targetIndex = slides.findIndex((slide) => slide.id === targetId);

    if (targetIndex !== -1) {
      goTo(targetIndex);
    }
  };

  const updateCurrentIndex = () => {
    const trackBounds = track.getBoundingClientRect();
    const isRtl = window.getComputedStyle(track).direction === "rtl";
    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideBounds = slide.getBoundingClientRect();
      const distance = isRtl
        ? Math.abs(trackBounds.right - slideBounds.right)
        : Math.abs(slideBounds.left - trackBounds.left);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    currentIndex = Math.min(closestIndex, lastStartIndex());
    updateActiveDot();
  };

  previousButton.addEventListener("click", () => {
    goTo(currentIndex <= 0 ? lastStartIndex() : currentIndex - 1);
  });
  nextButton.addEventListener("click", () => {
    advance();
  });
  toggleButton.addEventListener("click", () => {
    userPaused = !userPaused;
    refreshAutoplay();
  });

  track.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(updateCurrentIndex);
  }, { passive: true });

  carousel.addEventListener("mouseenter", () => {
    hoverPaused = true;
    refreshAutoplay();
  });
  carousel.addEventListener("mouseleave", () => {
    hoverPaused = false;
    refreshAutoplay();
  });
  carousel.addEventListener("focusin", () => {
    focusPaused = true;
    refreshAutoplay();
  });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      focusPaused = false;
      refreshAutoplay();
    }
  });

  updatePagination();
  showTargetFromHash();
  refreshAutoplay();

  window.addEventListener("resize", () => {
    currentIndex = Math.min(currentIndex, lastStartIndex());
    updatePagination();
    if (isInViewport) {
      goTo(currentIndex);
    }
    refreshAutoplay();
  });
  window.addEventListener("hashchange", showTargetFromHash);
  document.addEventListener("visibilitychange", refreshAutoplay);
  reducedMotionQuery.addEventListener("change", refreshAutoplay);

  const visibilityObserver = new IntersectionObserver((entries) => {
    isInViewport = entries[0].isIntersecting;
    if (isInViewport) {
      goTo(currentIndex);
    }
    refreshAutoplay();
  }, { threshold: 0.05 });
  visibilityObserver.observe(carousel);
});

const isArabic = document.documentElement.lang === "ar";
const sizeLabels = isArabic
  ? { half: "½ بوصة", one: "1 بوصة", "not-sure": "غير متأكد" }
  : { half: "½ inch", one: "1 inch", "not-sure": "Not sure" };

document.querySelectorAll("[data-device-request]").forEach((form) => {
  const formError = form.querySelector("[data-form-error]");
  const confirmation = document.querySelector("[data-request-confirmation]");
  const summary = document.querySelector("[data-request-summary]");
  const emailLink = document.querySelector("[data-request-email]");
  const editButton = document.querySelector("[data-edit-request]");
  const submitButton = form.querySelector("[type='submit']");
  const defaultFormError = formError.textContent;
  const defaultSubmitLabel = submitButton.textContent;
  const previewLink = document.querySelector("[data-checkout-preview]");
  const quantityInput = form.elements.namedItem("quantity");
  const phoneInput = form.elements.namedItem("phone");

  const checkoutPreviewUrl = () => {
    const formData = new FormData(form);
    const size = formData.get("size") || "not-sure";
    const quantity = quantityInput.value || "1";
    const params = new URLSearchParams({ size, quantity });
    const page = isArabic ? "checkout-ar.html" : "checkout.html";
    return `${page}?${params.toString()}`;
  };

  if (previewLink) {
    const updatePreviewLink = () => {
      previewLink.href = checkoutPreviewUrl();
    };

    form.addEventListener("change", updatePreviewLink);
    quantityInput.addEventListener("input", updatePreviewLink);
  }

  form.addEventListener("input", () => {
    formError.textContent = defaultFormError;
    formError.hidden = true;
  });

  form.addEventListener("invalid", () => {
    formError.textContent = defaultFormError;
    formError.hidden = false;
  }, true);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton.disabled) {
      return;
    }

    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    const phoneCharactersAreValid = /^[+0-9()\s-]+$/.test(phoneInput.value.trim());
    phoneInput.setCustomValidity(
      phoneDigits.length < 7 || !phoneCharactersAreValid
        ? (isArabic
            ? "أدخل رقم هاتف صحيحًا يحتوي على ٧ أرقام على الأقل."
            : "Enter a valid phone number with at least 7 digits.")
        : ""
    );

    if (!form.reportValidity()) {
      formError.textContent = defaultFormError;
      formError.hidden = false;
      return;
    }

    const formData = new FormData(form);
    const values = {
      name: formData.get("name").trim(),
      phone: formData.get("phone").trim(),
      email: formData.get("email").trim(),
      sector: formData.get("sector"),
      size: sizeLabels[formData.get("size")],
      quantity: formData.get("quantity"),
      city: formData.get("city").trim(),
      notes: formData.get("notes").trim()
    };
    const labels = isArabic
      ? {
          name: "الاسم",
          phone: "رقم الهاتف",
          email: "البريد الإلكتروني",
          sector: "مجال الاستخدام",
          size: "مقاس الجهاز",
          quantity: "الكمية",
          city: "المدينة / المحافظة",
          notes: "ملاحظات إضافية"
        }
      : {
          name: "Full name",
          phone: "Phone number",
          email: "Email address",
          sector: "Sector / application",
          size: "Device size",
          quantity: "Quantity",
          city: "City / Governorate",
          notes: "Additional notes"
        };
    const rows = Object.entries(values).filter(([key, value]) => key !== "notes" || value);
    summary.replaceChildren();

    rows.forEach(([key, value]) => {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = labels[key];
      description.textContent = value;
      row.append(term, description);
      summary.append(row);
    });

    const subject = isArabic ? "طلب جهاز SUQIA" : "SUQIA device request";
    const body = rows.map(([key, value]) => `${labels[key]}: ${value}`).join("\n");
    emailLink.href = `mailto:suqia.ai.official@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formError.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = isArabic ? "جارٍ إرسال الطلب..." : "Sending request...";

    let response;
    try {
      response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
    } catch {
      formError.textContent = isArabic
        ? "تعذر الاتصال بخدمة البريد. تحقق من اتصالك وحاول مرة أخرى، أو راسلنا مباشرة."
        : "Could not reach the email service. Check your connection and try again, or email us directly.";
      formError.hidden = false;
      submitButton.disabled = false;
      submitButton.textContent = defaultSubmitLabel;
      return;
    }

    let result;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok || !result || (result.success !== true && result.success !== "true")) {
      formError.textContent = isArabic
        ? "لم تقبل خدمة البريد الطلب. حاول مرة أخرى لاحقًا أو راسل SUQIA مباشرة."
        : "The email service could not accept this request. Try again later or email SUQIA directly.";
      formError.hidden = false;
      submitButton.disabled = false;
      submitButton.textContent = defaultSubmitLabel;
      return;
    }

    submitButton.disabled = false;
    submitButton.textContent = defaultSubmitLabel;
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
    confirmation.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth", block: "start" });
  });

  phoneInput.addEventListener("input", () => {
    phoneInput.setCustomValidity("");
  });

  editButton.addEventListener("click", () => {
    confirmation.hidden = true;
    form.hidden = false;
    form.querySelector("input[name='name']").focus();
  });
});

const checkoutSize = document.querySelector("[data-checkout-size]");
const checkoutQuantity = document.querySelector("[data-checkout-quantity]");

if (checkoutSize && checkoutQuantity) {
  const params = new URLSearchParams(window.location.search);
  const requestedSize = params.get("size");
  const requestedQuantity = Number(params.get("quantity"));
  const quantity = Number.isSafeInteger(requestedQuantity) && requestedQuantity > 0
    ? requestedQuantity
    : 1;
  const size = Object.prototype.hasOwnProperty.call(sizeLabels, requestedSize)
    ? requestedSize
    : "not-sure";

  checkoutSize.textContent = sizeLabels[size];
  checkoutQuantity.textContent = new Intl.NumberFormat(isArabic ? "ar" : "en").format(quantity);
}
