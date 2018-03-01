# Cube Panorama Viewer

Simple skybox viewer, based on three.js

Demo page: https://s1im05.github.io/panorama-viewer/

## Install and build

    npm install
    npm build

## Usage

Script:

    const panorama = new Panorama('containerElementId', [
        'path/to/tile_front.jpg',
        'path/to/tile_back.jpg',
        'path/to/tile_top.jpg',
        'path/to/tile_bottom.jpg',
        'path/to/tile_left.jpg',
        'path/to/tile_right.jpg'
    ]);

Html:

    <div id="containerElementId" style="width: 800px; height: 600px;"></div>

## Interface

### Methods

1. **resizeScene**: void

    Call it after container resize to fit scene dimensions
    
        window.addEventListener('resize', () => {
            panorama.resizeScene();
        });
    
2. **increaseFocalLength**: number
    
    Increase panorama camera's focal length    
    Returns: new focal length
    
        document.getElementById('btn_inc').addEventListener('click', (event) => {
            panorama.increaseFocalLength();
        });
    
3. **decreaseFocalLength**: number
    
    Decrease panorama camera's focal length    
    Returns: new focal length
    
        document.getElementById('btn_dec').addEventListener('click', (event) => {
            panorama.decreaseFocalLength();
        });

### Properties

1. **images**: string[]
    
    Array of paths to tile images. Order: front, back, top, bottom, left, right
    
        const panorama = new Panorama('containerElementId', [...]);
        
        ...
        // load and display new tiles
        panorama.images = [
                'tile01.jpg', 'tile02.jpg', 'tile03.jpg', 
                'tile04.jpg', 'tile05.jpg', 'tile06.jpg'
            ];

2. **isAnimated**: boolean

    Set true/false to start/stop simple panorama animation
    
3. **containerEl**: HTMLElement

    Container element for panorama
    
4. **camera**: THREE.PerspectiveCamera

    Three.js camera

5. **renderer**: THREE.WebGLRenderer

    Three.js WebGL renderer
    
6. **scene**: THREE.Scene

    Three.js main scene
    
7. **cameraTarget**: THREE.Vector3

    Target vector for panorama camera
