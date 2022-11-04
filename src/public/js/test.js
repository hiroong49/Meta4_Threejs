import * as THREE from 'https://cdn.skypack.dev/three';
import { MeshBasicMaterial, DoubleSide,
    Mesh } from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three-orbitcontrols-ts';
import { GLTFLoader } from 'https://cdn.skypack.dev/@maptalks/gltf-loader';
import gsap from 'https://cdn.skypack.dev/@recly/gsap';



class ImagePanel {
    constructor(info) {
        const texture = info.textureLoader.load(info.imageSrc);
        const material = new MeshBasicMaterial({
            map: texture,
            side: DoubleSide
        });

        this.mesh = new Mesh(info.geometry, material);
        this.mesh.position.set(info.x, info.y, info.z);
        this.mesh.lookAt(0, 0, 0);

        // Sphere 상태의 회전각을 저장
        this.sphereRotationX = this.mesh.rotation.x;
        this.sphereRotationY = this.mesh.rotation.y;
        this.sphereRotationZ = this.mesh.rotation.z;

        info.scene.add(this.mesh);
    }
}

const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.001);
const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
    const spherePositionArray = sphereGeometry.attributes.position.array;
    const randomPositionArray = [];
    for (let i = 0; i < spherePositionArray.length; i++) {
        randomPositionArray.push((Math.random() - 0.5) * 10);
    }
    const imagePanels = [];
    let imagePanel;
    for (let i = 0; i < spherePositionArray.length; i += 3) {
        imagePanel = new ImagePanel({
            textureLoader,
            scene,
            geometry: boxGeometry,
            imageSrc: `../images/0${Math.ceil(Math.random() * 9)}.png`,
            x: spherePositionArray[i],
            y: spherePositionArray[i + 1],
            z: spherePositionArray[i + 2],
            id: [i]/3
        });
        
        imagePanels.push(imagePanel);
        imagePanels.name = "그림 " + ([i]/3+1);
        console.log(imagePanels.name);
    }


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

function setShape(e) {
    const type = e.target.dataset.type;
    let array;

    switch (type) {
        case 'random':
            array = randomPositionArray;
            break;
        case 'sphere':
            array = spherePositionArray;
            break;
    }

    for (let i = 0; i < imagePanels.length; i++) {
        // 위치 이동 
        gsap.to(
            imagePanels[i].mesh.position,
            {
                duration: 2,
                x: array[i * 3],
                y: array[i * 3 + 1],
                z: array[i * 3 + 2],
            }
        );

        // 회전
        if (type === 'random') {
            gsap.to(
                imagePanels[i].mesh.rotation,
                {
                    duration: 2,
                    x: 0,
                    y: 0,
                    z: 0
                }
            );
        } else if (type === 'sphere') {
            gsap.to(
                imagePanels[i].mesh.rotation,
                {
                    duration: 2,
                    x: imagePanels[i].sphereRotationX,
                    y: imagePanels[i].sphereRotationY,
                    z: imagePanels[i].sphereRotationZ
                } 
            )
        }
    }
}

// 버튼
const btnWrapper = document.createElement('div');
btnWrapper.classList.add('btns');

const randomBtn = document.createElement('button');
randomBtn.dataset.type = 'random';
randomBtn.style.cssText = 'position: absolute; left: 20px; top: 20px';
randomBtn.innerHTML = 'Random';
btnWrapper.append(randomBtn);

const sphereBtn = document.createElement('button');
sphereBtn.dataset.type = 'sphere';
sphereBtn.style.cssText = 'position: absolute; left: 20px; top: 50px';
sphereBtn.innerHTML = 'Sphere';
btnWrapper.append(sphereBtn);

document.body.append(btnWrapper);

// 이벤트
btnWrapper.addEventListener('click', setShape);
window.addEventListener('resize', setSize);
canvas.addEventListener('click', e => {
    // raycaster를 사용하려면 -1 ~ 1 로 좌표를 바꿔 줘야 함. 가운데가 0.
    mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
    mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
    // console.log(mouse);
    checkIntersects();
});

