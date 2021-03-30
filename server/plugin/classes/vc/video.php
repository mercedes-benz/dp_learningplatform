<?php

vc_map([
  "name" => __("Video", "dp"),
  "base" => "dp_video",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "textfield",
      "holder" => "div",
      "heading" => __("Title", "dp"),
      "param_name" => "title",
    ],
    [
      "type" => "attach_video",
      "holder" => "hidden",
      "heading" => __("Video (MP4)", "dp"),
      "param_name" => "video_src",
    ],
    [
      "type" => "checkbox",
      "holder" => "hidden",
      "heading" => __("Mejs player?", "dp"),
      "param_name" => "mejs_player",
    ],
    [
      "type" => "attach_image",
      "holder" => "hidden",
      "heading" => __("Poster", "dp"),
      "param_name" => "poster",
    ],
  ]
]);

class WPBakeryShortCode_DP_Video extends WPBakeryShortCode {}
