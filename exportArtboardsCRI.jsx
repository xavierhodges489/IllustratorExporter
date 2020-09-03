var docRef = app.activeDocument;
var docName = docRef.name.substring(0, docRef.name.lastIndexOf("."));
var destFolder = docRef.path;

var prefix;
var suffix;
var pdfArtboards = [];
var pngArtboards = [];
var names = [];

var destFolderText;

var dimensionsPDF = ["8.5x11", "11x8.5", "11x17", "24x36"];
var dimensionsPNG = [
  "1024x512",
  "1140x325",
  "1080x1920",
  "1920x1080",
  "1200x900",
];

function exportPNG24(destFolder, name, artboard) {
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var opts = new ExportOptionsPNG24();
  opts.artBoardClipping = true;
  opts.transparency = false;

  docRef.artboards.setActiveArtboardIndex(artboard);
  var fileName = prefix.text + name.text + suffix.text + ".png";
  var fileSpec = File(destFolder + "/" + fileName);
  docRef.exportFile(fileSpec, ExportType.PNG24, opts);

  app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
}

function exportPDF(destFolder, name, artboard) {
  var pdfSaveOptions = new PDFSaveOptions();
  pdfSaveOptions.artboardRange = artboard;
  pdfSaveOptions.pDFPreset = app.PDFPresetsList[3];

  var fileName = prefix.text + name.text + suffix.text + ".pdf";

  var destFile = File(destFolder + "/" + fileName);
  docRef.saveAs(destFile, pdfSaveOptions);
}

function save() {
  if (destFolder) {
    var ii;

    for (ii = 0; ii < pdfArtboards.length; ii++) {
      if (pdfArtboards[ii].value == true) {
        exportPDF(destFolder, names[ii], ii + 1);
      }
    }

    for (ii = 0; ii < pngArtboards.length; ii++) {
      if (pngArtboards[ii].value == true) {
        exportPNG24(destFolder, names[ii], ii);
      }
    }
  }
}

function openDialog() {
  var dlg = new Window("dialog", "Artboard Exporter");

  var checkRow = dlg.add("group", undefined, "");
  checkRow.orientation = "row";
  checkRow.alignment = "left";

  var checkColumn = checkRow.add("group", undefined, "");
  checkColumn.orientation = "column";

  checkColumn.add("statictext", undefined, "Artboard: ").alignment = "right";

  checkColumn.add("statictext", undefined, "Export as PDF: ").alignment =
    "right";

  checkColumn.add("statictext", undefined, "Export as PNG: ").alignment =
    "right";

  checkColumn.add("statictext", undefined, "Name: ").alignment = "right";

  for (var i = 0; i < docRef.artboards.length; i++) {
    var artboard = docRef.artboards[i].name;

    checkColumn = checkRow.add("group", undefined, "");
    checkColumn.orientation = "column";

    checkColumn.add("statictext", undefined, i + 1);

    var pdfCheck = checkColumn.add("checkbox");
    for (var j = 0; j < dimensionsPDF.length; j++) {
      if (artboard.indexOf(dimensionsPDF[j]) > -1) {
        pdfCheck.value = true;
        break;
      }
    }

    var pngCheck = checkColumn.add("checkbox");
    for (var j = 0; j < dimensionsPNG.length; j++) {
      if (artboard.indexOf(dimensionsPNG[j]) > -1) {
        pngCheck.value = true;
        break;
      }
    }

    var name = checkColumn.add("edittext", undefined, artboard);
    name.characters = 8;

    pdfArtboards.push(pdfCheck);
    pngArtboards.push(pngCheck);
    names.push(name);
  }

  checkColumn = checkRow.add("group", undefined, "");
  var uncheckAllBtn = checkColumn.add("button", undefined, "Uncheck All", {
    name: "uncheckAll",
  });
  uncheckAllBtn.onClick = function () {
    var i;
    for (i = 0; i < pdfArtboards.length; i++) {
      pdfArtboards[i].value = false;
      pngArtboards[i].value = false;
    }
  };

  //prefix and suffix row
  var ixRow = dlg.add("group", undefined, "");
  ixRow.orientation = "row";
  ixRow.alignment = "left";

  ixRow.add("statictext", undefined, "Prefix: ");
  prefix = ixRow.add("edittext", undefined, docName + "_");
  prefix.characters = 40;

  ixRow.add("statictext", undefined, "Suffix: ");
  suffix = ixRow.add("edittext");
  suffix.characters = 20;

  //folder row
  var folderRow = dlg.add("group", undefined, "");
  folderRow.orientation = "row";
  folderRow.alignment = "left";

  folderRow.add("statictext", undefined, "Export to: ");

  destFolderText = folderRow.add("edittext", undefined, destFolder.fsName);
  destFolderText.characters = 65;

  //buttons
  var buttonRow = dlg.add("group", undefined, "");
  buttonRow.orientation = "row";
  buttonRow.alignment = "right";

  var selectFolderButton = buttonRow.add("button", undefined, "Choose Folder", {
    name: "selectFolderButton",
  });
  selectFolderButton.onClick = function () {
    var selected = destFolder.selectDlg("Select the folder to save files to:");
    if (selected) {
      destFolder = selected;
    }
    destFolderText.text = destFolder.fsName;
  };

  var cancelBtn = buttonRow.add("button", undefined, "Cancel", {
    name: "cancel",
  });
  cancelBtn.onClick = function () {
    dlg.close();
  };

  var exportBtn = buttonRow.add("button", undefined, "Export", {
    name: "export",
  });
  exportBtn.onClick = function () {
    save();
    dlg.close();
  };

  dlg.show();
}

openDialog();
