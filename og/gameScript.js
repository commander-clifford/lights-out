//GLOBAL VARIABLES 
	var gridSize = 5;/*gridsize will set game board in 1:1 ratio (5 is default and minimum) using a for loop in the HTML
						changes to gridsize will disrupt current Style - New Layouts need to be added for larger gridsizes
						larger layouts could be generated based on gridsize variable
						changes to the gridsize will disrupt current pre-built levels*/
	var powerIO = 0;//Sences Power ON/OFF	
	var srtstp = 0;//Senses START/STOP button position 	
	var didReset=0;//senses RESET button position
	var resetbuttonChecked=0;//if reset was called from reset button-
								//(reset happens from power OFF and STOP as well). 
								//Reset via reset will reset current level, otherwise reset will clear the board with OFF and STOP 
	var timer = 0;//this is the timer var, used for the game timer
	var numClicks = 0;//tracks number of user clicks for score keeping and the display
	var numLevels = 26;//how many levels are there? this help var generates the levels
	var curLevel=0;//level indicator
	var selectORdisplay=0;//select=0/display=1

	/*DELETEgamedata is a new array - not sure what this will do
	//I'm not sure if this is used?
	var gameData = new Array();*/

//SOUND REGISTER
	createjs.Sound.registerSound("beep-high.mp3", "beepHigh", true);
	createjs.Sound.registerSound("beep-low.mp3", "beepLow", true);
	createjs.Sound.registerSound("beep-doubleHigh.mp3", "beepdoubleHigh", true);
	createjs.Sound.registerSound("beep-doubleHigh2.mp3", "beepdoubleHigh2", true);
	createjs.Sound.registerSound("beep-doubleLow.mp3", "beepdoubleLow", true);
	createjs.Sound.registerSound("beep-error.mp3", "beepError", true);
	createjs.Sound.registerSound("slide.mp3", "slide", true);
	createjs.Sound.registerSound("swoop.mp3", "swoop", true);	

//DOCUMENT READY
	$(document).ready(function(){//run this when the page is done loading
		fitui();//run fitui function
	//BIND some DIVs to the respective FUNCTIONS
		$('#power').bind('click', function(){powerToggle();});//bind the POWER BUTTON to the powerToggle function
		$('#reset').bind('click', function(){resetButton();});//bind the RESET BUTTON to the reset function 
		$('#start').bind('click', function(){StartStop();});//bind the START BUTTON to the StartStop function 
		$('#select').bind('click',function(){openlevelsBox();});//bind the Select button to the Select Level screen
		$('#levelsBoxbg').bind('click',function(){hidelevelsBox();});//bind select levels bg to hide levels box
		$('#help').bind('click',function(){openhelpBox();});//bind the HELP button to the help screen
		$('#helpBoxbg').bind('click',function(){hidehelpBox();});//bind help screen bg to hide help box
	});//end doc ready

//WINDOW RESIZE
	$(window).resize(function(){//run this on window resize
		fitui();//fit UI to screen size everytime the window is resized

	});//end window resize

//==FIT USER INTERFACE to WINDOW SIZE
	function fitui(){//fit UI to screen size
		winwidth = $(window).width();//get window width
		winheight = $(window).height();//get window height
		$('#wrapper').css('width', winwidth);//set outter wrapper to window size width
		$('#wrapper').css('height', winheight);//set outter wrapper to window size height
		var lightWidth = $('.row').width()-70;
		lightWidth = lightWidth/5;
		$('.oLight').css('width', lightWidth );
		$('.oLight').css('height', lightWidth*.8);
		$('.iLight').css('width', lightWidth );
		$('.iLight').css('height', lightWidth*.8);
		$('#gameInput').css('height', (winheight - $('#gameBoard').height()));
		$('#rightcol').css('height', (winheight - $('#gameBoard').height()));
		$('#leftcol').css('height', (winheight - $('#gameBoard').height()));//x2 to hold the scrolling preGame and Display
		$('#controls').css('height', (winheight - 15 - $('#gameBoard').height()));
		$('#preGame').css('height', (winheight - $('#gameBoard').height()));
		$('#display').css('height', (winheight - $('#gameBoard').height()));
		$('#display').css('top', (winheight - $('#gameBoard').height()));
		$('#lvlgenBox').css('height', $('#gameBoard').height());
		$('#lvlgenBox').css('width', ($('#gameBoard').width()));
		$('#lvlgenBox').css('left',($(window).width()/2) - ($('#lvlgenBox').outerWidth()/2));
		$('#lvlgenBox p').css('font-size', ($('#gameBoard').height())*.35);
		$('#lvlgenBox p#lvlnumber').css('font-size', ($('#gameBoard').height())*.60);
		centerhelpbox();
		centerlevelsbox();
	}

//POWER ON/OFF
	function powerToggle(){
		if(0==powerIO){//if POWER is OFF, switch to ON by running these...
			powerIO=1;//set the var to ON, allows other things to run...
			createjs.Sound.play('beepdoubleHigh');//sound ON
			$('#power .Ybutton').css('background-color',"#554996");//set POWER button to PURPLR(ON)
		}else if(1==powerIO){//if POWER is already ON, switch OFF by running these...
			createjs.Sound.play('beepdoubleLow');//sound OFF
			$('#power .Ybutton').css('background-color',"#FFEA00");//set POWER button to YELLO(OFF)
			//=====if POWER is switched OFF during game ask first=====//
			if($('.iLight').length >= 1){//if there are any lights ON, do this...
				resetGame();//run resetGame(ask player "are you are sure?"and set didReset to 1(yes) or 0(no))
				if(1==didReset){//if player did Resest the game(1(yes))
					//Play restart sound
					if(srtstp==1){//if START then STOP
						$('#start p').html('Start');//set STOP to START
						$('#start .Ybutton').css('background-color',"#FFEA00");//change Start button to YELLOW
						$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
						srtstp=0;
					}
					if(1==selectORdisplay){//if display is up
						movetoSelect();//move the select button into place
					}
					didReset=0;//set didReset back to 0, for next time this runs
					powerIO=0;//set POWER var to OFF
					curLevel=0;//reset curLevel	
				}	
			}else{//if there are NO lights ON
				powerIO=0;//set POWER var to OFF
				srtstp=0;//set StartStop to OFF
				curLevel=0;//reset curLevel
				if(1==selectORdisplay){//if display is up
					movetoSelect();//move the select button into place
				}
			}
		}
	}//end powerToggle function
tapped=0;
//START/STOP BUTTON
	function StartStop(){
		if(0==powerIO){powerToggle();}//if the Power is still OFF then run Power Toggle to turn it ON 
		if(1==powerIO){//if/when the Power is ON...
		didReset=0;
			createjs.Sound.play('beepdoubleHigh');//play sound
			if (0 == srtstp){//if stop, set START
				srtstp = 1;//set STARTED 
				$('#start p').html('Stop');//change START to STOP
				$('#start .Ybutton').css('background-color',"#554996");//change button to PURPLE
				setTimeout(timerCounter, 1000);//start timer counter after 1 sec
				
				if(tapped==0){//keeps Start from re-re-generating level
					levelGenerator(curLevel);//generate current level
				}
				if(0==selectORdisplay){//if the select button is up (==0)
					movetoDisplay();//slide the display into place(==1)
				}
			}else{//if start, set STOP...
				resetGame();//ask user if they are sure
				if(1 == didReset){//if user is SURE
					srtstp=0;//set STOPPED
					$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
					resetTimer();//reset timer counter and display
					$('#start p').html('Start');//set STOP to START
					$('#start .Ybutton').css('background-color',"#FFEA00");//change Start button to YELLOW
					movetoSelect();//slide the select button into place
				} 
			}
		}
	}

//TOGGLE LIGHT
	//click a light and the adjacent lights are also toggled{powerToggle/StartStop}
	function tapLight(obj){
		createjs.Sound.play('beepHigh');
		if(0==powerIO){powerToggle();}//if the Power is OFF then turn it ON
		if(0==srtstp){//if the game is STOP
			if(curLevel>0){//AND if lights are OFF
				tapped=1;	
				StartStop();//run Start of StartStop
			}
		}
		tapped=0;
		numClicks++;//increase user click count
		$('#clicks .displayOutput').html(numClicks);//display the increased number of clicks
		//get the row and col of the clicked cell *OBJ is the clicked cell* 
		var row=Number(obj.id.substr(4,1));//get row = make it a number(get OBJ ID, skip the first 4 characters, use the next 1 characters)*id=cell(X)x*
		var col=Number(obj.id.substr(5,1));//get col = make it a number(get OBJ ID, skip the first 5 characters, use the next 1 characters)*id=cellx(X)*
		//toggle the light of the clicked cell (OBJ)
	    $('#cell' + row + col).attr('class',($('#cell' + row + col).attr('class') == 'oLight') ? 'iLight' : 'oLight');
	    //toggle adjacent cells
	    $('#cell' + (row-1) + col).attr('class',($('#cell' + (row-1) + col).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell above the clicked cell (OBJ.id row-1 col)
	    $('#cell' + (row+1) + col).attr('class',($('#cell' + (row+1) + col).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell below the clicked cell (OBJ.id row+1 col)
	    $('#cell' + row + (col+1)).attr('class',($('#cell' + row + (col+1)).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell to the right of the clicked cell (OBJ.id row col+1)
	    $('#cell' + row + (col-1)).attr('class',($('#cell' + row + (col-1)).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell to the left of the clicked cell (OBJ.id row col-1)	
		//checkWin - if the game is START and all lights are OFF - Player Wins Level
		if(1==srtstp){//if the game is START
		    if($('.iLight').length >= 1){//AND if 1 or more lights are on - no win yet
				//no win, lights still on
			}else{ //AND if 0 lights are ON then Player Wins level
				winLevel();//run WIN LEVEL function
			}
		}
	}//end tapLight

	//WIN SEQUENCE - Runs inside tapLight
		function winLevel(){//if win then play next (pre-made,ease,med,hard,xxx)
			createjs.Sound.play('beepdoubleHigh');//winning sound
			//run loop animation of lights
				$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off
			setTimeout(function(){	
				$('.oLight').removeClass('oLight').addClass('iLight');//turn all lights ON
			},90);
			setTimeout(function(){
				//Decide which level was won then run appropriate function
				if((curLevel + 1)<numLevels){//if level is premade level
					levelGenerator(curLevel + 1);//generate next premade level
				}else if((curLevel + 1) == numLevels){//if level is last premade level	
					RDMlevelGenerator(numLevels+1);	
				}else if((curLevel) == numLevels+1){//if level is EASY RDM			
					RDMlevelGenerator(numLevels+2);
				}else if((curLevel) == numLevels+2){//if level is MED RDM
					RDMlevelGenerator(numLevels+3);
				}else if((curLevel) == numLevels+3){//if level is HARD RDM
					RDMlevelGenerator(numLevels+4);
				}else{
					RDMlevelGenerator(numLevels+4);
				}
			},180);
			setTimeout(function(){
			},1000);
		}
		
//RESET BUTTON
	//if the game is already reset, make the reset button call new function
	//the new function will bring the select button back on screen
	function resetButton(){
		if(0==powerIO){//if Power is OFF...
			powerToggle();//run Power Toggle to set Power ON
		}
		//else if(1 == powerIO){//if the Power is already ON...
			if(1==srtstp){//if the game is START do this...
				createjs.Sound.play('beepdoubleHigh');
				resetbuttonChecked=1;//tell clearBoard to Reset Level NOT clearAll
				resetGame();//run reset game function (ask user id SURE?)
				if(0==didReset){//if didReset is 0 do this...
					//cancel
				}else if(1==didReset){//if user is sure true(OK)
					clearBoard();
					$('#start p').html('Start');//change STOP to START
					$('#start .Ybutton').css('background-color',"#FFEA00");	//change the color of the purple button to YELLOW		
					srtstp=0;
				}
			}else if(0==srtstp){//if the game is STOP do this...
				$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
				createjs.Sound.play('beepdoubleLow');
				if(0==selectORdisplay){
					createjs.Sound.play('beepdoubleLow');//play error sound
				}else if(1==selectORdisplay){
					movetoSelect();//slide the select button onscreen
					
					//clearboard???double reset leaves level behind
					//didReset=0;//set didreset to 0
					//resetbuttonChecked=0;
				}
				
			}

		
	}//end resetButton
	//RESET GAME - ARE YOU SURE?
		//make sure the user wants to clear thier current progress
		function resetGame(){
				//if(1 == srtstp){
					var sure=confirm('Are you sure? This will clear your Progress!');
					if(true==sure){//if hit OK
						//set didReset to 1
						didReset=1;
						//clear the gameboard(either clear board or reset level(this happens in the clearBoard func))
						
					}else{//if hit CANCEL...
						//set didReset to 0
						didReset=0;
					}
				//} else if(0 == srtstp){
					//do nothing
				//}
			}
	//RESET CLICKS
		function resetClicks(){
			numClicks=0;//reset clicks counter back to 0
			$('#clicks .displayOutput').html(numClicks);//display the reset counter
		}
	//RESET TIMER
		function resetTimer(){
			timer=0;//reset clicks counter back to 0
			$('#timer .displayOutput').html(timer+':00');//display the new timer position
		}
	//CLEAR or REGEN GAMEOARD
		function clearBoard(){
			srtstp = 0;
			resetClicks();//set clicks to 0 and disply
			resetTimer();//set timer to 0 and display
			if(1==resetbuttonChecked){
				levelGenerator(curLevel);//reset the current level
			}else /*if(0==resetbuttonChecked)*/{
				$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
			}
		   	resetbuttonChecked=0;
		}//end clearBoard

//SELECT Screen vs. DISPLAY SCREEN
		function movetoSelect(){
			createjs.Sound.play('slide');
			$('#display').css('display','none');
			$('#display').animate({
				top: (winheight - $('#gameBoard').height())
			},500,function(){
				//when animation complete
			});


			$('#preGame').animate({
				top: 0
			},500,function(){
				//when animation complete
			});
			resetbuttonChecked=0;
			selectORdisplay=0;
		}
		function movetoDisplay(){
			createjs.Sound.play('slide');
			$('#display').css('display','block');
			$('#display').animate({
				top: 0
			},500,function(){
				//when animation complete
			});

			$('#preGame').animate({
				top: -(winheight - $('#gameBoard').height())
			},500,function(){
				//when animation complete
			});
			selectORdisplay=1;
		}
	
//==TIMER
	function timerCounter(){
		if(1 == srtstp){
			timer++;
			var seconds = timer %60;
			if(seconds<10){seconds = '0'+seconds;}
			var totalMinutes = Math.floor(timer/60);
			var minutes = totalMinutes%60;
			var hours = Math.floor(totalMinutes/60);
			if(hours<1){//if hours is 0
				var cvtimer =minutes+':'+seconds;
			}else if(hours>=1){//if hours is 1 or more
				var cvtimer =hours+':'+minutes+':'+seconds;
			}
			$('#timer .displayOutput').html(cvtimer);
			setTimeout(timerCounter, 1000);
		}
	}

//LEVELS BOX
	var levelsBoxstatus=0;
	function openlevelsBox(){//push the big Purple Button
		if(0==powerIO){powerToggle();} 
			levelsBoxstatus=1;
			createjs.Sound.play('slide');
			
			$('#levelsBox').fadeIn(500);
			$('#levelsBoxbg').fadeIn(500);
			centerlevelsbox();
	}
	function hidelevelsBox(){
		createjs.Sound.play('slide');
		levelsBoxstatus=0;
		$('#levelsBox').fadeOut(500);
		$('#levelsBoxbg').fadeOut(500);
	}
	function centerlevelsbox(){
	$('#levelsBox').css('left',($(window).width()/2) - ($('#levelsBox').outerWidth()/2));
	$('#levelsBox').css('width', winwidth / 1.5);
	$('#levelsBox').css('height', $('#gameBoard').height() - 40);
	}

//HELP BOX

	//Help Level Info
	var helpLevelInfo=[];
	helpLevelInfo[0]=
					"<p class="+'taps'+">This level can be solved  in 1 tap.</p>"+
					"<p>Tap the center of the plus sign, that's it!</p>"+
					"<p>Can you see how the adjacent lights are switched OFF too?</p>";
	helpLevelInfo[1]=
					"<p class="+'taps'+">This level can be solved in 2 taps.</p>"+
					"<p>Tap the center of the half plus signs, that's it!</p>"+
					"<p>Notice this level is almost like level 1 but that same plus sign is now on the top and bottom.</p>"+
					"<p>Can you see how the adjacent lights aren't always on the game board?</p>";
	helpLevelInfo[2]="<p>Solve this level in 4 taps. This level is just like the previous level with 2 more plus signs</p><p>Can you see pattern starting to take shape?</p>";
	helpLevelInfo[3]="<p>Solve this level in 4 taps. Now all the plus signs are in the corners. Just continue tapping the center of the plus signs.</p><p>Can you see the basic patterns yet?</p>";
	helpLevelInfo[4]="<p>Solve this level in 4 taps. This level is introduces a new concept, now the lights are affecting eachother in different ways.</p>";
	helpLevelInfo[5]='<p>help level info 6</p>';
	helpLevelInfo[6]='<p>help level info 7</p>';
	helpLevelInfo[7]='<p>help level info 8</p>';
	helpLevelInfo[8]='<p>help level info 9</p>';
	helpLevelInfo[9]='<p>help level info 10</p>';
	helpLevelInfo[10]='<p>help level info 11</p>';
	helpLevelInfo[11]='<p>help level info 12</p>';
	helpLevelInfo[12]='<p>help level info 13</p>';
	helpLevelInfo[13]='<p>help level info 14</p>';
	helpLevelInfo[14]='<p>help level info 15</p>';
	helpLevelInfo[15]='<p>help level info 16</p>';
	helpLevelInfo[16]='<p>help level info 17</p>';
	helpLevelInfo[17]='<p>help level info 18</p>';
	helpLevelInfo[18]='<p>help level info 19</p>';
	helpLevelInfo[19]='<p>help level info 20</p>';
	helpLevelInfo[20]='<p>help level info 21</p>';
	helpLevelInfo[21]='<p>help level info 22</p>';
	helpLevelInfo[22]='<p>help level info 23</p>';

	helpLevelInfo[numLevels+1]="<p>24 Random Taps=2-4</p>";//=24 - easy RDM
	helpLevelInfo[numLevels+2]="<p>help level info 25</p>";//=25 - medium RDM
	helpLevelInfo[numLevels+3]="<p>help level info 26</p>";//=26 - hard RDM
	helpLevelInfo[numLevels+4]="<p>help level info 27</p>";//=27 - X RDM

	function openhelpBox(){
		if (0 == powerIO){powerToggle();}
			createjs.Sound.play('slide');
			
			$('#helpBox').fadeIn(500);
			$('#helpBoxbg').fadeIn(500);
			if(0==srtstp){
				//no scroll
			}else{
			$('#helpBox').scrollTo( '#levelHelp'+(curLevel+1), 1000 );
			}			
			//$('#content').html('test');
			centerhelpbox();
	}
	function hidehelpBox(){
		createjs.Sound.play('slide');
		$('#helpBox').fadeOut(500);
		$('#helpBoxbg').fadeOut(500);
	}
	function centerhelpbox(){
	$('#helpBox').css('left',($(window).width()/2) - ($('#helpBox').outerWidth()/2));
	//$('#helpBox').css('top',($(window).height()/2) - ($('#helpBox').height()/2));
	$('#helpBox').css('width', winwidth / 1.5);
	$('#helpBox').css('height', $('#gameBoard').height() - 40);
	}
	
//GAME LEVELS
	//Level storage information 
	//pre made levels
	var levels=[];
	levels[0]='0000000100011100010000000';//1
	levels[1]='0100011100010100011100010';//2
	levels[2]='0111000100000000010001110';//3
	levels[3]='0111010101110111010101110';//4
	levels[4]='1101110001000001000111011';//5
	levels[5]='0000001010110110101000000';//6
	levels[6]='0101011011000001101101010';//7
	levels[7]='0110100101000000010101101';//8
	levels[8]='1010110101000001010110101';//9
	levels[9]='0100011000001000001100010';//10
	levels[10]='0000100010001000100010000';//11
	levels[11]='1000101010000000101010001';//12
	levels[12]='0000000110010010011000000';//13
	levels[13]='0000001110101010111000000';//14
	levels[14]='0000010101101011010100000';//15
	levels[15]='0000011111011101111100000';//16
	levels[16]='0111010001101011000101110';//17
	levels[17]='0010000000101010000000100';//18
	levels[18]='0101011011110111101101010';//19
	levels[19]='1010100100110110010010101';//20
	levels[20]='1010000000100010000000101';//21
	levels[21]='1110010011000001100100111';//22
	levels[22]='1010000100111000001000001';//23
	levels[23]='0000101110100100101010100';//24
	levels[24]='1011110101010101010111101';//25
	levels[25]='0110101000100011001111100';//26 total pre-made level = var numLevels
	//RDM random level RAM storage
	levels[numLevels+1]=[];//=27 - easy RDM
	levels[numLevels+2]=[];//=28 - medium RDM
	levels[numLevels+3]=[];//=29 - hard RDM
	levels[numLevels+4]=[];//=30 - X RDM
	

	function levelGenerator(lvl){
		$('#lvlgenBox p#lvlnumber').html(lvl+1);//populate display with number of next level
		if(0==resetbuttonChecked){
			animatelvlgenBox();	
		}
		if(lvl>=(numLevels+1)){//RDM Levels Re-Generator
			srtstp=1;
			$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
			for(var i=0; i<levels[lvl].length; i++){
				var newObject= document.getElementById(levels[lvl][i]);
				tapLight(newObject);
			}
		}else{//PRE MADE LEVELS
			curLevel=lvl;
			$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
			level = levels[lvl].split('');//split the level data into a string
			$('.oLight').each(function(index){//grab each oLight
				if(level[index]==1){//if the level indicates a 1 for this light turn light ON(iLight)
					$(this).removeClass('oLight');
					$(this).addClass('iLight');
				}
			});
			$('#level .displayOutput').html(lvl+1);//fill the level indicator with the appropriate level
			if(0==levelsBoxstatus){
				
			}
		}
		hidelevelsBox();
		resetClicks();
		resetTimer();	
	}
	function RDMlevelGenerator(lvl){
		if(1==resetbuttonChecked){animatelvlgenBox();}//flash current level 
		curLevel=lvl;
		levels[lvl]=[];//place to store random level array
		$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights OFF
		//HOW MANY RANDOM CLICKS if easy/med/hard/xxx
		if((numLevels+1)==lvl){//if EASY level
			var rdmClicks = (Math.floor(Math.random()*2)+2);//###random number of clicks between 2-4
			$('#lvlgenBox p').html('RDM');//populate display with number of next level
			$('#lvlgenBox p#lvlnumber').html('2-4');//populate display with number of next level
		}else if((numLevels+2)==lvl){//if MED level
			var rdmClicks = (Math.floor(Math.random()*2)+4);//###random number of clicks between 4-6
		}else if((numLevels+3)==lvl){//if HARD level
			var rdmClicks = (Math.floor(Math.random()*2)+6);//###random number of clicks between 6-8
		}else if((numLevels+4)==lvl){//if XXX level
			var rdmClicks = (Math.floor(Math.random()*4)+5);//###random number of clicks between 5-9
		}else{//this should never run
			alert('failed to get rdm level, something is wrong, better reset!');
		}
		//GENERATE RANDOM CLICKS in Sequence of 100 milli seconds
		var timeDelay = 100;//speed of random generation for looping tapLight
		for (i = 0; i < rdmClicks; i++) {//toggle a random cell for ever number of random clicks
			setTimeout(function(){//this function slows down the random generation so the user can almost see its creation
			var rdmCell = 'cell' + (Math.floor(Math.random()*5)) + (Math.floor(Math.random()*5)) ;//choose a random light to toggle cell00-cell44
			levels[lvl].push(rdmCell);//push the randon light info(cellXX) to level storage variable for regeneration
			var newObject= document.getElementById(rdmCell);//create new object =to rdmCell to send to tapLight function
			srtstp=1;//set srtstp to 1 to enable tapLight to run [or first tapLight will be skipped]
	      	tapLight(newObject);//run tapLight
	      	//srtstp=0;
			resetClicks();
	      	},timeDelay);//slow down the rdm generation so each clicks happens XXX milliseconds apart 
	      	timeDelay+=100;//speed increments - same as timeDelay original var 
	   	}
		if(1==levelsBoxstatus){
			hidelevelsBox();
		}
		resetTimer();
		$('#level .displayOutput').html(lvl);//fill the level indicator with the appropriate level
		if(0==srtstp){StartStop();}
	}

	//Animate Next Level Number//
	function animatelvlgenBox(){
			$('#lvlgenBox').css('display','block');//turn the display on(still opacity=0)
			$('#lvlgenBox').animate({//animate 
				opacity:0.5//animate opacity to half in 1/4 second
				//TODO//text size 0 to 85% of gameBoard size
			},200, function(){
				$('#lvlgenBox').fadeOut();//fade out the number
			});
	}













