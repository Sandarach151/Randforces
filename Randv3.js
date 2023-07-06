window.onload=function(){
    var startTime = Date.now();
    var clock = document.getElementById("clock");
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var play = true;
    var stoptime = 0;
    function draw(){
        var timePassed = Date.now()-startTime;
        timePassed = Math.floor(timePassed/1000);
        hours = Math.floor(timePassed/3600);
        timePassed -= hours*3600;
        minutes = Math.floor(timePassed/60);
        timePassed -= minutes*60;
        seconds = timePassed;
        var curTime = "";
        if(hours<10){
            curTime+="0"+hours+":";
        }
        else{
            curTime+=hours+":";
        }
        if(minutes<10){
            curTime+="0"+minutes+":";
        }
        else{
            curTime+=minutes+":";
        }
        if(seconds<10){
            curTime+="0"+seconds;
        }
        else{
            curTime+=seconds;
        }
        clock.innerHTML = curTime;
        if(play==true){
            window.requestAnimationFrame(draw);
        }
    }
    draw();
    var resetbtn = document.getElementById("reset");
    resetbtn.addEventListener("click", function(){
        if(play==true){
            startTime = Date.now();
        }
        else{
            startTime = Date.now();
            stoptime = -1;
            draw();
        }
    })
    var playbtn = document.getElementById("pause-play");
    playbtn.addEventListener("click", function(){
        if(play==true){
            play=false;
            stoptime = Date.now();
            playbtn.style.backgroundColor = "#c6c6c6";
        }
        else{
            play=true;
            if(stoptime==-1){
                startTime=Date.now()-700;
            }
            else{
                startTime+=Date.now()-stoptime;
            }
            draw();
            playbtn.style.removeProperty("background-color");
        }
    })
};

function getProblem(){
    document.getElementById("mincontestid").defaultValue=0;
    document.getElementById("minrating").defaultValue=800;
    document.getElementById("maxrating").defaultValue=3500;
    const minContestId = document.getElementById("mincontestid").value;
    const minRating = document.getElementById("minrating").value;
    const maxRating = document.getElementById("maxrating").value;
    var probTable = document.getElementById("suggestedproblems");
    var btn = document.getElementById("submit");
    btn.className = "button is-light is-fullwidth is-large is-loading";
    fetch("https://codeforces.com/api/problemset.problems")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        const startTime = Date.now();
        var probFound = false;
        while((Date.now()-startTime)<=4000){
            let randPos = Math.max(Math.floor(Math.random()*data.result.problems.length)-1, 0);
            let checkContestId = data.result.problems[randPos].contestId>=minContestId;
            let checkRating = data.result.problems[randPos].rating>=minRating && data.result.problems[randPos].rating<=maxRating;
            if(checkContestId==true && checkRating==true){
                if(probTable.rows.length>7){
                    probTable.deleteRow(-1);
                }
                var row = probTable.insertRow(1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var linkk = document.createElement('a');
                linkk.href = "https://codeforces.com/problemset/problem/"+data.result.problems[randPos].contestId+"/"+data.result.problems[randPos].index;
                linkk.target = "_blank";
                linkk.rel = "noopener";
                linkk.innerHTML = data.result.problems[randPos].contestId+data.result.problems[randPos].index;
                cell1.innerHTML = data.result.problems[randPos].name;
                cell2.appendChild(linkk);                           
                probFound = true;
                break;
            }
        }        
        btn.className = "button is-light is-fullwidth is-large";
    });
};