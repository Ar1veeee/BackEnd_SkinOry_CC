/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    console.error(err.stack);  
    res.status(500).json({ message: "Terjadi kesalahan di server" });  
}

module.exports = errorHandler;