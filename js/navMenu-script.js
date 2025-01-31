const navMenu = document.getElementById("navBarMenu");
const navOptions = document.getElementById("navbar-options");

navMenu.addEventListener("click", () => { navOptions.classList.toggle("block-layout-inject"); });