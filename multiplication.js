const number1Input = document.getElementById('number1');
const number2Input = document.getElementById('number2');
const resultDisplay = document.getElementById('result');
const operatorDisplay = document.getElementById('operator-display');
const stack1Container = document.getElementById('stack1');
const stack2Container = document.getElementById('stack2');
const stack3Container = document.getElementById('stack3');
const number1Label = document.querySelector('#number1-vis h3');
const number2Label = document.querySelector('#number2-vis h3');
const resultLabel = document.querySelector('#result-vis h3');

updateEquation();

number1Input.addEventListener('input', updateEquation);
number2Input.addEventListener('input', updateEquation);

function clampToRange(value) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return 1;
    return Math.max(1, Math.min(10, parsed));
}

function updateEquation() {
    const clampedNum1 = clampToRange(number1Input.value);
    const clampedNum2 = clampToRange(number2Input.value);

    if (parseInt(number1Input.value, 10) !== clampedNum1) number1Input.value = clampedNum1;
    if (parseInt(number2Input.value, 10) !== clampedNum2) number2Input.value = clampedNum2;

    const result = clampedNum1 * clampedNum2;

    resultDisplay.textContent = result;
    operatorDisplay.textContent = '×';

    number1Label.textContent = clampedNum1;
    number2Label.textContent = clampedNum2;
    resultLabel.textContent = result;

    renderNumber(clampedNum1, stack1Container);
    renderNumber(clampedNum2, stack2Container, { horizontalRow: true });
    renderNumber(result, stack3Container, { stackHeight: clampedNum1, stackCount: clampedNum2 });
}

function renderNumber(number, container, options = {}) {
    const { horizontalRow = false, stackHeight, stackCount } = options;
    container.innerHTML = '';

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

    const tens = Math.floor(number / 10);
    const ones = number % 10;

    for (let t = 0; t < tens; t++) {
        const tensStack = document.createElement('div');
        tensStack.className = 'cube-stack';
        for (let i = 0; i < 10; i++) {
            const cube = createCube('yellow');
            tensStack.appendChild(cube);
        }
        container.appendChild(tensStack);
    }

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

