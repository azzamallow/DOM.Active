var Student = JS.Model({
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

var aaron = new Student({ name: 'aaron', subject: 'mathematics', identification: 4});
aaron.save();
aaron.subject = 'english';
aaron.save();

var aaronAgain = Student.findByName('aaron');
aaronAgain.subject = 'physics';
aaronAgain.identification = '55';
aaronAgain.save();

areEqual = document.createElement('div');
areEqual.innerHTML = 'are equal = ' + (aaronAgain == aaron);
document.body.appendChild(areEqual);

var luke = new Student({ name: 'luke', subject: 'java', identification: 5});
luke.save();
luke.subject = 'perl';
luke.save();

var special = document.createElement('div');
special.className = 'special_students';
document.body.appendChild(special);
var mum = new Student({ name: 'mum', subject: 'parent', identification: 6});
mum.save(special);

var dad = new Student({ name: 'dad', subject: 'parent', identification: 7});
dad.save();

var parents = Student.findBySubject('parent');
numberOfParents = document.createElement('div');
numberOfParents.innerHTML = 'number of parents = ' + parents.length;
document.body.appendChild(numberOfParents);