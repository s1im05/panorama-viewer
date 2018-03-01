import './css/main.scss';
import './polyfills';
import {Panorama} from './panorama';
import {PANORAMA_TILES_ORDER} from './const';

(() => {
    document.getElementById('preloader').remove();

    const panorama = new Panorama('container',
        PANORAMA_TILES_ORDER.map(pos => `assets/tile_${pos}_0_0_0.jpg`));

    document.getElementById('btn_inc').addEventListener('click', (event) => {
        panorama.increaseFocalLength();
    });

    document.getElementById('btn_dec').addEventListener('click', (event) => {
        panorama.decreaseFocalLength();
    });

    document.getElementById('chb_animate').addEventListener('change', (event) => {
        panorama.isAnimated = event.target['checked'];
    });

    document.getElementById('btn_fullscreen').addEventListener('click', (event) => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen();
        } else if (document.documentElement['mozRequestFullScreen']) {
            document.documentElement['mozRequestFullScreen']();
        }
    });

    document.getElementById('btn_fullscreen_exit').addEventListener('click', (event) => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document['mozExitFullscreen']) {
            document['mozExitFullscreen']();
        }
    });

    window.addEventListener('resize', () => {
        panorama.resizeScene();

        let isFullScreen;
        if (document.webkitIsFullScreen !== undefined) {
            isFullScreen = document.webkitIsFullScreen;
        } else if (document['mozFullScreen'] !== undefined) {
            isFullScreen = document['mozFullScreen'];
        } else if (document['fullscreen'] !== undefined) {
            isFullScreen = document['fullscreen'];
        }
        if (isFullScreen !== undefined) {
            if (isFullScreen) {
                document.getElementById('btn_fullscreen').classList.add('hide');
                document.getElementById('btn_fullscreen_exit').classList.remove('hide');
            } else {
                document.getElementById('btn_fullscreen').classList.remove('hide');
                document.getElementById('btn_fullscreen_exit').classList.add('hide');
            }
        }
    });

    document.getElementById('panel').style.display = 'block';
})();
