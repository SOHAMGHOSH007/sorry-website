// WAIT FOR PAGE LOAD
window.onload = function () {

document.getElementById("startBtn").addEventListener("click", () => {

startVideo()

// 🔥 FAKE FACE SCAN TEXT
showScanText()

// 🔥 AUTO UNLOCK (illusion)
setTimeout(() => {
unlockWebsite()
}, 1800)

})

}


// pages
const page1 = document.getElementById("page1")
const page2 = document.getElementById("page2")
const page3 = document.getElementById("page3")
const page4yes = document.getElementById("page4yes")
const page4no = document.getElementById("page4no")

// video
const video = document.getElementById("video")

// canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// audio
const song = document.getElementById("song")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let bricks = []
let shapeIndex = 0

// brick image
const brickImage = new Image()
brickImage.src = "images/brick.png"


// 🎥 START CAMERA (just for feel)
function startVideo(){

navigator.mediaDevices.getUserMedia({
video: { facingMode: "user" }
})
.then(stream=>{
video.srcObject = stream
video.play()
})
.catch(()=>{
console.log("camera blocked")
})

}


// 💖 SCAN TEXT EFFECT
function showScanText(){

let text = document.createElement("div")
text.innerText = "Scanning face... 👀"
text.style.position = "absolute"
text.style.bottom = "80px"
text.style.width = "100%"
text.style.textAlign = "center"
text.style.fontSize = "18px"
text.style.color = "white"
text.id = "scanText"

document.body.appendChild(text)

setTimeout(()=>{
text.innerText = "Face Recognized ❤️"
},1000)

}


// 🔓 UNLOCK WEBSITE
function unlockWebsite(){

// remove scan text
let t = document.getElementById("scanText")
if(t) t.remove()

page1.style.display = "none"
page2.style.display = "block"

// safe audio play
song.play().catch(()=>{})

startBricks()

}


// 🧱 START BRICKS
function startBricks(){

for(let i=0;i<320;i++){

bricks.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
vx:(Math.random()-0.5)*4,
vy:(Math.random()-0.5)*4
})

}

draw()

setTimeout(sunflower,1500)

}


// 🎨 DRAW
function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

bricks.forEach(b=>{

b.x+=b.vx
b.y+=b.vy

if(b.x<0||b.x>canvas.width) b.vx*=-1
if(b.y<0||b.y>canvas.height) b.vy*=-1

ctx.drawImage(brickImage,b.x,b.y,28,14)

})

requestAnimationFrame(draw)

}


// 🌻 SUNFLOWER
function sunflower(){

let cx = canvas.width/2
let cy = canvas.height/2

bricks.forEach((b,i)=>{
let angle = i*0.15
let r = 120

b.x = cx + Math.cos(angle)*r
b.y = cy + Math.sin(angle)*r
})

}


// 🎭 SHAPES
function panda(){
bricks.forEach(b=>{
b.x = canvas.width/2+(Math.random()*200-100)
b.y = canvas.height/2+(Math.random()*200-100)
})
}

function sailboat(){
bricks.forEach((b,i)=>{
b.x = canvas.width/2-150+i
b.y = canvas.height/2+Math.sin(i/8)*30
})
}

function bouquet(){
bricks.forEach((b,i)=>{
b.x = canvas.width/2+Math.cos(i)*80
b.y = canvas.height/2+Math.sin(i)*80
})
}


// 🔄 CHANGE SHAPE
function nextShape(){

shapeIndex++

if(shapeIndex==1) panda()
if(shapeIndex==2) sailboat()
if(shapeIndex==3) bouquet()

if(shapeIndex==4){
showQuote()
}

}


// ✨ QUOTE
function showQuote(){

page2.innerHTML = "<h2>My love for you is so deep that u also can't break it 💝</h2>"

setTimeout(()=>{
page2.style.display = "none"
page3.style.display = "block"
},8000)

}


// ❤️ BUTTONS
document.getElementById("yesBtn").onclick=()=>{
page3.style.display = "none"
page4yes.style.display = "block"
}

document.getElementById("noBtn").onclick=()=>{
page3.style.display = "none"
page4no.style.display = "block"
}

document.getElementById("loopBtn").onclick=()=>{
page4no.style.display = "none"
page2.style.display = "block"
}


// 📱 SHAKE DETECT
let last = 0

window.addEventListener("devicemotion",e=>{

let acc = e.accelerationIncludingGravity
let val = Math.abs(acc.x+acc.y+acc.z)

if(val-last>20){
explode()
nextShape()
}

last = val

})


// 💥 EXPLODE
function explode(){

bricks.forEach(b=>{
b.vx = (Math.random()-0.5)*10
b.vy = (Math.random()-0.5)*10
})

}
