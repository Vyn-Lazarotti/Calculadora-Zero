"use strict";

function normalizeFunctionExpression(expression) {
    let expr = expression.trim();

    if (!expr) {
        throw new Error("Digite uma função.");
    }

    if (!/^[0-9a-zA-Z_+\-*/^().,\s]+$/.test(expr)) {
        throw new Error("A função contém caracteres inválidos.");
    }

    expr = expr.replace(/\bpi\b/gi, "Math.PI");
    expr = expr.replace(/\be\b/g, "Math.E");

    // Funções matemáticas
    const functions = {
        sqrt: "Math.sqrt",
        abs: "Math.abs",
        sin: "Math.sin",
        cos: "Math.cos",
        tan: "Math.tan",
        asin: "Math.asin",
        acos: "Math.acos",
        atan: "Math.atan",
        sinh: "Math.sinh",
        cosh: "Math.cosh",
        tanh: "Math.tanh",
        exp: "Math.exp",
        ln: "Math.log",
        log: "Math.log10",
        floor: "Math.floor",
        ceil: "Math.ceil",
        round: "Math.round"
    };

    for (const [name, replacement] of Object.entries(functions)) {
        const regex = new RegExp(`\\b${name}\\s*\\(`, "gi");
        expr = expr.replace(regex, `${replacement}(`);
    }

    expr = convertPowers(expr);

    return expr;
}

function convertPowers(expression) {

    let expr = expression;


    let previous;

    do {
        previous = expr;

        expr = expr.replace(
            /\(([^()]+)\)\s*\^\s*([a-zA-Z0-9_.]+|\([^()]+\))/g,
            "Math.pow(($1),($2))"
        );

        expr = expr.replace(
            /([a-zA-Z0-9_.]+)\s*\^\s*([a-zA-Z0-9_.]+)/g,
            "Math.pow($1,$2)"
        );

    } while (expr !== previous && expr.includes("^"));

    if (expr.includes("^")) {
        throw new Error(
            "Não foi possível interpretar uma potência. Use parênteses."
        );
    }

    return expr;
}

function evaluateFunction(expression, x) {
    const normalized = normalizeFunctionExpression(expression);

    if (!/^[0-9a-zA-Z_+\-*/().,\s]+$/.test(normalized)) {
        throw new Error("Expressão inválida.");
    }

    const evaluator = Function(
        "x",
        `"use strict"; return (${normalized});`
    );

    const result = evaluator(x);

    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("Valor fora do domínio ou resultado indefinido.");
    }

    return result;
}

$("calculateFunction").addEventListener("click", () => {
    const expression = $("functionInput").value.trim();
    const x = Number($("xValue").value);
    const resultElement = $("functionResult");

    if (!expression) {
        showResult(
            resultElement,
            "Digite uma função de x.",
            "error"
        );
        return;
    }

    if (!Number.isFinite(x)) {
        showResult(
            resultElement,
            "Digite um valor válido para x.",
            "error"
        );
        return;
    }

    try {
        const result = evaluateFunction(expression, x);

        showResult(
            resultElement,
            `f(${formatNumber(x)}) = ${formatNumber(result)}`,
            "success"
        );
    } catch (error) {
        showResult(
            resultElement,
            `Domínio inválido: ${error.message}`,
            "error"
        );
    }
});