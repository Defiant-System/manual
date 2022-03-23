# Overview
<!--
<img src="~/help/images/def-logo.webp" style="float: left; width: 42px; margin: 3px 5px 0 0;">
-->
Markdown files are commonly used as a technical narrative text when describing code libraries. With markdown files, library authors explains their code with descriptions intermixed with static sample code, to exemplify the advantages of their libraries. It is fantastic. But as a reader, I missed the ability to test the code live - exactly on the spot, instead of the requirment to download the library, create a test-page in a local sandbox. Sure, I can try out the library at [JSFiddle](https://jsfiddle.net/), [Codepen](https://codepen.io/) or similar. But for me, changing context (i.e. site) results in tarnished focus.

A few years ago, I came in contact with [Jupyter Notebook](https://jupyter.org/), when coding machine learning and I thought that feature was amazing. Even though the code was primarily for [Python](https://www.python.org/) and serverside executed code - or more accurately, the code is piped to a kernel - I decided a few weeks ago to bring this feature to markdown files in the browser. In other words, an easily applicable version for anyone who utilises markdown files.

Implementing **jupyter.js** is quite simple; just add the `jupyter.min.js` and `jupyter.min.css` file to your HTML document. Once the **jupyter.js** is on a page, it will look for markdown rendered code blocks, with `/* jupyter:active */` as its first line. When encountering such blocks, it will activate those blocks and ignore any other blocks.

```html
&lt;link type="text/css" href="jupyter.min.css" rel="stylesheet"/>
&lt;script type="text/javascript" src="jupyter.min.js"></script>
```
---

```
/* jupyter:active */  <-- this will activate jupyter block

var color = 'red';

console.log(red);

```

### Example of jupyter code block
```js
/* jupyter:active */
var a = 5;

(function test() {
    console.log(a--);

    if (a) {
        setTimeout(test, 1000);
    }
})();
```