# Decoorease

[Decoorease](http://tris5572.github.io/decoorease/)は、GPXファイルの座標数を削減するWebアプリです。何らかの理由（デバイスに読み込ませる際に制限がある等）でGPXファイルを小さくしたいときに利用できます。

# 使い方

## 手順

1. ページにアクセスし、GPXファイルをウィンドウにドラッグ&ドロップします。これにより地図上にGPXの座標が表示されます。
2. 画面右のボタン操作によりポイントを削減します。その際、削減方法と閾値を設定できます。
3. 座標数が削減されたGPXファイルをダウンロードします。
4. デバイスに転送するなどして利用します👍

## 削減方法

### 直線削減

連続して直線状に並んだ座標を削減します。直線と判定する角度と、何個までを連続と判定するか（最大で1/n個になるか）の値を設定します。

### 近接削減

近接した座標を削減します。1回の操作で、近接した座標同士の片方を削除します。

近接判定とする距離を設定できますが、非常に簡易的な計算を行っているため誤差があります。当該地点の緯度と座標間の方角により、最大で10%程度のブレが生じます。

## 想定するユースケース

### Ride with GPS でルートを作成し、出力したGPXファイルを削減する。

この場合、デフォルト値のままで直線削減→近接削減を行えば、（ルートの形状にもよりますが）およそ半分の座標数になります。

これが主に想定する使い方です。

### 実際に走行して取得したログのGPXファイルを削減する。

どのデバイスで取得した走行ログかによって大きく左右されますが、直線削減後に複数回の近接削減を行えば、1/4以下にまで削減されます。

# 制限等

GPXファイルの構造を決め打ちしたコードになっているため、ファイルによっては正常に動作しない恐れがあります。
