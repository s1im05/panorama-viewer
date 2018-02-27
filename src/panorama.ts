import * as THREE from 'three';
import {Vector3} from 'three';
import {CAMERA_DEFAULT_FOV, CAMERA_MAX_FOCAL_LENGTH, CAMERA_MIN_FOCAL_LENGTH, PANORAMA_RADIUS} from './const';


export class Panorama {

    public containerEl: HTMLElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public cameraTarget: Vector3;

    public coordinates: PanoramaCoordinates;
    public lastState: PanoramaState = {
        animated: false,
        onMouseDownLat: 0,
        onMouseDownLon: 0,
        onMouseDownMouseX: 0,
        onMouseDownMouseY: 0
    };
    public isAnimated = false;

    private _focalLength: number;
    private _userInteract = false;


    constructor(public containerId: string) {
        this.init();
        this.update();
    }

    init() {
        this.containerEl = document.getElementById(this.containerId);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_DEFAULT_FOV,
            this.containerEl.clientWidth / this.containerEl.clientHeight, 1, 1100);
        this._focalLength = +this.camera.getFocalLength();
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.containerEl.clientWidth, this.containerEl.clientHeight);
        this.containerEl.appendChild(this.renderer.domElement);

        this.coordinates = {lat: 0, lon: 0, phi: 0, theta: 0};

        this.buildSkyBox();
        this.addEventHandlers();
    }

    update() {
        if (this.isAnimated) {
            this.animate();
        }

        this.updateCameraTarget();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.update());
    }

    animate() {
        this.coordinates.lon += 0.1;
    }

    updateCameraTarget() {
        this.coordinates.lat = Math.max(-85, Math.min(85, this.coordinates.lat));
        this.coordinates.phi = THREE.Math.degToRad(90 - this.coordinates.lat);
        this.coordinates.theta = THREE.Math.degToRad(this.coordinates.lon);

        this.cameraTarget.x = PANORAMA_RADIUS * Math.sin(this.coordinates.phi) * Math.cos(this.coordinates.theta);
        this.cameraTarget.y = PANORAMA_RADIUS * Math.cos(this.coordinates.phi);
        this.cameraTarget.z = PANORAMA_RADIUS * Math.sin(this.coordinates.phi) * Math.sin(this.coordinates.theta);

        this.camera.lookAt(this.cameraTarget);
    }

    increaseFocalLength() {
        if (this._focalLength < CAMERA_MAX_FOCAL_LENGTH) {
            this.camera.setFocalLength(++this._focalLength);
        }
    }

    decreaseFocalLength() {
        if (this._focalLength > CAMERA_MIN_FOCAL_LENGTH) {
            this.camera.setFocalLength(--this._focalLength);
        }
    }

    buildSkyBox() {
        const materials = [],
            pushImage = (pos: number) => {
                materials.push(new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(`assets/tile_${pos}_0_0_0.jpg`),
                    side: THREE.FrontSide
                }));
            };
        pushImage(1);
        pushImage(0);
        pushImage(3); // top
        pushImage(2); // bottom
        pushImage(4);
        pushImage(5);

        const skyBox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), new THREE.MultiMaterial(materials));
        skyBox.geometry.scale(1, 1, -1);
        this.scene.add(skyBox);
    }

    onResize() {
        this.camera.aspect = this.containerEl.clientWidth / this.containerEl.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.containerEl.clientWidth, this.containerEl.clientHeight);
    }

    addEventHandlers() {
        this.containerEl.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        this.containerEl.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
        this.containerEl.addEventListener('mouseup', this.mouseUpHandler.bind(this));
        this.containerEl.addEventListener('mousewheel', this.mouseWheelHandler.bind(this));

        this.containerEl.addEventListener('touchstart', this.touchStart.bind(this));
        this.containerEl.addEventListener('touchmove', this.touchMove.bind(this));
        this.containerEl.addEventListener('touchend', this.touchEnd.bind(this));
    }

    mouseDownHandler(e: MouseEvent) {
        e.preventDefault();

        this.lastState.animated = this.isAnimated;
        this.isAnimated = false;
        this._userInteract = true;

        this.lastState.onMouseDownMouseX = e.clientX;
        this.lastState.onMouseDownMouseY = e.clientY;

        this.lastState.onMouseDownLon = this.coordinates.lon;
        this.lastState.onMouseDownLat = this.coordinates.lat;
    }

    mouseMoveHandler(e: MouseEvent) {
        e.preventDefault();
        if (this._userInteract) {
            this.coordinates.lon = (this.lastState.onMouseDownMouseX - e.clientX) * 0.1 + this.lastState.onMouseDownLon;
            this.coordinates.lat = (e.clientY - this.lastState.onMouseDownMouseY) * 0.1 + this.lastState.onMouseDownLat;
        }
    }

    mouseUpHandler(e: MouseEvent) {
        e.preventDefault();
        this._userInteract = false;
        this.isAnimated = this.lastState.animated;
    }

    mouseWheelHandler(e: WheelEvent) {
        e.preventDefault();
        if (e.deltaY > 0) {
            this.increaseFocalLength();
        } else {
            this.decreaseFocalLength();
        }
    }

    touchStart(e: TouchEvent) {
        e.preventDefault();

        this.lastState.animated = this.isAnimated;
        this.isAnimated = false;
        this._userInteract = true;

        this.lastState.onMouseDownMouseX = e.touches[0].clientX;
        this.lastState.onMouseDownMouseY = e.touches[0].clientY;

        this.lastState.onMouseDownLon = this.coordinates.lon;
        this.lastState.onMouseDownLat = this.coordinates.lat;
    }

    touchMove(e: TouchEvent) {
        e.preventDefault();

        if (this._userInteract) {
            this.coordinates.lon = (this.lastState.onMouseDownMouseX - e.touches[0].clientX) * 0.1 + this.lastState.onMouseDownLon;
            this.coordinates.lat = (e.touches[0].clientY - this.lastState.onMouseDownMouseY) * 0.1 + this.lastState.onMouseDownLat;
        }
    }

    touchEnd(e: TouchEvent) {
        e.preventDefault();

        this._userInteract = false;
        this.isAnimated = this.lastState.animated;
    }
}
