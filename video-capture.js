const cv = require("opencv")

module.exports = function(RED) {
    function VideoCaptureNode(config) {
        RED.nodes.createNode(this,config);
        console.log(config.source)
        var node = this;
        load = new Promise(function(resolve, reject) {
            try{
                if(!isNaN(config.source))
                    config.source = parseInt(config.source)
                cap = new cv.VideoCapture(config.source)
                cap.read(function(err, mat) {
                    if (!err)
                        resolve(cap);
                    else
                        throw err;
                })
            }catch(e){
                reject(err);
            }             
           
        })

        
        load.then(cap =>{
            node.cap = cap
            node.status({fill:"green",shape:"dot",text:"connected"});
        }).catch(function(e){
            node.status({fill:"red",shape:"ring",text:"error"});
        });

        node.on('input', function(msg) {
            if (node.cap)
                node.cap.read(function(err, mat) {
                    if (mat.size()[0] > 0 && mat.size()[1] > 0){
                         node.send({payload:mat.toBuffer()});
                    }
                })
            
        });

        this.on('close', function() {
            if (node.cap)
              this.cap.release();   
              
        });
    }
    RED.nodes.registerType("video-capture",VideoCaptureNode);
}