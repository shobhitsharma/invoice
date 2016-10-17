App.controller('exportCtrl', function ($scope, $http, poinfo) {
    'use strict';


    poinfo.all().then(function (POInfo) {
        console.log(JSON.stringify(POInfo));
        $scope.POs = POInfo;
    });


    $scope.gridOptions = {
        data: 'POs',

        columnDefs: [
            {field: 'PONumber', displayName: 'PO Number', width: '10%'},
            {
                field: 'PODate',
                displayName: 'PO Date',
                width: '10%',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"'
            },
            {field: 'OrderType', displayName: 'Order Type', width: '20%'}, {
                field: 'Division',
                displayName: 'Division',
                width: '20%'
            },
            {field: 'PartnerCode', displayName: 'Partner Code', width: '20%'}, {
                field: 'PartnerName',
                displayName: 'Partner Name',
                width: '20%'
            },
            {field: 'ShipToCode', displayName: 'Ship To Code', width: '20%'}, {
                field: 'ShipToName',
                displayName: 'Ship To Name',
                width: '20%'
            },
            {field: 'POERPStatus', displayName: 'PO ERP Status', width: '20%'}, {
                field: 'CustomerNumber',
                displayName: 'Customer Number',
                width: '20%'
            },
            {field: 'FreightAmount', displayName: 'FreightAmount', width: '20%'}, {
                field: 'ItemCode',
                displayName: 'Item Code',
                width: '20%'
            },
            {field: 'Description', displayName: 'Description', width: '20%'}, {
                field: 'WarehouseCode',
                displayName: 'Warehouse Code',
                width: '20%'
            },
            {field: 'PartnerPONumber', displayName: 'Partner PO Number', width: '20%'}, {
                field: 'UnitofMeasure',
                displayName: 'Unit Of Measure',
                width: '20%'
            },
            {field: 'QuantityOrdered', displayName: 'Quantity Ordered', width: '20%'}, {
                field: 'Quantitybackordered',
                displayName: 'Quantity Backordered',
                width: '20%'
            },
            {field: 'Quantityinvoiced', displayName: 'Quantity INvoiced', width: '20%'},
            {
                field: 'UnitCost',
                displayName: 'Unit Cost',
                width: '20%'
            },
            {field: 'Total', displayName: 'Total',      width: '20%'}
        ],
        saveScroll: true,
        enableFiltering: true,
        paginationPageSizes: [10, 25, 50, 75],
        paginationPageSize: 10

    };
});