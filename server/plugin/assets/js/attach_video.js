;(function($) {
    $(".vc_attach_video > button").click(function(e) {
      e.preventDefault();
      var file_frame, attachment;
      var button = $(this);
      var input = button.siblings("input[type='text']");

      if(file_frame) {
        file_frame.open();
        return;
      }

      file_frame = new wp.media.view.MediaFrame.Select({
        title: button.data("uploader-title"),
        multiple: false,
        library: {
          order: "ASC",
          orderby: "title",
          type: "video/mp4",
          search: null,
          uploadedTo: null,
        }
      });

      file_frame.on("select", function() {
        attachment = file_frame.state().get("selection").first().toJSON();
        input.val(attachment.url);
      });

      file_frame.open();
    });
})(jQuery);
