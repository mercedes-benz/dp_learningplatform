<?php
extract(shortcode_atts([
  "style" => "cyan",
  "headline" => "",
], $atts));

?>
<div class="quote quote--<?php echo $style; ?>">
  <div class="quote__wrapper">
    <p class="quote__headline"><?php echo $headline; ?></p>
  </div>
</div>
