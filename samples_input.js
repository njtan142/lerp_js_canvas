let samples = 0;


const slider = document.getElementById('slider');
samples = slider.value;

slider.addEventListener('input', () => {
    samples = slider.value * Math.sqrt(slider_m.value);
    samples = Math.floor(samples)
});

const slider_m = document.getElementById('slider2');
samples = slider.value * slider_m.value;
slider_m.addEventListener('input', () => {
    samples = slider.value * Math.sqrt(slider_m.value);
    samples = Math.floor(samples)
});