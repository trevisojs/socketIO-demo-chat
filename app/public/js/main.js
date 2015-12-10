//IIFE
(function($){

    var socket = io();
    var username;

    var $textInput = $('.usernameInput, .inputMessage'),
        $messages = $('.messages'),
        $chatPage = $('.chat'),
        $loginPage = $('.login');


    $textInput.on('keypress', function(e) {
        if(e.which === 13 ) {
            if(typeof username === "undefined") {
                //login input
                username = $(this).val();
                if(username !== "") {
                    socket.emit('add user', { username: username } );
                }
            } else {
                //chat message input
                var message = $(this).val();

                $messages.append(
                    createNewMessage(username,message)
                );

                $(this).val('');

                socket.emit('message', {message: message});
            }
        }
    });


    socket.on('login', function() {
        $loginPage.hide();
        $chatPage.show();
    })

    socket.on('message', function(data) {
        $messages.append(
            createNewMessage(data.username,data.message)
        );
    });


    function createNewMessage(username, message) {



        var $li = $('<li class="message">');
        var $user = $('<span class="username">');
        var $message = $('<span class="messageBody">');

        $user.html(clearString(username));
        $message.html(clearString(message));

        $li.append($user,$message);

        return $li;
    }

    function clearString(str) {
        return $('<div />').html(str).text();
    }

})(jQuery)
