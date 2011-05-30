/*global document, window */

function attribute() {
    var args = Array.prototype.slice.call(arguments);
    return {name: args[0], conditions: args.slice(1)};
}
 
var commentsOnly = 'commentsOnly';

var DOM = {};
DOM.Actives = [];
DOM.Active = function(model) {
    var modelObject = function(attributes) {
        var key;
    	for (key in attributes) {
			if (attributes.hasOwnProperty(key) && this[key] !== undefined) {
				this[key] = attributes[key];
			}
		}
        DOM.Actives.push(this);
	};
    
    var commentedNodes = function(element) {
        var i, nodes = [];
        for (i = 0; i < element.childNodes.length; i++) {
            if(element.childNodes[i].nodeName === '#comment') {
                nodes.push(element.childNodes[i]);
            }
        }
        return nodes;
    };
    
    var singleOrArray = function(object) {
        if (object.length === 1) {
            return object[0];
        } else {
            return object;
        }
    };
    
    var capitalize = function(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };
	
	modelObject.prototype = {
		definedAttributes: [],
		element: null,
        commentsOnly: [],
		
		save: function(elementToSaveIn) {
            var i, attributeElement;
			if (this.element !== null) {
				for (i = 0; i < this.definedAttributes.length; i++) {
					attributeElement = this.element.getElementsByClassName(this.definedAttributes[i])[0];
                    if (attributeElement !== undefined) {
                        attributeElement.innerHTML = '';
                        attributeElement.appendChild(document.createTextNode(this[this.definedAttributes[i]]));
                    }
				}
                var nodes = commentedNodes(this.element);
                for (i = 0; i < nodes.length; i++) {
                    var attribute = nodes[i].textContent.split(':')[0];
                    nodes[i].textContent = attribute + ': ' + this[attribute];
                }
			} else {
				this.element = document.createElement('div');
				this.element.className = modelObject.nameOfModel();
				for (i = 0; i < this.definedAttributes.length; i++) {
                    if (this.commentsOnly.indexOf(this.definedAttributes[i]) !== -1) {
                        var comments = document.createComment(this.definedAttributes[i] + ': ' + this[this.definedAttributes[i]]);
                        this.element.appendChild(comments);
                    } else {
                        attributeElement = document.createElement('div');
                        attributeElement.className = this.definedAttributes[i];
                        attributeElement.appendChild(document.createTextNode(this[this.definedAttributes[i]]));
                        this.element.appendChild(attributeElement);
                    }
				}
                
                if (elementToSaveIn !== undefined) {
                   elementToSaveIn.appendChild(this.element); 
                } else {    
                    var wrappers = document.getElementsByClassName(modelObject.nameOfModel() + 's');
                    if (wrappers.length === 0) {
                        var wrapper = document.createElement('div');
                        wrapper.className = modelObject.nameOfModel() + 's';
                        document.body.appendChild(wrapper);
                    }
                    wrappers = document.getElementsByClassName(modelObject.nameOfModel() + 's');
                    wrappers[0].appendChild(this.element);
                }
			}
		}
	};
	
    var key;
	for (key in model) {
        if (model.hasOwnProperty(key)) {
            switch(key) {
                case 'definition':
                    var i;
                    for (i = 0; i < model.definition.length; i++) {
                        var attribute = model.definition[i];
                        modelObject.prototype[attribute.name] = null;
                        modelObject.prototype.definedAttributes.push(attribute.name);
                        if (attribute.conditions.indexOf(commentsOnly) !== -1) {
                            modelObject.prototype.commentsOnly.push(attribute.name);
                        }
                    }
                    break;
                case 'static':
                    var method;
                    for(method in model.staticFunctions) {
                        if (model.staticFunctions.hasOwnProperty(method)) {
                            modelObject[method] =  model.staticFunctions[method];
                        }
                    }
                    break;
                default:
                    modelObject.prototype[key] = model[key];
            }
        }
	}
	
	modelObject.findBy = function(attribute, value) {
		var models = document.getElementsByClassName(modelObject.nameOfModel());
        var found = [];
        var i, j;
		for (i = 0; i < models.length; i++) {
			var attributes = {};
			for (j = 0; j < models[i].childNodes.length; j++) {
                if(models[i].childNodes[j].nodeName === '#comment') {
                    var values = models[i].childNodes[j].textContent.split(':');
                    attributes[values[0]] = values[1].trim();
                } else {
				    attributes[models[i].childNodes[j].className] = models[i].childNodes[j].innerHTML;
                }
            }
			
			if (attributes[attribute] === value) {
                var added = false;
                for(j = 0; j < DOM.Actives.length; j++) {
                    if (DOM.Actives[j].element === models[i]) {
                        found.push(DOM.Actives[j]);
                        added = true;
                    }
                }
                
                if (added === false) {
                    var model = new modelObject(attributes);
                    model.element = models[i];
                    found.push(model);
                }
			}
		}
        
        return singleOrArray(found);
	};
	
    (function defineFindByFunctions() {
        var findBy = function(attribute) {
            return function(value) {
                return modelObject.findBy(attribute, value);
            };
        };
        var i;
        for (i = 0; i < model.definition.length; i++) {
            modelObject['findBy' + capitalize(model.definition[i].name)] = findBy(model.definition[i].name);
        }
    }());
	
	modelObject.nameOfModel = function() {
        var name;
        for (name in window) {
            if (window[name] === this) {
                return name.toLowerCase();
            }
        }
    };
      
	return modelObject;
};