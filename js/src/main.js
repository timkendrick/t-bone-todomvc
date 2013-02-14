define(
	[
		"jquery",
		"backbone",
		"tbone",
		
		"components/TodosComponent/TodosComponent"
	],
	function(
		$,
		Backbone,
		Component,
		
		TodosComponent
	) {
		// Initialise component styles
		Component.init();
		
		// Define the root page model
		var rootPageModel = new Component.Model({
			items: new Component.Collection()
		});
		
		// Create the root page component
		var rootPageComponent = new TodosComponent({
			model: rootPageModel
		});
		
		// Create the root page component's DOM element
		rootPageComponent.render();
		
		// Add the root page component's DOM element to the document
		$("[role=main]").append(rootPageComponent.$el);
		
		// Activate the root page component
		rootPageComponent.activate();
		
		// Listen for window resize events
		if (typeof window !== 'undefined') { $(window).on("resize", function() { rootPageComponent.updateSize(); }); }
		
		// Create the router
		var TodoRouter = Backbone.Router.extend({
			
			routes: {
				"": "index",
				"active": "active",
				"completed": "completed"
			},
			
			index: function() {
				rootPageComponent.showAll();
			},
			
			active: function() {
				rootPageComponent.showActive();
			},
			
			completed: function() {
				rootPageComponent.showCompleted();
			}
		});
		
		// Initialise the router
		var router = new TodoRouter();
		
		Backbone.history.start();
	}
);