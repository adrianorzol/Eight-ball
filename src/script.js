import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer, raycaster;
let INTERSECTED;
const pointer = new THREE.Vector2(100, 100);

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0078FF);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
    camera.position.set(- 1.5, 2.5, 3.0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 2.5;
    controls.maxDistance = 5;
    controls.enablePan = false;

    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
    light.position.set(- 1.25, 1, 1.25);
    scene.add(light);

    const loader = new THREE.TextureLoader().load('texture2.png');
    const pool = new THREE.SphereGeometry(1, 48, 24);
    const poolMaterial = new THREE.MeshLambertMaterial({ map: loader });
    scene.add(new THREE.Mesh(pool, poolMaterial));

    for (let i = 0; i <= 3; i += 1) {
        const geometry = new THREE.SphereGeometry(1.01, 48, 24, i * Math.PI / 2, Math.PI / 2);

        const material = new THREE.MeshLambertMaterial({

            opacity: 0,
            transparent: true,
            map: new THREE.TextureLoader().load('cwiartka' + (i + 1) + '.png')
        });
        const cwiartka = new THREE.Mesh(geometry, material);
        cwiartka.name = "cwiartka" + (i + 1);
        scene.add(cwiartka);
    }

    raycaster = new THREE.Raycaster();

    document.addEventListener('mousemove', onPointerMove);
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('dblclick', ondblclick);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}
function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}
function animate() {

    requestAnimationFrame(animate);

    render();

}
function ondblclick(event) {

    raycaster.setFromCamera(pointer, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        switch (intersects[0].object.name) {
            case 'cwiartka1':
                window.open('cwiartka1.html');
                break;
            case 'cwiartka2':
                window.open('cwiartka2.html');
                break;
            case 'cwiartka3':
                window.open('cwiartka3.html');
                break;
            case 'cwiartka4':
                window.open('cwiartka4.html');
                break;
            default:
                console.log("Ćwiartka nieodnaleziona");
        }
        console.log(intersects[0]);

    }
}
function render() {

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;

            INTERSECTED.material.opacity = 1;

        }

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        if (INTERSECTED) INTERSECTED.material.opacity = 0;
        INTERSECTED = null;

    }
    renderer.render(scene, camera);

}