import {Mesh,MeshBasicMaterial,SphereGeometry} from '../library/three.module.js';

export default class Bullet extends Mesh{
    constructor(radio, widthSeq, heightSeq){
        super();
        const geometry = new SphereGeometry(radio,widthSeq, heightSeq);
        const material = new MeshBasicMaterial({color: '#ff000f'});
        const bullet = new Mesh(geometry,material);
        this.alive = true;
        this.velocity;
        return bullet; 
    }
}