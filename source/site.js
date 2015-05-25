(function(window, Materialize){
    'use strict';

    if(Materialize) {
        window.onerror = function onError(errorMsg, url, line, column, errorObj) {
            var message = [
                'Error: ' + errorMsg,
                'Script: ' + url,
                'Line: ' + line + ', Column: ' + column,
                'StackTrace: ' +  errorObj.stack
            ].join('\n');
            Materialize.toast(message.substring(0, 100), 4000);
            return false;
        };
    }

})(window, window.Materialize);