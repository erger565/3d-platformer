//Copyright <2021> <erger561> <https://3d-5.erger561.repl.co>


if ('serviceWorker' in navigator) {
  // Register a service worker hosted at the root of the
  // site using the default scope.
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    console.log('Service worker registration succeeded:', registration);
  }, /*catch*/ function(error) {
    console.log('Service worker registration failed:', error);
  });
} else {
  console.log('Service workers are not supported.');
}

const socket = io();

let id;
socket.on('id', i => (id = i));

let [x, y, z] = [0, 0, 0];
const me = new Player(0, 0, 0, 0x00A2F3);

let oof = new Audio("oof.mp3");
let sky = new Audio("Sky.mp3");

const players = {};
const bullets = {};

const floors = [];

socket.on('floors', data => {
	for (const f of data) {
		floors.push(new Floor(f.x, f.y, f.z, f.w, f.h, f.d));
	}
});

socket.on('players', data => {
	let notUpdated = [];
	for (let i in players) notUpdated.push(i);

	let notUpdatedBullets = [];
	for (let i in bullets) notUpdatedBullets.push(i);

	for (const p of data) {
		if (p.id == id) {
			({ x, y, z } = p);
			camera.position.set(
				x - Math.sin(angle.z) * Math.sin(angle.x) * distance,
				y - Math.cos(angle.z) * Math.sin(angle.x) * distance,
				z + Math.cos(angle.x) * distance
			);
			me.mesh.position.set(x, y, z);
      if (p.score < 10 ) {
        me.mesh1.position.set(x, y, z);
      }
      if (p.score > 9) {
        me.mesh1.position.set(x, y-1.5, z);
      }
			me.updateHealth(p.hp, p.score, x, y, z);
		} else if (!players[p.id]) {
			players[p.id] = new Player(p.x, p.y, p.z, 0xE00000);
			players[p.id].mesh.rotation.z = -p.angle;
      if (p.score > 9) {
        players[p.id].mesh1.rotation.z = -p.angle;
      }
			players[p.id].updateHealth(p.hp, p.score, p.x, p.y, p.z);
		} else {
			players[p.id].mesh.position.set(p.x, p.y, p.z);
			players[p.id].mesh.rotation.z = -p.angle;
			notUpdated.splice(notUpdated.indexOf(p.id), 1);
      if (p.score > 9 ) {
        players[p.id].mesh1.position.set(p.x, p.y-1.5, p.z);
        players[p.id].mesh1.rotation.z = -p.angle;
      }
      if (p.score < 10) {
        players[p.id].mesh1.position.set(p.x, p.y, p.z);
      }
			players[p.id].updateHealth(p.hp, p.score, p.x, p.y, p.z);
		}

		for (const b of p.bullets) {
			if (!bullets[b.id]) {
				bullets[b.id] = new Bullet(b.x, b.y, b.z);
			} else {
				bullets[b.id].mesh.position.set(b.x, b.y, b.z);
				notUpdatedBullets.splice(notUpdatedBullets.indexOf(b.id), 1);
			}
		}
	}

	for (const i of notUpdatedBullets) {
		bullets[i].mesh.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		delete bullets[i];
	}

	for (const i of notUpdated) {
		players[i].mesh.name = 'tmp';
    if (p.score > 9 ) {
      players[i].mesh1.name = 'tmp';
    }
		scene.remove(scene.getObjectByName('tmp'));
		players[i].healthbar.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		delete players[i];
	}
});

socket.on("oof", () => oof.play())
function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();
