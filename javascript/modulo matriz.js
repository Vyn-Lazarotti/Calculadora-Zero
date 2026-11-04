//calcula matriz
"use strict";

function createMatrixInputs(
    containerId,
    rows,
    cols,
    matrixName
) {
    const container = $(containerId);

    container.innerHTML = "";

    const matrix = document.createElement("div");
    matrix.className = "matrix";

    matrix.style.gridTemplateColumns =
        `repeat(${cols}, minmax(60px, 1fr))`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement("input");

            input.type = "number";
            input.step = "any";
            input.className = "matrix-input";

            input.dataset.matrix = matrixName;
            input.dataset.row = i;
            input.dataset.col = j;

            input.value = "0";

            matrix.appendChild(input);
        }
    }

    container.appendChild(matrix);
}

function getMatrixFromInputs(matrixName) {
    const inputs = document.querySelectorAll(
        `.matrix-input[data-matrix="${matrixName}"]`
    );

    if (inputs.length === 0) {
        throw new Error(`Matriz ${matrixName} não foi criada.`);
    }

    const rows = Math.max(
        ...Array.from(inputs).map(
            input => Number(input.dataset.row)
        )
    ) + 1;

    const cols = Math.max(
        ...Array.from(inputs).map(
            input => Number(input.dataset.col)
        )
    ) + 1;

    const matrix = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = [];

        for (let j = 0; j < cols; j++) {
            const input = document.querySelector(
                `.matrix-input[data-matrix="${matrixName}"][data-row="${i}"][data-col="${j}"]`
            );

            if (!input || input.value.trim() === "") {
                throw new Error(
                    `A matriz ${matrixName} possui uma entrada vazia.`
                );
            }

            const value = Number(input.value);

            if (!Number.isFinite(value)) {
                throw new Error(
                    `A matriz ${matrixName} possui um valor inválido.`
                );
            }

            matrix[i][j] = value;
        }
    }

    return matrix;
}

function renderMatrix(matrix, container) {
    container.innerHTML = "";

    const result = document.createElement("div");
    result.className = "matrix-result";

    result.style.gridTemplateColumns =
        `repeat(${matrix[0].length}, minmax(60px, 1fr))`;

    matrix.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement("div");
            cell.className = "matrix-cell";
            cell.textContent = formatNumber(value);

            result.appendChild(cell);
        });
    });

    container.appendChild(result);
}

function multiplyMatrixByScalar(matrix, scalar) {
    return matrix.map(row =>
        row.map(value => value * scalar)
    );
}

function multiplyMatrices(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;

    const rowsB = B.length;
    const colsB = B[0].length;

    if (colsA !== rowsB) {
        throw new Error(
            `Não é possível multiplicar: A é ${rowsA}×${colsA} e B é ${rowsB}×${colsB}.`
        );
    }

    const result = Array.from(
        { length: rowsA },
        () => Array(colsB).fill(0)
    );

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return result;
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, columnIndex) =>
        matrix.map(row => row[columnIndex])
    );
}

function determinant(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error(
            "O determinante só pode ser calculado para matrizes quadradas."
        );
    }

    const n = matrix.length;

    if (n === 1) {
        return matrix[0][0];
    }

    if (n === 2) {
        return (
            matrix[0][0] * matrix[1][1] -
            matrix[0][1] * matrix[1][0]
        );
    }

    // Cópia para eliminação de Gauss
    const A = matrix.map(row => [...row]);
    let det = 1;

    for (let i = 0; i < n; i++) {
        let pivot = i;

        for (let row = i + 1; row < n; row++) {
            if (Math.abs(A[row][i]) > Math.abs(A[pivot][i])) {
                pivot = row;
            }
        }

        if (Math.abs(A[pivot][i]) < 1e-12) {
            return 0;
        }

        if (pivot !== i) {
            [A[i], A[pivot]] = [A[pivot], A[i]];
            det *= -1;
        }

        det *= A[i][i];

        for (let row = i + 1; row < n; row++) {
            const factor = A[row][i] / A[i][i];

            for (let col = i; col < n; col++) {
                A[row][col] -= factor * A[i][col];
            }
        }
    }

    return det;
}

$("createMatrixA").addEventListener("click", () => {
    const rows = Number($("matrixRowsA").value);
    const cols = Number($("matrixColsA").value);

    if (
        rows < 1 ||
        cols < 1 ||
        rows > 8 ||
        cols > 8
    ) {
        showResult(
            $("matrixResult"),
            "As dimensões devem estar entre 1 e 8.",
            "error"
        );
        return;
    }

    createMatrixInputs(
        "matrixAContainer",
        rows,
        cols,
        "A"
    );
});

$("createMatrixB").addEventListener("click", () => {
    const rows = Number($("matrixRowsB").value);
    const cols = Number($("matrixColsB").value);

    if (
        rows < 1 ||
        cols < 1 ||
        rows > 8 ||
        cols > 8
    ) {
        showResult(
            $("matrixResult"),
            "As dimensões devem estar entre 1 e 8.",
            "error"
        );
        return;
    }

    createMatrixInputs(
        "matrixBContainer",
        rows,
        cols,
        "B"
    );
});

$("scalarMultiply").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const scalar = Number($("scalar").value);

        if (!Number.isFinite(scalar)) {
            throw new Error("Escalar inválido.");
        }

        const result = multiplyMatrixByScalar(A, scalar);

        renderMatrix(result, $("matrixResult"));

        showResult(
            $("matrixResult"),
            "Multiplicação por escalar realizada.",
            "success"
        );
    } catch (error) {
        showResult(
            $("matrixResult"),
            error.message,
            "error"
        );
    }
});

$("matrixMultiply").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const B = getMatrixFromInputs("B");

        const result = multiplyMatrices(A, B);

        renderMatrix(result, $("matrixResult"));

        showResult(
            $("matrixResult"),
            "Multiplicação de matrizes realizada.",
            "success"
        );
    } catch (error) {
        showResult(
            $("matrixResult"),
            error.message,
            "error"
        );
    }
});

$("determinant").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const det = determinant(A);

        showResult(
            $("matrixResult"),
            `det(A) = ${formatNumber(det)}`,
            "success"
        );
    } catch (error) {
        showResult(
            $("matrixResult"),
            error.message,
            "error"
        );
    }
});

$("transpose").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const result = transposeMatrix(A);

        renderMatrix(result, $("matrixResult"));

        showResult(
            $("matrixResult"),
            "Transposta calculada.",
            "success"
        );
    } catch (error) {
        showResult(
            $("matrixResult"),
            error.message,
            "error"
        );
    }
});

createMatrixInputs("matrixAContainer", 2, 2, "A");
createMatrixInputs("matrixBContainer", 2, 2, "B");