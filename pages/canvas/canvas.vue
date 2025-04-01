<template>
  <view class="container">
    <view class="toolbar">
      <button @click="chooseTemplate">选择模板</button>
      <button @click="setMode('line')">画直线</button>
      <button @click="setMode('curve')">画曲线</button>
      <button @click="setMode('rect')">画矩形</button>
      <button @click="setMode('text')">添加文字</button>
    </view>

    <canvas
      canvas-id="myCanvas"
      id="myCanvas"
      class="canvas"
      disable-scroll="true"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const canvasId = 'myCanvas';
const ctx = ref(null);
const mode = ref('line'); // 绘制模式
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const drawing = ref(false);
const template = ref(''); // 模板图片路径
const curvePoints = ref([]); // 记录曲线的点

onMounted(() => {
  ctx.value = uni.createCanvasContext(canvasId);
});

// 选择模板
const chooseTemplate = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      template.value = res.tempFilePaths[0];
      drawTemplate();
    }
  });
};

// 绘制模板背景
const drawTemplate = () => {
  if (template.value) {
    ctx.value.drawImage(template.value, 0, 0, 300, 400);
    ctx.value.draw();
  }
};

// 设置绘制模式
const setMode = (newMode) => {
  mode.value = newMode;
};

// **开始绘制**
const touchStart = (e) => {
  const { x, y } = e.touches[0];
  startX.value = x;
  startY.value = y;
  drawing.value = true;

  if (mode.value === 'curve') {
    curvePoints.value = [{ x, y }];
  }
};

// **预览绘制**
const touchMove = (e) => {
  if (!drawing.value) return;

  const { x, y } = e.touches[0];
  currentX.value = x;
  currentY.value = y;

  // 清空画布并重绘已有内容
  ctx.value.draw(true);

  ctx.value.setStrokeStyle('#000');
  ctx.value.setLineWidth(2);

  if (mode.value === 'line') {
    ctx.value.beginPath();
    ctx.value.moveTo(startX.value, startY.value);
    ctx.value.lineTo(currentX.value, currentY.value);
    ctx.value.stroke();
  } else if (mode.value === 'rect') {
    ctx.value.beginPath();
    ctx.value.rect(startX.value, startY.value, currentX.value - startX.value, currentY.value - startY.value);
    ctx.value.stroke();
  } else if (mode.value === 'curve') {
    curvePoints.value.push({ x, y });
    ctx.value.beginPath();
    ctx.value.moveTo(curvePoints.value[0].x, curvePoints.value[0].y);
    curvePoints.value.forEach((point) => {
      ctx.value.lineTo(point.x, point.y);
    });
    ctx.value.stroke();
  }

  ctx.value.draw(false);
};

// **最终绘制**
const touchEnd = () => {
  if (!drawing.value) return;
  drawing.value = false;

  ctx.value.draw(true);

  ctx.value.setStrokeStyle('#000');
  ctx.value.setLineWidth(2);

  if (mode.value === 'line') {
    ctx.value.beginPath();
    ctx.value.moveTo(startX.value, startY.value);
    ctx.value.lineTo(currentX.value, currentY.value);
    ctx.value.stroke();
  } else if (mode.value === 'rect') {
    ctx.value.beginPath();
    ctx.value.rect(startX.value, startY.value, currentX.value - startX.value, currentY.value - startY.value);
    ctx.value.stroke();
  } else if (mode.value === 'curve') {
    ctx.value.beginPath();
    ctx.value.moveTo(curvePoints.value[0].x, curvePoints.value[0].y);
    curvePoints.value.forEach((point) => {
      ctx.value.lineTo(point.x, point.y);
    });
    ctx.value.stroke();
  } else if (mode.value === 'text') {
    ctx.value.setFontSize(20);
    ctx.value.fillText('Hello', startX.value, startY.value);
  }

  ctx.value.draw(true);
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toolbar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
}

.canvas {
  width: 300px;
  height: 400px;
  background-color: #f8f8f8;
}
</style>
