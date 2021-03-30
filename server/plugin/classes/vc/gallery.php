<?php

vc_map([
  "name" => __("Gallery", "dp"),
  "base" => "dp_gallery",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "attach_images",
      "holder" => "hidden",
      "heading" => __("Images", "dp"),
      "param_name" => "images",
    ]
  ]
]);

class WPBakeryShortCode_DP_Gallery extends WPBakeryShortCode {}
