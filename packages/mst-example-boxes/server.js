var webpack = require("webpack")
var WebpackDevServer = require("webpack-dev-server")
var config = require("./webpack.config")

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
}).listen(4000, "localhost", function(err, result) {
    if (err) {
        console.log(err)
    }

    console.log("\nListening at localhost:4000\n")
})

var WebSocketServer = require("ws").Server
var wss = new WebSocketServer({ port: 4001 })

var connections = {}

wss.on("connection", function connection(ws) {
    var uuid = "" + Math.random()
    connections[uuid] = ws
    ws.on("message", function incoming(message) {
        message.sender = ws.uuid
        broadcast(uuid, message)
    })
})

function broadcast(sender, message) {
    console.log("\n" + message)
    for (var key in connections)
        if (key !== sender) {
            try {
                connections[key].send(message)
            } catch (e) {
                delete connections[key]
            }
        }
}
