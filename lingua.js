/* 
 * Quirksmods Cookie library
 * https://www.quirksmode.org/js/cookies.html
 */
let Lingua_cookies = { create:function(e,t,n){if(n){var r=new Date;r.setTime(r.getTime()+24*n*60*60*1e3);var i="; expires="+r.toGMTString()}else i="";document.cookie=e+"="+t+i+"; path=/"},read:function(e){for(var t=e+"=",n=document.cookie.split(";"),r=0;r<n.length;r++){for(var i=n[r];" "==i.charAt(0);)i=i.substring(1,i.length);if(0==i.indexOf(t))return i.substring(t.length,i.length)}return null},erase:function(e){cookies.create(e,"",-1)} };

/*
 * QueryString (michelgen@gmail.com)
 * public domain
 */
let Lingua_queryString = function(){let t=function(t){let e=[...t.matchAll(/(.*)(#(.*))/g)];return 0==e.length?{text:t,anchor:null}:{text:e[0][1],anchor:e[0][3]}};var e="",n=[],o=[],l=document.location.href.indexOf("?",0);if(l>=0){let r=t(e=document.location.href.substring(l+1,document.location.href.length));e=r.text,null!=r.anchor&&(o["#"]=r.anchor),e.indexOf("&",0)>=0?n=e.split("&"):n[0]=e,n.forEach((function(t){var e,n,l,r,c=[];-1!=t.indexOf("=")?(e="=",l=[],-1!=(r=(n=t).indexOf(e))&&(l=[n.substr(0,r),decodeURIComponent(n.substr(r+1))]),c=l):c=[t,!0],null!=c[1]&&"string"==typeof c[1]&&(c[1]=c[1].replace(/\+/g," ")),void 0===o[c[0]]?o[c[0]]=c[1]:"string"==typeof o[c[0]]||"boolean"==typeof o[c[0]]?o[c[0]]=[o[c[0]],c[1]]:o[c[0]].push(c[1])})),Object.keys(o).forEach((function(t){let e=o[t];"#"!=t&&(o[t+"$size"]="string"==typeof e||"boolean"==typeof e?1:e.length)}))}else{let e=t(document.location.href);null!=e.anchor&&(o["#"]=e.anchor)}return o};

/*
 * StringUtils (michelgen@gmail.com)
 * public domain
 */
let Lingua_stringUtils = {codify:function(e=""){return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\W/g,"_").replace(/_+/g,"_").replace(/(^_)|(_$)/g,"")},interpolate:function(e="",r={},t="${",l="}"){let n="";do{n=e,Object.entries(r).forEach((function(r){e=e.replaceAll(t+r[0]+l,r[1])}))}while(n!=e);return e}}; 
 

/*
 * Lingua
 * public domain
 */
class Lingua
{    
    constructor( translations = {}, options = {} ) 
    {
        //Read query string in url
        this.queryString = Lingua_queryString();
        
        //Default options
        this.options = { 
            detectionModules: [ 'url', 'cookie', 'browser' ],
            urlParameter: 'lang',
            cookieName: 'lang',
            htmlAttribute: 'data-lingua',
            autoRefresh: true,
            processor: function( data, newLanguage ) { return data; },
            loaded: function( newLanguage ) {},
            languageChanged: function( newLanguage ) {}
        };

        if( translations == null || Object.keys( translations ).length == 0 )
        {
            throw 'No or an empty translation object has been given. Please check constructor call: \r\n new Lingua( { "hello": { de: "Guten Tag", fr: "Bonjour", it: "Buongiorno" } } )';
        }
        
        //Take translations
        this.translations = translations;

        //Take defined options
        let that = this;
        Object.entries( options ).forEach( function( item ) 
        {
            that.options[ item[ 0 ] ]  = item[ 1 ];
        });

        //Set current language
        this.language = null;

        //Set current translation object
        this.translation = {};
        
        //Detect all possible languages in translations
        let possibleLanguages = new Set();
        Object.entries( translations ).forEach( function( translation ) 
        {    
            Object.keys( translation[1] ).forEach( function( translationLanguages )
            {
                possibleLanguages.add( translationLanguages );
            } );
        } );
        
        this.languages = Array.from( possibleLanguages );

		try
		{
			this.detectLanguage();
			if( this.options.autoRefresh != null && this.options.autoRefresh )
			{
				this.enableAutoRefresh();
			}
		}
		catch( e )
		{			
            console.log( e );
            this.log( e );            
		}			
    }
    
    currentLanguage( language )
    {
        if( language != null )
        {
            if( typeof( language ) === 'string' && this.languages.includes( language ) )
            {            
                if( this.language != language )
                {
                    let oldLanguage = this.language;
					this.language = language;
                    this.log( 'Using language "' + this.language + '"' );

                    //Creating translation object for chosen language
                    let that = this;
                    let currentTranslationObject = {};
                    Object.entries( this.translations ).forEach( function( translation )
                    {
						currentTranslationObject[ translation[ 0 ] ] = ( translation[ 1 ][ that.language ] != undefined ? translation[ 1 ][ that.language ] : translation[ 0 ] );
                    } );
                    this.translation = currentTranslationObject;

					//Translate document for the first time or again if autoRefresh option has been enabled (it is by default)
					if( oldLanguage == null || this.options.autoRefresh )
					{
						this.translateDocument();
					}

                    //Once loaded (oldLanguage == null), call function 'loaded' if defined
					if( oldLanguage == null && typeof( this.options.loaded ) == 'function' )
					{
						this.options.loaded( language );
					}

					if( typeof( this.options.languageChanged ) == 'function' )
					{
						this.options.languageChanged( language );
                    }
                }
                else
                {
                    this.log( 'Language already set to "' + this.language + '"' );
                }
            }
            else
            {
                throw 'Requested language does not exist';
            }
        }

        return this.language;
    }
    
    detectLanguage()
    {
        let detectedLanguage = null;
        
        let that = this;
        this.options.detectionModules.every( function( orderItem ) 
        {
            if( orderItem === 'url' )
            {
                if( that.queryString[ that.options.urlParameter ] != undefined && that.languages.includes( that.queryString[ that.options.urlParameter ] ) )
                {
                    detectedLanguage = that.queryString[ that.options.urlParameter ];
                }
            }

            if( orderItem === 'cookie' )
            {
                let cookieContent = Lingua_cookies.read( that.options.cookieName );
                if( cookieContent != null && that.languages.includes( cookieContent ) )
                {
                    detectedLanguage = cookieContent;
                }
            }
            
            if( orderItem === 'browser' )
            {                
                if( that.languages.includes( navigator.language.slice( 0, 2 ) ) )
                {
                    detectedLanguage = navigator.language.slice( 0, 2 );
                }
                
                if( that.languages.includes( navigator.language ) )
                {
                    detectedLanguage = navigator.language;
                }                
            }

            if( detectedLanguage != null )
            {
                that.log( 'Detection by "' + orderItem + '" succeeded' );
                return false;
            }

            that.log( 'Detection by "' + orderItem + '" failed' );
            return true;
        } );

        if( detectedLanguage == null )
        {                        
            if( this.languages.length > 0 )
            {                                
                detectedLanguage = this.languages[ 0 ];
                this.log( 'No language could be detected within the defined detection modules. Falling back to first language defined in translations: "' + this.language + '"' );
            }
        }

        if( detectedLanguage != null )
        {
            this.currentLanguage( detectedLanguage );            
        }
        else
        {
            throw 'No language has been found in the translations. Please check constructor call: \r\n new Lingua( { "hello": { de: "Guten Tag", fr: "Bonjour", it: "Buongiorno" } } )';
        }
    }

    translateDocument()
    {			
        let that = this;
        document.querySelectorAll( '[' + this.options.htmlAttribute + ']' ).forEach( function( item ) 
        {             
            item.innerHTML = that.translateText( item.getAttribute( that.options.htmlAttribute ) );             
        } ); 
		
		this.log( 'Translate document in "' + this.language + '"' );
    }
    
    translateText( text )
    {
        //Search as name
        let searchAsName = this.translation[ text ];
        if( searchAsName != null )
        {
            text = searchAsName;
        }

        //Search as text
		text = Lingua_stringUtils.interpolate( text, this.translation );

		//Call user-defined processor (by default, an empty one that only returns what it receives)
		if( this.options.processor != null && typeof( this.options.processor ) == 'function' )
		{
			text = this.options.processor( text, this.language );
		}

        return text;
    }

    enableAutoRefresh()
    {
        if( this.observer != null )
        {
            this.observer.disconnect();
        }
        
        let observerContext = this;
        this.observer = new MutationObserver( function( mutations ) 
        {											
			if( mutations.some( function( mutation ) { return mutation.target.getAttribute( observerContext.options.htmlAttribute ) == null; } ) )
			{				
				observerContext.log( 'Translate document after detecting changes in DOM' );
				observerContext.translateDocument();				
			}           
        } );
        
        this.observer.observe( document.querySelector( 'html' ), { subtree: true, childList: true } );
		this.log( "Enabled auto refresh" );
    }

    disableAutoRefresh()
    {
        if( this.observer != null )
        {			
            this.observer.disconnect();
			this.log( "Disabled auto refresh" );
        }        
    }
    
    log( message )
    {
        console.log( "%c LinguaJS %c " + message, "background-color: black; color: white; font-weight: bold;", "color: black; font-weight: none;" ); 
    }
}