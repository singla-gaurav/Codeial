
const env = require("./environment");
const fs = require("fs");
const path = require("path");

module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        return filePath;
    }
}