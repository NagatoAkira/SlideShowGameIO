canvas = document.querySelector("canvas")
ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

let imageAmount = 14

function openImage(path,name){
	let img = new Image()
	img.src = path+name+'.jpg'

	return img
}

function game_update(){
	let bg = openImage('background\\', 'background')
	let scroll = {img: openImage('background\\', 'scroll')}
	scroll.w = canvas.height/scroll.img.height * scroll.img.width
	scroll.h = canvas.height


	ctx.drawImage(bg, -canvas.width*0.05, -canvas.height*0.05, canvas.width*1.1, canvas.height*1.1)
	ctx.drawImage(scroll.img, canvas.width/2 - scroll.w/2, 0, scroll.w, scroll.h)
}

const fps = 60

let ball = new Player()
let gameProcess = new generatorNangle(9,fps,-5,ball)
let gameover = new GameOver(gameProcess, ball)

function animate(){
	setTimeout(() => {
    	window.requestAnimationFrame(animate);
  	}, 1000 / fps)

  	game_update(gameProcess.score)

  	if(!gameProcess.GameOver){
  	gameProcess.update()
  	}
  	ball.update()

  	gameover.update(gameProcess.GameOver)
}

window.addEventListener('mousemove', function(event){
	ball.getMousePos({x: event.clientX, y: event.clientY})
})

animate()