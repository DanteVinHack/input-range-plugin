const element = (tag, classes) => {
  const element = document.createElement(tag);

  if (classes) {
    element.classList.add(...classes);
  }

  return element;
}

const noop = () => {};

export function sliderNumber(selector, options) {
  let number, preview;
  const input = document.querySelector(selector);
  const slider = element('div', ['slider']);
  const sliderDot = element('span', ['slider-dot']);
  const sliderFull = element('span', ['slider-fill']);

  const onUpdate = options.onUpdate ?? noop;

  if (options.max) {
    input.setAttribute('max', options.max);
  } else {
    options.max = 100;
    input.setAttribute('max', options.max);
  }

  if (options.min) {
    input.setAttribute('min', options.min);
  } else {
    options.min = 0;
    input.setAttribute('min', options.min)
  }

  if (options.preview) {
    preview = element('div', ['preview'], 0);
  }

  const mousedownHandler = event => {
    event.preventDefault();
    const { target } = event;
    const shiftX = Math.abs(event.clientX - sliderDot.getBoundingClientRect().left);

    const dragstart = event => {
      const x = event.pageX;

      let left = x - slider.offsetLeft - shiftX;

      if ((event.pageX - slider.offsetLeft) <= 0) {
        left = 0;
      }

      if ((event.pageX - slider.offsetLeft) >= slider.offsetWidth) {
        left = slider.clientWidth - sliderDot.offsetWidth;
      }

      sliderDot.style.left = left + 'px';
      sliderFull.style.width = left + sliderDot.offsetWidth + 'px';
      number = +(parseInt(sliderDot.style.left) / slider.offsetWidth).toFixed(2) + .06;
      const roundedResult = Math.round(number * options.max) < options.min ? options.min : Math.round(number * options.max);

      if (preview) {
        preview.innerText = roundedResult;
      }

      onUpdate(roundedResult)
    }

    document.addEventListener('mousemove', dragstart);
    document.addEventListener('mouseup', event => {
      document.removeEventListener('mousemove', dragstart);
      document.onmouseup = null;
    })

  };

  sliderDot.addEventListener('mousedown', mousedownHandler);

  input.insertAdjacentElement('afterend', slider);
  slider.insertAdjacentElement('beforeend', sliderDot);
  slider.insertAdjacentElement('beforeend', sliderFull);
  slider.insertAdjacentElement('afterend', preview);
}
