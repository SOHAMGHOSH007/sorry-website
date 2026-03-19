// WAIT FOR PAGE LOAD
window.onload = function(){

// START BUTTON
document.getElementById("startBtn").onclick = () => {
startVideo()
}

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

// face matcher
let faceMatcher


// LOAD MODELS
Promise.all([
faceapi.nets.tinyFaceDetector.loadFromUri('models'),
faceapi.nets.faceLandmark68Net.loadFromUri('models'),
faceapi.nets.faceRecognitionNet.loadFromUri('models')
]).then(loadReferenceFace)


// LOAD REFERENCE FACES
async function loadReferenceFace(){

const img1 = await faceapi.fetchImage("faces/gf.jpeg")
const img2 = await faceapi.fetchImage("faces/gf1.jpeg")

const det1 = await faceapi
.detectSingleFace(img1)
.withFaceLandmarks()
.withFaceDescriptor()

const det2 = await faceapi
.detectSingleFace(img2)
.withFaceLandmarks()
.withFaceDescriptor()

const labeled = new faceapi.LabeledFaceDescriptors("allowed", [
det1.descriptor,
det2.descriptor
])

faceMatcher = new faceapi.FaceMatcher(labeled, 1.0)

}


// START CAMERA
function startVideo(){

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream=>{
video.srcObject = stream
video.play()
})
.catch(err=>{
alert("Allow camera to continue ❤️")
})

}


// FACE DETECTION
video.addEventListener("play",()=>{

setInterval(async()=>{

const detections = await faceapi
.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions())
.withFaceLandmarks()
.withFaceDescriptors()

const result = faceMatcher.findBestMatch(detections[0].descriptor)

// ultra loose accept
if(result.distance < 0.8){
unlockWebsite()
}

const result = faceMatcher.findBestMatch(detections[0].descriptor)

// ultra loose accept
if(result.distance < 0.8){
unlockWebsite()
}

}

},1000)

})


// UNLOCK WEBSITE
function unlockWebsite(){

page1.classList.add("hidden")
page2.classList.remove("hidden")

song.play()

startBricks()

}


// START BRICKS
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


// DRAW
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


// SUNFLOWER
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


// SHAPES
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


// CHANGE SHAPE
function nextShape(){

shapeIndex++

if(shapeIndex==1) panda()
if(shapeIndex==2) sailboat()
if(shapeIndex==3) bouquet()

if(shapeIndex==4){
showQuote()
}

}


// QUOTE
function showQuote(){

page2.innerHTML = "<h2>Sometimes things fall apart, for a better beginning</h2>"

setTimeout(()=>{
page2.classList.add("hidden")
page3.classList.remove("hidden")
},10000)

}


// BUTTONS
document.getElementById("yesBtn").onclick=()=>{
page3.classList.add("hidden")
page4yes.classList.remove("hidden")
}

document.getElementById("noBtn").onclick=()=>{
page3.classList.add("hidden")
page4no.classList.remove("hidden")
}

document.getElementById("loopBtn").onclick=()=>{
page4no.classList.add("hidden")
page2.classList.remove("hidden")
}


// SHAKE
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


// EXPLODE
function explode(){

bricks.forEach(b=>{
b.vx = (Math.random()-0.5)*10
b.vy = (Math.random()-0.5)*10
})

}
