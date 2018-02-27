import './css/main.scss';
import './polyfills';
import {Panorama} from './panorama';

(() => {
    const panorama = new Panorama('container');

    document.getElementById('btn_inc').addEventListener('click', (event) => {
        panorama.increaseFocalLength();
    });

    document.getElementById('btn_dec').addEventListener('click', (event) => {
        panorama.decreaseFocalLength();
    });

    document.getElementById('chb_animate').addEventListener('change', (event) => {
        panorama.isAnimated = event.target['checked'];
    });

    window.addEventListener('resize', panorama.onResize.bind(panorama));
})();
