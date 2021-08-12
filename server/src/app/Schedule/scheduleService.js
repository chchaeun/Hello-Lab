// const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/db");
// const secret_config = require("../../../config/secret");
const scheduleProvider = require("./scheduleProvider");
const scheduleDao = require("./scheduleDao");
 const baseResponse = require("../../../config/baseResponseStatus");
 const {response} = require("../../../config/response");
 const {errResponse} = require("../../../config/response");

// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
const {connect} = require("http2");

exports.createSchedule = async function (date, content, labIdx) {
    //try {
        const insertScheduleParams = [date, content, labIdx];
        const connection = await pool.getConnection(async(conn) => conn);
        const scheduleResult = await scheduleDao.createSchedule(connection, insertScheduleParams);
        console.log(`추가된 내용 : ${scheduleResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    //}   //catch(console.error();)
};