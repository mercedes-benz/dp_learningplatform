<?php

vc_map([
  "name" => __("Bild/Text", "dp"),
  "base" => "dp_image_text",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "class" => "",
      "heading" => __("Style", "dp"),
      "param_name" => "style",
      "description" => __("Color Style", "dp"),
      "value" => [
        __("Cyan", "dp") => "cyan",
        __("Purple", "dp") => "purple",
      ]
    ],
    [
      "type" => "attach_image",
      "holder" => "hidden",
      "heading" => __("Background image", "dp"),
      "param_name" => "background_image",
    ],
    [
      "type" => "textfield",
      "holder" => "div",
      "heading" => __("Headline", "dp"),
      "param_name" => "headline",
    ],
    [
      "type" => "textarea_html",
      "holder" => "hidden",
      "heading" => __("Content", "dp"),
      "param_name" => "content",
    ]
  ],
]);

class WPBakeryShortCode_DP_Image_Text extends WPBakeryShortCode {}
