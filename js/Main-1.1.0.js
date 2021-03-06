/* Coded by Benjamin Hough 2014 */

$( function() // document has been loaded
{

	var SPRING_START = MonthToDay( 1 ) + 20; // January 1
	var SPRING_END = MonthToDay( 5 ) + 10; // May 10

	var SUMMER_START = MonthToDay( 6 ) + 20; // june 20
	var SUMMER_END = MonthToDay( 7 ) + 27; // july 27

	var FALL_START = MonthToDay( 8 ) + 26; // august 26
	var FALL_END = MonthToDay( 12 ) + 9; // december 9


	var cellW; // cell width of canvas table
	var cellH; // cell height of canvas table

	var courseHue = 0;

	var buttons = []; // contains the button objects
	var courses = []; // contains the course objects
	var courseData = []; // contains the raw data for the courses

	var tableW; // width of canvas table
	var tableH; // height of canvas table

	var SATURATION = 55; // saturation of buttons
	var LIGHTNESS = 66; // lightness of buttons

	var firstRowH = $( "#firstColumn" ).outerHeight( true ) - 1; // height of the first row of the table to determine the offset for the class divs
	var firstColW = 38; // width of the first column of the table to determine offset for the class divs

	var isSaturday = false;
	var isSunday = false;

	var columns = 5;



	if ( "ontouchstart" in window || navigator.msMaxTouchPoints ) // mobile or desktop page
	{
		var TOUCH = true;
		$( "#container" ).css( "margin-top" , "6px" );
		$( "#header" ).hide();
		$( "#B_print" ).parent().hide();
		$( "#footer" ).hide();
	}
	else
	{
		var TOUCH = false;
		$( "#semester" ).show();
	}



	LoadCourses(); // load courses from local storage





	function Redraw( ifPrint )
	{

		firstRowH = $( "#firstColumn" ).outerHeight( true ) - 1;
		firstColW = 38;


		if ( TOUCH )
		{
			$( "html" ).width( Math.max( innerH * 1.5 , window.innerWidth ) + 'px' );
		}
		else
		{
			$( "html" ).width( "initial" );
		}


		if ( ifPrint || TOUCH )
		{
			var innerH = Math.min( window.innerHeight );
		}
		else
		{
			var innerH = Math.min( window.innerWidth * .666 , window.innerHeight ) - 17;
		}


		$( "html" ).height( Math.min( window.innerWidth * .666 , window.innerHeight ) + "px" );
		$( "#container2" ).height( Math.min( window.innerWidth * .666 , window.innerHeight ) + "px" );

		$( "#container" ).css( "width" , "100%" );
		//$( "header img" ).css( "width" , "37%" );

		var contW = $( "#container" ).innerWidth();
		var barW = Math.round( Math.max( 190 , contW / 4.5 ) );


		if ( ifPrint )
		{
			cellW = 99;
			cellH = 36;
			barW = 280;

			$('#timeSheet tr td:nth-child(7),#timeSheet tr th:nth-child(7)').show(); // show saturday.
			$('#timeSheet tr td:nth-child(8),#timeSheet tr th:nth-child(8)').show(); // show sunday
			columns = 7;
		}
		else
		{
			if ( isSunday )
			{
				$('#timeSheet tr td:nth-child(7),#timeSheet tr th:nth-child(7)').show(); // show saturday.
				$('#timeSheet tr td:nth-child(8),#timeSheet tr th:nth-child(8)').show(); // show sunday
				columns = 7;
			}
			else if ( isSaturday )
			{
				$('#timeSheet tr td:nth-child(7),#timeSheet tr th:nth-child(7)').show(); // show saturday.
				$('#timeSheet tr td:nth-child(8),#timeSheet tr th:nth-child(8)').hide(); // hide sunday
				columns = 6;
			}
			else
			{
				$('#timeSheet tr td:nth-child(7),#timeSheet tr th:nth-child(7)').hide(); // hide saturday.
				$('#timeSheet tr td:nth-child(8),#timeSheet tr th:nth-child(8)').hide(); // hide sunday
				columns = 5;
			}


			cellW = Math.floor( Math.max( 40 , ( contW - firstColW - columns - 1 - 2 * barW ) / columns - 3 ) );

			if ( TOUCH )
			{
				cellH = Math.round( Math.max( 24 , ( innerH - 17 - firstRowH - 6 ) / 18 ) );
			}
			else
			{
				cellH = Math.round( Math.max( 24 , ( innerH - $( "#header" ).outerHeight( true ) - firstRowH - $( "#footer" ).outerHeight( true ) ) / 18 ) );
			}
			//cellW = Math.floor( Math.max( 30 , Math.min( 199 , ( contW - firstColW - 7 - 2 * barW ) / 6 - 6 ) ) );
			//cellH = Math.round( Math.max( 24 , 36 + Math.min( 0 , window.innerHeight - ( $( "#header" ).height() + 720 ) ) / 17 ) );
		}


		$( "th:not(#firstColumn)" ).width( cellW + "px" );
		$( "th div" ).width( cellW + "px" );

		if ( cellW <= 75 )
		{
			$( "th:nth-child(2) div" ).html( "Mon" );
			$( "th:nth-child(3) div" ).html( "Tue" );
			$( "th:nth-child(4) div" ).html( "Wed" );
			$( "th:nth-child(5) div" ).html( "Thu" );
			$( "th:nth-child(6) div" ).html( "Fri" );
			$( "th:nth-child(7) div" ).html( "Sat" );
			$( "th:nth-child(8) div" ).html( "Sun" );
		}
		else
		{
			$( "th:nth-child(2) div" ).html( "Monday" );
			$( "th:nth-child(3) div" ).html( "Tuesday" );
			$( "th:nth-child(4) div" ).html( "Wedneday" );
			$( "th:nth-child(5) div" ).html( "Thursday" );
			$( "th:nth-child(6) div" ).html( "Friday" );
			$( "th:nth-child(7) div" ).html( "Saturday" );
			$( "th:nth-child(8) div" ).html( "Sunday" );
		}

		$( "tr:not(tr:first-child)" ).height( cellH + "px" );

		tableW = $( "#timeSheet" ).outerWidth( true );
		tableH = $( "#timeSheet" ).outerHeight( true );

		$( "#first" ).height( tableH + "px" );
		$( "#second" ).height( tableH + "px" );
		$( "#third" ).height( tableH + "px" );

		$( "#infoPane" ).height( tableH - ( $( "#topButton" ).height() + 72 + $( "#lowButton" ).height() ) + "px" );


		$( "#divCanvas" ).height( tableH + "px" );
		$( "#divCanvas" ).width( tableW + "px" );

		$( "#second" ).width( barW + "px" );
		$( "#third" ).width( barW + "px" );

		if ( ifPrint )
		{
			$( "#container" ).width( $( "#first" ).outerWidth() + $( "#third" ).outerWidth() + "px" );
		}
		else
		{
			$( "#container" ).width( $( "#first" ).outerWidth() + $( "#second" ).outerWidth() + $( "#third" ).outerWidth() + "px" );
		}


		if ( TOUCH )
		{
			$( "html" ).width( $( "#container2" ).width() );
			$( "#container2" ).height( Math.max( window.innerHeight , $("#container2").height() ) + 'px');
		}
		else
		{

			$( "#semester" ).width( $( "#third" ).width()/2.8);
			var sempos = $( "#third" ).offset().left + $( "#third" ).width()/2;
			var sempos2 = $( "header img" ).offset().top + $( "header img" ).height() + 6;
			$( "#semester" ).offset({top: sempos2 - $("#semester").height() , left: sempos - $("#semester").width()/2 });

		}

		$( '#container2').css('border-bottom-width', Math.max( 0 , Math.min( window.innerHeight - ( 17 + innerH) , 3)) + 'px' );
		//$( 'html').height(  Math.ceil($( "#header" ).outerHeight( true ) + $( "#footer" ).outerHeight( true ) + $( "#container" ).outerHeight( true ) + 1 ) + 'px'  )


		RefreshAllClassDraw();
		DrawClassConflicts();
	};





	$( window ).on( "resize" , function()
	{
		Redraw();
	} );


	function ClearCanvas()
	{
		$( "#divCanvas" ).html( "" ); // remove all class divs
	}



	function RefreshAllClassDraw() // redraws all the class divs
	{
		ClearCanvas();

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
			{
				courses[ i ].classes[ j ].RefreshDrawClass();
			}
		}
	};


	function RefreshAllClassColor( print ) // refreshes all the class divs and buttons
	{
		ClearCanvas();

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
			{
				courses[ i ].classes[ j ].RefreshColor();
				courses[ i ].classes[ j ].RefreshDrawClass();
			}
			courses[ i ].RefreshButtons( print );
		}
	};




	function DrawClassConflicts( skip )
	{
		var sessionList;

		for ( var i = 0 ; i < columns ; i++ )
		{
			sessionList = GenerateSessionList( i , skip );

			if ( sessionList.length <= 1 )
			{
				continue;
			}

			for ( var j = 0 ; j < sessionList.length ; j++ )
			{
				var ds , de , ts , te;

				ds = sessionList[ j ].dateStart;
				de = sessionList[ j ].dateEnd;

				ts = sessionList[ j ].timeStart;
				te = sessionList[ j ].timeEnd;

				for ( var k = j + 1 ; k < sessionList.length ; k++ )
				{
					var ds2 , de2 , ts2 , te2;

					ds2 = sessionList[ k ].dateStart;
					de2 = sessionList[ k ].dateEnd;

					ts2 = sessionList[ k ].timeStart;
					te2 = sessionList[ k ].timeEnd;

					if ( CheckClassConflict( ds , de , ts , te , ds2 , de2 , ts2 , te2 ) )
					{
						var x1 , x2 , y1 , y2;

						x1 = GetDrawX( i , Math.max( ds , ds2 ) , Math.max( ds , ds2 ) );
						x2 = GetDrawX( i , Math.min( de , de2 ) + .001 , Math.max( ds , ds2 ) ); // + cellW + 1;
						y1 = GetDrawY( Math.max( ts , ts2 ) );
						y2 = GetDrawY( Math.min( te , te2 ) );


						DrawRect2( x1 , y1 , x2 , y2 , "red" , 3 , true , "hsla(0,0%,0%,.35)" );
					}
				}
			}
		}
	};




	function GenerateSessionList( day , skip )
	{
		var classList = [];

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			if ( i != skip )
			{
				for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
				{
					if ( courses[ i ].classes[ j ].display || courses[ i ].classes[ j ].hover )
					{
						for ( var k = 0 ; k < courses[ i ].classes[ j ].sessions.length ; k++ )
						{
							if ( courses[ i ].classes[ j ].sessions[ k ].days[ day ] == 1 )
							{
								classList.push( courses[ i ].classes[ j ].sessions[ k ] );
							}
						}
					}
				}
			}
			else
			{
				for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
				{
					if ( courses[ i ].classes[ j ].hover )
					{
						for ( var k = 0 ; k < courses[ i ].classes[ j ].sessions.length ; k++ )
						{
							if ( courses[ i ].classes[ j ].sessions[ k ].days[ day ] == 1 )
							{
								classList.push( courses[ i ].classes[ j ].sessions[ k ] );
							}
						}
					}
				}
			}
		}

		return classList;
	};



	function CheckClassConflict( ds , de , ts , te , ds2 , de2 , ts2 , te2 )
	{
		if ( !( ts2 >= te ) && !( te2 <= ts ) )
		{
			return ( !( ds2 > de ) && !( de2 < ds ) );
		}

		return false;
	};




	function CheckClassConflicts()
	{
		var sessionList

		for ( var i = 0 ; i < columns ; i++ ) // for each day of the week
		{
			classList = GenerateSessionList( i );

			if ( classList.length <= 1 )
			{
				continue;
			}

			for ( var j = 0 ; j < classList.length - 1 ; j++ )
			{
				var ds , de , ts , te;

				ds = classList[ j ].dateStart;
				de = classList[ j ].dateEnd;

				ts = classList[ j ].timeStart;
				te = classList[ j ].timeEnd;

				for ( var k = j + 1 ; k < classList.length ; k++ )
				{
					var ds2 , de2 , ts2 , te2;

					ds2 = classList[ k ].dateStart;
					de2 = classList[ k ].dateEnd;

					ts2 = classList[ k ].timeStart;
					te2 = classList[ k ].timeEnd;

					if ( CheckClassConflict( ds , de , ts , te , ds2 , de2 , ts2 , te2 ) )
					{
						return true;
					}
				}
			}
		}

		return false;
	};




	function CycleClasses( direction )
	{
		var totalCombinations = 1;

		for ( i = 0 ; i < courses.length ; i++ )
		{
			totalCombinations *= courses[ i ].classes.length;
		}

		for ( i = 0 ; i < totalCombinations + 1 ; i++ )
		{
			for ( j = courses.length - 1 ; j >= 0 ; j-- )
			{
				if ( direction == "F" )
				{
					courses[ j ].cycle++;

					if ( courses[ j ].cycle < courses[ j ].classes.length )
					{
						break;
					}
					else
					{
						courses[ j ].cycle = 0;
					}
				}
				else
				{
					courses[ j ].cycle--;

					if ( courses[ j ].cycle >= 0 )
					{
						break;
					}
					else
					{
						courses[ j ].cycle = courses[ j ].classes.length - 1;
					}
				}
			}

			for ( var k = 0 ; k < courses.length ; k++ )
			{
				for ( var j = 0 ; j < courses[ k ].classes.length ; j++ )
				{
					if ( courses[ k ].cycle == j )
					{
						courses[ k ].classes[ j ].display = true;
					}
					else
					{
						courses[ k ].classes[ j ].display = false;
					}
				}
			}

			if ( !CheckClassConflicts() )
			{
				RefreshAllClassColor();
				$("#totals").html( "Units: " + GetTotalUnits() + "&nbsp;&nbsp; Hours: " + GetTotalHours() );
				DrawClassConflicts();
				SaveClasses();
				return ( true );
			}

			if ( i > 999999 )
			{
				alert( "Process Timed Out\ntry removing some classes" );

				for ( var k = 0 ; k < courses.length ; k++ )
				{
					for ( var j = 0 ; j < courses[ k ].classes.length ; j++ )
					{
						courses[ k ].classes[ j ].display = false;
					}
				}

				SaveClasses();
				return ( false );
			}
		}

		for ( var k = 0 ; k < courses.length ; k++ )
		{
			for ( var j = 0 ; j < courses[ k ].classes.length ; j++ )
			{
				courses[ k ].classes[ j ].display = false;
			}
		}

		RefreshAllClassColor();
		$("#totals").html( "Units: " + GetTotalUnits() + "&nbsp;&nbsp; Hours: " + GetTotalHours() );
		DrawClassConflicts();
		SaveClasses();
		alert( "Could not find a possible schedule" );

		return ( false );
	};



	function Button( id , hue , actionCallBack , parameter )
	{
		this.$button = $( id );
		$( id ).data( "button" , this );
		this.hue = hue;
		this.actionCallBack = actionCallBack;
		this.parameter = parameter;
		//	$( id + " div" ).css( "background-color" , "hsl(" + hue + ", " + SATURATION + "%," + LIGHTNESS + "%)" );
	};




	Button.prototype.clickBut = function()
	{
		this.actionCallBack( this.parameter );
		//console.log( this.button + " was clicked" );
	};



	function ButtonClass( div , hue , actionCallBack )
	{
		this.$div = id;
		this.colorNorm = "hsl(" + hue + "," + SATURATION + "%," + LIGHTNESS + "%)";
		this.colorHover = "hsl(" + hue + "," + SATURATION + "%," + ( LIGHTNESS + 7 ) + "%)";
		this.colorDown = "hsl(" + hue + "," + SATURATION + "%," + ( LIGHTNESS - 10 ) + "%)";

		this.actionCallBack = actionCallBack;
		$( id + " div" ).css( "background-color" , "hsl(" + hue + ", 1%," + LIGHTNESS + "%)" );

		$( id + " div" ).animate(
		{
			backgroundColor : "hsl(" + hue + "," + SATURATION + "%," + LIGHTNESS + "%)"
		} , 500 );

	};


	function ParseCourseTitle( courseTitle )
	{
		try
		{
			courseTitle = courseTitle.match( /^[A-Z][A-Z]{1,8}[ ]*\d[A-z0-9a-z.]{0,8}\b/ )[ 0 ];
		} catch ( err )
		{
			courseTitle = prompt( "The course name was missing.\nplease enter a course name." , "Course " + ( courses.length + 1 ) );
		}

		return courseTitle;
	}

	function SaveCourses()
	{
		var courseTitles = [];

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			courseTitles.push( courses[ i ].courseTitle );
		}

		$.jStorage.set( "Courses" , JSON.stringify( courseData ) );
		$.jStorage.set( "Titles" , JSON.stringify( courseTitles ) );

		SaveClasses();
	}

	function SaveClasses()
	{
		var activeClasses = [];

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			activeClasses[ i ] = -1;
			for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
			{
				if ( courses[ i ].classes[ j ].display == true )
				{
					activeClasses[ i ] = courses[ i ].classes[ j ].oPos;
					break;
				}
			}
		}

		//console.log( activeClasses );
		$.jStorage.set( "Classes" , JSON.stringify( activeClasses ) );
	}


	function LoadCourses()
	{
		try
		{
			if ( $.jStorage.get( "Courses" , undefined ) != undefined )
			{
				var tempData = JSON.parse( $.jStorage.get( "Courses" ) );
				var tempClasses = JSON.parse( $.jStorage.get( "Classes" ) );
				var tempTitles = JSON.parse( $.jStorage.get( "Titles" ) );
				//console.log( tempData );

				for ( var i = 0 ; i < tempData.length ; i++ )
				{
					AddCourse( tempData[ i ] , tempTitles[ i ] , tempClasses[ i ] );
					//console.log( tempData[ i ] );
				}

				$("#totals").html( "Units: " + GetTotalUnits() + "&nbsp;&nbsp; Hours: " + GetTotalHours() );

			}
		} catch ( err )
		{
			$.jStorage.flush();
		}
	}


	function RequestClassData( classTitle )
	{
		classTitle = classTitle.toUpperCase();

		if ( classTitle.length < 10 )
		{
			classTitle = classTitle.replace( /([A-Z])(\d)/,'$1 $2');
		}

		$.ajax(
		{
		url : 'http://srjcscheduler.com/php/scraper.php' ,
		beforeSend: function()
		{
			$('#loader').hide();
			$('#fountainG').show();
			$( "#B_addCourse div" ).addClass( "disabled" );
		},
		data :
		{
			cls : classTitle
		} ,
		timeout : 8000 ,
		complete : function( response )
		{
			var courseText = response.responseText;
			//console.log( courseText );

			$('#loader').show();
			$('#fountainG').hide();
			$( "#B_addCourse div" ).removeClass( "disabled" );


			try
			{
				//var title = courseText.match( /\t[A-Z]{2,7}[ ]*\d[A-Z0-9.]{0,6}\t/ )[ 0 ].trim();
				//var title = FormatCourseTitle( classTitle )
				console.log( courseText );
				courseText = ParseCourseClassesAlt( courseText );
				console.log( courseText );
				AddCourse( courseText , classTitle );
			}
			catch( err )
			{
				if ( courseText == "Course Not Found" )
				{
					alert( courseText );
				}
				else
				{
					alert("A Server Error Occured");
				}

				return;
			}


		} ,
		error : function()
		{
			console.log("Server Error");
		}
		} );
	}



	function AddCourse( courseText , courseTitle , activeClass )
	{
		if ( courseText == undefined ) // if class data or name entered
		{
			courseText = $( "#textbox" ).val();
			courseText = courseText.trim();

			if ( courseText.length <= 13 && courseText.match( /[A-Za-z]{2,7}[ ]*\d[a-zA-Z0-9.]{0,6}/ ) != null )
			{
				RequestClassData( courseText );
				return;
			}
			else
			{
				courseTitle = ParseCourseTitle( courseText ); // parses course title if exists, else asks for course name
				courseText = ParseCourseClasses( courseText ); // parses course text into array
			}
		}

		//console.log( courseText );

		var courseTemp = new Course(); // creates new course object

		try
		{
			var courseTextFull = courseText.slice( 0 );
		}
		catch(e)
		{

		}

		courseTemp.courseTitle = courseTitle;

		$( "#textbox" ).val( "" ); // clears the text box
		$( "#B_addCourse div" ).addClass( "disabled" ); // disables add course button



		courseHue = ( courseHue + 48 ) % 360; // iterates the hue for used for the course color

		if ( courseHue == 240 )
		{
			courseHue = ( courseHue + 48 ) % 360; // iterates the hue for used for the course color
		}



		var divTemp = AddCourseElement( courseTemp.courseTitle , courseHue ); // create a div element

		divTemp.children( ".closeButton" ).data( "$course" , courseTemp );

		courseTemp.$div = divTemp; // save the div element



		try
		{
			AddClass( courseTemp , courseText , activeClass ); // creates a class object for each class in the array courseText

		} catch ( err )
		{
			console.log( "error_adding_class" );
		}




		divTemp.data( "course" , courseTemp ); // binds course object to course div element

		//console.log( courseTextFull );


		if ( courseTemp.classes.length > 0 )
		{
			courses.push( courseTemp ); // pushes course object to global courses array
			courseData.push( courseTextFull ); // pushes course object to global courses array
			//console.log( courseTextFull );
			SaveCourses();
			Redraw();

			if ( activeClass == undefined )
			{
				ga( 'send' , 'event' , 'Course Added' , courseTemp.courseTitle );
			}
		}
		else
		{
			divTemp.remove();
			alert( "There was a problem adding the course, please check that it was copied correctly." )
		}
	};




	function Course()
	{
		this.courseTitle;
		this.display = true;
		this.cycle = 0;
		this.hue = 0;
		this.classes = [];
		this.$div;
		this.deleted = 0;

		this.ToggleCourseDisplay = function()
		{
			this.display = !this.display;

			return this.display;
		}



		this.RefreshButtons = function( print ) // hides classes depending if the couse box is collasped
		{
			if ( !this.display || print == true )
			{
				for ( var i = 0 ; i < this.classes.length ; i++ )
				{
					if ( this.classes[ i ].display )
					{
						this.classes[ i ].$div.parentsUntil( ".courseGroup" ).removeClass( "hiddenClass" );
					}
					else
					{
						this.classes[ i ].$div.parentsUntil( ".courseGroup" ).addClass( "hiddenClass" );
					}
				}
			}
			else
			{
				for ( var i = 0 ; i < this.classes.length ; i++ )
				{
					this.classes[ i ].$div.parentsUntil( ".courseGroup" ).removeClass( "hiddenClass" );
				}
			}
		}



		this.RefreshDeleteCount = function()
		{
			if ( this.deleted == 1 )
			{
				this.$div.children( "span" ).children( "span" ).html( " (" + this.deleted + " Class Deleted)" );
			}
			else
			{
				this.$div.children( "span" ).children( "span" ).html( " (" + this.deleted + " Classes Deleted)" );
			}
		}

		this.DimClasses = function( dim )
		{
			for ( var i = 0 ; i < this.classes.length ; i++ )
			{
				this.classes[ i ].dim = dim;
			}
		}
	};




	function AddCourseElement( courseTitle )
	{
		var $div = $( "<div>" ,
		{
			class : "courseGroup"
		} ); // create a course div

		$( "#third" ).append( $div ); // insert course div into containing div

		$div.append( '<span>' + courseTitle + ' <wbr><span style="white-space:nowrap"></span></span><div class="closeButton">X</div><div class="arrow arrow-down"></div><div style="clear:both"></div>' ); // attatch a span with the course title

		$div.children( ".arrow" ).data( "$course" , $div );

		$div.css( "background-color" , "hsl(" + courseHue + ", 40%,80%)" ); // assign the color tot the div

		return $div;
	};




	function AddClassElement( div )
	{
		var $div = $( "<div>" ,
		{
			class : "buttonCont"
		} ); // create button container div

		div.append( $div ); // insert it into course div

		var $div2 = $( "<div>" ,
		{
			class : "button"
		} ); // create button idv

		$div.append( $div2 ); // insert it into the button container div

		var $div3 = $( "<div>" ,
		{
			class : "buttonInside"
		} ); // create a div for the color and the text

		$div2.append( $div3 ); // insert it into button div

		return $div3;
	};




	function ParseClassData( data , sessionNum )
	{
		parsed = [];

		for ( var j = 0 ; j < sessionNum ; j++ ) // for number of sessions parse times as strings
		{
			var temp = data.match( /.*?(>|&|\t)/ )[ 0 ]; // pull a session of data

			data = data.replace( /.*?(>|&|\t)/ , "" ); // remove day from string

			parsed.push( temp.substring( 0 , temp.length - 1 ) );

			if ( data.length <= 1 ) // if missed tab
			{
				break;
			}
		}

		return parsed;
	};




	function AddClass( courseTemp , courseText , activeClass )
	{
		var lim = courseText.length;

		var stringTempArr = [];

		for ( var i = 0 ; i < lim ; i++ ) // for length of coursetext array, create class, parses text and fills class data
		{
			var classTemp = new Class();

			courseTemp.classes.push( classTemp );
			console.log( courseText[i] );

			courseText[ i ] = courseText[ i ].replace( /"/g , "" ); // replace Th with R

			try
			{

				// sect number //////////////////////////////////////////////////////////////////////////////

				classTemp.sect = courseText[ i ].match( /\d{4}/ )[ 0 ]; // pull sect number

				courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove sect number




				var stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

				//courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove up to first tab

				stringTemp = stringTemp.replace( /Th/g , "R" ); // replace Th with R

				stringTemp = stringTemp.replace( /Sat/g , "S" ); // replace Sat with S

				stringTemp = stringTemp.replace( /Sun/g , "N" ); // replace Sat with S

				stringTemp = stringTemp.replace( /TBA/g , "X" ); // replace TBA with X

				stringTempArr.splice( 0 , stringTempArr.length ); // clear array

				stringTempArr = ParseClassData( stringTemp , 20 );

				//console.log( stringTempArr );

				var sessionLength = stringTempArr.length; // number of class sessions

				//console.log( stringTempArr.length );


				// Days of the week //////////////////////////////////////////////////////////////////////////

				loop1 : for ( var j = 0 ; j < sessionLength ; j++ ) // for number of class sessions create session object
				{
					var sessionTemp = new Session(); // create new session object
					classTemp.sessions.push( sessionTemp ); // push session object into class.sessions array


					var charTemp = ""; // temp chracter for parsing days of the week

					while ( true ) //  parses the days of the week
					{
						charTemp = stringTempArr[ j ].charAt( 0 ); // get first character of stringTemp

						switch ( charTemp.toUpperCase() )
						// assign values to days array, 1 = true
						{
							case "M" :
								sessionTemp.days[ 0 ] = 1;
								break;

							case "T" :
								sessionTemp.days[ 1 ] = 1;
								break;

							case "W" :
								sessionTemp.days[ 2 ] = 1;
								break;

							case "R" :
								sessionTemp.days[ 3 ] = 1;
								break;

							case "F" :
								sessionTemp.days[ 4 ] = 1;
								break;

							case "S" :
								sessionTemp.days[ 5 ] = 1;
								isSaturday = true;
								break;

							case "N" :
								sessionTemp.days[ 6 ] = 1;
								isSunday = true;
								break;
						};

						if ( stringTempArr[ j ].length == 1 ) // break both loops
						{
							break;
						}

						stringTempArr[ j ] = stringTempArr[ j ].substring( 1 , stringTempArr[ j ].length ); // remove first character from stringTemp

					}
				}




				stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

				courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove days

				stringTempArr.splice( 0 , stringTempArr.length ); // clear array

				stringTempArr = ParseClassData( stringTemp , sessionLength ); // repopulate the array with class data seperated at &

				//console.log( stringTempArr );




				// days as string /////////////////////////////////////////////////////////////////

				for ( var j = 0 ; j < sessionLength ; j++ ) // for number of sessions parse instructor name
				{
					classTemp.sessions[ j ].daysS = stringTempArr[ j ];
				}




				stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until next tab

				courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove up to first tab

				stringTempArr.splice( 0 , stringTempArr.length ); // clear array

				stringTempArr = ParseClassData( stringTemp , sessionLength ); // repopulate the array with class data seperated at &

				//console.log( stringTempArr );



				// Times /////////////////////////////////////////////////////////////////////////

				for ( var j = 0 ; j < sessionLength ; j++ ) // for number of sessions parse class times
				{
					try
					{
						var hour , min , ampm;

						stringTemp = stringTempArr[ j ];
						classTemp.sessions[ j ].timeS = stringTemp;

						hour = Number( stringTemp.match( /\d\d?/ )[ 0 ] ); // parses start hour

						stringTemp = stringTemp.replace( /.*?:/ , "" ); // removes start hour

						min = Number( stringTemp.match( /\d\d/ )[ 0 ] ); // parses start minutes

						stringTemp = stringTemp.replace( /.*?\s/ , "" ); // removes start minutes

						ampm = stringTemp.match( /\s*?[amp]{2}/ )[ 0 ]; // parses start am or pm

						stringTemp = stringTemp.replace( /\s\-\s/ , "" ); // removes start am or pm

						if ( ampm.toLowerCase() == "pm" ) // if pm
						{
							if ( hour != 12 )
							{
								hour += 12; // add 12 hours
							}
						}
						else
						{
							if ( hour == 12 )
							{
								hour = 0;
							}
						}

						classTemp.sessions[ j ].timeStart = hour * 60 + min - 360; // assign start time in minutes relative to 7AM


						// same but with end times ///////////////////////////////////

						hour = Number( stringTemp.match( /\d\d?/ )[ 0 ] );

						stringTemp = stringTemp.replace( /.*?:/ , "" );

						min = Number( stringTemp.match( /\d\d/ )[ 0 ] );

						stringTemp = stringTemp.replace( /.*?\s/ , "" );

						ampm = stringTemp.match( /\s*?[amp]{2}/ )[ 0 ];

						if ( ampm.toLowerCase() == "pm" )
						{
							if ( hour != 12 )
							{
								hour += 12;
							}
						}
						else
						{
							if ( hour == 12 )
							{
								hour = 0;
							}
						}

						classTemp.sessions[ j ].timeEnd = hour * 60 + min - 360; // assign end time in minutes relative to 7AM

					} catch ( err )
					{
						console.log( "error adding times" + j );
					}
				}




				stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

				courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove instructor

				stringTempArr.splice( 0 , stringTempArr.length ); // clear array

				stringTempArr = ParseClassData( stringTemp , sessionLength ); // repopulate the array with class data seperated at &

				//console.log( stringTempArr );



				// instructor /////////////////////////////////////////////////////////////////

				for ( var j = 0 ; j < sessionLength ; j++ ) // for number of sessions parse instructor name
				{
					classTemp.sessions[ j ].instructor = stringTempArr[ j ]; // assign instructor to class
				}




				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove room number

					stringTempArr.splice( 0 , stringTempArr.length ); // clear array

					stringTempArr = ParseClassData( stringTemp , sessionLength ); // repopulate the array with class data seperated at &

					//console.log( stringTempArr );




					// location /////////////////////////////////////////////////////////

					for ( var j = 0 ; j < sessionLength ; j++ )
					{
						classTemp.sessions[ j ].location = stringTempArr[ j ]; // assing room number to classTemp
					}
				} catch ( err ) // if room number missing
				{
					console.log( "Class locations missing" );
				}





				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove room number

					stringTempArr.splice( 0 , stringTempArr.length ); // clear array

					stringTempArr = ParseClassData( stringTemp , sessionLength ); // repopulate the array with class data seperated at &

					//console.log( stringTempArr );




					// room number /////////////////////////////////////////////////////////

					for ( var j = 0 ; j < sessionLength ; j++ )
					{
						classTemp.sessions[ j ].room = stringTempArr[ j ]; // assing room number to classTemp
					}
				} catch ( err ) // if room number missing
				{
					console.log( "Class room missing" );
				}




				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove units




					// units ////////////////////////////////////////////////////////////////////////

					classTemp.units = stringTemp.substring( 0 , stringTemp.length - 1 ); // parses units and assing to class
				} catch ( err ) // if units missing
				{
					console.log( "Class units missing" );
				}




				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove status



					// status ///////////////////////////////////////////////////////////////////////////

					classTemp.status = stringTemp.substring( 0 , stringTemp.length - 1 ); // parses status and assigns to class
				} catch ( err ) // if status missing
				{
					console.log( "Class status missing" );
				}




				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove seats



					// total seats /////////////////////////////////////////////////////////////////////////////////

					classTemp.totalSeats = stringTemp.substring( 0 , stringTemp.length - 1 ); // parses seats and assing to class
				} catch ( err ) // if seats missing
				{
					console.log( "total number of seats missing" );
				}


				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove seats



					// current enrollment /////////////////////////////////////////////////////////////////////////////////

					classTemp.currentEnrollment = stringTemp.substring( 0 , stringTemp.length - 1 ); // parses seats and assing to class
				} catch ( err ) // if seats missing
				{
					console.log( "current enrollment missing" );
				}


				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove seats



					// remaining seats /////////////////////////////////////////////////////////////////////////////////

					classTemp.remainingSeats = stringTemp.substring( 0 , stringTemp.length - 1 ); // parses seats and assing to class
				} catch ( err ) // if seats missing
				{
					console.log( "remaining number of seats missing" );
				}





				stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

				courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove dates

				stringTempArr.splice( 0 , stringTempArr.length ); // clear array

				stringTempArr = ParseClassData( stringTemp , sessionLength ); // repopulate the array with class data seperated at &

				//console.log( stringTempArr );



				for ( var j = 0 ; j < sessionLength ; j++ ) // for number of session parse dates as days from jan 1
				{
					var month , day;

					classTemp.sessions[ j ].dateS = stringTempArr[ j ]; // assing date to class

					stringTemp = stringTempArr[ j ];

					month = MonthToDay( Number( stringTemp.match( /\d\d?/ )[ 0 ] ) ); // parses the start month and converts it to days from jan 1st

					stringTemp = stringTemp.replace( /\d\d?\// , "" ); // removes start month

					day = Number( stringTemp.match( /\d\d?/ )[ 0 ] ); // parses start day

					stringTemp = stringTemp.replace( /\d\d?\-/ , "" ); // removes start day

					classTemp.sessions[ j ].dateStart = month + day; // assign start date as number of days from jan 1st


					// same but for end date

					month = MonthToDay( Number( stringTemp.match( /\d\d?/ )[ 0 ] ) );

					stringTemp = stringTemp.replace( /\d\d?\// , "" );

					day = Number( stringTemp.match( /\d\d?/ )[ 0 ] );

					classTemp.sessions[ j ].dateEnd = month + day;
				}




				try
				{
					stringTemp = courseText[ i ].match( /.*?(>|\t)/ )[ 0 ]; // pull until first tab

					courseText[ i ] = courseText[ i ].replace( /.*?(>|\t)/ , "" ); // remove final exam


					// final exam //////////////////////////////////////////////////////////////////////////////

					classTemp.finalExam = stringTemp.match( /\d\d?\/\d\d?\/\d{4}/ )[ 0 ]; // parse final exam and assing to class
				} catch ( err ) // if final exam missing
				{
					console.log( "error adding final exam date" );
				}



				try
				{
					if ( courseText[ i ].length > 0 ) // if class data remaing
					{
						stringTemp = courseText[ i ].match( /.*?(>)/ )[ 0 ]; // pull until first tab

						classTemp.note = stringTemp.substring( 0 , stringTemp.length - 1 ).trim(); // parse note and assing to class
					}
				} catch ( err ) // if error adding note
				{
					console.log( "error adding class notes" );
				}




				var divTemp = AddClassElement( courseTemp.$div ); // creater class button

				divTemp.data( "class" , classTemp ); // bind class object to button

				divTemp.append( '<div style="float:left; width:100%;"><div style="margin-right: 20px">' + classTemp.sect + " - " + classTemp.sessions[ 0 ].instructor + '</div></div>' + '<div class="closeButton2">X</div>' ); // insert instructor text

				divTemp.find( ".closeButton2" ).data( "$class" , classTemp );

				divTemp.find( ".closeButton2" ).hide();

				classTemp.$div = divTemp; // assign div to class object

				classTemp.parent = courseTemp.$div;

				classTemp.oPos = i;

				if ( i == activeClass )
				{
					classTemp.display = true;
				}


				classTemp.RefreshColor(); // refresh the color of the button

			} catch ( err )
			{
				courseTemp.classes.pop();
				console.log( "error_AddClass" + err );
			}




			//console.log( classTemp );
		}

	};




	function Class()
	{
		this.display = false; // drawn on screen
		this.hover = false; // mouse over button
		this.note = ""; // class note
		this.sect = 0; // class section number
		this.totalSeats = 0; // seats available
		this.currentEnrollment = 0; // seats available
		this.remainingSeats = 0; // seats available
		this.units = ""; // class unots
		this.status = ""; // class status, open/closed/wait/etc
		this.finalExam = ""; // class final exam date
		this.sessions = []; // class sessions array
		this.$div; // div of button
		this.lhue = courseHue; // hue
		this.lsat; // saturation
		this.lval; // value/brightness
		this.lalp; // alpha/transperancy
		this.parent; // course div
		this.dim = false; // whether to be drawn as dimmed
		this.oPos;




		this.RefreshColor = function() // refreshes the color of the button depending on hover/click state
		{

			if ( this.hover )
			{
				this.lsat = 100;
				this.lval = 45;
			}
			else if ( this.display )
			{
				this.lsat = 90;
				this.lval = 60;
			}
			else
			{
				this.lsat = 40;
				this.lval = 70;
			}

			this.$div.css( "box-shadow" , "inset 0 0 0 1000px hsl(" + this.lhue + "," + this.lsat + "%," + this.lval + "%)" );
		};




		this.RefreshDrawClass = function() // determines the style for the boxes and then draws the class
		{
			if ( this.dim && this.display )
			{
				this.lalp = .3;
				this.lineColor = "gray";
			}
			else if ( this.hover )
			{
				this.lalp = 1;
				this.lineColor = "white";
			}
			else if ( this.display )
			{
				this.lalp = .7;
				this.lineColor = "black";
			}
			else
			{
				this.lalp = 0;
			}

			if ( this.lalp != 0 )
			{
				this.DrawClass();
			}
		};




		this.DrawClass = function() // draws each session in the class
		{
			for ( var i = 0 ; i < this.sessions.length ; i++ )
			{
				this.DrawSession( i );
			}
		};


		this.DrawSession = function( sessionNum ) // draws the individual session of a class
		{
			var infoTemp = this.parent.data( "course" ).courseTitle;
			var info;

			for ( var i = 0 ; i < columns ; i++ )
			{
				if ( this.sessions[ sessionNum ].days[ i ] == 1 )
				{
					var x1 , x2 , y1 , y2;

					x1 = GetDrawX( i , this.sessions[ sessionNum ].dateStart , this.sessions[ sessionNum ].dateStart );
					x2 = GetDrawX( i , this.sessions[ sessionNum ].dateEnd + .001 , this.sessions[ sessionNum ].dateStart ); // + cellW + 1;
					y1 = GetDrawY( this.sessions[ sessionNum ].timeStart );
					y2 = GetDrawY( this.sessions[ sessionNum ].timeEnd );

					info = infoTemp + "</br>Rm: " + this.sessions[ sessionNum ].room;


					DrawRect2( x1 , y1 , x2 , y2 , this.lineColor , 1 , true , "hsla(" + this.lhue + "," + 90 + "%," + /* this.lval */60 + "%," + this.lalp + ")" , info , this , sessionNum );
				}
			}


		};




		this.PopulateInfoPane = function( sessionNum ) // fillos the info pane with the class info
		{
			//this.ClearInfoPane();

			var $divTemp = $( "#infoPane" );
			var tempInfo = "";

			tempInfo += this.parent.data( "course" ).courseTitle;
			tempInfo += "<br/>Sect: " + this.sect;

			for ( var i = 0 ; i < this.sessions.length ; i++ )
			{
				if ( i == sessionNum )
				{
					tempInfo += "<span style='font-weight:700'>";
				}

				tempInfo += "<br/><br/>Days: " + this.sessions[ i ].daysS;
				tempInfo += "<br/>Hours: " + this.sessions[ i ].timeS;
				tempInfo += "<br/>Instruction: " + this.sessions[ i ].instructor;
				tempInfo += "<br/>Location: " + this.sessions[ i ].location;
				tempInfo += "<br/>room: " + this.sessions[ i ].room;
				tempInfo += "<br/>Dates: " + this.sessions[ i ].dateS;

				if ( i == sessionNum )
				{
					tempInfo += "</span>";
				}
			}

			tempInfo += "<br/><br/>Units: " + this.units;
			tempInfo += "<br/>Status: " + this.status;
			tempInfo += "<br/>Total Seats: " + this.totalSeats;
			tempInfo += "<br/>Current Enrollment: " + this.currentEnrollment;
			tempInfo += "<br/>Remaining Seats: " + this.remainingSeats;
			tempInfo += "<br/>Final: " + this.finalExam;

			tempInfo += "<br/></br>Notes: " + this.note;

			$divTemp.html( tempInfo );


		};




		this.ClearInfoPane = function() // empties the infopane
		{
			$( "#infoPane" ).html( "" );
		};
	};





	function Session()
	{
		this.days = [];
		this.daysS = "";
		this.timeStart = 0;
		this.timeS = "";
		this.timeEnd = 0;
		this.instructor = "";
		this.location = "";
		this.room = "";
		this.dateStart = 0;
		this.dateS = "";
		this.dateEnd = 0;
	};




	function DrawRect2( x , y , x2 , y2 , col1 , lw , fill , col2 , info , parent , sessionNum ) // creates a div over the table to represent a class session
	{
		$div = $( "<div>" ,
		{
			class : "drawClass" ,
		} ); // create a course div

		$div.width( x2 - x - lw * 2 + "px" );
		$div.height( 1 + y2 - y - lw * 2 + "px" );

		$div.css( "top" , y + "px" );
		$div.css( "left" , x + "px" );

		$div.css( "box-shadow" , "inset 0 0 0 1000px " + col2 );
		$div.css( "border-color" , col1 );
		$div.css( "border-width" , lw + "px" );



		if ( info !== undefined )
		{
			$div.html( "<div><p>" + info + "</p></div>" );
			$div.data( "parent" , parent ); // bind class object to button
			$div.data( "sessionNum" , sessionNum );
		}


		$( "#divCanvas" ).append( $div );
	};


	function GetDrawX( day , date , dateStart ) // converts the day of the week and start/end dates into x coords
	{
		var semStart , semEnd;

		if ( dateStart < 152 )
		{
			semStart = SPRING_START;
			semEnd = SPRING_END;
		}
		else if ( dateStart < 213 )
		{
			semStart = SUMMER_START;
			semEnd = SUMMER_END;
		}
		else
		{
			semStart = FALL_START;
			semEnd = FALL_END;
		}

		if ( date == dateStart )
		{
			return ( firstColW + Math.round( Math.min( Math.round( Math.min( Math.max( 0 , date - semStart ) , semEnd - semStart ) / 7 ) * 7 , semEnd - semStart ) * ( cellW / ( semEnd - semStart ) ) + ( cellW + 2 ) * day ) );
		}
		else
		{
			return ( firstColW + Math.round( Math.min( Math.ceil( Math.min( Math.max( 0 , date - semStart ) , semEnd - semStart ) / 7 ) * 7 , semEnd - semStart ) * ( ( cellW + 3 ) / ( semEnd - semStart ) ) + ( cellW + 2 ) * day ) );
		}
	}


	function GetDrawY( time ) // converts class start times into y coords
	{
		return ( firstRowH + Math.round( ( time ) * ( cellH / 60 ) ) );
	}




	$( "#third" ).on( "vclick" , ".button>div" , function()
	{

		var obj = $( this ).data( "class" );
		var tempDisplay = !obj.display;;


		//console.log( obj.sect + " - " + obj.sessions[ 0 ].instructor );

		for ( var j = 0 ; j < obj.parent.data( "course" ).classes.length ; j++ )
		{
			obj.parent.data( "course" ).classes[ j ].display = false;
			obj.parent.data( "course" ).classes[ j ].RefreshColor();
		}

		obj.display = tempDisplay;

		obj.RefreshColor();
		obj.parent.data( "course" ).RefreshButtons();
		RefreshAllClassDraw();
		$("#totals").html( "Units: " + GetTotalUnits() + "&nbsp;&nbsp; Hours: " + GetTotalHours() );
		DrawClassConflicts();
		SaveClasses();
	} );




	$( "#third" ).on( "mouseenter" , ".button>div" , function()
	{
		var obj = $( this ).data( "class" );

		obj.hover = true;

		var position = courses.indexOf( obj.parent.data( "course" ) );

		if ( !TOUCH )
		{
			obj.$div.find( ".closeButton2" ).show();
			obj.parent.data( "course" ).DimClasses( true );
			obj.dim = false;
		}

		obj.PopulateInfoPane();
		obj.RefreshColor();
		RefreshAllClassDraw();
		obj.RefreshDrawClass();
		DrawClassConflicts( position );
	} );




	$( "#divCanvas" ).on( "mouseenter" , ".drawClass" , function()
	{
		try
		{
			$( this ).data( "parent" ).PopulateInfoPane( $( this ).data( "sessionNum" ) );
		} catch ( err )
		{
		}
	} );


	$( "#divCanvas" ).on( "mouseleave" , ".drawClass" , function()
	{
		//$( "#infoPane" ).html( "" );
	} );




	$( "#third" ).on( "mouseleave" , ".button>div" , function()
	{

		var obj = $( this ).data( "class" );

		obj.hover = false;

		if ( !TOUCH )
		{
			obj.$div.find( ".closeButton2" ).hide();
			obj.parent.data( "course" ).DimClasses( false );
		}

		obj.RefreshColor();
		RefreshAllClassDraw();
		DrawClassConflicts();
		//$( "#infoPane" ).html( "" );

	} );




	$( "#third" ).on( "click" , ".arrow" , function()
	{

		var $course = $( this ).data( "$course" );

		if ( $course.data( "course" ).ToggleCourseDisplay() )
		{
			$( this ).addClass( 'arrow-down' ).removeClass( 'arrow-left' );
		}
		else
		{
			$( this ).addClass( 'arrow-left' ).removeClass( 'arrow-down' );
		}

		$course.data( "course" ).RefreshButtons();
	} );




	$( "#third" ).on( "click" , ".closeButton" , function()
	{

		var $course = $( this ).data( "$course" );

		var position = courses.indexOf( $course );

		if ( position != -1 )
		{
			$( "#infoPane" ).html( "" );
			courses[ position ].$div.remove();
			courses.splice( position , 1 );
			courseData.splice( position , 1 );
			RefreshAllClassDraw();
			$("#totals").html( "Units: " + GetTotalUnits() + "&nbsp;&nbsp; Hours: " + GetTotalHours() );
			DrawClassConflicts();
			SaveCourses();
		}
	} );


	$( "#third" ).on( "click" , ".closeButton2" , function()
	{

		var $class = $( this ).data( "$class" );

		var position = $class.parent.data( "course" ).classes.indexOf( $class );

		if ( position != -1 )
		{

			$( "#infoPane" ).html( "" );
			$class.parent.data( "course" ).classes.splice( position , 1 );
			$class.parent.data( "course" ).deleted += 1;
			$class.parent.data( "course" ).RefreshDeleteCount();
			$class.$div.parentsUntil( ".courseGroup" ).remove();
			RefreshAllClassDraw();
			DrawClassConflicts();
			SaveClasses();
		}

	} );




	function Restart()
	{
		for ( var i = 0 ; i < courses.length ; i++ )
		{
			courses[ i ].$div.remove();
		}

		courses.splice( 0 , courses.length );
		courseData.splice( 0 , courseData.length );
		RefreshAllClassDraw();
		$( "#infoPane" ).html( "" );
		$( "#textbox" ).val( "" ); // clears the text box
		$("#totals").html( "Units: " + GetTotalUnits() + "&nbsp;&nbsp; Hours: " + GetTotalHours() );
		$( "#B_addCourse div" ).addClass( "disabled" ); // disables add course button

		courseHue = 0;
		SaveCourses();

		isSunday = false;
		isSaturday = false;
		columns = 5;
		Redraw();

	}




	function ParseCourseClasses( courseText )
	{
		courseText = courseText.replace( /\n\s?\t(\d{4})/g , "><$1" );
		courseText = courseText.replace( /(\n|.)*?>/ , "" );
		courseText = courseText.replace( /\n/g , "&" );
		courseText += ">";

		courseText = courseText.match( /<(.*?)>/g );
		console.log("this");
		return courseText;
	};




	function MonthToDay( month )
	{
		var day = 0;

		switch ( month )
		{
			case 2 :
				day += 31;
				break;
			case 3 :
				day += 59;
				break;
			case 4 :
				day += 90;
				break;
			case 5 :
				day += 120;
				break;
			case 6 :
				day += 151;
				break;
			case 7 :
				day += 181;
				break;
			case 8 :
				day += 212;
				break;
			case 9 :
				day += 243;
				break;
			case 10 :
				day += 273;
				break;
			case 11 :
				day += 304;
				break;
			case 12 :
				day += 334;
				break;
		}

		return day;
	};


	window.onbeforeprint = function()
	{
		Redraw( true );
		RefreshAllClassColor( true );
		DrawClassConflicts();

		$( "html" ).css( "height" , tableH + "px" );
		$( "body" ).css( "height" , tableH + "px" );
		$( "#container2" ).css( "height" , tableH + "px" );

		CreateTable();
		ga( 'send' , 'event' , 'Button' , 'Print Intent' );
	};
	window.onafterprint = function()
	{
		Redraw();
		RefreshAllClassColor();
		DrawClassConflicts();
		$( "html" ).css( "height" , "intial" );
		$( "body" ).css( "height" , "intial" );
		$( "#container2" ).css( "height" , "intial" );
	};

	var mediaQueryList = window.matchMedia( 'print' );
	mediaQueryList.addListener( function( mql )
	{
		if ( mql.matches )
		{
			Redraw( true );
			RefreshAllClassColor( true );
			DrawClassConflicts();

			$( "html" ).css( "height" , tableH + "px" );
			$( "body" ).css( "height" , tableH + "px" );
			$( "#container2" ).css( "height" , tableH + "px" );

			CreateTable();
		}
		else
		{
			Redraw();
			RefreshAllClassColor();
			DrawClassConflicts();
			$( "html" ).css( "height" , "intial" );
			$( "body" ).css( "height" , "intial" );
			$( "#container2" ).css( "height" , "intial" );
		}
	} );



	function Print()
	{

		Redraw( true );
		RefreshAllClassColor( true );
		DrawClassConflicts();

		$( "html" ).css( "height" , tableH + "px" );
		$( "body" ).css( "height" , tableH + "px" );
		$( "#container2" ).css( "height" , tableH + "px" );

		CreateTable();


		window.print();

		ga( 'send' , 'event' , 'Button' , 'Print Intent' );
		RefreshAllClassColor();
		DrawClassConflicts();

		$( "html" ).css( "height" , "intial" );
		$( "body" ).css( "height" , "intial" );

		$( "#container2" ).css( "height" , "intial" );
		Redraw();
	}


	function CreateTable()
	{
		$table = $( "#tableInfo" );
		$table.width( $( "#container" ).outerWidth() + "px" );
		$table.html( "<tr><th>Course</th><th>Sect</th><th>Days</th><th>Hours</th><th>Instructor</th><th>Location</th><th>Room</th><th>units</th><th>Date Begin/End</th><th>Date Final Exam</th></tr>" );

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
			{
				if ( courses[ i ].classes[ j ].display )
				{
					var tempClass = courses[ i ].classes[ j ];
					//$div.css( "box-shadow" , "inset 0 0 0 1000px " + col2 );
					$table.append( "<tr><td style='box-shadow: inset 0 0 0 1000px" + " hsla(" + tempClass.lhue + "," + 90 + "%," + 60 + "%," + tempClass.lalp + ")'><span>" + courses[ i ].courseTitle + "</span></td><td><span>" + tempClass.sect + "</span></td><td><span>" + GetDaysText( tempClass ) + "</span></td><td><span>" + GetTimeText( tempClass ) + "</span></td><td><span>" + GetInstrText( tempClass ) + "</span></td><td><span>" + GetLocText( tempClass ) + "</span></td><td><span>" + GetRoomText( tempClass ) + "</span></td><td><span>" + tempClass.units + "</span></td><td><span>" + GetDatesText( tempClass ) + "</span></td><td><span>" + tempClass.finalExam + "</span></td></tr>" );

					if ( tempClass.note != "" )
					{
						$table.append( "<tr><td colspan='2'></td><td class='wrap' colspan='8'><span>" + tempClass.note + "</span></td></tr>" );
					}
				}

			}
		}

		$table.append( "<tr><td colspan='3'><span><strong>Totals: </strong></span></td><td><span><strong>" + GetTotalHours() + " hours</strong></span></td><td colspan='3'></td><td><span><strong>" + GetTotalUnits() + "</strong></span></td><td colspan='2'></td></tr>" );
	}

	function GetTotalHours()
	{
		var minutes = 0;
		var plus = false;

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
			{
				if ( courses[ i ].classes[ j ].display )
				{
					for( var k = 0 ; k < courses[ i ].classes[ j ].sessions.length ; k++ )
					{
						var tempSession = courses[ i ].classes[ j ].sessions[ k ];

						if ( tempSession.timeStart == 0 && tempSession.timeEnd == 0 )
						{
							var temp = parseFloat( tempSession.timeS ) * 60;

							if ( !isNaN( temp ) )
							{
								minutes += temp;
							}
							else
							{
								plus = true;
							}
						}
						else
						{
							var multi = 0;

							for( var l = 0 ; l < tempSession.days.length ; l++ )
							{
								if ( tempSession.days[ l ] == 1 )
								{
									multi++;
								}
							}

							minutes += ( tempSession.timeEnd - tempSession.timeStart ) * multi;
						}
					}
				}
			}
		}
		console.log( "minuts: " + minutes );

		minutes /= 60;
		if ( plus == true )
			return minutes.toFixed(1) + "+";
		else
			return minutes.toFixed(1);
	}


	function GetTotalUnits()
	{
		var units = 0;

		for ( var i = 0 ; i < courses.length ; i++ )
		{
			for ( var j = 0 ; j < courses[ i ].classes.length ; j++ )
			{
				if ( courses[ i ].classes[ j ].display )
				{
					units += parseFloat( courses[ i ].classes[ j ].units );
					console.log( "untis: " + courses[ i ].classes[ j ].units );
					break;
				}
			}
		}

		return units.toFixed( 1 );
	}



	function GetDaysText( temp )
	{
		s = "";

		for ( var i = 0 ; i < temp.sessions.length ; i++ )
		{
			s += temp.sessions[ i ].daysS;
			if ( i != temp.sessions.length - 1 )
			{
				s += "<br>";
			}
		}

		return s;
	}

	function GetTimeText( temp )
	{
		s = "";

		for ( var i = 0 ; i < temp.sessions.length ; i++ )
		{
			s += temp.sessions[ i ].timeS;
			if ( i != temp.sessions.length - 1 )
			{
				s += "<br>";
			}
		}

		return s;
	}

	function GetInstrText( temp )
	{
		s = "";

		for ( var i = 0 ; i < temp.sessions.length ; i++ )
		{
			s += temp.sessions[ i ].instructor;
			if ( i != temp.sessions.length - 1 )
			{
				s += "<br>";
			}
		}

		return s;
	}

	function GetLocText( temp )
	{
		s = "";

		for ( var i = 0 ; i < temp.sessions.length ; i++ )
		{
			s += temp.sessions[ i ].location;
			if ( i != temp.sessions.length - 1 )
			{
				s += "<br>";
			}
		}

		return s;
	}


	function GetRoomText( temp )
	{
		s = "";

		for ( var i = 0 ; i < temp.sessions.length ; i++ )
		{
			s += temp.sessions[ i ].room;
			if ( i != temp.sessions.length - 1 )
			{
				s += "<br>";
			}
		}

		return s;
	}

	function GetDatesText( temp )
	{
		s = "";

		for ( var i = 0 ; i < temp.sessions.length ; i++ )
		{
			s += temp.sessions[ i ].dateS;
			if ( i != temp.sessions.length - 1 )
			{
				s += "<br>";
			}
		}

		return s;
	}




	jQuery( document ).bind( "keyup keydown" , function( e )
	{
		if ( e.ctrlKey && e.keyCode == 80 )
		{
			Print();
		}
	} );




	buttons.push( new Button( "#B_addCourse" , 212 , AddCourse ) );
	buttons.push( new Button( "#B_classCycleLeft" , 99 , CycleClasses , "B" ) );
	buttons.push( new Button( "#B_classCycleRight" , 99 , CycleClasses , "F" ) );
	buttons.push( new Button( "#B_print" , 268 , Print ) );
	buttons.push( new Button( "#B_restart" , 14 , Restart ) );
	buttons.push( new Button( "#B_help" , 30 ) );




	$( ".button" ).click( function()
	{
		if ( !$( this ).children().hasClass( "disabled" ) )
		{
			$( this ).data( "button" ).clickBut();
		}
	} );

	$( document ).keyup( function( e )
	{
		if ( e.keyCode == 37 )
		{
			e.preventDefault();
			CycleClasses( "B" );
			return false;
		}
	} );

	$( document ).keyup( function( e )
	{
		if ( e.keyCode == 39 )
		{
			e.preventDefault();
			CycleClasses( "F" );;
			return false;
		}
	} );




	$( "#textbox" ).bind( "input" , function()
	{
		if ( $( this ).val().match( /[A-Za-z]{2,7}[ ]*\d[a-zA-Z0-9.]{0,6}/ ) != null )// && $.inArray( $( this ).val().toUpperCase().replace( /([A-Z])(\d)/,'$1 $2') , COURSE_TITLES ) > -1 )
		{
			$( "#B_addCourse div" ).removeClass( "disabled" );
		}
		else
		{
			$( "#B_addCourse div" ).addClass( "disabled" );
		}
	} );



	$( "#textbox" ).keypress( function( e )
	{
		if ( e.keyCode == 13 ) // press enter
		{
			e.preventDefault();

			if ( $( this ).val().match( /[A-Za-z]{2,7}[ ]*\d[a-zA-Z0-9.]{0,6}/ ) != null )// && $.inArray( $( this ).val().toUpperCase().replace( /([A-Z])(\d)/,'$1 $2') , COURSE_TITLES ) > -1 )
			{
				$( "#B_addCourse" ).data( "button" ).clickBut();
				return false;
			}
		}
	} );





	function ParseCourseClassesAlt( courseText )
	{
		courseText = courseText.trim();
		courseText = "<" + courseText;
		courseText = courseText.replace( /\u00A0/g , " " );
		courseText = courseText.replace( /\n/g , "" );
		courseText = courseText.replace( /\r/g , "" );
		courseText = courseText.replace( /\t\s*?\t(\d{4}\t)/gm , "><$1" );
		//courseText = courseText.replace( /.*?>/ , "" );
		courseText += ">";
		//courseText = courseText.replace( /<[A-Z]{2,7}[ ]*\d[A-Z0-9.]{0,6}\t/g , "<" );


		courseText = courseText.match( /<(.*?)>/gm );
		return courseText;
	}





	setTimeout( Redraw , 200 );
	setTimeout( Redraw , 400 );
	setTimeout( Redraw , 1000 );


	Redraw();



	var COURSE_TITLES = [
		"APE 301", "APE 701", "APE 709", "APE 710", "DH 68", "DH 69", "DH 70", "DH 71A", "DH 71D", "DH 79", "DH 80", "DH 81", "KTEAM 4.1", "KTEAM 4.2", "KTEAM 4.3", "KTEAM 6.1", "KTEAM 6.2", "KTEAM 8.1", "KTEAM 8.2", "KTEAM 8.3", "AJ 21", "AJ 22", "AJ 25", "AJ 53", "AJ 54A", "AJ 55", "AJ 56", "AJ 99I", "AJ 203", "AJ 222C", "AJ 223", "AJ 305", "AJ 343", "AJ 348", "AJ 350", "AJ 351", "AJ 353", "AJ 354", "AJ 355", "AJ 361", "AJ 363", "AJ 364", "AJ 715", "DET 179", "DET 181", "DET 184", "DET 185", "DET 188", "LIR 10", "AGRI 20", "AGRI 56", "AGRI 60", "AGRI 98", "AGRI 99", "AGRI 99I", "DIET 50", "DIET 55", "DIET 55L", "DIET 70", "DIET 99", "DIET 106.1", "MACH 51A", "MACH 61.2", "MACH 80A", "MACH 770", "AGBUS 2", "AGBUS 7", "AGBUS 56", "AGBUS 62", "DRD 360.1", "DRD 360.2", "DRD 363", "DRD 370.1A", "DRD 370.2A", "DRD 370.3A", "DRD 390.2", "DRD 391", "DRD 700", "DRD 705", "DRD 761", "DRD 784", "MATH 1A", "MATH 1B", "MATH 1C", "MATH 2", "MATH 4", "MATH 5", "MATH 9", "MATH 10", "MATH 15", "MATH 16", "MATH 25", "MATH 27", "MATH 49", "MATH 58", "MATH 70", "MATH 71", "MATH 101", "MATH 150A", "MATH 150B", "MATH 151", "MATH 154", "MATH 155", "MATH 770", "AGMEC 60", "ERTHS 85.1", "MEDIA 4", "MEDIA 10", "MEDIA 15", "MEDIA 19", "MEDIA 20", "MEDIA 22", "MEDIA 123", "AODS 90", "AODS 91", "ECON 1", "ECON 2", "ECON 12", "MA 163A", "MA 163AL", "MA 165", "MA 169", "ASL 1", "ASL 2", "ASL 3", "EDUC 55", "METRO 10", "METRO 10L", "ANAT 1", "ANAT 40", "ANAT 58", "ANAT 140", "ELEC 51A", "ELEC 54A", "ELEC 64A", "ELEC 153", "ELEC 156", "MICRO 5", "MICRO 60", "ANHLT 50", "ANHLT 52", "ANHLT 120", "ANHLT 121", "ANHLT 123", "ANHLT 141", "ANHLT 142", "ANHLT 151", "ANHLT 161", "EMC 100", "EMC 103", "EMC 104.1", "EMC 105", "EMC 108", "EMC 114", "EMC 116", "EMC 116.1", "EMC 118", "EMC 119", "EMC 124", "EMC 130A", "EMC 130B", "EMC 131A", "EMC 132", "MUSC 1", "MUSC 2A", "MUSC 2C", "MUSC 3A", "MUSC 3C", "MUSC 4A", "MUSC 5A", "MUSC 5B", "MUSC 6.1", "MUSC 7", "MUSC 8", "MUSC 9", "MUSC 15", "MUSC 18.3", "MUSC 50", "MUSC 51A", "MUSC 51B", "MUSC 60A", "ANSCI 20", "ANSCI 50", "ANSCI 51", "ANSCI 171", "ENGR 6", "ENGR 10", "ENGR 16", "ENGR 25", "ENGR 34", "ENGR 45", "MUSCP 11A", "MUSCP 11B", "MUSCP 11C", "MUSCP 17A", "MUSCP 17B", "MUSCP 21A", "MUSCP 21B", "MUSCP 21C", "MUSCP 21D", "MUSCP 23A", "MUSCP 23B", "MUSCP 23C", "MUSCP 23D", "MUSCP 30A", "MUSCP 30B", "MUSCP 30C", "MUSCP 30D", "MUSCP 32A", "MUSCP 32B", "MUSCP 32C", "MUSCP 32D", "MUSCP 33A", "MUSCP 33B", "MUSCP 33C", "MUSCP 33D", "MUSCP 40.1", "MUSCP 40.2", "MUSCP 40.3", "MUSCP 40.4", "MUSCP 40.5", "MUSCP 40.6", "MUSCP 40.7", "MUSCP 42A", "MUSCP 42B", "MUSCP 42C", "MUSCP 42D", "ANTHRO 1", "ANTHRO 1L", "ANTHRO 2", "ANTHRO 3", "ANTHRO 4", "ANTHRO 21", "ANTHRO 30", "ANTHRO 31", "ANTHRO 43", "ENGL 1A", "ENGL 1B", "ENGL 2", "ENGL 4A", "ENGL 4B", "ENGL 4C", "ENGL 5", "ENGL 7", "ENGL 25", "ENGL 30.1", "ENGL 33", "ENGL 46.1", "ENGL 49", "ENGL 100", "ENGL 305.1", "ENGL 307", "ENGL 309", "ENGL 770", "NRM 12", "NRM 51", "NRM 56", "NRM 67", "NRM 87", "NRM 99I", "NRM 142", "APTECH 43", "APTECH 45", "APTECH 46", "APTECH 64", "APTECH 191", "ESL 100", "ESL 317GR", "ESL 332", "ESL 334", "ESL 371", "ESL 371A", "ESL 371CP", "ESL 372", "ESL 372CP", "ESL 373", "ESL 373CP", "ESL 701", "ESL 712", "ESL 713", "ESL 713CP", "ESL 714", "ESL 714CP", "ESL 714RW", "ESL 715", "ESL 716", "ESL 716CP", "ESL 716RW", "ESL 722", "ESL 732", "ESL 770", "ESL 781", "ESL 781A", "NRA 150A", "NRA 150B", "ARCH 2.3", "ENVS 12", "NR 75B", "NR 75C", "NR 75D", "NR 75.1A", "ART 1.1", "ART 1.2", "ART 2.1", "ART 2.2", "ART 2.3", "ART 3", "ART 4", "ART 5", "ART 7A", "ART 7B", "ART 12", "ART 14A", "ART 14B", "ART 14C", "ART 19", "ART 21", "ART 23", "ART 24", "ART 27A", "ART 27B", "ART 28A", "ART 28B", "ART 28C", "ART 31A", "ART 31B", "ART 31C", "ART 31D", "ART 33A", "ART 33B", "ART 49", "ART 60A", "ART 75", "ART 82", "EQSCI 25", "EQSCI 101", "EQSCI 102A", "EQSCI 120", "EQSCI 170", "NRV 51", "NRV 51L", "NRV 58A", "ASTRON 3", "ASTRON 3L", "ASTRON 4", "ASTRON 4L", "ASTRON 12", "FASH 8", "FASH 52.2", "FASH 56A", "FASH 62A", "FASH 70A", "FASH 70B", "OA 501", "OA 502", "OA 505", "OA 507", "OA 581", "ATHL 1", "ATHL 3", "ATHL 8", "ATHL 9", "ATHL 10", "ATHL 11L", "ATHL 13", "ATHL 14", "ATHL 15L", "ATHL 17", "ATHL 18", "ATHL 21", "ATHL 22.1L", "ATHL 22.2L", "ATHL 27", "ATHL 28", "ATHL 29L", "ATHL 31L", "ATHL 45", "ATHL 45L", "FIRE 71", "FIRE 72", "FIRE 73", "FIRE 74", "FIRE 76", "FIRE 77", "FIRE 78", "FIRE 99I", "FIRE 107A", "FIRE 200.3", "FIRE 201", "FIRE 206", "FIRE 208", "FIRE 208.1", "FIRE 708", "PLS 50", "PLS 51", "PLS 53", "PLS 55", "PLS 60", "PLS 62", "PLS 99I", "AUTO 51", "AUTO 53", "AUTO 54", "AUTO 80", "AUTO 99", "AUTO 108", "AUTO 120", "AUTO 125", "AUTO 153", "AUTO 156", "AUTO 194", "FLORS 83A", "FLORS 83B", "FLORS 114", "FLORS 183C", "PHARM 102", "PHARM 103", "PHARM 151", "PHARM 152", "PHARM 154A", "PHARM 255", "BEHSC 49", "FDNT 10", "FDNT 60", "FDNT 62", "FDNT 70", "FDNT 162", "PHIL 3", "PHIL 5", "PHIL 6", "PHIL 7", "PHIL 8", "PHIL 9", "PHIL 11", "PHIL 20", "BIO 2.1", "BIO 2.2", "BIO 2.3", "BIO 10", "BIO 12", "BIO 13", "BIO 16", "BIO 25", "BIO 49", "BIO 100", "FREN 1", "FREN 2", "FREN 3", "PHYS 1", "PHYS 11", "PHYS 20", "PHYS 20L", "PHYS 21", "PHYS 21L", "PHYS 40", "PHYS 41", "PHYS 42", "PHYS 43", "PHYS 49", "BOTANY 10", "GIS 40", "PHYSIO 1", "PHYSIO 58", "BAD 1", "BAD 2", "BAD 10", "BAD 18", "BAD 52", "BAD 53", "BAD 55", "BAD 59", "BAD 98", "BAD 99", "GEOG 3", "GEOG 4", "GEOG 7", "POLS 1", "POLS 2", "BBK 50", "BBK 53.1", "BBK 53.2", "GEOL 1", "GEOL 1L", "GEOL 20", "PSYCH 1A", "PSYCH 1B", "PSYCH 3", "PSYCH 4", "PSYCH 5", "PSYCH 7", "PSYCH 8", "PSYCH 30", "PSYCH 34", "PSYCH 56", "BGN 71", "BGN 81", "BGN 101", "BGN 102", "BGN 110", "BGN 111", "BGN 112", "BGN 201", "BGN 203", "BGN 204", "BGN 205", "GERM 1", "GERM 2", "GERM 3", "RADT 60", "RADT 61A", "RADT61.1AL", "RADT 62AL", "RADT 63B", "RADT 64", "RADT 64L", "RADT 98", "RADT 100", "BMG 52", "BMG 53", "BMG 61", "BMG 62.1", "BMG 62.4", "BMG 63.1", "BMG 66.4", "BMG 100", "BMG 104", "BMG 105", "GD 15", "GD 20", "GD 51", "GD 53", "GD 54", "GD 55", "GD 63", "GD 72", "RE 50", "RE 51", "RE 52", "RE 53", "BMK 50", "BMK 51", "BMK 54", "BMK 57", "BMK 59", "BMK 60", "HLC 121", "HLC 121L", "HLC 140", "HLC 160", "RELS 1", "RELS 3", "RELS 6.66", "RELS 8", "RELS 21", "BOT 85.1", "BOT 99.1I", "BOT 99.2I", "BOT 99.3I", "BOT 154", "HLE 5", "HLE 6", "SOC 1", "SOC 2", "SOC 3", "SOC 5", "SOC 10", "SOC 30", "CHEM 1A", "CHEM 1B", "CHEM 8", "CHEM 12A", "CHEM 42", "CHEM 49", "CHEM 60", "CHEM 100", "HIST 1.1", "HIST 1.2", "HIST 4.1", "HIST 4.2", "HIST 8.1", "HIST 17.1", "HIST 17.2", "HIST 18.1", "HIST 18.2", "HIST 20", "HIST 21", "HIST 22", "HIST 26", "HIST 30", "SPAN 1", "SPAN 2", "SPAN 3", "SPAN 4", "SPAN 40", "SPAN 50A", "SPAN 50B", "CHLD 10", "CHLD 51", "CHLD 53", "CHLD 55.6", "CHLD 66", "CHLD 66.1", "CHLD 68", "CHLD 79.4", "CHLD 90.1", "CHLD 90.2", "CHLD 90.3", "CHLD 90.4", "CHLD 160.1", "CHLD 217.1", "CHLD 220", "CHLD 711", "HORT 8", "HORT 50.1", "HORT 50.2", "HORT 65", "HORT 71", "HORT 91", "HORT 181", "SE 580", "SE 712", "CEST 51", "CEST 65", "CEST 99I", "CEST 192", "HOSP 50", "HOSP 53", "HOSP 54", "HOSP 80", "SPCH 1A", "SPCH 2", "SPCH 3A", "SPCH 9", "SPCH 52A", "SPCH 52B", "SPCH 52C", "SPCH 52D", "SPCH 60", "CSKLS 312", "CSKLS312.2", "CSKLS 313", "CSKLS 334", "CSKLS367.1", "CSKLS367.2", "CSKLS 371", "CSKLS 372", "CSKLS 731", "CSKLS 732", "CSKLS 733", "CSKLS 770", "HR 60", "HR 61", "HR 62", "HR 63", "HR 64", "HR 65", "SURV 60", "COMM 5", "COMM 6", "COMM 7", "COMM 10", "COMM 98", "HUMAN 4.1", "HUMAN 5", "HUMAN 6", "HUMAN 7", "HUMAN 8", "HUMAN 21", "SUSAG 50", "SUSAG 65", "SUSAG 160", "CHW 151", "CHW 151L", "CHW 154", "CHW 155", "IED 190", "THAR 1", "THAR 2", "THAR 6", "THAR 10A", "THAR 10B", "THAR 11.1", "THAR 11.2", "THAR 11.3", "THAR 11.4", "THAR 13.2A", "THAR13.2AL", "THAR 13.2B", "THAR13.2BL", "THAR 19", "THAR 20", "THAR 21A", "THAR 21B", "THAR 22", "THAR 24", "THAR 25", "THAR 25.1", "THAR 25.2", "THAR 25.3", "THAR 25.4", "THAR 25.5", "THAR 27", "THAR 49", "THAR 50", "THAR 50L", "THAR 121.2", "THAR 127.2", "CI 51", "CI 53", "CI 54", "INTDIS 2", "INTDIS 90", "VIT 1", "VIT 51", "VIT 55", "VIT 60", "CS 5", "CS 10", "CS 11", "CS 12", "CS 49", "CS 50A", "CS 50B", "CS 50.21", "CS 55.11", "CS 57.11", "CS 60.11A", "CS 60.11B", "CS 61.11A", "CS 61.11B", "CS 62.11A", "CS 62.11B", "CS 63.11A", "CS 63.11B", "CS 65.11", "CS 70.11A", "CS 70.11B", "CS 70.13", "CS 71.11", "CS 72.11A", "CS 72.11C", "CS 74.11", "CS 74.21A", "CS 74.21B", "CS 78.1", "CS 80.11", "CS 80.15", "CS 81.21", "CS 81.62", "CS 82.21A", "CS 82.21B", "CS 82.56", "CS 84.13", "CS 98", "CS 99I", "CS 165.31", "CS 167.11", "CS 175.11", "INDE 20", "INDE 50", "INDE 52", "INDE 63", "INDE 136", "VE 713", "CONS 62", "CONS 183", "ITAL 1", "ITAL 2", "ITAL 3", "ITAL 4", "WWTR 112", "WWTR 120", "WWTR 123", "COUN 10", "COUN 20", "COUN 53", "COUN 60", "COUN 62", "COUN 74", "COUN 80", "COUN 87", "COUN 90", "COUN 91", "COUN 93", "COUN 96", "COUN 98", "COUN 99I", "COUN 162.1", "COUN 270", "COUN 355", "COUN 390", "JOUR 1", "JOUR 1L", "JOUR 52A", "JOUR 52B", "JOUR 52C", "JOUR 52D", "JOUR 54", "JOUR 55", "WTR 101", "WTR 103", "WTR 110", "CUL 98", "CUL 99I", "CUL 250", "CUL 250.1", "CUL 250.2", "CUL 250.3", "CUL 252.3", "CUL 252.14", "CUL 253A", "CUL 253B", "CUL 253.6", "CUL 253.7", "CUL 254", "CUL 254.4", "CUL 255", "CUL 255.1", "CUL 256", "CUL 256.3", "CUL 256.5", "CUL 256.8", "CUL 256.9", "CUL 256.11", "KAQUA 1.1", "KAQUA 1.2", "KAQUA 1.3", "KAQUA 2.3", "KAQUA 3.1", "KAQUA 3.2", "WELD 70", "WELD 171.1", "WELD 171.2", "WELD 171.3", "WELD 175A", "WELD 175B", "DANCE 2", "DANCE 3.1", "DANCE 10.1", "DANCE 10.2", "DANCE 11.1", "DANCE 11.2", "DANCE 11.3", "DANCE 11.4", "DANCE 13.1", "DANCE 13.2", "DANCE 13.3", "DANCE 14.2", "DANCE 14.3", "DANCE 14.4", "DANCE 16.1", "DANCE 16.2", "DANCE 16.3", "DANCE 16.4", "DANCE 16.5", "DANCE 16.6", "DANCE 21.1", "DANCE 21.2", "DANCE 21.3", "DANCE 21.4", "DANCE 21.5", "DANCE 21.6", "DANCE 29", "KCOMB 1.4", "KCOMB 2.1", "KCOMB 2.2", "KCOMB 2.3", "KCOMB 4.1", "KCOMB 4.2", "KCOMB 5.1", "KCOMB 7.3", "KCOMB 10", "WINE 1", "WINE 3", "WINE 42.1", "WINE 70", "WINE 102", "WINE 105", "WINE 110", "WINE 116", "WINE 124", "DE 50", "DE 51", "DE 55A", "KFIT 1.1", "KFIT 1.2", "KFIT 3.1", "KFIT 3.2", "KFIT 3.3", "KFIT 5.1", "KFIT 5.2", "KFIT 6.1", "KFIT 6.2", "KFIT 7.1", "KFIT 8.1", "KFIT 8.2", "KFIT 10.1", "KFIT 11.1", "KFIT 16.1", "KFIT 21.1", "KFIT 30.1", "KFIT 31.1", "KFIT 32.1", "KFIT 35.1", "KFIT 36.1", "KFIT 37.1", "KFIT 50", "WRKEX 97", "DA 60", "DA 61", "DA 62", "DA 69", "KINDV 2.1", "KINDV 2.2", "KINDV 3.1", "KINDV 3.2", "KINDV 4.1", "KINDV 4.2", "WEOC 99", "WEOC 99I", "DNA 299.4", "KINES 1", "KINES 4", "KINES 5", "KINES 21", "KINES 49", "KINES 53", "KINES 55", "KINES 59", "KINES 62A", "KINES 62B", "KINES 62C", "KINES 62D", "KINES 63", "KINES 80", "KINES 81", "KINES 83"
	];

$("#textbox").autocomplete({
     source: function(req, responseFn) {
        var re = $.ui.autocomplete.escapeRegex(req.term);
        var matcher = new RegExp( "^" + re, "i" );
        var a = $.grep( COURSE_TITLES, function(item,index){
            return matcher.test(item);
        });
        responseFn(a.slice(0, 10));
    },
    select: function(event, ui) {
		//alert(ui.item.value);
		RequestClassData(ui.item.value);
		//setTimeout( function(){$( "#B_addCourse" ).data( "button" ).clickBut() } , 100 );


		//	return false;

    },


    delay: 50
});


} );