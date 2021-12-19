// File: templateEngine.js - My very own template engine
// Author: itsOiK
// Date: 17/12-21
("use strict");

const TEMPLATE_ENGINE_NAME = "VanillaChocolateJS";

import { readFile } from "fs/promises";
import path from "path";

const REGEX = {
    BLOCK: {
        all: /\{% BLOCK \w+ %\}.*?\{% ENDBLOCK \w+ %\}/gs,
        tag: /\{% \w*BLOCK \w* %\}/g,
        start: /\{% \w*BLOCK /g,
        end: / %\}/g,
    },
    TEMPLATE_TAG_REPLACE: /\{%\s\w+\s\w+\.\w+\s%\}/gi,
    TEMPLATE_INCLUDE: /\{% INCLUDE \w+ %\}/gs,
    TEMPLATE_EXTEND: /\{% EXTEND \w+ %\}/gs,
};

async function render(fileNameToLoad) {
    // entrypoint from app.mjs
    // recieve file name with ext of file to return
    const fileString = await readRequestedFile("html", fileNameToLoad);
    // loaded requested file
    const fullyRenderedView = { view: "" };
    if (fileString) {
        // we successfully loaded a base template
        fullyRenderedView["view"] = fileString;
        var extendString = await handleExtendsAndIncludes(fileString);
        if (extendString) fullyRenderedView["view"] = extendString;
    } else {
        //! something wrong happened loading base template
        console.log(
            "[templateEngine:38]: ERROR: something wrong happened loading base template"
        );
    }
    return fullyRenderedView.view;
}
async function handleExtendsAndIncludes(fileString) {
    var extendString = fileString;
    var fileTags = parseTemplate(extendString);
    if (fileTags) {
        // we found fileTags
        const fileStringObj = {
            fileString,
            fileTags,
        };
        extendString = await extendTemplate(fileStringObj);
        extendString = await includeTemplate(extendString, fileStringObj);
    }
    return extendString;
}
async function includeTemplate(extendString, fileStringObj) {
    const includesTags = parseTemplate(extendString);
    var tags = includesTags.tags.concat(fileStringObj.fileTags.tags);
    const includedFileString = { string: extendString };
    for (const tag of tags) {
        const tagType = tag[0],
            fileName = tag[1];
        if (tagType === "INCLUDES") {
            // load requestes file
            var _includesFileString = await readRequestedFile("html", fileName);
            const includeTags = parseTemplate(_includesFileString);
            if (includeTags?.tags) {
                //! we dont allow blocks on include
                // there are tags in the file we included
                // replace tags in the file we want to include, before including it
                //TODO
            }
            // replace INCLUDES tag with file content
            const replace = `{% ${tagType} ${fileName} %}`;
            includedFileString.string = includedFileString.string.replaceAll(
                replace,
                _includesFileString
            );
        }
    }
    return includedFileString.string;
}
async function extendTemplate(fileStringObj) {
    // we are getting a fileStringObj that contains EXTENDS
    // we iterate over the tags to find the EXTENDS tag and what file to load'
    // we check the loaded file if it has blocks
    // we replace the blocks in the loaded file with content from fileStringObj
    let extendedTemplateString = fileStringObj.fileString;
    for (const tagChunk of fileStringObj.fileTags.tags) {
        const type = tagChunk[0],
            fileName = tagChunk[1];
        if (type === "EXTENDS") {
            const extendStringObj = {
                nextFileString: "",
                nextFileTags: "",
            };
            extendStringObj["nextFileString"] = await readRequestedFile(
                "html",
                fileName
            );
            extendedTemplateString = replaceBlockTags(
                extendStringObj.nextFileString,
                fileStringObj
            );
        }
    }
    return extendedTemplateString;
}

// function replaceBlockTags(blockFileString, blockReplaceObj) {
//     // blockReplaceObj = { blockName, blockContent };
//     var replacedBlocksString = blockFileString;
//     const replace_REGEX = `{% BLOCK ${blockReplaceObj.blockName} %} {% ENDBLOCK ${blockReplaceObj.blockName} %}`;
//     replacedBlocksString = replacedBlocksString.replace(
//         replace_REGEX,
//         blockReplaceObj.blockContent
//     );
//     return replacedBlocksString;
// }

function replaceBlockTags(blockFileString, fileStringObj) {
    // we get a string containing BLOCKs
    // we parse the string to get the BLOCKs
    // we replace the BLOCK tags in the blockFileString
    // with the content from fileStringObj.fileTags.blocks
    const blocks = parseTemplate(blockFileString).blocks;
    var replacedBlocksString = blockFileString;
    if (blocks) {
        for (const [replaceBlock, value] of Object.entries(blocks)) {
            const replaceString =
                fileStringObj.fileTags.blocks[replaceBlock] || "";
            const replace_REGEX = `{% BLOCK ${replaceBlock} %} {% ENDBLOCK ${replaceBlock} %}`;
            replacedBlocksString = replacedBlocksString.replaceAll(
                replace_REGEX,
                replaceString
            );
            if (!replaceString)
                console.log(
                    `[templateEngine:139]: ERROR: did not find matching block for "${replaceBlock}"`
                );
        }
    }
    return replacedBlocksString;
}

// function replaceTemplateTags() {
//     const ignoreList = ["EXTENDS", "INCLUDES"];
//     for (const tag of tags) {
//         if (!ignoreList.includes(tag[0])) {
//             console.log("[templateEngine:85]: tag", tag);
//             // load file
//             // replace tag with file content
//             // need template to include
//             // string to replace tags in
//         }
//     }
// }
function parseTemplate(string) {
    //! ---- BLOCS ---- //
    const blockResult = string.match(REGEX.BLOCK.all);
    const blocks = {};
    if (blockResult) {
        for (const block of blockResult) {
            const blockNameArray = block.match(REGEX.BLOCK.tag);
            if (blockNameArray?.length === 2) {
                const blockName = blockNameArray[0]
                    .replace(REGEX.BLOCK.start, "")
                    .replace(REGEX.BLOCK.end, "");
                blocks[blockName] = block.replaceAll(REGEX.BLOCK.tag, "");
            }
        }
    }
    //! ---- TAGS ---- //
    const tagResult = string.match(REGEX.TEMPLATE_TAG_REPLACE);
    const tags = [];
    tagResult?.forEach((match) =>
        tags.push(match.replaceAll("{% ", "").replaceAll(" %}", "").split(" "))
    );
    //! ---- RETURN ---- //
    const result = { tags, blocks };
    return result;
}

async function readRequestedFile(fileType, fileName) {
    try {
        let file_string = await readFile(
            path.resolve(
                path.join("..", "frontend", "static", fileType, fileName)
            ),
            "utf8"
        );
        return file_string;
    } catch (err) {
        console.log("[templateEngine:54]: ERROR: file not found: ", fileName);
        return null;
    }
}

export { render };

//! --------------------------------------------------------- //
//*                    -- BLÆH --                     //
//! ------------------------------------------------------- //

// const parentTemplatesArray = [];
// async function renderTemplate(fileString) {
//     const templateNameArray = parseTemplate(
//             fileString,
//             REGEX.TEMPLATE_TAG_REPLACE
//         ),
//         templateFileStrings = {};
//     if (!(templateNameArray === "")) {
//         for (const templateChunk of templateNameArray) {
//             const templateType = templateChunk[0],
//                 templateName = templateChunk[1];
//             // if (templateType === "extends") {
//             //     const extendTemplate = await readRequestedFile(
//             //         "html",
//             //         templateName
//             //     );
//             //     parentTemplatesArray.push(extendTemplate);
//             //     // renderTemplate(extendTemplate); //TODO do something
//             // } else {
//             templateFileStrings[templateName] = await readRequestedFile(
//                 templateType,
//                 templateName
//             );
//             // }
//             const occurrences = templateNameArray.filter(
//                 (chunk) => chunk === templateChunk
//             ).length;
//             console.log(
//                 `[templateEngine:27]: replaced ${templateType}${
//                     occurrences > 1 ? "'s" : ""
//                 }: ${templateName}, ${occurrences}x times`
//             );
//             const _key = `{% ${templateType} ${templateName} %}`;
//             const response = fileString
//                 .toString()
//                 .replaceAll(_key, templateFileStrings[templateName]);
//             // if (parentTemplatesArray.length > 0) {
//             //     for (const parentTemplate of parentTemplatesArray) {
//             //         response += renderTemplate(parentTemplate);
//             //     }
//             // } else {}
//             return response;
//         }
//     }
//     return fileString;
// }
