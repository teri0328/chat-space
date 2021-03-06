$(function(){
    function buildHTML(message){
      if ( message.image ) {
        var html =
          `<div class="message" data-message-id=${message.id}>
            <div class="upper-message">
              <div class="upper-message__user-name">
                ${message.user_name}
              </div>
              <div class="upper-message__date">
                ${message.date}
              </div>
            </div>
          <div class="lower-message">
            <p class="lower-message__content">
            ${message.content}
            </p>
            <img src="${message.image}">
            </div>
          </div>`
        return html;
      } else {
        var html =
          `<div class="message" data-message-id=${message.id}>
            <div class="upper-message">
              <div class="upper-message__user-name">
                ${message.user_name}
              </div>
              <div class="upper-message__date">
                ${message.date}
              </div>
            </div>
          <div class="lower-message">
            <p class="lower-message__content">
              ${message.content}
            </p>
            </div>
          </div>`
        return html;
      };
    }
  $('#new_message').on('submit', function(e) {
    e.preventDefault();    
    var formData = new FormData(this);
    var url = $(this).attr('action');
    var last_message_id = $('.message:last').data("message-id")
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      $('form')[0].reset();
    })
    .always(() => {
      $(".form__submit").removeAttr("disabled");
    })
    .fail(function(){
      $('.form__submit').prop('disabled', false);
      alert("メッセージ送信に失敗しました");
    });
  });
  var reloadMessages = function() {
    var last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  }
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});