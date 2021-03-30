<?php
extract(shortcode_atts([
  "style" => "cyan",
  "headline" => ""
], $atts));
?>
<div class="table table_50_50 table--<?php echo $style; ?> content_element">
  <div class="table__wrapper">
    <h3 class="table__headline"><?php echo $headline; ?></h3>
    <div class="table__col">
      <?php echo do_shortcode($content); ?>
    </div>
  </div>
</div>