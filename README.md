
# In Memory

The purpose of this package is provide an abstraction to use in-memory cache strategy with NodeJS, Typescript and Redis.




## How to install

Install @loadshark/in-memory with npm

```bash
  cd my-project

  npm i @loadshark/in-memory
```


## Features

* **startInMemory**: creating an instance of In Memory (redis is used in background)
* **useInMemory**: as hook it returns some methods to manipulate a new register in cache
  * **create**: a method that register data in the In Memory Database.
  * **get**: a method that fetch data in the In Memory Database.
  * **remove**: a method that remove data with a key as parameter.
  * **generateKey**: a method that generates a base-64 key when passed a text (string).


## Usage/Examples

In this first example we show how the **In Memory** is instantiated.
```javascript
const { startInMemory, useInMemory } = require('@loadshark/in-memory');

startInMemory({
  url: 'redis://127.0.0.1:6379'
})
```

In this example we show how you can generate a new key (that will be used to fetch data later) and create a new register in In Memory Database.
```javascript
const { create, generateKey } = useInMemory()

const key = generateKey('someText')

const user = {
    firstName: 'John',
    lastName: 'Doe'
    age: 26
}

await create(key, user)
```

Finally we'll see here how to fetch data from an already defined key and if it exists we'll delete it
```javascript
const { get, remove, generateKey } = useInMemory()

const key = generateKey('someText')

const isCached = await get(key)
  
if (isCached) {
    await remove(key)
}
```
## FAQ

#### Is it possible to use some other in-memory data structure store (other than Redis)?

For now we only support Redis as in memory database

#### How can I check the parameters of a method or the instance?

This package was released with its type declarations. 

Check the following: 
```javascript
const instance = startInMemory({
    url: 'redis://127.0.0.1:6379'
})

// its the original set method from redis that you can access directly
instance.set('someText', 'value')
```
When you type "instance." you'll see all methods from Redis instance under the sheets

