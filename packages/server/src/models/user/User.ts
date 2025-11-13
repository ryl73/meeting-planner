import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    BeforeCreate,
    BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'user';

export type UserAttributes = {
    id?: string; // optional because it’s auto-generated
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: UserRole;
};

@Table({
    tableName: 'users',
    timestamps: false,
})
export default class User extends Model<
    UserAttributes,
    Omit<UserAttributes, 'id'>
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    override id!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    phone!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    firstName!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    lastName!: string;

    @Column(DataType.STRING)
    avatar!: string;

    @Default('user')
    @Column(DataType.ENUM('admin', 'user'))
    role!: UserRole;

    async comparePassword(password: string) {
        return bcrypt.compare(password, this.password);
    }

    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(user: User) {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 12);
        }
    }
}
