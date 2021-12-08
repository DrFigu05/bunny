function switchfunction(){
    if(index.container.buttons.btn.btn-1 == 'active'){
        document.getElementsByClassName('swipeleft').style.animation = 'swipeleftkey 2s infinite'
    }

    else{
        document.getElementsByClassName('swipeleft').style.animation = ''
    }
}

var btn1 = document.getElementsByClassName('btn btn-1')[0];
btn1.addEventListener("mouseover", function(){
    setInterval(function() {       
        switchfunction();
    }, 500);
})