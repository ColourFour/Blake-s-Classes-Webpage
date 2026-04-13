(() => {
  const key = "grade1-math-adventure-lang";
  const body = document.body;
  const saved = localStorage.getItem(key);
  if (saved === "zh" || saved === "en") {
    body.dataset.lang = saved;
    document.documentElement.lang = saved === "zh" ? "zh-CN" : "en";
  }
  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = body.dataset.lang === "zh" ? "en" : "zh";
      body.dataset.lang = next;
      document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
      localStorage.setItem(key, next);
    });
  });
})();