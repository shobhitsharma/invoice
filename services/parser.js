var models = require('../models');
var Promise = require('bluebird');
var csv = require('csv-stream');
fs = require('fs');
var path = require('path');
var winston = require('winston');
var moment = require('moment'), now; //timing utulity module
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/tsconfig.json')[env];
var ftpLocal = path.join(__dirname, '../', config.ftp.local);
var archiver = require('archiver');
var archive;
var archiveFile;
var logger = require('./logger.js');


/*#PONumber = 0110822
 #PODate = 07/01/2016
 #OrderType = S
 #Division = 00
 #PartnerCode = SUNHK
 #PartnerName = SUN TAT LABEL FTY LTD
 #ShipToCode =
 #ShipToName = ASHLEY STEWART/NJ CALLOUTS
 #POERPStatus = B
 #CustomerNumber =
 #FreightAmount = 0
 #ItemCode = 30000ASTEWARTLP
 #Description = ASHLEY STEWART WOVEN DAMASK LB
 #WarehouseCode = 000
 #PartnerPONumber = 6292016
 #UnitofMeasure = M
 #QuantityOrdered = 50
 #Quantitybackordered = 0
 #Quantityinvoiced = 0
 #UnitCost = 12.91
 #Total = 645.5
 #undefined =*/

// All of these arguments are  optional.
var options = {
    endLine: '\n', // default is \n,
    columns: ['PONumber', 'PODate', 'OrderType', 'Division', 'PartnerCode',
        'PartnerName', 'ShipToCode', 'ShipToName',
        'POERPStatus',
        'CustomerNumber', 'FreightAmount', 'ItemCode', 'Description', 'WarehouseCode',
        'PartnerPONumber',
        'UnitofMeasure',
        'QuantityOrdered',
        'Quantitybackordered',
        'Quantityinvoiced',
        'UnitCost',
        'Total'
    ], // by default read the first line and use values found as columns
    escapeChar: '"', // default is an empty string
    enclosedChar: '"' // default is an empty string
}

var csvStream = csv.createStream(options);

var service = module.exports = {

    events: {
        onFileCheck: 'onFileCheck',
        onPOCheck: 'onPOCheck',
        onFileReject: 'onFileReject',
        onFileArchive: 'onFileArchive',
        onPOReject: 'onPOReject',
        onPOSaved: 'onPOSaved',
        onParseError: 'onParseError'
    },

    parseFile: function (filename, callback) {

        var events = require('events');
        events.EventEmitter.call(service);
        service.__proto__ = events.EventEmitter.prototype;

        try {
            var i = 0;
            fs.createReadStream(filename)
                .pipe(csv.createStream(options))
                .on('data', function (data) {
                    //console.log('Line: '+i++);
                    //console.log(data);
                    if (Object.keys(data).length >= 22) {
                        ////check file structure if does match the sample file
                        service.emit(service.events.onFileCheck, Object.keys(data).length);
                        if (data.PONumber === '' || data.PartnerCode === '' || data.POERPStatus === '' || data.ItemCode === '' || data.QuantityOrdered === '') {
                            //reject the PO don't insert to DB
                            logger.BadPOs(data);
                            callback(null, 'reject the PO');
                        } else {
                            // create PO into database table POInfo
                            models.poinfo.create(data).then(function (PO) {
                                logger.SuccessfulFiles(PO);
                                callback(null, PO);
                            });
                        }
                    } else {
                        //reject the file and archive it
                        logger.BadFile(filename);
                        callback(null, 'reject the file');
                    }
                })
                .on('column', function (key, value) {
                    //console.log('#' + key +' = ' + value);
                })
                .on('end', function () {
                    callback(null, 'end');
                })
                .on('close', function () {
                    var fileName = filename.replace(/^.*[\\\/]/, '');
                    archive = archiver('zip');
                    now = new moment();
                    archiveFile = fs.createWriteStream(filename + '.' + now.format('YYYYMMDDhhmmss') + '.zip');

                    archiveFile.on('close', function () {
                        logger.Archiver('archiver has been finalized ' + fileName + ' archive size ' + archive.pointer() / 1024 + ' total KB')
                        service.emit(service.events.onFileArchive, fileName);
                        callback(null, 'close');
                    });
                    archive.on('error', function (err) {
                        logger.error(err);
                        callback(err, 'error');
                    });
                    archive.pipe(archiveFile);
                    archive
                        .append(fs.createReadStream(filename), {name: fileName})
                        .finalize();
                })

        } catch (err) {
            // Handle the error here.
            logger.error(err);
            callback(err, 'Error');
        }
    },
    validateFile: function () {
        //Not valid JSON
        //file structure does match the sample file
    },
    validatePO: function () {
        /*Anyone of the below fields is empty
         PO number
         Partner Code
         PO ERP Status field
         Item Code
         Quantity Ordered
         If one record within the PO is bad --> reject the full PO*/
    },
    statusPO: function () {
        /* If the same PO number is received in the files received from ERP
         Check if the status in the PO =
         Open                O             ignore and do nothing
         Changed             C             replace existing PO if it is not invoiced yet
         BackOrdered         B             ignore and do nothing
         Completed           X             ignore and do nothing*/
    }
}