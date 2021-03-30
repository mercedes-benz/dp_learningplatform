<?php

vc_map([
  "name" => __("Include academy article", "dp"),
  "base" => "dp_include_learning_article",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "autocomplete",
      "holder" => "hidden",
      "heading" => __("Article", "dp"),
      "param_name" => "id",
      "settings" => [
        "groups" => true,
      ],
    ]
  ]
]);

class WPBakeryShortCode_DP_Include_Learning_Article extends WPBakeryShortCode {}
