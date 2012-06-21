
var Class = new ClassMaster ();

var postMessage = function (message)
{
    var div = document.createElement ('div');
    div.innerHTML = message;
    document.body.appendChild (div);
};

var Human = Class.extend ({
    protected :
    {
        name : '',
        age  : 0,
        sex  : '?', // '?' | 'm' | 'f'
        
        getPresentationText : function ()
        {
            return 'My name is ' + this.name + ', I am ' + this.age + ' yo';
        }
    },
    public :
    {
        __construct : function (name, age, sex)
        {
            this.name = name.toString();
            this.age  = parseInt(age);
            if (sex === 'm' || sex === 'f')
            {
                this.sex = sex;
            }
        },
        
        presentOneself : function ()
        {
            postMessage (this.getPresentationText() + '.');
        }
    }
});

var Peasant = Human.extend ({
    private :
    {
        village : false
    },
    protected :
    {
        getPresentationText : function ()
        {
            var presentationArray = [this.parent.getPresentationText()];
            
            var sex = false;
            if (this.sex === 'm')
            {
                sex = 'I am male';
            }
            else if (this.sex === 'f')
            {
                sex = 'I am female';
            }
            if (sex)
            {
                presentationArray.push (sex);
            }
            
            if (this.village)
            {
                presentationArray.push ('I live in ' + this.village);
            }
            
            return presentationArray.join (', ');
        }
    },
    public :
    {
        __construct : function (name, age, sex, village)
        {
            this.parent.__construct (name, age, sex);
            if (village)
            {
                this.village = village;
            }
        }
    }
});

