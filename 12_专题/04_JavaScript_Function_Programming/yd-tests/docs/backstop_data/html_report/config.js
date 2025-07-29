report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "../../../backstop_data/bitmaps_reference/qq_map_0_document_0_iphone.png",
        "test": "../../../backstop_data/bitmaps_test/20201022-210347/qq_map_0_document_0_iphone.png",
        "selector": "document",
        "fileName": "qq_map_0_document_0_iphone.png",
        "label": "map",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://map.qq.com/m/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "iphone",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "2.45",
          "analysisTime": 42
        },
        "diffImage": "../../../backstop_data/bitmaps_test/20201022-210347/failed_diff_qq_map_0_document_0_iphone.png"
      },
      "status": "fail"
    },
    {
      "pair": {
        "reference": "../../../backstop_data/bitmaps_reference/qq_map_0_document_1_tablet.png",
        "test": "../../../backstop_data/bitmaps_test/20201022-210347/qq_map_0_document_1_tablet.png",
        "selector": "document",
        "fileName": "qq_map_0_document_1_tablet.png",
        "label": "map",
        "requireSameDimensions": true,
        "misMatchThreshold": 0.1,
        "url": "https://map.qq.com/m/",
        "referenceUrl": "",
        "expect": 0,
        "viewportLabel": "tablet",
        "error": "Reference file not found /Users/yuanzhijia/Desktop/yd-tests/backstop_data/bitmaps_reference/qq_map_0_document_1_tablet.png"
      },
      "status": "fail"
    }
  ],
  "id": "qq"
});