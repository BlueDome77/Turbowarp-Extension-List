(function (ext) {
  ext._getStatus    = function()              { return { status: 2, msg: 'Ready' };  };
  ext._shutdown     = function()              {                                      };
  
  ext.installed     = function()              { return true;                         };
  
  ext.var_get       = function(v)             { return ExtVars[v];                   };
  ext.var_new       = function(v)             { ExtVars[v] = "";                     };
  ext.var_set       = function(v,value)       { ExtVars[v] = value;                  };
  ext.var_change    = function(v,value)       { ExtVars[v] += value;                 };
  ext.var_del       = function(v)             { ExtVars.del(v);                      };
  ext.list_get      = function(list)          { return ExtLists[list].join(" ");     };
  ext.list_get_item = function(idx,list)      { return ExtLists[list][idx-1];        };
  ext.list_length   = function(list)          { return ExtLists[list].length();      };
  ext.list_new      = function(list)          { ExtLists[list] = [];                 };
  ext.list_add      = function(list,item)     { ExtLists[list].push(item);           };
  ext.list_replace  = function(idx,list,item) { ExtLists[list][idx-1] = item;        };
  ext.list_insert   = function(item,idx,list) { ExtLists[list].splice(idx-1,0,item); };
  ext.list_del_item = function(idx,list)      { ExtLists[list].del(idx);             };
  ext.list_del      = function(list)          { ExtLists.del(list);                  };
  
  var ExtVars  = {};
  var ExtLists = {};
  
  var descriptor = {
    blocks: [
	  ['b', 'temp vars extension installed?',    'installed'           ],
	  ['r', 'get variable %m.tempVars',          'var_get',          ''],
	  [' ', 'create variable %s',                'var_new',          ''],
	  [' ', 'set %m.tempVars to %s',             'var_set',      '', ''],
	  [' ', 'change %m.tempVars by %n',          'var_change',     '',1],
	  [' ', 'delete variable %m.tempVars',       'var_del',          ''],
	  ['r', 'get list %m.tempLists',             'list_get',         ''],
	  ['r', 'item %n of %m.tempLists',           'list_get_item','1',''],
	  ['r', 'length of %m.tempLists',            'list_length',      ''],
	  [' ', 'create list %s',                    'list_new',         ''],
	  [' ', 'add %s to %m.tempLists',            'list_add',      '',''],
	  [' ', 'replace %n of %m.tempLists with %s','list_replace',1,'',''],
	  [' ', 'insert %s at %n of %m.tempLists',   'list_insert', '',1,''],
	  [' ', 'delete %n of %m.tempLists',         'list_del_item',  1,''],
	  [' ', 'delete list %m.tempLists',          'list_del',         '']
	],
	menus: {
	  tempVars:  ExtVars,
	  tempLists: ExtLists
	}
  };
  
  ScratchExtensions.register('Temp Vars and Lists', descriptor, ext);
})({});
