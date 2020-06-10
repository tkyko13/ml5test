// 通話相手の顔を北斎っぽいテイストに

let capture;
let theirVideo;
let style;
let resultImg;
let img;

function setup() {
  createCanvas(640, 200); //canvas作成

  capture = createCapture({
    video: { width: 640, height: 480 },
    audio: false,
  });
  capture.hide(); //キャンバスで描くので非表示
  capture.size(160, 120); //重いので小さく

  resultImg = createImg("");
  resultImg.hide(); //キャンバスで描くので非表示

  //自分のにかけるときはここ
  // style = ml5.styleTransfer("models/wave", capture, function () {
  //   print("loaded");
  //   startTransfer();
  // });

  // skywayのインスタンスを作成
  let peer = new Peer({
    key: "51af5899-2541-43dc-acff-95976dccb605",
  });
  // skywayでドメインを許可していれば実行される
  peer.on("open", () => {
    console.log("open! id=" + peer.id);
    createP("Your id: " + peer.id);
  });

  // id入力タグの生成
  let idInput = createInput("");

  // 送信ボタンの生成
  createButton("Call").mousePressed(() => {
    // ボタンが押されたら
    const callId = idInput.value(); //id入力欄の値を取得
    console.log("call! id=" + peer.id);
    const call = peer.call(callId, capture.elt.srcObject); //id先を呼び出し
    addVideo(call);
  });

  // // 相手から呼び出された実行される
  peer.on("call", (call) => {
    console.log("be called!");
    call.answer(capture.elt.srcObject); //呼び出し相手に対して返す
    addVideo(call);
  });

  // 相手の映像を追加処理
  function addVideo(call) {
    call.on("stream", (theirStream) => {
      console.log("stream!");
      //相手のビデオを作成
      theirVideo = createVideo();
      theirVideo.elt.autoplay = true;
      theirVideo.elt.srcObject = theirStream;
      theirVideo.size(160, 120); //重いので小さく
      theirVideo.hide(); //キャンバスで描くので非表示

      //相手側のビデオ映像に対してstyle変換
      style = ml5.styleTransfer("models/wave", theirVideo, function () {
        print("loaded");
        startTransfer();
      });
    });
  }
}

function draw() {
  image(capture, 0, 0);
  // if (theirVideo) image(theirVideo, 160, 0);
  image(resultImg, 160, 0);
}

function startTransfer() {
  style.transfer(function (err, res) {
    // print(err, res);
    // resultImg.src = res.src;
    resultImg.attribute("src", res.src);
    startTransfer();
  });
}
