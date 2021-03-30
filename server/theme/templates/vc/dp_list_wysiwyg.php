<?php
extract(shortcode_atts([
  "style" => "nobg",
  "icon" => "dot",
  "headline" => "",
], $atts));
?>
<div class="list list--<?php echo $style; ?> list-wysiwyg">
  <div class="list__wrapper">
    <h3 class="list__headline"><?php echo $headline; ?></h3>
    <div class="list__col ico-<?php echo $icon; ?>">
      <?php echo do_shortcode($content); ?>
    </div>
  </div>
</div>
