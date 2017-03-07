---
layout: default
markdown: kramdown
permalink: demo/
---
# Tanks! Demo

[![](screenshot.jpg)](Tanks/)
<div id="play-wasm" class="btn-block">
  <a class="btn btn-primary" href="Tanks/" role="button">Play WebAssembly</a>
</div>
<div id="play-asm" class="btn-block hide-btn-block">
  <a class="btn hide-asm-support" href="Tanks/" role="button">Play asm.js fallback</a>
  <span class="btn-comment btn-comment-error hide-asm-support">Your browser doesn't support WebAssembly yet. <a href="/roadmap/">Learn more</a></span>
</div>

This is a demo of [Tanks!, a Unity tutorial game](https://unity3d.com/learn/tutorials/projects/tanks-tutorial) which has been exported to WebAssembly. Drive tanks around the sandbox and shoot the enemy tank in this local multiplayer game. Blue Tank movement is controlled by W, A, S, D keys and firing by the spacebar. Red Tank movement is controlled by the arrow keys, and firing by Enter.

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
