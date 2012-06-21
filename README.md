ClassMaster
===========

Introduces class-based OOP into Javasacript. Unlike many other solutions
(including but not restricted to John Resig's
[Simple Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/))
allows you to define private and protected properties.

Sample code to get the feel of ClassMaster (you can try it at test/html/Something.html):

    // Define your own keywords:
    var BaseClass = new ClassMaster ({
        parentKeyword       : '__uber',
        constructorKeyword  : '__new',
        abstractKeyword     : '__abstract'
    });

    // Inherit from BaseClass to create a class.
    var Thing = BaseClass.extend ({
        private :
        {
            name : '' // A private field with a default value.
        },
        protected :
        {
            getView : function getView ()
            {
                // this.name will refer to the 'name' property of private collection.
                return this.name;
            }
        },
        public :
        {
            // The constructor will be called by constructorKeyword passed to ClassMaster.
            __new : function __new (name)
            {
                this.name = name;
            },
            
            // Abstract things cannot exist. Show this by adding an 'abstract method' to the prototype.
            // Again, it is named after abstractKeyword defined above.
            exist : BaseClass.__abstract
        }
    });

    // Inherit from Thing to create more classes.
    var Something = Thing.extend ({
        private :
        {
            type : ''
        },
        protected : 
        {
            // Redefine an inherited method.
            getView : function getView ()
            {
                // Call parent method using parentKeyword defined in the beginning.
                var view = this.__uber.getView();
                return '(' + this.type + ') ' + view;
            }
        },
        public :
        {
            __new : function __new (type, name)
            {
                this.__uber.__new (name);
                this.type = type;
            },
            
            // Redefine abstract method to become a non-abstract class.
            exist : function exist ()
            {
                alert ('I am ' + this.getView() + ' thus I do exist!');
            }
        }
    });

    // Run it!
    var something = new Something ('building', 'Empire State');
    something.exist();
