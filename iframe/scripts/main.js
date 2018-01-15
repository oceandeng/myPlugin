(function(G){
    var isReady = false;
    var host = new xdm.Rpc({
        acl: ['*'],
        onReady: function() {
            isReady = true;
        }
    }, {
        remote: {
            goRouterInHost: {}
        },
        local: {
            methodInWidget: function(data) {
                return data;
            }
        }
    });

    G.isReady = isReady
    G.iframeHost = host
})(window)
