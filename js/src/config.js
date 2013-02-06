require.config({
	deps: ["main"],
	
	paths: {
		"jquery": "../lib/jquery",
		"underscore": "../lib/underscore",
		"backbone": "../lib/backbone",
		
		"text": "../lib/requirejs-text/text",
		
		"tbone": "../lib/t-bone/Component"
	},
	
	shim: {
		jquery: {
			exports: "jQuery"
		},
		
		underscore: {
			exports: "_"
		},
		
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		}
	}
});