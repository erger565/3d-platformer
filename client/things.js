
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const canvas = document.getElementById('gc');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setClearColor(0x87CEEB);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const distance = 8;
camera.position.set(0, -5, 0);
camera.rotation.x = Math.PI / 2;

const light = new THREE.AmbientLight(0xaaaaaa);
scene.add(light);
const shadowLight = new THREE.PointLight(0x777777, 1, 700);
shadowLight.position.set(0, 0, 20);
scene.add(shadowLight);
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.width = 1024;
shadowLight.shadow.mapSize.height = 1024;

class Player {
	constructor(x, y, z, color) {
		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry ( 1, 1, 1),
			new THREE.MeshLambertMaterial({ color: color })
		);
    this.mesh1 = new THREE.Mesh(
      new THREE.BoxGeometry ( 0.5, 0.5, 0.5),
      new THREE.MeshLambertMaterial({ color: color })
    );
    this.mesh1.castShadow = true;
    this.mesh1.position.set(x, y, z);
    scene.add(this.mesh1);
    this.mesh.castShadow = true;
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    this.texture = new THREE.Texture(canvas);
    this.healthbar = new THREE.Sprite(
      new THREE.SpriteMaterial({map: this.texture})
    );
    this.healthbar.position.set(x, y, z + 1.5);
    scene.add(this.healthbar);
    this.ctx = canvas.getContext('2d');
    this.ctx.texstAlign = "left";
    this.ctx.font = "30px Arial";
  }
  updateHealth(hp, score, x, y, z) {
    this.healthbar.position.set(x, y, z + 1.5);
    this.texture.needsUpdate = true;
    this.ctx.clearRect(0, 0, 64, 64);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 54, 64, 10);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 54, hp * 0.64, 10);
    this.ctx.fillStyle = "black";
    this.ctx.fillText(score, 10, 40);
  }
}
class Floor {
	constructor(x, y, z, w, h, d) {
		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(w, h, d),
			new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
		);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
	}
}

class Bullet {
  constructor(x, y, z) {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshLambertMaterial({color: 0x000000})
    );
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
  }
}