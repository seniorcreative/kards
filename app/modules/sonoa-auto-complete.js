(function( $ )
{

	/*
	 * INITIALISE PLUGIN
	 */
	$.fn.sonoaAutocomplete = function( options )
	{


        var AJAX_URL 				= '';
	
		var STRING 					= '';

		var SEARCHINPUT 			= '';

		var TYPE					= 'GET';

		var INPUT_CLEAR_FILL		= true;

		var AUTOCOMPLETE_CLASS		= 'js_autocomplete--list';

		var $this 					= $(this);

		var preDefinedFunctions 	= Array('beforeSend', 'onKeyup', 'success', 'onClick', 'onLoad', 'onEmpty', 'error', 'onemptyInput');
		
		var opts 					= $.extend( {}, $this.defaults, options );
				
		var searchField				= $this.selector;
		
		var populateList			= $(opts.SUGGESTION_LIST);
		
		var delay 					= 300;
		
		var isLoading 				= false;
		
		var isDone 					= true;

		var useDefaultPopulate		= true;  // use in the option to overwrite the default populateautocomplete function.
		
		
		if( opts.AJAX_URL != undefined )
		{
			AJAX_URL = opts.AJAX_URL;
		}
		
		if( opts.TYPE != undefined )
		{
			TYPE = opts.TYPE;
		}
		
		if( opts.INPUT_CLEAR_FILL != undefined )
		{
			INPUT_CLEAR_FILL = opts.INPUT_CLEAR_FILL;
		}

		if( opts.AUTOCOMPLETE_CLASS != undefined )
		{
			AUTOCOMPLETE_CLASS = opts.AUTOCOMPLETE_CLASS;
		}	

		if( opts.DELAY != undefined )
		{
			delay = opts.DELAY;
		}

		if( opts.DEFAULT_POPULATE != undefined )
		{
			useDefaultPopulate = opts.DEFAULT_POPULATE;
		}
		
		
		function isCallbackOk( keyOptions )
		{
			return $.inArray( keyOptions, preDefinedFunctions);
		}
		
		// WATCH FOR FUNCTION CALLBACKS
		$.each( options, function( keyOptions, callback )
		{
			if( typeof callback === 'function')
			{	
				if( isCallbackOk( keyOptions ) === -1 ) callback();
			}
			
			if( typeof callback === 'object')
			{
				 if( keyOptions == 'POST_STRING' )
				 {
				 	$.each(callback, function( k, v ){
						STRING += '&' + k + '=' + v;
					});
				 }
			}
		});
		
		$(document).ready(function()
		{ 
			populateList.parent().hide();

		});
		
		//catch tab press event on input field
		$(searchField).on("input keydown",function( e )
		{
			if( e.which == 9 && $(this).val().length>1) {
				keyScrollAutoComplete(false);
			}
		});

		$(searchField).on("input keyup",function( e )
		{
			if( e.which == 40 || e.which == 38 ) return keyScrollAutoComplete(true);
				
			if(!isLoading){
				
				var p = $(searchField).val();
				
				if( e.which == 27) /* <- esc trigger */
				{ 
					populateList.parent().hide();
					$(searchField).val('');
					$(searchField).keyup();
				}
				else if (p.length >= 2)
				{
				  isLoading = true;
				  
				  setTimeout(function(){
					  isLoading = false;
					  isDone = false;
					  isLoading = false;
					  callAjax( searchField, TYPE, AJAX_URL, STRING );
					  
				  }, delay);
				}
				else if (p.length < 2) {
				    isLoading = false;
					populateList.parent().hide();

					onemptyInput();
				}
			}
		});

		if($("#ask-question").length > 0){
			$(document).on("blur","#ask-question",function(){
		        $('.header-search__suggest-overlay').removeClass('on');
		        $('.header-search__suggest').hide();
		    });
		}
		else{
			$(document).on("blur",".autocomplete-dropdown-nav__options__link:last",function(){
		        $(".autocomplete-dropdown-nav").hide();
		    });

		}

		function keyScrollAutoComplete(changeFocus)
		{
			if(useDefaultPopulate){
				populateList.on('keyup', 'a', function(e)
				{
					onkeyup();
				});

				populateList.first().on('focus', 'a', function()
				{
					$('.autocomplete-dropdown-nav__options__link.hover-state').removeClass('hover-state');
					$(this).addClass('hover-state');

				}).on('keydown', 'a', function(e)
				{
					if (e.keyCode == 40) {
						$(this).parent().next().children("a").focus();
						return false;

					} else if (e.keyCode == 38) {
						$(this).parent().prev().children("a").focus();

						return false;
					}

					if(e.keyCode == 13){
						$(this).click();
					}

				});
				if(changeFocus){
					populateList.find('li').first().children("a").focus();
				}

				populateList.on('focus', 'a', function()
				{
					var captured = $(this).parent().first().text();
					$this.val( captured );
				});
			}
			else{
				var resultsArea = $(".search-bar__suggest__wrapper");
				var aTags = $(".search-bar__suggest__wrapper a");
				var trackIndex = 0;

				resultsArea.on('keydown', 'a', function(e)
				{
					if (e.keyCode == 40) {
						if(++trackIndex<aTags.length){
							aTags[trackIndex].focus();
						}
						else{trackIndex--;}
						return false;

					} else if (e.keyCode == 38) {
						if(--trackIndex>=0){
							aTags[trackIndex].focus();
						}
						else{trackIndex=0;}

						return false;
					}

					if(e.keyCode == 13){
						$(this).click();
					}

				});
				if(changeFocus){
					resultsArea.find("a").first().focus();
				}
				$(aTags[aTags.length-1]).on("blur",function(){
			        $(".js-search-close").click();
			    });
			}
		}



		// AJAX
		function callAjax( searchField, TYPE, AJAX_URL, STRING )
		{	
			var string	= STRING + '&query=' + $(searchField).val();

            SEARCHINPUT = $(searchField).val();

            if(SEARCHINPUT.length >1){

				$.ajax({
					type		: TYPE,
					url			: AJAX_URL,
					data		: string,
					dataType	: "json",
					cache		: false,
					
					beforeSend: function() {
						beforeSend();
					},
					
					success	 : function (data) {
						if( data ){
							isDone = true;
							if(useDefaultPopulate){
								populateAutoComplete( data );
							}
							else{
								onComplete( data );
							}
						}

						if( data.error ){
							onError( data );
						}						
					},
				});
			}
		}

		function populateAutoComplete( data )
		{

            //console.log('data', data);
			// ONLY POPULATE IF THERES AUTOCOMPLETE MATCHES

			var aPopulatedList = '';

			$("." + AUTOCOMPLETE_CLASS).css('display', 'block');

			if( data.error == undefined )
			{
				var aPopulatedList = '';

				if( data.length <= 0 ) {
					return onEmpty();
				}

				data = data.autocomplete;

				$.each( data, function(i, v)
				{
					/*if( v.id != undefined && v.question != '' )
					{

						var start = v.question.search(new RegExp(SEARCHINPUT, "i"));
						var length = SEARCHINPUT.length;
						var matchingWords = v.question.replace(new RegExp(SEARCHINPUT, "i"),"<strong>"+v.question.substr(start,length)+"</strong>");

						aPopulatedList += '<li><a class="autocomplete-dropdown-nav__options__link PopulatedList" href="#" data-id="' + v.id + '" data-tabid="' + i + '"><span class="autocomplete-dropdown-nav__options__name">' + matchingWords + '</span></a></li>';
					}*/

					if( v.content_id != undefined && v.content != '' )
					{

						var start = v.content.search(new RegExp(SEARCHINPUT, "i"));
						var length = SEARCHINPUT.length;
						var matchingWords = v.content.replace(new RegExp(SEARCHINPUT, "i"),"<strong>"+v.content.substr(start,length)+"</strong>");

                        console.log('matching words',SEARCHINPUT, matchingWords);

						aPopulatedList += '<li><a class="autocomplete-dropdown-nav__options__link PopulatedList" href="#" data-id="' + v.content_id + '" data-tabid="' + i + '"><span class="autocomplete-dropdown-nav__options__name">' + matchingWords + '</span></a></li>';

					}

				});

                //console.log(' built list ', aPopulatedList);

				//populateList.parent().show();

                populateList = $('.autocomplete-dropdown-nav__options__list');

				if( populateList.children("ul").length <= 0 )
				{
					populateList.html('<ul></ul>');
				}
                else
                {
                    populateList.html( aPopulatedList );
                }

				$('.PopulatedList').click( function( e )
				{
					populateList.parent().hide();

					if(INPUT_CLEAR_FILL)
					{
						$(searchField).val( $(this).text() );
					}
					else{
						$(searchField).val( '' );
					}

					onClick( $(this).data(), this );
				});

			}


			if( data.length <= 0 ) {
				return onEmpty();
			}
			
			onComplete( data );
		}
		
		
		// BEFORE SEND EVENT HANDLER
		function beforeSend()
		{
			opts.beforeSend();
		}
		
		// ON COMPLETE EVENT HANDLER
		function onComplete( data )
		{
			if( data != undefined ){
				opts.success( data );
			}
		}
		
		// ON CLICK EVENT HANDLER
		function onClick( object, e )
		{
			if( e != undefined ){
				opts.onClick( object, e );
			}
		}
		
		// ON EMPTY EVENT HANDLER
		function onEmpty()
		{
			opts.onEmpty();
		}

		function onemptyInput()
		{
			opts.onEmptyInput();
			//console.log(opts);
		}
		
		// ON ERROR EVENT HANDLER
		function onError( data )
		{
			if( data != undefined ){
				opts.error( data );
			}
		}
		
		// ON KEYUP EVENT HANDLER
		function onkeyup()
		{
			opts.onKeyup();
		}

		
		function getOptions(){
			return opts;
		}
		
		
	};//END:fn
	
	
	
})( jQuery );