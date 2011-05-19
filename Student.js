var Student = DOM.Active({
  definition: [
    attribute('name'),
    attribute('subject'),
    attribute('identification', commentsOnly)
  ],

  enrol: function() {
	alert(this.name);
  },

  static: {
    blah: function() {
	    alert('staticFunction');
	  }
  }
});