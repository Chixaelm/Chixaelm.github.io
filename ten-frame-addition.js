const tfNumber1 = document.getElementById('tf-number1');
const tfNumber2 = document.getElementById('tf-number2');
const tfResult = document.getElementById('tf-result');
const tenFrameGrid = document.getElementById('ten-frame-grid');

updateTenFrames();

tfNumber1.addEventListener('input', updateTenFrames);
tfNumber2.addEventListener('input', updateTenFrames);

function clampTen(value) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return 0;
    return Math.max(0, Math.min(10, parsed));
}

function updateTenFrames() {
    const value1 = clampTen(tfNumber1.value);
    const value2 = clampTen(tfNumber2.value);

    if (parseInt(tfNumber1.value, 10) !== value1) tfNumber1.value = value1;
    if (parseInt(tfNumber2.value, 10) !== value2) tfNumber2.value = value2;

    const total = value1 + value2;
    tfResult.textContent = total;

    tenFrameGrid.innerHTML = '';

    const sections = [
        {
            key: 'first',
            value: value1,
            frameElement: createTenFrame(Math.min(value1, 10), 'ten-frame-dot-red', 10)
        },
        {
            key: 'second',
            value: value2,
            frameElement: createTenFrame(Math.min(value2, 10), 'ten-frame-dot-yellow', 10)
        }
    ];

    const totalDots = [];
    for (let i = 0; i < Math.min(value1, 10); i++) totalDots.push('ten-frame-dot-red');
    for (let i = 0; i < Math.min(value2, 10); i++) {
        if (totalDots.length < 20) totalDots.push('ten-frame-dot-yellow');
    }

    const totalPair = document.createElement('div');
    totalPair.className = 'ten-frame-total-pair';
    totalPair.appendChild(createTotalFrame(totalDots, 0));
    totalPair.appendChild(createTotalFrame(totalDots, 10));

    sections.push({
        key: 'total',
        value: total,
        frameElement: totalPair
    });

    sections.forEach(section => {
        tenFrameGrid.appendChild(createSection(section));
    });
}

function createTenFrame(value, colorClass, maxDots) {
    const frame = document.createElement('div');
    frame.className = 'ten-frame';

    for (let i = 0; i < maxDots; i++) {
        const cell = document.createElement('div');
        cell.className = 'ten-frame-cell';
        if (i < value) {
            const dot = document.createElement('span');
            dot.className = colorClass;
            cell.appendChild(dot);
        }
        frame.appendChild(cell);
    }

    return frame;
}

function createTotalFrame(sequence, startIndex) {
    const frame = document.createElement('div');
    frame.className = 'ten-frame';

    for (let i = 0; i < 10; i++) {
        const cell = document.createElement('div');
        cell.className = 'ten-frame-cell';
        const colorClass = sequence[startIndex + i];
        if (colorClass) {
            const dot = document.createElement('span');
            dot.className = colorClass;
            cell.appendChild(dot);
        }
        frame.appendChild(cell);
    }

    return frame;
}

function createSection({ key, value, frameElement }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ten-frame-wrapper';

    const controls = document.createElement('div');
    controls.className = 'ten-frame-controls';

    const numberToggle = createToggle('Hide number', true);
    const frameToggle = createToggle('Hide ten frame', true);

    controls.appendChild(numberToggle.label);
    controls.appendChild(frameToggle.label);

    const valueDisplay = document.createElement('div');
    valueDisplay.className = 'ten-frame-value';
    valueDisplay.textContent = value;

    const frameContainer = document.createElement('div');
    frameContainer.className = 'ten-frame-frame';
    frameContainer.appendChild(frameElement);

    const updateValueClass = () => {
        valueDisplay.classList.toggle('is-white', numberToggle.input.checked);
    };
    const updateDotsClass = () => {
        frameContainer.classList.toggle('dots-hidden', frameToggle.input.checked);
    };

    numberToggle.input.addEventListener('change', updateValueClass);
    frameToggle.input.addEventListener('change', updateDotsClass);

    updateValueClass();
    updateDotsClass();

    wrapper.appendChild(controls);
    wrapper.appendChild(valueDisplay);
    wrapper.appendChild(frameContainer);

    return wrapper;
}

function createToggle(text, checked = false) {
    const label = document.createElement('label');
    label.className = 'ten-frame-toggle';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'ten-frame-checkbox';
    input.checked = checked;

    label.appendChild(input);
    label.appendChild(document.createTextNode(text));

    return { label, input };
}

