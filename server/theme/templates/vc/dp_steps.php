<?php
extract(shortcode_atts([
  "style" => "cyan",
  "icon" => "count",
  "text_col" => "",
], $atts));

$text_col = vc_param_group_parse_atts($text_col);
?>
<?php if(is_array($text_col)): ?>
<div class="step step--<?php echo $style; ?>">
  <div class="step__wrapper">
    <?php foreach($text_col as $index => $i): ?>
      <?php $count = $index + 1; ?>
      <div class="step__block">
        <?php if($icon === "star-circle"): ?>
          <i class="icon-<?php echo $icon; ?>"></i>
        <?php else: ?>
          <i class="icon-<?php echo $icon; ?>"><?php echo $count; ?></i>
        <?php endif; ?>
        <div class="step__content">
          <h3 class="step__headline"><?php echo $i["headline"]; ?></h3>
          <p><?php echo $i["text_col_item"]; ?></p>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</div>
<?php endif; ?>
