// Helper/Util object required

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var commentedNodes = function(element) {
    var nodes = [];
    for (var i = 0; i < element.childNodes.length; i++) {
        if(element.childNodes[i].nodeName == '#comment') {
            nodes.push(element.childNodes[i]);
        }
    }
    return nodes;
};

var singleOrArray = function(object) {
    if (object.length == 1) {
        return object[0];
    } else {
        return object;
    }
};

// Helper/Util object required

// Definition object required

function attribute() {
    args = Array.prototype.slice.call(arguments);
    return {name: args[0], conditions: args.slice(1)};
}
 
var commentsOnly = 'commentsOnly';

// Definition object required

var JS = {};
JS.Models = [];
JS.Model = function(model) {
    var modelObject = function(attributes) { 
		for (var key in attributes) {
			if (this[key] !== undefined) {
				this[key] = attributes[key];
			}
		}
        JS.Models.push(this);
	};
	
	modelObject.prototype = {
		definedAttributes: [],
		element: null,
        commentsOnly: [],
		
		save: function(elementToSaveIn) {
			if (this.element !== null) {
				for (var i = 0; i < this.definedAttributes.length; i++) {
					var attributeElement = this.element.getElementsByClassName(this.definedAttributes[i])[0];
                    if (attributeElement != null) {
    					attributeElement.innerHTML = '';
    					attributeElement.appendChild(document.createTextNode(this[this.definedAttributes[i]]));
                    }
				}
                var nodes = commentedNodes(this.element);
                for (var i = 0; i < nodes.length; i++) {
                    var attribute = nodes[i].textContent.split(':')[0];
                    nodes[i].textContent = attribute + ': ' + this[attribute];
                }
			} else {
				this.element = document.createElement('div');
				this.element.className = modelObject.nameOfModel();
				for (var i = 0; i < this.definedAttributes.length; i++) {
                    if (this.commentsOnly.indexOf(this.definedAttributes[i]) != -1) {
                        var comments = document.createComment(this.definedAttributes[i] + ': ' + this[this.definedAttributes[i]]);
                        this.element.appendChild(comments);
                    } else {
    					var attributeElement = document.createElement('div');
    					attributeElement.className = this.definedAttributes[i];
    					attributeElement.appendChild(document.createTextNode(this[this.definedAttributes[i]]));
    					this.element.appendChild(attributeElement);
                    }
				}
                
                if (elementToSaveIn != null) {
                   elementToSaveIn.appendChild(this.element); 
                } else {    
                    var wrappers = document.getElementsByClassName(modelObject.nameOfModel() + 's');
                    if (wrappers.length == 0) {
                        wrapper = document.createElement('div');
                        wrapper.className = modelObject.nameOfModel() + 's';
                        document.body.appendChild(wrapper);
                    }
                    wrappers = document.getElementsByClassName(modelObject.nameOfModel() + 's');
    				wrappers[0].appendChild(this.element);
                }
			}
		}
	};
	
	for (var key in model) {
		switch(key) {
			case 'definition':
				for (var i = 0; i < model.definition.length; i++) {
					var attribute = model.definition[i];
					modelObject.prototype[attribute.name] = null;
					modelObject.prototype.definedAttributes.push(attribute.name);
                    if (attribute.conditions.indexOf(commentsOnly) != -1) {
                        modelObject.prototype.commentsOnly.push(attribute.name);
                    }
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
        var found = [];
		for (var i = 0; i < models.length; i++) {
			var attributes = {};
			for (var j = 0; j < models[i].childNodes.length; j++) {
                if(models[i].childNodes[j].nodeName == '#comment') {
                    var values = models[i].childNodes[j].textContent.split(':');
                    attributes[values[0]] = values[1].trim();
                } else {
				    attributes[models[i].childNodes[j].className] = models[i].childNodes[j].innerHTML;
                }
            }
			
			if (attributes[attribute] == value) {
                var added = false;
                for(var j = 0; j < JS.Models.length; j++) {
                    if (JS.Models[j].element == models[i]) {
                        found.push(JS.Models[j]);
                        added = true;
                    }
                }
                
                if (added == false) {
    				var model = new modelObject(attributes);
    				model.element = models[i];
    				found.push(model);
                }
			}
		}
        
        return singleOrArray(found);
	};
	
	for (var i = 0; i < model.definition.length; i++) {
		modelObject['findBy' + model.definition[i].name.capitalize()] = (function(attribute) {
			return function(value) {
				return modelObject.findBy(attribute, value);
			};
		})(model.definition[i].name);
	}
	
	modelObject.nameOfModel = function() { 
	    for (var name in window) 
	      if (window[name] == this) 
	        return name.toLowerCase(); 
	  };
      
	return modelObject;
};