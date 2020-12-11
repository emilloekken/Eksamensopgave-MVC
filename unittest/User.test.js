const { User } = require('../model/User');

test('Skulle gerne udskrive en udfyldt user model', () => {
    const text = User('Emil', 'nekkeol@gmail.com', '21', 'mand', 'kvinde', 'el251099');
    expect(text).toBe('name', 'Emil', 'email', 'nekkeol@gmail.com', 'age', '21', 'gender', 
    'mand', 'preferredgender', 'kvinde', 'password', 'el251099')
})

module.exports = {
    testEnvironment: 'node'
  };

