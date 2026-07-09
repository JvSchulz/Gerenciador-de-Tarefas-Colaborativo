import User from '../models/userModel.js';
import { setCurrentUserId } from './currentUser.js';

const DEFAULT_USER_NAME = 'Default User';
const DEFAULT_USER_EMAIL = 'default@example.com';

async function ensureDefaultUser() {
  const users = await User.find().sort({ createdAt: 1 }).limit(1);

  if (users.length > 0) {
    setCurrentUserId(users[0]._id.toString());

    return users[0];
  }

  const user = await User.create({
    name: DEFAULT_USER_NAME,
    email: DEFAULT_USER_EMAIL,
  });

  setCurrentUserId(user._id.toString());

  return user;
}

export { ensureDefaultUser };
