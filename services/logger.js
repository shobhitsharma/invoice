var winston = require('winston'),
    fs = require('fs'),
    logDir = 'logs', moment = require('moment'),
    logger, path = require('path');

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);
var foldernames = {
    SuccessfulFiles: 'SuccessfulFiles',
    BadFile: 'BadFile',
    BadPOs: 'BadPOs',
    Archiver:'Archiver',
    System: 'System',
    Debugger: 'Debugger'
}

var folderSuccessfulFiles = path.join(logDir, foldernames.SuccessfulFiles)
var folderBadFile = path.join(logDir, foldernames.BadFile)
var folderBadPOs = path.join(logDir, foldernames.BadPOs)
var folderArchiver = path.join(logDir, foldernames.Archiver)
var folderSystem = path.join(logDir, foldernames.System)
var folderDebugger = path.join(logDir, foldernames.Debugger)


// Create the directory if it does not exist
if (!fs.existsSync(logDir))fs.mkdirSync(logDir);
if (!fs.existsSync(folderSuccessfulFiles)) fs.mkdirSync(folderSuccessfulFiles);
if (!fs.existsSync(folderBadFile))fs.mkdirSync(folderBadFile);
if (!fs.existsSync(folderBadPOs))fs.mkdirSync(folderBadPOs);
if (!fs.existsSync(folderArchiver))fs.mkdirSync(folderArchiver);
if (!fs.existsSync(folderSystem))    fs.mkdirSync(folderSystem);
if (!fs.existsSync(folderDebugger))    fs.mkdirSync(folderDebugger);

var debug = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});
debug.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'debug',
            dirname: folderDebugger,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});


var info = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});
info.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'info',
            dirname: folderSystem,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
            json: true,*/
            exitOnError: false
        })
    ]
});


var Error = new winston.Logger({
    levels: {
        info: 'error'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});
Error.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'error',
            dirname: folderSystem,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
            json: true,*/
            exitOnError: false
        })
    ]
});

var SuccessfulFiles = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});

SuccessfulFiles.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'SuccessfulFiles',
            dirname: folderSuccessfulFiles,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
            json: true,*/
            exitOnError: false
        })
    ]
});

var BadFile = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});

BadFile.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'BadFile',
            dirname: folderBadFile,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});

var BadPOs = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});

BadPOs.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'BadPOs',
            dirname: folderBadPOs,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});


var Archiver = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});

Archiver.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'Archiver',
            dirname: folderArchiver,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});

var exports = {
    winston: winston,
    debug: function (msg) {
        debug.info(msg);
    },
    info: function (msg) {
        if (!global.blHasConsoleOutput && info.transports['console'] != null) info.remove(winston.transports.Console)
        info.info(msg);
    },
    error: function (msg) {
        Error.error(msg);
    },
    SuccessfulFiles: function (msg) {
        if (!global.blHasConsoleOutput && SuccessfulFiles.transports['console'] != null) SuccessfulFiles.remove(winston.transports.Console)
        SuccessfulFiles.info(msg);
    },
    BadFile: function (msg) {
        if (!global.blHasConsoleOutput && BadFile.transports['console'] != null) BadFile.remove(winston.transports.Console)
        BadFile.info(msg);
    },
    BadPOs: function (msg) {
        if (!global.blHasConsoleOutput && BadPOs.transports['console'] != null) BadPOs.remove(winston.transports.Console)
        BadPOs.info(msg);
    },
    Archiver: function (msg) {
        if (!global.blHasConsoleOutput && Archiver.transports['console'] != null) Archiver.remove(winston.transports.Console)
        Archiver.info(msg);
    }
}
module.exports = exports;