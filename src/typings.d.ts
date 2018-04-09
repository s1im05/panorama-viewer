interface PanoramaCoordinates {
    lon: number;
    lat: number;
    phi: number;
    theta: number;
}

interface PanoramaState {
    onMouseDownMouseX: number;
    onMouseDownMouseY: number;
    onMouseDownLon: number;
    onMouseDownLat: number;
    animated: boolean;
    orientationAlpha: number;
    orientationBeta: number;
}
