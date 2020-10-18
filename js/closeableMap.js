
var clicked = false;
const mapButtonOpenId = 'openMap'; const mapButtonOpenText = 'View map'; 
const mapButtonCloseId = 'closeMap'; const mapButtonCloseText = 'X';

    button = createButton(mapButtonOpenId, mapButtonOpenText)
    
    var divParent = document.getElementById('mapBox')
    var divElement = document.getElementById('buttonBox')
    divElement.appendChild(button)

button.addEventListener('click',function(){
        closeButton = createButton(mapButtonCloseId, mapButtonCloseText)


        var theMap = document.getElementById('map');
  
        clicked = !clicked;

    if(clicked){

        divParent.style.height = "600px"

        divElement.style.height = "600px";
        divElement.style.width = "1200px";


        styleMapElementExpand(theMap)
        styleMapElementExpand(divElement)

        
        divElement.removeChild(button)
        divElement.appendChild(closeButton)

        closeButton.style.top = "1%"
        closeButton.style.left = "1170px"

        closeButton.addEventListener('click',function(){
            divParent.style.height = "200px"

            
            styleMapElementShrink(divElement)
            styleMapElementShrink(theMap)

            divElement.removeChild(closeButton)
            divElement.appendChild(button)
            

            
        })
    }
    
    });

    function styleMapElementShrink(element){
        element.style.margin = "0 auto";
        element.style.marginTop = "1%;";
        element.style.marginLeft = "80%"
        element.style.height = "200px";
        element.style.width = "300px";

    }


    function styleMapElementExpand(element){
        element.style.margin = "0 auto";
        element.style.marginTop = "1%"
        element.style.width = "1200px";
        element.style.height = "600px";
        element.style.position ="absolute"
        element.style.marginLeft = "10%"
    }



    function createButton(id,txt){
        var closeButton = document.createElement('BUTTON');
        var text = document.createTextNode(txt);
        closeButton.appendChild(text);
        closeButton.id = id;
        closeButton.style.position = "absolute"
        closeButton.style.left = "110px"
        closeButton.style.top = "80px"        
        closeButton.style.borderRadius = "50px"
        closeButton.style.width = "auto"
        closeButton.style.height = "auto"
        closeButton.style.fontSize = "15px"
        closeButton.style.backgroundColor = '#df6020'
        closeButton.style.zIndex = "2";
        return closeButton;
    }