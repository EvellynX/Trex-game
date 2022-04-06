//declarando as variáveis
var trex, trex_running, trex_collide
var edges
var ground, ground_image, ground2
var cloud, cloud_image, cloudgp
var cacto, cacto_image01, cacto_image02, cacto_image03, cacto_image04, cacto_image05, cacto_image06, cactogp
var score = 0
const play = 1
const end = 0
var gameOver, gameOver_image, restart, restart_image
let gameState = play
var checkPoint, die, jump
var isDead = false
//preload carrega as mídias do jogo
function preload() {
  //criando a animação do trex
  trex_running = loadAnimation("images/trex3.png", "images/trex4.png")
  trex_collide = loadAnimation('images/trex_collided.png')
  cloud_image = loadImage('images/cloud.png')
  //animação do solo
  ground_image = loadImage('images/ground2.png')
  cacto_image01 = loadImage('images/obstacle1.png')
  cacto_image02 = loadImage('images/obstacle2.png')
  cacto_image03 = loadImage('images/obstacle3.png')
  cacto_image04 = loadImage('images/obstacle4.png')
  cacto_image05 = loadImage('images/obstacle5.png')
  cacto_image06 = loadImage('images/obstacle6.png')
  gameOver_image = loadImage('images/gameOver.png')
  restart_image = loadImage('images/restart.png')
  checkPoint = loadSound('sounds/checkPoint.mp3')
  die = loadSound('sounds/die.mp3')
  jump = loadSound('sounds/jump.mp3')
}


//setup faz a configuração
function setup() {
  createCanvas(windowWidth, windowHeight);

  //sprite trex
  trex = createSprite(50, height - 40, 20, 40);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation('collide', trex_collide)
  trex.debug = false
  //trex.setCollider('rectangle',-10,0,50,100,30)
  trex.setCollider('circle', 0, 0, 30)
  //sprite Solo
  ground = createSprite(width / 2, height - 20, width, 20)
  ground.addImage(ground_image)
  ground.scale = 1.5
  //criando bordas
  edges = createEdgeSprites()
  ground2 = createSprite(width / 2, height - 10, width, 5)
  ground2.visible = false

  //criando grupos
  cloudgp = new Group()
  cactogp = new Group()

  gameOver = createSprite(width / 2, height - 100, 50, 50)
  gameOver.addImage(gameOver_image)
  gameOver.scale = 0.5
  restart = createSprite(width / 2, height - 60, 50, 50)
  restart.addImage(restart_image)
  restart.scale = 0.5
  gameOver.visible = false
  restart.visible = false

}

//draw faz o movimento, a ação do jogo
function draw() {
  background("white")
  //verificando colisão do trex com cacto
  if (trex.isTouching(cactogp)) {
    gameState = end
    trex.changeAnimation('collide')
    //die.play()
    if (!isDead) {
      die.play()
      isDead = true
    }
  }

  if (gameState == play) {
    //pulo do trex
    if ((keyDown("space")||touches.length>0) && trex.y > height - 46) {
      trex.velocityY = -10
      jump.play()
      touches=[]
    }
    //movimento do solo
    ground.velocityX = -(4 + score / 100)
    if (ground.x < 0) {
      ground.x = ground.width / 2

    }
    cloudGenerator()
    cactoGenerator()
    score += Math.round(getFrameRate() / 60)
    if (score % 100 === 0 && score > 0) {
      checkPoint.play()
    }
  }
  if (gameState == end) {
    ground.velocityX = 0
    cactogp.setVelocityXEach(0)
    cloudgp.setVelocityXEach(0)
    cactogp.setLifetimeEach(-1)
    cloudgp.setLifetimeEach(-1)
    gameOver.visible = true
    restart.visible = true
    if (mousePressedOver(restart)||touches.length>0) {
      reset()
      touches=[]
    }
  }

  gravity();

  //colisão do trex
  trex.collide(ground2);

  text('pontuação: ' + score, 20, height-190)
  //coordenadas do mouse na tela
  text("X: " + mouseX + " / Y: " + mouseY, mouseX, mouseY)
  drawSprites();
}

function gravity() {
  trex.velocityY += 0.5
}
function cloudGenerator() {

  if (frameCount % 60 === 0) {
    cloud = createSprite(width, random(height - 180, height - 110), 40, 40)
    cloud.velocityX = -(3 + score / 100)
    cloud.addImage(cloud_image)
    cloud.scale = random(0.5, 1.5)
    cloud.depth = trex.depth - 1
    cloud.lifetime = width / cloud.velocityX
    cloudgp.add(cloud)
  }


}
function cactoGenerator() {

  if (frameCount % 100 === 0) {
    cacto = createSprite(width, height - 25, 40, 40)
    cacto.velocityX = -(3 + score / 100)
    var sortecacto = Math.round(random(1, 6))
    switch (sortecacto) {
      case 1: cacto.addImage(cacto_image01)
        break;
      case 2: cacto.addImage(cacto_image02)
        break;
      case 3: cacto.addImage(cacto_image03)
        break;
      case 4: cacto.addImage(cacto_image04)
        break;
      case 5: cacto.addImage(cacto_image05)
        break;
      case 6: cacto.addImage(cacto_image06)
        break;
    }
    cacto.scale = 0.4
    cacto.lifetime = width / cacto.velocityX
    cactogp.add(cacto)

  }



}
function reset() {
  gameState = play
  gameOver.visible = false
  restart.visible = false
  cactogp.destroyEach()
  cloudgp.destroyEach()
  trex.changeAnimation('running')
  score = 0
}

