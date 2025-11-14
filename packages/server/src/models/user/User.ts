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
    BelongsToMany,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import Meeting from '../meeting/Meeting';
import UserMeeting from '../joins/UserMeeting';

export type UserRole = 'admin' | 'user';

@Table({
    tableName: 'users',
    timestamps: false,
})
export default class User extends Model {
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

    @BelongsToMany(() => Meeting, () => UserMeeting)
    meetings!: Meeting[];

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
