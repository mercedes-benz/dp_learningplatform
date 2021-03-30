<?php
extract(shortcode_atts([
  "video_src" => false,
  "poster" => false,
  "mejs_player" => ""
], $atts));
?>

<div class="video content_element">
  <?php if(!$video_src): ?>
  <p><?php _e("No video specified.", "dp"); ?></p>
  <?php else: ?>
    <?php if($mejs_player == "true"): ?>
      <video controls="controls" class="mejs__player" <?php echo $poster ? 'poster="' . wp_get_attachment_image_url($poster, "full") . '"' : ''; ?> src="<?php echo $video_src; ?>" type="video/mp4"></video>
    <?php else: ?>
      <div class="video_container">
        <video controls="controls" name="media">
            <source src="<?php echo $video_src; ?>" type="video/mp4"></source>
        </video>
      </div>
    <?php endif; ?>
  <?php endif; ?>
</div>
