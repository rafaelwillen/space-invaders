let Scene, camera, renderer, mesh

function Vista(value) {
    camera = new THREE.PerspectiveCamera(
        90,
        innerWidth / innerHeight,
        10,
        1000
    )
    switch (value) {
        case 1:
            camera.position.z = 10
            break;
        case 2:
            camera.position.y = 10
            break;
        case 3:
            camera.position.x = 10
            break;
        default:
            //Vista Padrao Frontal
            camera.position.z = 20
            break;
    }

}

function CriarBackGround() {
    let Geometry = new THREE.PlaneGeometry(40, 40, 1, 1)
    //Carregador de Textura
    // let loader = new Three.TextureLoader();
    let material = new THREE.MeshBasicMaterial({ color: 0xbbbbbb })
    mesh = new THREE.Mesh(Geometry, material)
    Scene.add(mesh)
}

function animar() {
    requestAnimationFrame(animar)
    
  //animacao das estrelas
  //  mesh.rotation.z += 0.2
    renderer.render(Scene, camera)

}


function Criarcena() {

    Scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer()
    Vista(0)
    CriarBackGround()
    renderer.setSize(innerWidth, innerHeight)
    document.body.appendChild(renderer.domElement)
    window.addEventListener("keydown", MudarCamera);
    mesh.rotation.x += 11.45
    renderer.render(Scene, camera)
   
    //animar()
}




function MudarCamera(e) {
    switch (e.keyCode) {
        case '1':
            Vista(1)
            break
        case '2': Vista(2)
            break;
        case '3': Vista(3)
            break

        default:
            Vista(1)
            break
    }
}


Criarcena()