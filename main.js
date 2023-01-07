var jewels = [[9],[9],[9],[9],[9],[9],[9],[9],[9],[9]] // Jumlah maksimal kotak jewel

var Player = { // Data player (nama dan point)
	point: 0,
	name: "",
	setPoint: function(point) {
		this.point+=point
		$("#playerPoint").text(this.point)
	}
}

var Movement = { // Variabel Movement untuk mencari gambar
	selectedId: 0,
	dataImage: 0,
	dataX: 0,
	dataY: 0,
	setSelectedId:function(id) {
		this.selectedId = id
		this.dataImage = $("#"+this.selectedId).attr("dataImage")
		this.dataX = $("#"+this.selectedId).attr("dataX")
		this.dataY = $("#"+this.selectedId).attr("dataY")
	}
}

var Game = { // Game display
	countTime: 1, // Hitung mundur sebelum masuk layar game
	isStarted: false,
	start: function() { // Game start
		$(".gameDashboard").fadeOut() // Layar Game, tidak ditampilkan
		var username = $("#name").val()
		if(username.length == 5) {
			alert("INSERT YOUR NAME FIRST !!!"); // Muncul alert, ketika player belum memasukkan nama
		} else { // Untuk memberikan data username ke game board 
			var number = Math.random()
			Player.name = username
			for(i = 1; i < 6;i++) { // Baris
				for(j = 1; j < 6;j++) { // Kolom
					isValid = false
					var rand = Math.random()+""
					var arrRand = rand.split('')
					if(arrRand[15] == "0") {
						arrRand[15] = "1"
					}
					jewels[i][j] = new Jewel(arrRand[15]);
				}
			}
			$("#playerName").text(Player.name)
			this.countDown()
		}
	},

	countDown: function() { // Hitung mundur
		$(".gameWelcome").fadeOut() // Halaman awal, hilang
		$(".countDown").fadeIn() // Mulai hitung mundur
		if(this.countTime != 0) {
			setTimeout(function(){ // Mulai timer game
				Game.countTime -= 1
				$(".countDown h1").text(Game.countTime+"")
				Game.countDown()
			},1000)
		} else {
			$(".countDown h1").fadeOut() // Ketika hitung mundur selesai, masuk halaman game
			this.buildGame()
		}
	},

	buildGame: function() {
		$(".playAgain").fadeOut() // Tombol play again, hilang
		$(".gameWelcome").fadeOut() // Halaman awal, hilang
		$(".gameDashboard").fadeIn() // Layar game, muncul
		for(i = 1; i < 6;i++) {
			var text = "<tr>"
			for(j = 1; j < 6;j++) {
				text+="<td id='column'><img dataY='"+i+"' dataX='"+j+"' dataImage='"+jewels[i][j].number+"' id='"+i+j+"' ondragstart='Game.onDragStart(event)' ondragover='event.preventDefault()' ondrop='Game.onDragEnd(event)' src='images/"+jewels[i][j].number+".png'></td>"
			}
			text += "</tr>"
			$(".gameDisplay tbody").append(text)
		}
		this.isStarted = true
		Timing.startTiming()
	},

	playAgain: function() { // Play again
		$(".gameDisplay tbody").text("")
		this.countTime = 3 // Hitung mundur play again
		Player.point = 0 // Restart score
		Timing.nowTime = 60 // Timer play again
		this.start()
	},

	onDragStart: function(event) { // Ketika objek on drag
		Movement.setSelectedId(event.target.id)
	},

	onDragEnd: function(event) { // Ketika objek on drop
		if(this.isStarted) { 
			var from = $("#"+Movement.selectedId)
			var target = $("#"+event.target.id)
			if((parseInt(Movement.dataX) + 1) < parseInt(target.attr("dataX")) || (parseInt(Movement.dataX) - 1) > parseInt(target.attr("dataX")) || (parseInt(Movement.dataY) - 1) > parseInt(target.attr("dataY")) || (parseInt(Movement.dataY) + 1) < parseInt(target.attr("dataY"))) {
				alert("CANNOT MOVE OBJECT !!!") // muncul alert, Ketika objek di drag lebih dari satu block
			} else {
				from.attr("src",target.attr("src"))
				from.attr("dataImage",target.attr("dataImage"))
				target.attr("src","images/"+Movement.dataImage+".png")
				target.attr("dataImage",Movement.dataImage)
			}
			checkerGame.check(target)
		} else {
			alert("GAME IS OVER !!!") // Muncul alert, ketika timer habis
		}
	}
}

var checkerGame = { // Untuk Mengecek Jewel ketika sejajar 3 baris atau lebih
	object: null,
	objectTypeJewel: 0,
	destroyItemX: "",
	destroyItemY: "",
	nextCheckX: false,
	nextCheckY: false,
	beforeCheckX:false,
	beforeCheckY:false,
	targetX: 0,
	targetY: 0,
	countSameJewelTypeX: 0,
	countSameJewelTypeY: 0,
	check: function(object) { // Cek fungsi objek
		this.nextCheckX = true
		this.beforeCheckX = true
		this.nextCheckY = true
		this.beforeCheckY = true
		this.object = object 
		this.objectTypeJewel = this.object.attr("dataImage")
		this.targetX = parseInt(this.object.attr("dataX"))
		this.targetY = parseInt(this.object.attr("dataY"))
		this.checkX()
	},

	checkX: function() { // Cek ketika objek sejajar horizontal
		this.destroyItemX = ""
		this.countSameJewelTypeX = 0
		while(this.nextCheckX){
			this.targetX += 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemX += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeX+=1
			} else {
				this.targetX = parseInt(this.object.attr("dataX"))
				this.nextCheckX = false
			}
		}

		while(this.beforeCheckX) { 
			this.targetX -= 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemX += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeX+=1
			} else {
				this.targetX = parseInt(this.object.attr("dataX"))
				this.beforeCheckX = false
			}
		}
		this.checkY()
	},

	checkY: function() { // Cek ketika objek sejajar vertikal
		this.destroyItemY = ""
		while(this.nextCheckY){
			this.targetY += 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemY += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeY+=1
			} else {
				this.targetY = parseInt(this.object.attr("dataY"))
				this.nextCheckY = false
			}
		}

		while(this.beforeCheckY) {
			this.targetY -= 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemY += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeY+=1
			} else {
				this.targetY = parseInt(this.object.attr("dataY"))
				this.beforeCheckY = false
			}
		}
		this.destroyAction()
	},

	destroyAction: function() { // Mengganti block yang hilang ketika 3 baris sejajar
		if(this.countSameJewelTypeX > 1) {
			var arr = this.destroyItemX.split(",")
			arr[0] = this.object.attr("dataY")+""+this.object.attr("dataX")
			for(i = 0; i < arr.length;i++) {
				var rand = Math.random()+""
				var arrRand = rand.split('')
				if(arrRand[15] == "0") {
					arrRand[15] = "1"
				}
				$("#"+arr[i]).attr("src","images/"+arrRand[15]+".png")
				$("#"+arr[i]).attr("dataImage",arrRand[15]+"")
			}
		}

		if(this.countSameJewelTypeY > 1) {
			var arr = this.destroyItemY.split(",")
			arr[0] = this.object.attr("dataY")+""+this.object.attr("dataX")
			for(i = 0;i < arr.length;i++) {
				var rand = Math.random()+""
				var arrRand = rand.split('')
				if(arrRand[15] == "0") {
					arrRand[15] = "1"
				}
				$("#"+arr[i]).attr("src","images/"+arrRand[15]+".png")
				$("#"+arr[i]).attr("dataImage",arrRand[15]+"")
			}
		} 
		// Peraturan score
		if (this.countSameJewelTypeX+1 > 5 && this.countSameJewelTypeY+1 > 5) {
			Player.setPoint(15)
		} else if (this.countSameJewelTypeX+1 >= 5 || this.countSameJewelTypeY+1 >= 5) {
			Player.setPoint(15)
		} else if (this.countSameJewelTypeX+1 == 4 || this.countSameJewelTypeY+1 == 4) {
			Player.setPoint(12)
		} else if (this.countSameJewelTypeX == 2 || this.countSameJewelTypeY == 2) {
			Player.setPoint(9)
		}
		
		this.countSameJewelTypeX = 0
		this.countSameJewelTypeY = 0
	}
}

var Timing = { // Variabel timer game pertama
	nowTime: 60, // Timer game pertama
	startTiming: function() {
		Timing.setToScreen()
		setTimeout(function(){
			if(Timing.nowTime == -1) {
				ServerJewel.setScore()
				Game.isStarted = false
				alert("GAME IS OVER !!!") // Ketika waktu habis, keluar alert game over
				$(".playAgain").fadeIn() // Tombol play again muncul
			} else {
				Timing.startTiming()
			}
		},1000)
		Timing.nowTime -= 1
	},

	setToScreen: function() { // Text timer ditaruh pada layar
		$("#playerTime").text(Timing.nowTime+" second")
	}
}

var Jewel = function(number) { 
	this.number = number // Memberi variabel nomer pada jewel
}

var ServerJewel = { // Untuk menambah score
	setScore: function() {
		$.ajax({
			data: {name: Player.name, score: Player.point},
			success: function(response) {
				ServerJewel.getScroe()
			}
		})
	},

	getScroe: function() {
		$.ajax({

			data: {name: Player.name, score: Player.point},
			success: function(response) {
				ServerJewel.setToScreen(response)
			}
		})
	},

	setToScreen: function(data) { // Text score ditaruh pada layar
		var dataScore = JSON.parse(data)
		$(".nameT").text(dataScore.name)
		$(".scoreT").text(dataScore.score)
	}
} 

$("#buttonStart").click(function() { // Function Button > START GAME < pada layar awal
	Game.start()
})

$(".playAgain").click(function() { // Function Button Play Again
	$(".countDown h1").text("3")
	$(".countDown h1").fadeIn()
	Game.playAgain()
})
