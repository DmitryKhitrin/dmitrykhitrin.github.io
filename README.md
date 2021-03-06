# Tag Form

## Description

Email Tag Form - Test task representing a tag form.

## How to build project

1. `npm i`
2. `npm run build:production`

## How to launch tests

1. `npm i`
2. `npm run test`

## Usage

```js
<body>
    <div id="form"> </div>
    <script src="static/bundle.js"></script>
    <script>const page = document.querySelector('#form'); const Form = new TagForm(page);</script>
</body>
```

In order to use this form, you need to:

1. `Load script from 'static / bundle.js'.`
2. `Create an instance of the TagForm.`

## Available methods

-   `TagForm.setNewList` - clears the list and draws the new one passed to it.

```js
// Record format
const record = string[];
const settings = {
    maxLenght: number; - // max length of displayed value
    validationRegExp: RegExp; - // validation regExp (email is Default)
}
```

-   `TagForm.getValidRecordsCount` - returns the number of valid records.

-   `TagForm.clearAll` - completely cleans the form.

-   `TagForm.recordWasRemoved` - called after mail has been deleted returns the deleted message.

-   `TagForm.recordWasAdded` - called after mail has been added and returns the added message.

```js
const Form = new TagForm(container);
const callback = () => {};
Form.recordWasAdded(callback);
```

-   `TagForm.getValidRecords` - returns only valid form's records.

-   `TagForm.getAllRecords` - returns all records.

-   `TagForm.getRecordsCount` - returns the number of records in the form..
