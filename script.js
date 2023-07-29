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

function game_update(score){
	let bg = openImage('background\\', 'background')
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

	let index = score%imageAmount
	let img = openImage('pictures\\',(index+1).toString())

	ctx.drawImage(img,canvas.width/2-img.width/2,canvas.height/2-img.height/2, img.width, img.height)

	ctx.globalAlpha = 0.4
	ctx.fillStyle = '#000000'
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.globalAlpha = 1
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

  	gameover.update(gameProcess.GameOver)

  	if(!gameProcess.GameOver){
  	gameProcess.update()
  	ball.update()
  	}
}

window.addEventListener('mousemove', function(event){
	ball.getMousePos({x: event.clientX, y: event.clientY})
})

animate()