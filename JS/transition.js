// PAGE LOAD (ENTER FROM RIGHT)
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

// CLICK TRANSITION (EXIT WITH DIRECTION)
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {

    const href = this.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    e.preventDefault();

    document.body.classList.remove("page-loaded");

    // Direction logic
    if (href.includes("ContactUs")) {
      document.body.classList.add("page-exit", "slide-right");
      document.body.classList.remove("slide-left");
    } else {
      document.body.classList.add("page-exit", "slide-left");
      document.body.classList.remove("slide-right");
    }

    // SHOW LOADER 
    const loader = document.querySelector(".page-loader");
    if (loader) {
      loader.classList.add("active");
    }

    
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});