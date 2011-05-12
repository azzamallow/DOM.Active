var Student = JS.Model({
  definition: [
    attribute('name'),
    attribute('subject'),
    attribute('identification', commentsOnly)
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

var me = new Student({ name: 'aaron', subject: 'mathematics', identification: 3 });
me.save();
me.subject = 'english';
me.save();

var aaron = Student.findByName('aaron');
aaron.subject = 'physics';
aaron.identification = '55';
aaron.save();