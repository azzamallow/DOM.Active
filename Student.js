var Student = JS.Model({
  definition: [
    attribute('name'),
    attribute('subject', notDisplayable, comments),
  ],

  enrol: function() {
	alert('hello');
  },

  static: {
 	 blah: function() {
	    alert('staticFunction');
	  }
  }
});

var me = new Student({ name: 'aaron', subject: 'mathematics' });
me.save();
me.subject = 'english';
me.save();

var aaron = Student.findByName('aaron');
aaron.subject = 'physics';
aaron.save();