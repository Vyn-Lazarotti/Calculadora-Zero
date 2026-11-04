//calculadora basicona
"use strict";

const display = $("display");
const basicResult = $("basicResult");

document.querySelectorAll(".calculator-buttons button").forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            display.value += value;
            return;
        }

        if (action === "clear") { //faz a faxina
            display.value = "";
            clearResult(basicResult);
            return;
        }

        if (action === "backspace") { //deleta o número digitado
            display.value = display.value.slice(0, -1);
            return;
        }

        if (action === "calculate") {
            calculateBasic();
        }
    });
});

function calculateBasic() {
    const expression = display.value.trim();

    if (!expression) {
        showResult(basicResult, "Digite uma expressão.", "error");
        return;
    }

    try {
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            throw new Error("Expressão contém caracteres inválidos.");
        }

        if (/\/\s*0(?:\D|$)/.test(expression)) {
            throw new Error("Divisão por zero.");
        }

        const result = Function(`"use strict"; return (${expression})`)();

        if (!Number.isFinite(result)) {
            throw new Error("O resultado não é um número finito.");
        }

        display.value = formatNumber(result);

        showResult(
            basicResult,
            `Resultado: ${formatNumber(result)}`,
            "success"
        );
    } catch (error) {
        showResult(
            basicResult,
            `Erro: ${error.message}`,
            "error"
        );
    }
}