const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const UserInfo = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    fio: {type: DataTypes.STRING, defaultValue: null},
    skills: {type: DataTypes.STRING, defaultValue: 0},
    additional_skills: {type: DataTypes.STRING, defaultValue: null},
    questions: {type: DataTypes.STRING, defaultValue: null},
    cv: {type: DataTypes.STRING, defaultValue: null},
    projects: {type: DataTypes.STRING, defaultValue: null},
    otrabotka: {type: DataTypes.STRING, defaultValue: null},
})

module.exports = UserInfo;