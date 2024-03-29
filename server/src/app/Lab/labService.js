const { pool } = require("../../../config/db");

const labDao = require("./labDao");

exports.createLab = async function (createLabEntity, professorId) {
  const con = await pool.getConnection(async (conn) => conn);
  const insertLabQuery = labDao.InsertLabInfoQuery;
  const insertUserLabQuery = labDao.insertUserLabProfessorQuery;
  try {
    await con.beginTransaction();
    const row = await con.query(insertLabQuery, createLabEntity);
    //await con.query(insertUserLabQuery);
    const userLabEntity = [professorId, row[0].insertId];
    const result = await con.query(insertUserLabQuery, userLabEntity);
    await con.commit();
    return result[0].affectedRows;
  } catch (e) {
    await con.rollback();
    console.log(`DB error\m${e}'`);
  } finally {
    con.release();
  }
};

exports.updateLab = async (updateInfo) => {
  try {
    const con = await pool.getConnection(async (conn) => conn);
    const result = await labDao.updateLabInfo(con, updateInfo);
    con.release();

    return result;
  } catch (e) {
    console.log(`DB connection Error \n ${e}`);
    return false;
  }
};

exports.deleteLab = async (labId) => {
  try {
    const con = await pool.getConnection(async (conn) => conn);
    const result = await labDao.deleteLab(con, labId);
    con.release();

    return result;
  } catch (e) {
    console.log(`DB connection Error \n ${e}`);
  }
};

exports.applyLab = async (joinLabInfo) => {
  const con = await pool.getConnection(async (conn) => conn);
  const query = labDao.applyLabRequestQuery;
  try {
    await con.beginTransaction();
    const row = await con.query(query, joinLabInfo);
    await con.commit();
    return row[0];
  } catch (e) {
    await con.rollback();
    console.log(`Service error \n${e}`);
  } finally {
    con.release();
  }
};

exports.treatApply = async (requestId, allow) => {
  const con = await pool.getConnection(async (conn) => conn);
  const insertQuery = labDao.insertStudentLabQeury;
  const getQeury = labDao.getNotieOfRequest;
  const updateQuery = labDao.updateJoinLabQuery;
  try {
    await con.beginTransaction();
    if (allow) {
      const info = await con.query(getQeury, requestId);
      const insertInfo = [info[0][0].studentId, info[0][0].labId];
      await con.query(insertQuery, insertInfo);
    }
    // ApplicationForm table의 status 가입 허용시 1로 거부시 0으로 변경됨
    const updateInfo = [allow, requestId];
    const row = await con.query(updateQuery, updateInfo);
    await con.commit();
    return row[0];
  } catch (e) {
    await con.rollback();
    console.log(`DB Error \n ${e}`);
  } finally {
    con.release();
  }
};
