---
layout: post
title: JavaScript is Weird
description: >
  My summary about truthy/falsy values, logical operators, scope and objects
---

Since its [humble beginnings at NetScape in 1995][jsHistory], JavaScript's popularity has grown significantly beyond its initial goal of making web pages more dynamic. ECMAScript (ES), the standard for JavaScript (JS), has also undergone several evolutions too. Despite these developments however, many of the oddities from the early version of JS have lingered and become characteristic of the language.

Recently, I've delved back into JS and during the ["JavaScript - The not so weird (anymore) parts"][jsWeird] talk at [Conf & Coffee 2018][confAndCoffee] I was reminded of some of the odd aspects of JS that I've fallen prey to. For new players, this can be frustrating, especially when the language itself is tripping you up rather than the problem you're trying to solve. For me, coming from a C/C++ background, truthy/falsy values, logical operators, scope and objects particularly had me confused.

## Truthy and Falsy Values
A truthy value is any value which is considered to be true inside a Boolean context (in an if statement, for example). The opposite to truthy is falsy, which is any value that is false inside a Boolean context. The tricky part of truthy and falsy values in JS is often trying to understand and remember the implicit type conversion (known as type coercion) performed on non-Boolean values in a Boolean context. A useful way to to avoid confusing yourself is to remember that the following are all the falsy values in JS:
~~~js
false
0
null
undefined
''
""
NaN
~~~

Therefore, anything else must be truthy. Some examples of truthy values include:
~~~js
true
"true"
"false"
"1"
"0"
"-1"
1
-1
1.62
-1.62
Infinity
-Infinity
{}
[]
function(){}
new Date()
~~~

## Logical Operators
With logical operators, we're faced with an additional level of logical complexity around datatypes which isn't necessarily consistent with what we expect. This is regardless of the truthy/falsy nature of values just discussed. For instance,

~~~js
// These seem consistent...
false == 0   // true
false == ""  // true
0 == ""      // true

// These are not so consistent...
false == null       // false
false == undefined  // false
null == undefined   // true

// This is common in other languages too, but easily be confused...
false == NaN  // false
NaN == NaN    // false

// Interesting behaviour around [], {} and strings...
false == []    // true
false == [0]   // true
false == [[]]  // true
false == {}    // false
[] == {}       // false
false == "0"      // true
false == "false"  // false
~~~

For a more comprehensive table of equality, go [here][jsEqualityTable].

As a solution to help avoid the confusing variability shown, you could use the '!!' unary operator to force a value to become true or false. '!!' essential would allow the Boolean expressions as a whole to become more consistent with the truthy/falsy behaviour discussed before:

~~~js
false == !!null       // true
false == !!undefined  // true
false == !!NaN        // true
false == !![]         // false
false == !!"0"        // false
~~~

However, an even better solution is to check equality in type too. Thus, I recommend you always use strict equality operators ('===' or '!==') in comparing values. Doing so will help defend against the errors that can result due to the dynamic typing nature of JS; accidental reassignment of a variable from one type to another, for instance. Being verbose with the triple operators will also help you ensure you understand what you are writing, and make the lives of those who have to manage your code a little more straight forward.

As a final side note, there are seven datatypes in JS. Six of which are primitives:
* Boolean
* Null
* Undefined
* Number
* String
* Symbol (introduced in ECMAScript 6)

with the seventh data type being Object. If you're wondering what is the difference between Null and Undefined, I suggest you visit [StackOverflow][nullVsUndefined] to find out.

## Scope
When coming from languages like C, we are used to variables declared inside a set of curly brackets to only exist within the curly brackets. In other words, variables are bound to a scope. In JS, this can become blurry when you use 'var' keyword:
~~~js
for(var i = 0; i < 10; i++) {}
console.log(i); // 10

if(true) {
    var i = 20;
    var i = 30;
}
console.log(i); // 30
~~~

Likewise, and somewhat insidiously, without any keyword in the declaration, a variable becomes global:
~~~js
function globalisation() {
    var local = 3.14;
    global = 'global';
}
~~~
Although, this is assuming [strict mode][strictMode] isn't enabled, which can save you from a lot of pain as a beginner to JS.

As a result, generally it's best to get into the habit of using 'let' or 'const' to bind variables uniquely to a scope. To be specific, 'let' means variables can be declared only once in a block (curly brackets) and reassigned values as many times as you wish:
~~~js
for(let i = 0; i < 10; i++) {}
console.log(i); // ReferenceError: i is not defined

if(true) {
    let i = 20;
    i = 10;
    console.log(i); // 10
    let i = 30; // SyntaxError: Identifier 'i' has already been declared
}
~~~

By contrast, 'const' is similar to 'let' without the reassignment property:
~~~js
if(true) {
    const i = 20;
    i = 10; // TypeError: Assignment to constant variable
    const i = 30; // SyntaxError: Identifier 'i' has already been declared
}

console.log(i); // ReferenceError: i is not defined
~~~

So, always use 'let' and 'const'!

## Objects

There are many interesting and tricky things around objects in JS. The first big realisation for a beginner is perhaps that JS is a [Prototype-based language][prototypical]. For me, the second was that you can add variables to objects after they are declared!

~~~js
var name = 'Mavi';
var breed = 'Birman'

var cat = {
    name: name,
    breed: breed,
    meow: function() {
        return "Meow! I'm " + this.name + " and I'm a " + this.breed + " cat.";
    }
}

cat['eyeColor'] = 'blue';
~~~

This is obviously quite dangerous in the event the developer makes a false assumption about the existence of an object property or simply has a typo. To remedy this, it's a good idea to use:

~~~js
const wellBehavedCat = Object.freeze(cat);
~~~

Bare in mind, adding a property to a frozen object will only throw an error in strict mode. But in any case, you will now prevent yourself from accidentally mutilating your cat with new properties.

## More?
There are plenty more interesting ideas that I've first stumbled into in JS like hoisting, closures, destructering and the numerous ways to create objects. Most of these have become 'standard knowledge' now, but are never-the-less things you will inevitably need to come to grips with; I'll leave those topics to the interested reader to investigate for themselves.

<!-- Links -->
[confAndCoffee]: 2018-04-21-conf-and-coffee-2018.md
[jsHistory]: https://en.wikipedia.org/wiki/JavaScript#History
[jsWeird]: https://github.com/daffl/not-so-weird-js
[jsEqualityTable]: https://dorey.github.io/JavaScript-Equality-Table/
[strictMode]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
[freeze]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
[nullVsUndefined]: https://stackoverflow.com/a/5076962/1218723
[prototypical]: https://en.wikipedia.org/wiki/Prototype-based_programming
