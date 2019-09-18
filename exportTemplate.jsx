var docRef = app.activeDocument;
var docName = docRef.name.split('.')[0];

var prefix;
var suffix;
var pdfArtboards = [];
var jpgArtboards = [];
var names = [];
  
function exportPNG24(destFolder, name, artboard) {  

    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

    var opts = new ExportOptionsPNG24();
    opts.artBoardClipping = true;
    opts.transparency = false;
    
    
    docRef.artboards.setActiveArtboardIndex( artboard );
    var fileName = prefix.text + name.text + suffix.text + ".png";
    var fileSpec = File(destFolder + "/" + fileName);
    docRef.exportFile ( fileSpec, ExportType.PNG24, opts );
    
    app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;  
}

function exportPDF(destFolder, name, artboard) {  

    var pdfSaveOptions = new PDFSaveOptions();
    pdfSaveOptions.artboardRange = artboard;
    pdfSaveOptions.pDFPreset = app.PDFPresetsList[3];

    var fileName = prefix.text + name.text + suffix.text + ".pdf";

    var destFile = File(destFolder + "/" + fileName);
	docRef.saveAs (destFile,  pdfSaveOptions);	 
}

function save(){
    var destFolder = Folder.selectDialog('Select the folder to save files to:');
    if (destFolder) {

        var ii;

        for ( ii = 0; ii < pdfArtboards.length; ii++ ) {
            if(pdfArtboards[ii].value==true){
                exportPDF(destFolder, names[ii], ii+1);
            }
        }

        for ( ii = 0; ii < jpgArtboards.length; ii++ ) {
            if(jpgArtboards[ii].value==true){
                exportPNG24(destFolder, names[ii], ii);
            }
        }
    }
}

function openDialog() {

    var dlg = new Window("dialog", "Artboard Exporter");

    var checkRow = dlg.add('group', undefined, '');
    checkRow.orientation = 'row';
    checkRow.alignment = 'left';


    var checkColumn = checkRow.add('group', undefined, '');
    checkColumn.orientation = "column";

    checkColumn.add("statictext", undefined, "Artboard: ").alignment = 'right';
    
    checkColumn.add("statictext", undefined, "Export as PDF: ").alignment = 'right';
    
    checkColumn.add("statictext", undefined, "Export as JPG: ").alignment = 'right';
    
    checkColumn.add("statictext", undefined, "Name: ").alignment = 'right';
    

    for(var i=0; i<docRef.artboards.length; i++){

        var artboard = docRef.artboards[i].name;

        checkColumn = checkRow.add('group', undefined, '');
        checkColumn.orientation = "column";

        checkColumn.add("statictext", undefined, (i+1));

        var pdfCheck =  checkColumn.add("checkbox");
        if(artboard==="8.5x11" || artboard==="11x17" || artboard==="24x36"){
            pdfCheck.value = true;
        }

        var jpgCheck = checkColumn.add("checkbox");
        if(artboard==="1024x512" || artboard==="1140x325" || artboard==="1080x1920" || artboard==="1200x900"){
            jpgCheck.value = true;
        }

        var name = checkColumn.add("edittext", undefined, artboard);
        name.characters = 8;

        pdfArtboards.push(pdfCheck);
        jpgArtboards.push(jpgCheck);
        names.push(name);
    }

    var ixRow = dlg.add('group', undefined, '');
    ixRow.orientation = 'row';
    ixRow.alignment = 'left';

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
    buttonRow.alignment = 'right';
    
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

