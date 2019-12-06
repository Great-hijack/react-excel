import FileSaver from 'file-saver';
import Excel from "exceljs";
import getDateStr from './datetime';
import getBaseName from './pathUtil';

const exportFilesToExcel = (files, outputName) => {
    // header for download file
    const header1 = ["No",
        "Reg.Time",
        "File",
        "Summary",
        "User",
        "Observer",
        "Manager",
        "Remarks",
    ];
    // header for send, recv, chat file
    const header2 = ["No",
        "Reg.Time",
        "Send/Recv",
        "Summary",
        "User",
        "Observer",
        "Manager",
        "Remarks",
    ];

    var workbook = new Excel.Workbook();

    var i = 0;
    var cell;
    var R = 0;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add sheet for download file
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var sheet1 = workbook.addWorksheet('Download', { properties: { tabColor: { argb: '6B5B95' }, defaultRowHeight: 39 } });
    // Page Setup for sheet1
    sheet1.pageSetup.paperSize = 13; // B5 (JIS)
    sheet1.pageSetup.orientation = 'landscape';
    sheet1.pageSetup.margins = {
        left: 0.7, right: 0.7,
        top: 0.3, bottom: 0.3,
        header: 0.3, footer: 0.3
    };
    // Repeat specific rows on every printed page
    sheet1.pageSetup.printTitlesRow = '1:2';
    // Set Row height for title and header
    sheet1.getRow(1).height = 48;
    sheet1.getRow(2).height = 21;
    // Print Title
    sheet1.mergeCells(1, 1, 1, 8);
    sheet1.getCell(1, 1).value = 'Download Data';
    sheet1.getCell(1, 1).style = { font: { size: 16, underline: true, bold: true }, alignment: { vertical: "middle", horizontal: "center" } };
    // Print header
    for (i = 0; i < header1.length; i++) {
        cell = sheet1.getCell(2, i + 1);
        cell.value = header1[i];
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    }
    // Print data
    R = 3;
    files.forEach(file => {
        if (file.type === 'Download') {
            var data = [];
            var row = sheet1.getRow(R);
            data[1] = R - 2;
            data[2] = getDateStr(file.register_date);
            data[3] = getBaseName(file.saved_url);
            data[4] = file.description;
            data[5] = file.owner;
            data[6] = "";
            data[7] = "";
            data[8] = "";

            row.values = data;
            row.font = { size: 10 };
            row.alignment = { vertical: "middle", wrapText: true };
            row.numFmt = "@";
            row.height = 39;

            // set border
            for (i = 0; i < header1.length; i++) {
                cell = sheet1.getCell(R, i + 1);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
            R++;
        }
    });
    // Print Blank Row
    var blankRow = (R - 3) % 11 ? 11 - ((R - 3) % 11) : 0;
    for (var bb = 0; bb < blankRow; bb++) {
        var row = sheet1.getRow(R);
        row.font = { size: 10 };
        row.alignment = { vertical: "middle", wrapText: true };
        row.numFmt = "@";
        row.height = 39;

        // set border
        for (i = 0; i < header1.length; i++) {
            cell = sheet1.getCell(R, i + 1);
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
        R++;
    }
    // Set Column width
    var col_width1 = [3.29, 9.43, 31, 20.71, 9.57, 8.43, 8, 7.86];
    for (i = 0; i < header1.length; i++)
        sheet1.getColumn(i + 1).width = col_width1[i];

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add sheet for send, recv, chat file
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var sheet2 = workbook.addWorksheet('Communication', { properties: { tabColor: { argb: '672E3B' }, defaultRowHeight: 39 } });
    // Page Setup for sheet2
    sheet2.pageSetup.paperSize = 13; // B5 (JIS)
    sheet2.pageSetup.orientation = 'landscape';
    sheet2.pageSetup.margins = {
        left: 0.7, right: 0.7,
        top: 0.3, bottom: 0.3,
        header: 0.3, footer: 0.3
    };
    // Repeat specific rows on every printed page
    sheet2.pageSetup.printTitlesRow = '1:2';
    // Set Row height for title and header
    sheet2.getRow(1).height = 48;
    sheet2.getRow(2).height = 21;
    // Print Title
    sheet2.mergeCells(1, 1, 1, 8);
    sheet2.getCell(1, 1).value = 'Communication History';
    sheet2.getCell(1, 1).style = { font: { size: 16, underline: true, bold: true }, alignment: { vertical: "middle", horizontal: "center" } };
    // Print header
    for (i = 0; i < header2.length; i++) {
        cell = sheet2.getCell(2, i + 1);
        cell.value = header2[i];
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    }
    // Print data
    R = 3;
    files.forEach(file => {
        if (file.type !== 'Download') {
            var data = [];
            var row = sheet2.getRow(R);
            data[1] = R - 2;
            data[2] = getDateStr(file.register_date);
            data[3] = file.type;
            data[4] = file.description;
            data[5] = file.owner;
            data[6] = "";
            data[7] = "";
            data[8] = "";

            row.values = data;
            row.font = { size: 10 };
            row.alignment = { vertical: "middle", wrapText: true };
            row.numFmt = "@";
            row.height = 39;

            // set border
            for (i = 0; i < header2.length; i++) {
                cell = sheet2.getCell(R, i + 1);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
            R++;
        }
    });
    // Print Blank Row
    blankRow = (R - 3) % 11 ? 11 - ((R - 3) % 11) : 0;
    for (bb = 0; bb < blankRow; bb++) {
        row = sheet2.getRow(R);
        row.font = { size: 10 };
        row.alignment = { vertical: "middle", wrapText: true };
        row.numFmt = "@";
        row.height = 39;

        // set border
        for (i = 0; i < header2.length; i++) {
            cell = sheet2.getCell(R, i + 1);
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
        R++;
    }

    // Set Column width
    var col_width2 = [3.29, 9.43, 10.43, 56.71, 9.57, 8.43, 8, 7.86];
    for (i = 0; i < header2.length; i++)
        sheet2.getColumn(i + 1).width = col_width2[i];

    // Save as xlsx
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    workbook.xlsx.writeBuffer()
        .then(function (buffer) {
            const data = new Blob([buffer], { type: fileType });
            FileSaver.saveAs(data, outputName + fileExtension);
        });
}

export default exportFilesToExcel;