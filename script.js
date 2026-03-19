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

// face matcher
let faceMatcher


// load models
Promise.all([
faceapi.nets.tinyFaceDetector.loadFromUri('models'),
faceapi.nets.faceLandmark68Net.loadFromUri('models'),
faceapi.nets.faceRecognitionNet.loadFromUri('models')
]).then(loadReferenceFace)



// load gf face
async function loadReferenceFace(){

const img = await faceapi.fetchImage("faces/gf.jpg")

const detection = await faceapi
.detectSingleFace(img)
.withFaceLandmarks()
.withFaceDescriptor()

const labeled = new faceapi.LabeledFaceDescriptors("gf", [detection.descriptor])

faceMatcher = new faceapi.FaceMatcher(labeled, 0.6)

startVideo()

}



// start camera
function startVideo(){

navigator.mediaDevices.getUserMedia({ video:{} })
.then(stream=>{
video.srcObject = stream
})

}



// detect face in camera
video.addEventListener("play",()=>{

setInterval(async()=>{

const detections = await faceapi
.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions())
.withFaceLandmarks()
.withFaceDescriptors()

if(detections.length>0){

const result = faceMatcher.findBestMatch(detections[0].descriptor)

if(result.label==="gf"){

unlockWebsite()

}

}

},1000)

})



// unlock site
function unlockWebsite(){

page1.classList.add("hidden")
page2.classList.remove("hidden")

song.play()

startBricks()

}



// start bricks
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



// draw bricks
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



// sunflower shape
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



// panda shape
function panda(){

bricks.forEach(b=>{
b.x = canvas.width/2+(Math.random()*200-100)
b.y = canvas.height/2+(Math.random()*200-100)
})

}



// sailboat shape
function sailboat(){

bricks.forEach((b,i)=>{
b.x = canvas.width/2-150+i
b.y = canvas.height/2+Math.sin(i/8)*30
})

}



// bouquet shape
function bouquet(){

bricks.forEach((b,i)=>{
b.x = canvas.width/2+Math.cos(i)*80
b.y = canvas.height/2+Math.sin(i)*80
})

}



// change shape
function nextShape(){

shapeIndex++

if(shapeIndex==1) panda()
if(shapeIndex==2) sailboat()
if(shapeIndex==3) bouquet()

if(shapeIndex==4){
showQuote()
}

}



// quote
function showQuote(){

page2.innerHTML = "<h2>Sometimes things fall apart, for a better beginning</h2>"

setTimeout(()=>{

page2.classList.add("hidden")
page3.classList.remove("hidden")

},10000)

}



// yes button
document.getElementById("yesBtn").onclick=()=>{

page3.classList.add("hidden")
page4yes.classList.remove("hidden")

}



// no button
document.getElementById("noBtn").onclick=()=>{

page3.classList.add("hidden")
page4no.classList.remove("hidden")

}



// loop button
document.getElementById("loopBtn").onclick=()=>{

page4no.classList.add("hidden")
page2.classList.remove("hidden")

}



// shake detection
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



// explode bricks
function explode(){

bricks.forEach(b=>{

b.vx = (Math.random()-0.5)*10
b.vy = (Math.random()-0.5)*10

})

}
