// 全局变量
let recognition;
let preText = ''; // 用于保存之前的识别文本
let preCount = 0; // 用于保存“然后”的出现次数
let showCount 

// 获取DOM元素
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const textOutput = document.getElementById('text-output');
const counter = document.getElementById('counter');

// 开始识别按钮的点击事件
startBtn.addEventListener('click', () => {
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

         // 使用正则表达式查找“然后”
        const thenRegex = /然后/g;
        const matches = fullTranscript.match(thenRegex);
        const currentCount = matches ? matches.length : 0; // 如果没有匹配项，则计数为0
        showCount = currentCount + preCount
        // 高亮显示特定词汇
        const highlightedText = fullTranscript.replace(/然后/g, '<span class="highlight">然后</span>');

        // 更新显示的文本
        textOutput.innerHTML = preText + highlightedText + '。';

        // <div id="counter">“然后”出现的总次数：0</div>
        counter.innerHTML = `“然后”出现的总次数：${showCount}`;
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
});

// 停止识别按钮的点击事件
stopBtn.addEventListener('click', () => {
    if (recognition) {
        console.log('Stopping recognition');
        recognition.stop();
        recognition = null;
    }
});
