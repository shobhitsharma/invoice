var models = require('../models');
var Promise = require('bluebird');
var path = require("path");
var moment = require('moment') //timing utulity module
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/tsconfig.json')[env];
var ftpLocal = path.join(__dirname, '../', config.ftp.local);
var logger = require('./logger.js');

//var PONumber = {};

var FTP = require('ftpimp'),

//Initializes the main FTP sequence ftp will emit a ready event once the server connection has been established
    ftp = FTP.create(config.ftp, false),
    connected = function () {
        console.log('connected to remote FTP server');
    };

//@Override FTP.prototype.unlink
/**
 * Runs the FTP command DELE - Delete remote file
 * @param {string} filepath - The location of the file to be deleted.
 * @param {function} callback - The callback function to be issued.
 * @param {boolean} runLevel - execution priority; @see {@link FTP.Queue.RunLevels}.
 * @param {boolean} [holdQueue=false] - Prevents the queue from firing an endproc event, user must end manually
 */
ftp.unlink = function (filepath, callback, runLevel, holdQueue) {
    ftp.run(ftp.unlink.raw + ' ' + filepath, function (err, data) {
        callback.call(callback, err, data);
    }, runLevel, holdQueue);
};
ftp.unlink.raw = 'DELE';

//Parser
var csv = require('csv-stream');
fs = require('fs');
var winston = require('winston');
var archiver = require('archiver');
var archive;
var archiveFile;

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
        onFTPConnected: 'onFTPConnected',
        onFTPPing: 'onFTPPing',
        onFTPUnlink: 'onFTPUnlink',
        onFTPSaved: 'onFTPSaved',
        onFTPArchive: 'onFTPArchive',
        onFTPError: 'onFTPError',
        onFileCheck: 'onFileCheck',
        onPOCheck: 'onPOCheck',
        onFileReject: 'onFileReject',
        onFileArchive: 'onFileArchive',
        onPOReject: 'onPOReject',
        onPOSaved: 'onPOSaved',
        onParseError: 'onParseError'
    },
    startFTP: function () {
        //self = this;
        var events = require('events');
        events.EventEmitter.call(service);
        service.__proto__ = events.EventEmitter.prototype;

        ftp.connect(function () {
            var now = moment();
            service.emit(service.events.onFTPConnected, now.format('YYYY-MM-DD hh:mm'));
            service.sweepFTP();
            service.pingFTP();
        });

    },
    pingFTP: function () {
        ftp.ping(function (err, info) {
            if (err) {
                var now = moment();
                //service.emit(service.events.onFTPError, now.format('YYYY-MM-DD hh:mm'), err);
                logger.error('error ping ' + err);
                service.startFTP();
            }
            logger.info("FTP ping Ok: " + info);
        });
        setTimeout(service.pingFTP, 60000);
    },
    sweepFTP: function () {
        ftp.ls(config.ftp.root, function (err, fileslist) {
            if (err) {
                var now = moment();
                //service.emit(service.events.onFTPError, now.format('YYYY-MM-DD hh:mm'), err);
                logger.error('error sweepFTP ' + err);
            }
            console.log('sweeping FTP server every ' + (config.ftp.interval / 1000) / 60 + ' minutes!');
            logger.info('sweeping FTP server every ' + (config.ftp.interval / 1000) / 60 + ' minutes!');

            //console.log(fileslist)
            if (fileslist.length == 0) {
                console.log("There is no new files in root " + config.ftp.root);
                logger.info("There is no new files in root " + config.ftp.root);
            }

            for (var i = 0; i < fileslist.length; i++) {
                console.log(path.join(config.ftp.root, fileslist[i].filename));
                service.download(path.join(config.ftp.root, fileslist[i].filename), path.join(ftpLocal, fileslist[i].filename));
            }
        });
        setTimeout(service.sweepFTP, config.ftp.interval);
    },
    download: function (remote_path_file, local_path_file) {
        ftp.save([remote_path_file, local_path_file], function (err, filename) {
            if (err) {
                var now = moment();
                //service.emit(service.events.onFTPError, now.format('YYYY-MM-DD hh:mm'), err);
                logger.error('error download ' + err);
            }
            console.log("Saved " + filename);
            var now = moment();

            //emit onFTPSaved file has been saved already to local disk
            //service.emit(service.events.onFTPSaved, now.format('YYYY-MM-DD hh:mm'), filename);

            //start parsing saved file
            service.parseFile(filename);

            //start deleteing the file from remote ftp it's already saved to local disk
            ftp.unlink(remote_path_file, function (err, file) {
                if (err) {
                    logger.error("unlink error: " + err);
                    //var now = moment();
                    //service.emit(service.events.onFTPError, now.format('YYYY-MM-DD hh:mm'), err);
                    logger.error('error deleting from ftp ' + err);
                }
                logger.info("unlink deleted from ftp " + file);
                //var now = moment();
                //service.emit(service.events.onFTPUnlink, now.format('YYYY-MM-DD hh:mm'), file);
            });
        });
    },
    archive: function (zipFile) {
        //append date/time to the file name and upload it to the folder (Archive)

        ftp.put([path.join(ftpLocal, zipFile), path.join(config.ftp.archive, zipFile)], function (status) {
            logger.SuccessfulFiles(zipFile + ' :FTP status Code: ' + status);
            fs.unlink(path.join(ftpLocal, zipFile), function (err) {
                if (err) {
                    logger.error('error deleting ' + zipFile + ' ' + err);
                }
                logger.info(zipFile + ' deleted successfully from local disk')
            });
        });

        /*var files = fs.readdirSync(ftpLocal);
         for(var i in files) {
         if(path.extname(files[i]) === ".zip") {
         //do something
         ftp.put([path.join(ftpLocal,files[i]),path.join(config.ftp.archive,files[i])],function(status){
         logger.info(files[i]+' :: '+status);
         });
         } else{
         logger.info('wait sweeping ftp processing');
         }
         }*/
        // setTimeout(service.archive,60000);
    },

    parseFile: function (filename) {
        try {
            var i = 0;
            fs.createReadStream(filename)
                .pipe(csv.createStream(options))
                .on('data', function (data) {
                    return new Promise(function(_resolve, _reject) {

                            i++;
                            //console.log('Line: '+i++);
                            //console.log(data);
                            //logger.debug(data.PONumber + " times: " + i);

                            if (Object.keys(data).length >= 22) {
                                ////check file structure if does match the sample file
                                if (data.PONumber === '' || data.PartnerCode === '' || data.POERPStatus === '' || data.ItemCode === '' || data.QuantityOrdered === '') {
                                    //reject the PO don't insert to DB
                                    logger.BadPOs({
                                        "lineNo:": i,
                                        "FileName": filename.replace(/^.*[\\\/]/, ''),
                                        "PONumber": data.PONumber,
                                        "PartnerCode": data.PartnerCode,
                                        "POERPStatus": data.POERPStatus,
                                        "ItemCode": data.ItemCode,
                                        "QuantityOrdered": data.QuantityOrdered
                                    });
                                } else {
                                    /*PO Status
                                     If the same PO number is received in the files received from ERP
                                     Check if the status in the PO =
                                     Open                O             ignore and do nothing
                                     Changed             C             replace existing PO if it is not invoiced yet
                                     BackOrdered         B             ignore and do nothing
                                     Completed           X             ignore and do nothing*/

                                    if (data.POERPStatus == 'c' || data.POERPStatus == 'C') {
                                        models.poheader.findAll({
                                            where: {PONumber: data.PONumber}
                                        }).then(function (pos) {
                                            logger.debug(data.PONumber + " :POSS: " + pos.length);
                                            if (pos.length !== 0) {
                                                logger.debug(data.PONumber + " :condition: " + pos.length);
                                                //replace existing PO if it is not invoiced yet
                                                models.sequelize.transaction(function (t) {
                                                    return models.poheader.update(
                                                        {
                                                            PONumber: data.PONumber,
                                                            PODate: data.PODate,
                                                            OrderType: data.OrderType,
                                                            Division: data.Division,
                                                            PartnerCode: data.PartnerCode,
                                                            PartnerName: data.PartnerName,
                                                            ShipToCode: data.ShipToCode,
                                                            ShipToName: data.ShipToName,
                                                            POERPStatus: data.POERPStatus
                                                        }, {where: {PONumber: data.PONumber}},
                                                        {transaction: t}).then(function (po) {
                                                        return models.podetails.create(
                                                            {
                                                                CustomerNumber: data.CustomerNumber,
                                                                FreightAmount: data.FreightAmount,
                                                                ItemCode: data.ItemCode,
                                                                Description: data.Description,
                                                                WarehouseCode: data.WarehouseCode,
                                                                PartnerPONumber: data.PartnerPONumber,
                                                                UnitofMeasure: data.UnitofMeasure,
                                                                QuantityOrdered: data.QuantityOrdered,
                                                                QuantityBackordered: data.QuantityBackordered,
                                                                QuantityInvoiced: data.QuantityInvoiced,
                                                                UnitCost: data.UnitCost,
                                                                Total: data.Total,
                                                                poheaderId: po.id
                                                            }, {where: {poheaderId: data.PONumber}}
                                                            , {transaction: t}).then(function () {
                                                            logger.debug(data.PONumber + " status has been changed " + data.POERPStatus)
                                                        })
                                                    });
                                                });
                                            } else {
                                                //console.log('no pos found: ');
                                                //ignore and do nothing
                                                // create PO into database table POInfo
                                                //if(PONumber[data.PONumber]) return {po: {id: PONumber[data.PONumber]}};
                                                models.poheader.findAll({
                                                    where: {PONumber: data.PONumber}
                                                }).then(function (pos) {
                                                    logger.debug(data.PONumber + " :POSS: " + pos.length);
                                                    if (pos.length !== 0) {
                                                        logger.debug(data.PONumber + " :condition: " + pos.length);
                                                        models.sequelize.transaction(function (t) {
                                                            return models.podetails.create(
                                                                {
                                                                    CustomerNumber: data.CustomerNumber,
                                                                    FreightAmount: data.FreightAmount,
                                                                    ItemCode: data.ItemCode,
                                                                    Description: data.Description,
                                                                    WarehouseCode: data.WarehouseCode,
                                                                    PartnerPONumber: data.PartnerPONumber,
                                                                    UnitofMeasure: data.UnitofMeasure,
                                                                    QuantityOrdered: data.QuantityOrdered,
                                                                    QuantityBackordered: data.QuantityBackordered,
                                                                    QuantityInvoiced: data.QuantityInvoiced,
                                                                    UnitCost: data.UnitCost,
                                                                    Total: data.Total,
                                                                    poheaderId: pos.id
                                                                }, {transaction: t}).then(function () {
                                                            })
                                                        });

                                                    } else {
                                                        //POHeader not exists we should insert it

                                                        models.sequelize.transaction(function (t) {
                                                            return models.poheader.create(
                                                                {
                                                                    PONumber: data.PONumber,
                                                                    PODate: data.PODate,
                                                                    OrderType: data.OrderType,
                                                                    Division: data.Division,
                                                                    PartnerCode: data.PartnerCode,
                                                                    PartnerName: data.PartnerName,
                                                                    ShipToCode: data.ShipToCode,
                                                                    ShipToName: data.ShipToName,
                                                                    POERPStatus: data.POERPStatus
                                                                },
                                                                {transaction: t}).then(function (po) {
                                                                // if(!PONumber[data.PONumber]) PONumber[data.PONumber] = data.id;
                                                                return models.podetails.create(
                                                                    {
                                                                        CustomerNumber: data.CustomerNumber,
                                                                        FreightAmount: data.FreightAmount,
                                                                        ItemCode: data.ItemCode,
                                                                        Description: data.Description,
                                                                        WarehouseCode: data.WarehouseCode,
                                                                        PartnerPONumber: data.PartnerPONumber,
                                                                        UnitofMeasure: data.UnitofMeasure,
                                                                        QuantityOrdered: data.QuantityOrdered,
                                                                        QuantityBackordered: data.QuantityBackordered,
                                                                        QuantityInvoiced: data.QuantityInvoiced,
                                                                        UnitCost: data.UnitCost,
                                                                        Total: data.Total,
                                                                        poheaderId: po.id
                                                                    }, {transaction: t}).then(function () {

                                                                })
                                                            });
                                                        });
                                                    }

                                                })
                                            }
                                        });

                                    }
                                    if (data.POERPStatus == 'o' || data.POERPStatus == 'O') {
                                        // create PO into database table
                                        models.poheader.findAll({
                                            where: {PONumber: data.PONumber}
                                        }).then(function (pos) {
                                            logger.debug(data.PONumber + " :POSS: " + pos.length);
                                            if (pos.length !== 0) {
                                                logger.debug(data.PONumber + " :condition: " + pos.length);
                                                models.sequelize.transaction(function (t) {
                                                    return models.podetails.create(
                                                        {
                                                            CustomerNumber: data.CustomerNumber,
                                                            FreightAmount: data.FreightAmount,
                                                            ItemCode: data.ItemCode,
                                                            Description: data.Description,
                                                            WarehouseCode: data.WarehouseCode,
                                                            PartnerPONumber: data.PartnerPONumber,
                                                            UnitofMeasure: data.UnitofMeasure,
                                                            QuantityOrdered: data.QuantityOrdered,
                                                            QuantityBackordered: data.QuantityBackordered,
                                                            QuantityInvoiced: data.QuantityInvoiced,
                                                            UnitCost: data.UnitCost,
                                                            Total: data.Total,
                                                            poheaderId: pos.id
                                                        }, {transaction: t}).then(function () {
                                                        _resolve();
                                                    })
                                                });

                                            } else {
                                                //POHeader not exists we should insert it
                                                logger.debug(data.PONumber + " :NEW PO Header: " + pos.length);
                                                models.sequelize.transaction(function (t) {
                                                    return models.poheader.create(
                                                        {
                                                            PONumber: data.PONumber,
                                                            PODate: data.PODate,
                                                            OrderType: data.OrderType,
                                                            Division: data.Division,
                                                            PartnerCode: data.PartnerCode,
                                                            PartnerName: data.PartnerName,
                                                            ShipToCode: data.ShipToCode,
                                                            ShipToName: data.ShipToName,
                                                            POERPStatus: data.POERPStatus
                                                        },
                                                        {transaction: t}).then(function (po) {
                                                        // if(!PONumber[data.PONumber]) PONumber[data.PONumber] = data.id;
                                                        return models.podetails.create(
                                                            {
                                                                CustomerNumber: data.CustomerNumber,
                                                                FreightAmount: data.FreightAmount,
                                                                ItemCode: data.ItemCode,
                                                                Description: data.Description,
                                                                WarehouseCode: data.WarehouseCode,
                                                                PartnerPONumber: data.PartnerPONumber,
                                                                UnitofMeasure: data.UnitofMeasure,
                                                                QuantityOrdered: data.QuantityOrdered,
                                                                QuantityBackordered: data.QuantityBackordered,
                                                                QuantityInvoiced: data.QuantityInvoiced,
                                                                UnitCost: data.UnitCost,
                                                                Total: data.Total,
                                                                poheaderId: po.id
                                                            }, {transaction: t}).then(function () {
                                                            _resolve();
                                                        })
                                                    });
                                                }).catch(function (err) {
                                                    // Transaction has been rolled back
                                                    // err is whatever rejected the promise chain returned to the transaction callback
                                                    _reject();
                                                });
                                            }
                                        })

                                    }
                                }
                            }
                            else {
                                //reject the file and archive it
                                logger.BadFile(filename.replace(/^.*[\\\/]/, ''));
                            }
                        })
                    }
                )
                .on('column', function (key, value) {
                    //console.log('#' + key +' = ' + value);
                })
                .on('end', function () {
                    console.log('ended');
                })
                .on('close', function () {
                    // here parsing channel has been closed and start archive process and deleting local parsed file
                    var fileName = filename.replace(/^.*[\\\/]/, '');
                    archive = archiver('zip');
                    now = new moment();
                    logger.SuccessfulFiles(fileName);

                    archiveFile = fs.createWriteStream(filename + '.' + now.format('YYYYMMDDhhmmss') + '.zip');

                    archiveFile.on('close', function () {
                        logger.Archiver('archiver has been finalized and send ' + fileName + ' to FTP uploader, archive size ' + archive.pointer() / 1024 + ' total KB');


                        //delete local downloaded file from FTP it has been parsed and prepared to archive and send to FTP archive uploader
                        fs.unlink(filename, function (err) {
                            if (err) {
                                logger.error('error deleting ' + fileName + ' ' + err);
                            }
                            logger.info(fileName + ' deleted successfully from local disk');
                        });

                        //start service FTP archive uploader
                        service.archive(fileName + '.' + now.format('YYYYMMDDhhmmss') + '.zip');
                    });
                    archive.on('error', function (err) {
                        logger.error(err);
                    });
                    archive.pipe(archiveFile);
                    archive
                        .append(fs.createReadStream(filename), {name: fileName})
                        .finalize();
                })

        }
        catch
            (err) {
            // Handle the error here.
            logger.error(err);
        }
    }
}

ftp.on('ready', connected);