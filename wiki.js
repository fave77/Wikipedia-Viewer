window.onload = init;

function init() {
    var searchIcon = document.querySelector("i");
    searchIcon.addEventListener("click", searching);
    var canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var mouse = {
        x: undefined,
        y: undefined,
    };
    var colorPalette = ["rgb(44, 62, 80)", "rgb(231, 76, 60)", "rgb(236, 240, 241)", "rgb(52, 152, 219)", "rgb(41, 128, 185)"];
    window.addEventListener("resize", function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    window.addEventListener("mousemove", function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    });
    var circleCollection = [];
    for(var i=0; i<1000; i++){
        var radius = Math.random()*3 + 1;
        var x = Math.random() * (canvas.width - 2*radius) + radius;
        var y = Math.random() * (canvas.height - 2*radius) + radius;
        var dx = (Math.random() - 0.5) * 3;
        var dy = (Math.random() - 0.5) * 3;
        circleCollection.push(new Circle(x, y, dx, dy, radius, colorPalette, mouse, canvas));
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i=0; i<circleCollection.length; i++)
            circleCollection[i].update();
    }
    animate();
}

function searching () {
    var section = document.querySelector("section");
    var footer = document.querySelector("footer");
    var content = section.innerHTML;
    var div = document.querySelectorAll("div");
    var height = section.offsetHeight;
    for(var i=0; i<div.length; i++)
        section.removeChild(div[i]);
    section.setAttribute("style", "height: " + height + "px");
    var searchBox = document.createElement("input");
    searchBox.setAttribute("class", "animated rubberBand");
    var button = document.createElement("button");
    button.setAttribute("class", "animated rubberBand");
    section.appendChild(searchBox);
    section.appendChild(button);
    searchBox.addEventListener("keypress", scrape);
    button.onclick = function() {
        section.innerHTML = content;
        section.removeAttribute("class");
        footer.removeAttribute("style");
        init();
    }
}

function scrape(e) {
    var section = document.querySelector("section");
    var footer = document.querySelector("footer");
    var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=";
    var script = document.createElement("script");
    if(e.keyCode === 13){
        var div = document.querySelectorAll("div");
        for(var i=0; i<div.length; i++)
            section.removeChild(div[i]);
        url += this.value;
        script.src = url + "&callback=wiki";
        document.querySelector("body").appendChild(script);
        section.removeAttribute("style");
        section.setAttribute("class", "query");
        this.setAttribute("class", "field");
        footer.setAttribute("style", "display: none");
    }
}

function wiki(info) {
    var section = document.querySelector("section");
    var result = info["query"]["search"];
    for(var i in result){
        var div = document.createElement("div");
        div.setAttribute("class", "result animated lightSpeedIn");
        div.setAttribute("id", "click" + i);
        div.innerHTML = "<p>" + result[i]["title"] + "</p>" + result[i]["snippet"];
        section.appendChild(div);
        div.onclick = function(){
            window.open("https://en.wikipedia.org/?curid=" + result[this.id.charAt(5)]["pageid"]);
        };
    }
}

function Circle(x, y, dx, dy, r, colorPalette, mouse, canvas) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.minRadius = r;
    this.color = colorPalette[Math.floor(Math.random()*colorPalette.length)];
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
        ctx.fill();
    };
    this.update = function() {
        if(this.x + this.r > canvas.width || this.x - this.r < 0)
            this.dx = -this.dx;
        if(this.y + this.r > canvas.height || this.y - this.r < 0)
            this.dy = -this.dy;
        this.x += this.dx;
        this.y += this.dy;
        if(Math.abs(mouse.x-this.x)<50 && Math.abs(mouse.y-this.y)<50){
            if(this.r<50)
                this.r++;
        }
        else if(this.r>this.minRadius)
            this.r--;
        this.draw();
    };
}