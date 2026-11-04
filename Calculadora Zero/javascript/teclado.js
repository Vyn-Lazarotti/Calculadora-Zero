// Habilita o teclado a funcionar nas caixas
"use strict";

document.addEventListener("keydown", (event) => {

    const target = event.target;

    if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target.isContentEditable
    ) {
        return;
    }

    const allowedKeys = [
        "0", "1", "2", "3", "4",
        "5", "6", "7", "8", "9",
        "+", "-", "*", "/", ".",
        "(", ")"
    ];

    if (allowedKeys.includes(event.key)) {
        display.value += event.key;
    }

    if (event.key === "Enter") {
        event.preventDefault();
        calculateBasic();
    }

    if (event.key === "Escape") {
        display.value = "";
        clearResult(basicResult);
    }

    if (event.key === "Backspace") {
        display.value = display.value.slice(0, -1);
    }
});
