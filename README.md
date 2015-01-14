# translate
translations api for node.js.

## Usage

```js
var t = translate(require('locales/de-DE.json'));

t('How are you?');
// "Wie geht es dir?"

t('Hello %s, how are you?', ['Max']);
// "Hallo Max, wie geht es dir?"

t('Hello %s, how is %s?', ['Max', t('the weather')]);
// "Hallo Max, wie ist das Wetter?"

t('Hello %s, how is %s?', ['Max']);
// throws error
```

__de-DE.json__

```json
{
  "How are you?": "Wie geht es dir?",
  "Hello %s, how are you?": "Hallo %s, wie geht es dir?",
  "Hello %s, how is the %s?": "Hallo %s, wie ist %s?",
  "the weather": "das Wetter"
}
```

## CLI

```bash
npm install maxhoffmann-translate

maxhoffmann-translate <source> <target>

maxhoffmann-translate locales/en.json locales/de-DE.json
```

This command syncs the translation keys from `source` to `target`:

If `target` has values that are not strings, it throws an error.

If `target` does not exist yet, a copy of `source` will be created with the new name (`de-DE.json`).

If `target` does already exist, the command does the following:
- every key not found in `source` is removed
- every key already in `target` is overwritten.
