export function animateAlert(type, message) {
    if (document.querySelector(".alert") === null) {
        let errorEl = `
            <div class="alert alert_${type}">
                <p class="alert__text">${message}</p>
                <i class="fa fa-times alert__close-btn" aria-hidden="true"></i>                
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", errorEl);
        errorEl = document.querySelector(".alert");
        errorEl.querySelector("i").onclick = function () {
            document.body.removeChild(errorEl);
        }
        const handler = setTimeout(function () {
            errorEl.classList.add("alert__hidden");
            errorEl.ontransitionend = function () {
                document.body.removeChild(errorEl);
            }
            clearTimeout(handler);
        }, 2000);
    }
}