/*global document, window */

function attribute() {
    var args = Array.prototype.slice.call(arguments);
    return {name: args[0], conditions: args.slice(1)};
}
 
var commentsOnly = 'commentsOnly';

var DOM = {};
DOM.Actives = [];
DOM.Active = function(activeAttributes) {
    var unique = Date.now();
    
    var activeObject = function(uniqy) {
        if (uniqy !== unique) {
            throw new Error("Please use '" + capitalize(activeName()) + ".create()' to create a new instance of " + capitalize(activeName()) + ".");
        }
    };
    
    var activeName = function() {
        var name;
        for (name in window) {
            if (window[name] === activeObject) {
                return name.toLowerCase();
            }
        }
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
    
	activeObject.prototype = {
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
				this.element.className = activeName();
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
                    var wrappers = document.getElementsByClassName(activeName() + 's');
                    if (wrappers.length === 0) {
                        var wrapper = document.createElement('div');
                        wrapper.className = activeName() + 's';
                        document.body.appendChild(wrapper);
                    }
                    wrappers = document.getElementsByClassName(activeName() + 's');
                    wrappers[0].appendChild(this.element);
                }
			}
		}
	};
	
    (function defineAttributesAndFunctions() {
        var key;
        for (key in activeAttributes) {
            if (activeAttributes.hasOwnProperty(key)) {
                switch(key) {
                    case 'definition':
                        var i;
                        for (i = 0; i < activeAttributes.definition.length; i++) {
                            var attribute = activeAttributes.definition[i];
                            activeObject.prototype[attribute.name] = null;
                            activeObject.prototype.definedAttributes.push(attribute.name);
                            if (attribute.conditions.indexOf(commentsOnly) !== -1) {
                                activeObject.prototype.commentsOnly.push(attribute.name);
                            }
                        }
                        break;
                    case 'staticFunctions':
                        var staticFunction;
                        for (staticFunction in activeAttributes.staticFunctions) {
                            if (activeAttributes.staticFunctions.hasOwnProperty(staticFunction)) {
                                activeObject[staticFunction] =  activeAttributes.staticFunctions[staticFunction];
                            }
                        }
                        break;
                    default:
                        activeObject.prototype[key] = activeAttributes[key];
                }
            }
        }
    }());
    
    activeObject.create = function(attributes) {
        var newActiveObject = new activeObject(unique);
        var key;
        for (key in attributes) {
            if (attributes.hasOwnProperty(key) && newActiveObject[key] !== undefined) {
                newActiveObject[key] = attributes[key];
            }
        }
        DOM.Actives.push(newActiveObject);
        
        return newActiveObject;
    };
	
	activeObject.findBy = function(attribute, value) {
		var elements = document.getElementsByClassName(activeName());
        var found = [];
        var i, j;
		for (i = 0; i < elements.length; i++) {
			var attributes = {};
			for (j = 0; j < elements[i].childNodes.length; j++) {
                if(elements[i].childNodes[j].nodeName === '#comment') {
                    var values = elements[i].childNodes[j].textContent.split(':');
                    attributes[values[0]] = values[1].trim();
                } else {
				    attributes[elements[i].childNodes[j].className] = elements[i].childNodes[j].innerHTML;
                }
            }
			
			if (attributes[attribute] === value) {
                var added = false;
                for(j = 0; j < DOM.Actives.length; j++) {
                    if (DOM.Actives[j].element === elements[i]) {
                        found.push(DOM.Actives[j]);
                        added = true;
                    }
                }
                
                if (added === false) {
                    var newActiveObject = activeObject.create(attributes);
                    newActiveObject.element = elements[i];
                    found.push(newActiveObject);
                }
			}
		}
        
        return singleOrArray(found);
	};
	
    (function defineFindByFunctions() {
        function findBy(attribute) {
            return function(value) {
                return activeObject.findBy(attribute, value);
            };
        }
        var i;
        for (i = 0; i < activeAttributes.definition.length; i++) {
            activeObject['findBy' + capitalize(activeAttributes.definition[i].name)] = findBy(activeAttributes.definition[i].name);
        }
    }());

    return activeObject;
};