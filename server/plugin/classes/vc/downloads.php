<?php

vc_map([
  "name" => __("Downloads", "dp"),
  "base" => "dp_downloads",
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
      "type" => "textfield",
      "holder" => "div",
      "class" => "",
      "heading" => __("Headline", "dp"),
      "param_name" => "headline",
    ],
    [
      "type" => "param_group",
      "value" => "",
      "param_name" => "text_col",
      "heading" => __("Text Column", "dp"),
      "params" => [
        [
          "type" => "textfield",
          "holder" => "div",
          "value" => "",
          "heading" => __("List item", "dp"),
          "param_name" => "text_col_item",
        ],
        [
          "type" => "file_picker",
          "holder" => "hidden",
          "heading" => __("Attach Media", "dp"),
          "param_name" => "file_picker",
        ]
      ]
    ]
  ]
]);

class WPBakeryShortCode_DP_Downloads extends WPBakeryShortCode {}
