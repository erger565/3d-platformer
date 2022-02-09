
const express = require('express');
const app = express();
const serv = require('http').Server(app);

app.use('/', express.static(__dirname + '/client/'));


serv.listen(2000);
console.log('Server started.');

const io = require('socket.io')(serv);

const fs = require('fs');

const map = JSON.parse(fs.readFileSync("map.json"));

const { Floor, Player, Bullet } = require('./classes.js');

const players = {};

const floors = [];


for (const f of map.data) floors.push(new Floor(f[0], f[1], f[2], f[3], f[4]));

io.on('connection', socket => {
	const id = socket.id;
	players[id] = new Player(0, 0, 1, 1);
	const p = players[id];
	socket.emit('id', socket.id);
	socket.emit('floors', floors);
	socket.on('move', data => {
		const x = Math.sin(data.angle) * data.speed;
		const y = Math.cos(data.angle) * data.speed;
		if (p.landed && data.jump) {
			p.sz ++;
			p.landed = false;
		}

		p.sx = x;
		p.sy = y;
	});

	socket.on('angle', a => {
		p.angle = a;
	});

	socket.on('shoot', a => {
    if (!p.ready) return;
		const b = new Bullet(p.x, p.y, p.z);
		p.bullets.push(b);

		b.sx = Math.sin(a) * 1;
		b.sy = Math.cos(a) * 1;
		b.sz = 0;
    p.ready = false;
    setTimeout(() => p.ready = true, 300);
	});

	socket.on('disconnect', () => {
		delete players[id];
	});
});

function update() {
	for (const i in players) {
		const p = players[i];

		p.x += p.sx;
		p.y += p.sy;
		p.z += p.sz;

    if(p.z < -40 && p.z <-20 && p.x > 53  && p.x < 67 && p.y > 53 && p.y < 67){
      p.sreSpawn();
    }
    if(p.z < -40 &&  p.z <-20 && p.x < -160 && p.y < -160){
      p.sreSpawn();
      io.emit("oof");
    }

    if (p.z < -50 && p.score === 0) {
      p.firstreSpawn();
      io.emit("oof");
      console.log("score = 0, first respawn");
    }
    if (p.z < -50 && p.score === 1) {
      p.firstreSpawn();
      io.emit("oof");
      console.log("score = 1, first respawn")
    }
    if (p.z < -50 && p.score === 2) {
      p.firstreSpawn();
      io.emit("oof");
      console.log("score = 2, first respawn")
    }
    if (p.z < -50 && p.score === 3) {
      p.secondreSpawn();
      io.emit("oof");
      console.log("score = 3, second respawn")
    }
    if (p.z < -50 && p.score === 4) {
      p.secondreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 5) {
      p.thirdreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 6) {
      p.thirdreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 7) {
      p.thirdreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 8) {
      p.thirdreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 9) {
      p.thirdreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score ===   9) {
      p.fourthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 10) {
      p.fourthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 11) {
      p.fourthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 12) {
      p.fourthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 13) {
      p.fourthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 14) {
      p.fourthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 15) {
      p.fifthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score === 16) {
      p.fifthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
    if (p.z < -50 && p.score > 16) {
      p.sixthreSpawn();
      io.emit("oof");
      console.log("score = 4, second respawn")
    }
		let landed = false;
		for (const f of floors) {
			if (f.collide(p)) {
				landed = true;
				break;
			}
		}
		p.landed = landed;
		if (!p.landed) p.sz -= 0.05;
		else p.sz = 0;

		for (const i in p.bullets) {
			const b = p.bullets[i];
			b.x += b.sx;
			b.y += b.sy;
      console.log(b.y);

			if ((b.x < -150 || b.x > 150 || b.y < -150 || b.y > 150) && (b.x > -231.1 || b.x < -271.1 || b.y > -240 || b.y < -280))
				p.bullets.splice(i, 1);

      for (const i in players) {
        const target = players[i];
        if(p != target && b.collide(target)) {
          target.hp -= 20;
          p.bullets.splice(p.bullets.indexOf(b), 1);
          if (target.hp <= 0 && target.score === 0) {
            target.firstreSpawn();
            io.emit("oof");
            p.score++;

          }
          if(target.hp <= 0 && p.z > -40 && p.x < -160 && p.y < -160){
            target.sreSpawn();
            io.emit("oof");
            p.score++;

          }

          if (target.hp <= 0 && target.score === 1) {
            target.firstreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 2) {
            target.firstreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 3) {
            target.secondreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 4) {
            target.secondreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 5) {
            target.thirdreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 6) {
            target.thirdreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 7) {
            target.thirdreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 8) {
            target.thirdreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 9) {
            target.thirdreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 10) {
            target.fourthreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 11) {
            target.fourthreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 12) {
            target.fourthreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 13) {
            target.fourthreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 14) {
            target.fourthreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 15) {
            target.fifthreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score === 16) {
            target.fifthreSpawn();
            io.emit("oof");
            p.score++;

          }
          if (target.hp <= 0 && target.score > 16) {
            target.sixthreSpawn();
            io.emit("oof");
            p.score++;

          }
          break;
        }
      }
		}
	}
}


function send(){
  const pack = [];
	for (const i in players) {
		const p = players[i];
		const bullets = [];
		for (const b of p.bullets) bullets.push({ x: b.x, y: b.y, z: b.z, id: b.id });

		pack.push({
			x: p.x,
			y: p.y,
			z: p.z,
			id: i,
      hp: p.hp,
			angle: p.angle,
			bullets: bullets,
			score: p.score
		});
	}

	io.emit('players', pack);
}

setInterval(() => {
  update();
	send();
}, 1000 / 60);