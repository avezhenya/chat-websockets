$(document).ready(function() {
    if (!window.console) window.console = {};
    if (!window.console.log) window.console.log = function() {};

    $("#messageform").live("submit", function() {
        newMessage($(this));
        return false;
    });
    $("#messageform").live("keypress", function(e) {
        if (e.keyCode == 13) {
            newMessage($(this));
            return false;
        }
    });
    $("#message").select();
    updater.start();
});

function newMessage(form) {
    var message = form.formToDict();
    // Отправляет сообщение серверу функция socket.send()
    updater.socket.send(JSON.stringify(message));
    form.find("input[type=text]").val("").select();
}

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/chatsocket";
        console.log(url);
        updater.socket = new WebSocket(url);
        // Ждет сообщение от сервера socket.onmessage()
        updater.socket.onmessage = function(event) {
            updater.showMessage(JSON.parse(event.data))
        }
    },

    showMessage: function(message) {
        var existing = $("#m" + message.id);
        if (existing.length > 0) return;
        var node = $(message.html);
        node.hide();
        $('#inbox').append(node);
        node.slideDown();
    }

};

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {};
    for (var i = 0; i < fields.length; i++) {
        json[fields[i].name] = fields[i].value;
    }
    if (json.next) delete json.next;
    console.log(json);
    return json;

};
