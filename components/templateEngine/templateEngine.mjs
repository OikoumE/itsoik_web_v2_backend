// File: templateEngine.js - VanillaChocolateJS
// Author: itsOiK
// Date: 17/12-21
("use strict");

// TEMPLATE_ENGINE_NAME = "VanillaChocolateJS";

import { readFile } from "fs/promises";
import path from "path";

const REGEX = {
    BLOCK: {
        // all: /\{% BLOCK (\w+) %\}.*?\{% ENDBLOCK (\w+) %\}/gs,
        all: /\{% BLOCK (\w+) %\}.*?\{% ENDBLOCK (\1) %\}/gs,
        tag: /\{% \w*BLOCK (\w*) %\}/g,
        start: /\{% \w*BLOCK /g,
        end: / %\}/g,
    },
    TEMPLATE_TAG_REPLACE: /\{%\s\w+\s\w+\.\w+\s%\}/gi,
    TEMPLATE_INCLUDE: /\{% INCLUDE \w+ %\}/gs,
    TEMPLATE_EXTEND: /\{% EXTEND \w+ %\}/gs,
    FOR_BLOCK_ARGUMENTS: /\{% FOR (\w+) of (\w+) %\}(.*?){% \w+FOR %\}/gs,
};

class TemplateEngine {
    constructor() {
        //
    }
    init() {}

    /**
     * Accepts a filename to load, parses template tags and replaces them with the templates returning a full view
     * @param {String} fileNameToLoad name of html-file to load including extension
     * @returns {String}              Fully rendered view
     */
    async render(fileNameToLoad) {
        // entrypoint from app.mjs
        // recieve file name with ext of file to return
        const fileString = await this.readRequestedFile("html", fileNameToLoad);
        // loaded requested file
        const fullyRenderedView = { view: "" };
        if (fileString) {
            // we successfully loaded a base template
            fullyRenderedView["view"] = fileString;
            var extendString = await this.handleExtendsAndIncludes(fileString);
            if (extendString) fullyRenderedView["view"] = extendString;
        } else {
            console.log(
                //!
                `[templateEngine:38]: ERROR: Failed to load template: "${fileNameToLoad}"`
            );
        }
        fullyRenderedView.view = await this.replaceTemplateTags(
            fullyRenderedView.view
        );
        return this.handleArguments(
            fullyRenderedView.view,
            [].slice.call(arguments, 1)[0]
        );
        // return fullyRenderedView.view;
    }
    /**
     * Accepts "filetype" (folder/tag relationship) and "fileName" of file to load
     * @param {String} fileType Type of file to load (style/template/script)
     * @param {String} fileName Name of the file to load
     * @returns {String} Content of loaded file
     */
    async readRequestedFile(fileType, fileName) {
        try {
            let file_string = await readFile(
                path.resolve(
                    path.join("..", "frontend", "static", fileType, fileName)
                ),
                "utf8"
            );
            return file_string;
        } catch (err) {
            console.log(
                //!
                `[templateEngine:54]: ERROR: file not found: "${fileName}"`
            );
            return null;
        }
    }
    /**
     * takes a string, parses the "{% FOR %}" blocks then passes that string to parse the single tags "{{ tag }}"
     * @param {String} templateString string to apply parseForBlock and parseSingleTag on
     * @param {Object} argumentsObj object containing arguments
     * @returns {String}
     */
    handleArguments(templateString, argumentsObj) {
        const returnString = { string: templateString };
        if (argumentsObj) {
            returnString["string"] = this.parseForblocks(
                returnString["string"],
                argumentsObj
            );
            returnString["string"] = this.parseSingleTag(
                returnString["string"],
                argumentsObj
            );
        }
        return returnString.string;
    }
    /**
     * Parses a string and replaces FOR blocks with content
     * @param {String} templateString String to modify
     * @param {Object} argumentsObj Key,Value paired variable,content object
     * @returns {String} modified string
     */
    parseForblocks(templateString, argumentsObj) {
        const returnString = { string: templateString };
        const matchedBlocks = {};
        let m,
            blockIndex = 0;
        while ((m = REGEX.FOR_BLOCK_ARGUMENTS.exec(templateString)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === REGEX.FOR_BLOCK_ARGUMENTS.lastIndex) {
                REGEX.FOR_BLOCK_ARGUMENTS.lastIndex++;
            }
            blockIndex++;
            matchedBlocks[blockIndex] = {
                block: m[0],
                for: [m[1], m[2]],
                content: m[3],
            };
        }
        // return matchedBlocks;
        for (const [key, value] of Object.entries(matchedBlocks)) {
            const argumentsKey = matchedBlocks[key].for[1],
                argumentTemplateTag = matchedBlocks[key].for[0];
            //!
            const currentArgs = argumentsObj[argumentsKey];
            var constructedString = "";
            try {
                if (Array.isArray(currentArgs)) {
                    for (let i = 0; i < currentArgs.length; i++) {
                        constructedString += matchedBlocks[key].content.replace(
                            `{{ ${argumentTemplateTag} }}`,
                            argumentsObj[argumentsKey][i]
                        );
                    }
                    returnString["string"] = returnString["string"].replace(
                        matchedBlocks[key].block,
                        constructedString
                    );
                }
            } catch (err) {
                console.log(
                    //!
                    `[templateEngine:75]: ERROR: Could not find matching variables in FOR-block with var: ${matchedBlocks[key].for[1]}`
                );
                console.log(
                    //!
                    `available variables are: `
                );
                for (const key of Object.keys(argumentsObj)) {
                    console.log(
                        //!
                        key
                    );
                }
            }
        }
        return returnString.string;
    }
    /**
     * parses single tags "{{ tag }}" and replace with content
     * @param {String} templateString String to modify
     * @param {Object} argumentsObj Key,Value paired variable,content object
     * @returns {String} modified string
     */
    parseSingleTag(templateString, argumentsObj) {
        //! must happen after <parseForblocks()> because they share syntax
        const returnString = { string: templateString };
        for (const [key, value] of Object.entries(argumentsObj)) {
            if (typeof value === "string") {
                returnString["string"] = returnString.string.replaceAll(
                    `{{ ${key} }}`,
                    value
                );
            }
        }
        return returnString.string;
    }
    /**
     * Accepts a string, parses tags, if tags are found, passes the string and tags to "extendTemplate()" and "includeTemplate()" for processing
     * @param {String} fileString String to replace template tags in
     * @returns {String}          String with tags replaced
     */
    async handleExtendsAndIncludes(fileString) {
        var extendString = fileString;
        var fileTags = this.parseTemplate(extendString);
        if (fileTags) {
            extendString = await this.extendTemplate(extendString);
            extendString = await this.includeTemplate(extendString);
        }
        return extendString;
    }
    /**
     * parses includeString to find INCLUDES tag, loads required file, replaces INCLUDES tags with content from the requested file
     * @param {String} includeString String to replace INCLUDES tags in
     * @returns {String} string that INCLUDES the content of the requested file
     */
    async includeTemplate(includeString) {
        const includesTags = this.parseTemplate(includeString);
        const includedFileString = { string: includeString };
        for (const tag of includesTags.tags) {
            const tagType = tag[0],
                fileName = tag[1];
            if (tagType === "INCLUDES") {
                var _includesFileString = await this.readRequestedFile(
                    "html",
                    fileName
                );
                const includeTags = this.parseTemplate(_includesFileString);
                if (includeTags?.tags) {
                    //! we dont allow blocks on include
                    // there are tags in the file we included
                    // replace tags in the file we want to include, before including it
                    //TODO
                }
                // replace INCLUDES tag with file content
                const replace = `{% ${tagType} ${fileName} %}`;
                includedFileString.string =
                    includedFileString.string.replaceAll(
                        replace,
                        _includesFileString
                    );
            }
        }
        return includedFileString.string;
    }
    /**
     * parses extendString to find EXTENDS tag, loads required file, replaces EXTENDS tags with content from the requested file
     * @param {String} extendString String to replace EXTENDS tags in
     * @returns {String} String that EXTENDS the content of the requested file
     */
    async extendTemplate(extendString) {
        var extendTags = this.parseTemplate(extendString);
        let extendedTemplateString = extendString;
        if (extendTags?.tags.length) {
            for (const tagChunk of extendTags.tags) {
                const type = tagChunk[0],
                    fileName = tagChunk[1];
                if (type === "EXTENDS") {
                    const extendFileString = await this.readRequestedFile(
                        "html",
                        fileName
                    );
                    if (Object.keys(extendTags?.blocks).length) {
                        extendedTemplateString = this.replaceBlockTags(
                            extendFileString,
                            extendTags.blocks
                        );
                        var nestExtend = this.parseTemplate(
                            extendedTemplateString
                        );
                        if (nestExtend?.tags.length) {
                            extendedTemplateString = await this.extendTemplate(
                                extendedTemplateString
                            );
                        }
                    } else
                        console.log(
                            //!
                            `[templateEngine:150]: ERROR: No "BLOCK" tags in the file that is calling "EXTENDS" on file: ${fileName}`
                        );
                }
            }
        } else
            console.log(
                //!
                `[templateEngine:160]: ERROR: No template tags in the file that is calling "EXTENDS" on file: ${fileName}`
            );
        return extendedTemplateString;
    }
    /**
     * Accepts "blockFileString" to parse and "blockTags" with name of blocks and the content to replace them with
     * @param {String} blockFileString String to replace BLOCK tags in
     * @param {Object} blockTags [Key, Value] pairs where Key = name of BLOCK tag, Value = Content to replace BLOCK tag with
     * @returns {String} string that includes the content of the requested file
     */
    replaceBlockTags(blockFileString, blockTags) {
        var replacedBlocksString = blockFileString;
        for (const [replaceBlock, replaceString] of Object.entries(blockTags)) {
            // const replaceString = blockTags[replaceBlock] || "";
            const replace_REGEX = `{% BLOCK ${replaceBlock} %} {% ENDBLOCK ${replaceBlock} %}`;
            replacedBlocksString = replacedBlocksString.replaceAll(
                replace_REGEX,
                replaceString
            );
            if (!replaceString)
                console.log(
                    //!
                    `[templateEngine:180]: ERROR: did not find matching BLOCK-tag for "${replaceBlock}"`
                );
        }
        return replacedBlocksString;
    }
    /**
     * Accepts a string, parses tags, loads required file, replaces tags with content from file
     * @param {String} fileString String to replace template tags in
     * @returns {String}          String with tags replaced
     */
    async replaceTemplateTags(fileString) {
        var tags = this.parseTemplate(fileString).tags;
        const replacedFile = { string: fileString };
        const ignoreList = ["EXTENDS", "INCLUDES"];
        for (const tag of tags) {
            const tagType = tag[0],
                tagFileName = tag[1];
            if (!ignoreList.includes(tagType)) {
                const loadedFileString = await this.readRequestedFile(
                    tagType,
                    tagFileName
                );
                const replace_REGEX = `{% ${tagType} ${tagFileName} %}`;
                replacedFile["string"] = replacedFile.string.replace(
                    replace_REGEX,
                    loadedFileString
                );
            }
        }
        return replacedFile.string;
    }
    /**
     * Accepts a string to parse for template tags
     *
     * if no result returns: { tags = [], blocks = {} }
     * @param {String} templateString Template to parse for tags and blocks
     * @returns {Object} result from parsing the string
     *
     */
    parseTemplate(templateString) {
        //! ---- BLOCKS ---- //
        const blockResult = templateString.match(REGEX.BLOCK.all);
        const blocks = {};
        if (blockResult) {
            for (const block of blockResult) {
                const blockNameArray = block.match(REGEX.BLOCK.tag);
                for (const blockNameTag of blockNameArray) {
                    const blockName = blockNameTag
                        .replace(REGEX.BLOCK.start, "")
                        .replace(REGEX.BLOCK.end, "");
                    blocks[blockName] = block.replaceAll(REGEX.BLOCK.tag, "");
                }
            }
        }
        // ! ---- TAGS ---- //
        const tagResult = templateString.match(REGEX.TEMPLATE_TAG_REPLACE);
        const tags = [];
        tagResult?.forEach((match) =>
            tags.push(
                match.replaceAll("{% ", "").replaceAll(" %}", "").split(" ")
            )
        );
        //! ---- RETURN ---- //
        const result = { tags, blocks };
        return result;
    }
}

//! ------ EXPORT ------ //
export { TemplateEngine };
