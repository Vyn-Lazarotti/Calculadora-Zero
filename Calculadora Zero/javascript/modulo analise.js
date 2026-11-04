"use strict";
//BigInt
function getNonNegativeBigInt(value, name) {
    const text = String(value).trim();

    if (!/^\d+$/.test(text)) {
        throw new Error(
            `${name} deve ser um inteiro não negativo.`
        );
    }

    return BigInt(text);
}
//calcula fatorial
function factorial(n) {
    if (n < 0n) {
        throw new Error(
            "Não existe fatorial de número negativo."
        );
    }

    let result = 1n;

    for (let i = 2n; i <= n; i++) {
        result *= i;
    }

    return result;
}
//permutação simples
function simplePermutation(n) {
    return factorial(n);
}
//aranjo
function arrangement(n, r) {
    if (r > n) {
        throw new Error(
            "Para arranjo simples, r não pode ser maior que n."
        );
    }

    let result = 1n;

    for (let i = 0n; i < r; i++) {
        result *= n - i;
    }

    return result;
}
//combinação
function combination(n, r) {
    if (r > n) {
        throw new Error(
            "Para combinação, r não pode ser maior que n."
        );
    }

    if (r > n - r) {
        r = n - r;
    }

    let result = 1n;

    for (let i = 1n; i <= r; i++) {
        result = result * (n - r + i) / i;
    }

    return result;
}
//permutação
function repeatedPermutation(values) {
    const counts = values.map(value =>
        getNonNegativeBigInt(value, "Quantidade")
    );

    const total = counts.reduce(
        (sum, value) => sum + value,
        0n
    );

    let result = factorial(total);

    for (const count of counts) {
        result /= factorial(count);
    }

    return result;
}
//códigos abaixo pra fazer os botões funcionarem
$("factorial").addEventListener("click", () => {
    try {
        const n = getNonNegativeBigInt(
            $("combN").value,
            "n"
        );

        const result = factorial(n);

        showResult(
            $("combinatoricsResult"),
            `${n}! = ${result.toString()}`,
            "success"
        );
    } catch (error) {
        showResult(
            $("combinatoricsResult"),
            error.message,
            "error"
        );
    }
});

$("permutation").addEventListener("click", () => {
    try {
        const n = getNonNegativeBigInt(
            $("combN").value,
            "n"
        );

        const result = simplePermutation(n);

        showResult(
            $("combinatoricsResult"),
            `P(${n}) = ${result.toString()}`,
            "success"
        );
    } catch (error) {
        showResult(
            $("combinatoricsResult"),
            error.message,
            "error"
        );
    }
});

$("arrangement").addEventListener("click", () => {
    try {
        const n = getNonNegativeBigInt(
            $("combN").value,
            "n"
        );

        const r = getNonNegativeBigInt(
            $("combR").value,
            "r"
        );

        const result = arrangement(n, r);

        showResult(
            $("combinatoricsResult"),
            `A(${n}, ${r}) = ${result.toString()}`,
            "success"
        );
    } catch (error) {
        showResult(
            $("combinatoricsResult"),
            error.message,
            "error"
        );
    }
});

$("combination").addEventListener("click", () => {
    try {
        const n = getNonNegativeBigInt(
            $("combN").value,
            "n"
        );

        const r = getNonNegativeBigInt(
            $("combR").value,
            "r"
        );

        const result = combination(n, r);

        showResult(
            $("combinatoricsResult"),
            `C(${n}, ${r}) = ${result.toString()}`,
            "success"
        );
    } catch (error) {
        showResult(
            $("combinatoricsResult"),
            error.message,
            "error"
        );
    }
});

$("calculateRepetition").addEventListener("click", () => {
    try {
        const input = $("repetitionValues").value.trim();

        if (!input) {
            throw new Error(
                "Informe as quantidades separadas por vírgulas."
            );
        }

        const values = input
            .split(",")
            .map(value => value.trim());

        if (values.some(value => !/^\d+$/.test(value))) {
            throw new Error(
                "Todas as quantidades devem ser inteiros não negativos."
            );
        }

        const result = repeatedPermutation(values);

        const total = values.reduce(
            (sum, value) => sum + BigInt(value),
            0n
        );

        showResult(
            $("combinatoricsResult"),
            `Permutação com repetição = ${result.toString()} (total de ${total} elementos)`,
            "success"
        );
    } catch (error) {
        showResult(
            $("combinatoricsResult"),
            error.message,
            "error"
        );
    }
});