define(
	[
		"tbone",
		
		"utils/Keyboard",
		
		"components/ListItemComponent/ListItemComponent",
		
		"text!components/TodosComponent/TodosComponent.html",
		"text!components/TodosComponent/TodosComponent.css"
	],
	function(
		Component,
		
		Keyboard,
		
		ListItemComponent,
		
		TodosComponentTemplate,
		TodosComponentStyle
	) {
		var PAGE_INDEX = 0;
		var PAGE_ACTIVE = 1;
		var PAGE_COMPLETED = 2;
		
		var TodosComponent = Component.extend({
			
			template: TodosComponentTemplate,
			
			generators: {
				"numItems {items[]}": function() {
					return this.model.get("items").length;
				},
				"numCompleted {numItems}": function() {
					return this.model.get("items").filter(
						function(itemModel) { return itemModel.get("completed"); }
					).length;
				},
				"numRemaining {numItems,numCompleted}": function() {
					return this.model.get("items").filter(
						function(itemModel) { return !itemModel.get("completed"); }
					).length;
				},
				"allCompleted {numCompleted}": function() {
					return this.model.get("items").every(function(itemModel) { return itemModel.get("completed"); });
				},
				"counter {numRemaining}": function() {
					var numRemaining = this.get("numRemaining");
					return "<strong>" + numRemaining + "</strong>" + (numRemaining === 1 ? " item left" : " items left");
				},
				"currentPage": function() {
					return this._currentPage;
				},
				"indexPage {currentPage}": function() {
					return (this._currentPage === PAGE_INDEX);
				},
				"activePage {currentPage}": function() {
					return (this._currentPage === PAGE_ACTIVE);
				},
				"completedPage {currentPage}": function() {
					return (this._currentPage === PAGE_COMPLETED);
				}
			},
			
			events: {
				"keypress [data-id=new-todo]": function(event) {
					if (event.keyCode !== Keyboard.ENTER) { return; }
					var value = event.currentTarget.value.trim();
					if (!value) { return; }
					this.addItem(value);
					event.currentTarget.value = "";
				},
				"change [data-id=all]": function(event) {
					if (event.currentTarget.checked) { this.selectAll(); } else { this.selectNone(); }
				},
				"click [data-id=clear]": function(event) {
					var itemsCollection = this.model.get("items");
					for (var i = 0; i < itemsCollection.length; i++) {
						if (itemsCollection.at(i).get("completed")) { this.removeItem(i--); }
					}
				}
			},
			
			_currentPage: PAGE_INDEX,
			
			addItem: function(title, completed) {
				var itemModel = new Component.Model({ title: title, completed: !!completed });
				this.model.get("items").add(itemModel);
			},
			
			removeItem: function(index) {
				this.model.get("items").remove(this.model.get("items").at(index));
			},
			
			selectAll: function() {
				this.model.get("items").each(function(itemModel) { itemModel.set("completed", true); });
			},
			
			selectNone: function() {
				this.model.get("items").each(function(itemModel) { itemModel.set("completed", false); });
			},
			
			showAll: function() {
				this.trigger("change:currentPage", this._currentPage = PAGE_INDEX);
			},
			
			showActive: function() {
				this.trigger("change:currentPage", this._currentPage = PAGE_ACTIVE);
			},
			
			showCompleted: function() {
				this.trigger("change:currentPage", this._currentPage = PAGE_COMPLETED);
			},
			
			_addModelListeners: function(model) {
				Component.prototype._addModelListeners.call(this, model);
				
				model.get("items").on("change:completed", this._handleCollectionItemCompletedChanged, this);
			},
			
			_removeModelListeners: function(model) {
				Component.prototype._removeModelListeners.call(this, model);
				
				model.get("items").off("change:completed", this._handleCollectionItemCompletedChanged, this);
			},
			
			_handleCollectionItemCompletedChanged: function() {
				this.trigger("change:numCompleted");
			}
		});
		
		return Component.register(TodosComponent, "components.TodosComponent", TodosComponentStyle);
	}
);