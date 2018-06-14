const fs = require('fs');
const path = require('path');

exports.mountRouter = router => {
    const CONTROLLERS = 'controllers';
    const controllerPath = __dirname + '/' + CONTROLLERS;
    const addRule = (files, fielPath) => {
        let controller;
        const uri = fielPath.substring(fielPath.indexOf(CONTROLLERS) + CONTROLLERS.length);
        for (const file of files) {
            const theFilePath = fielPath + '/' + file;
            if (fs.statSync(path.join(theFilePath)).isDirectory()) {
                addRule(fs.readdirSync(theFilePath), path.resolve(theFilePath))
            }
            if (file.endsWith('.js')) {
                controller = require(fielPath + '/' + file);
                for (const m in controller) {
                    router.all((uri + '/' + file.replace('.js', '') + '/' + m).replace('\\', '/'), controller[m])
                }
            }
        }
    };
    addRule(fs.readdirSync(controllerPath), path.resolve(controllerPath))
    return router
};