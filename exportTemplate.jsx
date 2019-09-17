var docRef = app.activeDocument;
var docName = docRef.name.split('.')[0];

var prefix;
var suffix;
var pdfArtboards = [];
var jpgArtboards = [];
  
function exportPNG24(destFolder, artboard) {  

    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

    var opts = new ExportOptionsPNG24();
    opts.artBoardClipping = true;
    opts.transparency = false;
    
    
    docRef.artboards.setActiveArtboardIndex( artboard );
    var fileName = prefix.text + docRef.artboards[artboard].name + suffix.text + ".png";
    var fileSpec = File(destFolder + "/" + fileName);
    docRef.exportFile ( fileSpec, ExportType.PNG24, opts );
    
    app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;  
}

function exportPDF(destFolder, artboard) {  

    var pdfSaveOptions = new PDFSaveOptions();
    pdfSaveOptions.artboardRange = artboard;
    pdfSaveOptions.pDFPreset = app.PDFPresetsList[3];

    var fileName = prefix.text + docRef.artboards[artboard-1].name + suffix.text + ".pdf";

    var destFile = File(destFolder + "/" + fileName);
	docRef.saveAs (destFile,  pdfSaveOptions);	 
}

function save(){
    var destFolder = Folder.selectDialog('Select the folder to save files to:');
    if (destFolder) {

        var ii;

        for ( ii = 0; ii < pdfArtboards.length; ii++ ) {
            if(pdfArtboards[ii].value==true){
                exportPDF(destFolder, ii+1);
            }
        }

        for ( ii = 0; ii < jpgArtboards.length; ii++ ) {
            if(jpgArtboards[ii].value==true){
                exportPNG24(destFolder, ii);
            }
        }
    }
}

function openDialog() {

    var dlg = new Window("dialog", "Artboard Exporter");

    var pdfRow = dlg.add('group', undefined, '');
    pdfRow.oreintation = 'row';

    var jpgRow = dlg.add('group', undefined, '');
    jpgRow.oreintation = 'row';
        
    pdfRow.add("statictext", undefined, "Save as PDF: ");
    jpgRow.add("statictext", undefined, "Save as JPG: ");

    for(var i=0; i<docRef.artboards.length; i++){

        var artboard = docRef.artboards[i].name;

        var pdfCheck =  pdfRow.add("checkbox", undefined, artboard);
        if(artboard==="8.5x11" || artboard==="11x17" || artboard==="24x36"){
            pdfCheck.value = true;
        }

        var jpgCheck = jpgRow.add("checkbox", undefined, artboard);
        if(artboard==="1024x512" || artboard==="1140x325" || artboard==="1080x1920" || artboard==="1200x900"){
            jpgCheck.value = true;
        }

        pdfArtboards.push(pdfCheck);
        jpgArtboards.push(jpgCheck);
    }

    var ixRow = dlg.add('group', undefined, '');
    ixRow.oreintation = 'row';

    ixRow.add("statictext", undefined, "Prefix: ");
    prefix = ixRow.add("edittext", undefined, docName + "_");
    prefix.characters = 40;

    ixRow.add("statictext", undefined, "Suffix: ");
    suffix = ixRow.add("edittext");
    suffix.characters = 20;


    //Buttons
    var buttonRow;
    buttonRow = dlg.add('group', undefined, ''); 
    buttonRow.orientation = 'row';
    
    var cancelBtn = buttonRow.add('button', undefined, 'Cancel', {name:'cancel'});
		cancelBtn.onClick = function() { dlg.close() };

	var saveBtn = buttonRow.add('button', undefined, 'Save and Close', {name:'saveClose'});
	saveBtn.onClick = function() {
		save();
		dlg.close()
    };
    
    dlg.show();
}

openDialog();

