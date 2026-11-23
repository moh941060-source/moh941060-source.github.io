(() => {
  const isArabic = document.documentElement.lang === "ar";
  const auth = window.SUQIAAuth;
  const text = isArabic
    ? {
        account: "الحساب",
        login: "تسجيل الدخول",
        register: "إنشاء حساب",
        dashboard: "نظرة عامة",
        profile: "ملفي الشخصي",
        orders: "طلباتي",
        support: "الدعم",
        logout: "تسجيل الخروج",
        logoutFailed: "تعذر تسجيل الخروج. حاول مرة أخرى.",
        serviceUnavailable: "خدمة الحساب غير متاحة حاليًا. لم يتم إرسال البيانات.",
        invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        emailInUse: "هذا البريد الإلكتروني مسجل بالفعل.",
        emailUnavailable: "إرسال البريد غير مهيأ على الخادم. التسجيل واستعادة كلمة المرور غير متاحين حاليًا.",
        emailNotVerified: "أكد بريدك الإلكتروني قبل تسجيل الدخول.",
        invalidToken: "الرابط غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.",
        emailVerified: "تم تأكيد البريد الإلكتروني. يمكنك تسجيل الدخول الآن.",
        verifyingEmail: "جارٍ تأكيد البريد الإلكتروني...",
        requestFailed: "تعذر إكمال الطلب. راجع البيانات وحاول مرة أخرى.",
        passwordMismatch: "كلمتا المرور غير متطابقتين.",
        passwordResetSent: "إذا كان الحساب موجودًا، فستصل تعليمات إعادة التعيين إلى البريد المسجل.",
        passwordResetComplete: "تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.",
        emailVerification: "تم إنشاء الطلب. تحقق من بريدك لإكمال التسجيل.",
        profileSaved: "تم حفظ الملف الشخصي.",
        supportSent: "تم إرسال طلب الدعم.",
        accountUnavailable: "خدمة الحساب الآمنة غير متصلة بعد. لا تُرسل هذه الصفحة بيانات الدخول أو تخزنها.",
        sessionUnavailable: "تعذر التحقق من جلسة الحساب. حاول تحديث الصفحة.",
        profileUnavailable: "تعذر تحميل بيانات الملف الشخصي.",
        ordersUnavailable: "تعذر تحميل الطلبات.",
        servicesUnavailable: "تعذر تحميل الخدمات.",
        supportUnavailable: "تعذر تحميل طلبات الدعم.",
        invalidResetLink: "رابط إعادة التعيين مفقود أو غير صالح. اطلب رسالة إعادة تعيين جديدة.",
        invalidResponse: "أعاد الخادم بيانات غير مكتملة. حاول مرة أخرى لاحقًا.",
        emptyOrders: "لا توجد طلبات مرتبطة بهذا الحساب حتى الآن.",
        emptyServices: "لا توجد خدمات مرتبطة بهذا الحساب حتى الآن.",
        emptySupport: "لا توجد طلبات دعم مرتبطة بهذا الحساب حتى الآن.",
        order: "الطلب",
        service: "الخدمة",
        status: "الحالة",
        date: "التاريخ",
        name: "الاسم",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        city: "المدينة",
        subject: "الموضوع"
      }
    : {
        account: "Account",
        login: "Login",
        register: "Create Account",
        dashboard: "Overview",
        profile: "My Profile",
        orders: "My Orders",
        support: "Support",
        logout: "Logout",
        logoutFailed: "Could not log out. Please try again.",
        serviceUnavailable: "The account service is unavailable. No data was sent.",
        invalidCredentials: "The email or password is incorrect.",
        emailInUse: "This email address is already registered.",
        emailUnavailable: "Email delivery is not configured on this server. Registration and password recovery are unavailable.",
        emailNotVerified: "Verify your email address before signing in.",
        invalidToken: "This link is invalid or expired. Request a new one.",
        emailVerified: "Your email is verified. You can now log in.",
        verifyingEmail: "Verifying your email address...",
        requestFailed: "The request could not be completed. Check your details and try again.",
        passwordMismatch: "The passwords do not match.",
        passwordResetSent: "If the account exists, password-reset instructions will be sent to its email.",
        passwordResetComplete: "Your password was changed. You can now log in.",
        emailVerification: "Your registration request was received. Check your email to finish signing up.",
        profileSaved: "Your profile was saved.",
        supportSent: "Your support request was sent.",
        accountUnavailable: "The secure account service is not connected yet. This page does not send or store credentials.",
        sessionUnavailable: "The account session could not be verified. Please refresh the page.",
        profileUnavailable: "Could not load your profile.",
        ordersUnavailable: "Could not load your orders.",
        servicesUnavailable: "Could not load your services.",
        supportUnavailable: "Could not load your support requests.",
        invalidResetLink: "This reset link is missing or invalid. Request a new reset email.",
        invalidResponse: "The server returned incomplete data. Please try again later.",
        emptyOrders: "No orders are associated with this account yet.",
        emptyServices: "No services are associated with this account yet.",
        emptySupport: "No support requests are associated with this account yet.",
        order: "Order",
        service: "Service",
        status: "Status",
        date: "Date",
        name: "Name",
        email: "Email",
        phone: "Phone",
        city: "City",
        subject: "Subject"
      };

  const authHref = (mode) => `${isArabic ? "auth-ar.html" : "auth.html"}?mode=${mode}`;
  const accountHref = (view) => `${isArabic ? "account-ar.html" : "account.html"}${view ? `#${view}` : ""}`;
  const isAuthenticatedUser = (user) =>
    Boolean(user && typeof user.id === "string" && user.id);
  const errorMessage = (error) => {
    if (!error || !error.code) {
      return text.requestFailed;
    }

    if (error.code === "auth_not_configured" || error.code === "auth_service_unavailable") {
      return text.serviceUnavailable;
    }
    if (error.code === "invalid_credentials") {
      return text.invalidCredentials;
    }
    if (error.code === "email_already_registered") {
      return text.emailInUse;
    }
    if (error.code === "email_not_configured" || error.code === "email_delivery_failed") {
      return text.emailUnavailable;
    }
    if (error.code === "email_not_verified") {
      return text.emailNotVerified;
    }
    if (error.code === "invalid_token") {
      return text.invalidToken;
    }
    if (error.code === "invalid_auth_response") {
      return text.invalidResponse;
    }
    if (error.status === 429) {
      return isArabic ? "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى." : "Too many attempts. Please wait and try again.";
    }
    return text.requestFailed;
  };

  const createLink = (href, label, className) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    link.className = className;
    link.addEventListener("click", () => {
      const dialog = link.closest("dialog");
      if (dialog && dialog.open) {
        dialog.close();
      }
    });
    return link;
  };

  const renderAccountMenus = (user, unavailable) => {
    document.querySelectorAll(".menu-links, .product-header-links").forEach((nav) => {
      const oldMenu = nav.querySelector("[data-auth-navigation]");
      if (oldMenu) {
        oldMenu.remove();
      }

      const isDialogMenu = nav.classList.contains("menu-links");
      const details = document.createElement("details");
      details.dataset.authNavigation = "";
      details.className = isDialogMenu ? "menu-section auth-nav-section" : "auth-nav-section auth-nav-product";
      details.open = isDialogMenu && !isAuthenticatedUser(user);

      const summary = document.createElement("summary");
      const title = document.createElement("span");
      title.textContent = isAuthenticatedUser(user) && typeof user.name === "string" && user.name
        ? user.name
        : text.account;
      summary.append(title);
      if (isDialogMenu) {
        const toggle = document.createElement("span");
        toggle.className = "menu-toggle";
        toggle.setAttribute("aria-hidden", "true");
        toggle.textContent = "+";
        summary.append(toggle);
      }
      details.append(summary);

      const links = document.createElement("div");
      links.className = isDialogMenu ? "menu-section-content auth-nav-links" : "auth-nav-links";
      const linkClass = isDialogMenu ? "menu-section-link" : "auth-nav-link";
      const navMessage = document.createElement("p");
      navMessage.className = "auth-nav-message";
      navMessage.hidden = true;

      if (isAuthenticatedUser(user)) {
        links.append(
          createLink(accountHref("overview"), text.dashboard, linkClass),
          createLink(accountHref("profile"), text.profile, linkClass),
          createLink(accountHref("orders"), text.orders, linkClass),
          createLink(accountHref("support"), text.support, linkClass)
        );
        const logoutButton = document.createElement("button");
        logoutButton.type = "button";
        logoutButton.className = `${linkClass} auth-logout`;
        logoutButton.textContent = text.logout;
        logoutButton.addEventListener("click", async () => {
          logoutButton.disabled = true;
          try {
            await auth.logout();
            window.location.assign(authHref("login"));
          } catch {
            logoutButton.disabled = false;
            navMessage.textContent = text.logoutFailed;
            navMessage.hidden = false;
          }
        });
        links.append(logoutButton);
      } else {
        links.append(
          createLink(authHref("login"), text.login, linkClass),
          createLink(authHref("register"), text.register, linkClass)
        );
      }

      if (unavailable) {
        navMessage.textContent = text.sessionUnavailable;
        navMessage.hidden = false;
      }
      links.append(navMessage);
      details.append(links);
      nav.append(details);
    });
  };

  const updateAccountNavigation = async () => {
    if (!auth.isConfigured()) {
      renderAccountMenus(null, false);
      return;
    }

    try {
      const session = await auth.getSession();
      renderAccountMenus(session.user, false);
    } catch {
      renderAccountMenus(null, true);
    }
  };

  const authPage = document.querySelector("[data-auth-page]");
  if (authPage) {
    const params = new URLSearchParams(window.location.search);
    const allowedModes = ["login", "register", "forgot-password", "reset-password", "verify-email"];
    const requestedMode = params.get("mode");
    const mode = allowedModes.includes(requestedMode) ? requestedMode : "login";
    const resetToken = params.get("token") || "";

    document.querySelectorAll("[data-auth-view]").forEach((view) => {
      view.hidden = view.dataset.authView !== mode;
    });

    const backendNotice = document.querySelector("[data-auth-backend-notice]");
    const emailUnavailable = auth.isConfigured() && window.SUQIA_AUTH_CONFIG.emailEnabled === false;
    if (!auth.isConfigured()) {
      backendNotice.hidden = false;
    } else if (emailUnavailable) {
      document.querySelector("[data-auth-email-notice]").hidden = false;
    }
    if (emailUnavailable) {
      document.querySelectorAll(
        '[data-auth-form="register"] [type="submit"], [data-auth-form="forgot-password"] [type="submit"]'
      ).forEach((submit) => {
        submit.disabled = true;
      });
    }

    const resetForm = document.querySelector('[data-auth-form="reset-password"]');
    if (resetForm) {
      resetForm.elements.namedItem("token").value = resetToken;
      if (!resetToken) {
        const tokenNotice = document.querySelector("[data-reset-token-notice]");
        tokenNotice.hidden = false;
        resetForm.querySelector("[type='submit']").disabled = true;
      }
    }

    if (mode === "verify-email") {
      const status = document.querySelector("[data-verification-status]");
      if (!resetToken) {
        status.textContent = text.invalidToken;
      } else if (!auth.isConfigured()) {
        status.textContent = text.accountUnavailable;
      } else {
        status.textContent = text.verifyingEmail;
        auth.verifyEmail(resetToken).then(() => {
          status.textContent = text.emailVerified;
        }).catch((verificationError) => {
          status.textContent = errorMessage(verificationError);
        });
      }
    }

    document.querySelectorAll("[data-auth-form]").forEach((form) => {
      const error = form.querySelector("[data-auth-error]");
      const submit = form.querySelector("[type='submit']");
      const defaultSubmit = submit.textContent;

      form.addEventListener("input", () => {
        error.hidden = true;
        const password = form.elements.namedItem("password");
        const confirmation = form.elements.namedItem("passwordConfirm");
        if (password && confirmation) {
          confirmation.setCustomValidity("");
        }
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const password = form.elements.namedItem("password");
        const confirmation = form.elements.namedItem("passwordConfirm");
        if (password && confirmation) {
          if (password.value !== confirmation.value) {
            confirmation.setCustomValidity(text.passwordMismatch);
            error.textContent = text.passwordMismatch;
            error.hidden = false;
            confirmation.reportValidity();
            return;
          }
          confirmation.setCustomValidity("");
        }
        if (!form.reportValidity()) {
          return;
        }

        if (
          emailUnavailable &&
          ["register", "forgot-password"].includes(form.dataset.authForm)
        ) {
          error.textContent = text.emailUnavailable;
          error.hidden = false;
          return;
        }

        if (!auth.isConfigured()) {
          error.textContent = text.accountUnavailable;
          error.hidden = false;
          return;
        }

        submit.disabled = true;
        submit.textContent = isArabic ? "جارٍ الإرسال..." : "Please wait...";
        error.hidden = true;
        try {
          const values = new FormData(form);
          let result;
          if (form.dataset.authForm === "login") {
            result = await auth.login(
              values.get("email").trim(),
              values.get("password"),
              values.get("rememberMe") === "on"
            );
            if (!result || !isAuthenticatedUser(result.user)) {
              throw new Error("invalid_auth_response");
            }
            window.location.assign(accountHref("overview"));
            return;
          }
          if (form.dataset.authForm === "register") {
            result = await auth.register(
              values.get("name").trim(),
              values.get("email").trim(),
              values.get("password")
            );
            if (result && result.requiresEmailVerification === true) {
              const status = document.querySelector("[data-auth-message]");
              status.textContent = text.emailVerification;
              status.hidden = false;
            } else if (result && isAuthenticatedUser(result.user)) {
              window.location.assign(accountHref("overview"));
              return;
            } else {
              throw new Error("invalid_auth_response");
            }
          } else if (form.dataset.authForm === "forgot-password") {
            await auth.requestPasswordReset(values.get("email").trim());
            const status = document.querySelector("[data-auth-message]");
            status.textContent = text.passwordResetSent;
            status.hidden = false;
          } else if (form.dataset.authForm === "reset-password") {
            await auth.resetPassword(values.get("token"), values.get("password"));
            const status = document.querySelector("[data-auth-message]");
            status.textContent = text.passwordResetComplete;
            status.hidden = false;
            window.setTimeout(() => window.location.assign(authHref("login")), 1200);
          }
        } catch (requestError) {
          error.textContent = errorMessage(requestError);
          error.hidden = false;
        } finally {
          submit.disabled = false;
          submit.textContent = defaultSubmit;
        }
      });
    });
  }

  const accountContent = document.querySelector("[data-account-content]");
  if (accountContent) {
    const unavailable = document.querySelector("[data-account-unavailable]");
    const unavailableMessage = document.querySelector("[data-account-unavailable-message]");
    const pageMessage = document.querySelector("[data-account-message]");

    const showPageError = (error, fallback) => {
      const unavailableCodes = ["auth_not_configured", "auth_service_unavailable", "auth_request_failed"];
      pageMessage.textContent = error && unavailableCodes.includes(error.code)
        ? fallback
        : errorMessage(error);
      pageMessage.hidden = false;
    };

    const setRecordList = (container, emptyState, records, kind) => {
      if (!Array.isArray(records)) {
        throw new auth.AuthApiError("invalid_auth_response", text.invalidResponse);
      }
      container.replaceChildren();
      emptyState.hidden = records.length !== 0;
      records.forEach((record) => {
        if (!record || typeof record !== "object") {
          throw new auth.AuthApiError("invalid_auth_response", text.invalidResponse);
        }
        const article = document.createElement("article");
        article.className = "account-record";
        const title = document.createElement("h3");
        const titleValue = kind === "orders"
          ? record.productName
          : kind === "services"
            ? record.name
            : record.subject;
        title.textContent = typeof titleValue === "string" && titleValue
          ? titleValue
          : text[kind === "orders" ? "order" : kind === "services" ? "service" : "subject"];
        article.append(title);

        const details = [
          [text.status, record.status],
          [text.date, record.createdAt]
        ];
        if (typeof record.orderNumber === "string" && record.orderNumber) {
          details.unshift([text.order, record.orderNumber]);
        }
        details.forEach(([label, value]) => {
          if (typeof value !== "string" || !value) {
            return;
          }
          const row = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = `${label}: `;
          row.append(strong, document.createTextNode(value));
          article.append(row);
        });
        container.append(article);
      });
    };

    const loadList = async (load, listSelector, emptySelector, key, fallback) => {
      try {
        const result = await load();
        if (!result || !Array.isArray(result[key])) {
          throw new auth.AuthApiError("invalid_auth_response", text.invalidResponse);
        }
        setRecordList(
          document.querySelector(listSelector),
          document.querySelector(emptySelector),
          result[key],
          key === "orders" ? "orders" : key === "services" ? "services" : "support"
        );
      } catch (error) {
        showPageError(error, fallback);
      }
    };

    const loadAccount = async () => {
      if (!auth.isConfigured()) {
        unavailableMessage.textContent = text.accountUnavailable;
        return;
      }

      let session;
      try {
        session = await auth.getSession();
      } catch (error) {
        unavailableMessage.textContent = errorMessage(error);
        return;
      }
      if (!session.user) {
        window.location.replace(authHref("login"));
        return;
      }

      unavailable.hidden = true;
      accountContent.hidden = false;
      document.querySelector("[data-account-name]").textContent =
        typeof session.user.name === "string" ? session.user.name : "";
      document.querySelector("[data-account-email]").textContent =
        typeof session.user.email === "string" ? session.user.email : "";

      try {
        const result = await auth.getProfile();
        const profile = result && result.profile;
        if (!profile || typeof profile.email !== "string") {
          throw new auth.AuthApiError("invalid_auth_response", text.invalidResponse);
        }
        const profileForm = document.querySelector("[data-profile-form]");
        ["name", "email", "phone", "city"].forEach((field) => {
          profileForm.elements.namedItem(field).value = typeof profile[field] === "string" ? profile[field] : "";
        });
      } catch (error) {
        showPageError(error, text.profileUnavailable);
      }

      await Promise.all([
        loadList(() => auth.getOrders(), "[data-orders-list]", "[data-orders-empty]", "orders", text.ordersUnavailable),
        loadList(() => auth.getServices(), "[data-services-list]", "[data-services-empty]", "services", text.servicesUnavailable),
        loadList(() => auth.getSupportRequests(), "[data-support-list]", "[data-support-empty]", "requests", text.supportUnavailable)
      ]);
    };

    const profileForm = document.querySelector("[data-profile-form]");
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const error = profileForm.querySelector("[data-profile-error]");
      const success = profileForm.querySelector("[data-profile-success]");
      const submit = profileForm.querySelector("[type='submit']");
      if (!profileForm.reportValidity()) {
        return;
      }
      submit.disabled = true;
      error.hidden = true;
      success.hidden = true;
      const values = new FormData(profileForm);
      try {
        await auth.updateProfile({
          name: values.get("name").trim(),
          phone: values.get("phone").trim(),
          city: values.get("city").trim()
        });
        document.querySelector("[data-account-name]").textContent = values.get("name").trim();
        success.textContent = text.profileSaved;
        success.hidden = false;
      } catch (requestError) {
        error.textContent = errorMessage(requestError);
        error.hidden = false;
      } finally {
        submit.disabled = false;
      }
    });

    const supportForm = document.querySelector("[data-support-form]");
    supportForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const error = supportForm.querySelector("[data-support-error]");
      const success = supportForm.querySelector("[data-support-success]");
      const submit = supportForm.querySelector("[type='submit']");
      if (!supportForm.reportValidity()) {
        return;
      }
      submit.disabled = true;
      error.hidden = true;
      success.hidden = true;
      const values = new FormData(supportForm);
      try {
        await auth.createSupportRequest({
          subject: values.get("subject").trim(),
          message: values.get("message").trim()
        });
        supportForm.reset();
        success.textContent = text.supportSent;
        success.hidden = false;
      } catch (requestError) {
        error.textContent = errorMessage(requestError);
        error.hidden = false;
      } finally {
        submit.disabled = false;
      }
    });

    loadAccount();
  }

  updateAccountNavigation();
})();
