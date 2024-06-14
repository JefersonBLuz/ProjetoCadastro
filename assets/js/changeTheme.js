const chooseMode = document.querySelector("#theme");
const html = document.querySelector("html");

chooseMode.addEventListener("click",() => {
    const att = html.getAttribute("data-theme");
    att == "light" ? html.setAttribute("data-theme","dark") : html.setAttribute("data-theme","light");
});