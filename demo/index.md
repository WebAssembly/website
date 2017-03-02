---
layout: default
markdown: kramdown
permalink: demo/
---
# Angry Bots Demo
<div markdown="1" id="wasm-fail" class="flash flash-error flash-hide">
  Uh-oh! WebAssembly isn't enabled in this browser. To get an early preview of this experimental technology, at your own risk:

  - on [Chrome](https://www.google.com/chrome/browser/desktop), open `chrome://flags/#enable-webassembly` and enable the switch.
  - on [Firefox Nightly](https://nightly.mozilla.org/), open `about:config` and set `javascript.options.wasm` to `true`.

  See a [preview](http://blogs.windows.com/msedgedev/2016/03/15/previewing-webassembly-experiments) of [Microsoft Edge](https://www.microsoft.com/en-us/windows/microsoft-edge) support and follow [Safari](http://www.apple.com/safari/) support on WebKit's [feature status](https://webkit.org/status/#specification-webassembly) page.
</div>

[![](screenshot.jpg)](AngryBots/)
<a class="btn btn-primary" id="play-wasm" href="AngryBots/" role="button">Play WebAssembly</a>
<a class="btn" href="http://beta.unity3d.com/jonas/AngryBots/" role="button">Play asm.js fallback</a>

This is an experimental demo of Angry Bots, a Unity game which has been ported to WebAssembly. Fight robots and explore a 3D space station with realistic environmental effects in this top-down shooter. Movement is controlled by W, A, S, D or the arrow keys and aiming &amp; firing is controlled by the mouse.

<script type="text/javascript" >
(function() {
  var support = (typeof Wasm === 'object') || (typeof WebAssembly === 'object');
  if (!support) {
    var flash = document.getElementById('wasm-fail');
    flash.className = flash.className.replace(/(?:^|\s)flash-hide(?!\S)/, '');
    var button = document.getElementById('play-wasm');
    button.className += ' disabled';
    button.href = 'javascript:;';
    var link = document.getElementById('pic-link');
    link.className += ' noclick';
    link.href = 'javascript:;';
  }
})();
</script>
