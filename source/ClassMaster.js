
/**
 * Base class constructor.
 *
 * When called optionally with a keywords collection,
 * will return an extensible base class with no default methods.
 *
 * Base class (as well as any of its descendants) can be extended
 * with .extend() method which takes a Prototype object as its
 * only argument and returns a constuctor.
 *
 * Prototype is a collection of any methods and fields.
 * Public prototype is not allowed to have fields, but methods.
 * 
 *  interface Keywords
 *  {
 *      string parentKeyword;
 *      string constructorKeyword;
 *      string abstractKeyword;
 *  }
 *
 *  interface PrototypeCollection
 *  {
 *      Prototype private;
 *      Prototype protected;
 *      Prototype public;
 *  }
 *
 *  interface Class
 *  {
 *      Class (your arguments here);
 *      
 *      Class extend (PrototypeCollection);
 *  }
 *
 *  @param  {Keywords}  Keywords collection, see below.
 *  @return {Class}     Extensible abstract base class with no default methods.
 *
**/
var ClassMaster = (function ()
{
    var makeBaseClass = function makeBaseClass (keywords)
    {
        var parentKeyword       = keywords.parentKeyword;
        var constructorKeyword  = keywords.constructorKeyword;
        var abstractKeyword     = keywords.abstractKeyword;
        
        // Cloning is creating an object, that uses the original one as prototype,
        // i.e. it looks up a property there if it doesn't own one itself.
        var clone = (function()
        {
            // Thanks to oranlooney.com for this simple solution.
            var Clone = function () {};
            return function clone (value)
            {
                if (typeof value === 'object')
                {
                    Clone.prototype = value;
                    return new Clone;
                }
                return value;
            };
        })();
        
        var copy = function copy (value)
        {
            if (! value || typeof value !== 'object')
            {
                return value;
            }
            var result = clone (value);
            for (var property in value)
            {
                if (! value.hasOwnProperty (property))
                {
                    continue;
                }
                result[property] = copy (value[property]);
            }
            return result;
        };
        
        var abstractMethod = function abstractMethod ()
        {
            throw new Error ('Abstract method cannot be called');
        };
        
        var createClass = function createClass (privatePrototype, protectedPrototype, publicPrototype, parentPrototype)
        {
            // Thanks to John Resig for this little trick allowing prototype chaining.
            var initializing = false;
            
            // Instance creator.
            var Class = function Class ()
            {
                if (! this instanceof Class)
                {
                    // Did some one forget to put the 'new' keyword?
                    // I'd like to make it up somehow but it doesn't seem to be possible.
                    throw new Error ('Class is called without "new" keyword.');
                }
                
                if (initializing)
                {
                    // Called solely for the sake of prototype chaining.
                    return;
                }
                
                var privateCollection = {};
                
                var addProperty = function (value)
                {
                    if (typeof value === 'function')
                    {
                        var bound = function ()
                        {
                            return value.apply (privateCollection, Array.prototype.slice.apply (arguments));
                        };
                        // Make bound method self-explanatory.
                        var toString = value.toString();
                        bound.toString = function ()
                        {
                            return toString;
                        };
                        return bound;
                    }
                    return clone (value);
                };
                
                // Add parent prototype to private collection.
                if (parentPrototype)
                {
                    for (var property in parentPrototype)
                    {
                        if (! parentPrototype.hasOwnProperty (property))
                        {
                            continue;
                        }
                        privateCollection[property] = addProperty (parentPrototype[property]);
                    }
                }
                
                // Add private prototype to private collection.
                for (var property in privatePrototype)
                {
                    if (! privatePrototype.hasOwnProperty (property))
                    {
                        continue;
                    }
                    privateCollection[property] = addProperty (privatePrototype[property]);
                }
                
                // Add protected prototype to private collection.
                for (var property in protectedPrototype)
                {
                    if (! protectedPrototype.hasOwnProperty (property))
                    {
                        continue;
                    }
                    privateCollection[property] = addProperty (protectedPrototype[property]);
                }
                
                // Add parent prototype to privateCollection[parentKeyword].
                if (parentPrototype)
                {
                    var parentCollection = {};
                    for (var property in parentPrototype)
                    {
                        if (! parentPrototype.hasOwnProperty (property))
                        {
                            continue;
                        }
                        parentCollection[property] = addProperty (parentPrototype[property]);
                    }
                    privateCollection[parentKeyword] = parentCollection;
                }
                
                // Add public prototype to both private collection and public collection.
                for (var property in publicPrototype)
                {
                    if (! publicPrototype.hasOwnProperty (property))
                    {
                        continue;
                    }
                    this[property] = privateCollection[property] =
                        addProperty (publicPrototype[property]);
                }
                
                // Check for abstract methods.
                for (var property in privateCollection)
                {
                    if (privateCollection[property] === abstractMethod)
                    {
                        throw new Error ('Class contains abstract method "' + property + '" and cannot be instantiated');
                    }
                }
                
                // Call custom constructor method, if present.
                if (this[constructorKeyword])
                {
                    // Constructor is already bound to privateCollection, thus it doesn't matter what context to apply it to.
                    this[constructorKeyword].apply ({}, arguments);
                }
            };
            
            // Class extender.
            Class.extend = function extend (prototypes)
            {
                if (! prototypes)
                {
                    prototypes = {};
                }
                // Prevent properties from later changes by user script.
                var extendPrivatePrototype   = copy (prototypes.private)   || {};
                var extendProtectedPrototype = copy (prototypes.protected) || {};
                var extendPublicPrototype    = copy (prototypes.public)    || {};
                
                var mergedProtectedPrototype = {};
                var mergedPublicPrototype    = {};
                var parentCollection         = {}
                
                // protected = parent protected + extend protected
                for (var property in protectedPrototype)
                {
                    if (! protectedPrototype.hasOwnProperty (property))
                    {
                        continue;
                    }
                    mergedProtectedPrototype[property] = protectedPrototype[property];
                    parentCollection[property] = protectedPrototype[property];
                }
                for (var property in extendProtectedPrototype)
                {
                    if (! extendProtectedPrototype.hasOwnProperty (property))
                    {
                        continue;
                    }
                    mergedProtectedPrototype[property] = extendProtectedPrototype[property];
                }
                
                // public = parent public + extend public
                for (var property in publicPrototype)
                {
                    if (! publicPrototype.hasOwnProperty (property))
                    {
                        continue;
                    }
                    mergedPublicPrototype[property] = publicPrototype[property];
                    parentCollection[property] = publicPrototype[property];
                }
                for (var property in extendPublicPrototype)
                {
                    if (! extendPublicPrototype.hasOwnProperty (property))
                    {
                        continue;
                    }
                    if (typeof extendPublicPrototype[property] !== 'function')
                    {
                        throw new Error ('Only methods are allowed in public prototype');
                    }
                    mergedPublicPrototype[property] = extendPublicPrototype[property];
                }
                
                var childClass = createClass (
                    extendPrivatePrototype,
                    mergedProtectedPrototype,
                    mergedPublicPrototype,
                    parentCollection
                );
                
                // Enable prototype chaining.
                initializing = true;
                childClass.prototype = new Class;
                initializing = false;
                
                return childClass;
            };
            
            return Class;
        };

        // Base Class cannot be instantiated.
        var dummyPublicPrototype = {};
        dummyPublicPrototype[constructorKeyword] = abstractMethod;
        var BaseClass = createClass ({}, {}, dummyPublicPrototype);
        BaseClass[abstractKeyword] = abstractMethod;
        
        return BaseClass;
    };
    
    return function ClassMaster (newKeywords)
    {
        if (! this instanceof ClassMaster)
        {
            return new ClassMaster (newKeywords);
        }
        
        if (! newKeywords)
        {
            newKeywords = {};
        }
        
        // PHP style keywords.
        // John Resig style keywords would be '_super' and 'init' respectively.
        var parentKeyword       = newKeywords.parentKeyword      || 'parent';
        var constructorKeyword  = newKeywords.constructorKeyword || '__construct';
        var abstractKeyword     = newKeywords.abstractKeyword    || 'abstract';
        
        return makeBaseClass ({
            parentKeyword       : parentKeyword,
            constructorKeyword  : constructorKeyword,
            abstractKeyword     : abstractKeyword
        });
    };
})();


