Email Tag Form

## Description

Email Tag Forn - Test task representing a tag form for email addresses

# How to build project

1. npm i
2. npm run build:production

## How to launch tests

1. npm i
2. npm run test

# Usage

```js
<body>
    <div id="form"> </div>
    <script src="static/bundle.js"></script>
    <script>const page = document.querySelector('#form'); const Form = new EmailForm(page);</script>
</body>
```

In order to use this form, you need to:

1. Load script from 'static / bundle.js'.
2. create an instance of the EmailForm.

# Available methods

-   `EmailForm.setNewList` - clears the list and draws the new one passed to it.

```js
// Email format
const emails = string[];
```

-   `EmailForm.getValidEmailsCount` - returns the number of valid email.

-   `EmailForm.emailWasRemoved` - called after mail has been deleted returns the deleted message.

-   `EmailForm.emailWasAdded` - called after mail has been added and returns the added message.
