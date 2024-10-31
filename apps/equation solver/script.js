document.addEventListener('DOMContentLoaded', () => {
    const equationElement = document.getElementById('equation');
    const operationResultElement = document.getElementById('operation-renderer');
    const operationElement = document.getElementById('operation');
    const applyButton = document.getElementById('apply');

    let lhs = "(1/2)x+1";
    let rhs = "sqrt((5/4)x^2-5)";

    let previous_operation_result = "";
    let operation_type = "*";
    operationResultElement.textContent = `\\(\\)`;

    function displayEquation() {
        equationElement.textContent = `\\(${math.parse(lhs).toTex()} = ${math.parse(rhs).toTex()}\\)`;
        MathJax.typesetPromise();

    }

    // Periodically check content of operation element and update operation result
    setInterval(() => {
        let operation = operationElement.value;
        if (operation == previous_operation_result) {
            return;
        }
        previous_operation_result = operation;

        // Set operation type based upon the first character of the operation

        if (['+', '-', '*', '/', '^'].includes(operation[0])) {
            operation_type = operation[0];
            operation = operation.slice(1);
        }
        else {
            operation_type = "*";
        }

        try {
            const parsedOperation = nerdamer.expand(operation).toString();
            const simplifiedOperation = math.parse(parsedOperation).toTex();
            operationResultElement.textContent = `\\(${simplifiedOperation}\\)`;
            MathJax.typesetPromise();
        } catch (error) {
            console.error('Error evaluating operation:', error);
        }
    }, 100);

    applyButton.addEventListener('click', () => {

        try {
            let operation = operationElement.value;

            if (['+', '-', '*', '/', '^'].includes(operation[0])) {
                operation = operation.slice(1);
            }

            let new_rhs, new_lhs;

            new_rhs = `(${rhs})${operation_type}(${operation})`;
            new_lhs = `(${lhs})${operation_type}(${operation})`;

            rhs = nerdamer.expand(new_rhs).toString();
            lhs = nerdamer.expand(new_lhs).toString();

            displayEquation();
        } catch (error) {
            console.error('Error applying operation:', error);
        }

        operationElement.value = "";

    });
    operationElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            applyButton.click();
            
            // Prevent the default action
            event.preventDefault();
        }
    });

    displayEquation();
});