---
date: "2023-01-09 15:28"
tags:
  - プログラミング
  - Twitter
---

ffmpegで↓のコマンドを叩けば良い。

```sh
ffmpeg -loop 1 -i image.png -i sound.aifc -c:a aac -c:v libx264 -pix_fmt yuv420p -shortest out.mp4
```

`-loop 1 -i image.png` あたりが静止画から動画を作るコマンド。

`-shortest` がないと動画時間が無限の動画を生成しようとするっぽい。
忘れないように注意。

音声コーデックは元からaacなら `-c:a copy` で良さそう。

動画コーデックも同様に元からx264なら `-c:v copy` で良さそう。

`-pix_fmt yuv420p` がtwitter特有の記述。
YUV420pじゃないとダメらしい。
これがないと、動画をアップロードしてもツイートが完了しないので注意。

参考サイトは
[この辺](https://kivantium.hateblo.jp/entry/2017/07/16/160859)
。
