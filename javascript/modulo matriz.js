//Calculadora de matrizes

// Formata números
function formatNumber(value) {
    return Number(value.toFixed(6)).toString();
}

// Exibe mensagens sem apagar os resultados
function showResult(container, message, type = "success") {
    let messageElement = container.querySelector(".result-message");

    if (!messageElement) {
        messageElement = document.createElement("p");
        messageElement.className = "result-message";
        container.appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `result-message ${type}`;
}

// Constrói os campos da matriz
function createMatrixInputs(containerId, rows, cols, matrixName) {
    const container = $(containerId);
    container.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = `Matriz ${matrixName}`;
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

    container.appendChild(title);
    container.appendChild(matrix);
}

// Obtém os valores da matriz
function getMatrixFromInputs(matrixName) {
    const inputs = document.querySelectorAll(
        `.matrix-input[data-matrix="${matrixName}"]`
    );

    if (inputs.length === 0) {
        throw new Error(`Matriz ${matrixName} não foi criada.`);
    }

    const rows = Math.max(
        ...Array.from(inputs).map(input => Number(input.dataset.row))
    ) + 1;

    const cols = Math.max(
        ...Array.from(inputs).map(input => Number(input.dataset.col))
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
                    `Valor inválido na matriz ${matrixName}.`
                );
            }

            matrix[i][j] = value;
        }
    }

    return matrix;
}

// Exibe uma matriz na tela
function renderMatrix(matrix, container) {
    let result = container.querySelector(".matrix-result");

    if (!result) {
        result = document.createElement("div");
        result.className = "matrix-result";
        container.appendChild(result);
    }

    result.innerHTML = "";

    result.style.display = "grid";
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
}

// Limpa a área de resultados
function clearMatrixResult() {
    $("matrixResult").innerHTML = "";
}

// ADIÇÃO DE MATRIZES
function addMatrices(A, B) {
    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {
        throw new Error(
            "As matrizes precisam ter as mesmas dimensões."
        );
    }

    return A.map((row, i) =>
        row.map((value, j) => value + B[i][j])
    );
}

// MULTIPLICAÇÃO POR ESCALAR
function multiplyMatrixByScalar(matrix, scalar) {
    return matrix.map(row =>
        row.map(value => value * scalar)
    );
}

// MULTIPLICAÇÃO DE MATRIZES
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

// MATRIZ TRANSPOSTA
function transposeMatrix(matrix) {
    return matrix[0].map((_, j) =>
        matrix.map(row => row[j])
    );
}

// DETERMINANTE
function determinant(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error(
            "O determinante só pode ser calculado para matrizes quadradas."
        );
    }

    const n = matrix.length;

    if (n === 1) return matrix[0][0];

    if (n === 2) {
        return (
            matrix[0][0] * matrix[1][1] -
            matrix[0][1] * matrix[1][0]
        );
    }

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

// FUNÇÃO CENTRAL PARA MOSTRAR MATRIZES
function displayMatrixResult(matrix, message) {
    const container = $("matrixResult");

    container.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = message;

    container.appendChild(title);

    renderMatrix(matrix, container);
}

// CRIAR MATRIZ A
$("createMatrixA").addEventListener("click", () => {
    const rows = Number($("matrixRowsA").value);
    const cols = Number($("matrixColsA").value);

    if (
        !Number.isInteger(rows) ||
        !Number.isInteger(cols) ||
        rows < 1 || cols < 1 ||
        rows > 8 || cols > 8
    ) {
        showResult(
            $("matrixResult"),
            "As dimensões devem estar entre 1 e 8.",
            "error"
        );
        return;
    }

    createMatrixInputs("matrixAContainer", rows, cols, "A");
});

// CRIAR MATRIZ B
$("createMatrixB").addEventListener("click", () => {
    const rows = Number($("matrixRowsB").value);
    const cols = Number($("matrixColsB").value);

    if (
        !Number.isInteger(rows) ||
        !Number.isInteger(cols) ||
        rows < 1 || cols < 1 ||
        rows > 8 || cols > 8
    ) {
        showResult(
            $("matrixResult"),
            "As dimensões devem estar entre 1 e 8.",
            "error"
        );
        return;
    }

    createMatrixInputs("matrixBContainer", rows, cols, "B");
});

// SOMA DE MATRIZES
$("matrixAdd").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const B = getMatrixFromInputs("B");

        const result = addMatrices(A, B);

        displayMatrixResult(result, "Resultado da soma A + B");

    } catch (error) {
        showResult($("matrixResult"), error.message, "error");
    }
});

// MULTIPLICAÇÃO POR ESCALAR
$("scalarMultiply").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const scalar = Number($("scalar").value);

        if ($("scalar").value.trim() === "" ||
            !Number.isFinite(scalar)) {
            throw new Error("Escalar inválido.");
        }

        const result = multiplyMatrixByScalar(A, scalar);

        displayMatrixResult(result, "Resultado da multiplicação por escalar");

    } catch (error) {
        showResult($("matrixResult"), error.message, "error");
    }
});

// MULTIPLICAÇÃO DE MATRIZES
$("matrixMultiply").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const B = getMatrixFromInputs("B");

        const result = multiplyMatrices(A, B);

        displayMatrixResult(result, "Resultado da multiplicação A × B");

    } catch (error) {
        showResult($("matrixResult"), error.message, "error");
    }
});

// DETERMINANTE
$("determinant").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");
        const det = determinant(A);

        const container = $("matrixResult");
        container.innerHTML = "";

        const result = document.createElement("h3");
        result.textContent = `det(A) = ${formatNumber(det)}`;

        container.appendChild(result);

    } catch (error) {
        showResult($("matrixResult"), error.message, "error");
    }
});

// TRANSPOSTA
$("transpose").addEventListener("click", () => {
    try {
        const A = getMatrixFromInputs("A");

        const result = transposeMatrix(A);

        displayMatrixResult(result, "Matriz transposta de A");

    } catch (error) {
        showResult($("matrixResult"), error.message, "error");
    }
});

// CRIAÇÃO INICIAL DAS MATRIZES
createMatrixInputs("matrixAContainer", 2, 2, "A");
createMatrixInputs("matrixBContainer", 2, 2, "B");