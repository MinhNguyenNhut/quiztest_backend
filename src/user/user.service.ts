import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';

export const BCRYPT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).lean();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) return null;
    return { ...user, id: user._id?.toString() };
  }

  async create(email: string, password: string, role: UserRole = UserRole.OWNER, name?: string) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const created = await this.userModel.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      name,
    });
    return this.toSafeUser(created.toJSON());
  }

  async validatePassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }

  toSafeUser(user: any) {
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return { ...rest, id: rest._id?.toString() ?? rest.id };
  }
}
