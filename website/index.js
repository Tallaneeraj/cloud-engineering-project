var gamePattern = [];
var started = false;
var level=0;
var userClickedPattern = [];


const buttonColours = ["red", "blue", "green", "yellow"];


function nextSequence()
{
    userClickedPattern = [];
    level = level+1;
    $("#level-title").html("Level  "+ level);
    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColours [randomNumber];
    gamePattern.push(randomChosenColour);
    $('#'+ randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour)
   
    


}

$(".btn1").click(function() {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    //console.log(userClickedPattern);
   
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length-1);
});

function playSound(name){
    console .log(this.name);
    var audio = new Audio("sounds/" + name+ ".mp3");
  audio.play();
}

function animatePress(name){
    $("#"+name).addClass("pressed");
    setTimeout(function () {
        $("#"+name).removeClass("pressed");     
    }, 100);

}

$(".btn").click(function () {
    if (started==false){
        $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
    }
    $(".title").addClass("hidden");
    $(".container-fluid").removeClass("hidden");
    
})




function checkAnswer(currentLevel) {

    //3. Write an if statement inside checkAnswer() to check if the most recent user answer is the same as the game pattern. If so then log "success", otherwise log "wrong".
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {

      console.log("success");

      //4. If the user got the most recent answer right in step 3, then check that they have finished their sequence with another if statement.
      if (userClickedPattern.length === gamePattern.length){

        //5. Call nextSequence() after a 1000 millisecond delay.
        setTimeout(function () {
          nextSequence();
        }, 1000);

      }

    } else {

      $("body").addClass("game-over");
      setTimeout(function () {$("body").removeClass("game-over");},500);
      $("#level-title").text("Game Over, Press Any Key to Restart");
      playSound("wrong");
      $(".title").removeClass("hidden");
      $(".container-fluid").addClass("hidden");
      startOver();

    }

}

function startOver(){
    level=0;
    gamePattern = [];
    started = false;
    $(".btn").removeClass("hidden");
}

