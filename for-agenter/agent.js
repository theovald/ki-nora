(function () {
  var body = document.body;
  var btn = document.getElementById("theme-toggle");
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {
    saved = null;
  }
  if (saved === "light") {
    body.classList.remove("dark-theme");
  }
  function label() {
    btn.textContent = body.classList.contains("dark-theme") ? "Lyst tema" : "Mørkt tema";
  }
  label();
  btn.addEventListener("click", function () {
    body.classList.toggle("dark-theme");
    try {
      localStorage.setItem("theme", body.classList.contains("dark-theme") ? "dark" : "light");
    } catch (e) {
      /* lagring utilgjengelig */
    }
    label();
  });
})();
