﻿//
// To learn more about this effect, go to: //www.kirupa.com/html5/the_falling_snow_effect.htm
//

// The star of every good animation
var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

var transforms = ["transform", 
                  "msTransform", 
                  "webkitTransform", 
                  "mozTransform", 
                  "oTransform"];
                   
var transformProperty = getSupportedPropertyName(transforms);

// Array to store our Snowflake objects
var snowflakes = [];

// Global variable to store our target element and the element which will overlay it.
var targetElement;
var overlayElement;

// Specify the number of snowflakes you want visible
var numberOfSnowflakes = 50;

// Flag to reset the position of the snowflakes
var resetPosition = false;

//
// It all starts here...
//
function setup() {
    window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
    window.addEventListener("resize", setResetFlag, false);
}
setup();

//
// Vendor prefix management
//
function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}

//
// Constructor for our Snowflake object
//
function Snowflake(element, speed, xPos, yPos) {

    // set initial snowflake properties
    this.element = element;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    
    // declare variables used for snowflake's motion
    this.counter = 0;
    this.sign = Math.random() < 0.5 ? 1 : -1;
    
    // setting an initial opacity and size for our snowflake
    this.opacity = .1 + Math.random();
    this.fontSize = 12 + Math.random() * 50 + "px";
}

//
// The function responsible for actually moving our snowflake
//
Snowflake.prototype.update = function () {

    // using some trigonometry to determine our x and y position
    this.counter += this.speed / 5000;
    this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
    this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;
    
    // setting our snowflake's position
    setPosition(this, Math.round(this.xPos), Math.round(this.yPos));
    
    // if snowflake goes below the bottom of the target element, move it back to the top
    if (this.yPos > targetElement.clientHeight + 50) {
        this.yPos = -50;
    }
}

//
// A performant(?) way to set your snowflake's position
//
function setPosition(flake, x, y) {
    var size = flake.fontSize;
    flake.element.font = size + ' Cambria';
    flake.element.fillText('.', x, y, 50);
    flake.element.fillStyle = 'rgba(255, 255, 255, ' + flake.opacity + ')';
}

// position the overlay over its target
function positionOverlay(){
    var targetRect = targetElement.getBoundingClientRect();
    overlayElement.style.top = targetRect.top;
    overlayElement.style.left = targetRect.left;
    overlayElement.setAttribute('width', targetRect.width);
    overlayElement.setAttribute('height', targetRect.height);
}

//
// The function responsible for creating the snowflake
//
function generateSnowflakes() {
    targetElement = document.querySelector('#content');
    overlayElement = document.querySelector('#snowflakeContainer');

    positionOverlay();
                
    // create each individual snowflake
    for (var i = 0; i < numberOfSnowflakes; i++) {  
        // set our snowflake's initial position and related properties
        var initialXPos = getPosition(50, targetElement.clientWidth);
        var initialYPos = getPosition(50, targetElement.clientHeight);
        var speed = 5+Math.random()*40;
        
        // create our Snowflake object
        var snowflakeObject = new Snowflake(overlayElement.getContext('2d'), 
                                            speed, 
                                            initialXPos, 
                                            initialYPos);
        snowflakes.push(snowflakeObject);
    }
    
    // call the moveSnowflakes function every 30 milliseconds
    moveSnowflakes();
}

//
// Responsible for moving each snowflake by calling its update function
//
function moveSnowflakes() {
    var ctx = overlayElement.getContext('2d');
    ctx.clearRect(0, 0, overlayElement.clientWidth, overlayElement.clientHeight);
    for (var i = 0; i < snowflakes.length; i++) {
        var snowflake = snowflakes[i];
        snowflake.update();
    }
    
    // Reset the position of all the snowflakes to a new value
    if (resetPosition) {
        positionOverlay();  
        for (var i = 0; i < snowflakes.length; i++) {
            var snowflake = snowflakes[i];
            
            snowflake.xPos = getPosition(50, targetElement.clientWidth);
            snowflake.yPos = getPosition(50, targetElement.clientHeight);
        }
        
        resetPosition = false;
    }
    
    requestAnimationFrame(moveSnowflakes);
}

//
// This function returns a number between (maximum - offset) and (maximum + offset)
//
function getPosition(offset, size) {
    return Math.round(-1*offset + Math.random() * (size+2*offset));
}

//
// Trigger a reset of all the snowflakes' positions
//
function setResetFlag(e) {
    resetPosition = true;
}