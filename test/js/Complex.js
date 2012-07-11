
var Class = ClassMaster({ constructorKeyword : 'new' });

var Complex = (function()
{
    var self = Class.extend({
        private : {
            r    : 0,
            i    : 0,
            _abs : NaN
        },
        public : {
            // IE не любит new без кавычек.
            'new' : function (r, i)
            {
                this.r = r;
                this.i = i;
            },
            add : function (r, i)
            {
                return new self (this.r + r, this.i + i);
            },
            sub : function (r, i)
            {
                return new self (this.r - r, this.i - i);
            },
            mult : function (r, i)
            {
                return new self (this.r * r - this.i * i, this.r * i + r * this.i);
            },
            abs : function ()
            {
                if (isNan(this._abs))
                {
                    this._abs = Math.sqrt (this.r * this.r + this.i * this.i);
                }
                return this._abs;
            }
        }
    });
    
    return self;
})();

var postMessage = function (message)
{
    var div = document.createElement ('div');
    div.innerHTML = message;
    document.body.appendChild (div);
};

// tessst //

var testLimits = [1000, 2000, 3000, 4000];
var registry = [];

var startTotal = new Date;

for (var n = 0; n < testLimits.length; ++n)
{
    var startTest = new Date;
    
    for (var k = 0; k < testLimits[n]; ++k)
    {
        if (registry.length > 0)
        {
            var last = registry[registry.length - 1];
        }
        else
        {
            var last = new Complex (Math.random() * 2 - 1, Math.random() * 2 - 1);
        }
        if (registry.length > 1)
        {
            var penult = registry[registry.length - 2];
        }
        else
        {
            var penult = new Complex (Math.random() * 2 - 1, Math.random() * 2 - 1);
        }
        if (registry.length > 2)
        {
            var antepen = registry[registry.length - 3];
        }
        else
        {
            var antepen = new Complex (Math.random() * 2 - 1, Math.random() * 2 - 1);
        }
        
        var kComplex = new Complex (k, 0);
        var calculate = kComplex .add (last) .mult (penult) .sub (antepen);
        registry.push (calculate);
    }
    
    var endTest = new Date;
    var diff = endTest.getTime() - startTest.getTime();
    
    postMessage ('Test #' + n + ' on ' + k + ' elements, ' + diff + ' ms');
}

var endTotal = new Date;
var diff = endTotal.getTime() - startTotal.getTime();

postMessage (testLimits.length + ' tests, total ' + registry.length + ' elements, ' + diff + ' ms');

