const User = require('../src/models/User');
const bcrypt = require("bcrypt");


describe('User model validation', () => {
  it('Email should be unique', () => {
    const user = new User({ 
        firstName: 'Alice', 
        email: 'alice@example.com', 
        passwordHash: 'secret123' });
    
        const error = user.validateSync();

    expect(error).toBeUndefined();
    expect(user.schema.paths.email.options.unique).toBe(true);
  });

  it('Password should NOT be plain text', async () => {
    const plainPassword = 'mypassword123';
    const hash = await bcrypt.hash(plainPassword, 10);

    const user = new User({
        firstName: 'Alice',
        email: 'alice@example.com',
        passwordHash: hash });

    const error = user.validateSync();

    expect(error).toBeUndefined();
    expect(user.passwordHash).not.toBe(plainPassword);
  });

  it('Updating password should produce new hash', () => {
    const user = new User({
        firstName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'oldpassword' });
    const originalHash = user.passwordHash;
    user.passwordHash = 'newpassword';

    const error = user.validateSync();

    expect(error).toBeUndefined();
    expect(user.passwordHash).not.toBe(originalHash);
  });

  it('Updating users name should not change the stored password hash', () => {
    const user = new User({ 
        firstName: 'Alice', 
        email: 'alice@example.com', 
        passwordHash: 'hashed_value' });
    const originalPassword = user.passwordHash;
    user.firstName = 'Alice Updated';
    const error = user.validateSync();

    expect(error).toBeUndefined();
    expect(user.passwordHash).toBe(originalPassword);
  });
});
