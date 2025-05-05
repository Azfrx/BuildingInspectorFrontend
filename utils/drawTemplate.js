//空心板 实心板
function drawRulerRectTemplate(ctx, {
	logicalWidth = 8,
	logicalHeight = 8,
	unit = 'cm',
}) {
	const showDirectionArrow = true;
	const MAX_DRAW_WIDTH = 800; // 宽高对调
	const MAX_DRAW_HEIGHT = 400;

	// 计算缩放比例（按最大宽度优先）
	let scale = MAX_DRAW_WIDTH / logicalWidth;
	let drawWidth = MAX_DRAW_WIDTH;
	let drawHeight = logicalHeight * scale;

	if (drawHeight > MAX_DRAW_HEIGHT) {
		scale = MAX_DRAW_HEIGHT / logicalHeight;
		drawHeight = MAX_DRAW_HEIGHT;
		drawWidth = logicalWidth * scale;
	}

	// 旋转前先平移坐标原点（注意是以画布中心为轴旋转）
	const centerX = 750 / 2;
	const centerY = 950 / 2;
	ctx.translate(centerX, centerY);
	ctx.rotate(90 * Math.PI / 180); // 顺时针旋转 90°
	ctx.translate(-centerY, -centerX); // 注意这里 y/x 互换

	// 新的起点（旋转后坐标）
	const x = (950 - drawWidth) / 2;
	const y = (750 - drawHeight) / 2;

	const rulerGap = 10;
	const minPixelPerUnit = 40;

	// 刻度步长
	let unitStepX = 1;
	while ((unitStepX * scale) < minPixelPerUnit) unitStepX++;
	let unitStepY = 1;
	while ((unitStepY * scale) < minPixelPerUnit) unitStepY++;

	ctx.setLineWidth(1);
	ctx.setStrokeStyle('#333');
	ctx.setFontSize(12);

	// 主矩形
	ctx.strokeRect(x, y, drawWidth, drawHeight);

	// 上边（逻辑 X 轴）刻度
	ctx.beginPath();
	ctx.moveTo(x, y - rulerGap);
	ctx.lineTo(x + drawWidth, y - rulerGap);
	ctx.stroke();
	for (let i = 0; i <= logicalWidth; i += unitStepX) {
		const px = x + i * scale;
		const py = y - rulerGap;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px, py - 8);
		ctx.stroke();
		ctx.fillText(`${i}${unit}`, px - 10, py - 12);
	}
	if (logicalWidth % unitStepX !== 0) {
		const px = x + logicalWidth * scale;
		const py = y - rulerGap;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px, py - 8);
		ctx.stroke();
		ctx.fillText(`${logicalWidth}${unit}`, px - 10, py - 12);
	}

	// 右边（逻辑 Y 轴）刻度
	ctx.beginPath();
	ctx.moveTo(x + drawWidth + rulerGap, y);
	ctx.lineTo(x + drawWidth + rulerGap, y + drawHeight);
	ctx.stroke();
	for (let i = 0; i <= logicalHeight; i += unitStepY) {
		const py = y + i * scale;
		const px = x + drawWidth + rulerGap;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + 8, py);
		ctx.stroke();
		ctx.fillText(`${i}${unit}`, px + 10, py + 5);
	}
	if (logicalHeight % unitStepY !== 0) {
		const py = y + logicalHeight * scale;
		const px = x + drawWidth + rulerGap;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + 8, py);
		ctx.stroke();
		ctx.fillText(`${logicalHeight}${unit}`, px + 10, py + 5);
	}

	// 方向箭头
	if (showDirectionArrow) {
		const arrowStartX = x + drawWidth / 3;
		const arrowY = y + drawHeight + 10;
		const arrowEndX = x + drawWidth / 3 * 2;

		ctx.beginPath();
		ctx.moveTo(arrowStartX, arrowY);
		ctx.lineTo(arrowEndX, arrowY);
		ctx.lineTo(arrowEndX - 10, arrowY - 5);
		ctx.moveTo(arrowEndX, arrowY);
		ctx.lineTo(arrowEndX - 10, arrowY + 5);
		ctx.stroke();

		ctx.fillText('桩号增大方向', x + drawWidth / 2 - 40, arrowY + 20);
	}
}


//变截面箱梁2
function drawArchBridgeTemplate(ctx, {
	logicalLength = 53, // 总逻辑长度（单位）
	beamCount = 3, // 梁数，最终桥墩数 = 2n + 1
	unit = 'm', // 单位显示
	bigBeamNumber = 36, //大桩号墩
	smallBeamNumber = 35, //小桩号墩
	bridgeFu = 'L' //桥幅
}) {
	ctx.setFontSize(12);
	ctx.setFillStyle('#333');
	const drawWidth = 800 / (beamCount * 2 + 1) < 80 ? (beamCount * 2 + 1) * 80 : 800;
	const drawHeight = beamCount * 20 > 200 ? 200 : beamCount * 20;
	const screenWidth = 750;
	const screenHeight = 950;
	const x = (screenWidth - drawHeight) / 2; //左上角
	const y = (screenHeight - drawWidth) / 2; //左上角
	const intLogicalLength = Math.floor(logicalLength); //取整
	const unitLevel = 25;

	drawRuler(ctx, x + drawHeight + 10, y, x + drawHeight + 10, y + drawWidth, 'row', logicalLength, unitLevel,
		unit)

	//绘制图形
	const everyBeamHeight = (drawHeight * 2 / 3) / beamCount;
	const lineList = [];
	//绘制桥梁的顶部直线
	ctx.beginPath();
	ctx.moveTo(x + drawHeight, y);
	ctx.lineTo(x + drawHeight, y + drawWidth);
	ctx.stroke();
	//绘制桥梁各个桥墩
	ctx.beginPath();
	ctx.moveTo(x + drawHeight, y)
	ctx.lineTo(x, y)
	ctx.stroke()
	lineList.push({
		x: x,
		y: y
	})
	// 计算 beamCount 个递减间距的 x 坐标
	const exponent = 2 // 控制递减程度，越大递减越快
	const xPoints = [lineList[0].x]

	for (let i = 1; i < beamCount; i++) {
		const ratio = 1 - Math.pow(1 - i / (beamCount + 1), exponent)
		const xi = x + drawHeight / 3 * 2 * ratio
		xPoints.push(xi)
	}
	for (let i = 0; i < beamCount; i++) {
		const py = y + (i + 1) * drawWidth / (beamCount * 2 + 1);
		const px = xPoints[i] // 使用计算出的递减分布横坐标
		ctx.beginPath();
		ctx.moveTo(px, py)
		lineList.push({
			x: px,
			y: py
		})
		ctx.lineTo(x + drawHeight, py)
		ctx.stroke()
	}
	const curX = x + (beamCount - 1) * everyBeamHeight;
	for (let i = 0; i < beamCount; i++) {
		const py = y + (i + 1 + beamCount) * drawWidth / (beamCount * 2 + 1);
		ctx.beginPath();
		ctx.moveTo(lineList[beamCount - i].x, py)
		lineList.push({
			x: lineList[beamCount - i].x,
			y: py
		})
		ctx.lineTo(x + drawHeight, py)
		ctx.stroke()
	}
	ctx.beginPath();
	ctx.moveTo(x + drawHeight, y + drawWidth)
	lineList.push({
		x: x,
		y: y + drawWidth
	})
	ctx.lineTo(x, y + drawWidth)
	ctx.stroke()

	drawConvexCurve(ctx, lineList, bigBeamNumber, smallBeamNumber, bridgeFu, beamCount)
};

//绘制刻度尺
function drawRuler(ctx, x, y, endx, endy, direction, logicalLength, unitLevel, unit) {
	//direction是刻度的绘制方向
	//logicalLength是用户定义的逻辑长度 即刻度线上的最大刻度
	//unitLevel是单位级别 即长度是25的n倍，则一个刻度代表多少长度
	const intLogicalLength = Math.floor(logicalLength) //取整
	const unitCount = logicalLength % unitLevel === 0 ? logicalLength / unitLevel : Math.floor(logicalLength /
		unitLevel) + 1;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(endx, endy);
	ctx.stroke();
	//如果觉得最后一步为了避免文字覆盖导致的步长太长，就添加一个判断 判断intLogicalLength / unitCount能否整除
	for (let i = 0; i <= intLogicalLength / unitCount - 1; i++) {
		let text;
		let textX;
		let textY;
		if (direction === 'colunm') {
			const longth = endx - x;
			//倾斜时的偏移量
			const oversetY = (endy - y) / (intLogicalLength / unitCount);
			const px = x + i * (longth / (intLogicalLength / unitCount));
			ctx.beginPath();
			ctx.moveTo(px, y + oversetY * i)
			ctx.lineTo(px, y + 8 + oversetY * i)
			ctx.stroke()
			// 旋转文字，让它横向显示
			text = `${i * unitCount}${unit}`;
			textX = px - 10;
			textY = y + 15 + oversetY * i;
		} else {
			const longth = endy - y;
			//倾斜时的偏移量
			const oversetX = (endx - x) / (intLogicalLength / unitCount);
			const py = y + i * (longth / (intLogicalLength / unitCount));
			ctx.beginPath();
			ctx.moveTo(x + oversetX, py)
			ctx.lineTo(x + 8 + oversetX, py)
			ctx.stroke()
			// 旋转文字，让它横向显示
			text = `${i * unitCount}${unit}`;
			textX = x + 15 + oversetX;
			textY = py - 10;
		}

		ctx.save(); // 保存当前状态
		ctx.translate(textX, textY); // 移动到文字起点
		ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
		ctx.fillText(text, 0, 0); // 在旋转后的坐标系下写文字
		ctx.restore(); // 恢复坐标系
	}
	if (true) {
		let text;
		let textX;
		let textY;
		if (direction === 'colunm') {
			ctx.beginPath();
			ctx.moveTo(endx, endy)
			ctx.lineTo(endx, endy + 8)
			ctx.stroke()
			// 旋转文字，让它横向显示
			text = `${logicalLength}${unit}`;
			textX = endx - 10;
			textY = endy + 15;
		} else {
			ctx.beginPath();
			ctx.moveTo(endx, endy)
			ctx.lineTo(endx + 8, endy)
			ctx.stroke()
			// 旋转文字，让它横向显示
			text = `${logicalLength}${unit}`;
			textX = endx + 15;
			textY = endy - 10;
		}
		ctx.save(); // 保存当前状态
		ctx.translate(textX, textY); // 移动到文字起点
		ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
		ctx.fillText(text, 0, 0); // 在旋转后的坐标系下写文字
		ctx.restore(); // 恢复坐标系
	}
}

// //绘制刻度尺
// function drawRuler(ctx, x, y, longth, logicalLength, unitLevel, unit) {
// 	//longth是刻度线的绘制长度
// 	//logicalLength是用户定义的逻辑长度 即刻度线上的最大刻度
// 	//unitLevel是单位级别 即长度是25的n倍，则一个刻度代表多少长度
// 	const intLogicalLength = Math.floor(logicalLength) //取整
// 	const unitCount = logicalLength % unitLevel === 0 ? logicalLength / unitLevel : Math.floor(logicalLength /
// 		unitLevel) + 1;
// 	ctx.beginPath();
// 	ctx.moveTo(x, y);
// 	ctx.lineTo(x, y + longth);
// 	ctx.stroke();
// 	//如果觉得最后一步为了避免文字覆盖导致的步长太长，就添加一个判断 判断intLogicalLength / unitCount能否整除
// 	for (let i = 0; i <= intLogicalLength / unitCount - 1; i++) {
// 		const py = y + i * (longth / (intLogicalLength / unitCount));
// 		ctx.beginPath();
// 		ctx.moveTo(x, py)
// 		ctx.lineTo(x + 8, py)
// 		ctx.stroke()

// 		// 旋转文字，让它横向显示
// 		const text = `${i * unitCount}${unit}`;
// 		const textX = x + 15;
// 		const textY = py - 10;

// 		ctx.save(); // 保存当前状态
// 		ctx.translate(textX, textY); // 移动到文字起点
// 		ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
// 		ctx.fillText(text, 0, 0); // 在旋转后的坐标系下写文字
// 		ctx.restore(); // 恢复坐标系
// 	}
// 	if (true) {
// 		const py = y + longth;
// 		ctx.beginPath();
// 		ctx.moveTo(x, py)
// 		ctx.lineTo(x + 8, py)
// 		ctx.stroke()

// 		const text = `${logicalLength}${unit}`;
// 		const textX = x + 15;
// 		const textY = py - 10;

// 		ctx.save(); // 保存当前状态
// 		ctx.translate(textX, textY); // 移动到文字起点
// 		ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
// 		ctx.fillText(text, 0, 0); // 在旋转后的坐标系下写文字
// 		ctx.restore(); // 恢复坐标系
// 	}
// }

function drawConvexCurve(ctx, points, bigBeamNumber, smallBeamNumber, bridgeFu, beamCount) {
	if (!points || points.length < 2) return;

	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) {
		const text =
			`${bridgeFu}${bigBeamNumber}-${i>beamCount?bigBeamNumber:smallBeamNumber}-${i-1>beamCount?beamCount*2-i+1:i-1}#`;
		const textX = points[i - 1].x - 20;
		const textY = points[i - 1].y - 20;

		ctx.save(); // 保存当前状态
		ctx.translate(textX, textY); // 移动到文字起点
		ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
		ctx.fillText(text, 0, 0); // 在旋转后的坐标系下写文字
		ctx.restore(); // 恢复坐标系
	}

	//插入一个中间点 防止中间是直线
	// const middleIndex = points.length / 2;
	// points.splice(points.length / 2, 0, {
	// 	x: points[middleIndex].x + 4,
	// 	y: (points[middleIndex - 1].y + points[middleIndex].y) / 2
	// });

	for (let i = 1; i < points.length; i++) {
		const p0 = points[i - 1]; // 上一个点
		const p1 = points[i]; // 当前点
		const p2 = points[i + 1] || p1; // 下一个点（防止越界）

		// 计算当前曲线段的控制点，保持凸性
		const cp1x = p0.x + (p1.x - p0.x) / 4;
		const cp1y = p0.y + (p1.y - p0.y) / 4;
		const cp2x = p1.x - (p2.x - p1.x) / 4;
		const cp2y = p1.y - (p2.y - p1.y) / 4;

		// 绘制贝塞尔曲线，确保每段曲线都是凸形的
		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y);
	}

	ctx.stroke();
}

//空心板 实心板 4
function drawRulerRectTemplate4(ctx, {
	logicalWidth = 12,
	bigBeamNumber = 1,
	beamCount = 8,
	bridgeFu = 'L',
	unit = 'm',
}) {
	ctx.setFontSize(12);
	ctx.setFillStyle('#333');
	const miniRectHeight = 50;
	const drawWidth = 600;
	const drawHeight = miniRectHeight * beamCount;
	const overSetY = 50;
	const x = 100;
	const y = 950 - drawHeight > 0 ? (950 - drawHeight) / 2 : 50;
	//绘制外面的平行四边形
	ctx.beginPath();
	//上
	ctx.moveTo(x, y);
	ctx.lineTo(x + drawWidth, y + overSetY);
	//左
	ctx.moveTo(x, y);
	ctx.lineTo(x, y + drawHeight);
	//下
	ctx.moveTo(x, y + drawHeight);
	ctx.lineTo(x + drawWidth, y + drawHeight + overSetY);
	//右
	ctx.moveTo(x + drawWidth, y + overSetY);
	ctx.lineTo(x + drawWidth, y + drawHeight + overSetY);
	ctx.stroke();

	//绘制内部线段 和两侧文字
	for (let i = 1; i <= beamCount; i++) {
		const py = y + i * miniRectHeight;
		ctx.beginPath();
		ctx.moveTo(x, py)
		ctx.lineTo(x + drawWidth, py + overSetY)
		ctx.stroke()
		const text = `${bridgeFu}${bigBeamNumber}-${i}`;

		ctx.save(); // 保存当前状态
		ctx.translate(x + drawWidth + 10, py + overSetY - 34); // 移动到文字起点
		ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
		ctx.fillText(text, 0, 0); // 在旋转后的坐标系下写文字
		ctx.restore(); // 恢复坐标系
	}
	for (let i = 1; i < beamCount; i++) {
		const py = y + i * miniRectHeight;
		const text = `${bridgeFu}${bigBeamNumber}-${i}`;
		ctx.save(); // 保存当前状态
		ctx.translate(x - 16, py - 16); // 移动到文字起点
		ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
		ctx.fillText(text, 0, 0); // 在旋转后的坐标系下写文字
		ctx.restore(); // 恢复坐标系
	}
	//铰缝编号
	ctx.save(); // 保存当前状态
	ctx.translate(x - 40, y + drawHeight / 2 - 24); // 移动到文字起点
	ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
	ctx.fillText('铰缝编号', 0, 0); // 在旋转后的坐标系下写文字
	ctx.restore(); // 恢复坐标系
	//空心板编号
	ctx.save(); // 保存当前状态
	ctx.translate(x + drawWidth + 30, y + overSetY + drawHeight / 2 - 20); // 移动到文字起点
	ctx.rotate(90 * Math.PI / 180); // 旋转 90 度，让文字横着写
	ctx.fillText('铰缝编号', 0, 0); // 在旋转后的坐标系下写文字
	ctx.restore(); // 恢复坐标系

	// const rulerLongth = Math.hypot(drawWidth, overSetY);
	//绘制刻度
	drawRuler(ctx, x + drawWidth, y + drawHeight + overSetY + 10, x, y + drawHeight + 10, 'colunm', logicalWidth,
		20, unit);
}


export {
	drawRulerRectTemplate,
	drawArchBridgeTemplate,
	drawRulerRectTemplate4
}