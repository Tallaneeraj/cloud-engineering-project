var gamePattern = [];
var started = false;
var level = 0;
var userClickedPattern = [];
var maxScore = 0;

const buttonColours = ["red", "blue", "green", "yellow"];

// Function to get views and max score from the Lambda function
function getViewsAndMaxScore() {
  $.ajax({
    url: 'https://iac2d7doybz4k65neqveffypla0evenb.lambda-url.ap-south-1.on.aws/',
    method: 'GET',
    success: function(data) {
      $('#views-count').text('Views: ' + data.views);
      $('#score-display').text('Max Score: ' + data.max_score);
      maxScore = data.max_score;
    },
    error: function(error) {
      console.log('Error:', error);
      $('#views-count').text('Views: Error loading views');
      $('#score-display').text('Max Score: Error loading max score');
    }
  });
}

// Call the getViewsAndMaxScore function when the page loads
$(document).ready(function() {
  getViewsAndMaxScore();
});

function nextSequence() {
    userClickedPattern = [];
    level += 1;
    $("#level-title").html("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $('#' + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

$(".btn1").click(function() {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

function playSound(name) {
    var audio = new Audio("../website/sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(name) {
    $("#" + name).addClass("pressed");
    setTimeout(function() {
        $("#" + name).removeClass("pressed");
    }, 100);
}

$(".btn").click(function() {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
    $(".title").addClass("hidden");
    $(".container-fluid").removeClass("hidden");
    $("#score-display").addClass("hidden");
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 500);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        playSound("wrong");
        showScore();
        startOver();
    }
}

function showScore() {
    // Check if the current score is a new max score
    if (level - 1 > maxScore) {
        maxScore = level - 1;
        updateMaxScore(maxScore);
    }
    $("#score-display").removeClass("hidden");
    $("#score-display").text("Max Score: " + maxScore);
}

// Function to update the max score in the database
function updateMaxScore(newScore) {
  $.ajax({
    url: 'https://35guedfmtxc64ytc3uamg7jbm40uboiu.lambda-url.ap-south-1.on.aws/',
    method: 'POST',
    data: JSON.stringify({ new_score: newScore }),
    contentType: "application/json",
    success: function(data) {
      console.log('Max score updated successfully');
    },
    error: function(error) {
      console.log('Error:', error);
    }
  });
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    $(".title").removeClass("hidden");
    $(".container-fluid").addClass("hidden");
}