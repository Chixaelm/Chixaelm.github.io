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

function updateEquation() {
    const num1 = parseInt(number1Input.value) || 0;
    let num2 = parseInt(number2Input.value) || 1;

    const clampedNum1 = Math.max(0, Math.min(99, num1));
    let clampedNum2 = Math.max(1, Math.min(99, num2));

    if (num1 !== clampedNum1) number1Input.value = clampedNum1;
    if (num2 !== clampedNum2) {
        number2Input.value = clampedNum2;
    }

    const result = Math.floor(clampedNum1 / clampedNum2);

    resultDisplay.textContent = result;
    operatorDisplay.textContent = '÷';

    number1Label.textContent = clampedNum1;
    number2Label.textContent = clampedNum2;
    resultLabel.textContent = result;

    renderNumber(clampedNum1, stack1Container);
    renderNumber(clampedNum2, stack2Container);
    renderNumber(result, stack3Container);
}

function renderNumber(number, container) {
    container.innerHTML = '';

    if (number === 0) {
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

