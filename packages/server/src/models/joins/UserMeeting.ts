import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
} from 'sequelize-typescript';
import User from '../user/User';
import Meeting from '../meeting/Meeting';

@Table({
    tableName: 'user_meetings',
    timestamps: false,
})
export default class UserMeeting extends Model {
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;

    @ForeignKey(() => Meeting)
    @Column(DataType.UUID)
    meetingId!: string;
}
