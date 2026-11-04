//conversor de bases (binário, octal, hexadecimal e decimal)
"use strict";
//valida o número inserido e calcula qual a base
function validateBaseNumber(value, base) {
    let pattern;

    switch (base) {
        case 2:
            pattern = /^[01]+$/i;
            break;

        case 8:
            pattern = /^[0-7]+$/i;
            break;

        case 10:
            pattern = /^\d+$/;
            break;

        case 16:
            pattern = /^[0-9a-f]+$/i;
            break;

        default:
            return false;
    }

    return pattern.test(value);
}

$("convertBase").addEventListener("click", () => {
    const input = $("baseInput").value.trim().toUpperCase();
    const base = Number($("inputBase").value);

    $("baseError").style.display = "none";
    $("baseError").textContent = "";

    if (!input) {
        showBaseError("Digite um número.");
        return;
    }

    if (!validateBaseNumber(input, base)) {
        showBaseError(
            `O valor "${input}" não é válido para a base ${base}.`
        );
        return;
    }

    try {
        const decimal = BigInt(parseInt(input, base));

        $("binaryResult").textContent =
            decimal.toString(2);

        $("octalResult").textContent =
            decimal.toString(8);

        $("decimalResult").textContent =
            decimal.toString(10);

        $("hexResult").textContent =
            decimal.toString(16).toUpperCase();

    } catch (error) {
        showBaseError(
            "Não foi possível realizar a conversão."
        );
    }
});

function showBaseError(message) {
    $("baseError").textContent = message;
    $("baseError").style.display = "block";

    $("binaryResult").textContent = "—";
    $("octalResult").textContent = "—";
    $("decimalResult").textContent = "—";
    $("hexResult").textContent = "—";
}