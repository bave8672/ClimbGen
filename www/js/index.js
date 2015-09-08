function grabId(e) //disambuguates event in firefox
{
	var e = window.event || e;
	var targ = e.target || e.srcElement;
}

function checkLoad() { //adds checkbox ontouch css swapping
	var checkbuttons = document.getElementsByClassName("checkbutton");
	for (i = 0; i < checkbuttons.length; i++) {
		checkbuttons[i].addEventListener("touchend", function(e) {
			grabId(e);
		    var box = document.getElementById(e.target.id);
		    if ( box.classList.contains("checkedbg") ) {
		        box.classList.remove("checkedbg");
				var html = box.innerHTML;
				html = html.replace("✗", "✓");
				box.innerHTML = html;
		    }
		    else { 
				box.classList.add("checkedbg");
				var html = box.innerHTML;
				html = html.replace("✓", "✗");
				box.innerHTML = html;
			 }
		}, false);
	}
}

function blockMove(e) {
	grabId(e);
	if(event.target.type != 'range'){
		event.preventDefault(); //Prevents scrolling
	}
}

function settingsDisp() {
	background.classList.remove("aboutColor");
	background.classList.add("settingsColor");
	document.getElementById("results").style.display = "none";
	document.getElementById("about").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("settings").style.display = "block";
	$('#about').removeClass('animated bounceInUp');
	$('#results').removeClass('animated bounceInUp');
	$('#settings').addClass('animated bounceInUp');
	
	adTicker++;
	if (AdMob && adTicker % 2 == 0) {
		AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} ); 
	}
}

function settingsCollapse() {
	background.classList.remove("settingsColor");
	document.getElementById("settings").style.display = "none";
	document.getElementById("about").style.display = "none";
	document.getElementById("results").style.display = "block";
	$('#settings').removeClass('animated bounceInUp');
}

function about() {
	background.classList.add('aboutColor');
	document.getElementById("results").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("about").style.display = "block";
	$('#results').removeClass('animated bounceInUp');
	$('#settings').removeClass('animated bounceInUp');
	$('#about').addClass('animated bounceInUp');
}



//##################
//################## 	Stuff below here is the actual generator algorithm

var csv = "Name,Style,Attribute,Weight Belt; 30 mins working boulder projects,boulder,power,FALSE; 30 mins working top rope projects,topRope,power,FALSE; 30 mins working lead projects,lead,power,FALSE; 6 x attempts on hard boulder problems,boulder,power,FALSE; 6 x attempts on hard powerful top rope routes,topRope,power,FALSE; 4 x attempts on hard powerful lead routes,lead,power,FALSE; 30 mins fingerboard routine,fingerBoard,power,FALSE; 30 mins campusboard routine,campusBoard,power,FALSE; 30 mins fingerboard routine wearing weight belt,campusBoard,power,TRUE; 6 x boulder problems campus-only,boulder,power,FALSE; 6 x attempts on moderate/hard boulders wearing weight belt,boulder,power,TRUE; 6 x attempts on moderate/hard steep top rope routes wearing weight belt,topRope,power,TRUE; 5 x attempts on a 30-move circuit,boulder,endurance,FALSE; 4 x attempts on a 40 move circuit,boulder,endurance,FALSE; 3 x attempts on a 50 move circuit,boulder,endurance,FALSE; 4 x up/up/up moderate/hard boulder problems,boulder,endurance,FALSE; 4 x up/down/up moderate/hard boulder problems,boulder,endurance,FALSE; 6 x up/up hard boulder problems,boulder,endurance,FALSE; 4 x up/up/up moderate boulder problems wearing weight belt,boulder,endurance,TRUE; 4 x up/down/up moderate boulder problems wearing weight belt,boulder,endurance,TRUE; 6 x up/up moderate boulder problems wearing weight belt,boulder,endurance,TRUE; 3 x traversing a bouldering wall for 5 minutes/until pumped,boulder,endurance,FALSE; 5 x hard endurance top rope routes,topRope,endurance,FALSE; 4 x hard endurance lead routes,lead,endurance,FALSE; 4 x moderate/hard top rope routes using 3-second rule,topRope,endurance,FALSE; 3 x moderate/hard lead routes using 3-second rule,lead,endurance,FALSE; 6 x moderate/hard boulder problems using 3-second-rule,boulder,endurance,FALSE; 5 x moderate boulder problems using 3-second-rule wearing weight belt,boulder,endurance,TRUE; 15 moderate boulder problems in 30 minutes,boulder,endurance,FALSE; 20 easy boulder problems in 30 minutes,boulder,endurance,FALSE";
var rowArr = csv.split(";"); // creates array containging the csv rows
var objArr = []; // 2D array to contain the whole thing
var admobid = {};
var adTicker = 0;

function genLoad() {
	
	for (var i = 0; i < rowArr.length; i++) {
	    var rowElements = rowArr[i].split(","); // splits array rows into elements
	    objArr.push(rowElements);
	}
	
	// select the right Ad Id according to platform
    if( /(android)/i.test(navigator.userAgent) ) { // for android
        admobid = {
            interstitial: 'ca-app-pub-4771165042127419/5139067081'
        };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
        admobid = {
            interstitial: 'ca-app-pub-4771165042127419/7903948688'
        };
    } else { // for windows phone
        admobid = {
            interstitial: 'ca-app-pub-xxx/kkk'
        };
    }
}

function update() { //generates and displays workout from 2D array
	
	background.classList.remove("settingsColor");
	background.classList.remove("aboutColor"); //colour animations
	document.getElementById("results").innerHTML = "";
	document.getElementById("about").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("results").style.display = "none";
	$('#results').removeClass('animated bounceInUp');

	var debug = 0;
    var workout = [];

	var numEx = document.getElementById("sessionLength").value; // number of exercises
	var sFocus = document.getElementById("sessionFocus").value; // session focus

    var lead = !(document.getElementById("leadCheck").classList.contains("checkedbg"));
    var boulder = !(document.getElementById("boulderCheck").classList.contains("checkedbg"));
    var topRope = !(document.getElementById("topRopeCheck").classList.contains("checkedbg"));
    var fingerBoard = !(document.getElementById("fingerBoardCheck").classList.contains("checkedbg"));
    var campusBoard = !(document.getElementById("campusBoardCheck").classList.contains("checkedbg"));
	var weightBelt = !(document.getElementById("weightBeltCheck").classList.contains("checkedbg"));

    do { // builds array
        var rand = Math.floor(Math.random() * (objArr.length - 1)) + 1;
        var newEx = objArr[rand];
        workout.push(newEx[0]);
        var deleted = false; // prevents double deleting
		debug++;

        for (var i = 0; i < workout.length - 1; i++) {
            if (newEx[0] === workout[i]) {
                workout.pop();
                deleted = true;
            }
        }

        if (deleted === false) {		
            if (lead === false && newEx[1] === "lead") {	// select against unchecked types of climbing
                workout.pop();
				deleted = true;
            }
            if (boulder === false && newEx[1] === "boulder") {
                workout.pop();
				deleted = true;
            }
            if (topRope === false && newEx[1] === "topRope") {
                workout.pop();
				deleted = true;
            }
            if (fingerBoard === false && newEx[1] === "fingerBoard") {
                workout.pop();
				deleted = true;
            }
            if (campusBoard === false && newEx[1] === "campusBoard") {
                workout.pop();
				deleted = true;
            }
        }
	
		var focusDebug = 0;
	
		if (deleted === false) { // checks for session Focus
			if (sFocus == 0 && newEx[2] === "endurance") {
				workout.pop();
				deleted = true;
				focusDebug++;
			}
			else if (sFocus == 2 && newEx[2] === "power"){
				workout.pop();
				deleted = true;
				focusDebug++
			}
		}
	
		if (deleted === false) { // checks for weightbelt
			if (weightBelt === false && newEx[3] === "TRUE") {
				workout.pop();
				deleted = true;
			}
		}
	
		if (debug > 1000) { // ends script if there aren't enough exercises
			alert("Not enough exercises to fill your request. Please check at least one climbing discipline.");
			settingsDisp();
			break;
		}
    }
    while (workout.length < numEx);
    
	if (debug <=1000) {
		if (numEx < 4) {
		    var t = document.createTextNode("Warm up");
		    document.getElementById("results").appendChild(t);
		}
    
	    var list = document.createElement("ol");
	    list.id = "resultsList";
	    document.getElementById("results").appendChild(list);

	    for (var j = 0; j < workout.length; j++) // displays names 
	    {
	        var p = document.createElement("li");
	        var t = document.createTextNode(workout[j]);
	        p.appendChild(t);
	        document.getElementById("resultsList").appendChild(p);
	    }

		if (numEx < 4) {
		    var p = document.createElement("p");
		    var t = document.createTextNode("Warm down");
		    p.appendChild(t);
		    document.getElementById("results").appendChild(p);
		}
	
		document.getElementById("results").style.display = "block";
		$('#results').addClass('animated bounceInUp');
	
		setTimeout(function(){
			if (AdMob) {
				AdMob.showInterstitial(); 
			}
		},5000);
	}
}