# itsoik_web_v2_backend

## Powered by ChocoJS

made by itsOik

---

## Features:

-   It sucks!
-   its only by luck that it works!
-   Replace tags in HTML by using EXACTLY this syntax:

    -   for CSS: <br>
        (requires opening and closing `<style>` tags)<br>
        `<style>{% style <nameOfFile>.css %}</style>`
    -   for scripts(js): <br>
        (requires opening and closing `<script>` tags)<br>
        `<script>{% script <nameOfFile>.js %}</script>`
    -   `INCLUDES` tag: <br>
        `{% INCLUDES <nameOfFile>.html %}`
    -   `EXTENDS` tag <br>(supports BLOCK (must have matching block in file it extends)) <br>
        `{% EXTENDS <nameOfFile>.html %}`<br>
        `{% BLOCK <nameOfBlock> %} {% ENDBLOCK <nameOfBlock> %}`
    -   `FOR` loops: <br>
        (must be nested in block if extends)
        to pass data to use in for loops use following syntax: <br>

        in app.js:

        ```
        const data = {data: ["value1", ...]} // must be key/array pairs
        templateEngine.render(templateName.html, data) // call with "data" as 2nd variable in the function call

        ```

        in template HTML:

        
            {% FOR dataVar of data %} <br>
            // do something with `{{ dataVar }}` <br>
            {% ENDFOR %}

        

    -   `{{ tag }}` (single-tag) replacement: <br>
        Replaces tag with data from a "key,value" object with same "key" as the `{{ tag }}`

---

### TODO:

---

### DONE:

20/12-21:

-   [x] passing variables
-   [x] for loop templating
-   [x] single tag replacing

19/12-21:

-   [x] EXTENDS tag
-   [x] BLOCK tag
-   [x] INCLUDES tag
-   [x] style tag
-   [x] script tag

---

## Requirments:

-   NodeJS: v16+

---

## Install instructions:

-   Coming soon™

---
