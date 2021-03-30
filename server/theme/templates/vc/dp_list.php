<?php
extract(shortcode_atts([
  "style" => "nobg",
  "icon" => "dot",
  "headline" => "",
  "text_col_1" => "",
  "text_col_2" => "",
], $atts));

$text_col_1 = vc_param_group_parse_atts($text_col_1);
$text_col_2 = vc_param_group_parse_atts($text_col_2);
?>
<div class="list list--<?php echo $style; ?>">
  <div class="list__wrapper list__cols">
    <h3 class="list__headline"><?php echo $headline; ?></h3>
    <ul class="list__col list__col--one">
      <?php foreach($text_col_1 as $i): ?>
      <li><i class="icon-<?php echo $icon; ?>"></i><span><?php echo $i["text_col_1_item"]; ?></span></li>
      <?php endforeach; ?>
    </ul>
    <ul class="list__col list__col--two">
      <?php foreach($text_col_2 as $i): ?>
      <li><i class="icon-<?php echo $icon; ?>"></i><span><?php echo $i["text_col_2_item"]; ?></span></li>
      <?php endforeach; ?>
    </ul>
  </div>
</div>
