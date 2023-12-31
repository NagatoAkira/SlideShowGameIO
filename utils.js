function spriteAnimate(image, frame, amount, x=0, y=0, w=69, h=69, wl=69, hl=69){
	frame = frame % amount
	ctx.drawImage(image, w*frame, 0, w, h, x, y, wl, hl)
}


class N_angle{
	constructor(n,degrees, speedScale, player){
		this.x = canvas.width/2
		this.y = canvas.height/2
		this.n = n

		this.scale = canvas.width>canvas.height ? canvas.width*0.7:canvas.height*0.7

		this.lineWidth = 30
		this.color = '#D40000'

		this.Nangle = this.getNangle()

		this.speedScale = speedScale

		this.player = player
		
		this.rotateNangle(degrees+30)
		this.degrees = degrees + 30

		this.isAble = true
		this.isBlur = true

		this.correctDegrees()
	}
	correctDegrees(){
		let diff = 30
		let unitAngle = 360/this.n

		let condition = (this.degrees-diff)/unitAngle

		if(condition >= this.n/2){
			this.degrees = (condition - this.n)*unitAngle + diff
		}
	}
	getNangle(){
		let Nangle = []
		let n = this.n

		let start_X = this.x - this.scale
		let start_Y = this.y 

		let iterAngle = 360/n*Math.PI/180
		let currentAngle = -180/n*Math.PI/180 
		let sideLength = 2*this.scale*Math.sin(iterAngle/2)

		let centerPos = {x: Math.sin(currentAngle), y: Math.cos(currentAngle)}

		for(let i=0; i<n+1; i++){
			currentAngle += iterAngle

			let dir = {x: Math.sin(currentAngle), y: Math.cos(currentAngle)}

			start_X += dir.x * sideLength 
			start_Y += dir.y * sideLength 

			let outputPos = {x: start_X, y: start_Y }

			Nangle.push(outputPos)
		}

		return Nangle
	}
	isHole(){
		let diff = 360/this.n
		let min = (this.degrees - diff) * Math.PI/180
		let max = (this.degrees) * Math.PI/180

		return this.player.degrees > min && this.player.degrees < max
	}
	isOut(){
		let areaCond = this.scale-this.lineWidth < this.player.areaRadius
		return {win: this.isHole() && areaCond, lose: areaCond}
	}
	isGameOver(){
		if(this.player == null){
			return false
		}

		let condition = this.isOut()

		if(condition.win){	
			return false
		}
		if(condition.lose){
			return true
		}

		return null
	}
	rotateNangle(degrees){
		let rotated = []
		let convertedDegrees = degrees * Math.PI/180

		for(let index in this.Nangle){
			let position = this.Nangle[index]
			let x = position.x
			let y = position.y

			let angle = Math.atan2(x-this.x, y-this.y)

			let outputPos = {x: this.x + Math.sin(angle + convertedDegrees) * this.scale,
							 y: this.y + Math.cos(angle + convertedDegrees) * this.scale}

			rotated.push(outputPos)
		}
		
		this.Nangle = rotated
	}
	scaleNangle(){
		this.scale += this.speedScale
	}
	drawCloseLine(positions){
		//Out
		ctx.strokeStyle = '#000000'
		ctx.lineWidth = this.lineWidth+10
		ctx.lineCap = 'round'
		ctx.beginPath()
		for(let i=1; i<positions.length; i++){
			let x = positions[i].x
			let y = positions[i].y

			ctx.lineTo(x,y)
		}
		ctx.stroke()

		//Inside
		ctx.strokeStyle = this.color
		ctx.lineWidth = this.lineWidth
		ctx.lineCap = 'round'
		ctx.beginPath()
		for(let i=1; i<positions.length; i++){
			let x = positions[i].x
			let y = positions[i].y

			ctx.lineTo(x,y)
		}
		ctx.stroke()
	}
	blur(){
		ctx.save()
		ctx.filter = 'blur(10px)'
		this.drawCloseLine(this.Nangle)
		ctx.restore()
	}
	update(){
		if(this.isAble){
			this.rotateNangle(0)
			this.scaleNangle()
		}
		//this.blur()
		this.drawCloseLine(this.Nangle)
	}
}

class generatorNangle{
	constructor(n,tick, speedScale, player){
		this.n = n
		this.counter = 0
		this.tick = tick
		this.speedScale = speedScale

		this.nangles = []

		this.player = player

		this.GameOver = false
		this.score = 0
	}
	randint(start, end){
		return Math.floor(Math.random()*end) - start
	}
	append(){
		let rotate = this.randint(0,this.n) * 40
		this.nangles.push(new N_angle(this.n, rotate, this.speedScale, this.player))
	}
	deleteNangle(index){
		delete this.nangles[index]
	}
	isGameOver(){
		for(let i in this.nangles){
			let gameover = this.nangles[i].isGameOver()

			if(gameover!=null){
				if(!gameover){
					if(this.nangles[i].player != null){
						this.score += 1
					}
					this.nangles[i].player = null
					
				}
				else{
					this.player.cake.stage += 1
					this.deleteNangle(i)

					if(this.player.cake.stage >= 7){
						this.GameOver = true
					}
					
				}
			}
		}
	}
	stopGame(){
		for(let i in this.nangles){
			this.nangles[i].isAble = false
		}
	}
	draw(){
		for(let i in this.nangles){
			let nangle = this.nangles[i]
			nangle.update()
			if(nangle.scale <= 0){
				this.deleteNangle(i)
			}
		}
	}
	update(){
		if(!this.GameOver){
		this.counter += 1
		if(this.counter >= this.tick){
			this.counter = 0
			this.append()
		}
		}
		this.draw()
		this.isGameOver()
	}
}

class Player{
	constructor(){
		this.centerPos = {x: canvas.width/2, y: canvas.height/2}

		this.areaRadius = 100
		this.selfRadius = 20

		this.color = '#000000'

		// Default
		this.mousePos = {x: 0, y: 0}
		this.degrees = 0

		this.cake = {sprite: new Image(), stage: 0}
		this.cake.sprite.src = 'animation\\cake.png'

		this.isAble = true
	}
	getMousePos(position){
		if(position != null){
		this.mousePos = position
		}
	}

	definePos(){
		let degrees = Math.atan2(this.mousePos.x-this.centerPos.x, this.mousePos.y-this.centerPos.y)
		let dir = {x: Math.sin(degrees), y: Math.cos(degrees)}

		this.x = dir.x * this.areaRadius + this.centerPos.x
		this.y = dir.y * this.areaRadius + this.centerPos.y

		this.degrees = degrees
	}
	drawCenter(){
		let scl_multiply = 0.5
		spriteAnimate(this.cake.sprite, this.cake.stage, 8, canvas.width/2-402*scl_multiply/2, canvas.height/2-250*scl_multiply/2, 
															402, 250, 
															402*scl_multiply, 250*scl_multiply)
	}

	draw(){
		ctx.beginPath()
		ctx.fillStyle = this.color
		ctx.arc(this.x, this.y, this.selfRadius, 0, Math.PI * 2)
		ctx.fill()
	}

	stopGame(){
		this.isAble = false
	}

	blur(){
		ctx.save()
		ctx.filter = 'blur(10px)'
		this.draw()
		this.drawCenter()
		ctx.restore()
	}

	update(){
		if(this.isAble){
		this.getMousePos()
		this.definePos()
		}
		//this.blur()
		this.drawCenter()
		if(this.isAble){this.draw()}
		
	}

}
class GameOver{
	constructor(nanagon, player){
		this.player = player
		this.nanagon = nanagon

		this.isAble = true

		this.alpha = 0
	}
	stopGame(){
		if(this.isAble){
		this.isAble = false
		ctx.globalAlpha = 0
		this.nanagon.stopGame()
		this.player.stopGame()
		}
	}
	setAlphaPositive(speed){
		if(this.alpha < 1){
		if(ctx.globalAlpha + 2*speed < 1){
			this.alpha += speed
		}else{
			this.alpha = 1
		}
	  }	
	}
	setAlphaNegative(speed){
		if(ctx.globalAlpha > 0){
		if(ctx.globalAlpha - 2*speed > 0){
			ctx.globalAlpha -= speed
		}else{
			ctx.globalAlpha = 0
		}
	  }	
	}
	textDraw(){
		let text = ["Your", "Score:", this.nanagon.score.toString()]
		let fontSize = 50
		let offset = {x:canvas.width/2-50, y: canvas.height/2+150}
		ctx.font = fontSize.toString() + 'px bold Kalam'
		
		ctx.fillStyle = '#000000'
		// Write Text
		ctx.fillText(text[0], offset.x, offset.y-fontSize/2)
		ctx.fillText(text[1], offset.x, offset.y+fontSize-fontSize/2)
		ctx.fillStyle = '#D40000'
		ctx.fillText(text[2], offset.x, offset.y+2*fontSize-fontSize/2)
	}
	update(isGameOver){
		if(isGameOver){
			ctx.globalAlpha = this.alpha
			this.stopGame()
			this.setAlphaPositive(0.05)
			this.textDraw()
			ctx.globalAlpha = 1
		}
	}
}