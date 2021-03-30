!function ($) {

  var _custom_media = true,
    _orig_send_attachment = wp.media.editor.send.attachment

  $('#vc_ui-panel-edit-element .file-picker-button').click(function (e) {
    var send_attachment_bkp = wp.media.editor.send.attachment,
      file_picker_button = $(this),
      file_remover_button = $(this).parent().find('.file-remover-button'),
      input = $(this).parent().find('.file_picker_field'),
      display = $(this).parent().find('.file_picker_display');

    _custom_media = true;
    wp.media.editor.send.attachment = function (props, attachment) {
      if (_custom_media) {
        display.html(attachment.url);
        input.val(attachment.id);
        file_picker_button.addClass('hidden');
        file_remover_button.removeClass('hidden');
      } else {
        return _orig_send_attachment.apply(this, [props, attachment]);
      };
    }

    wp.media.editor.open(file_picker_button);
    return false;
  });

  $('#vc_ui-panel-edit-element .file-remover-button').click(function (e) {
    var file_picker_button = $(this).parent().find('.file-picker-button'),
      file_remover_button = $(this),
      input = $(this).parent().find('.file_picker_field'),
      display = $(this).parent().find('.file_picker_display');

    display.html('');
    input.val('');
    file_picker_button.removeClass('hidden');
    file_remover_button.addClass('hidden');
  });

  $('.add_media').on('click', function () {
    _custom_media = false;
  });

}(window.jQuery);