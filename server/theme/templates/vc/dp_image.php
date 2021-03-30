<?php
extract(shortcode_atts([
  "image" => false,
  "size" => "thumbnail",
  "magnify_on_click" => ""
], $atts));

$image_thumb = wp_get_attachment_image_url($image, $size);
$image_title = get_the_title($image);
$image_sizes = wp_get_attachment_image_src($image, "large");
if($magnify_on_click == "true") $image_large = wp_get_attachment_image_url($image, "large");
?>
<div class="image image--aligned-center">
  <?php if($magnify_on_click == "true"): ?>
  <a class="image__link" href="<?php echo $image_large; ?>" style="max-width:<?php echo $image_sizes[1]; ?>px" data-width="<?php echo $image_sizes[1]; ?>" data-height="<?php echo $image_sizes[2]; ?>">
    <img width="<?php echo $image_sizes[1]; ?>" height="<?php echo $image_sizes[2]; ?>" src="<?php echo $image_thumb; ?>" style="max-width:<?php echo $image_sizes[1]; ?>px" alt="<?php echo $image_title; ?>" />
  </a>
  <?php else: ?>
  <img src="<?php echo $image_thumb; ?>" style="max-width:<?php echo $image_sizes[1]; ?>px" alt="<?php echo $image_title; ?>" />
  <?php endif; ?>
</div>
