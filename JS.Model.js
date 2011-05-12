String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var JS = {}
JS.Model = function(model) {
    var modelObject = function(attributes) { 
		for (var key in attributes) {
			if (this[key] !== undefined) {
				this[key] = attributes[key];
			}
		}
	};
	
	modelObject.prototype = {
		definedAttributes: [],
		element: null,
		
		save: function() {
			if (this.element !== null) {
				for (var i = 0; i < this.definedAttributes.length; i++) {
					var attributeElement = this.element.getElementsByClassName(this.definedAttributes[i])[0];
					attributeElement.innerHTML = '';
					attributeElement.appendChild(document.createTextNode(this[this.definedAttributes[i]]));
				}
			} else {
				this.element = document.createElement('div');
				this.element.className = modelObject.nameOfModel();
				for (var i = 0; i < this.definedAttributes.length; i++) {
					var attributeElement = document.createElement('div');
					attributeElement.className = this.definedAttributes[i];
					attributeElement.appendChild(document.createTextNode(this[this.definedAttributes[i]]));
					this.element.appendChild(attributeElement);
				}
				document.body.appendChild(this.element);
			}
		}
	};
	
	for (var key in model) {
		switch(key) {
			case 'definition':
				for (var i = 0; i < model.definition.length; i++) {
					var attribute = model.definition[i];
					modelObject.prototype[attribute] = null;
					modelObject.prototype.definedAttributes.push(attribute);
				}
				break;
			case 'static':
				for(var key in model.static) {
					modelObject[key] =  model.static[key];
				}
				break;
			default:
				modelObject.prototype[key] = model[key];
		}
	}
	
	modelObject.findBy = function(attribute, value) {
		var models = document.getElementsByClassName(modelObject.nameOfModel());
		for (var i = 0; i < models.length; i++) {
			var attributes = {};
			for (var j = 0; j < models[i].children.length; j++) {
				attributes[models[i].children[j].className] = models[i].children[j].innerHTML;
			}
			
			if (attributes[attribute] == value) {
				var model = new modelObject(attributes);
				model.element = models[i];
				return model;
			}
		}
		return null;
	};
	
	for (var i = 0; i < model.definition.length; i++) {
		modelObject['findBy' + model.definition[i].capitalize()] = (function(attribute) {
			return function(value) {
				return modelObject.findBy(attribute, value);
			};
		})(model.definition[i]);
	}
	
	modelObject.nameOfModel = function() { 
	    for (var name in window) 
	      if (window[name] == this) 
	        return name.toLowerCase(); 
	  };

	return modelObject;
};

function attribute() {
	var name = arguments[0];
	return name;
}
 
var notDisplayable = 'notDisplayable';
var comments = 'comments';