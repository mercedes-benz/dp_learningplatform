<?php

vc_map([
  "name" => __("Zitat", "dp"),
  "base" => "dp_quote",
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
    ]
  ]
]);

class WPBakeryShortCode_DP_Quote extends WPBakeryShortCode {}
