<?php

extract(shortcode_atts([
  "id" => "",
], $atts));

if(empty(trim($id))) return;

$post = get_post($id);
$content = ($post !== null && $post->post_content) ? $post->post_content : "";
?>

<div class="include-article include-learning-article">
<?php echo apply_filters("the_content", $content); ?>
</div>
