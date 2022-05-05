
const token = process.env.TOKEN;

exports.validate = async (socket, next) => {
    const clientToken = socket.handshake.auth.token;
    if (token === clientToken) return next();
    console.log("Wrong token");
    next(new Error("Wrong token"));
}