var docRef = app.activeDocument;
  
function exportPNG24(destFolder, artboard) {  

    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

    var fileName = docRef.name.split('.')[0];

    var opts = new ExportOptionsPNG24();
    opts.artBoardClipping = true;
    opts.transparency = false;
    
    
    docRef.artboards.setActiveArtboardIndex( artboard );
    fileName = fileName + "_" + docRef.artboards[artboard].name + ".png";
    var fileSpec = File(destFolder + "/" + fileName);
    docRef.exportFile ( fileSpec, ExportType.PNG24, opts );
    
    app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;  
}

function exportPDF(destFolder, artboard) {  

    var pdfSaveOptions = new PDFSaveOptions();
    pdfSaveOptions.artboardRange = artboard;
    pdfSaveOptions.pDFPreset = app.PDFPresetsList[3];

    var fileName = docRef.name.split('.')[0];
    fileName = fileName + "_" + docRef.artboards[artboard-1].name + ".pdf";

    var destFile = File(destFolder + "/" + fileName);
	docRef.saveAs (destFile,  pdfSaveOptions);	 
}

var destFolder = Folder.selectDialog('Select the folder to save files to:');
if (destFolder) {
    
    for ( ii = 1; ii < 4; ii++ ) {
        exportPDF(destFolder, ii);	
    }
    
    for ( ii = 3; ii < 6; ii++ ) {
        exportPNG24(destFolder, ii);	
    }
}	
