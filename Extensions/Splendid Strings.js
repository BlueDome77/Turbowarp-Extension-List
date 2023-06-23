(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
    ext.replace = function(old,str,neww){
	return str.replace(new RegExp(old, 'g'),neww);
    } 
    ext.slice = function(b,e,str){
	return str.slice(b,e);
    }
    ext.trim = function(str){
	return str.trim();
    }
    ext.eq = function(str1,str2){
	return (str1 === str2);
    }
    ext.split = function(str,sep,max){
	if(max<=0){
		return JSON.stringify(str.split(sep));
	}
	return JSON.stringify(str.split(sep,max));
    }
    ext.get = function(i,a){
	return JSON.parse(a)[i-1];
    }
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
		['r', 'Replace %s in %s with %s', 'replace', 'Python', 'Python is a great programming language', 'Scratch'],
		['r', 'Characters %n to %n in %s', 'slice', '9','16','Imagine, Program, Share.'],
		['r', 'Remove beginning and trailing whitespace from %s','trim','      	Scratch   	'],
		['b', '%s === %s','eq','Scratch','Cat'],
		['r', 'Split %s by %s %n times', 'split','ScratchxCat','x','-1'],
		['r', 'Item %n from the StringSplit %s', 'get','1'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Splendid Strings', descriptor, ext);
})({});
