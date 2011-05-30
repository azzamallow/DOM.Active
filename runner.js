var aaron = Student.create({ name: 'aaron', subject: 'mathematics', identification: 4});
aaron.save();
aaron.subject = 'english';
aaron.save();

var aaronAgain = Student.findByName('aaron');
aaronAgain.subject = 'physics';
aaronAgain.identification = '55';
aaronAgain.save();

DOM.Actives = [];

var aaronFoundAndNew = Student.findByName('aaron');

areEqual = document.createElement('div');
areEqual.innerHTML = 'are equal = ' + (aaronAgain == aaron);
document.body.appendChild(areEqual);

var luke = Student.create({ name: 'luke', subject: 'java', identification: 5});
luke.save();
luke.subject = 'perl';
luke.save();

var special = document.createElement('div');
special.className = 'special_students';
document.body.appendChild(special);
var mum = Student.create({ name: 'mum', subject: 'parent', identification: 6});
mum.save(special);

var dad = Student.create({ name: 'dad', subject: 'parent', identification: 7});
dad.save();

var parents = Student.findBySubject('parent');
numberOfParents = document.createElement('div');
numberOfParents.innerHTML = 'number of parents = ' + parents.length;
document.body.appendChild(numberOfParents);