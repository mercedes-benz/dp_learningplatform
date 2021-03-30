<?php

$galID = 'gallery-' . uniqid();
$images = [];
$image_ids = explode(",", $atts["images"]);
$items = count($image_ids);
$i = 0;
$len = count($image_ids);
?>
<div id="<?php echo $galID; ?>" class="gallery gallery--items-<?php echo $items; ?>">
  <ul>
    <?php foreach($image_ids as $key=>$image_id):
            $image_thumb = wp_get_attachment_image_url($image_id, "dp-gallery");
            $image_large = wp_get_attachment_image_url($image_id, "large");
            $image_meta = wp_get_attachment_metadata($image_id);
            $image_title = get_the_title($image_id);
    ?>
        <li class="gallery__item">
          <a class="gallery__link" href="<?php echo $image_large; ?>">
            <img id="<?= $galID; ?>-thumb<?php echo $key; ?>" class="gallery__image"
              <?php if ($i == 0): ?>
                data-prev="<?= $galID; ?>-thumb<?php echo $len - 1; ?>"
              <?php else: ?>
                data-prev="<?= $galID; ?>-thumb<?php echo $key - 1; ?>"
              <?php endif; ?>
              <?php if ($i == $len - 1): ?>
                data-next="<?= $galID; ?>-thumb0"
              <?php else: ?>
                data-next="<?= $galID; ?>-thumb<?php echo $key + 1; ?>"
              <?php endif; ?>
              data-src="<?php echo $image_large; ?>" src="<?php echo $image_thumb; ?>" alt="<?php echo $image_title; ?>" />
          </a>
        </li>
        <?php $i++; ?>
    <?php endforeach; ?>
  </ul>
</div>
