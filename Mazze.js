   // 425 (X), 3 (Y) RECTANGLE
        // 542 (center X), 122 (center Y) CIRCLE
        var canvas = document.getElementById("mazecanvas");
        var context = canvas.getContext("2d");
        context.crossOrigin = "anonymous";
        var currRectX = 425;
        var currRectY = 3;
        var mazeWidth = 556;
        var mazeHeight = 556;
        var intervalVar;
        var picture = "mazetwo.png"
        function drawMazeAndRectangle(rectX, rectY) {
            makeWhite(0, 0, canvas.width, canvas.height);
            var mazeImg = new Image();
            var img = new Image();
            mazeImg.onload = function () {
                context.drawImage(mazeImg, 0, 0, canvas.width-60, canvas.height);
                drawRectangle(rectX, rectY, "blue");
                context.beginPath();
                // context.arc(542, 122, 7, 0, 2 * Math.PI, false);
                // setInterval(() => {
                    context.arc(Math.random()*canvas.width, Math.random()*canvas.height, 7, 0, 2 * Math.PI, false)
                    context.closePath();
                    context.fillStyle = '#00FF00';
                    context.fill()
                // }, 100)
;
            };
            mazeImg.src = picture;
            
        }


        function drawRectangle(x, y, style) {
            makeWhite(currRectX, currRectY, 15, 15);
            currRectX = x;
            currRectY = y;
            context.beginPath();
            context.rect(x, y, 15, 15);
            context.closePath();
            context.fillStyle = style;
            context.fill();
        }
    
        // 
    
        function moveRect(e) {
            var newX;
            var newY;
            var movingAllowed;
            e = e || window.event;
            switch (e.keyCode) {
                case 38:   // arrow up key
                case 87: // W key
                    newX = currRectX;
                    newY = currRectY - 3;
                    break;
                case 37: // arrow left key
                case 65: // A key
                    newX = currRectX - 3;
                    newY = currRectY;
                    break;
                case 40: // arrow down key
                case 83: // S key
                    newX = currRectX;
                    newY = currRectY + 3;
                    break;
                case 39: // arrow right key
                case 68: // D key
                    newX = currRectX + 3;
                    newY = currRectY;
                    break;
                default: return;
            }
            movingAllowed = canMoveTo(newX, newY);
            if (movingAllowed === 1) {      // 1 means 'the rectangle can move'
                drawRectangle(newX, newY, "#0000FF");
                currRectX = newX;
                currRectY = newY;
            }
            else if (movingAllowed === 2) { // 2 means 'the rectangle reached the end point'
                clearInterval(intervalVar);
                makeWhite(0, 0, canvas.width, canvas.height);
                context.font = "40px Arial";
                context.fillStyle = "blue";
                context.textAlign = "center";
                context.textBaseline = "middle";
                $('canvas').hide()
                //Jquery
                $('body').append('<h2 id="congrats">Congratulations!</h2>')
                picture = "mazethree.png";
                $("#restart").show(1200);
                //end jquery
                window.removeEventListener("keydown", moveRect, true);

            }
            //$('#congrats').remove()

           
        }
        function canMoveTo(destX, destY) {
            context.crossOrigin = "Anonymous";
            var imgData = context.getImageData(destX, destY, 15, 15);
            var data = imgData.data;
            var canMove = 1; // 1 means: the rectangle can move
            if (destX >= 0 && destX <= mazeWidth - 15 && destY >= 0 && destY <= mazeHeight - 15) {
                for (var i = 0; i < 4 * 15 * 15; i += 4) {
                    if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) { // black
                        canMove = 0; // 0 means: the rectangle can't move
                        break;
                    }
                    else if (data[i] === 0 && data[i + 1] === 255 && data[i + 2] === 0) { // #00FF00
                        canMove = 2; // 2 means: the end point is reached
                        break;
                    }
                }
            }
            else {
                canMove = 0;
            }
            return canMove;
        }
    
        function createTimer(seconds) {
            intervalVar = setInterval(function () {
                makeWhite(mazeWidth, 0, canvas.width - mazeWidth, canvas.height);
                if (seconds === 0) {
                    clearInterval(intervalVar);
                    window.removeEventListener("keydown", moveRect, true);
                    makeWhite(0, 0, canvas.width, canvas.height);
                    context.font = "40px Arial";
                    context.fillStyle = "red";
                    context.textAlign = "center";
                    context.textBaseline = "middle";
                    new Audio('./itt.mp3').play()
                    $('canvas').hide()
                   //Jquery
                    $('body').append(`<h2 id='slow'>Too Slow!</h2>`)
                    picture = "maze.png";
                    $("#restart").show(1200);
                    
                    //end Jquery
                  return;     
                }
                //Jquery. delete the "too slow" when you click on play again 
                $('#slow').remove()

                context.font = "20px Arial";
                if (seconds <= 10 && seconds > 5) {
                    context.fillStyle = "orangered";
                }
                else if (seconds <= 5) {
                    context.fillStyle = "red";
                }
                else {
                    context.fillStyle = "green";
                }
                context.textAlign = "center";
                context.textBaseline = "middle";
                var minutes = Math.floor(seconds / 60);
                var secondsToShow = (seconds - minutes * 60).toString();
                if (secondsToShow.length === 1) {
                    secondsToShow = "0" + secondsToShow; // if the number of seconds is '5' for example, make sure that it is shown as '05'
                }
                context.fillText(minutes.toString() + ":" + secondsToShow, mazeWidth + 30, canvas.height / 2);
                seconds--;
            }, 1000);
        }
        
        // function timer(){
        //     let seconds = 0;
        //     let int = setInterval(function(){
        //         seconds++;
        //         document.getElementById('timer').innerText = seconds
                
        //     },1000)
        // }
        
        function makeWhite(x, y, w, h) {
            context.beginPath();
            context.rect(x, y, w, h);
            context.closePath();
            context.fillStyle = "white"           
            context.fill();
        }


        function StartGame(){
        drawMazeAndRectangle(425, 3);
        window.addEventListener("keydown", moveRect, true);
        createTimer(90); // 1.5 minutes
        $('canvas').show()
        }
