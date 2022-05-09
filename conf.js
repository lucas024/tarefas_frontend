require('dotenv').config({ path: './config.env' });

module.exports = {
    env: {
        API_URL : process.env.REACT_APP_API_URL
    }
}