import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    BelongsToMany,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import User from '../user/User';
import UserMeeting from '../joins/UserMeeting';

@Table({
    tableName: 'meetings',
    timestamps: false,
})
export default class Meeting extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    override id!: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    authorId!: string;

    @BelongsTo(() => User)
    author!: User;

    @AllowNull(false)
    @Column(DataType.STRING)
    title!: string;

    @Column(DataType.STRING)
    description!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    startAt!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    endAt!: string;

    @BelongsToMany(() => User, () => UserMeeting)
    participants!: User[];
}
