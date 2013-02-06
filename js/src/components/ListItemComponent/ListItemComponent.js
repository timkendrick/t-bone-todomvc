define(
	[
		"tbone",
		
		"utils/Keyboard",
		
		"text!components/ListItemComponent/ListItemComponent.html"
	],
	function(
		Component,
		
		Keyboard,
		
		ListItemComponentTemplate
	) {
		var ListItemComponent = Component.extend({
			
			template: ListItemComponentTemplate,
			
			generators: {
				"editing": function() {
					return this._editing;
				}
			},
			
			events: {
				"dblclick [data-id=label]": function() {
					this.trigger("change:editing", this._editing = true);
					var inputElement = this.elements["input"];
					inputElement.focus();
					inputElement.select();
				},
				
				"keypress [data-id=input]": function() {
					if (event.keyCode !== Keyboard.ENTER) { return; }
					var inputElement = this.elements["input"];
					var value = inputElement.value.trim();
					if (!value) { return; }
					this.model.set("title", value);
					this.trigger("change:editing", this._editing = false);
				},
				
				"blur [data-id=input]": function() {
					this.trigger("change:editing", this._editing = false);
				},
				
				"click [data-id=delete]": function() {
					this.model.destroy();
				},
				
				"change [data-id=checkbox]": function() {
					this.model.set("completed", this.elements["checkbox"].checked);
				}
			},
			
			_editing: false
		});
		
		return ListItemComponent;
	}
);