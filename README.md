# itsoik_web_v2_backend

## Powered by ChocoJS

made by itsOik

---

## Features:

-   It sucks!
-   its only by luck that it works!
-   Replace tags in HTML by using EXACTLY this syntax:
    -   for CSS: <br>
        `{% style <nameOfFile>.css %}`
    -   for scripts(js): <br>
        `{% script <nameOfFile>.js %}`
    -   for including another HTML: <br>
        `{% INCLUDES <nameOfFile>.html %}`
    -   for extending another HTML <br>(supports BLOCK (must have matching block in file it extends)) <br>
        `{% EXTENDS <nameOfFile>.html %}`
        `{% BLOCK <nameOfBlock> %} {% ENDBLOCK <nameOfBlock> %}`

---

## TODO:

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
