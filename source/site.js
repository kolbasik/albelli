(function(window, Materialize){
    'use strict';

    if(Materialize) {
        window.onerror = function onError(errorMsg, url, lineNumber, column, errorObj) {
            var message = 'Error: ' + errorMsg + ' Script: ' + url
                + ' Line: ' + lineNumber + ' Column: ' + column
                + ' StackTrace: ' +  errorObj;
            Materialize.toast(message, 4000);
            return false;
        };
    }

})(window, Materialize);