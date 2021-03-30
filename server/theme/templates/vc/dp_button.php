<?php
extract(shortcode_atts([
  "text" => "",
  "link" => "",
  "style" => "light",
  "size" => "small",
  "outline" => "",
  "alignment" => "inline",
  "icon" => "default",
], $atts));

$link = vc_build_link($link);

$wrapper = [
  "button",
  "button--" . $size,
  "button--" . $style,
  "button--" . $alignment
];

if($outline === "true") $wrapper[] = "button--outline";
if($icon !== "none") $wrapper[] = "button--has-icon";
?>
<div class="<?php echo join(" ", $wrapper); ?> content_element">
  <a class="button__link" href="<?php echo $link["url"]; ?>" title="<?php echo $link["title"]; ?>" target="<?php echo $link["target"]; ?>" rel="<?php if($link["target"] === " _blank"): ?>noopener noreferrer<?php endif; ?><?php if(!empty($link["rel"])): ?> nofollow<?php endif; ?>">
    <?php echo $text; ?>
    <?php if($icon != "none"): ?>
      <i class="button__icon icon-<?php echo $icon; ?>"></i>
    <?php endif; ?>
  </a>
</div>
