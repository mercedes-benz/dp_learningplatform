<?php

vc_map([
  "name" => __("Hero", "dp"),
  "base" => "dp_hero",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
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
    ],
    [
      "type" => "vc_link",
      "holder" => "hidden",
      "heading" => __("Button link", "dp"),
      "param_name" => "button",
    ],
    [
      "type" => "textfield",
      "holder" => "hidden",
      "heading" => __("Button text", "dp"),
      "param_name" => "button_text",
    ],
    [
      "type" => "attach_image",
      "holder" => "hidden",
      "heading" => __("Background image", "dp"),
      "param_name" => "background_image",
    ]
  ],
]);

class WPBakeryShortCode_DP_Hero extends WPBakeryShortCode {}
