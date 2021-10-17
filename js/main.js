const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const nave = new NavePlayer();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const player = nave.createNavePlayer();
scene.add( player );

camera.position.z = 3;
nave.movePlayer(player);

function animate() {
    renderer.render( scene, camera );
}
animate();
 