
const key = process.env.KEY;

exports.validate = async (socket, next) => {
    const clientKey = socket.handshake.auth.token;
    if (key === clientKey) return next();
    console.log("Wrong key");
    next(new Error("Wrong key"));
}