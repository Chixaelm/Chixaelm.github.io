
document.addEventListener('DOMContentLoaded', () => {
    const problemsContainer = document.getElementById('problems-container');
    const addProblemBtn = document.getElementById('add-problem-btn');
    const deleteProblemBtn = document.getElementById('delete-problem-btn');
    const printModeCheckbox = document.getElementById('print-mode-checkbox');
    let problemCount = 0;

    // Initialize with one problem
    addProblem();

    addProblemBtn.addEventListener('click', () => {
        addProblem();
        // Scroll to the new problem
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    deleteProblemBtn.addEventListener('click', () => {
        const cells = problemsContainer.querySelectorAll('.problem-cell');
        if (cells.length > 1) {
            const lastCell = cells[cells.length - 1];
            problemsContainer.removeChild(lastCell);
            problemCount--; // Note: IDs might not be sequential if we delete and add, but unique enough for this simple app
        } else {
            alert("You must have at least one problem.");
        }
    });

    printModeCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('print-mode');
        } else {
            document.body.classList.remove('print-mode');
        }
    });

    function addProblem() {
        problemCount++;
        const cellId = `problem-${problemCount}`;

        const cell = document.createElement('div');
        cell.className = 'problem-cell';
        cell.id = cellId;

        cell.innerHTML = `
            <div class="equation-inputs">
                <input type="checkbox" class="hide-inputs-checkbox" checked title="Toggle inputs visibility">
                <input type="number" class="number1" placeholder="First" min="0" max="99" value="0">
                <select class="operator">
                    <option value="+">+</option>
                    <option value="-">-</option>
                </select>
                <input type="number" class="number2" placeholder="Second" min="0" max="99" value="0">
                <span class="equals">=</span>
                <div class="result">0</div>
            </div>

            <div class="visualization-container">
                <div class="equation-display">
                    <div class="number-visualization number1-vis">
                        <div class="label-container">
                            <div class="checkbox-label">
                                <input type="checkbox" id="stack-checkbox1-${problemCount}" class="stack-checkbox">
                                <label for="stack-checkbox1-${problemCount}">Show Cubes</label>
                            </div>
                            <div class="checkbox-label">
                                <input type="checkbox" id="checkbox1-${problemCount}" class="number-checkbox">
                                <label for="checkbox1-${problemCount}">Show Number</label>
                            </div>
                            <h3>Fluent Foundations</h3>
                        </div>
                        <div class="stack-control-container">
                            <div class="cube-stack-container stack1"></div>
                        </div>
                    </div>
                    <div class="operator-display">+</div>
                    <div class="number-visualization number2-vis">
                        <div class="label-container">
                            <div class="checkbox-label">
                                <input type="checkbox" id="stack-checkbox2-${problemCount}" class="stack-checkbox">
                                <label for="stack-checkbox2-${problemCount}">Show Cubes</label>
                            </div>
                            <div class="checkbox-label">
                                <input type="checkbox" id="checkbox2-${problemCount}" class="number-checkbox">
                                <label for="checkbox2-${problemCount}">Show Number</label>
                            </div>
                            <h3>Fluent Foundations</h3>
                        </div>
                        <div class="stack-control-container">
                            <div class="cube-stack-container stack2"></div>
                        </div>
                    </div>
                    <div class="equals-display">=</div>
                    <div class="number-visualization result-vis">
                        <div class="label-container">
                            <div class="checkbox-label">
                                <input type="checkbox" id="stack-checkbox3-${problemCount}" class="stack-checkbox">
                                <label for="stack-checkbox3-${problemCount}">Show Cubes</label>
                            </div>
                            <div class="checkbox-label">
                                <input type="checkbox" id="checkbox3-${problemCount}" class="number-checkbox">
                                <label for="checkbox3-${problemCount}">Show Number</label>
                            </div>
                            <h3>Fluent Foundations</h3>
                        </div>
                        <div class="stack-control-container">
                            <div class="cube-stack-container stack3"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        problemsContainer.appendChild(cell);
        initializeCell(cell);
    }

    function initializeCell(cell) {
        const number1Input = cell.querySelector('.number1');
        const number2Input = cell.querySelector('.number2');
        const operatorSelect = cell.querySelector('.operator');
        const resultDisplay = cell.querySelector('.result');
        const operatorDisplay = cell.querySelector('.operator-display');

        const stack1Container = cell.querySelector('.stack1');
        const stack2Container = cell.querySelector('.stack2');
        const stack3Container = cell.querySelector('.stack3');

        const number1Label = cell.querySelector('.number1-vis h3');
        const number2Label = cell.querySelector('.number2-vis h3');
        const resultLabel = cell.querySelector('.result-vis h3');

        // Event listeners
        number1Input.addEventListener('input', updateEquation);
        number2Input.addEventListener('input', updateEquation);
        operatorSelect.addEventListener('change', updateEquation);

        // Initial update
        updateEquation();

        function updateEquation() {
            const num1 = parseInt(number1Input.value) || 0;
            const num2 = parseInt(number2Input.value) || 0;
            const operator = operatorSelect.value;

            // Clamp values
            const clampedNum1 = Math.max(0, Math.min(99, num1));
            const clampedNum2 = Math.max(0, Math.min(99, num2));

            if (num1 !== clampedNum1) number1Input.value = clampedNum1;
            if (num2 !== clampedNum2) number2Input.value = clampedNum2;

            // Calculate result
            let result;
            if (operator === '+') {
                result = clampedNum1 + clampedNum2;
            } else {
                result = Math.max(0, clampedNum1 - clampedNum2);
            }

            // Update displays
            resultDisplay.textContent = result;
            operatorDisplay.textContent = operator;

            number1Label.textContent = clampedNum1;
            number2Label.textContent = clampedNum2;
            resultLabel.textContent = result;

            // Render visualizations
            renderNumber(clampedNum1, stack1Container);
            renderNumber(clampedNum2, stack2Container);
            renderNumber(result, stack3Container);
        }
    }

    function renderNumber(number, container) {
        container.innerHTML = '';

        if (number === 0) return;

        const tens = Math.floor(number / 10);
        const ones = number % 10;

        // Create stacks of 10
        for (let t = 0; t < tens; t++) {
            const tensStack = document.createElement('div');
            tensStack.className = 'cube-stack';
            for (let i = 0; i < 10; i++) {
                tensStack.appendChild(createCube('yellow'));
            }
            container.appendChild(tensStack);
        }

        // Create ones stack
        if (ones > 0) {
            const onesStack = document.createElement('div');
            onesStack.className = 'cube-stack';
            for (let i = 0; i < ones; i++) {
                onesStack.appendChild(createCube('red'));
            }
            container.appendChild(onesStack);
        }
    }

    function createCube(color) {
        const cube = document.createElement('div');
        cube.className = `cube ${color}`;

        const faces = ['top', 'front', 'right', 'back', 'left'];
        faces.forEach(face => {
            const faceElement = document.createElement('div');
            faceElement.className = `cube-face ${face}`;
            cube.appendChild(faceElement);
        });

        return cube;
    }
});
