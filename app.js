// 全局变量
let recognition;
let preText = ''; // 用于保存之前的识别文本
let preCount = 0; // 之前的识别结果中“然后”的次数
let showCount = 0 // 展示中的“然后”的次数
let isRecording = false; // 用于追踪录音状态

let keyWord = '然后'
// 获取DOM元素
// const startBtn = document.getElementById('start-btn');
// const stopBtn = document.getElementById('stop-btn');
const recordBtn = document.getElementById('record-btn'); // 修改为单个按钮

const textOutput = document.getElementById('text-output');
const counter = document.getElementById('counter');

// 开始识别按钮的点击事件
// 更新关键词的函数
function updateKeywordIfNeeded(fullTranscript) {
  
  const switchRegex = /切换(.+?)形态/;
  const switchMatch = fullTranscript.match(switchRegex);
  if (switchMatch && switchMatch[1]) {
    console.log('切换模式');

      keyWord = switchMatch[1];
      preText = '';
      preCount = 0;
    showCount = 0;
    // <h1>然后统计器</h1>
    document.getElementById('title').innerHTML = `${keyWord}统计器`;

      return true; // 返回 true 表示关键词已更新
  }
  return false; // 未更新关键词
}

function startRecord() {
   // 检查浏览器是否支持语音识别
   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
   if (!SpeechRecognition) {
       alert("抱歉，您的浏览器不支持SpeechRecognition。");
       return;
   }
   // 初始化语音识别
   recognition = new SpeechRecognition();
   recognition.lang = 'zh-CN'; // 设置语言为中文
   recognition.interimResults = true; // 设置为返回临时结果
   // 识别结果的回调函数
   recognition.onresult = (event) => {
       console.log('Recognition result');

       let fullTranscript = '';

       // 遍历所有的识别结果并拼接
       for (let i = 0; i < event.results.length; i++) {
           const transcript = event.results[i][0].transcript;
           fullTranscript += transcript;
       }
      // 调用更新关键词的函数
      if (updateKeywordIfNeeded(fullTranscript)) {
            // 如果关键词已更新，重置相关内容
            textOutput.innerHTML = '';
            counter.innerHTML = `“${keyWord}”出现的总次数：0`;
            return; // 直接返回，不处理当前的识别结果
        }

        // 使用正则表达式查找“然后”
        const thenRegex = new RegExp(keyWord, 'g');
     
       const matches = fullTranscript.match(thenRegex);
       const currentCount = matches ? matches.length : 0; // 如果没有匹配项，则计数为0
       showCount = currentCount + preCount
     // 高亮显示特定词汇
     //  const highlightedText = fullTranscript.replace(/然后/g, '<span class="highlight">然后</span>');
        const highlightedText = fullTranscript.replace(thenRegex, '<span class="highlight">' + keyWord + '</span>');

       // 更新显示的文本
       textOutput.innerHTML = preText + highlightedText + '。';

       // <div id="counter">“然后”出现的总次数：0</div>
     //  counter.innerHTML = `“然后”出现的总次数：${showCount}`;
        counter.innerHTML = `“${keyWord}”出现的总次数：${showCount}`;
   };
   // 识别错误的回调函数
   recognition.onerror = (event) => {
       console.error('语音识别错误:', event.error);
   };
   // 识别结束的回调函数
   recognition.onend = () => {
       preText = textOutput.innerHTML;
       preCount = showCount;
       recognition.start(); // 自动重启识别
   };
   console.log('Starting recognition');
   recognition.start(); // 启动识别
}

function  stopRecord() {
    if (recognition) {
        console.log('Stopping recognition');
        recognition.stop();
        recognition = null;
    }
}


function toggleRecord() {
  if (!isRecording) {
    isRecording = true;
    recordBtn.innerHTML = '停止统计';
    recordBtn.classList.add('recording');
      startRecord();
  } else {
    isRecording = false;
    recordBtn.innerHTML = '开始统计';
    recordBtn.classList.remove('recording');
      stopRecord();
  }
}
// startBtn.addEventListener('click', () => {
//   startRecord()
// });
// // 停止识别按钮的点击事件
// stopBtn.addEventListener('click', () => {
//     stopRecord()
// });

// 录音按钮的点击事件
recordBtn.addEventListener('click', () => {
  toggleRecord();
});