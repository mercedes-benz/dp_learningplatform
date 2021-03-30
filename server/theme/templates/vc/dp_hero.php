<?php
extract(shortcode_atts([
  "headline" => "",
  "background_image" => false,
  "button" => "",
  "button_text" => "",
], $atts));

$background_image_src = wp_get_attachment_image_url($background_image, "large");
?>
<div class="hero">
  <div class="hero__wrapper" <?php if($background_image) { echo " style=\"background-image: url({$background_image_src});\""; } ?>>
    <h1 class="hero__headline"><?php echo $headline; ?></h1>
    <div class="hero__content">
      <?php echo do_shortcode($content); ?>
    </div>
    <?php if($background_image_src): ?>
      <div class="image_holder">
        <img src="<?= $background_image_src ?>" />
      </div>
    <?php endif; ?>
    <?php if($button_text): ?>
      <div class="hero__button">
        <?php echo do_shortcode("[dp_button link='{$button}' alignment='center' style='purple' text='{$button_text}' /]"); ?>
      </div>
    <?php endif; ?>
  </div>
</div>
