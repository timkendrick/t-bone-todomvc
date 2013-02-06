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
				"counter {numItems}": function() {
					var numItems = this.model.get("items").length;
					return "<strong>" + numItems + "</strong>" + (numItems === 1 ? " item left" : " items left");
				},
				"numCompleted {numItems}": function() {
					if (!this.repeaters) { return 0; }
					return _(this.repeaters["items"]).filter(function(itemView) {
						return itemView.model.get("completed");
					}).length;
				},
				"allCompleted {numCompleted}": function() {
					if (!this.repeaters) { return true; }
					return _(this.repeaters["items"]).every(function(itemView) {
						return itemView.model.get("completed");
					});
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
					var itemViews = this.repeaters["items"];
					for (var i = 0; i < itemViews.length; i++) {
						if (itemViews[i].model.get("completed")) { this.removeItem(i--); }
					}
				}
			},
			
			_currentPage: PAGE_INDEX,
			
			addItem: function(title, completed) {
				var itemModel = new Component.Model({ title: title, completed: !!completed });
				this.model.get("items").add(new Component.SubviewBinding({ view: ListItemComponent, model: itemModel}));
			},
			
			removeItem: function(index) {
				this.model.get("items").remove(this.model.get("items").at(index));
			},
			
			selectAll: function() {
				_(this.repeaters["items"]).each(function(itemView) { itemView.model.set("completed", true); });
			},
			
			selectNone: function() {
				_(this.repeaters["items"]).each(function(itemView) { itemView.model.set("completed", false); });
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
				
				model.get("items").on("add", this._handleCollectionItemAdded, this);
			},
			
			_removeModelListeners: function(model) {
				Component.prototype._removeModelListeners.call(this, model);
				
				model.get("items").off("change:completed", this._handleCollectionItemCompletedChanged, this);
				
				model.get("items").off("add", this._handleCollectionItemAdded, this);
			},
			
			_handleCollectionItemAdded: function(model, collection, options) {
				var index = (options && ("index" in options) ? options.index : collection.length - 1);
				this._addCollectionItemModelListeners(this.repeaters["items"][index].model);
			},
			
			_addCollectionItemModelListeners: function(itemModel) {
				itemModel.on("change:completed", this._handleCollectionItemCompletedChanged, this);
			},
			
			_handleCollectionItemCompletedChanged: function() {
				this.trigger("change:numCompleted");
			}
		});
		
		Component.registerStyle(TodosComponentStyle);
		
		return TodosComponent;
	}
);