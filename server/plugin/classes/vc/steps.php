<?php

vc_map([
  "name" => __("Step-by-Step", "dp"),
  "base" => "dp_steps",
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
        __("White", "dp") => "white",
      ]
    ],
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "class" => "",
      "heading" => __("Icon", "dp"),
      "param_name" => "icon",
      "description" => __("Icon of the listitem", "dp"),
      "value" => [
        __("Count", "dp") => "count",
        __("Star", "dp") => "star-circle",
      ]
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
          "class" => "",
          "heading" => __("Headline", "dp"),
          "param_name" => "headline",
        ],
        [
          "type" => "textfield",
          "holder" => "div",
          "value" => "",
          "heading" => __("List item", "dp"),
          "param_name" => "text_col_item",
        ]
      ]
    ]
  ]
]);

class WPBakeryShortCode_DP_Steps extends WPBakeryShortCode {}
