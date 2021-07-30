const moment = require('moment')

let formatMessage = (username, text) =>{
   return({
      username,
      text,
      time: moment().format('h:mm a')
   })
}

module.exports = formatMessage