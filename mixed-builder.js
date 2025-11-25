
document.addEventListener('DOMContentLoaded', () => {
    const problemsContainer = document.getElementById('problems-container');
    const addProblemBtn = document.getElementById('add-problem-btn');
    const duplicateProblemBtn = document.getElementById('duplicate-problem-btn');
    const deleteProblemBtn = document.getElementById('delete-problem-btn');
    const printModeCheckbox = document.getElementById('print-mode-checkbox');
    const printBtn = document.getElementById('print-btn');
    const configJson = document.getElementById('config-json');
    const titleInput = document.getElementById('worksheet-title-input');
    const titleDisplay = document.getElementById('worksheet-title');
    const scaleInput = document.getElementById('scale-input');
    const spacingInput = document.getElementById('spacing-input');
    const cellHeightInput = document.getElementById('cell-height-input');
    let problemCount = 0;

    // Initialize with one problem
    addProblem();

    // Config Event Listener
    configJson.addEventListener('input', () => {
        loadConfig(configJson.value);
    });

    // Title Event Listener
    titleInput.addEventListener('input', () => {
        titleDisplay.textContent = titleInput.value || 'Mixed Problem Worksheet';
        generateConfig();
    });

    addProblemBtn.addEventListener('click', () => {
        addProblem();
        // Scroll to the new problem
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        generateConfig();
    });

    duplicateProblemBtn.addEventListener('click', () => {
        const cells = problemsContainer.querySelectorAll('.problem-cell');
        if (cells.length > 0) {
            const lastCell = cells[cells.length - 1];
            const id = lastCell.id.split('-')[1];

            const num1 = parseInt(lastCell.querySelector('.number1').value) || 0;
            const num2 = parseInt(lastCell.querySelector('.number2').value) || 0;
            const operator = lastCell.querySelector('.operator').value;
            const visualType = lastCell.dataset.visualType || 'cubes';

            const showVisual1 = lastCell.querySelector(`#stack-checkbox1-${id}`).checked;
            const showNumber1 = lastCell.querySelector(`#checkbox1-${id}`).checked;
            const showVisual2 = lastCell.querySelector(`#stack-checkbox2-${id}`).checked;
            const showNumber2 = lastCell.querySelector(`#checkbox2-${id}`).checked;
            const showVisual3 = lastCell.querySelector(`#stack-checkbox3-${id}`).checked;
            const showNumber3 = lastCell.querySelector(`#checkbox3-${id}`).checked;

            const state = {
                num1,
                num2,
                operator,
                visualType,
                showVisual1,
                showNumber1,
                showVisual2,
                showNumber2,
                showVisual3,
                showNumber3
            };

            addProblem(state);

            // Scroll to the new problem
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
            generateConfig();
        } else {
            // If no problems exist, just add a default one
            addProblem();
            generateConfig();
        }
    });

    deleteProblemBtn.addEventListener('click', () => {
        const cells = problemsContainer.querySelectorAll('.problem-cell');
        if (cells.length > 1) {
            const lastCell = cells[cells.length - 1];
            problemsContainer.removeChild(lastCell);
            problemCount--;
            updateProblemNumbers();
            generateConfig();
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

    // Scale input event listener
    scaleInput.addEventListener('input', (e) => {
        const scale = e.target.value / 100; // Convert percentage to decimal
        document.documentElement.style.setProperty('--print-scale', scale);
    });

    // Initialize scale to 100%
    document.documentElement.style.setProperty('--print-scale', 1.0);

    // Spacing input event listener
    spacingInput.addEventListener('input', (e) => {
        const spacing = e.target.value + 'px';
        document.documentElement.style.setProperty('--vertical-spacing', spacing);
    });

    // Initialize spacing
    document.documentElement.style.setProperty('--vertical-spacing', '10px');

    // Cell height input event listener
    cellHeightInput.addEventListener('input', (e) => {
        const height = e.target.value ? e.target.value + 'px' : 'auto';
        document.documentElement.style.setProperty('--cell-height', height);
    });

    // Initialize cell height to auto
    document.documentElement.style.setProperty('--cell-height', 'auto');

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

    function generateConfig() {
        const cells = problemsContainer.querySelectorAll('.problem-cell');
        const problems = [];

        cells.forEach(cell => {
            const num1 = parseInt(cell.querySelector('.number1').value) || 0;
            const num2 = parseInt(cell.querySelector('.number2').value) || 0;
            const operator = cell.querySelector('.operator').value;
            const visualType = cell.dataset.visualType || 'cubes';
            const id = cell.id.split('-')[1];

            const showVisual1 = cell.querySelector(`#stack-checkbox1-${id}`).checked;
            const showNumber1 = cell.querySelector(`#checkbox1-${id}`).checked;
            const showVisual2 = cell.querySelector(`#stack-checkbox2-${id}`).checked;
            const showNumber2 = cell.querySelector(`#checkbox2-${id}`).checked;
            const showVisual3 = cell.querySelector(`#stack-checkbox3-${id}`).checked;
            const showNumber3 = cell.querySelector(`#checkbox3-${id}`).checked;

            problems.push({
                num1,
                num2,
                operator,
                visualType,
                showVisual1,
                showNumber1,
                showVisual2,
                showNumber2,
                showVisual3,
                showNumber3
            });
        });

        const config = {
            title: titleInput.value || 'Mixed Problem Worksheet',
            problems: problems
        };

        configJson.value = JSON.stringify(config);
    }

    function loadConfig(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Handle both old array format and new object format
            let problems, title;
            if (Array.isArray(data)) {
                // Old format: just an array of problems
                problems = data;
                title = 'Mixed Problem Worksheet';
            } else if (data && typeof data === 'object' && Array.isArray(data.problems)) {
                // New format: object with title and problems
                problems = data.problems;
                title = data.title || 'Mixed Problem Worksheet';
            } else {
                return; // Invalid format
            }

            // Update title
            titleInput.value = title;
            titleDisplay.textContent = title;

            // Clear existing
            problemsContainer.innerHTML = '';
            problemCount = 0;

            // Rebuild
            problems.forEach(item => {
                addProblem(item);
            });

        } catch (e) {
            // Ignore invalid JSON while typing
        }
    }

    function addProblem(initialState = null) {
        problemCount++;
        const cellId = `problem-${problemCount}`;

        const cell = document.createElement('div');
        cell.className = 'problem-cell';
        cell.id = cellId;
        // Default visual type
        cell.dataset.visualType = initialState ? initialState.visualType : 'cubes';

        // Default visibility settings
        const showVisual1 = initialState && initialState.showVisual1 !== undefined ? initialState.showVisual1 : false; // Default unchecked based on HTML template? No, template has no checked attribute for stack-checkbox, wait, let me check template.
        // Actually, looking at template below:
        // <input type="checkbox" id="stack-checkbox1-${problemCount}" class="stack-checkbox"> -> Default is unchecked
        // <input type="checkbox" id="checkbox1-${problemCount}" class="number-checkbox"> -> Default is unchecked?
        // Wait, let me check the original template in previous turn.
        // In previous turn:
        // <input type="checkbox" id="stack-checkbox1-${problemCount}" class="stack-checkbox">
        // <input type="checkbox" id="checkbox1-${problemCount}" class="number-checkbox">
        // Neither has 'checked' attribute by default in the template string I see in previous turn (Step 236).
        // However, in the very first version (Step 158), they didn't have checked either.
        // Let's assume default is unchecked if not specified.

        // Actually, I should check if I want them checked by default. 
        // In equation-builder-multi.js (which this is based on), are they checked?
        // Let's look at the template I'm replacing.

        const sv1 = initialState && initialState.showVisual1 !== undefined ? initialState.showVisual1 : false;
        const sn1 = initialState && initialState.showNumber1 !== undefined ? initialState.showNumber1 : false;
        const sv2 = initialState && initialState.showVisual2 !== undefined ? initialState.showVisual2 : false;
        const sn2 = initialState && initialState.showNumber2 !== undefined ? initialState.showNumber2 : false;
        const sv3 = initialState && initialState.showVisual3 !== undefined ? initialState.showVisual3 : false;
        const sn3 = initialState && initialState.showNumber3 !== undefined ? initialState.showNumber3 : false;


        cell.innerHTML = `
            <div class="cell-controls">
                <div class="problem-number">${problemCount}</div>
                <button class="visual-toggle-btn ${cell.dataset.visualType === 'cubes' ? 'active' : ''}" data-type="cubes" title="Use Cubes">
                    🧊
                </button>
                <button class="visual-toggle-btn ${cell.dataset.visualType === 'ten-frames' ? 'active' : ''}" data-type="ten-frames" title="Use Ten Frames">
                    🔢
                </button>
            </div>
            <div class="problem-content">
                <div class="equation-inputs">
                    <input type="checkbox" class="hide-inputs-checkbox" checked title="Toggle inputs visibility">
                    <input type="number" class="number1" placeholder="First" min="0" max="99" value="${initialState ? initialState.num1 : 0}">
                    <select class="operator">
                        <option value="+" ${initialState && initialState.operator === '+' ? 'selected' : ''}>+</option>
                        <option value="-" ${initialState && initialState.operator === '-' ? 'selected' : ''}>-</option>
                        <option value="*" ${initialState && initialState.operator === '*' ? 'selected' : ''}>×</option>
                        <option value="/" ${initialState && initialState.operator === '/' ? 'selected' : ''}>÷</option>
                    </select>
                    <input type="number" class="number2" placeholder="Second" min="0" max="99" value="${initialState ? initialState.num2 : 0}">
                    <span class="equals">=</span>
                    <div class="result">0</div>
                </div>

                <div class="visualization-container">
                    <div class="equation-display">
                        <div class="number-visualization number1-vis">
                            <div class="label-container">
                                <div class="checkbox-label">
                                    <input type="checkbox" id="stack-checkbox1-${problemCount}" class="stack-checkbox" ${sv1 ? 'checked' : ''}>
                                    <label for="stack-checkbox1-${problemCount}">Show Cubes</label>
                                </div>
                                <div class="checkbox-label">
                                    <input type="checkbox" id="checkbox1-${problemCount}" class="number-checkbox" ${sn1 ? 'checked' : ''}>
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
                                    <input type="checkbox" id="stack-checkbox2-${problemCount}" class="stack-checkbox" ${sv2 ? 'checked' : ''}>
                                    <label for="stack-checkbox2-${problemCount}">Show Cubes</label>
                                </div>
                                <div class="checkbox-label">
                                    <input type="checkbox" id="checkbox2-${problemCount}" class="number-checkbox" ${sn2 ? 'checked' : ''}>
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
                                    <input type="checkbox" id="stack-checkbox3-${problemCount}" class="stack-checkbox" ${sv3 ? 'checked' : ''}>
                                    <label for="stack-checkbox3-${problemCount}">Show Cubes</label>
                                </div>
                                <div class="checkbox-label">
                                    <input type="checkbox" id="checkbox3-${problemCount}" class="number-checkbox" ${sn3 ? 'checked' : ''}>
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
            </div>
        `;

        problemsContainer.appendChild(cell);
        updateProblemNumbers();
        initializeCell(cell);

        // Update config after adding (unless loading from config to avoid recursion/double update)
        if (!initialState) {
            generateConfig();
        }
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

        const toggleBtns = cell.querySelectorAll('.visual-toggle-btn');

        // Visibility checkboxes
        const checkboxes = cell.querySelectorAll('input[type="checkbox"]:not(.hide-inputs-checkbox)');

        // Event listeners
        number1Input.addEventListener('input', () => { updateEquation(); generateConfig(); });
        number2Input.addEventListener('input', () => { updateEquation(); generateConfig(); });
        operatorSelect.addEventListener('change', () => { updateEquation(); generateConfig(); });

        checkboxes.forEach(cb => {
            cb.addEventListener('change', generateConfig);
        });

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update state
                const type = btn.dataset.type;
                cell.dataset.visualType = type;

                // Update UI
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Re-render
                updateEquation();
                generateConfig();
            });
        });

        // Initial update
        updateEquation();

        function updateEquation() {
            let num1 = parseInt(number1Input.value) || 0;
            let num2 = parseInt(number2Input.value) || 0;
            const operator = operatorSelect.value;
            const visualType = cell.dataset.visualType;

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
                renderNumber(clampedNum1, stack1Container, { visualType: visualType, color: 'red' });
                renderNumber(clampedNum2, stack2Container, { horizontalRow: true, visualType: visualType, color: 'yellow' });
                renderNumber(result, stack3Container, { stackHeight: clampedNum1, stackCount: clampedNum2, visualType: visualType, color: 'green' });
            } else if (operator === '/') {
                renderNumber(clampedNum1, stack1Container, { visualType: visualType, color: 'red' });
                renderNumber(clampedNum2, stack2Container, { visualType: visualType, color: 'yellow' });
                renderNumber(result, stack3Container, { visualType: visualType, color: 'green' });
            } else {
                // Add/Sub
                renderNumber(clampedNum1, stack1Container, { visualType: visualType, color: 'red' });
                renderNumber(clampedNum2, stack2Container, { visualType: visualType, color: 'yellow' });
                renderNumber(result, stack3Container, { visualType: visualType, color: 'green' });
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
        wrapper.style.display = 'grid';
        wrapper.style.gridTemplateColumns = 'repeat(2, max-content)';
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
