import logger from 'pino'
import dayjs from 'dayjs'
//logger for the server using pino
const log = logger({
    transport: {
    target: 'pino-pretty'
    },
    base:{
        pid: false
    }
})

export default log