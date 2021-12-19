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
    -   for including another HTML: <br>
        `{% INCLUDES <nameOfFile>.html %}`
    -   for extending another HTML <br>(supports BLOCK (must have matching block in file it extends)) <br>
        `{% EXTENDS <nameOfFile>.html %}`<br>
        `{% BLOCK <nameOfBlock> %} {% ENDBLOCK <nameOfBlock> %}`

---

### TODO:

-   [ ] for loop templating
    ```<ul>
    {% FOR thing of thingy %}
    <li>{{ thing }}</li>
    {% ENDFOR %}
    </ul>
    startRegex = \{% FOR \w+ of w+ %\}
    endRegex = \{% \w+FOR %\}
    blockRegex = \{% FOR \w+ of w+ %\}\w+\{% \w+FOR %\}
    ```

---

### DONE:

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
