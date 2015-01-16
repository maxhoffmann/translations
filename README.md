# translations
translations api for node.js and the browser.

## Usage

```js
var locale = require('locales/de-DE.json'); // node.js;
var locale = window.locale; // browser example

var t = translations(locale); // production mode: ignores most errors
var t = translations(locale, true); // development mode: throws more errors

t('How are you?');
// "Wie geht es dir?"

t('Hello {name}, how are you?', { name: 'Max' });
// "Hallo Max, wie geht es dir?"

t('Hello {name}, how is {thing}?', { name: 'Max', thing: t('the weather') });
// "Hallo Max, wie ist das Wetter?"

t('undefined key in locale');
// throws error in development mode for undefined keys
// returns empty string in production mode

t('Hello {name}, how is {thing}?', { name: 'Max' });
// throws error in development mode for undefined variables
// prints placeholders in production mode
```

__de-DE.json__

```json
{
  "How are you?": "Wie geht es dir?",
  "Hello {name}, how are you?": "Hallo {name}, wie geht es dir?",
  "Hello {name}, how is {thing}?": "Hallo {name}, wie ist {thing}?",
  "the weather": "das Wetter"
}
```

## CLI

```bash
npm install translations

translations <source> <target>

translations locales/en.json locales/de-DE.json
```

This command syncs the translation keys from `source` to `target`:

If `target` has values that are not strings, it throws an error.

If `target` does not exist yet, a copy of `source` will be created with the new name (`de-DE.json`).

If `target` does already exist, the command does the following:
- every key not found in `source` is removed
- every key not found in `target` is added
