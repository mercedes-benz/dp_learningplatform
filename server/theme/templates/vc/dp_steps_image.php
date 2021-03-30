<?php
extract(shortcode_atts([
  "style" => "cyan",
  "text_row" => "",
], $atts));

$text_row = vc_param_group_parse_atts($text_row);
?>
<div class="image_text color-<?php echo $style; ?> content_element">
  <div class="image_text__content">
    <?php foreach($text_row as $index => $i): ?>
    <?php $background_image_src = wp_get_attachment_image_url($i["background_image"], "large"); ?>
    <div class="row">
      <div class="headline_holder col col-12">
        <h3 class="image_text__headline"><?php echo $i['headline']; ?></h3>
      </div>
      <div class="image_holder col col-12 col-sm-6">
        <div class="img" style="background-image: url(<?= $background_image_src ?>);">
          <img src="<?= $background_image_src ?>" />
        </div>
      </div>
      <div class="content_holder col col-12 col-sm-6">
        <?php echo do_shortcode($i['content']); ?>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
</div>
