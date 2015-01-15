# translations
translations api for node.js and the browser.

## Usage

```js
var t = translations(require('locales/de-DE.json')); // node.js
var t = translations(translationsObject); // browser

t('How are you?');
// "Wie geht es dir?"

t('Hello {name}, how are you?', { name: 'Max'});
// "Hallo Max, wie geht es dir?"

t('Hello {name}, how is {name}?', { name: 'Max', thing: t('the weather')});
// "Hallo Max, wie ist das Wetter?"

t('Hello {name}, how is {thing}?', { name: 'Max' });
// throws error
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
- every key already in `target` is overwritten.
