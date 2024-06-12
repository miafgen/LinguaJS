# LinguaJS
LinguaJS makes your static website or frontend multilingual.

## Get started
### Using Lingua
#### Translations object
You must provide the terms and the corresponding translations in the different languages you wish to propose. This is done with the *translations" object:

    let translations = {
        'firstname': { de: 'Vorname', fr: 'Prénom', it: 'Nome' },
        'lastname': { de: 'Nachname', fr: 'Nom', it: 'Cognome', en: 'Last name' },
        'completename': { de: '${firstname} + ${lastname}', fr: '${firstname} + ${lastname}', it: '${firstname} + ${lastname}' },
        'title': { de: 'Titel', fr: 'Titre', it: 'Titolo' },
        'subtitle': { de: 'Untertitel', fr: 'Sous-Titre', it: 'Subtitolo' }
    }
    
#### Options object
All options are... optional ;-) The list of options presented here is exhaustive and shows the corresponding default values. 

| Option             | Type     | Default value                                    |
|--------------------|----------|--------------------------------------------------|
| `verbose`          | Boolean  | `false`                                          |
| `detectionModules` | Array    | `[ 'url', 'cookie', 'browser' ]`                 |
| `urlParameter`     | String   | `'lang'`                                         |
| `cookieName`       | String   | `'lang'`                                         |
| `htmlAttribute`    | String   | `'data-lingua'`                                  |
| `autoRefresh`      | Boolean  | `true`                                           |
| `languageChanged`  | Function | `function( newLanguage ) {}`                     |
| `processor`        | Function | `function( data, newLanguage ) { return data; }` |
| `loaded`           | Function | `function( newLanguage ) {}`                     |

If one of the default values is not suitable, it can be redefined by passing an object with its own settings:

    let options = {
        detectionModules: [ 'url' ],
        urlParameter: 'sprache'
    }

#### Initialize

    let language = new Lingua( translations [, options] );


#### Methods

| Method                      | Description                                                                                                                                                     | Sample                                                                             |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| currentLanguage( language ) | **Used to switch current language**                                                                                                                             | currentLanguage( 'de' );                                                           |
| currentLanguage()           | **Get current language**                                                                                                                                        | currentLanguage();                                                                 |
| translateDocument( language = null )         | **Translates current HTML document**: It is called automatically after initialization, and if auto refresh is activated, also on language switch and DOM change | translateDocument();                                                               |
| translateText( language = null )             | **Translate a text**: Can be one of the terms alone, or one of the terms integrated in a string. If integrated, use prefix `${` and suffix `}`.                 | language.translateText( 'firstname' ); language.translateText( '${firstname}: ' ); |

### Adapting your HTML document
Add the following attribute to your HTML elements with the corresponding associated term to make this element multilingual:
`data-lingua="term"` e.g. `<span data-lingua="firstname"></span>`

You can also pass a longer text that includes one or more of the predefined terms. In this case, surround the term with the prefix `${` and the suffix `}`:

* `<span data-lingua="${firstname}"></span>`
* `<span data-lingua="<strong>${firstname} ${lastname}</strong>"></span>`

## License and warranty
This software is offered on an "as-is" basis and has been created primarily for specific, personal needs. No warranty of any kind is provided, especially with regard to security.

This software is in the public domain. This means that it is possible to change, use and redistribute the code of this software without prior authorization from the original author.
