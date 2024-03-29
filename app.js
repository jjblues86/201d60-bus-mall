'use strict';

// Grabbing all the global images
var container = document.getElementById('main-container');
var leftImage = document.getElementById('left-image');
var centerImage = document.getElementById('center-iamge');
var rightImage = document.getElementById('right-image');
var leftImagePara = document.getElementById('left-para');
var centerImagePara = document.getElementById('center-para');
var rightImagePara = document.getElementById('right-para');

// counter for total clicks
var totalClicks = 0;
var previousImage = [];
var allImages = [];
var clickLimit = 25;


var img = [
  

  { imageSrc:'assets/bag.jpg', name:'bag'},
  { imageSrc:'assets/banana.jpg', name:'banana'},
  { imageSrc:'assets/bathroom.jpg', name:'bathroom'},
  { imageSrc:'assets/boots.jpg', name:'boots'},
  { imageSrc:'assets/breakfast.jpg', name:'breakfast'},
  { imageSrc:'assets/bubblegum.jpg', name:'bubblegum'},
  { imageSrc:'assets/chair.jpg', name:'chair'},
  { imageSrc:'assets/cthulhu.jpg', name:'cthulhu'},
  { imageSrc:'assets/dog-duck.jpg', name:'dog-duck'},
  { imageSrc:'assets/dragon.jpg', name:'dragon'},
  { imageSrc:'assets/pen.jpg', name:'pen'},
  { imageSrc:'assets/pet-sweep.jpg', name:'pet-sweep'},
  { imageSrc:'assets/scissors.jpg', name:'scissors'},
  { imageSrc:'assets/shark.jpg', name:'shark'},
  { imageSrc:'assets/sweep.png', name:'sweep'},
  { imageSrc:'assets/tauntaun.jpg', name:'tauntaun'},
  { imageSrc:'assets/unicorn.jpg', name:'unicorn'},
  { imageSrc:'assets/usb.gif', name:'usb'},
  { imageSrc:'assets/water-can.jpg', name:'water-can'},
  { imageSrc:'assets/wine-glass.jpg', name:'wine-glass'},

];

// Images constructor
var Images = function(name, imageUrl){
  this.name = name;
  this.imageSrc = imageUrl;
  this.clicks = 0;
  this.views = 0;
  // allImages.push(this);
}


// looping through the images
for(var i = 0; i < img.length; i++){
  allImages.push(new Images(img[i].name, img[i].imageSrc));
}
console.log(allImages);


// calculating random images to display 
var randomImages = function(){
  return Math.floor(Math.floor(Math.random() * img.length));
}

// pick random images and also take care of double images
var pickRandomImages = function(){

  previousImage = [];

  var leftIndex = randomImages();
  var leftImage = allImages[leftIndex];
  previousImage.push(leftIndex);

  var centerIndex = randomImages();
  while(centerIndex == leftIndex){
    centerIndex = randomImages();
  }
  var centerImage = allImages[centerIndex];
  previousImage.push(centerIndex);
  console.log(centerImage);

  var rightIndex = randomImages();
  while(rightIndex == centerIndex || rightIndex == leftIndex){
    rightIndex = randomImages();
  } 
  var rightImage = allImages[rightIndex];
  previousImage.push(rightIndex);

}

// rendering different images
var renderRandomImages = function(){
 
var leftEl = document.getElementById('left-image');
var centerEl = document.getElementById('center-image');
var rightEl = document.getElementById('right-image');

var leftText = document.getElementById('left-para');
var centerText = document.getElementById('center-para');
var rightText = document.getElementById('right-para');

// images rendered on the left side 
leftEl.setAttribute('src', allImages[previousImage[0]].imageSrc);
leftText.textContent = (allImages[previousImage[0]].name);
leftEl.dataset.imageIndex = previousImage[0];
allImages[previousImage[0]].views++;

//images rendered on in the center
centerEl.setAttribute('src', allImages[previousImage[1]].imageSrc);
centerText.textContent = (allImages[previousImage[1]].name);
centerEl.dataset.imageIndex = previousImage[1];
allImages[previousImage[1]].views++;

// images rendered on the right side      
rightEl.setAttribute('src', allImages[previousImage[2]].imageSrc);
rightText.textContent = (allImages[previousImage[2]].name)
rightEl.dataset.imageIndex = previousImage[2];
allImages[previousImage[2]].views++;

}
pickRandomImages();
renderRandomImages();

// Creating an Event handler
container.addEventListener('click', handleClick);

function handleClick(event){
console.log('handle click', event.target);
console.log(event.target.dataset.imageIndex);
var imageClick = parseInt(event.target.dataset.imageIndex);
allImages[imageClick].clicks++;
pickRandomImages();
renderRandomImages();
totalClicks++;
imageLikes();
}

// displaying the amount of likes for each image
var imageLikes = function(){
  if(totalClicks < clickLimit){
    renderRandomImages();
  }
   else {
    container.removeEventListener('click', handleClick);
    // totalClicks = JSON.parse(localStorage.getItem('totalClicks'));
    var allImagesJson = JSON.stringify(allImages);
    localStorage.setItem('allImages', allImagesJson);
    localStorage.getItem('allImages')

    allImagesJson = JSON.parse(localStorage.getItem('allImages'));


    makeChart();
    chartData();
  }
}

// global variables with empty arrays to push each category required onto the chart
var imageClicks = [];
var imageViews = [];
var imageName = [];


var makeChart =  function() {
  document.getElementById('main-container').style.display = 'show';
  for(var i = 0; i < allImages.length; i++){
    imageName.push(allImages[i].name);
    imageViews.push(allImages[i].views);
    imageClicks.push(allImages[i].clicks);
    // localStorage.getItem = JSON.parse(totalClicks, allImages);
  }
}

// function to save to localstorage
// function saveDataToLocalStorage(allImages){
//   var imagesData = [];
//   for(var i = 0; i < allImages.length; i++){
//     imagesData.push(allImages[i]);
//   }
//   console.log(JSON.stringify(imagesData));
//   localStorage.imagesData = JSON.stringify(imagesData);

// }
// saveDataToLocalStorage(allImages);

// Creating a chart
function chartData(){
var ctx = document.getElementById('voteChart').getContext('2d');

// dynamically rendering the background colors of each bar chart
var randomColor = {
  beforeInit: function(chart) {
    var backgroundColor = [];
    var borderColor = [];

    // loop through every data available
    for(var i = 0; i < chart.config.data.datasets[0].data.length; i++){

      // generate random color
      var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";

      // push the new color to the background and border color arrays
      backgroundColor.push(color + "0.2)");
      borderColor.push(color + "1)");
    }

    // update the chart bars color properties
    chart.config.data.datasets[0].backgroundColor = backgroundColor;
    chart.config.data.datasets[0].borderColor = borderColor;

  }
}

// register the plugin to the chart's plugin service to activate it
Chart.pluginService.register(randomColor);

var imageChart = new Chart(ctx, {
  // The type of chart you want to create
  type: 'bar',
  data: {
    labels: imageName,
    datasets: [{
      label: 'Number of Votes',
      data: imageClicks,
      backgroundColor: '#44448',
      borderWidth: 1
    }, {
      label: 'Number of Views',
      data: imageViews,
      backgroundColor: 'rgba(48, 64, 132, 0.2',
      borderColor: 'rgba(25, 19, 13, 1)',
      borderWidth: 1
    }],
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          autoSkip: false,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    }
  }
});
}