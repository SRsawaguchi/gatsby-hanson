# Gatsby Hanson

## gatsby new
以下のサイトを参考にしながら進めていく。  
https://www.gatsbyjs.com/docs/tutorial/part-zero/

まずは、Gatsbyのアプリを作成する。  
以下のコマンドを実行して、`node`のコンテナを起動する。  


```
docker run --rm -it -w="/code" -v $(pwd):/code node:14.15.3-alpine3.10 /bin/sh
```

コンテナの中で、以下のコマンドを実行する。  

```
apk add git
npm install -g gatsby-cli@2.17.0
gatsby new hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world
```

そうすると、ホストマシン上にも`hello-world`ディレクトリが作成される。  

コンテナ内で以下のコマンドを実行すると、初期化したアプリを実行することができる。  

## アプリの起動
先ほどのコンテナを停止して、今度はdocker-composeを利用して起動できる。  

```
docker-compose up
```

ビルドに成功したら、ブラウザで以下のURLにアクセスする。  
http://localhost:8000  


※`docker-compose.yaml`にあるように、以下のように`--host`を指定しないとホストマシンからアクセスできないので注意。  

```
gatsby develop --host=0.0.0.0
```

## ポイント

### 新しいページの追加
`src/pages`ディレクトリの中に、`*.js`を追加する。  
例えば、`about`ページを作成するなら、`src/pages/about.js`とする。  

このファイルの中身はReactコンポーネント。  
以下のようになる。  

```javascript
import React from "react"

export default function About() {
  return (
    <div style={{}}>
      <h1>About Gatsby</h1>
      <p>Such wow. Very React.</p>
    </div>
  )
}

```

このファイルを追加するだけで、`/about`にアクセスできるようになる。  
例えば、以下のようなURLになる。  

http://localhost:8000/about
