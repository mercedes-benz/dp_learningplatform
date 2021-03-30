<?php
extract(shortcode_atts([
  "style" => "cyan",
  "headline" => "",
  "background_image" => false,
], $atts));

$background_image_src = wp_get_attachment_image_url($background_image, "large");
?>
<div class="image_text color-<?php echo $style; ?> content_element">
  <div class="image_text__content">
    <div class="row">
      <div class="headline_holder col col-12">
        <h3 class="image_text__headline"><?php echo $headline; ?></h3>
      </div>
      <div class="image_holder col col-12 col-sm-6">
        <div class="img" <?php if($background_image) { echo " style=\"background-image: url({$background_image_src});\""; } ?>>
          <img src="<?= $background_image_src ?>" />
        </div>
      </div>
      <div class="content_holder col col-12 col-sm-6">
        <?php echo do_shortcode($content); ?>
      </div>
    </div>
  </div>
</div>
