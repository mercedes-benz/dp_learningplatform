<?php
extract(shortcode_atts([
  "style" => "tip",
  "icon" => "tip",
  "headline" => "",
], $atts));
?>
<div class="alert alert--<?php echo $style; ?>">
  <div class="alert__icon"><i class="icon-<?php echo $icon; ?>"></i></div>
  <div class="alert__content-wrapper">
    <h3 class="alert__headline"><?php echo $headline; ?></h3>
    <div class="alert__content"><?php echo $content; ?></div>
  </div>
</div>
