<?php

function get_image_sizes() {
  global $_wp_additional_image_sizes;

  $sizes = [];

  foreach(get_intermediate_image_sizes() as $_size) {
    if (in_array($_size, array('thumbnail', 'medium', 'medium_large', 'large'))) {
      $sizes[$_size . " (" . get_option("{$_size}_size_w") . "x" . get_option("{$_size}_size_h") . ")"]  = $_size;
    } elseif (isset($_wp_additional_image_sizes[$_size])) {
      $sizes[$_size . " (" . $_wp_additional_image_sizes[ $_size ]['width'] . "x" . $_wp_additional_image_sizes[ $_size ]['height'] . ")"]  = $_size;
    }
  }

  $sizes[__("Full width", "dp")] = "full";

  return $sizes;
}

vc_map([
  "name" => __("Image", "dp"),
  "base" => "dp_image",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "attach_image",
      "holder" => "hidden",
      "heading" => __("Image", "dp"),
      "param_name" => "image",
    ],
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "heading" => __("Size", "dp"),
      "param_name" => "size",
      "value" => get_image_sizes(),
    ],
    [
      "type" => "checkbox",
      "holder" => "hidden",
      "heading" => __("Magnify on click?", "dp"),
      "param_name" => "magnify_on_click",
    ]
  ]
]);

class WPBakeryShortCode_DP_Image extends WPBakeryShortCode {}
