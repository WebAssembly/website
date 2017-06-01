---
layout: default
markdown: kramdown
permalink: demo/
---
# Tanks! Demo

[![](screenshot.jpg)](Tanks/)
<div id="play-wasm" class="btn-block">
  <a class="btn btn-primary" href="Tanks/" role="button">体验 WebAssembly</a>
</div>
<div id="play-asm" class="btn-block hide-btn-block">
  <a class="btn hide-asm-support" href="Tanks/" role="button">体验 asm.js 降级版本</a>
  <span class="btn-comment btn-comment-error hide-asm-support">你的浏览器不支持 WebAssembly. <a href="/roadmap/">查看更多</a></span>
</div>

这是 [坦克!, Unity 教程中的一个游戏](https://unity3d.com/learn/tutorials/projects/tanks-tutorial) 导出成 WebAssembly 的游戏. 操作坦克来击杀在这个地图中的其他坦克. 蓝色坦克通过W、S、A、D操作移动，空格键发射炮弹。红色弹可通过上、下、左、右移动，回车发射炮弹。

<script type="text/javascript" >
(function() {
  // detect WebAssembly support
  var support = (typeof WebAssembly === 'object');
  
  // toggle button wasm/asm.js button visibility
  if (!support) {
    var wasmButton = document.getElementById('play-wasm');
    wasmButton.className += ' hide-btn-block';
    var asmButton = document.getElementById('play-asm');
    asmButton.className = asmButton.className.replace(/(?:^|\s)hide-btn-block(?!\S)/, '');
  }
})();
</script>
