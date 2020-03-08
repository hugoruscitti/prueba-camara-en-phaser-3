import "phaser";
import pkg from "phaser/package.json";
import mira from "img/mira.png";
import arbol_1 from "img/decoracion_arbol_2.png";
import arbol_2 from "img/decoracion_hierba_1.png";
import arbol_3 from "img/decoracion_palmera.png";

// This is the entry point of your game.

const width = 800;
const height = 600;

const centro_x = width / 2;
const centro_y = height / 2;

let ancho_del_escenario = 1600;
let alto_del_escenario = 800;

const config = {
  backgroundColor: "#888",
  width,
  height,
  type: Phaser.AUTO,
  scene: { preload, create, update, render }
};

let mainGame = new Phaser.Game(config);
let scene = null;
let sprite_borde_de_camara = null;
let minimap = null;
let camara = null;

function preload() {
  this.load.image("mira", mira);
  this.load.image("arbol_1", arbol_1);
  this.load.image("arbol_2", arbol_2);
  this.load.image("arbol_3", arbol_3);
}

function create() {
  crear_objetos(this);
  crear_texto(this);

  crear_sprite_de_camara(this);

  // aplica límites a la pantalla.
  this.cameras.main.setBounds(0, 0, ancho_del_escenario, alto_del_escenario);

  crear_minimap(this);

  guardar_variables_globales(this);
}

function guardar_variables_globales(scene) {
  // guarda las variables globales.
  scene = scene;
  window.scene = scene;
  window.mainGame = mainGame;
  window.sprite_borde_de_camara = sprite_borde_de_camara;
  window.minimap = minimap;
  window.camara = scene.cameras.main;
}

function crear_sprite_de_camara(game) {
  sprite_borde_de_camara = game.add.rectangle(0, 0, width, height);
  sprite_borde_de_camara.setStrokeStyle(5, 0xffffff);
}

function crear_objetos(game) {
  const centerX = width / 2;
  const centerY = height / 2;

  game.add.image(centerX, centerY * 1.2 - 100, "mira");
  game.add.image(centerX, centerY * 1.2 + 350, "mira");

  game.add.image(100, 150, "arbol_1");

  // Creando arbustos.
  for (let i = 0; i < 10; i++) {
    game.add.image(300 + i * 100, 150, "arbol_2");
  }

  // Creando palmeras.
  for (let i = 0; i < 10; i++) {
    game.add.image(100 + i * 200, 400, "arbol_3");
  }
}

function crear_texto(game) {
  game.add
    .text(10, 570, "Demo", {
      font: "bold 22px Arial",
      fill: "#fff"
    })
    .setScrollFactor(0);
}

function crear_minimap(game) {
  let w = 120;
  let h = 120;
  let p = 5;

  minimap = game.cameras.add(width - w - p, height - h - p, w, h).setZoom(0.1);
  minimap.setBounds(0, 0, ancho_del_escenario, alto_del_escenario);
  minimap.setBackgroundColor(0x002244);
  minimap.scrollX = 0;
  minimap.scrollY = 0;
}

function update(time, delta) {
  if (this.game.input.activePointer.isDown) {
    if (this.game.origDragPoint) {
      //this.scene.input.setDefaultCursor("cursor: pointer");
      this.cameras.main.scrollX +=
        this.game.origDragPoint.x - this.game.input.activePointer.position.x;
      this.cameras.main.scrollY +=
        this.game.origDragPoint.y - this.game.input.activePointer.position.y;
    }

    this.game.origDragPoint = this.game.input.activePointer.position.clone();
  } else {
    this.game.origDragPoint = null;
    //this.scene.input.setDefaultCursor("cursor: default");
  }

  let { x, y } = obtener_posicion_de_desplazamiento(this.cameras.main);

  sprite_borde_de_camara.x = x + centro_x;
  sprite_borde_de_camara.y = y + centro_y;

  minimap.scrollX = x + centro_x;
  minimap.scrollY = y + centro_y;
}

function obtener_posicion_de_desplazamiento(camera) {
  let x = camera.scrollX;
  let y = camera.scrollY;

  let bounds = camera.getBounds();

  if (x < bounds.x) {
    x = bounds.x;
  }

  if (x > bounds.width - width) {
    x = bounds.width - width;
  }

  if (y < bounds.y) {
    y = bounds.y;
  }

  if (y > bounds.height - height) {
    y = bounds.height - height;
  }

  return { x, y };
}

function render() {}
