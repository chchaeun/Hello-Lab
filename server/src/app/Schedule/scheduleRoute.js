module.exports = function(app) {
    const schedule = require('./scheduleController');
    //const jwt

    //1. 스케줄 생성 API
    app.post('/app/schedules', schedule.createSchedule);

    //2. 특정 유저 스케줄 전체 조회 API
    app.get('/app/schedules/:userIdx', schedule.getSchedules);
    
    //3. 일정 삭제 API
    app.patch('/app/schedules/delete/:labIdx', schedule.updateScheduleStatus);

    //4. 일정 수정 API
    app.patch('/app/schedules/patch/:labIdx', schedule.changeSchedule);

    //5. 특정 연구실 스케줄 전체 조회 API
    app.get('/app/schedules/lab/:labIdx', schedule.getSchedulesEachLab);
}

