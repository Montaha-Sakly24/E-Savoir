import {User, ROLES} from '../models/User.js';
import bcrypt from "bcrypt";

export const createAdminAccount = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const newAdmin = new User({
      firstname: 'Admin',
      lastname: '1',
      email: 'admin@gmail.com',
      password: hashedPassword,
      address:'Monastir',
      education: 'mch qari',
      work: 'admin',
      numericId: '0',
      role: ROLES.ADMIN,
    });

    await newAdmin.save();
    console.log('Admin account created');
  } catch (error) {
    console.error(error.message);
  }
};