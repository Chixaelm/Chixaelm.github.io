
document.addEventListener('DOMContentLoaded', () => {
    const problemsContainer = document.getElementById('problems-container');
    const addProblemBtn = document.getElementById('add-problem-btn');
    const deleteProblemBtn = document.getElementById('delete-problem-btn');
    const printModeCheckbox = document.getElementById('print-mode-checkbox');
    const printBtn = document.getElementById('print-btn');
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
            problemCount--;
            updateProblemNumbers();
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

    printBtn.addEventListener('click', () => {
        window.print();
    });

    function updateProblemNumbers() {
        const cells = problemsContainer.querySelectorAll('.problem-cell');
        cells.forEach((cell, index) => {
            const numberEl = cell.querySelector('.problem-number');
            if (numberEl) {
                numberEl.textContent = index + 1;
            }
        });
    }

    function addProblem() {
        problemCount++;
        const cellId = `problem-${problemCount}`;

        const cell = document.createElement('div');
        cell.className = 'problem-cell';
        cell.id = cellId;

        cell.innerHTML = `
            <div class="problem-number">${problemCount}</div>
            <div class="equation-inputs">
                <input type="checkbox" class="hide-inputs-checkbox" checked title="Toggle inputs visibility">
                <input type="number" class="number1" placeholder="First" min="0" max="99" value="0">
                <select class="operator">
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">×</option>
                    <option value="/">÷</option>
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
                            <select class="visual-type-select" id="visual-type1-${problemCount}">
                                <option value="cubes">Cubes</option>
                                <option value="ten-frames">Ten Frames</option>
                            </select>
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
                            <select class="visual-type-select" id="visual-type2-${problemCount}">
                                <option value="cubes">Cubes</option>
                                <option value="ten-frames">Ten Frames</option>
                            </select>
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
                            <select class="visual-type-select" id="visual-type3-${problemCount}">
                                <option value="cubes">Cubes</option>
                                <option value="ten-frames">Ten Frames</option>
                            </select>
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
        updateProblemNumbers();
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

        const visualType1 = cell.querySelector(`#visual-type1-${cell.id.split('-')[1]}`);
        const visualType2 = cell.querySelector(`#visual-type2-${cell.id.split('-')[1]}`);
        const visualType3 = cell.querySelector(`#visual-type3-${cell.id.split('-')[1]}`);

        // Event listeners
        number1Input.addEventListener('input', updateEquation);
        number2Input.addEventListener('input', updateEquation);
        operatorSelect.addEventListener('change', updateEquation);
        visualType1.addEventListener('change', updateEquation);
        visualType2.addEventListener('change', updateEquation);
        visualType3.addEventListener('change', updateEquation);

        // Initial update
        updateEquation();

        function updateEquation() {
            let num1 = parseInt(number1Input.value) || 0;
            let num2 = parseInt(number2Input.value) || 0;
            const operator = operatorSelect.value;

            // Clamp values based on operator
            let clampedNum1 = num1;
            let clampedNum2 = num2;

            if (operator === '*') {
                // Multiplication limits (1-10)
                clampedNum1 = Math.max(1, Math.min(10, num1));
                clampedNum2 = Math.max(1, Math.min(10, num2));
                if (num1 === 0) clampedNum1 = 1; // Default to 1 if 0
                if (num2 === 0) clampedNum2 = 1;
            } else if (operator === '/') {
                // Division limits
                clampedNum1 = Math.max(0, Math.min(99, num1));
                clampedNum2 = Math.max(1, Math.min(99, num2)); // Divisor cannot be 0
            } else {
                // Add/Sub limits (0-99)
                clampedNum1 = Math.max(0, Math.min(99, num1));
                clampedNum2 = Math.max(0, Math.min(99, num2));
            }

            if (num1 !== clampedNum1) number1Input.value = clampedNum1;
            if (num2 !== clampedNum2) number2Input.value = clampedNum2;

            let result;
            let displayOperator = operator;

            if (operator === '+') {
                result = clampedNum1 + clampedNum2;
            } else if (operator === '-') {
                result = Math.max(0, clampedNum1 - clampedNum2);
            } else if (operator === '*') {
                result = clampedNum1 * clampedNum2;
                displayOperator = '×';
            } else if (operator === '/') {
                result = Math.floor(clampedNum1 / clampedNum2);
                displayOperator = '÷';
            }

            // Update displays
            resultDisplay.textContent = result;
            operatorDisplay.textContent = displayOperator;

            number1Label.textContent = clampedNum1;
            number2Label.textContent = clampedNum2;
            resultLabel.textContent = result;

            // Render visualizations
            if (operator === '*') {
                renderNumber(clampedNum1, stack1Container, { visualType: visualType1.value, color: 'red' });
                renderNumber(clampedNum2, stack2Container, { horizontalRow: true, visualType: visualType2.value, color: 'yellow' });
                renderNumber(result, stack3Container, { stackHeight: clampedNum1, stackCount: clampedNum2, visualType: visualType3.value, color: 'green' });
            } else if (operator === '/') {
                renderNumber(clampedNum1, stack1Container, { visualType: visualType1.value, color: 'red' });
                renderNumber(clampedNum2, stack2Container, { visualType: visualType2.value, color: 'yellow' });
                renderNumber(result, stack3Container, { visualType: visualType3.value, color: 'green' });
            } else {
                // Add/Sub
                renderNumber(clampedNum1, stack1Container, { visualType: visualType1.value, color: 'red' });
                renderNumber(clampedNum2, stack2Container, { visualType: visualType2.value, color: 'yellow' });
                renderNumber(result, stack3Container, { visualType: visualType3.value, color: 'green' });
            }
        }
    }

    function renderNumber(number, container, options = {}) {
        const { horizontalRow = false, stackHeight, stackCount, visualType = 'cubes', color = 'red' } = options;
        container.innerHTML = '';

        if (visualType === 'ten-frames') {
            renderTenFrames(number, container, color);
            return;
        }

        // Cubes Logic
        if (horizontalRow) {
            const row = document.createElement('div');
            row.className = 'cube-row';
            for (let i = 0; i < number; i++) {
                const cube = createCube('red');
                row.appendChild(cube);
            }
            container.appendChild(row);
            return;
        }

        if (stackHeight && stackCount) {
            for (let c = 0; c < stackCount; c++) {
                const stack = document.createElement('div');
                stack.className = 'cube-stack';
                for (let h = 0; h < stackHeight; h++) {
                    const cube = createCube('yellow');
                    stack.appendChild(cube);
                }
                container.appendChild(stack);
            }
            return;
        }

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
                const cube = createCube('red');
                onesStack.appendChild(cube);
            }
            container.appendChild(onesStack);
        }
    }

    function renderTenFrames(number, container, color) {
        if (number === 0) return;

        const fullFrames = Math.floor(number / 10);
        const remainder = number % 10;

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexWrap = 'wrap';
        wrapper.style.gap = '1rem';
        wrapper.style.justifyContent = 'center';

        // Render full frames
        for (let i = 0; i < fullFrames; i++) {
            const frame = createTenFrame(10, `ten-frame-dot-${color}`);
            wrapper.appendChild(frame);
        }

        // Render remainder frame
        if (remainder > 0) {
            const frame = createTenFrame(remainder, `ten-frame-dot-${color}`);
            wrapper.appendChild(frame);
        }

        container.appendChild(wrapper);
    }

    function createTenFrame(value, colorClass) {
        const frame = document.createElement('div');
        frame.className = 'ten-frame';
        // Ensure ten-frame style is consistent
        frame.style.display = 'grid';
        frame.style.gridTemplateColumns = 'repeat(5, 20px)'; // Smaller dots for compact view
        frame.style.gridTemplateRows = 'repeat(2, 20px)';
        frame.style.gap = '4px';
        frame.style.border = '2px solid #333';
        frame.style.padding = '4px';
        frame.style.backgroundColor = '#fff';
        frame.style.borderRadius = '4px';

        for (let i = 0; i < 10; i++) {
            const cell = document.createElement('div');
            cell.className = 'ten-frame-cell';
            cell.style.width = '20px';
            cell.style.height = '20px';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            // cell.style.border = '1px solid #eee'; // Optional grid lines

            if (i < value) {
                const dot = document.createElement('span');
                dot.className = colorClass;
                // Inline styles for dot to ensure it works without external CSS dependency if needed
                dot.style.width = '16px';
                dot.style.height = '16px';
                dot.style.borderRadius = '50%';
                dot.style.display = 'block';

                if (colorClass.includes('red')) dot.style.backgroundColor = '#ff6666';
                else if (colorClass.includes('yellow')) dot.style.backgroundColor = '#ffd700';
                else if (colorClass.includes('green')) dot.style.backgroundColor = '#4caf50';

                cell.appendChild(dot);
            }
            frame.appendChild(cell);
        }

        return frame;
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
