//Comentário obrigatório: essa é a "base" do back-end pra calculadora funcionar

"use strict";

const $ = (id) => document.getElementById(id);

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return "Indefinido";
    }

    if (Math.abs(value) < 1e-12) {
        return "0";
    }

    return Number(value.toPrecision(12)).toString();
}

function showResult(element, message, type = "success") {
    element.textContent = message;
    element.className = `result ${type}`;
}

function clearResult(element) {
    element.textContent = "";
    element.className = "result";
}