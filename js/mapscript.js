var map,infowindow,locationCircle
var markers = []
var restaurants = []
var testim;
var infoBoxes = []

//parse the locally stored position object
var position = JSON.parse(localStorage.getItem('storedPosition'));


//set up the request that is passed to the map
var request = {
    location:  position,
    radius: document.getElementById("radius").value,
    type: "restaurant",
    price_level: 0,
    rating: 0,
}

var parent = document.getElementById('main-page-wrapper')

function createMap(){

    var options = {
        center:  position,
        zoom: 16,
        disableDefaultUI: true,
        styles: mapstyle,
        stylers:[
            {visibility : "off"}
        ]
    };

    map = new google.maps.Map(document.getElementById("map"),options);
   
    infowindow = new google.maps.InfoWindow;
    var service = new google.maps.places.PlacesService(map)


    var getNextPage = null;   

    function callback(results, status, pagination) {
        
        if (status == google.maps.places.PlacesServiceStatus.OK) {

        getNextPage = pagination.hasNextPage && function() {
            pagination.nextPage();
            
            };
        if(pagination.hasNextPage){
            getNextPage();
        }  

        parent = document.getElementById('main-page-wrapper')

          for (var i = 0; i < results.length; i++) {
            if(results[i].rating >= request.rating & results[i].price_level >= request.price_level){

                if(results[i].photos){
                    //console.log(results[i])
                    createImage(parent,results[i])

                }

                createMarker(results[i]);
            }
            
          }
        }
      }

    

    initCircle()

    service.nearbySearch(request,callback)
    
    document.getElementById("radius").addEventListener('change',function(){
    request.radius = this.value

    if (infoBoxes.length > 0){
        deleteRestaurants()
        infoBoxes = []
    }
    
    if (markers.length > 0){
        deleteMarker(markers)
    }

    initCircle()
    service.nearbySearch(request,callback)
    })


    //get numeric value of the rating
    //wait for change in the fieldset tag
    document.getElementById('pricing').addEventListener('change',function(){
        //loop through input tags to find the "checked" input tag
        for (item of document.getElementById('pricing').getElementsByTagName('input')){
            if(item.checked){
                request.price_level = parseFloat(item.value) //return the checked value

            }
     
        }
        if (infoBoxes.length > 0){
            deleteRestaurants()
            infoBoxes = []
        }


        if(markers.length > 0){
            deleteMarker(markers)
        }
        service.nearbySearch(request,callback)
    })


    

    //get numeric value of the rating
    //wait for change in the fieldset tag
    document.getElementById('rating').addEventListener('change',function(){
        //loop through input tags to find the "checked" input tag
        for (item of document.getElementById('rating').getElementsByTagName('input')){
            if(item.checked){
                request.rating = parseFloat(item.value) //return the checked value
            }
     
        }
        if (infoBoxes.length > 0){
            deleteRestaurants()
            console.log(infoBoxes)
            infoBoxes = []
        }
        if(markers.length > 0){
            deleteMarker(markers)
        }
        service.nearbySearch(request,callback)
    })

}




function createImage(parentDiv,element){
    //create the image element
    var img = document.createElement('img')
    var name = element.name;
    img.src = element.photos[0].getUrl({maxWidth: 250, maxHeight: 250});
    img.alt = name
    //add element to class
    img.classList.add("restaurant-image")
    

    // create div which will contain a restuarant proposal
    var subDiv = document.createElement('div')
    // add element to class
    subDiv.classList.add('restaurant-container')

    //create titlename header for each restaurant
    var subDivTitleText = document.createElement('div')
    //fetch name 
    subDivTitleText.innerHTML = name;
    //add element to class
    subDivTitleText.classList.add('restaurant-title')
    
    //fetch the rating element
    var ratingDiv = document.getElementById('rating')
    console.log(ratingDiv)

    //clone it
    //var ratingCloneDiv = ratingDiv.cloneNode(true);

    var ratingCloneDiv = createRatingDiv()


    

    var score = roundScoreValue(element.rating)

    colorRating(ratingCloneDiv,score)
    

    subDiv.appendChild(img)
    subDiv.appendChild(subDivTitleText)
    subDiv.appendChild(ratingCloneDiv)
    parentDiv.appendChild(subDiv)
    infoBoxes.push(subDiv)

}


//create the 
function createRatingDiv(){
    var fieldset = document.createElement('fieldset')
    fieldset.classList.add('restaurant-rating')
    for(var i = 0; i < 5; i+=0.5){

        var starValue = 5 - i

        var input = document.createElement('input')
        input.type = 'radio'
        input.value = starValue
        var label = document.createElement('label')

        
        if(Math.floor(starValue)!==starValue){
            label.classList.add('half')
        }else{
            label.classList.add('full')
        }

        fieldset.appendChild(input)
        fieldset.appendChild(label)
    }
    return fieldset
}


function roundScoreValue(score){
    var roundedScore = (Math.round(score * 2) / 2).toFixed(1)
    return roundedScore
}


function colorRating(ratingDiv,score){

    var ratingTags = ratingDiv.getElementsByTagName('input')
    
    for(var i = 0; i < ratingTags.length; i++){
        if(parseFloat(ratingTags[i].value) <= score){
            console.log(ratingTags[i])
            ratingTags[i].nextSibling.style.color = "#df6020"
        }


    }

}


function imageStyle(img){
    img.style.width = "200px"
    img.style.width = "200px"
}



function deleteRestaurants(){
        parent = document.getElementById('main-page-wrapper')
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.lastChild);
        }
}

function createMarker(place) {

    var image ={ 
        url: '../resources/images/sted_pil-01.svg',
        scaledSize: new google.maps.Size(32, 32)
} 
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: image
    });
    markers.push(marker)

    google.maps.event.addListener(marker, "click", () => {
      infowindow.setPosition(place.geometry.location)
      infowindow.setContent(place.name);
      infowindow.open(map);
    });
   
  }

function deleteMarker(markers){
    for(var i=0; i < markers.length; i++){
        markers[i].setMap(null);
    }
    markers = []
}


function initCircle(){
        var newCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.1,
        map,
        center: request.location,
        radius: Math.sqrt(request.radius**2)
    });

    locationCircle = newCircle
}

function deleteLocationCircle(){
    locationCircle.setMap(null)
}

function drawLocationCircle(){
    if(locationCircle){
        locationCircle.setMap(null)
    }
    
    locationCircle.radius = Math.sqrt(request.radius**2)
}



document.getElementById('radius').addEventListener('change',drawLocationCircle)

