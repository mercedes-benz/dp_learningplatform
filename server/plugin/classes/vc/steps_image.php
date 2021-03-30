<?php

vc_map([
  "name" => __("Step-by-Step (image)", "dp"),
  "base" => "dp_steps_image",
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
        __("Purple", "dp") => "purple"
      ]
    ],
    [
      "type" => "param_group",
      "value" => "",
      "param_name" => "text_row",
      "heading" => __("Row", "dp"),
      "params" => [
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
          "type" => "textarea",
          "holder" => "hidden",
          "heading" => __("Content", "dp"),
          "param_name" => "content",
        ]
      ]
    ]
  ]
]);

class WPBakeryShortCode_DP_Steps_Image extends WPBakeryShortCode {}
