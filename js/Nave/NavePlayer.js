class NavePlayer {
    speedPlayer = 0.56;
    createNavePlayer() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: '#cacaca' });
        const cube = new THREE.Mesh(geometry, material);

        return cube;
    }

    movePlayer(player) {
        addEventListener('keydown', (event) => {
            // console.log("Move the player", event.key);
            if (event.key == 'ArrowUp') {
                player.position.y += this.speedPlayer;

            }
            else if (event.key == 'ArrowDown')
                player.position.y -= this.speedPlayer;

            else if (event.key == 'ArrowLeft')
                player.position.x -= this.speedPlayer;


            else if (event.key == 'ArrowRight')
                player.position.x += this.speedPlayer;


            requestAnimationFrame(animate);
        })
    }

}