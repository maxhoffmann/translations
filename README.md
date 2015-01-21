# translations [![version][1]][2] [![build][3]][4]
translations api for node.js and the browser.

## Installation

```js
npm install translations
```

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

### Installation

```bash
npm install translations -g # if you want to use the cli globally
```

### sync

```bash
# sync locales
translations sync <master> <target>

# example
translations sync locales/en.json locales/de-DE.json
```

`translations sync` syncs the `master` translations file with the `target` one:

If `target` has values that are not strings, it throws an error.

If `target` does not exist yet, a copy of `master` will be created with the target’s name (`de-DE.json`).

If `target` does already exist, the command does the following:
- every key not found in `master` is removed
- every key not found in `target` is added

### export

```bash
# export locales for browser usage
translations export <inputDirectory> <outputDirectory> --assign <variable>
```

`translations export` will create or overwrite the given output directory with js files for valid locales in the input directory. Each js
file assigns the locale’s translations to the given variable (or `window.locale` by default).

## LICENSE

MIT (2015) Maximilian Hoffmann

[1]: http://img.shields.io/npm/v/translations.svg?style=flat
[2]: https://www.npmjs.org/package/translations
[3]: http://img.shields.io/travis/maxhoffmann/translations.svg?style=flat
[4]: https://travis-ci.org/maxhoffmann/translations
